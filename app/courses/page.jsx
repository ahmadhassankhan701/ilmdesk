"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Box, Skeleton, Typography } from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { ink, muted, primary, primaryHover } from "@/lib/brand";
import { pageBackground, pageColumnSx } from "@/lib/pageColumn";
import PageTrail from "@/components/PageTrail";

const LEVELS = [
  ["all", "All levels"],
  ["beginner", "Beginner"],
  ["intermediate", "Intermediate"],
  ["expert", "Expert"],
];

function priceLabel(value) {
  const amount = Number(value);
  if (!value || amount === 0) return "Free";
  return `Rs ${value}`;
}

function levelLabel(value) {
  const found = LEVELS.find(([key]) => key === value);
  return found ? found[1] : "Beginner";
}

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [level, setLevel] = useState("all");
  const [subject, setSubject] = useState("all");

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const snapshot = await getDocs(collection(db, "courses"));
        const items = snapshot.docs
          .map((item) => ({ id: item.id, ...item.data(), modules: item.data().modules || [] }))
          .sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        if (!ignore) setCourses(items);
      } catch (error) {
        console.error(error);
        if (!ignore) setFailed(true);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  const subjects = useMemo(() => {
    const names = [...new Set(courses.map((course) => (course.subject || "").trim()).filter(Boolean))];
    names.sort((a, b) => a.localeCompare(b));
    return names;
  }, [courses]);

  const visible = courses.filter((course) => {
    const courseLevel = course.difficulty || "beginner";
    const courseSubject = (course.subject || "").trim();
    if (level !== "all" && courseLevel !== level) return false;
    if (subject !== "all" && courseSubject !== subject) return false;
    return true;
  });

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
            Paid courses
          </Typography>
          <Typography component="h1" sx={{ color: "#fff", fontWeight: 700, letterSpacing: -1.4, lineHeight: 1.05, fontSize: { xs: 40, sm: 52, md: 64 }, maxWidth: 720 }}>
            A teacher’s course, in one place.
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.72)", fontSize: 17, lineHeight: 1.65, maxWidth: 540, mt: 2.5 }}>
            Pick a subject and a level. Each course keeps its modules, notes, and practice together.
          </Typography>
          <PageTrail onDark items={[{ label: "Home", href: "/" }, { label: "Courses" }]} />
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 3 }}>
          {LEVELS.map(([value, label]) => (
            <FilterPill key={value} selected={level === value} onClick={() => setLevel(value)}>
              {label}
            </FilterPill>
          ))}
        </Box>
        {subjects.length > 0 ? (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1.25 }}>
            <FilterPill selected={subject === "all"} onClick={() => setSubject("all")}>
              All subjects
            </FilterPill>
            {subjects.map((name) => (
              <FilterPill key={name} selected={subject === name} onClick={() => setSubject(name)}>
                {name}
              </FilterPill>
            ))}
          </Box>
        ) : null}

        {loading ? (
          <Box sx={{ mt: 3, display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" }, gap: 1.5 }}>
            {[0, 1, 2].map((item) => (
              <Skeleton key={item} variant="rounded" height={280} sx={{ borderRadius: "22px", bgcolor: "rgba(10, 25, 47, 0.08)" }} />
            ))}
          </Box>
        ) : failed ? (
          <Notice title="Courses could not be loaded" body="Refresh the page and try again." />
        ) : courses.length === 0 ? (
          <Notice title="No courses yet" body="A teacher’s course will show here once it is published." />
        ) : visible.length === 0 ? (
          <Notice title="No courses match these filters" body="Try another level or subject." />
        ) : (
          <Box sx={{ mt: 3, display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" }, gap: 1.5 }}>
            {visible.map((course) => (
              <Box
                key={course.id}
                component={Link}
                href={`/courses/details?id=${course.id}`}
                sx={{
                  textDecoration: "none",
                  color: ink,
                  bgcolor: "#fff",
                  border: "1px solid #E2E8EC",
                  borderRadius: "22px",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  "&:hover": { borderColor: primary },
                }}
              >
                {course.image ? (
                  <Box component="img" src={course.image} alt="" sx={{ width: "100%", height: 168, objectFit: "cover", display: "block", bgcolor: "#E2E8EC" }} />
                ) : (
                  <Box sx={{ height: 8, bgcolor: "#0A192F" }} />
                )}
                <Box sx={{ p: 2.25, display: "flex", flexDirection: "column", gap: 1, flex: 1 }}>
                  <Typography sx={{ color: primary, fontSize: 12, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase" }}>
                    {course.subject || "Course"}
                  </Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: 20, letterSpacing: -0.4, lineHeight: 1.25 }}>{course.title || "Untitled course"}</Typography>
                  <Typography sx={{ color: muted, fontSize: 14 }}>
                    {levelLabel(course.difficulty)} · {course.modules.length === 1 ? "1 module" : `${course.modules.length} modules`}
                  </Typography>
                  <Typography sx={{ fontWeight: 700, mt: "auto", pt: 1 }}>{priceLabel(course.price)}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}

function FilterPill({ selected, onClick, children }) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      sx={{
        border: selected ? "1px solid transparent" : "1px solid #E2E8EC",
        bgcolor: selected ? primary : "#fff",
        color: selected ? "#fff" : ink,
        borderRadius: 999,
        px: 1.7,
        py: 0.75,
        font: "inherit",
        fontWeight: 600,
        fontSize: 14,
        cursor: "pointer",
        "&:hover": { bgcolor: selected ? primaryHover : "rgba(13, 154, 172, 0.08)" },
      }}
    >
      {children}
    </Box>
  );
}

function Notice({ title, body }) {
  return (
    <Box sx={{ mt: 3, bgcolor: "#fff", border: "1px solid #E2E8EC", borderRadius: "24px", p: { xs: 3, md: 4 } }}>
      <Typography sx={{ fontWeight: 700, fontSize: 22 }}>{title}</Typography>
      <Typography sx={{ color: muted, mt: 1 }}>{body}</Typography>
    </Box>
  );
}
