"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Box, Button, Typography } from "@mui/material";
import { FacebookOutlined, WhatsApp, YouTube } from "@mui/icons-material";
import { pageBackground, pageColumnSx } from "@/lib/pageColumn";
import {
  classPreview,
  courses,
  homeStats,
  quotes,
  subjects,
  teachers,
} from "@/lib/homeContent";

const socials = [
  {
    label: "WhatsApp",
    href: "https://whatsapp.com/channel/0029VaCUDxF5fM5an8mLcp34",
    icon: <WhatsApp sx={{ fontSize: 18 }} />,
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@qasimmahi?si=T1GWa_w274PUNZtt",
    icon: <YouTube sx={{ fontSize: 18 }} />,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/1Fw8GGhhYC/",
    icon: <FacebookOutlined sx={{ fontSize: 18 }} />,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@ilmdesk?_r=1&_t=ZN-91wTgPxbK5e",
    icon: (
      <Box component="svg" viewBox="0 0 24 24" sx={{ width: 16, height: 16, fill: "currentColor" }}>
        <path d="M14.5 3c.4 2.4 1.8 3.9 4.2 4.1v2.4c-1.4 0-2.7-.4-3.9-1.2v6.4c0 3.4-2.6 6.1-6.1 6.1S2.6 18.1 2.6 14.7 5.2 8.6 8.7 8.6c.4 0 .8 0 1.2.1v2.6c-.4-.2-.8-.3-1.2-.3-2 0-3.5 1.6-3.5 3.7s1.6 3.7 3.5 3.7 3.4-1.6 3.4-3.6V3h2.4Z" />
      </Box>
    ),
  },
];

const ink = "#0A192F";
const primary = "#0D9AAC";
const accent = "#FF6B6B";
const accentHover = "#E85D5D";
const muted = "#5C6B7A";

const pillButton = {
  textTransform: "none",
  fontWeight: 600,
  borderRadius: 999,
  px: 2.75,
  py: 1.15,
  boxShadow: "none",
  fontSize: 15,
};

