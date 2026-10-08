import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { sendEmailVerification, signOut, updateProfile } from "firebase/auth";
import Cookies from "js-cookie";
import { auth, db } from "@/firebase";
import {
  isBrandAdminUid,
  isOwnerEmail,
  resolveAccountRole,
  ROLES,
  STATUSES,
  toSessionUser,
} from "@/lib/roles";

const SESSION_COOKIE = "qasim_lms_auth";

function accountFromProfile(firebaseUser, existing, migrated, intent) {
  const { role, status } = resolveAccountRole({
    email: firebaseUser.email,
    uid: firebaseUser.uid,
    intent,
    existing,
  });
  return {
    name:
      existing?.name ||
      migrated?.name ||
      firebaseUser.displayName ||
      firebaseUser.email?.split("@")[0] ||
      "User",
    email: firebaseUser.email || existing?.email || migrated?.email || "",
    image:
      existing?.image ||
      migrated?.image ||
      firebaseUser.photoURL ||
      "",
    role,
    status,
    profileComplete: existing?.profileComplete === true,
    phone: existing?.phone || "",
    city: existing?.city || "",
    focus: existing?.focus || "",
    createdAt: existing?.createdAt || migrated?.createdAt || new Date(),
  };
}

async function mirrorStudent(uid, account) {
  if (account.role !== ROLES.student) return;
  const studentRef = doc(db, "Students", uid);
  const studentSnap = await getDoc(studentRef);
  if (studentSnap.exists()) return;
  await setDoc(studentRef, {
    name: account.name,
    email: account.email,
    image: account.image,
    createdAt: account.createdAt,
  });
}

export async function ensureAccount(firebaseUser, intent = ROLES.student) {
  const userRef = doc(db, "Users", firebaseUser.uid);
  const snap = await getDoc(userRef);
  const existing = snap.exists() ? snap.data() : null;

  let migrated = null;
  if (!existing) {
    const studentSnap = await getDoc(doc(db, "Students", firebaseUser.uid));
    if (studentSnap.exists()) migrated = studentSnap.data();
  }

  const account = accountFromProfile(
    firebaseUser,
    existing,
    migrated,
    existing || migrated ? ROLES.student : intent
  );

  if (!existing) {
    await setDoc(userRef, account);
  } else {
    const patch = {};
    if (existing.role !== account.role) patch.role = account.role;
    if (existing.status !== account.status) patch.status = account.status;
    if (!existing.email && account.email) patch.email = account.email;
    if (!existing.name && account.name) patch.name = account.name;
    if (!existing.image && account.image) patch.image = account.image;
    if (Object.keys(patch).length > 0) {
      try {
        await updateDoc(userRef, patch);
      } catch (error) {
        console.error(error);
        if (patch.role === ROLES.owner) throw error;
        return {
          ...account,
          role: existing.role || ROLES.student,
          status: existing.status || STATUSES.active,
        };
      }
    }
  }

  await mirrorStudent(firebaseUser.uid, account);
  return account;
}

function persistSession(user, setState) {
  Cookies.set(SESSION_COOKIE, JSON.stringify({ user }), { expires: 7 });
  if (setState) setState({ user });
  return user;
}

export function needsEmailVerification(firebaseUser) {
  if (!firebaseUser) return false;
  const providers = firebaseUser.providerData || [];
  const usesPassword = providers.length === 0 || providers.some((provider) => provider.providerId === "password");
  return usesPassword && firebaseUser.emailVerified !== true;
}

export async function sendAccountVerification(firebaseUser) {
  const continueUrl = typeof window !== "undefined" ? `${window.location.origin}/auth` : undefined;
  await sendEmailVerification(
    firebaseUser,
    continueUrl ? { url: continueUrl, handleCodeInApp: false } : undefined
  );
}

export async function establishSession(
  firebaseUser,
  { intent = ROLES.student, setState } = {}
) {
  if (needsEmailVerification(firebaseUser)) {
    throw new Error("Verify your email before you log in.");
  }
  try {
    const account = await ensureAccount(firebaseUser, intent);
    return persistSession(toSessionUser(firebaseUser.uid, account), setState);
  } catch (error) {
    if (needsEmailVerification(firebaseUser) || intent === ROLES.teacher || isOwnerEmail(firebaseUser.email)) throw error;
    console.error(error);
    return persistSession(
      toSessionUser(firebaseUser.uid, {
        name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
        email: firebaseUser.email || "",
        image: firebaseUser.photoURL || "",
        role: ROLES.student,
        status: STATUSES.active,
        profileComplete: false,
      }),
      setState
    );
  }
}

