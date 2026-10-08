"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Typography } from "@mui/material";
import { toast } from "react-toastify";
import SideBar from "@/components/SideBar";
import PageTitle from "@/components/Dashboard/PageTitle";
import { useAuth } from "@/context/AuthContext";
import { deleteClassReview, listClassReviews, setClassReviewStatus } from "@/lib/classReviews";
import { requestReviewEmail } from "@/lib/reviewNotify";
import { accent, muted, primary, primaryHover } from "@/lib/brand";

function formatWhen(value) {
  const date = value?.toDate ? value.toDate() : value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString();
}

const statusLabel = {
  pending: "Waiting",
  approved: "Published",
  rejected: "Declined",
};

export default function ReviewsPage() {
  const { state, ready } = useAuth();
  const router = useRouter();
  const [reviews, setReviews] = useState([]);
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
    (async () => {
      try {
        setLoading(true);
        const rows = await listClassReviews();
        if (!ignore) setReviews(rows);
      } catch (error) {
        console.error(error);
        toast.error("Could not load lesson reviews.");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [ready, state.user, router]);

  const mailStudent = async (review, kind) => {
    try {
      await requestReviewEmail(review, kind);
      return "";
    } catch (error) {
      console.error(error);
      return error?.message || "The email could not be sent.";
    }
  };

  const approveReview = async (review) => {
    try {
      setSavingId(review.id);
      await setClassReviewStatus(review.id, "approved");
      setReviews((current) => current.map((item) => (item.id === review.id ? { ...item, status: "approved" } : item)));
      const mailError = await mailStudent(review, "approved");
      if (mailError) toast.error(`Review approved. ${mailError}`);
      else toast.success("Review approved");
    } catch (error) {
      console.error(error);
      toast.error("Could not approve this review. Deploy the Firestore rules if this is a permission error.");
    } finally {
      setSavingId("");
    }
  };

  const removeReview = async (review, mail) => {
    try {
      setSavingId(review.id);
      await deleteClassReview(review.id);
      setReviews((current) => current.filter((item) => item.id !== review.id));
      if (!mail) {
        toast.success("Review deleted");
        return;
      }
      const mailError = await mailStudent(review, "rejected");
      if (mailError) toast.error(`Review rejected. ${mailError}`);
      else toast.success("Review rejected");
    } catch (error) {
      console.error(error);
      toast.error("Could not delete this review. Deploy the Firestore rules if this is a permission error.");
    } finally {
      setSavingId("");
    }
  };

  return (
    <SideBar>
      <PageTitle
        eyebrow="Owner"
        title="Reviews"
        body="Approve publishes the note and emails the student. Reject removes it and emails them. Delete removes it with no email."
      />
      {loading ? (
        <Typography color="#5C6B7A">Loading reviews…</Typography>
      ) : reviews.length === 0 ? (
        <Box bgcolor="#fff" borderRadius="22px" p={3}>
          <Typography color="#0A192F">No lesson reviews yet.</Typography>
        </Box>
      ) : (
        <Box display="flex" flexDirection="column" gap={1.5}>
          {reviews.map((review) => (
            <Box
              key={review.id}
              bgcolor="#fff"
              borderRadius="22px"
              p={2.5}
              display="flex"
              justifyContent="space-between"
              alignItems={{ xs: "stretch", sm: "center" }}
              flexDirection={{ xs: "column", sm: "row" }}
              gap={2}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography fontWeight={700} color="#0A192F">
                  {review.name} · {review.rating} / 5
                </Typography>
                <Typography color="#5C6B7A" fontSize={14}>
                  {review.email}
                  {review.topicName ? ` · ${review.topicName}` : ""}
                  {formatWhen(review.createdAt) ? ` · ${formatWhen(review.createdAt)}` : ""}
                </Typography>
                <Typography color="#0A192F" fontSize={15} sx={{ mt: 1, maxWidth: 640, lineHeight: 1.6 }}>
                  {review.feedback}
                </Typography>
                <Typography fontSize={13} sx={{ mt: 0.75, color: review.status === "approved" ? primary : "#5C6B7A", fontWeight: 600 }}>
                  {statusLabel[review.status] || review.status}
                </Typography>
              </Box>
              <Box display="flex" gap={1} flexShrink={0} flexWrap="wrap">
                <Button
                  variant="contained"
                  disabled={savingId === review.id || review.status === "approved"}
                  onClick={() => approveReview(review)}
                  sx={{ textTransform: "none", fontWeight: 600, bgcolor: primary, boxShadow: "none", "&:hover": { bgcolor: primaryHover, boxShadow: "none" } }}
                >
                  Approve
                </Button>
                <Button
                  variant="outlined"
                  disabled={savingId === review.id}
                  onClick={() => removeReview(review, true)}
                  sx={{ textTransform: "none", fontWeight: 600, borderColor: accent, color: accent, "&:hover": { borderColor: accent, bgcolor: "rgba(255, 107, 107, 0.08)" } }}
                >
                  Reject review
                </Button>
                <Button
                  disabled={savingId === review.id}
                  onClick={() => removeReview(review, false)}
                  sx={{ textTransform: "none", fontWeight: 600, color: muted }}
                >
                  Delete review
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </SideBar>
  );
}
