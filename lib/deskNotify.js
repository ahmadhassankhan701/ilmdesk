import { auth } from "@/firebase";

export async function requestDeskEmail(payload) {
  const user = auth.currentUser;
  if (!user) throw new Error("Sign in again before sending this email.");
  const token = await user.getIdToken();
  const response = await fetch("/api/notify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || "The email could not be sent.");
  }
}
