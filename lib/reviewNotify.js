import { requestDeskEmail } from "@/lib/deskNotify";

export async function requestReviewEmail(review, kind) {
  await requestDeskEmail({
    type: "review",
    kind,
    to: review.email,
    name: review.name,
    topicName: review.topicName,
    feedback: review.feedback,
  });
}
