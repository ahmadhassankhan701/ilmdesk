export const CLASS_LEVELS = [
  { label: "Class", collection: "classes", parentField: null },
  { label: "Subject", collection: "subjects", parentField: "classID" },
  { label: "Module", collection: "branches", parentField: "subjectID" },
  { label: "Chapter", collection: "chapters", parentField: "branchID" },
  { label: "Topic", collection: "topics", parentField: "chapterID" },
];

export const DIFFICULTIES = ["beginner", "intermediate", "expert"];

export function youtubeId(value) {
  const raw = (value || "").trim();
  if (!raw) return "";
  try {
    const url = new URL(raw);
    const host = url.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0] || "";
      return /^[\w-]{6,}$/.test(id) ? id : "";
    }
    if (host === "youtube.com" || host === "m.youtube.com") {
      const fromQuery = url.searchParams.get("v");
      if (fromQuery && /^[\w-]{6,}$/.test(fromQuery)) return fromQuery;
      const parts = url.pathname.split("/").filter(Boolean);
      const marker = parts.findIndex((part) => part === "embed" || part === "shorts");
      const id = marker >= 0 ? parts[marker + 1] : "";
      return id && /^[\w-]{6,}$/.test(id) ? id : "";
    }
    return "";
  } catch {
    return /^[\w-]{6,}$/.test(raw) ? raw : "";
  }
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function theoryForStudents(value, images) {
  const text = (value || "").trim();
  const hasHtml = /<\/?[a-z][\s\S]*>/i.test(text);
  const body = !text
    ? ""
    : hasHtml
      ? text
      : `<p>${escapeHtml(text).replace(/\n/g, "<br />")}</p>`;
  const extra = (images || [])
    .filter((image) => image?.fileUrl && !body.includes(image.fileUrl))
    .map(
      (image) =>
        `<p><img src="${image.fileUrl}" alt="${escapeHtml(image.name || "Image")}" /></p>`
    )
    .join("");
  return `${body}${extra}`;
}

export function emptyQuestion() {
  return { question: "", explanation: "", options: ["", "", "", ""], correctOption: 0 };
}

export function newBlock(type) {
  const id = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  if (type === "image") return { id, type, name: "", path: "", fileUrl: "" };
  if (type === "video") return { id, type, videoId: "" };
  if (type === "pdf") return { id, type, name: "", path: "", fileUrl: "" };
  if (type === "quiz") {
    return {
      id,
      type,
      quizId: "",
      quizTitle: "",
      mode: "online",
      difficulty: "beginner",
      duration: "",
      questions: [emptyQuestion()],
    };
  }
  return { id, type: "text", text: "" };
}

function textHtml(text) {
  const value = (text || "").trim();
  if (!value) return "";
  if (/<\/?[a-z][\s\S]*>/i.test(value)) return value;
  return `<p>${escapeHtml(value).replace(/\n/g, "<br />")}</p>`;
}

function visibleText(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function publishLesson(blocks) {
  const images = [];
  const pdfs = [];
  const youtubeLinks = [];
  const html = [];
  const source = [];
  (blocks || []).forEach((block) => {
    if (block.type === "text") {
      const text = (block.text || "").trim();
      if (!visibleText(text)) return;
      source.push(text);
      html.push(textHtml(text));
    }
    if (block.type === "image" && block.fileUrl) {
      images.push({
        name: block.name || "Image",
        path: block.path || "",
        fileUrl: block.fileUrl,
        featured: Boolean(block.featured),
      });
    }
    if (block.type === "video" && block.videoId) youtubeLinks.push(block.videoId);
    if (block.type === "pdf" && block.fileUrl) {
      pdfs.push({ name: block.name || "PDF", path: block.path || "", fileUrl: block.fileUrl });
    }
  });
  const featuredAt = images.findIndex((image) => image.featured);
  const lead = featuredAt > 0 ? featuredAt : 0;
  const orderedImages = images.map((image, index) => ({ ...image, featured: images.length > 0 && index === lead }));
  if (featuredAt > 0) {
    const [featured] = orderedImages.splice(featuredAt, 1);
    orderedImages.unshift(featured);
  }
  orderedImages.forEach((image) => {
    html.push(`<p><img src="${image.fileUrl}" alt="${escapeHtml(image.name || "Image")}" /></p>`);
  });
  return {
    theorySource: source.join("\n\n"),
    theory: html.join(""),
    images: orderedImages,
    pdfs,
    youtubeLinks,
  };
}

export function blocksFromStored({ theorySource, theory, images, pdfs, youtubeLinks, blocks, quizzes } = {}) {
  if (Array.isArray(blocks) && blocks.length) {
    return blocks.map((block) => {
      if (block.type !== "quiz") return { ...block };
      const quiz = (quizzes || []).find((item) => item.id === block.quizId);
      if (!quiz) {
        return { ...newBlock("quiz"), id: block.id, quizId: block.quizId || "" };
      }
      return {
        id: block.id,
        type: "quiz",
        quizId: quiz.id,
        quizTitle: quiz.quizTitle || "",
        mode: quiz.mode || "online",
        difficulty: quiz.difficulty || "beginner",
        duration: String(quiz.duration || ""),
        questions: quiz.questions?.length ? quiz.questions : [emptyQuestion()],
      };
    });
  }
  const next = [];
  const text = theorySource || theory || "";
  if (text.trim()) next.push({ id: "legacy-text", type: "text", text });
  (images || []).forEach((image, index) => {
    if (image?.fileUrl && text.includes(image.fileUrl)) return;
    next.push({ id: `legacy-image-${index}`, type: "image", name: image.name || "", path: image.path || "", fileUrl: image.fileUrl || "" });
  });
  (youtubeLinks || []).forEach((videoId, index) => {
    next.push({ id: `legacy-video-${index}`, type: "video", videoId });
  });
  (pdfs || []).forEach((file, index) => {
    next.push({ id: `legacy-pdf-${index}`, type: "pdf", name: file.name || "", path: file.path || "", fileUrl: file.fileUrl || "" });
  });
  (quizzes || []).forEach((quiz) => {
    next.push({
      id: `legacy-quiz-${quiz.id}`,
      type: "quiz",
      quizId: quiz.id,
      quizTitle: quiz.quizTitle || "",
      mode: quiz.mode || "online",
      difficulty: quiz.difficulty || "beginner",
      duration: String(quiz.duration || ""),
      questions: quiz.questions?.length ? quiz.questions : [emptyQuestion()],
    });
  });
  return next;
}
