export async function sendResend({ to, subject, html, text }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  if (!apiKey) {
    const error = new Error("Email is not connected yet.");
    error.status = 503;
    throw error;
  }
  if (!from) {
    const error = new Error("Add RESEND_FROM as well, like Ilmdesk <notes@ilmdesk.com>.");
    error.status = 503;
    throw error;
  }
  const sent = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: [to], subject, html, text }),
  });
  if (!sent.ok) {
    const error = new Error("The email could not be sent.");
    error.status = 502;
    throw error;
  }
}
