const NAVY = "#0A192F";
const TEAL = "#0D9AAC";
const CANVAS = "#F0F3F5";
const INK = "#0A192F";
const MUTED = "#5C6B7A";
const LINE = "#E2E8EC";
const ACCENT = "#FF6B6B";

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function plain(value, fallback) {
  const text = String(value || "")
    .replace(/\s+/g, " ")
    .trim();
  return text || fallback;
}

export function siteOrigin(url) {
  try {
    const parsed = new URL(url || "https://ilmdesk.com");
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return "https://ilmdesk.com";
    return parsed.origin;
  } catch {
    return "https://ilmdesk.com";
  }
}

function money(value) {
  const amount = String(value ?? "").trim();
  if (!amount || amount === "0") return "Free";
  return `Rs ${amount}`;
}

export function brandedEmail({ subject, eyebrow, eyebrowColor = TEAL, name, lead, quote = "", actionLabel, actionUrl }) {
  const student = plain(name, "there");
  const note = String(quote || "").trim();
  const quoteText = note ? `\n\n"${note}"\n` : "";
  const text = `Hi ${student},\n\n${lead}${quoteText}\n${actionLabel}: ${actionUrl}\n\nIlmdesk\nNear Shaukat Khanum Hospital, Lahore\nilmdesk63@gmail.com\n`;
  const quoteHtml = note
    ? `<tr><td style="padding:0 32px 8px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
          <tr>
            <td style="border-left:3px solid ${TEAL};padding:4px 0 4px 16px;color:${MUTED};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:15px;line-height:1.6;">${escapeHtml(note).replace(/\n/g, "<br />")}</td>
          </tr>
        </table>
      </td></tr>`
    : "";

  const html = `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:${CANVAS};">
    <div style="display:none;max-height:0;overflow:hidden;color:${CANVAS};">${escapeHtml(lead)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CANVAS};border-collapse:collapse;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:560px;max-width:560px;background:#ffffff;border:1px solid ${LINE};border-radius:22px;border-collapse:separate;overflow:hidden;">
            <tr>
              <td style="background:${NAVY};padding:28px 32px 26px;">
                <div style="color:${TEAL};font-family:Georgia,'Times New Roman',serif;font-size:13px;font-weight:700;letter-spacing:1.6px;">ILMDESK</div>
                <div style="color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:22px;font-weight:700;letter-spacing:-0.4px;line-height:1.2;padding-top:8px;">Lesson desk</div>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 32px 8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
                <div style="color:${eyebrowColor};font-size:12px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;">${escapeHtml(eyebrow)}</div>
                <div style="color:${INK};font-size:26px;font-weight:700;letter-spacing:-0.5px;line-height:1.2;padding-top:8px;">${escapeHtml(subject)}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px 8px;color:${INK};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:16px;line-height:1.65;">
                Hi ${escapeHtml(student)},
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 18px;color:${MUTED};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:16px;line-height:1.65;">
                ${escapeHtml(lead)}
              </td>
            </tr>
            ${quoteHtml}
            <tr>
              <td style="padding:18px 32px 8px;">
                <a href="${escapeHtml(actionUrl)}" style="display:inline-block;background:${TEAL};color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:15px;font-weight:600;text-decoration:none;border-radius:999px;padding:12px 22px;">${escapeHtml(actionLabel)}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:22px 32px 28px;color:${MUTED};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;line-height:1.6;border-top:1px solid ${LINE};">
                Ilmdesk<br />
                Near Shaukat Khanum Hospital, Lahore<br />
                <a href="mailto:ilmdesk63@gmail.com" style="color:${TEAL};text-decoration:none;">ilmdesk63@gmail.com</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject, html, text };
}

export function reviewMessage({ kind, name, topicName, feedback, siteUrl }) {
  if (kind !== "approved" && kind !== "rejected") throw new Error("Choose approve or reject.");
  const topic = plain(topicName, "this lesson");
  const approved = kind === "approved";
  const origin = siteOrigin(siteUrl);
  return brandedEmail({
    subject: approved ? `Your note is on ${topic}` : `Your note on ${topic} was not published`,
    eyebrow: approved ? "Published" : "Not published",
    eyebrowColor: approved ? TEAL : ACCENT,
    name,
    lead: approved
      ? `The desk published your note on ${topic}. Students can read it on that lesson now.`
      : `The desk read your note on ${topic}. It will not appear on that lesson. You can leave another note there if you want.`,
    quote: String(feedback || "").trim(),
    actionLabel: "Open classes",
    actionUrl: `${origin}/classes`,
  });
}

export function paymentMessage({ audience = "student", kind, name, courseName, amount, siteUrl }) {
  if (kind !== "approved" && kind !== "rejected") throw new Error("Choose approve or reject.");
  const course = plain(courseName, "this course");
  const student = plain(name, "A student");
  const origin = siteOrigin(siteUrl);
  const approved = kind === "approved";
  const price = money(amount);
  if (audience === "desk") {
    return brandedEmail({
      subject: approved ? `Receipt confirmed · ${course}` : `Receipt not confirmed · ${course}`,
      eyebrow: approved ? "Confirmed" : "Not confirmed",
      eyebrowColor: approved ? TEAL : ACCENT,
      name: "Qasim",
      lead: approved
        ? `You confirmed ${student}'s receipt for ${course}. The course is open for them.`
        : `You did not confirm ${student}'s receipt for ${course}. The course stays closed.`,
      quote: price,
      actionLabel: "Open the desk",
      actionUrl: `${origin}/dashboard/payments`,
    });
  }
  return brandedEmail({
    subject: approved ? `Your place on ${course} is open` : `Your receipt for ${course} was not confirmed`,
    eyebrow: approved ? "Confirmed" : "Not confirmed",
    eyebrowColor: approved ? TEAL : ACCENT,
    name,
    lead: approved
      ? `The desk confirmed your receipt for ${course}. The lessons are open on your dashboard.`
      : `The desk could not confirm the receipt for ${course}. The course stays closed. You can send another receipt from the course page.`,
    quote: price,
    actionLabel: approved ? "Open your courses" : "Back to courses",
    actionUrl: approved ? `${origin}/dashboard/courses` : `${origin}/courses`,
  });
}

