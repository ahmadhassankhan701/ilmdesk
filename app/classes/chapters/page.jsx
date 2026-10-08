"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Box, Skeleton, Typography } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { ink, muted, primary, primaryHover } from "@/lib/brand";
import { pageBackground, pageColumnSx } from "@/lib/pageColumn";
import PageTrail from "@/components/PageTrail";
import LegacyClassRedirect from "@/components/Classes/LegacyClassRedirect";
import { resolveModulePath } from "@/lib/classCatalog";
import { chapterAnchor, classAnchor, lessonPath, modulePath, subjectPath } from "@/lib/classPath";

function timeOf(value) {
  return value?.toMillis?.() || value?.getTime?.() || Number(value) || 0;
}

function byCreated(items) {
  return [...items].sort((a, b) => timeOf(a.createdAt) - timeOf(b.createdAt) || String(a.name || "").localeCompare(String(b.name || "")));
}

export function ModuleChaptersPage({ classSlug, subjectSlug, moduleSlug }) {
  const router = useRouter();
  const pathname = usePathname();
  const [catalog, setCatalog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;

    (async () => {
      if (!classSlug || !subjectSlug || !moduleSlug) {
        if (active) {
          setCatalog(null);
          setFailed(false);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setFailed(false);
      try {
        const found = await resolveModulePath(classSlug, subjectSlug, moduleSlug);
        if (!active) return;
        if (!found) {
          setCatalog(null);
          return;
        }
        const canonical = modulePath(found.classItem, found.classes, found.subject, found.subjects, found.module, found.modules);
        if (decodeURI(pathname) !== canonical) router.replace(canonical);
        const chapters = byCreated(found.chapters);
        const topics = found.topics;
        setCatalog({
          ...found,
          chapters: chapters.map((chapter) => ({
            ...chapter,
            chapterId: chapter.id,
            chapterName: chapter.name || "Chapter",
            anchor: chapterAnchor(chapter, chapters),
            topics: byCreated(topics.filter((topic) => topic.chapterID === chapter.id)),
          })),
        });
      } catch (error) {
        console.error("Error fetching chapters and topics:", error);
        if (active) {
          setCatalog(null);
          setFailed(true);
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [classSlug, subjectSlug, moduleSlug, pathname, router]);

  const place = catalog
    ? {
        moduleName: catalog.module.name || "Module",
        subjectName: catalog.subject.name || "Subject",
      }
    : null;
  const chapters = catalog?.chapters || [];
  const trail = catalog
    ? [
        { label: "Classes", href: "/classes" },
        { label: catalog.classItem.name || "Class", href: `/classes#${classAnchor(catalog.classItem, catalog.classes)}` },
        { label: catalog.subject.name || "Subject", href: subjectPath(catalog.classItem, catalog.classes, catalog.subject, catalog.subjects) },
        { label: catalog.module.name || "Module" },
      ]
    : [
        { label: "Classes", href: "/classes" },
        { label: "Module" },
      ];

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
            Chapters
          </Typography>
          <Typography
            component="h1"
            sx={{
              color: "#fff",
              fontWeight: 700,
              letterSpacing: -1.4,
              lineHeight: 1.05,
              fontSize: { xs: 40, sm: 52, md: 64 },
              maxWidth: 720,
            }}
          >
            {place?.moduleName || "Choose a module"}
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.72)", fontSize: 17, lineHeight: 1.65, maxWidth: 520, mt: 2.5 }}>
            {place
              ? `Chapters inside ${place.subjectName}. Open a topic to study.`
              : "Pick a module from the subject to see its chapters."}
          </Typography>
          <PageTrail onDark items={loading ? [{ label: "Classes", href: "/classes" }, { label: "Module" }] : trail} />
        </Box>

        {loading ? (
          <Box sx={{ mt: 3, display: "grid", gap: 1.5 }}>
            {[0, 1, 2].map((tile) => (
              <Skeleton key={tile} variant="rounded" height={148} sx={{ borderRadius: "22px", bgcolor: "rgba(10, 25, 47, 0.08)" }} />
            ))}
          </Box>
        ) : failed ? (
          <Box sx={{ mt: 3, bgcolor: "#fff", border: "1px solid #E2E8EC", borderRadius: "24px", p: { xs: 3, md: 4 } }}>
            <Typography sx={{ fontWeight: 700, fontSize: 22 }}>Chapters could not be loaded</Typography>
            <Typography sx={{ color: muted, mt: 1 }}>Refresh the page and try again.</Typography>
          </Box>
        ) : !place ? (
          <Box sx={{ mt: 3, bgcolor: "#fff", border: "1px solid #E2E8EC", borderRadius: "24px", p: { xs: 3, md: 4 } }}>
            <Typography sx={{ fontWeight: 700, fontSize: 22 }}>This module is not on the syllabus</Typography>
            <Typography
              component={Link}
              href="/classes"
              sx={{ display: "inline-block", color: primary, fontWeight: 600, mt: 1.5, textDecoration: "none", "&:hover": { color: primaryHover } }}
            >
              Back to classes
            </Typography>
          </Box>
        ) : chapters.length === 0 ? (
          <Box sx={{ mt: 3, bgcolor: "#fff", border: "1px solid #E2E8EC", borderRadius: "24px", p: { xs: 3, md: 4 } }}>
            <Typography sx={{ fontWeight: 700, fontSize: 22 }}>No chapters yet</Typography>
            <Typography sx={{ color: muted, mt: 1 }}>Topics will show here once a chapter is published.</Typography>
          </Box>
        ) : (
          <Box sx={{ mt: { xs: 3, md: 4 }, display: "grid", gap: 1.5 }}>
            {chapters.map((chapter) => (
              <Box id={chapter.anchor} key={chapter.chapterId} sx={{ bgcolor: "#fff", border: "1px solid #E2E8EC", borderRadius: "22px", overflow: "hidden", scrollMarginTop: { xs: "96px", md: "120px" } }}>
                <Box sx={{ p: { xs: 2.5, md: 3 } }}>
                  <Typography sx={{ color: primary, fontSize: 13, fontWeight: 700, letterSpacing: 1.1, textTransform: "uppercase" }}>
                    Chapter
                  </Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: { xs: 22, md: 26 }, letterSpacing: -0.4, mt: 0.75, lineHeight: 1.2 }}>
                    {chapter.chapterName}
                  </Typography>
                </Box>
                {chapter.topics.length === 0 ? (
                  <Typography sx={{ color: muted, px: { xs: 2.5, md: 3 }, pb: 3 }}>No topics yet</Typography>
                ) : (
                  chapter.topics.map((topic) => (
                    <Box
                      key={topic.id}
                      component={Link}
                      href={lessonPath({
                        classItem: catalog.classItem,
                        classes: catalog.classes,
                        subject: catalog.subject,
                        subjects: catalog.subjects,
                        module: catalog.module,
                        modules: catalog.modules,
                        chapter,
                        chapters: catalog.chapters,
                        topic,
                        topics: chapter.topics,
                      })}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
                        px: { xs: 2.5, md: 3 },
                        py: 1.75,
                        borderTop: "1px solid #E2E8EC",
                        textDecoration: "none",
                        color: ink,
                        "&:hover": { bgcolor: "rgba(13, 154, 172, 0.06)" },
                      }}
                    >
                      <Typography sx={{ fontWeight: 600, fontSize: 16 }}>{topic.name}</Typography>
                      <Typography sx={{ color: primary, fontWeight: 600, fontSize: 14, flexShrink: 0 }}>Open</Typography>
                    </Box>
                  ))
                )}
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default function Page() {
  return <LegacyClassRedirect kind="module" />;
}
