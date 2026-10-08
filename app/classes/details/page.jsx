"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Avatar, Box, Button, Skeleton, TextField, Typography } from "@mui/material";
import { PictureAsPdfOutlined, Star, StarOutline } from "@mui/icons-material";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import moment from "moment";
import renderHTML from "react-render-html";
import { db } from "@/firebase";
import { accent, ink, muted, primary, primaryHover } from "@/lib/brand";
import { pageBackground, pageColumnSx } from "@/lib/pageColumn";
import PageTrail from "@/components/PageTrail";
import PDFModal from "@/components/Modals/PDFModal";
import { wrapImagesInContainer } from "@/utils/helper";
import { reviewFieldErrors } from "@/lib/formValidation";
import { DuplicateReviewError, listApprovedClassReviews, submitClassReview } from "@/lib/classReviews";
import { resolveLessonPath } from "@/lib/classCatalog";
import { chapterAnchor, classAnchor, lessonPath, modulePath, subjectPath } from "@/lib/classPath";
import LegacyClassRedirect from "@/components/Classes/LegacyClassRedirect";

const tabs = ["Theory", "Files", "Videos"];

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    bgcolor: "#F0F3F5",
    "& fieldset": { borderColor: "#E2E8EC" },
    "&:hover fieldset": { borderColor: "#C9D3D9" },
    "&.Mui-focused fieldset": { borderColor: primary },
  },
};

function timeOf(value) {
  return value?.toMillis?.() || value?.getTime?.() || Number(value) || 0;
}

function byCreated(items) {
  return [...items].sort((a, b) => timeOf(a.createdAt) - timeOf(b.createdAt) || String(a.name || "").localeCompare(String(b.name || "")));
}