export default function Home() {
  const route = useRouter();
  const featured = courses[0];
  const rest = courses.slice(1);

  return (
    <Box sx={{ bgcolor: pageBackground, color: ink, pt: { xs: "96px", md: "112px" }, pb: { xs: 8, md: 12 } }}>
      <Box sx={pageColumnSx}>
        <Box
          component="section"
          sx={{
            position: "relative",
            borderRadius: { xs: "24px", md: "32px" },
            background: "linear-gradient(145deg, #0A192F 0%, #071322 55%, #123044 100%)",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.05fr 0.95fr" },
            minHeight: { md: 560 },
          }}
        >
          <Box sx={{ p: { xs: 3, sm: 4.5, md: 6 }, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <Typography
              component="p"
              sx={{
                alignSelf: "flex-start",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.16)",
                borderRadius: 999,
                px: 1.5,
                py: 0.4,
                fontSize: 12,
                letterSpacing: 0.6,
                mb: 2.5,
              }}
            >
              Now enrolling · 2026 session
            </Typography>
            <Typography
              component="h1"
              sx={{
                color: "#fff",
                fontWeight: 700,
                letterSpacing: -1.6,
                lineHeight: 1.02,
                fontSize: { xs: 40, sm: 52, md: 64 },
                maxWidth: 560,
              }}
            >
              Study with the teacher, not a pile of files.
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.72)", fontSize: 17, lineHeight: 1.65, maxWidth: 460, mt: 2.5, mb: 3.5 }}>
              Ilmdesk keeps the class syllabus, paid courses, and quizzes in one place, under the teachers you already know.
            </Typography>
            <Box display="flex" gap={1.25} flexWrap="wrap" mb={3.5}>
              <Button
                variant="contained"
                onClick={() => route.push("/auth/register")}
                sx={{ ...pillButton, bgcolor: accent, color: "#fff", "&:hover": { bgcolor: accentHover, boxShadow: "none" } }}
              >
                Get started
              </Button>
              <Button
                variant="outlined"
                onClick={() => route.push("/courses")}
                sx={{
                  ...pillButton,
                  borderColor: "rgba(255,255,255,0.28)",
                  color: "#fff",
                  "&:hover": { borderColor: "#fff", backgroundColor: "transparent" },
                }}
              >
                Browse courses
              </Button>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              {socials.map((item) => (
                <Box
                  key={item.label}
                  component="a"
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.label}
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.16)",
                    color: "#fff",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    "&:hover": { color: primary, borderColor: primary },
                  }}
                >
                  {item.icon}
                </Box>
              ))}
            </Box>
          </Box>

          <Box
            sx={{
              minHeight: { xs: 280, md: "100%" },
              backgroundImage: "linear-gradient(180deg, rgba(10, 25, 47,0.05), rgba(10, 25, 47,0.45)), url(/homeBanner.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: { xs: "0 0 24px 24px", md: "0 32px 32px 0" },
            }}
          />
          <Box
            sx={{
              position: "absolute",
              zIndex: 2,
              left: { xs: 16, md: "auto" },
              right: { xs: 16, md: 28 },
              bottom: { xs: 16, md: 56 },
              width: { md: 280 },
              bgcolor: "rgba(255,255,255,0.96)",
              borderRadius: "18px",
              p: 2,
              boxShadow: "0 16px 40px rgba(10, 25, 47,0.18)",
            }}
          >
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: primary, letterSpacing: 0.4 }}>
              {featured.level}
            </Typography>
            <Typography sx={{ fontWeight: 700, fontSize: 18, mt: 0.5 }}>{featured.title}</Typography>
            <Typography sx={{ color: muted, fontSize: 14, mt: 0.5 }}>
              {featured.lessons} lessons · {featured.teacher}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            mt: { xs: 2, md: -4 },
            mx: { md: 4 },
            position: "relative",
            zIndex: 1,
            bgcolor: "#fff",
            borderRadius: "20px",
            border: "1px solid #E2E8EC",
            display: "grid",
            gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
            boxShadow: "0 18px 40px rgba(10, 25, 47,0.06)",
          }}
        >
          {homeStats.map((stat, index) => (
            <Box
              key={stat.label}
              sx={{
                px: { xs: 2, md: 3 },
                py: 2.5,
                borderRight: { md: index < homeStats.length - 1 ? "1px solid #E2E8EC" : "none" },
                borderBottom: { xs: index < 2 ? "1px solid #E2E8EC" : "none", md: "none" },
              }}
            >
              <Typography sx={{ fontSize: { xs: 26, md: 30 }, fontWeight: 700, letterSpacing: -0.6 }}>
                {stat.value}
              </Typography>
              <Typography sx={{ color: muted, fontSize: 14, mt: 0.25 }}>{stat.label}</Typography>
            </Box>
          ))}
        </Box>

        <Box component="section" sx={{ pt: { xs: 7, md: 10 } }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-end" gap={2} mb={2.5}>
            <Box>
              <Typography sx={{ color: primary, fontSize: 13, fontWeight: 700, letterSpacing: 1.1, textTransform: "uppercase" }}>
                Subjects
              </Typography>
              <Typography sx={{ fontSize: { xs: 30, md: 40 }, fontWeight: 700, letterSpacing: -0.8, mt: 0.5 }}>
                Start from the subject you have tonight
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
              gap: 1.5,
            }}
          >
            {subjects.map((subject) => (
              <Box
                key={subject.name}
                component={Link}
                href={subject.href}
                sx={{
                  position: "relative",
                  minHeight: { xs: 150, md: 210 },
                  borderRadius: "18px",
                  overflow: "hidden",
                  textDecoration: "none",
                  backgroundImage: `linear-gradient(180deg, rgba(10, 25, 47,0.1), rgba(10, 25, 47,0.78)), url(${subject.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  display: "flex",
                  alignItems: "flex-end",
                  p: 2,
                  color: "#fff",
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: 20 }}>{subject.name}</Typography>
                  <Typography sx={{ fontSize: 13, color: "rgba(255,255,255,0.78)" }}>{subject.level}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        <Box component="section" sx={{ pt: { xs: 7, md: 10 } }}>
          <Box display="flex" justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "flex-end" }} gap={2} mb={2.5} flexWrap="wrap">
            <Box>
              <Typography sx={{ color: primary, fontSize: 13, fontWeight: 700, letterSpacing: 1.1, textTransform: "uppercase" }}>
                Courses
              </Typography>
              <Typography sx={{ fontSize: { xs: 30, md: 40 }, fontWeight: 700, letterSpacing: -0.8, mt: 0.5 }}>
                Courses open this session
              </Typography>
            </Box>
            <Button onClick={() => route.push("/courses")} sx={{ color: ink, textTransform: "none", fontWeight: 700 }}>
              View the catalog
            </Button>
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1.35fr 1fr" },
              gap: 1.5,
            }}
          >
            <Box
              component={Link}
              href="/courses"
              sx={{
                textDecoration: "none",
                color: "inherit",
                bgcolor: "#fff",
                borderRadius: "22px",
                overflow: "hidden",
                border: "1px solid #E2E8EC",
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "0.9fr 1.1fr" },
                minHeight: { sm: 340 },
              }}
            >
              <Box
                sx={{
                  minHeight: 200,
                  backgroundImage: `url(${featured.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <Box sx={{ p: { xs: 2.5, md: 3.5 }, display: "flex", flexDirection: "column" }}>
                <Typography sx={{ color: primary, fontWeight: 700, fontSize: 13 }}>{featured.subject}</Typography>
                <Typography sx={{ fontSize: { xs: 26, md: 32 }, fontWeight: 700, letterSpacing: -0.6, mt: 1, lineHeight: 1.15 }}>
                  {featured.title}
                </Typography>
                <Typography sx={{ color: muted, mt: 1.5, lineHeight: 1.6 }}>{featured.blurb}</Typography>
                <Box sx={{ mt: "auto", pt: 3, display: "flex", alignItems: "center", gap: 1.25 }}>
                  <Box component="img" src={featured.avatar} alt="" sx={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} />
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{featured.teacher}</Typography>
                    <Typography sx={{ color: muted, fontSize: 13 }}>
                      {featured.lessons} lessons · Rs {featured.price}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box sx={{ display: "grid", gap: 1.5 }}>
              {rest.map((course) => (
                <Box
                  key={course.title}
                  component={Link}
                  href="/courses"
                  sx={{
                    textDecoration: "none",
                    color: "inherit",
                    bgcolor: "#fff",
                    border: "1px solid #E2E8EC",
                    borderRadius: "22px",
                    overflow: "hidden",
                    display: "grid",
                    gridTemplateColumns: "112px 1fr",
                    minHeight: 150,
                  }}
                >
                  <Box sx={{ backgroundImage: `url(${course.image})`, backgroundSize: "cover", backgroundPosition: "center" }} />
                  <Box sx={{ p: 2 }}>
                    <Typography sx={{ color: primary, fontSize: 12, fontWeight: 700 }}>{course.level}</Typography>
                    <Typography sx={{ fontWeight: 700, fontSize: 18, lineHeight: 1.25, mt: 0.4 }}>{course.title}</Typography>
                    <Typography sx={{ color: muted, fontSize: 13, mt: 0.75 }}>
                      {course.teacher} · Rs {course.price}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        <Box
          component="section"
          sx={{
            mt: { xs: 7, md: 10 },
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "0.9fr 1.1fr" },
            gap: 2,
            bgcolor: "#fff",
            border: "1px solid #E2E8EC",
            borderRadius: "28px",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              minHeight: { xs: 220, md: 420 },
              backgroundImage: `linear-gradient(180deg, rgba(10, 25, 47,0.05), rgba(10, 25, 47,0.35)), url(${classPreview.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <Box sx={{ p: { xs: 3, md: 5 } }}>
            <Typography sx={{ color: primary, fontSize: 13, fontWeight: 700, letterSpacing: 1.1, textTransform: "uppercase" }}>
              Free classes
            </Typography>
            <Typography sx={{ fontSize: { xs: 28, md: 36 }, fontWeight: 700, letterSpacing: -0.7, mt: 1 }}>
              {classPreview.grade} {classPreview.subject}
            </Typography>
            <Typography sx={{ color: muted, mt: 1, mb: 2.5 }}>
              The syllabus is already arranged. Open a chapter and the topics are waiting.
            </Typography>
            {classPreview.chapters.map((chapter, index) => (
              <Box
                key={chapter.name}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  py: 1.35,
                  borderTop: "1px solid #E2E8EC",
                }}
              >
                <Typography sx={{ fontWeight: 600 }}>
                  <Box component="span" sx={{ color: "#8A97A3", mr: 1.5, fontSize: 13 }}>
                    0{index + 1}
                  </Box>
                  {chapter.name}
                </Typography>
                <Typography sx={{ color: muted, fontSize: 14 }}>{chapter.topics} topics</Typography>
              </Box>
            ))}
            <Button
              onClick={() => route.push("/classes")}
              sx={{ ...pillButton, mt: 2.5, bgcolor: ink, color: "#fff", "&:hover": { bgcolor: "#132A46" } }}
            >
              Open classes
            </Button>
          </Box>
        </Box>

        <Box component="section" sx={{ pt: { xs: 7, md: 10 } }}>
          <Typography sx={{ color: primary, fontSize: 13, fontWeight: 700, letterSpacing: 1.1, textTransform: "uppercase" }}>
            Teachers
          </Typography>
          <Typography sx={{ fontSize: { xs: 30, md: 40 }, fontWeight: 700, letterSpacing: -0.8, mt: 0.5, mb: 2.5 }}>
            The people behind the lessons
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 1.5 }}>
            {teachers.map((teacher) => (
              <Box key={teacher.name} sx={{ bgcolor: "#fff", border: "1px solid #E2E8EC", borderRadius: "22px", overflow: "hidden" }}>
                <Box component="img" src={teacher.image} alt="" sx={{ width: "100%", height: 280, objectFit: "cover", objectPosition: "top", display: "block" }} />
                <Box sx={{ p: 2.5 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: 20 }}>{teacher.name}</Typography>
                  <Typography sx={{ color: primary, fontWeight: 600, fontSize: 14, mt: 0.25 }}>{teacher.role}</Typography>
                  <Typography sx={{ color: muted, mt: 1.25, lineHeight: 1.55 }}>{teacher.line}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        <Box
          component="section"
          sx={{
            mt: { xs: 7, md: 10 },
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.2fr 0.8fr" },
            gap: 1.5,
          }}
        >
          {quotes.map((quote, index) => (
            <Box
              key={quote.name}
              sx={{
                bgcolor: index === 0 ? ink : "#fff",
                color: index === 0 ? "#fff" : ink,
                borderRadius: "24px",
                p: { xs: 3, md: 4 },
                border: index === 0 ? "none" : "1px solid #E2E8EC",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: { md: 260 },
              }}
            >
              <Typography sx={{ fontSize: index === 0 ? { xs: 24, md: 30 } : 20, fontWeight: 600, letterSpacing: -0.4, lineHeight: 1.35 }}>
                “{quote.text}”
              </Typography>
              <Box sx={{ mt: 3 }}>
                <Typography sx={{ fontWeight: 700 }}>{quote.name}</Typography>
                <Typography sx={{ color: index === 0 ? "rgba(255,255,255,0.65)" : muted, fontSize: 14 }}>{quote.detail}</Typography>
              </Box>
            </Box>
          ))}
        </Box>

        <Box
          component="section"
          sx={{
            mt: { xs: 7, md: 10 },
            borderRadius: "28px",
            px: { xs: 3, md: 6 },
            py: { xs: 5, md: 6 },
            background: `linear-gradient(120deg, #071322 0%, #0A192F 42%, #123044 100%)`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "center" },
            gap: 3,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Box>
            <Typography sx={{ color: "#fff", fontSize: { xs: 30, md: 40 }, fontWeight: 700, letterSpacing: -0.8, maxWidth: 520, lineHeight: 1.1 }}>
              Join as a student, or bring your own classes to the brand.
            </Typography>
          </Box>
          <Box display="flex" gap={1.25} flexWrap="wrap">
            <Button
              variant="contained"
              onClick={() => route.push("/auth/register")}
              sx={{ ...pillButton, bgcolor: accent, color: "#fff", "&:hover": { bgcolor: accentHover, boxShadow: "none" } }}
            >
              Create an account
            </Button>
            <Button
              variant="outlined"
              onClick={() => route.push("/auth/register")}
              sx={{
                ...pillButton,
                borderColor: "rgba(255,255,255,0.35)",
                color: "#fff",
                "&:hover": { borderColor: "#fff", backgroundColor: "transparent" },
              }}
            >
              Apply to teach
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
