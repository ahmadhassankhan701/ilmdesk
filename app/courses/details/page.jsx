"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Box, Button, Skeleton, Typography } from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import renderHTML from "react-render-html";
import { db } from "@/firebase";
import { accent, accentHover, ink, muted, primary, primaryHover } from "@/lib/brand";
import { pageBackground, pageColumnSx } from "@/lib/pageColumn";
import PageTrail from "@/components/PageTrail";

function priceLabel(value) {
  const amount = Number(value);
  if (!value || amount === 0) return "Free";
  return `Rs ${value}`;
}

function levelLabel(value) {
  if (value === "intermediate") return "Intermediate";
  if (value === "expert") return "Expert";
  return "Beginner";
}

function visibleText(html) {
  return String(html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function CourseDetails() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("id");
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let ignore = false;
    (async () => {
      if (!courseId) {
        setCourse(null);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setFailed(false);
        const snapshot = await getDoc(doc(db, "courses", courseId));
        if (ignore) return;
        setCourse(snapshot.exists() ? { id: snapshot.id, ...snapshot.data(), modules: snapshot.data().modules || [] } : null);
      } catch (error) {
        console.error(error);
        if (!ignore) {
          setFailed(true);
          toast.error("Could not load this course.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [courseId]);

  const title = course?.title || "Course";
  const modules = course?.modules || [];

  return (
    <Box sx={{ bgcolor: pageBackground, color: ink, pt: { xs: "96px", md: "112px" }, pb: { xs: 8, md: 12 } }}>
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
            Course
          </Typography>
          <Typography component="h1" sx={{ color: "#fff", fontWeight: 700, letterSpacing: -1.2, lineHeight: 1.05, fontSize: { xs: 36, sm: 48, md: 60 }, maxWidth: 760 }}>
            {loading ? "Course" : title}
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.72)", fontSize: 17, lineHeight: 1.65, maxWidth: 560, mt: 2.5 }}>
            {course ? `${course.subject || "Subject"} · ${levelLabel(course.difficulty)} · ${modules.length === 1 ? "1 module" : `${modules.length} modules`}` : "Notes, videos, and practice for this course."}
          </Typography>
          <PageTrail onDark items={[{ label: "Home", href: "/" }, { label: "Courses", href: "/courses" }, { label: loading ? "Course" : title }]} />
        </Box>

        {loading ? (
          <Box sx={{ mt: 3, display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.5fr 0.7fr" }, gap: 1.5 }}>
            <Skeleton variant="rounded" height={360} sx={{ borderRadius: "22px", bgcolor: "rgba(10, 25, 47, 0.08)" }} />
            <Skeleton variant="rounded" height={280} sx={{ borderRadius: "22px", bgcolor: "rgba(10, 25, 47, 0.08)" }} />
          </Box>
        ) : failed ? (
          <Notice title="This course could not be loaded" body="Refresh the page and try again." />
        ) : !course ? (
          <Notice title="This course is not listed" body="Go back to the course list and choose another." />
        ) : (
          <Box sx={{ mt: 3, display: "grid", gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1.55fr) minmax(240px, 0.7fr)" }, gap: 1.5, alignItems: "start" }}>
            <Box sx={{ bgcolor: "#fff", border: "1px solid #E2E8EC", borderRadius: "22px", overflow: "hidden" }}>
              {course.image ? (
                <Box component="img" src={course.image} alt="" sx={{ width: "100%", height: { xs: 220, md: 320 }, objectFit: "cover", display: "block", bgcolor: "#E2E8EC" }} />
              ) : null}
              <Box sx={{ p: { xs: 2.5, md: 3.5 } }}>
                <Typography sx={{ color: primary, fontSize: 13, fontWeight: 700, letterSpacing: 1.1, textTransform: "uppercase" }}>Overview</Typography>
                {visibleText(course.desc) ? (
                  <Box
                    sx={{
                      mt: 1.5,
                      color: ink,
                      fontSize: 16.5,
                      lineHeight: 1.75,
                      "& p": { mb: 1.6 },
                      "& h1, & h2, & h3": { fontWeight: 700, letterSpacing: -0.4, lineHeight: 1.2, mt: 2.5, mb: 1 },
                      "& a": { color: primary },
                      "& ul, & ol": { pl: 3, mb: 1.6 },
                      "& img": { maxWidth: "100%", height: "auto", borderRadius: "16px", display: "block", my: 2 },
                    }}
                  >
                    {renderHTML(course.desc)}
                  </Box>
                ) : (
                  <Typography sx={{ color: muted, mt: 1.5 }}>This course has no overview yet.</Typography>
                )}
              </Box>
            </Box>

            <Box sx={{ bgcolor: "#fff", border: "1px solid #E2E8EC", borderRadius: "22px", p: { xs: 2.5, md: 3 }, position: { md: "sticky" }, top: { md: 96 } }}>
              <Typography sx={{ color: primary, fontSize: 13, fontWeight: 700, letterSpacing: 1.1, textTransform: "uppercase" }}>Price</Typography>
              <Typography sx={{ fontWeight: 700, fontSize: 36, letterSpacing: -0.8, lineHeight: 1.1, mt: 0.5 }}>{priceLabel(course.price)}</Typography>
              <Typography sx={{ color: muted, mt: 1, lineHeight: 1.6 }}>Notes, files, videos, and quizzes sit on the modules inside.</Typography>
              <Button
                component={Link}
                href={`/courses/checkout?id=${course.id}`}
                variant="contained"
                fullWidth
                sx={{
                  mt: 2.5,
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: 999,
                  py: 1.15,
                  bgcolor: accent,
                  boxShadow: "none",
                  "&:hover": { bgcolor: accentHover, boxShadow: "none" },
                }}
              >
                Enroll Now
              </Button>
              <Typography sx={{ color: primary, fontSize: 13, fontWeight: 700, letterSpacing: 1.1, textTransform: "uppercase", mt: 3 }}>Modules</Typography>
              {modules.length === 0 ? (
                <Typography sx={{ color: muted, mt: 1.25 }}>No modules on this course yet.</Typography>
              ) : (
                <Box sx={{ display: "grid", mt: 1 }}>
                  {modules.map((module, index) => (
                    <Typography key={module.id || module.name} sx={{ py: 1.15, borderTop: "1px solid #E2E8EC", fontWeight: 600, lineHeight: 1.4 }}>
                      {index + 1}. {module.name || "Module"}
                    </Typography>
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}

function Notice({ title, body }) {
  return (
    <Box sx={{ mt: 3, bgcolor: "#fff", border: "1px solid #E2E8EC", borderRadius: "24px", p: { xs: 3, md: 4 } }}>
      <Typography sx={{ fontWeight: 700, fontSize: 22 }}>{title}</Typography>
      <Typography sx={{ color: muted, mt: 1 }}>{body}</Typography>
      <Typography component={Link} href="/courses" sx={{ display: "inline-block", color: primary, fontWeight: 600, mt: 1.5, textDecoration: "none", "&:hover": { color: primaryHover } }}>
        Back to courses
      </Typography>
    </Box>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<Box sx={{ bgcolor: pageBackground, minHeight: "50vh" }} />}>
      <CourseDetails />
    </Suspense>
  );
}
