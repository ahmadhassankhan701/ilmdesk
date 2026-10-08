"use client";

import Link from "next/link";
import { Box, Typography } from "@mui/material";
import SideBar from "@/components/SideBar";
import PageTitle from "@/components/Dashboard/PageTitle";

export default function QuizzesPage() {
  return (
    <SideBar>
      <PageTitle
        eyebrow="Practice"
        title="Quizzes"
        body="A quiz lives inside the course or class it belongs to. There is no separate quiz list yet."
      />
      <Box sx={{ bgcolor: "#fff", borderRadius: "22px", p: { xs: 2.5, md: 3.5 }, maxWidth: 640 }}>
        <Typography sx={{ color: "#0A192F", fontWeight: 700, fontSize: 18 }}>Open a course to start one.</Typography>
        <Typography sx={{ color: "#5C6B7A", mt: 1, lineHeight: 1.6 }}>
          Attempts are saved with that quiz. Your enrolled courses are the place to find them.
        </Typography>
        <Link href="/dashboard/courses" style={{ color: "#0D9AAC", fontWeight: 700, display: "inline-block", marginTop: 16 }}>
          Go to my courses
        </Link>
      </Box>
    </SideBar>
  );
}
