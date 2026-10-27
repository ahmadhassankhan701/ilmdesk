import { NextResponse } from "next/server";
import { messagesFor } from "@/lib/deskLetters";
import { sendResend } from "@/lib/sendResend";

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
      return NextResponse.json({ message: "Sign in again before sending this email." }, { status: 401 });
    }
    const account = await lookupAccount(token);
    if (!account || !isDesk(account)) {
      return NextResponse.json({ message: "Only the desk can send these emails." }, { status: 403 });
    }
    const body = await request.json();
    const letters = messagesFor(body, process.env.NEXT_PUBLIC_URL || "https://ilmdesk.com");
    if (!letters) {
      return NextResponse.json({ message: "This email could not be prepared." }, { status: 400 });
    }
    const failures = [];
    for (const letter of letters) {
      try {
        await sendResend(letter);
      } catch (error) {
        failures.push({
          message: error.message || "The email could not be sent.",
          status: error.status || 502,
        });
        if (error.status === 503) break;
      }
    }
    if (failures.length) {
      return NextResponse.json({ message: failures[0].message }, { status: failures[0].status });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "The email could not be sent." }, { status: 500 });
  }
}
