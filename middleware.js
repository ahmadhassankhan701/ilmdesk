import { NextResponse } from "next/server";
import { hasCompleteProfile, isTeacherWaiting, readSessionUser, ROLES } from "./lib/roles";

function redirectTo(req, pathname) {
  const url = req.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";
  return NextResponse.redirect(url);
}

export default function middleware(req) {
  const user = readSessionUser(req.cookies.get("qasim_lms_auth")?.value);
  const path = req.nextUrl.pathname;
  const isDashboard = path.startsWith("/dashboard");
  const isAuth = path.startsWith("/auth");
  const isStatus = path.startsWith("/account/status");
  const isProfile = path.startsWith("/account/profile");
  const waiting = isTeacherWaiting(user);
  const profileReady = hasCompleteProfile(user);

  if (!user && (isDashboard || isStatus || isProfile)) {
    return redirectTo(req, "/auth");
  }

  if (user && !profileReady && (isDashboard || isStatus || isAuth)) {
    return redirectTo(req, "/account/profile");
  }

  if (user && profileReady && isProfile) {
    return redirectTo(req, "/dashboard");
  }

  if (waiting && isStatus) {
    return redirectTo(req, "/dashboard");
  }

  if (waiting && isDashboard && path !== "/dashboard") {
    return redirectTo(req, "/dashboard");
  }

  if (
    user &&
    (path.startsWith("/dashboard/teachers") || path.startsWith("/dashboard/curriculum") || path.startsWith("/dashboard/reviews")) &&
    user.role !== ROLES.owner
  ) {
    return redirectTo(req, "/dashboard");
  }

  if (user && profileReady && isAuth) {
    return redirectTo(req, "/dashboard");
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*", "/account/status", "/account/profile"],
};
