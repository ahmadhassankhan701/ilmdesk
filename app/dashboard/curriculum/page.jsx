"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Box, Button, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { ChevronRight } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import SideBar from "@/components/SideBar";
import PageTitle from "@/components/Dashboard/PageTitle";
import { accent, ink, muted, pillButton, primary, primaryHover } from "@/components/AuthFrame";
import { useAuth } from "@/context/AuthContext";
import { listClassItems, listCourses } from "@/lib/curriculum";
import { ROLES } from "@/lib/roles";

const pine = "#0D9AAC";

function Kind({ label, tone }) {
  const color = tone === "course" ? accent : pine;
  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        px: 1,
        py: 0.25,
        borderRadius: "999px",
        bgcolor: tone === "course" ? "rgba(255, 107, 107, 0.14)" : "rgba(13, 154, 172, 0.12)",
        color,
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: 0.2,
      }}
    >
      {label}
    </Box>
  );
}

export default function CurriculumPage() {
  const { state, ready } = useAuth();
  const router = useRouter();
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready) return;
    if (!state.user) router.replace("/auth");
    else if (state.user.role !== ROLES.owner) router.replace("/dashboard");
  }, [ready, state.user, router]);

  useEffect(() => {
    if (!ready || state.user?.role !== ROLES.owner) return undefined;
    let ignore = false;
    const load = async () => {
      try {
        setLoading(true);
        const [classRows, courseRows] = await Promise.all([listClassItems(0, null), listCourses()]);
        if (ignore) return;
        setClasses(classRows);
        setCourses(courseRows);
      } catch (error) {
        console.error(error);
        toast.error("Could not load your curriculum.");
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, [ready, state.user]);

  if (!ready || state.user?.role !== ROLES.owner) return null;

  return (
    <SideBar>
      <Box sx={{ pb: { xs: 4, md: 6 } }}>
        <PageTitle
          eyebrow="Brand admin"
          title="Curriculum"
          body="These are the classes and courses you teach. Open a row to continue it, or start a new one."
        />
        <Box sx={{ bgcolor: "#fff", borderRadius: "22px", border: "1px solid #E2E8EC", overflow: "hidden" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1.5, flexWrap: "wrap", alignItems: "center", px: { xs: 2, md: 2.5 }, py: 2, borderBottom: "1px solid #E2E8EC" }}>
            <Box>
              <Typography sx={{ fontWeight: 700, color: ink, fontSize: 22 }}>Your classes and courses</Typography>
              <Typography sx={{ color: muted, fontSize: 14, mt: 0.3 }}>Open a row to keep building it.</Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Button component={Link} href="/dashboard/curriculum/class/new" sx={{ ...pillButton, width: "auto", py: 0.8, bgcolor: pine, color: "#fff", "&:hover": { bgcolor: "#0A8494" } }}>
                New class
              </Button>
              <Button component={Link} href="/dashboard/curriculum/course/new" sx={{ ...pillButton, width: "auto", py: 0.8, bgcolor: primary, color: "#fff", "&:hover": { bgcolor: primaryHover, boxShadow: "none" } }}>
                New course
              </Button>
            </Box>
          </Box>
          {loading ? (
            <Typography sx={{ color: muted, px: { xs: 2, md: 2.5 }, py: 3 }}>Loading…</Typography>
          ) : classes.length === 0 && courses.length === 0 ? (
            <Typography sx={{ color: muted, px: { xs: 2, md: 2.5 }, py: 3 }}>No classes or courses yet.</Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  {["Name", "Kind", "Details", ""].map((label) => (
                    <TableCell
                      key={label || "open"}
                      align={label ? "left" : "right"}
                      sx={{
                        bgcolor: "#F0F3F5",
                        color: pine,
                        fontWeight: 700,
                        fontSize: 12,
                        letterSpacing: 0.8,
                        textTransform: "uppercase",
                        borderBottom: "1px solid #E2E8EC",
                        py: 1.6,
                      }}
                    >
                      {label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {classes.map((item) => (
                  <TableRow
                    key={`class-${item.id}`}
                    hover
                    sx={{ cursor: "pointer", "&:last-child td": { borderBottom: 0 }, "&:hover": { bgcolor: "#F7F9FA" } }}
                    onClick={() => router.push(`/dashboard/curriculum/class/${item.id}`)}
                  >
                    <TableCell sx={{ fontWeight: 650, color: ink, py: 2, borderColor: "#E2E8EC", fontSize: 15 }}>{item.name}</TableCell>
                    <TableCell sx={{ py: 2, borderColor: "#E2E8EC" }}><Kind label="Class" tone="class" /></TableCell>
                    <TableCell sx={{ color: muted, py: 2, borderColor: "#E2E8EC" }}>Free class syllabus</TableCell>
                    <TableCell align="right" sx={{ py: 2, borderColor: "#E2E8EC", color: pine }}><ChevronRight /></TableCell>
                  </TableRow>
                ))}
                {courses.map((item) => (
                  <TableRow
                    key={`course-${item.id}`}
                    hover
                    sx={{ cursor: "pointer", "&:last-child td": { borderBottom: 0 }, "&:hover": { bgcolor: "#F7F9FA" } }}
                    onClick={() => router.push(`/dashboard/curriculum/course/${item.id}`)}
                  >
                    <TableCell sx={{ fontWeight: 650, color: ink, py: 2, borderColor: "#E2E8EC", fontSize: 15 }}>{item.title}</TableCell>
                    <TableCell sx={{ py: 2, borderColor: "#E2E8EC" }}><Kind label="Course" tone="course" /></TableCell>
                    <TableCell sx={{ color: muted, py: 2, borderColor: "#E2E8EC" }}>{item.subject || "Subject"} · {(item.modules || []).length} modules · Rs {item.price || "0"}</TableCell>
                    <TableCell align="right" sx={{ py: 2, borderColor: "#E2E8EC", color: accent }}><ChevronRight /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Box>
      </Box>
    </SideBar>
  );
}
