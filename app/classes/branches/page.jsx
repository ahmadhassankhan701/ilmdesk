"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Box, Skeleton, Typography } from "@mui/material";
import { ink, muted, primary, primaryHover } from "@/lib/brand";
import { pageBackground, pageColumnSx } from "@/lib/pageColumn";
import PageTrail from "@/components/PageTrail";
import LegacyClassRedirect from "@/components/Classes/LegacyClassRedirect";
import { resolveSubjectPath } from "@/lib/classCatalog";
import { classAnchor, modulePath, subjectPath } from "@/lib/classPath";
import { usePathname, useRouter } from "next/navigation";

function byCreated(items) {
  const time = (value) => value?.toMillis?.() || value?.getTime?.() || 0;
  return [...items].sort((a, b) => time(a.createdAt) - time(b.createdAt) || String(a.name || "").localeCompare(String(b.name || "")));
}

export function SubjectModulesPage({ classSlug, subjectSlug }) {
  const router = useRouter();
  const pathname = usePathname();
  const [catalog, setCatalog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;

    (async () => {
      if (!classSlug || !subjectSlug) {
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
        const found = await resolveSubjectPath(classSlug, subjectSlug);
        if (!active) return;
        if (!found) {
          setCatalog(null);
          return;
        }
        const canonical = subjectPath(found.classItem, found.classes, found.subject, found.subjects);
        if (decodeURI(pathname) !== canonical) {
          router.replace(canonical);
        }
        setCatalog({ ...found, modules: byCreated(found.modules) });
      } catch (error) {
        console.error("Error fetching modules:", error);
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
  }, [classSlug, subjectSlug, pathname, router]);

  const subject = catalog
    ? {
        name: catalog.subject.name || "Subject",
        className: catalog.classItem.name || "Class",
      }
    : null;
  const modules = catalog?.modules || [];
  const trail = catalog
    ? [
        { label: "Classes", href: "/classes" },
        { label: catalog.classItem.name || "Class", href: `/classes#${classAnchor(catalog.classItem, catalog.classes)}` },
        { label: catalog.subject.name || "Subject" },
      ]
    : [
        { label: "Classes", href: "/classes" },
        { label: "Subject" },
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
            Modules
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
            {subject?.name || "Choose a subject"}
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.72)", fontSize: 17, lineHeight: 1.65, maxWidth: 520, mt: 2.5 }}>
            {subject
              ? `Modules inside ${subject.className}. Open one to reach its chapters.`
              : "Pick a subject from the class list to see its modules."}
          </Typography>
          <PageTrail onDark items={loading ? [{ label: "Classes", href: "/classes" }, { label: "Subject" }] : trail} />
        </Box>

        {loading ? (
          <Box sx={{ mt: 3, display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3, 1fr)" }, gap: 1.5 }}>
            {[0, 1, 2].map((tile) => (
              <Skeleton key={tile} variant="rounded" height={168} sx={{ borderRadius: "22px", bgcolor: "rgba(10, 25, 47, 0.08)" }} />
            ))}
          </Box>
        ) : failed ? (
          <Box sx={{ mt: 3, bgcolor: "#fff", border: "1px solid #E2E8EC", borderRadius: "24px", p: { xs: 3, md: 4 } }}>
            <Typography sx={{ fontWeight: 700, fontSize: 22 }}>Modules could not be loaded</Typography>
            <Typography sx={{ color: muted, mt: 1 }}>Refresh the page and try again.</Typography>
          </Box>
        ) : !subject ? (
          <Box sx={{ mt: 3, bgcolor: "#fff", border: "1px solid #E2E8EC", borderRadius: "24px", p: { xs: 3, md: 4 } }}>
            <Typography sx={{ fontWeight: 700, fontSize: 22 }}>This subject is not on the syllabus</Typography>
            <Typography
              component={Link}
              href="/classes"
              sx={{ display: "inline-block", color: primary, fontWeight: 600, mt: 1.5, textDecoration: "none", "&:hover": { color: primaryHover } }}
            >
              Back to classes
            </Typography>
          </Box>
        ) : modules.length === 0 ? (
          <Box sx={{ mt: 3, bgcolor: "#fff", border: "1px solid #E2E8EC", borderRadius: "24px", p: { xs: 3, md: 4 } }}>
            <Typography sx={{ fontWeight: 700, fontSize: 22 }}>No modules yet</Typography>
            <Typography sx={{ color: muted, mt: 1 }}>Chapters will show here once a module is published.</Typography>
          </Box>
        ) : (
          <Box
            sx={{
              mt: { xs: 3, md: 4 },
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3, 1fr)" },
              gap: 1.5,
            }}
          >
            {modules.map((module) => (
              <Box
                key={module.id}
                component={Link}
                href={modulePath(catalog.classItem, catalog.classes, catalog.subject, catalog.subjects, module, modules)}
                sx={{
                  bgcolor: "#fff",
                  border: "1px solid #E2E8EC",
                  borderRadius: "22px",
                  p: { xs: 2.5, md: 3 },
                  minHeight: 168,
                  textDecoration: "none",
                  color: ink,
                  display: "flex",
                  flexDirection: "column",
                  "&:hover": { borderColor: primary },
                }}
              >
                <Typography sx={{ color: primary, fontSize: 13, fontWeight: 700, letterSpacing: 1.1, textTransform: "uppercase" }}>
                  Module
                </Typography>
                <Typography sx={{ fontWeight: 700, fontSize: { xs: 22, md: 24 }, letterSpacing: -0.4, mt: 1, lineHeight: 1.2 }}>
                  {module.name}
                </Typography>
                <Typography sx={{ color: muted, mt: "auto", pt: 2, fontSize: 14, fontWeight: 600 }}>Open chapters</Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default function Page() {
  return <LegacyClassRedirect kind="subject" />;
}
