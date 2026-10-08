export const ROLES = {
  student: "student",
  teacher: "teacher",
  owner: "owner",
};

export const STATUSES = {
  active: "active",
  pending: "pending",
  rejected: "rejected",
};

export function ownerEmail() {
  return (process.env.NEXT_PUBLIC_OWNER_EMAIL || "").trim().toLowerCase();
}

export function isOwnerEmail(email) {
  const owner = ownerEmail();
  if (!owner) return false;
  return (email || "").trim().toLowerCase() === owner;
}

export function brandAdminId() {
  return (process.env.NEXT_PUBLIC_BRAND_ADMIN_UID || "").trim();
}

export function isBrandAdminUid(uid, configuredId = brandAdminId()) {
  const id = (configuredId || "").trim();
  if (!id) return false;
  return (uid || "").trim() === id;
}

export function roleLabel(role) {
  if (role === ROLES.owner) return "Brand admin";
  if (role === ROLES.teacher) return "Teacher";
  return "Student";
}

export function statusLabel(status) {
  if (status === STATUSES.pending) return "Pending";
  if (status === STATUSES.rejected) return "Rejected";
  return "Active";
}

/**
 * Decide the role stored on a Users document.
 * The configured owner email and brand-admin id are always brand admin.
 * Any other existing role is kept.
 * A brand-new teaching application stays pending until a brand admin approves it.
 */
export function resolveAccountRole({
  email,
  uid,
  intent = ROLES.student,
  existing = null,
  ownerEmail: configuredOwner = ownerEmail(),
  brandAdminId: configuredBrandAdminId = brandAdminId(),
}) {
  const normalized = (email || "").trim().toLowerCase();
  const owner = configuredOwner && normalized === configuredOwner.trim().toLowerCase();
  if (owner || isBrandAdminUid(uid, configuredBrandAdminId)) {
    return { role: ROLES.owner, status: STATUSES.active };
  }
  if (existing) {
    return {
      role: existing.role || ROLES.student,
      status: existing.status || STATUSES.active,
    };
  }
  if (intent === ROLES.teacher) {
    return { role: ROLES.teacher, status: STATUSES.pending };
  }
  return { role: ROLES.student, status: STATUSES.active };
}

export function toSessionUser(uid, account) {
  return {
    uid,
    name: account?.name || "",
    email: account?.email || "",
    image: account?.image || "",
    role: account?.role || ROLES.student,
    status: account?.status || STATUSES.active,
    profileComplete: account?.profileComplete === true,
  };
}

export function readSessionUser(raw) {
  if (!raw) return null;
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (!parsed?.user?.uid) return null;
    return toSessionUser(parsed.user.uid, parsed.user);
  } catch {
    return null;
  }
}

export function isTeacherWaiting(user) {
  return user?.role === ROLES.teacher && user?.status !== STATUSES.active;
}

export function hasCompleteProfile(user) {
  return user?.profileComplete === true;
}

export function authSearch({ redirectTo, courseId } = {}) {
  const params = new URLSearchParams();
  if (redirectTo) params.set("redirect", redirectTo);
  if (courseId) params.set("id", courseId);
  const query = params.toString();
  return query ? `?${query}` : "";
}

export function destinationFor(user, { redirectTo, courseId } = {}) {
  if (!user) return "/auth";
  if (!hasCompleteProfile(user)) {
    return `/account/profile${authSearch({ redirectTo, courseId })}`;
  }
  if (isTeacherWaiting(user)) return "/dashboard";
  if (courseId && redirectTo === "/courses/checkout") {
    return `/courses/checkout?id=${courseId}`;
  }
  return redirectTo || "/dashboard";
}
