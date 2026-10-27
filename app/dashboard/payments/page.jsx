"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Typography } from "@mui/material";
import { toast } from "react-toastify";
import SideBar from "@/components/SideBar";
import PageTitle from "@/components/Dashboard/PageTitle";
import ConfirmDeleteDialog from "@/components/Dashboard/ConfirmDeleteDialog";
import { useAuth } from "@/context/AuthContext";
import { approvePayment, accountEmail, deletePayment, listPayments, rejectPayment } from "@/lib/payments";
import { requestDeskEmail } from "@/lib/deskNotify";
import { accent, muted, primary, primaryHover } from "@/lib/brand";

function formatWhen(value) {
  const date = value?.toDate ? value.toDate() : value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return "";
  return date.toLocaleString();
}

const statusLabel = {
  pending: "Waiting",
  approved: "Confirmed",
  rejected: "Rejected",
};

export default function PaymentsDesk() {
  const { state, ready } = useAuth();
  const router = useRouter();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);

  useEffect(() => {
    if (!ready) return undefined;
    if (!state.user) {
      router.replace("/auth");
      return undefined;
    }
    if (state.user.role !== "owner") {
      router.replace("/dashboard");
      return undefined;
    }
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        const rows = await listPayments();
        if (!ignore) setPayments(rows);
      } catch (error) {
        console.error(error);
        toast.error("Could not load payment requests.");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [ready, state.user, router]);

  const mailAboutPayment = async (payment, kind) => {
    try {
      const to = await accountEmail(payment.userId);
      if (!to) return "This account has no email address.";
      await requestDeskEmail({
        type: "payment",
        kind,
        to,
        name: payment.userName,
        courseName: payment.courseName,
        amount: payment.amount,
      });
      return "";
    } catch (error) {
      console.error(error);
      return error?.message || "The email could not be sent.";
    }
  };

  const run = async (payment, action) => {
    try {
      setSavingId(payment.id);
      if (action === "approve") {
        await approvePayment(payment);
        setPayments((current) => current.map((item) => (item.id === payment.id ? { ...item, status: "approved" } : item)));
        const mailError = await mailAboutPayment(payment, "approved");
        if (mailError) toast.error(`Payment confirmed. ${mailError}`);
        else toast.success("Payment confirmed. The student and the desk were emailed.");
      } else if (action === "reject") {
        await rejectPayment(payment);
        setPayments((current) => current.map((item) => (item.id === payment.id ? { ...item, status: "rejected" } : item)));
        const mailError = await mailAboutPayment(payment, "rejected");
        if (mailError) toast.error(`Payment rejected. ${mailError}`);
        else toast.success("Payment rejected. The student and the desk were emailed.");
      } else {
        await deletePayment(payment);
        setPayments((current) => current.filter((item) => item.id !== payment.id));
        setPendingDelete(null);
        toast.success("Payment deleted.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Could not update this payment.");
    } finally {
      setSavingId("");
    }
  };

  return (
    <SideBar>
      <PageTitle
        eyebrow="Owner"
        title="Payments"
        body="Confirm a receipt to open the course. Reject leaves it closed. Delete removes the request."
      />
      {loading ? (
        <Typography sx={{ color: muted }}>Loading payments…</Typography>
      ) : payments.length === 0 ? (
        <Box sx={{ bgcolor: "#fff", borderRadius: "22px", p: 3 }}>
          <Typography sx={{ fontWeight: 700, color: "#0A192F" }}>No payment requests yet.</Typography>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {payments.map((payment) => (
            <Box key={payment.id} sx={{ bgcolor: "#fff", borderRadius: "22px", p: { xs: 2, md: 2.5 }, border: "1px solid #E2E8EC" }}>
              <Typography sx={{ fontWeight: 700, fontSize: 18, color: "#0A192F" }}>{payment.courseName || "Course"}</Typography>
              <Typography sx={{ color: muted, mt: 0.4 }}>
                {payment.userName || "Student"} · Rs {payment.amount || 0} · {statusLabel[payment.status] || payment.status}
              </Typography>
              <Typography sx={{ color: muted, fontSize: 13, mt: 0.4 }}>{formatWhen(payment.paidAt)}</Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 2 }}>
                {payment.receiptUrl ? (
                  <Button
                    component="a"
                    href={payment.receiptUrl}
                    target="_blank"
                    rel="noreferrer"
                    sx={{ textTransform: "none", fontWeight: 600, borderRadius: 999, color: primary, border: "1px solid #E2E8EC" }}
                  >
                    View receipt
                  </Button>
                ) : null}
                <Button
                  disabled={savingId === payment.id || payment.status === "approved"}
                  onClick={() => run(payment, "approve")}
                  sx={{ textTransform: "none", fontWeight: 600, borderRadius: 999, bgcolor: primary, color: "#fff", "&:hover": { bgcolor: primaryHover } }}
                >
                  Approve
                </Button>
                <Button
                  disabled={savingId === payment.id || payment.status === "rejected"}
                  onClick={() => run(payment, "reject")}
                  sx={{ textTransform: "none", fontWeight: 600, borderRadius: 999, color: accent, border: `1px solid ${accent}` }}
                >
                  Reject
                </Button>
                <Button
                  disabled={savingId === payment.id}
                  onClick={() => setPendingDelete(payment)}
                  sx={{ textTransform: "none", fontWeight: 600, borderRadius: 999, color: muted }}
                >
                  Delete
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      )}
      <ConfirmDeleteDialog
        open={Boolean(pendingDelete)}
        title="Delete this payment?"
        body="This removes the receipt. If it was confirmed, the student loses access to that course. This cannot be undone."
        confirmLabel="Delete payment"
        busy={savingId === pendingDelete?.id}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => pendingDelete && run(pendingDelete, "delete")}
      />
    </SideBar>
  );
}
