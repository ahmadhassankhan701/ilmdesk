import { paymentMessage, reviewMessage, siteOrigin, teacherMessage } from "./deskEmail.js";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function ownerEmail() {
  return String(process.env.NEXT_PUBLIC_OWNER_EMAIL || "").trim().toLowerCase();
}

export function isEmail(value) {
  const email = String(value || "").trim().toLowerCase();
  return EMAIL.test(email) && email.length <= 100 ? email : "";
}

function clip(value, max) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

export function messagesFor(body, siteUrl) {
  const type = body?.type === "payment" || body?.type === "teacher" || body?.type === "review" ? body.type : "";
  const kind = body?.kind === "approved" || body?.kind === "rejected" ? body.kind : "";
  const to = isEmail(body?.to);
  if (!type || !kind || !to) return null;
  const origin = siteOrigin(siteUrl);
  const name = clip(body.name, 80);
  let student;
  if (type === "review") {
    student = reviewMessage({
      kind,
      name: clip(body.name, 32),
      topicName: clip(body.topicName, 120),
      feedback: String(body.feedback || "").trim().slice(0, 600),
      siteUrl: origin,
    });
  } else if (type === "payment") {
    student = paymentMessage({
      kind,
      name,
      courseName: clip(body.courseName, 120),
      amount: clip(body.amount, 20),
      siteUrl: origin,
    });
  } else {
    student = teacherMessage({
      kind,
      name,
      focus: clip(body.focus, 40),
      siteUrl: origin,
    });
  }
  const letters = [{ to, ...student }];
  const desk = ownerEmail();
  if ((type === "payment" || type === "teacher") && desk && desk !== to && isEmail(desk)) {
    const copy = type === "payment"
      ? paymentMessage({
          audience: "desk",
          kind,
          name,
          courseName: clip(body.courseName, 120),
          amount: clip(body.amount, 20),
          siteUrl: origin,
        })
      : teacherMessage({
          audience: "desk",
          kind,
          name,
          focus: clip(body.focus, 40),
          siteUrl: origin,
        });
    letters.push({ to: desk, ...copy });
  }
  return letters;
}
