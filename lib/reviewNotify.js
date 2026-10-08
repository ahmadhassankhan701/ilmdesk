import { auth } from "@/firebase";

export async function requestReviewEmail(review, kind) {
  const user = auth.currentUser;
  if (!user) throw new Error("Sign in again before emailing this student.");
  const token = await user.getIdToken();
  const response = await fetch("/api/reviews/notify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      kind,
      to: review.email,
      name: review.name,
      topicName: review.topicName,
      feedback: review.feedback,
    }),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || "The email could not be sent.");
  }
}
