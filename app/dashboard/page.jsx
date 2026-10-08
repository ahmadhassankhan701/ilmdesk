"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { ClassOutlined, MenuBookOutlined, QuizOutlined } from "@mui/icons-material";
import SideBar from "@/components/SideBar";
import PageTitle from "@/components/Dashboard/PageTitle";
import { db } from "@/firebase";
import { useAuth } from "@/context/AuthContext";
import { isTeacherWaiting, roleLabel, STATUSES } from "@/lib/roles";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const ink = "#0A192F";
const coral = "#0D9AAC";
const muted = "#5C6B7A";

function asDate(value) {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate();
  if (value.seconds) return new Date(value.seconds * 1000);
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function money(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "—";
  return `Rs ${amount.toLocaleString("en-PK")}`;
}

function statusColor(status) {
  if (status === "approved") return "#1c8c4e";
  if (status === "pending") return coral;
  return muted;
}

function Panel({ title, children }) {
  return (
    <Box sx={{ bgcolor: "#fff", borderRadius: "22px", p: 2.5, height: "100%", border: "1px solid rgba(17,17,19,0.05)" }}>
      <Typography sx={{ fontWeight: 700, color: ink, mb: 2, fontSize: 16 }}>{title}</Typography>
      {children}
    </Box>
  );
}

export default function Dashboard() {
  const { state } = useAuth();
  const user = state?.user;
  const waiting = isTeacherWaiting(user);
  const rejected = waiting && user?.status === STATUSES.rejected;
  const [courses, setCourses] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    if (!user?.uid) return undefined;
    let ignore = false;
    const load = async () => {
      try {
        const [coursesSnap, paymentsSnap] = await Promise.all([
          getDocs(query(collection(db, "courses"), where("students", "array-contains", user.uid))),
          getDocs(query(collection(db, "Payments"), where("userId", "==", user.uid))),
        ]);
        if (ignore) return;
        setCourses(coursesSnap.docs.map((item) => ({ id: item.id, ...item.data() })));
        setPayments(
          paymentsSnap.docs.map((item) => {
            const data = item.data();
            return {
              id: item.id,
              courseName: data.courseName || "Course",
              amount: Number(data.amount) || 0,
              status: data.status || "pending",
              paidAt: asDate(data.paidAt),
            };
          })
        );
      } catch (error) {
        console.error(error);
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, [user?.uid]);

  const summary = useMemo(() => {
    const approved = payments.filter((item) => item.status === "approved");
    const pending = payments.filter((item) => item.status === "pending");
    const paid = approved.reduce((sum, item) => sum + item.amount, 0);
    return {
      courses: courses.length,
      payments: payments.length,
      approved: approved.length,
      pending: pending.length,
      paid,
    };
  }, [courses, payments]);

  const months = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
      return {
        key: `${date.getFullYear()}-${date.getMonth()}`,
        label: date.toLocaleString("en", { month: "short" }),
      };
    });
  }, []);

  const barData = useMemo(() => {
    const totals = Object.fromEntries(months.map((month) => [month.key, 0]));
    payments.forEach((payment) => {
      if (!payment.paidAt) return;
      const key = `${payment.paidAt.getFullYear()}-${payment.paidAt.getMonth()}`;
      if (key in totals) totals[key] += payment.amount;
    });
    return {
      labels: months.map((month) => month.label),
      datasets: [
        {
          label: "Paid",
          data: months.map((month) => totals[month.key]),
          backgroundColor: coral,
          borderRadius: 8,
          maxBarThickness: 28,
        },
      ],
    };
  }, [months, payments]);

  const doughnutData = useMemo(() => {
    const empty = summary.payments === 0;
    return {
      labels: empty ? ["No receipts"] : ["Approved", "Pending", "Other"],
      datasets: [
        {
          data: empty
            ? [1]
            : [summary.approved, summary.pending, Math.max(summary.payments - summary.approved - summary.pending, 0)],
          backgroundColor: empty ? ["#F0F3F5"] : ["#1c8c4e", coral, "#0A192F"],
          borderWidth: 0,
          hoverOffset: 4,
        },
      ],
    };
  }, [summary]);

  const recent = [...payments].sort((a, b) => (b.paidAt?.getTime() || 0) - (a.paidAt?.getTime() || 0)).slice(0, 6);
  const first = (user?.name || "there").split(" ")[0];
  const stats = [
    { label: "Enrolled", value: summary.courses },
    { label: "Payments", value: summary.payments },
    { label: "Approved", value: summary.approved },
    { label: "Awaiting", value: summary.pending },
  ];

  return (
    <SideBar>
      <PageTitle
        eyebrow={roleLabel(user?.role)}
        title={`Hello, ${first}.`}
        body={
          waiting
            ? "Your teaching tools stay closed while this account is reviewed."
            : "Your courses, receipts, and the last six months of payments."
        }
      />
      {waiting && (
        <Box sx={{ mb: 3, p: { xs: 2.5, md: 3 }, borderRadius: "22px", bgcolor: ink, color: "#fff" }}>
          <Typography sx={{ fontWeight: 700, fontSize: 20, letterSpacing: -0.3 }}>
            {rejected ? "This teaching account was not approved." : "Your profile is being verified."}
          </Typography>
          <Typography sx={{ mt: 0.8, color: "rgba(255,255,255,0.72)", maxWidth: 520, lineHeight: 1.6 }}>
            {rejected
              ? "Dashboard tools stay off. The desk will write to you if that decision changes."
              : "Dashboard tools stay off until the owner approves this teaching account."}
          </Typography>
        </Box>
      )}
      <Box sx={{ opacity: waiting ? 0.4 : 1, pointerEvents: waiting ? "none" : "auto", pb: { xs: 4, md: 6 } }}>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {stats.map((stat) => (
            <Grid key={stat.label} size={{ xs: 6, md: 3 }}>
              <Box sx={{ bgcolor: "#fff", borderRadius: "22px", p: 2.25, borderTop: `3px solid ${coral}` }}>
                <Typography sx={{ color: muted, fontSize: 12, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase" }}>
                  {stat.label}
                </Typography>
                <Typography sx={{ mt: 0.4, fontSize: 32, fontWeight: 700, letterSpacing: -1, color: ink }}>{stat.value}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={2} sx={{ mb: { xs: 6, md: 10 } }}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Panel title="Payments, last 6 months">
              <Box sx={{ position: "relative", height: 260 }}>
                <Bar
                  data={barData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      x: { grid: { display: false }, ticks: { color: muted } },
                      y: { grid: { color: "rgba(17,17,19,0.06)" }, ticks: { color: muted }, beginAtZero: true },
                    },
                  }}
                />
              </Box>
            </Panel>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Panel title="Receipt status">
              <Box sx={{ position: "relative", height: 240, overflow: "hidden" }}>
                <Doughnut
                  data={doughnutData}
                  options={{
                    cutout: "68%",
                    plugins: {
                      legend: { position: "bottom", labels: { boxWidth: 10, color: ink, font: { family: "Poppins" } } },
                    },
                  }}
                />
              </Box>
            </Panel>
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ mt: { xs: 2, md: 4 } }}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Panel title="Recent payments">
              {recent.length === 0 ? (
                <Typography sx={{ color: muted }}>No receipts yet. They appear here after checkout.</Typography>
              ) : (
                <Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
                  <Box component="thead">
                    <Box component="tr">
                      {["Course", "Amount", "Status", "Date"].map((heading) => (
                        <Box
                          component="th"
                          key={heading}
                          sx={{ textAlign: "left", fontSize: 11, letterSpacing: 0.8, textTransform: "uppercase", color: muted, fontWeight: 700, pb: 1 }}
                        >
                          {heading}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                  <Box component="tbody">
                    {recent.map((payment) => (
                      <Box component="tr" key={payment.id} sx={{ borderTop: "1px solid rgba(17,17,19,0.06)" }}>
                        <Box component="td" sx={{ py: 1.25, pr: 1, color: ink, fontWeight: 600, fontSize: 14 }}>
                          {payment.courseName}
                        </Box>
                        <Box component="td" sx={{ py: 1.25, pr: 1, color: ink, fontSize: 14 }}>
                          {money(payment.amount)}
                        </Box>
                        <Box component="td" sx={{ py: 1.25, pr: 1, color: statusColor(payment.status), fontWeight: 700, fontSize: 13, textTransform: "capitalize" }}>
                          {payment.status}
                        </Box>
                        <Box component="td" sx={{ py: 1.25, color: muted, fontSize: 13 }}>
                          {payment.paidAt ? payment.paidAt.toLocaleDateString() : "—"}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </Panel>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, height: "100%" }}>
              <Link href="/dashboard/courses" style={{ textDecoration: "none" }}>
                <Box sx={{ bgcolor: ink, color: "#fff", borderRadius: "22px", p: 2.5 }}>
                  <ClassOutlined sx={{ color: coral }} />
                  <Typography sx={{ fontWeight: 700, fontSize: 18, mt: 1 }}>My courses</Typography>
                  <Typography sx={{ color: "rgba(255,255,255,0.68)", mt: 0.5, fontSize: 14 }}>
                    {summary.courses === 0 ? "None enrolled yet." : `${summary.courses} ready to open.`}
                  </Typography>
                </Box>
              </Link>
              <Link href="/classes" style={{ textDecoration: "none" }}>
                <Box sx={{ bgcolor: "#fff", borderRadius: "22px", p: 2.5, border: "1px solid rgba(17,17,19,0.05)" }}>
                  <MenuBookOutlined sx={{ color: coral }} />
                  <Typography sx={{ fontWeight: 700, fontSize: 18, mt: 1, color: ink }}>Free classes</Typography>
                  <Typography sx={{ color: muted, mt: 0.5, fontSize: 14 }}>Chemistry, biology, and English on the open desk.</Typography>
                </Box>
              </Link>
              <Link href="/dashboard/quizzes" style={{ textDecoration: "none" }}>
                <Box sx={{ bgcolor: "#fff", borderRadius: "22px", p: 2.5, border: "1px solid rgba(17,17,19,0.05)" }}>
                  <QuizOutlined sx={{ color: coral }} />
                  <Typography sx={{ fontWeight: 700, fontSize: 18, mt: 1, color: ink }}>Quizzes</Typography>
                  <Typography sx={{ color: muted, mt: 0.5, fontSize: 14 }}>Practice sits inside each course.</Typography>
                </Box>
              </Link>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </SideBar>
  );
}
