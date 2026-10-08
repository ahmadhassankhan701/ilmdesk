"use client";

import { useState } from "react";
import Link from "next/link";
import { Box, Button, Typography } from "@mui/material";
import { pageBackground, pageColumnSx } from "@/lib/pageColumn";
import { teachers } from "@/lib/homeContent";
import { ink, muted, primary, primaryHover } from "@/lib/brand";

const phone = "+92 308 6403836";

const pillButton = {
  textTransform: "none",
  fontWeight: 600,
  borderRadius: 999,
  px: 2.75,
  py: 1.15,
  boxShadow: "none",
  fontSize: 15,
};

const exams = ["MDCAT", "FPSC", "PPSC", "O Level", "A Level", "University entrance"];

const offers = [
  {
    label: "Classes",
    title: "The syllabus stays with the brand",
    body: "Free class chapters are Ilmdesk’s. Teachers attach their own notes, videos, and PDFs to a topic.",
  },
  {
    label: "Courses",
    title: "A course belongs to the teacher",
    body: "Paid courses are a teacher’s own product. Students choose whose resources they want to study.",
  },
  {
    label: "Practice",
    title: "The quiz sits on the chapter",
    body: "Practice questions and tests live next to the lesson they belong to, so revision stays in one place.",
  },
];

const faqs = [
  {
    q: "Who is Ilmdesk for?",
    a: "Students preparing for MDCAT, FPSC, PPSC, O Level, A Level, and university entrance tests. The materials follow those papers: notes, videos, practice questions, and regular updates when the pattern changes.",
  },
  {
    q: "What do you actually get?",
    a: "Study notes, lecture videos, practice questions, online courses, practice tests, and doubt clearing. A topic keeps those pieces together instead of scattering them across chats and drives.",
  },
  {
    q: "How do I reach the desk?",
    a: `Call the Lahore studio on ${phone}, or send a note from the contact page. Class questions, course access, and teaching applications all come to the same place.`,
  },
];

