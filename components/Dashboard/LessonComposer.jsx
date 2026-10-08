"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Button, IconButton, MenuItem, Tab, Tabs, TextField, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import { toast } from "react-toastify";
import { fieldSx, ink, muted, pillButton, primary, primaryHover } from "@/components/AuthFrame";
import RichTextField from "@/components/Dashboard/RichTextField";
import { loadLesson, removeStoredFile, saveLesson, uploadCurriculumFile } from "@/lib/curriculum";
import { DIFFICULTIES, emptyQuestion, newBlock, youtubeId } from "@/lib/curriculumFormat";

const TABS = [
  ["text", "Text"],
  ["image", "Image"],
  ["video", "Video"],
  ["pdf", "PDF"],
  ["quiz", "Quiz"],
];
const MAX_IMAGES = 8;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_PDF_BYTES = 20 * 1024 * 1024;
const pine = "#0D9AAC";

function ofType(blocks, type) {
  if (type === "image" || type === "pdf") {
    return blocks.filter((block) => block.type === type && (block.fileUrl || block.previewUrl));
  }
  return blocks.filter((block) => block.type === type);
}

function lessonBlocks(next) {
  const texts = next.filter((block) => block.type === "text");
  const text = texts.map((block) => block.text || "").filter((value) => value.trim()).join("");
  const textBlock = { ...(texts[0] || newBlock("text")), text };
  return [textBlock, ...next.filter((block) => block.type !== "text")];
}

function revokePreviews(list) {
  list.forEach((block) => {
    if (block.previewUrl) URL.revokeObjectURL(block.previewUrl);
  });
}