export function teacherMessage({ audience = "student", kind, name, focus, siteUrl }) {
  if (kind !== "approved" && kind !== "rejected") throw new Error("Choose approve or reject.");
  const teacher = plain(name, "This teacher");
  const subjectFocus = plain(focus, "");
  const origin = siteOrigin(siteUrl);
  const approved = kind === "approved";
  if (audience === "desk") {
    return brandedEmail({
      subject: approved ? `Teacher approved · ${teacher}` : `Teacher not approved · ${teacher}`,
      eyebrow: approved ? "Approved" : "Not approved",
      eyebrowColor: approved ? TEAL : ACCENT,
      name: "Qasim",
      lead: approved
        ? `You approved ${teacher} to teach${subjectFocus ? ` ${subjectFocus}` : ""}. Their dashboard is open.`
        : `You did not approve ${teacher}'s teaching application${subjectFocus ? ` for ${subjectFocus}` : ""}.`,
      actionLabel: "Open the desk",
      actionUrl: `${origin}/dashboard/teachers`,
    });
  }
  return brandedEmail({
    subject: approved ? "Your teaching desk is open" : "Your teaching application was not approved",
    eyebrow: approved ? "Approved" : "Not approved",
    eyebrowColor: approved ? TEAL : ACCENT,
    name,
    lead: approved
      ? "The desk approved your teaching application. Sign in and the dashboard is yours."
      : "The desk did not approve this teaching application. You can write to the studio if you want to talk it through.",
    quote: subjectFocus ? `Subject: ${subjectFocus}` : "",
    actionLabel: approved ? "Open the dashboard" : "Write to the studio",
    actionUrl: approved ? `${origin}/dashboard` : "mailto:ilmdesk63@gmail.com",
  });
}