function visibleText(html) {
  return String(html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stripImages(html) {
  return String(html || "")
    .replace(/<p>\s*(?:<img\b[^>]*>\s*)+<\/p>/gi, "")
    .replace(/<img\b[^>]*>/gi, "");
}

function lessonImages(content) {
  const stored = (Array.isArray(content?.images) ? content.images : [])
    .filter((image) => image?.fileUrl)
    .map((image) => ({ fileUrl: image.fileUrl, name: image.name || "Image", featured: Boolean(image.featured) }));
  if (stored.length) return stored;

  const html = typeof content?.theory === "string" ? content.theory : "";
  const found = [];
  const pattern = /<img\b[^>]*src=["']([^"']+)["'][^>]*>/gi;
  let match = pattern.exec(html);
  while (match) {
    const alt = match[0].match(/alt=["']([^"']*)["']/i);
    found.push({ fileUrl: match[1], name: alt?.[1] || "Image", featured: found.length === 0 });
    match = pattern.exec(html);
  }
  return found;
}

function ImageGallery({ images, active, onPick }) {
  const current = images[active] || images[0];
  return (
    <Box>
      <Box
        component="img"
        src={current.fileUrl}
        alt={current.name || "Lesson image"}
        sx={{
          width: "100%",
          height: { xs: 280, md: 440 },
          objectFit: "contain",
          borderRadius: "18px",
          bgcolor: "#F0F3F5",
          display: "block",
        }}
      />
      {images.length > 1 && (
        <Box sx={{ display: "flex", gap: 1, mt: 1.25, overflowX: "auto", pb: 0.5 }}>
          {images.map((image, index) => {
            const selected = index === active;
            return (
              <Box
                key={`${image.fileUrl}-${index}`}
                component="button"
                type="button"
                aria-label={image.name || `Image ${index + 1}`}
                aria-pressed={selected}
                onClick={() => onPick(index)}
                sx={{
                  p: 0,
                  border: selected ? `2px solid ${primary}` : "2px solid #E2E8EC",
                  borderRadius: "12px",
                  overflow: "hidden",
                  cursor: "pointer",
                  flex: "0 0 auto",
                  bgcolor: "#F0F3F5",
                  lineHeight: 0,
                }}
              >
                <Box component="img" src={image.fileUrl} alt="" sx={{ width: 88, height: 68, objectFit: "cover", display: "block" }} />
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}

function reviewWhen(createdAt) {
  const ms = createdAt?.seconds ? createdAt.seconds * 1000 : createdAt?.toMillis?.() || createdAt?.getTime?.() || 0;
  return ms ? moment(ms).fromNow() : "";
}

function Stars({ value, onPick }) {
  return (
    <Box display="flex" gap={0.25} aria-label={onPick ? "Rating" : undefined}>
      {Array.from({ length: 5 }, (_, index) => {
        const filled = index < Number(value);
        const icon = filled ? <Star sx={{ color: accent, fontSize: 20 }} /> : <StarOutline sx={{ color: "#C9D3D9", fontSize: 20 }} />;
        if (!onPick) return <Box key={index}>{icon}</Box>;
        return (
          <Box
            key={index}
            component="button"
            type="button"
            aria-label={`${index + 1} star${index ? "s" : ""}`}
            onClick={() => onPick(index + 1)}
            sx={{ border: 0, p: 0, bgcolor: "transparent", cursor: "pointer", lineHeight: 0 }}
          >
            {icon}
          </Box>
        );
      })}
    </Box>
  );
}

export function LessonPage({ classSlug, subjectSlug, moduleSlug, chapterSlug, topicSlug }) {
  const router = useRouter();
  const pathname = usePathname();
  const [place, setPlace] = useState(null);
  const [pathContext, setPathContext] = useState(null);
  const [topics, setTopics] = useState([]);
  const [content, setContent] = useState({});
  const [quizzes, setQuizzes] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ name: "", email: "", rating: 0, feedback: "" });
  const [reviewErrors, setReviewErrors] = useState({});
  const [reviewSent, setReviewSent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);
  const [tab, setTab] = useState(0);
  const [activeImage, setActiveImage] = useState(0);
  const [pdfFile, setPdfFile] = useState(null);

  const loadLesson = async () => {
    if (!classSlug || !subjectSlug || !moduleSlug || !chapterSlug || !topicSlug) {
      setPlace(null);
      setPathContext(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setFailed(false);
    setTab(0);
    setActiveImage(0);
    try {
      const found = await resolveLessonPath(classSlug, subjectSlug, moduleSlug, chapterSlug, topicSlug);
      if (!found) {
        setPlace(null);
        setPathContext(null);
        setContent({});
        setTopics([]);
        setQuizzes([]);
        setReviews([]);
        return;
      }

      const topicId = found.topic.id;
      const canonical = lessonPath(found);
      if (decodeURI(pathname) !== canonical) router.replace(canonical);

      const [theorySnap, reviewSnap, quizSnap] = await Promise.all([
        getDoc(doc(db, "ClassesTheory", topicId)),
        getDoc(doc(db, "Reviews", topicId)),
        getDocs(query(collection(db, "ClassQuizzes"), where("topicId", "==", topicId))),
      ]);

      const quizItems = quizSnap.docs.map((item) => ({ key: item.id, ...item.data() }));
      quizItems.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      const moduleHref = modulePath(found.classItem, found.classes, found.subject, found.subjects, found.module, found.modules);

      setPathContext(found);
      setPlace({
        topicId,
        topicName: found.topic.name || "Lesson",
        chapterId: found.chapter.id,
        chapterName: found.chapter.name || "Chapter",
        branchId: found.module.id,
        moduleName: found.module.name || "Module",
        subjectId: found.subject.id,
        subjectName: found.subject.name || "Subject",
        classId: found.classItem.id,
        className: found.classItem.name || "Class",
        hrefs: {
          class: `/classes#${classAnchor(found.classItem, found.classes)}`,
          subject: subjectPath(found.classItem, found.classes, found.subject, found.subjects),
          module: moduleHref,
          chapter: `${moduleHref}#${chapterAnchor(found.chapter, found.chapters)}`,
        },
      });
      setContent(theorySnap.exists() ? { key: theorySnap.id, ...theorySnap.data() } : {});
      let approved = [];
      try {
        approved = await listApprovedClassReviews(topicId);
      } catch (error) {
        console.error(error);
      }
      const legacy = (reviewSnap.exists() ? reviewSnap.data().ratings || [] : []).filter(
        (item) => item && item.status !== "pending" && item.status !== "rejected"
      );
      setReviews([...approved, ...legacy].sort((a, b) => timeOf(b.createdAt) - timeOf(a.createdAt)));
      setQuizzes(quizItems);
      setTopics(byCreated(found.topics).map((item) => ({ key: item.id, ...item })));
    } catch (error) {
      console.error(error);
      setFailed(true);
      toast.error("Failed to fetch content");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLesson();
  }, [classSlug, subjectSlug, moduleSlug, chapterSlug, topicSlug, pathname]);

  const changeReview = (key, value) => {
    setReviewSent(false);
    setNewReview((current) => ({ ...current, [key]: value }));
    setReviewErrors((current) => ({ ...current, [key]: "" }));
  };

  const handleAddReview = async () => {
    const errors = reviewFieldErrors(newReview);
    const normalizedEmail = newReview.email.trim().toLowerCase();
    if (!errors.email && reviews.some((review) => String(review.email || "").trim().toLowerCase() === normalizedEmail)) {
      errors.email = "This email already reviewed this lesson.";
    }
    setReviewErrors(errors);
    if (Object.values(errors).some(Boolean)) return;
    try {
      setSaving(true);
      await submitClassReview({
        topicId: place?.topicId,
        topicName: place?.topicName || "Lesson",
        name: newReview.name,
        email: newReview.email,
        rating: newReview.rating,
        feedback: newReview.feedback,
      });
      setNewReview({ name: "", email: "", rating: 0, feedback: "" });
      setReviewSent(true);
    } catch (error) {
      if (error instanceof DuplicateReviewError || error?.code === "already-reviewed") {
        setReviewErrors((current) => ({ ...current, email: "This email already reviewed this lesson." }));
        return;
      }
      console.log(error);
      toast.error("Review could not be sent");
    } finally {
      setSaving(false);
    }
  };

  const youtubeVideos = useMemo(() => content.youtubeLinks || [], [content]);
  const images = useMemo(() => lessonImages(content), [content]);
  useEffect(() => {
    const featured = images.findIndex((image) => image.featured);
    setActiveImage(featured >= 0 ? featured : 0);
  }, [images]);
  const notesHtml = useMemo(() => {
    if (typeof window === "undefined" || typeof content.theory !== "string") return "";
    const notes = stripImages(content.theory);
    if (!visibleText(notes)) return "";
    return wrapImagesInContainer(notes);
  }, [content]);
  const shownImage = Math.min(activeImage, Math.max(images.length - 1, 0));

  const trail = place
    ? [
        { label: "Classes", href: "/classes" },
        { label: place.className, href: place.hrefs.class },
        { label: place.subjectName, href: place.hrefs.subject },
        { label: place.moduleName, href: place.hrefs.module },
        { label: place.chapterName, href: place.hrefs.chapter },
        { label: place.topicName },
      ]
    : [
        { label: "Classes", href: "/classes" },
        { label: "Lesson" },
      ];

  const counts = [null, content.pdfs?.length || 0, youtubeVideos.length];

  return (
    <Box sx={{ bgcolor: pageBackground, color: ink, pt: { xs: "96px", md: "112px" }, pb: { xs: 8, md: 12 } }}>
      <PDFModal open={Boolean(pdfFile)} setOpen={(next) => { if (!next) setPdfFile(null); }} url={pdfFile?.fileUrl || ""} name={pdfFile?.name || "PDF"} />
      <Box sx={pageColumnSx}>
        <Box
          sx={{
            borderRadius: { xs: "24px", md: "32px" },
            background: "linear-gradient(145deg, #0A192F 0%, #071322 55%, #123044 100%)",
            px: { xs: 3, sm: 4.5, md: 6 },
            py: { xs: 5, md: 7 },
          }}
        >
          <Typography
            component="p"
            sx={{
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.16)",
              borderRadius: 999,
              px: 1.5,
              py: 0.4,
              fontSize: 12,
              letterSpacing: 0.6,
              mb: 2.5,
              width: "fit-content",
            }}
          >
            Lesson
          </Typography>
          <Typography
            component="h1"
            sx={{
              color: "#fff",
              fontWeight: 700,
              letterSpacing: -1.4,
              lineHeight: 1.05,
              fontSize: { xs: 40, sm: 52, md: 64 },
              maxWidth: 760,
            }}
          >
            {place?.topicName || "Lesson"}
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.72)", fontSize: 17, lineHeight: 1.65, maxWidth: 560, mt: 2.5 }}>
            {place ? `${place.chapterName} · notes, files, videos, and practice in one place.` : "Open a topic from a chapter to study."}
          </Typography>
          <PageTrail onDark items={loading ? [{ label: "Classes", href: "/classes" }, { label: "Lesson" }] : trail} />
        </Box>

        {loading ? (
          <Box sx={{ mt: 3, display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.5fr 0.7fr" }, gap: 1.5 }}>
            <Skeleton variant="rounded" height={420} sx={{ borderRadius: "22px", bgcolor: "rgba(10, 25, 47, 0.08)" }} />
            <Skeleton variant="rounded" height={280} sx={{ borderRadius: "22px", bgcolor: "rgba(10, 25, 47, 0.08)" }} />
          </Box>
        ) : failed ? (
          <Box sx={{ mt: 3, bgcolor: "#fff", border: "1px solid #E2E8EC", borderRadius: "24px", p: { xs: 3, md: 4 } }}>
            <Typography sx={{ fontWeight: 700, fontSize: 22 }}>This lesson could not be loaded</Typography>
            <Typography sx={{ color: muted, mt: 1 }}>Refresh the page and try again.</Typography>
          </Box>
        ) : !place ? (
          <Box sx={{ mt: 3, bgcolor: "#fff", border: "1px solid #E2E8EC", borderRadius: "24px", p: { xs: 3, md: 4 } }}>
            <Typography sx={{ fontWeight: 700, fontSize: 22 }}>This topic is not on the syllabus</Typography>
            <Typography
              component={Link}
              href="/classes"
              sx={{ display: "inline-block", color: primary, fontWeight: 600, mt: 1.5, textDecoration: "none", "&:hover": { color: primaryHover } }}
            >
              Back to classes
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              mt: { xs: 3, md: 4 },
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1.55fr) minmax(240px, 0.7fr)" },
              gap: 1.5,
              alignItems: "start",
            }}
          >
            <Box sx={{ display: "grid", gap: 1.5, minWidth: 0 }}>
              <Box sx={{ bgcolor: "#fff", border: "1px solid #E2E8EC", borderRadius: "22px", p: { xs: 2, md: 3 } }}>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2.5 }}>
                  {tabs.map((label, index) => {
                    const selected = tab === index;
                    return (
                      <Box
                        key={label}
                        component="button"
                        type="button"
                        onClick={() => setTab(index)}
                        sx={{
                          border: selected ? "1px solid transparent" : "1px solid #E2E8EC",
                          cursor: "pointer",
                          borderRadius: 999,
                          px: 1.75,
                          py: 0.85,
                          font: "inherit",
                          fontWeight: 600,
                          fontSize: 14,
                          bgcolor: selected ? primary : "#fff",
                          color: selected ? "#fff" : ink,
                          "&:hover": { bgcolor: selected ? primaryHover : "rgba(13, 154, 172, 0.08)" },
                        }}
                      >
                        {label}
                        {counts[index] ? ` ${counts[index]}` : ""}
                      </Box>
                    );
                  })}
                </Box>

                {tab === 0 && (
                  <>
                    {images.length > 0 && <ImageGallery images={images} active={shownImage} onPick={setActiveImage} />}
                    {notesHtml ? (
                      <Box
                        sx={{
                          mt: images.length ? 3 : 0,
                          color: ink,
                          fontSize: 16.5,
                          lineHeight: 1.75,
                          "& p": { mb: 1.6 },
                          "& h1, & h2, & h3": { fontWeight: 700, letterSpacing: -0.4, lineHeight: 1.2, mt: 2.5, mb: 1 },
                          "& a": { color: primary },
                          "& ul, & ol": { pl: 3, mb: 1.6 },
                          "& img": { maxWidth: "100%", height: "auto", borderRadius: "16px", display: "block", my: 2 },
                          "& blockquote": { borderLeft: `3px solid ${primary}`, m: 0, pl: 2, color: muted },
                        }}
                      >
                        {renderHTML(notesHtml)}
                      </Box>
                    ) : images.length === 0 ? (
                      <Box>
                        <Typography sx={{ fontWeight: 700, fontSize: 22 }}>No notes yet</Typography>
                        <Typography sx={{ color: muted, mt: 1 }}>Files and videos for this topic are on the other tabs.</Typography>
                      </Box>
                    ) : null}
                  </>
                )}

                {tab === 1 && (
                  content.pdfs?.length > 0 ? (
                    <Box sx={{ display: "grid", gap: 1.25 }}>
                      {content.pdfs.map((file, index) => (
                        <Box
                          key={`${file.name}-${index}`}
                          component="button"
                          type="button"
                          onClick={() => setPdfFile(file)}
                          sx={{
                            width: "100%",
                            textAlign: "left",
                            font: "inherit",
                            color: ink,
                            cursor: "pointer",
                            border: "1px solid #E2E8EC",
                            borderRadius: "16px",
                            px: 2,
                            py: 1.5,
                            bgcolor: "#fff",
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            "&:hover": { borderColor: primary },
                          }}
                        >
                          <PictureAsPdfOutlined sx={{ color: primary }} />
                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography sx={{ fontWeight: 600, wordBreak: "break-word" }}>{file.name || "PDF"}</Typography>
                            <Typography sx={{ color: muted, fontSize: 13, mt: 0.25 }}>Open in the reader</Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: 22 }}>No files yet</Typography>
                      <Typography sx={{ color: muted, mt: 1 }}>PDFs for this topic will show here.</Typography>
                    </Box>
                  )
                )}

                {tab === 2 && (
                  youtubeVideos.length > 0 ? (
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 1.5 }}>
                      {youtubeVideos.map((item, index) => (
                        <Box key={`${item}-${index}`} sx={{ position: "relative", pt: "56.25%", borderRadius: "16px", overflow: "hidden", bgcolor: ink }}>
                          <Box
                            component="iframe"
                            title={`Lesson video ${index + 1}`}
                            src={`https://www.youtube.com/embed/${item}`}
                            allowFullScreen
                            sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
                          />
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: 22 }}>No videos yet</Typography>
                      <Typography sx={{ color: muted, mt: 1 }}>Lecture videos for this topic will show here.</Typography>
                    </Box>
                  )
                )}

              </Box>

              <Box sx={{ bgcolor: "#fff", border: "1px solid #E2E8EC", borderRadius: "22px", p: { xs: 2.5, md: 3 } }}>
                    <Typography sx={{ color: primary, fontSize: 13, fontWeight: 700, letterSpacing: 1.1, textTransform: "uppercase" }}>
                      Reviews
                    </Typography>
                    {reviews.length === 0 ? (
                      <Typography sx={{ color: muted, mt: 1.5 }}>No reviews yet. Be the first to leave a note.</Typography>
                    ) : (
                      <Box sx={{ display: "grid", gap: 1.5, mt: 2 }}>
                        {reviews.map((review, index) => (
                          <Box key={`${review.name}-${index}`} sx={{ display: "flex", gap: 2, borderTop: index === 0 ? "none" : "1px solid #E2E8EC", pt: index === 0 ? 0 : 1.5 }}>
                            <Avatar src={review.userImage || undefined} sx={{ bgcolor: primary, width: 40, height: 40 }}>
                              {review.name?.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography sx={{ fontWeight: 700 }}>{review.name}</Typography>
                              <Box display="flex" alignItems="center" gap={1} mt={0.4}>
                                <Stars value={review.rating} />
                                <Typography sx={{ color: muted, fontSize: 13 }}>{reviewWhen(review.createdAt)}</Typography>
                              </Box>
                              <Typography sx={{ color: muted, mt: 0.75, lineHeight: 1.6 }}>{review.feedback}</Typography>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ bgcolor: "#fff", border: "1px solid #E2E8EC", borderRadius: "22px", p: { xs: 2.5, md: 3 } }}>
                    <Typography sx={{ color: primary, fontSize: 13, fontWeight: 700, letterSpacing: 1.1, textTransform: "uppercase" }}>
                      Your note
                    </Typography>
                    <Typography sx={{ fontWeight: 700, fontSize: 22, letterSpacing: -0.4, mt: 0.5 }}>How was this lesson?</Typography>
                    <Typography sx={{ color: muted, mt: 1, lineHeight: 1.6 }}>
                      The desk reads each note before it appears on this lesson. Each email can leave one review here, and that email stays with the desk.
                    </Typography>
                    <Box mt={2}>
                      <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 0.75 }}>Rating</Typography>
                      <Stars value={newReview.rating} onPick={(rating) => changeReview("rating", rating)} />
                      {reviewErrors.rating ? <Typography sx={{ color: accent, fontSize: 13, mt: 0.75 }}>{reviewErrors.rating}</Typography> : null}
                    </Box>
                    <Box mt={2}>
                      <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 0.75 }}>Name</Typography>
                      <TextField
                        fullWidth
                        placeholder="Your name"
                        value={newReview.name}
                        error={Boolean(reviewErrors.name)}
                        helperText={reviewErrors.name || ""}
                        onChange={(event) => changeReview("name", event.target.value)}
                        sx={fieldSx}
                      />
                    </Box>
                    <Box mt={2}>
                      <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 0.75 }}>Email</Typography>
                      <TextField
                        required
                        type="email"
                        fullWidth
                        placeholder="you@email.com"
                        value={newReview.email}
                        error={Boolean(reviewErrors.email)}
                        helperText={reviewErrors.email || ""}
                        onChange={(event) => changeReview("email", event.target.value)}
                        sx={fieldSx}
                      />
                    </Box>
                    <Box mt={2}>
                      <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 0.75 }}>Feedback</Typography>
                      <TextField
                        fullWidth
                        multiline
                        minRows={4}
                        placeholder="What helped, and what was missing?"
                        value={newReview.feedback}
                        error={Boolean(reviewErrors.feedback)}
                        helperText={reviewErrors.feedback || ""}
                        onChange={(event) => changeReview("feedback", event.target.value)}
                        sx={fieldSx}
                      />
                    </Box>
                    {reviewSent ? (
                      <Typography sx={{ color: primary, fontWeight: 600, mt: 2 }}>
                        Sent. It will show here after the desk approves it.
                      </Typography>
                    ) : null}
                    <Button
                      variant="contained"
                      disabled={saving}
                      onClick={handleAddReview}
                      sx={{
                        mt: 2.5,
                        textTransform: "none",
                        fontWeight: 600,
                        borderRadius: 999,
                        px: 2.75,
                        py: 1.1,
                        bgcolor: primary,
                        boxShadow: "none",
                        "&:hover": { bgcolor: primaryHover, boxShadow: "none" },
                      }}
                    >
                      {saving ? "Sending" : "Submit review"}
                    </Button>
                  </Box>
            </Box>

            <Box sx={{ display: "grid", gap: 1.5, alignSelf: "start", position: { md: "sticky" }, top: { md: 96 } }}>
            <Box sx={{ bgcolor: "#fff", border: "1px solid #E2E8EC", borderRadius: "22px", p: { xs: 2.5, md: 3 } }}>
              <Typography sx={{ color: primary, fontSize: 13, fontWeight: 700, letterSpacing: 1.1, textTransform: "uppercase" }}>
                Quizzes
              </Typography>
              {quizzes.length === 0 ? (
                <Typography sx={{ color: muted, mt: 1.5 }}>No quizzes on this topic yet.</Typography>
              ) : (
                <Box sx={{ display: "grid", mt: 1.5 }}>
                  {quizzes.map((quiz) => {
                    const href = quiz.mode === "offline" ? `/classes/offquiz/${quiz.key}` : `/classes/quiz/${quiz.key}`;
                    const locked = Boolean(quiz.locked);
                    return (
                      <Box
                        key={quiz.key}
                        component={locked ? "div" : Link}
                        href={locked ? undefined : href}
                        sx={{
                          py: 1.25,
                          borderTop: "1px solid #E2E8EC",
                          textDecoration: "none",
                          color: locked ? muted : ink,
                          "&:hover": locked ? {} : { color: primary },
                        }}
                      >
                        <Typography sx={{ fontWeight: 600, fontSize: 15, lineHeight: 1.35 }}>
                          {quiz.quizNumber ? `${quiz.quizNumber}. ` : ""}
                          {quiz.quizTitle || "Quiz"}
                        </Typography>
                        <Typography sx={{ color: muted, fontSize: 13, mt: 0.35 }}>
                          {[quiz.difficulty, quiz.duration ? `${quiz.duration} min` : "", locked ? "Locked" : ""]
                            .filter(Boolean)
                            .join(" · ")}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              )}
            </Box>
            <Box sx={{ bgcolor: "#fff", border: "1px solid #E2E8EC", borderRadius: "22px", p: { xs: 2.5, md: 3 } }}>
              <Typography sx={{ color: primary, fontSize: 13, fontWeight: 700, letterSpacing: 1.1, textTransform: "uppercase" }}>
                In this chapter
              </Typography>
              <Typography sx={{ fontWeight: 700, fontSize: 22, letterSpacing: -0.4, mt: 0.6, lineHeight: 1.2 }}>{place.chapterName}</Typography>
              {topics.length === 0 ? (
                <Typography sx={{ color: muted, mt: 1.5 }}>No other topics in this chapter yet.</Typography>
              ) : (
                <Box sx={{ display: "grid", mt: 1.5 }}>
                  {topics.map((topic) => {
                    const current = topic.key === place.topicId;
                    return (
                      <Box
                        key={topic.key}
                        component={current ? "div" : Link}
                        href={
                          current || !pathContext
                            ? undefined
                            : lessonPath({
                                classItem: pathContext.classItem,
                                classes: pathContext.classes,
                                subject: pathContext.subject,
                                subjects: pathContext.subjects,
                                module: pathContext.module,
                                modules: pathContext.modules,
                                chapter: pathContext.chapter,
                                chapters: pathContext.chapters,
                                topic,
                                topics: pathContext.topics,
                              })
                        }
                        sx={{
                          py: 1.25,
                          borderTop: "1px solid #E2E8EC",
                          textDecoration: "none",
                          color: current ? primary : ink,
                          fontWeight: current ? 700 : 600,
                          "&:hover": { color: primary },
                        }}
                      >
                        {topic.name}
                      </Box>
                    );
                  })}
                </Box>
              )}
            </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default function Page() {
  return <LegacyClassRedirect kind="lesson" />;
}
