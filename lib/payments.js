import { arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { db, storage } from "@/firebase";

function when(value) {
  return value?.toMillis?.() || value?.getTime?.() || 0;
}

export async function accountEmail(uid) {
  if (!uid) return "";
  const userSnap = await getDoc(doc(db, "Users", uid));
  const email = String(userSnap.data()?.email || "").trim();
  if (email) return email;
  const studentSnap = await getDoc(doc(db, "Students", uid));
  return String(studentSnap.data()?.email || "").trim();
}

export async function listPayments() {
  const snapshot = await getDocs(collection(db, "Payments"));
  const rank = { pending: 0, approved: 1, rejected: 2 };
  return snapshot.docs
    .map((item) => ({ id: item.id, ...item.data() }))
    .sort((a, b) => (rank[a.status] ?? 3) - (rank[b.status] ?? 3) || when(b.paidAt) - when(a.paidAt));
}

async function hasAnotherApproval(payment) {
  if (!payment.userId || !payment.courseId) return false;
  const snapshot = await getDocs(
    query(collection(db, "Payments"), where("userId", "==", payment.userId), where("courseId", "==", payment.courseId))
  );
  return snapshot.docs.some((item) => item.id !== payment.id && item.data().status === "approved");
}

async function enroll(payment, add) {
  if (!payment.userId || !payment.courseId) return;
  await updateDoc(doc(db, "courses", payment.courseId), {
    students: add ? arrayUnion(payment.userId) : arrayRemove(payment.userId),
  });
}

export async function approvePayment(payment) {
  await updateDoc(doc(db, "Payments", payment.id), { status: "approved", confirmedAt: new Date() });
  try {
    await enroll(payment, true);
  } catch (error) {
    console.error(error);
    throw new Error("The receipt is approved. The course could not be opened for this student.");
  }
}

export async function rejectPayment(payment) {
  await updateDoc(doc(db, "Payments", payment.id), { status: "rejected", confirmedAt: new Date() });
  if (payment.status !== "approved") return;
  if (await hasAnotherApproval(payment)) return;
  try {
    await enroll(payment, false);
  } catch (error) {
    console.error(error);
  }
}

export async function deletePayment(payment) {
  if (payment.status === "approved" && !(await hasAnotherApproval(payment))) {
    try {
      await enroll(payment, false);
    } catch (error) {
      console.error(error);
    }
  }
  await deleteDoc(doc(db, "Payments", payment.id));
  if (payment.courseId && payment.userId) {
    await deleteObject(ref(storage, `Payments/${payment.courseId}/${payment.userId}`)).catch((error) => console.error(error));
  }
}
