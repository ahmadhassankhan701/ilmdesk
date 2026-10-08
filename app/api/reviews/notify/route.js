import { NextResponse } from "next/server";
import { reviewMessage } from "@/lib/reviewEmail";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function clip(value, max) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function bearer(request) {
  const header = request.headers.get("authorization") || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || "";
}

function isDesk(account) {
  const email = String(account.email || "").trim().toLowerCase();
  const owner = String(process.env.NEXT_PUBLIC_OWNER_EMAIL || "").trim().toLowerCase();
  const adminUid = String(process.env.NEXT_PUBLIC_BRAND_ADMIN_UID || "").trim();
  if (owner && email === owner) return true;
  if (adminUid && account.localId === adminUid) return true;
  return false;
}

async function lookupAccount(idToken) {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_APIKEY;
  if (!apiKey) return null;
  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  if (!response.ok) return null;
  const body = await response.json();
  return body.users?.[0] || null;
}

export async function POST(request) {
  try {
    const token = bearer(request);
    if (!token) {
      return NextResponse.json({ message: "Sign in again before emailing this student." }, { status: 401 });
    }

    const account = await lookupAccount(token);
    if (!account || !isDesk(account)) {
      return NextResponse.json({ message: "Only the desk can email a student about a review." }, { status: 403 });
    }

    const body = await request.json();
    const kind = body?.kind === "approved" || body?.kind === "rejected" ? body.kind : "";
    const to = String(body?.to || "").trim().toLowerCase();
    if (!kind || !EMAIL.test(to) || to.length > 100) {
      return NextResponse.json({ message: "This review email could not be prepared." }, { status: 400 });
    }

    const message = reviewMessage({
      kind,
      name: clip(body.name, 32),
      topicName: clip(body.topicName, 120),
      feedback: String(body.feedback || "").trim().slice(0, 600),
      siteUrl: process.env.NEXT_PUBLIC_URL || "https://ilmdesk.com",
    });

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM;
    if (!apiKey || !from) {
      return NextResponse.json({ message: "Email is not connected yet." }, { status: 503 });
    }

    const sent = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: message.subject,
        html: message.html,
        text: message.text,
      }),
    });

    if (!sent.ok) {
      return NextResponse.json({ message: "The email could not be sent." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "The email could not be sent." }, { status: 500 });
  }
}
