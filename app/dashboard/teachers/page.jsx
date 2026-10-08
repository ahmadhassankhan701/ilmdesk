"use client";

import SideBar from "@/components/SideBar";
import PageTitle from "@/components/Dashboard/PageTitle";
import { listTeacherAccounts, setTeacherStatus } from "@/lib/accounts";
import { statusLabel, STATUSES } from "@/lib/roles";
import { useAuth } from "@/context/AuthContext";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function formatWhen(value) {
  if (!value) return "—";
  const date = value.toDate ? value.toDate() : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString();
}

const statusColor = {
  [STATUSES.pending]: "#b54708",
  [STATUSES.active]: "#027a48",
  [STATUSES.rejected]: "#b42318",
};

export default function TeachersPage() {
  const { state, ready } = useAuth();
  const router = useRouter();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");

  useEffect(() => {
    if (!ready) return;
    if (!state.user) {
      router.replace("/auth");
      return;
    }
    if (state.user.role !== "owner") {
      router.replace("/dashboard");
      return;
    }

    let ignore = false;
    const load = async () => {
      try {
        setLoading(true);
        const rows = await listTeacherAccounts();
        if (!ignore) setTeachers(rows);
      } catch (error) {
        console.error(error);
        toast.error("Could not load teacher applications.");
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, [ready, state.user, router]);

  const updateStatus = async (uid, status) => {
    try {
      setSavingId(uid);
      await setTeacherStatus(uid, status);
      setTeachers((current) =>
        current.map((teacher) =>
          teacher.id === uid ? { ...teacher, status } : teacher
        )
      );
      toast.success(status === STATUSES.active ? "Teacher approved" : "Teacher rejected");
    } catch (error) {
      console.error(error);
      toast.error("Could not update this teacher. Deploy the Firestore rules if this is a permission error.");
    } finally {
      setSavingId("");
    }
  };

  return (
    <SideBar>
      <PageTitle
        eyebrow="Owner"
        title="Teachers"
        body="Read the qualification, exams, and teaching note before you approve. An approved teacher can use the dashboard. A pending teacher sees it locked."
      />
      {loading ? (
        <Typography color="#667085">Loading applications…</Typography>
      ) : teachers.length === 0 ? (
        <Box bgcolor="#fff" borderRadius={2} p={3}>
          <Typography color="#002935">No teacher applications yet.</Typography>
        </Box>
      ) : (
        <Box display="flex" flexDirection="column" gap={1.5}>
          {teachers.map((teacher) => (
            <Box
              key={teacher.id}
              bgcolor="#fff"
              borderRadius="22px"
              p={2.5}
              display="flex"
              justifyContent="space-between"
              alignItems={{ xs: "stretch", sm: "center" }}
              flexDirection={{ xs: "column", sm: "row" }}
              gap={2}
            >
              <Box>
                <Typography fontWeight={700} color="#0A192F">
                  {teacher.name || "Unnamed teacher"}
                </Typography>
                <Typography color="#5C6B7A" fontSize={14}>
                  {teacher.email}
                  {teacher.focus ? ` · ${teacher.focus}` : ""}
                </Typography>
                <Typography color="#0A192F" fontSize={14}>
                  {[teacher.qualification, teacher.institution].filter(Boolean).join(" · ") || "No qualification yet"}
                </Typography>
                <Typography color="#0A192F" fontSize={14}>
                  {Array.isArray(teacher.exams) && teacher.exams.length > 0 ? teacher.exams.join(", ") : "No exams listed"}
                </Typography>
                <Typography color="#5C6B7A" fontSize={14} sx={{ maxWidth: 560, mt: 0.5 }}>
                  {teacher.teachingNote || "No teaching note yet"}
                </Typography>
                <Typography fontSize={14} sx={{ color: statusColor[teacher.status] || "#667085" }}>
                  {statusLabel(teacher.status)} · applied {formatWhen(teacher.createdAt)}
                </Typography>
              </Box>
              <Box display="flex" gap={1}>
                <Button
                  variant="contained"
                  disabled={savingId === teacher.id || teacher.status === STATUSES.active}
                  onClick={() => updateStatus(teacher.id, STATUSES.active)}
                  sx={{
                    textTransform: "none",
                    bgcolor: "#027a48",
                    "&:hover": { bgcolor: "#05603a" },
                  }}
                >
                  Approve
                </Button>
                <Button
                  variant="outlined"
                  disabled={savingId === teacher.id || teacher.status === STATUSES.rejected}
                  onClick={() => updateStatus(teacher.id, STATUSES.rejected)}
                  sx={{
                    textTransform: "none",
                    borderColor: "#b42318",
                    color: "#b42318",
                  }}
                >
                  Reject
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </SideBar>
  );
}