export default function LessonComposer({ kind, contentId, courseId, title }) {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState("text");
  const [videoDraft, setVideoDraft] = useState("");
  const savedPaths = useRef(new Set());
  const blocksRef = useRef([]);
  const imageFolder = kind === "class" ? "ClassImages" : "CourseImages";
  const pdfFolder = kind === "class" ? "ClassPDFFiles" : "CoursePDFFiles";

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        setLoading(true);
        const next = await loadLesson(kind, contentId);
        if (ignore) return;
        savedPaths.current = new Set(next.map((block) => block.path).filter(Boolean));
        setBlocks(lessonBlocks(next));
      } catch (error) {
        console.error(error);
        toast.error("Could not open this lesson.");
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    load();
    return () => {
      ignore = true;
      revokePreviews(blocksRef.current);
    };
  }, [kind, contentId]);

  blocksRef.current = blocks;

  const patchBlock = (id, patch) => {
    setBlocks((current) => current.map((block) => (block.id === id ? { ...block, ...patch } : block)));
  };

  const publish = async () => {
    for (const block of blocks) {
      if (block.type === "video" && !block.videoId) {
        toast.error("Add the missing video, or remove it.");
        return;
      }
    }
    const uploadedNow = [];
    let saved = false;
    try {
      setSaving(true);
      const ready = [];
      for (const block of blocks) {
        if ((block.type === "image" || block.type === "pdf") && block.file) {
          const folder = block.type === "image" ? imageFolder : pdfFolder;
          const stored = await uploadCurriculumFile(folder, contentId, block.file);
          uploadedNow.push(stored.path);
          ready.push({ ...block, ...stored, file: null });
        } else {
          ready.push(block);
        }
      }
      await saveLesson(kind, contentId, ready, courseId);
      saved = true;
      const kept = new Set(ready.map((block) => block.path).filter(Boolean));
      await Promise.all(
        [...savedPaths.current].filter((path) => !kept.has(path)).map((path) => removeStoredFile(path).catch((error) => console.error(error)))
      );
      savedPaths.current = kept;
      const next = await loadLesson(kind, contentId);
      revokePreviews(blocks);
      setBlocks(lessonBlocks(next));
      toast.success("Lesson published.");
    } catch (error) {
      console.error(error);
      if (!saved) await Promise.all(uploadedNow.map((path) => removeStoredFile(path).catch(() => {})));
      toast.error(error.message || "Could not publish this lesson.");
    } finally {
      setSaving(false);
    }
  };

  const removeItem = (block) => {
    if (block.previewUrl) URL.revokeObjectURL(block.previewUrl);
    setBlocks((current) => {
      const next = current.filter((item) => item.id !== block.id);
      if (block.type === "image" && block.featured && !next.some((item) => item.type === "image" && item.featured)) {
        const replacement = next.find((item) => item.type === "image" && (item.fileUrl || item.previewUrl));
        if (replacement) return next.map((item) => (item.id === replacement.id ? { ...item, featured: true } : item));
      }
      return next;
    });
  };

  const addImages = (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    const existing = blocks.filter((block) => block.type === "image" && (block.fileUrl || block.previewUrl));
    const room = MAX_IMAGES - existing.length;
    if (room <= 0) {
      toast.error("This lesson already has 8 images.");
      return;
    }
    const chosen = files.slice(0, room);
    if (files.length > room) toast.error(room === 1 ? "Only 1 more image can be added." : `Only ${room} more images can be added.`);
    const created = [];
    let featuredAssigned = existing.some((image) => image.featured);
    chosen.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Choose an image file.");
        return;
      }
      if (file.size > MAX_IMAGE_BYTES) {
        toast.error("Each image must be 5MB or smaller.");
        return;
      }
      created.push({
        ...newBlock("image"),
        name: file.name,
        file,
        previewUrl: URL.createObjectURL(file),
        featured: !featuredAssigned,
      });
      featuredAssigned = true;
    });
    if (created.length) setBlocks((current) => [...current, ...created]);
  };

  const addPdfs = (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    const created = [];
    files.forEach((file) => {
      if (file.type !== "application/pdf") {
        toast.error("Choose a PDF file.");
        return;
      }
      if (file.size > MAX_PDF_BYTES) {
        toast.error("Each PDF must be 20MB or smaller.");
        return;
      }
      created.push({
        ...newBlock("pdf"),
        name: file.name,
        file,
        previewUrl: URL.createObjectURL(file),
      });
    });
    if (created.length) setBlocks((current) => [...current, ...created]);
  };

  const addVideo = () => {
    const id = youtubeId(videoDraft);
    if (!id) {
      toast.error("Paste a YouTube link or video id.");
      return;
    }
    if (blocks.some((block) => block.type === "video" && block.videoId === id)) {
      toast.error("That video is already in this lesson.");
      return;
    }
    setBlocks((current) => [...current, { ...newBlock("video"), videoId: id }]);
    setVideoDraft("");
  };

  const textBlock = blocks.find((block) => block.type === "text");
  const images = ofType(blocks, "image");
  const videos = blocks.filter((block) => block.type === "video" && block.videoId);
  const pdfs = ofType(blocks, "pdf");
  const quizzes = blocks.filter((block) => block.type === "quiz");

  return (
    <Box sx={{ bgcolor: "#fff", borderRadius: "22px", borderTop: `3px solid ${pine}`, p: { xs: 2, md: 3 } }}>
      <Typography sx={{ fontWeight: 700, color: ink, fontSize: 22 }}>{title}</Typography>
      <Typography sx={{ color: muted, fontSize: 14, mt: 0.5, mb: 1 }}>
        Add the lesson in each tab, then publish.
      </Typography>
      <Tabs
        value={tab}
        onChange={(_, value) => setTab(value)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          minHeight: 42,
          mb: 2,
          borderBottom: "1px solid #E2E8EC",
          "& .MuiTab-root": { textTransform: "none", fontWeight: 700, minHeight: 42, color: muted, fontSize: 15 },
          "& .Mui-selected": { color: `${pine} !important` },
          "& .MuiTabs-indicator": { backgroundColor: pine, height: 3 },
        }}
      >
        {TABS.map(([value, label]) => (
          <Tab key={value} value={value} label={label} />
        ))}
      </Tabs>
      {loading ? (
        <Typography sx={{ color: muted }}>Loading lesson…</Typography>
      ) : (
        <>
          {tab === "text" && (
            <RichTextField
              value={textBlock?.text || ""}
              onChange={(text) => {
                if (!textBlock) {
                  setBlocks((current) => [{ ...newBlock("text"), text }, ...current]);
                  return;
                }
                patchBlock(textBlock.id, { text });
              }}
            />
          )}
          {tab === "image" && (
            <Box>
              <Typography sx={{ color: muted, fontSize: 14, mb: 1.5 }}>
                Add up to 8 images, 5MB each. Choose one featured image. Files upload when you publish. {images.length} of 8 added.
              </Typography>
              <Button component="label" disabled={saving || images.length >= MAX_IMAGES} sx={{ ...pillButton, width: "auto", py: 0.7, mb: 2, bgcolor: pine, color: "#fff", "&:hover": { bgcolor: "#0A8494" } }}>
                Add images
                <input hidden type="file" accept="image/*" multiple onChange={addImages} />
              </Button>
              {images.length === 0 ? (
                <EmptyNote>No images yet.</EmptyNote>
              ) : (
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(168px, 1fr))", gap: 1.5 }}>
                  {images.map((image) => (
                    <Box key={image.id} sx={{ borderRadius: "16px", overflow: "hidden", border: image.featured ? `2px solid ${pine}` : "1px solid #E2E8EC", bgcolor: "#fff" }}>
                      <Box sx={{ position: "relative" }}>
                        <Box component="img" src={image.previewUrl || image.fileUrl} alt={image.name || "Lesson image"} sx={{ width: "100%", height: 140, objectFit: "cover", display: "block" }} />
                        <IconButton aria-label={`Remove ${image.name || "image"}`} onClick={() => removeItem(image)} sx={{ position: "absolute", top: 6, right: 6, width: 28, height: 28, bgcolor: "#fff", color: ink, "&:hover": { bgcolor: "#fff" } }}>
                          <Close sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Box>
                      <Box
                        component="button"
                        type="button"
                        onClick={() => setBlocks((current) => current.map((block) => (block.type === "image" ? { ...block, featured: block.id === image.id } : block)))}
                        sx={{ width: "100%", border: 0, py: 0.85, bgcolor: image.featured ? pine : "#F0F3F5", color: image.featured ? "#fff" : ink, font: "inherit", fontWeight: 700, fontSize: 12, cursor: "pointer" }}
                      >
                        {image.featured ? "Featured" : "Make featured"}
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          )}
          {tab === "video" && (
            <Box>
              <Typography sx={{ color: muted, fontSize: 14, mb: 1.5 }}>Add YouTube links. Each one is saved as its own video.</Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                <TextField size="small" fullWidth placeholder="YouTube link" value={videoDraft} onChange={(event) => setVideoDraft(event.target.value)} sx={{ ...fieldSx, maxWidth: 420 }} />
                <Button type="button" onClick={addVideo} sx={{ ...pillButton, width: "auto", py: 0.7, bgcolor: pine, color: "#fff", "&:hover": { bgcolor: "#0A8494" } }}>Add video</Button>
              </Box>
              {videos.length === 0 ? (
                <EmptyNote>No videos yet.</EmptyNote>
              ) : (
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 1.5 }}>
                  {videos.map((video) => (
                    <Box key={video.id} sx={{ position: "relative", borderRadius: "16px", overflow: "hidden", border: "1px solid #E2E8EC" }}>
                      <Box component="img" src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`} alt="" sx={{ width: "100%", height: 124, objectFit: "cover", display: "block", bgcolor: "#0A192F" }} />
                      <IconButton aria-label="Remove video" onClick={() => removeItem(video)} sx={{ position: "absolute", top: 6, right: 6, width: 28, height: 28, bgcolor: "#fff", color: ink, "&:hover": { bgcolor: "#fff" } }}>
                        <Close sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          )}
          {tab === "pdf" && (
            <Box>
              <Typography sx={{ color: muted, fontSize: 14, mb: 1.5 }}>Add PDF files only, up to 20MB each. Files upload when you publish.</Typography>
              <Button component="label" disabled={saving} sx={{ ...pillButton, width: "auto", py: 0.7, mb: 2, bgcolor: pine, color: "#fff", "&:hover": { bgcolor: "#0A8494" } }}>
                Add PDFs
                <input hidden type="file" accept="application/pdf" multiple onChange={addPdfs} />
              </Button>
              {pdfs.length === 0 ? (
                <EmptyNote>No PDFs yet.</EmptyNote>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {pdfs.map((file) => (
                    <Box key={file.id} sx={{ display: "flex", alignItems: "center", gap: 1.5, border: "1px solid #E2E8EC", borderRadius: "16px", px: 1.5, py: 1 }}>
                      <Box component="iframe" title={file.name || "PDF preview"} src={file.previewUrl || file.fileUrl} sx={{ width: 88, height: 72, border: 0, borderRadius: "8px", bgcolor: "#F0F3F5" }} />
                      <Typography sx={{ flex: 1, color: ink, fontWeight: 650, fontSize: 14 }}>{file.name || "PDF"}</Typography>
                      <IconButton aria-label={`Remove ${file.name || "PDF"}`} onClick={() => removeItem(file)}>
                        <Close sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          )}
          {tab === "quiz" && (
            <Box>
              <Button type="button" onClick={() => setBlocks((current) => [...current, newBlock("quiz")])} sx={{ ...pillButton, width: "auto", py: 0.7, mb: 2, bgcolor: pine, color: "#fff", "&:hover": { bgcolor: "#0A8494" } }}>
                Add quiz
              </Button>
              {quizzes.length === 0 ? (
                <EmptyNote>No quizzes yet.</EmptyNote>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  {quizzes.map((quiz, index) => (
                    <Box key={quiz.id} sx={{ border: "1px solid #E2E8EC", borderRadius: "16px", p: 1.5 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                        <Typography sx={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: pine }}>Quiz {index + 1}</Typography>
                        <IconButton aria-label="Remove quiz" onClick={() => removeItem(quiz)}><Close sx={{ fontSize: 18 }} /></IconButton>
                      </Box>
                      <QuizBlock block={quiz} onChange={(patch) => patchBlock(quiz.id, patch)} />
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          )}
        </>
      )}
      <Button
        type="button"
        disabled={saving || loading}
        onClick={publish}
        sx={{ ...pillButton, width: { xs: "100%", sm: "auto" }, minWidth: 180, mt: 2, bgcolor: primary, color: "#fff", "&:hover": { bgcolor: primaryHover, boxShadow: "none" } }}
      >
        {saving ? "Publishing…" : "Publish lesson"}
      </Button>
    </Box>
  );
}

function EmptyNote({ children }) {
  return (
    <Box sx={{ border: "1px dashed #C9D3D9", borderRadius: "16px", p: 3 }}>
      <Typography sx={{ color: muted }}>{children}</Typography>
    </Box>
  );
}

function QuizBlock({ block, onChange }) {
  const questions = block.questions?.length ? block.questions : [emptyQuestion()];
  const updateQuestion = (index, patch) => {
    onChange({
      questions: questions.map((question, questionIndex) =>
        questionIndex === index ? { ...question, ...patch } : question
      ),
    });
  };
  return (
    <Box>
      <TextField size="small" fullWidth placeholder="Quiz title" value={block.quizTitle} onChange={(event) => onChange({ quizTitle: event.target.value })} sx={{ ...fieldSx, mb: 1.5 }} />
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" }, gap: 1, mb: 1.5 }}>
        <TextField select size="small" label="Mode" value={block.mode || "online"} onChange={(event) => onChange({ mode: event.target.value })} sx={fieldSx}>
          <MenuItem value="online">Online</MenuItem>
          <MenuItem value="offline">Offline</MenuItem>
        </TextField>
        <TextField select size="small" label="Level" value={block.difficulty || "beginner"} onChange={(event) => onChange({ difficulty: event.target.value })} sx={fieldSx}>
          {DIFFICULTIES.map((level) => (
            <MenuItem key={level} value={level}>{level}</MenuItem>
          ))}
        </TextField>
        <TextField size="small" label="Minutes" value={block.duration || ""} onChange={(event) => onChange({ duration: event.target.value })} sx={fieldSx} />
      </Box>
      {questions.map((question, index) => (
        <Box key={index} sx={{ borderTop: "1px solid #E2E8EC", pt: 1.5, mt: 1 }}>
          <TextField size="small" fullWidth placeholder={`Question ${index + 1}`} value={question.question} onChange={(event) => updateQuestion(index, { question: event.target.value })} sx={{ ...fieldSx, mb: 1 }} />
          {question.options.map((option, optionIndex) => (
            <TextField
              key={optionIndex}
              size="small"
              fullWidth
              placeholder={`Option ${optionIndex + 1}`}
              value={option}
              onChange={(event) => {
                const options = [...question.options];
                options[optionIndex] = event.target.value;
                updateQuestion(index, { options });
              }}
              sx={{ ...fieldSx, mb: 1 }}
            />
          ))}
          <TextField select size="small" label="Correct option" value={question.correctOption ?? 0} onChange={(event) => updateQuestion(index, { correctOption: Number(event.target.value) })} sx={{ ...fieldSx, mb: 1 }}>
            {question.options.map((option, optionIndex) => (
              <MenuItem key={optionIndex} value={optionIndex}>{option || `Option ${optionIndex + 1}`}</MenuItem>
            ))}
          </TextField>
        </Box>
      ))}
      <Button type="button" onClick={() => onChange({ questions: [...questions, emptyQuestion()] })} sx={{ ...pillButton, width: "auto", py: 0.6, mt: 1, bgcolor: "transparent", color: ink, border: "1px solid #C9D3D9" }}>
        Add question
      </Button>
    </Box>
  );
}
