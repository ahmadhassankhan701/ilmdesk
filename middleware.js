import { NextResponse } from "next/server";

export default function middleware(req) {
  let url = req.url;
  let verify = req.cookies.get("qasim_lms_auth");
  if (!verify && url.includes("/dashboard")) {
    return NextResponse.redirect(process.env.NEXT_PUBLIC_URL + "/auth");
  }
  if (verify && url.includes("/auth")) {
    return NextResponse.redirect(process.env.NEXT_PUBLIC_URL + "/dashboard");
  }
}