export default function AboutPage() {
  const [open, setOpen] = useState(0);

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
            About Ilmdesk
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
            One brand. The teachers students already know.
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.72)", fontSize: 17, lineHeight: 1.65, maxWidth: 540, mt: 2.5 }}>
            Ilmdesk keeps the class syllabus, paid courses, and quizzes together. Students study with Muhammad Qasim, or with another teacher on the same desk.
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1} mt={3.5}>
            {exams.map((exam) => (
              <Box
                key={exam}
                sx={{
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.16)",
                  borderRadius: 999,
                  px: 1.5,
                  py: 0.6,
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {exam}
              </Box>
            ))}
          </Box>
        </Box>

        <Box
          sx={{
            mt: { xs: 2.5, md: 3 },
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.05fr 0.95fr" },
            gap: 1.5,
            alignItems: "stretch",
          }}
        >
          <Box
            sx={{
              bgcolor: "#fff",
              border: "1px solid #E2E8EC",
              borderRadius: "24px",
              p: { xs: 3, md: 4.5 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography sx={{ color: primary, fontSize: 13, fontWeight: 700, letterSpacing: 1.1, textTransform: "uppercase" }}>
              The desk
            </Typography>
            <Typography sx={{ fontSize: { xs: 28, md: 36 }, fontWeight: 700, letterSpacing: -0.7, mt: 1, lineHeight: 1.12 }}>
              Built around the papers students sit.
            </Typography>
            <Typography sx={{ color: muted, mt: 2, lineHeight: 1.7, fontSize: 16 }}>
              Ilmdesk began as the class desk for competitive chemistry in Lahore and opened the same shelf to other teachers. Biology for MDCAT, English for exams, and the entrance-test subjects share one place.
            </Typography>
            <Typography sx={{ color: muted, mt: 1.5, lineHeight: 1.7, fontSize: 16 }}>
              A free class follows the brand syllabus. A paid course is the teacher’s own. Notes, videos, practice questions, and doubt clearing stay on the chapter they explain.
            </Typography>
          </Box>
          <Box
            sx={{
              borderRadius: "24px",
              minHeight: { xs: 280, md: 420 },
              backgroundImage: "linear-gradient(180deg, rgba(10, 25, 47, 0.05), rgba(10, 25, 47, 0.28)), url(/about.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </Box>

        <Box
          component="section"
          sx={{
            mt: { xs: 2.5, md: 3 },
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: 1.5,
          }}
        >
          {offers.map((item, index) => (
            <Box
              key={item.label}
              sx={{
                bgcolor: index === 1 ? ink : "#fff",
                color: index === 1 ? "#fff" : ink,
                border: index === 1 ? "none" : "1px solid #E2E8EC",
                borderRadius: "24px",
                p: { xs: 3, md: 3.5 },
                minHeight: { md: 240 },
              }}
            >
              <Typography
                sx={{
                  color: primary,
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: 1.1,
                  textTransform: "uppercase",
                }}
              >
                {item.label}
              </Typography>
              <Typography sx={{ fontSize: { xs: 22, md: 26 }, fontWeight: 700, letterSpacing: -0.5, mt: 1.25, lineHeight: 1.2 }}>
                {item.title}
              </Typography>
              <Typography sx={{ color: index === 1 ? "rgba(255,255,255,0.68)" : muted, mt: 1.5, lineHeight: 1.65 }}>
                {item.body}
              </Typography>
            </Box>
          ))}
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
                <Box
                  component="img"
                  src={teacher.image}
                  alt={teacher.name}
                  sx={{ width: "100%", height: 280, objectFit: "cover", objectPosition: "top", display: "block" }}
                />
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
          sx={{
            mt: { xs: 7, md: 10 },
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.15fr 0.85fr" },
            gap: 1.5,
            alignItems: "stretch",
          }}
        >
          <Box sx={{ bgcolor: "#fff", border: "1px solid #E2E8EC", borderRadius: "24px", p: { xs: 2.5, md: 4 } }}>
            <Typography sx={{ color: primary, fontSize: 13, fontWeight: 700, letterSpacing: 1.1, textTransform: "uppercase" }}>
              Questions
            </Typography>
            <Typography sx={{ fontSize: { xs: 28, md: 36 }, fontWeight: 700, letterSpacing: -0.7, mt: 0.75, mb: 1 }}>
              Before you enrol
            </Typography>
            {faqs.map((item, index) => {
              const isOpen = open === index;
              return (
                <Box key={item.q} sx={{ borderTop: "1px solid #E2E8EC" }}>
                  <Box
                    component="button"
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : index)}
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 2,
                      py: 2,
                      px: 0,
                      border: 0,
                      bgcolor: "transparent",
                      color: ink,
                      textAlign: "left",
                      cursor: "pointer",
                      font: "inherit",
                    }}
                  >
                    <Typography sx={{ fontWeight: 600, fontSize: 16 }}>{item.q}</Typography>
                    <Typography sx={{ color: primary, fontWeight: 600, fontSize: 22, lineHeight: 1 }}>{isOpen ? "–" : "+"}</Typography>
                  </Box>
                  {isOpen && <Typography sx={{ color: muted, lineHeight: 1.7, pb: 2, pr: { md: 4 } }}>{item.a}</Typography>}
                </Box>
              );
            })}
          </Box>

          <Box
            sx={{
              borderRadius: "24px",
              p: { xs: 3, md: 4 },
              background: "linear-gradient(160deg, #071322 0%, #0A192F 55%, #123044 100%)",
              color: "#fff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: { md: 360 },
            }}
          >
            <Box>
              <Typography sx={{ color: primary, fontSize: 13, fontWeight: 700, letterSpacing: 1.1, textTransform: "uppercase" }}>
                Lahore studio
              </Typography>
              <Typography sx={{ fontSize: { xs: 28, md: 34 }, fontWeight: 700, letterSpacing: -0.6, mt: 1, lineHeight: 1.15 }}>
                Call if a class or a course needs a person.
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.7)", mt: 2, lineHeight: 1.65 }}>
                Near Shaukat Khanum Hospital, Lahore, Punjab 54500
              </Typography>
              <Typography sx={{ fontSize: { xs: 26, md: 30 }, fontWeight: 700, letterSpacing: -0.4, mt: 2 }}>{phone}</Typography>
            </Box>
            <Box display="flex" gap={1.25} flexWrap="wrap" mt={3}>
              <Button
                component="a"
                href="tel:+923086403836"
                variant="contained"
                sx={{ ...pillButton, bgcolor: primary, color: "#fff", "&:hover": { bgcolor: primaryHover, boxShadow: "none" } }}
              >
                Call the studio
              </Button>
              <Button
                component={Link}
                href="/contact"
                variant="outlined"
                sx={{
                  ...pillButton,
                  borderColor: "rgba(255,255,255,0.35)",
                  color: "#fff",
                  "&:hover": { borderColor: "#fff", backgroundColor: "transparent" },
                }}
              >
                Write a note
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
