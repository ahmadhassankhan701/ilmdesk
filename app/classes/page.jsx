"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Box, Skeleton, Typography } from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { ink, muted, primary } from "@/lib/brand";
import { pageBackground, pageColumnSx } from "@/lib/pageColumn";
import PageTrail from "@/components/PageTrail";
import { classAnchor, subjectPath } from "@/lib/classPath";

function subjectImage(name = "") {
  const label = name.toLowerCase();
  if (label.includes("chem")) return "/Currica/chemistry_subject.jpg";
  if (label.includes("bio")) return "/popularCourseCard2.jpg";
  if (label.includes("english")) return "/courseCategImg.jpg";
  if (label.includes("phys")) return "/popularCourseCard1.jpg";
  return "";
}

function classOrder(name = "") {
  const match = String(name).match(/\d+/);
  return match ? Number(match[0]) : 999;
}

export default function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const [classesSnapshot, subjectsSnapshot] = await Promise.all([
          getDocs(collection(db, "classes")),
          getDocs(collection(db, "subjects")),
        ]);
        const subjects = subjectsSnapshot.docs.map((item) => ({ key: item.id, ...item.data() }));
        const structured = classesSnapshot.docs
          .map((item) => ({
            classId: item.id,
            className: item.data().name || "Class",
            slug: item.data().slug || "",
            createdAt: item.data().createdAt || null,
            subjects: subjects.filter((subject) => subject.classID === item.id),
          }))
          .sort((a, b) => classOrder(a.className) - classOrder(b.className) || a.className.localeCompare(b.className));

        if (active) setClasses(structured);
      } catch (error) {
        console.error("Error fetching classes and subjects:", error);
        if (active) {
          setClasses([]);
          setFailed(true);
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const list = Array.isArray(classes) ? classes : [];
  const classRecords = list.map((entry) => ({ id: entry.classId, name: entry.className, slug: entry.slug, createdAt: entry.createdAt }));

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
            Free classes
          </Typography>
          <Typography
            component="h1"
            sx={{
              color: "#fff",
              fontWeight: 700,
              letterSpacing: -1.4,
              lineHeight: 1.05,
              fontSize: { xs: 40, sm: 52, md: 64 },
              maxWidth: 680,
            }}
          >
            The syllabus, chapter by chapter.
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.72)", fontSize: 17, lineHeight: 1.65, maxWidth: 520, mt: 2.5 }}>
            Pick a class, then the subject. Notes, videos, and quizzes sit on the topics inside.
          </Typography>
          <PageTrail onDark items={[{ label: "Home", href: "/" }, { label: "Classes" }]} />
        </Box>

        {loading ? (
          <Box sx={{ mt: 3, display: "grid", gap: 3 }}>
            {[0, 1].map((block) => (
              <Box key={block}>
                <Skeleton variant="text" width={180} height={42} sx={{ bgcolor: "rgba(10, 25, 47, 0.08)" }} />
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" }, gap: 1.5, mt: 1 }}>
                  {[0, 1, 2, 3].map((tile) => (
                    <Skeleton key={tile} variant="rounded" height={180} sx={{ borderRadius: "18px", bgcolor: "rgba(10, 25, 47, 0.08)" }} />
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        ) : failed ? (
          <Box sx={{ mt: 3, bgcolor: "#fff", border: "1px solid #E2E8EC", borderRadius: "24px", p: { xs: 3, md: 4 } }}>
            <Typography sx={{ fontWeight: 700, fontSize: 22 }}>Classes could not be loaded</Typography>
            <Typography sx={{ color: muted, mt: 1 }}>Refresh the page and try again.</Typography>
          </Box>
        ) : list.length === 0 ? (
          <Box sx={{ mt: 3, bgcolor: "#fff", border: "1px solid #E2E8EC", borderRadius: "24px", p: { xs: 3, md: 4 } }}>
            <Typography sx={{ fontWeight: 700, fontSize: 22 }}>No classes yet</Typography>
            <Typography sx={{ color: muted, mt: 1 }}>The syllabus will show here once a class is published.</Typography>
          </Box>
        ) : (
          <Box sx={{ mt: { xs: 4, md: 6 }, display: "grid", gap: { xs: 5, md: 6 } }}>
            {list.map((item) => (
              <Box
                id={classAnchor({ id: item.classId, name: item.className, slug: item.slug, createdAt: item.createdAt }, classRecords)}
                key={item.classId}
                component="section"
                sx={{ scrollMarginTop: { xs: "96px", md: "120px" } }}
              >
                <Typography sx={{ color: primary, fontSize: 13, fontWeight: 700, letterSpacing: 1.1, textTransform: "uppercase" }}>
                  Class
                </Typography>
                <Typography sx={{ fontSize: { xs: 28, md: 36 }, fontWeight: 700, letterSpacing: -0.7, mt: 0.4 }}>
                  {item.className}
                </Typography>
                {(item.subjects || []).length === 0 ? (
                  <Typography sx={{ color: muted, mt: 1.5 }}>No subjects on this class yet.</Typography>
                ) : (
                  <Box
                    sx={{
                      mt: 2,
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
                      gap: 1.5,
                    }}
                  >
                    {item.subjects.map((subject) => {
                      const image = subjectImage(subject.name);
                      return (
                        <Box
                          key={subject.key}
                          component={Link}
                          href={subjectPath(
                            { id: item.classId, name: item.className, slug: item.slug, createdAt: item.createdAt },
                            classRecords,
                            { id: subject.key, name: subject.name, slug: subject.slug, createdAt: subject.createdAt },
                            (item.subjects || []).map((entry) => ({ id: entry.key, name: entry.name, slug: entry.slug, createdAt: entry.createdAt }))
                          )}
                          sx={{
                            position: "relative",
                            minHeight: { xs: 150, md: 200 },
                            borderRadius: "18px",
                            overflow: "hidden",
                            textDecoration: "none",
                            color: "#fff",
                            bgcolor: ink,
                            backgroundImage: image
                              ? `linear-gradient(180deg, rgba(10, 25, 47, 0.08), rgba(10, 25, 47, 0.78)), url(${image})`
                              : "linear-gradient(160deg, #071322 0%, #0A192F 60%, #123044 100%)",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            display: "flex",
                            alignItems: "flex-end",
                            p: 2,
                            "&:hover": { outline: `2px solid ${primary}`, outlineOffset: -2 },
                          }}
                        >
                          <Box>
                            <Typography sx={{ fontWeight: 700, fontSize: { xs: 18, md: 20 }, lineHeight: 1.2 }}>
                              {subject.name}
                            </Typography>
                            <Typography sx={{ fontSize: 13, color: "rgba(255,255,255,0.75)", mt: 0.4 }}>Open syllabus</Typography>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