export async function hasAccountRecord(uid) {
  const userSnap = await getDoc(doc(db, "Users", uid));
  if (userSnap.exists()) return true;
  const studentSnap = await getDoc(doc(db, "Students", uid));
  return studentSnap.exists();
}

function roleAfterProfile(existing, chosen, uid) {
  if (isBrandAdminUid(uid) || existing.role === ROLES.owner) {
    return { role: ROLES.owner, status: STATUSES.active };
  }
  if (chosen === ROLES.teacher) {
    const keepStatus =
      existing.role === ROLES.teacher &&
      (existing.status === STATUSES.active || existing.status === STATUSES.rejected);
    return {
      role: ROLES.teacher,
      status: keepStatus ? existing.status : STATUSES.pending,
    };
  }
  return { role: ROLES.student, status: STATUSES.active };
}

export async function completeProfile(firebaseUser, { phone, city, focus, role, qualification, institution, exams, teachingNote }, setState) {
  const userRef = doc(db, "Users", firebaseUser.uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) {
    throw new Error("Register before completing a profile.");
  }
  const existing = snap.data();
  const next = roleAfterProfile(existing, role, firebaseUser.uid);
  const patch = {
    name: existing.name,
    phone: phone.trim(),
    city: city.trim(),
    focus: focus.trim(),
    role: next.role,
    status: next.status,
    profileComplete: true,
  };
  if (next.role === ROLES.teacher) {
    patch.qualification = qualification;
    patch.institution = institution.trim();
    patch.exams = exams;
    patch.teachingNote = teachingNote.trim();
  }
  await updateDoc(userRef, patch);
  if (next.role === ROLES.student) {
    await setDoc(
      doc(db, "Students", firebaseUser.uid),
      {
        name: patch.name,
        email: existing.email || firebaseUser.email || "",
        image: existing.image || firebaseUser.photoURL || "",
        phone: patch.phone,
        city: patch.city,
        createdAt: existing.createdAt || new Date(),
      },
      { merge: true }
    );
  }
  return persistSession(toSessionUser(firebaseUser.uid, { ...existing, ...patch }), setState);
}

export async function updateOwnProfile(firebaseUser, { name, phone, city, focus, image }, setState) {
  const userRef = doc(db, "Users", firebaseUser.uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) {
    throw new Error("Register before updating a profile.");
  }
  const existing = snap.data();
  const patch = {
    name: name.trim(),
    phone: phone.trim(),
    city: city.trim(),
    focus: focus.trim(),
    image: image || "",
  };
  await updateDoc(userRef, patch);
  if (existing.role === ROLES.student) {
    await setDoc(
      doc(db, "Students", firebaseUser.uid),
      {
        name: patch.name,
        email: existing.email || firebaseUser.email || "",
        image: patch.image,
        phone: patch.phone,
        city: patch.city,
        createdAt: existing.createdAt || new Date(),
      },
      { merge: true }
    );
  }
  try {
    await updateProfile(firebaseUser, {
      displayName: patch.name,
      ...(patch.image ? { photoURL: patch.image } : {}),
    });
  } catch (error) {
    console.error(error);
  }
  return persistSession(toSessionUser(firebaseUser.uid, { ...existing, ...patch }), setState);
}

export async function clearSession(setState) {
  try {
    await signOut(auth);
  } catch (error) {
    console.error(error);
  }
  Cookies.remove(SESSION_COOKIE);
  if (setState) setState({ user: null });
}

export function shouldSyncSignedInUser(firebaseUser, hasUserDoc, hasStudentDoc) {
  if (!firebaseUser || needsEmailVerification(firebaseUser)) return false;
  return hasUserDoc || hasStudentDoc || isOwnerEmail(firebaseUser.email) || isBrandAdminUid(firebaseUser.uid);
}

export async function listTeacherAccounts() {
  const teachersQuery = query(
    collection(db, "Users"),
    where("role", "==", ROLES.teacher)
  );
  const snapshot = await getDocs(teachersQuery);
  return snapshot.docs
    .map((teacher) => ({ id: teacher.id, ...teacher.data() }))
    .sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() || 0;
      const bTime = b.createdAt?.toMillis?.() || 0;
      return bTime - aTime;
    });
}

export async function setTeacherStatus(uid, status) {
  if (![STATUSES.active, STATUSES.pending, STATUSES.rejected].includes(status)) {
    throw new Error("Unknown teacher status");
  }
  await updateDoc(doc(db, "Users", uid), { status });
}
