import { collection, deleteDoc, doc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "@/firebase";

export function classReviewId(topicId, email) {
  return `${topicId}~${String(email || "").trim().toLowerCase()}`;
}

export class DuplicateReviewError extends Error {
  constructor() {
    super("This email already reviewed this lesson.");
    this.name = "DuplicateReviewError";
    this.code = "already-reviewed";
  }
}

function row(item) {
  return { id: item.id, ...item.data() };
}

export async function submitClassReview({ topicId, topicName, name, email, rating, feedback }) {
  const normalizedEmail = email.trim().toLowerCase();
  try {
    await setDoc(doc(db, "ClassReviews", classReviewId(topicId, normalizedEmail)), {
      topicId,
      topicName: (topicName || "Lesson").trim(),
      name: name.trim(),
      email: normalizedEmail,
      rating: Number(rating),
      feedback: feedback.trim(),
      status: "pending",
      createdAt: new Date(),
    });
  } catch (error) {
    if (error?.code === "permission-denied" || error?.code === "already-exists") throw new DuplicateReviewError();
    throw error;
  }
}

export async function listApprovedClassReviews(topicId) {
  const snapshot = await getDocs(
    query(collection(db, "ClassReviews"), where("topicId", "==", topicId), where("status", "==", "approved"))
  );
  return snapshot.docs.map(row);
}

export async function listClassReviews() {
  const snapshot = await getDocs(collection(db, "ClassReviews"));
  const rank = { pending: 0, approved: 1, rejected: 2 };
  return snapshot.docs
    .map(row)
    .sort((a, b) => (rank[a.status] ?? 3) - (rank[b.status] ?? 3) || timeOf(b.createdAt) - timeOf(a.createdAt));
}

export async function setClassReviewStatus(id, status) {
  if (status !== "approved") throw new Error("Choose approve.");
  await updateDoc(doc(db, "ClassReviews", id), { status });
}

export async function deleteClassReview(id) {
  await deleteDoc(doc(db, "ClassReviews", id));
}

function timeOf(value) {
  return value?.toMillis?.() || value?.getTime?.() || 0;
}
