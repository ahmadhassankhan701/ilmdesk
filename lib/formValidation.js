const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function nameError(value) {
  const name = (value || "").trim();
  if (!name) return "Enter your name.";
  if (name.length < 2) return "Name must be at least 2 characters.";
  if (name.length > 32) return "Name must be 32 characters or fewer.";
  return "";
}

export const EDUCATION_LEVELS = ["Middle", "Matric", "O Level", "Intermediate", "A Level", "Bachelor's", "Master's"];

export const TEACHING_QUALIFICATIONS = ["Bachelor's", "Master's", "MPhil", "PhD"];

export const TEACHING_EXAMS = ["Matric", "Intermediate", "O Level", "A Level", "MDCAT"];

export function qualificationError(value) {
  if (!TEACHING_QUALIFICATIONS.includes(value)) return "Select your highest qualification.";
  return "";
}

export function institutionError(value) {
  const institution = (value || "").trim();
  if (!institution) return "Enter the university or college.";
  if (institution.length < 2) return "Institution must be at least 2 characters.";
  if (institution.length > 80) return "Institution must be 80 characters or fewer.";
  return "";
}

export function examsError(value) {
  const exams = Array.isArray(value) ? value : [];
  if (exams.length === 0) return "Select at least one exam you will teach.";
  if (exams.some((exam) => !TEACHING_EXAMS.includes(exam))) return "Select exams from the list.";
  return "";
}

export function teachingNoteError(value) {
  const note = (value || "").trim();
  if (!note) return "Write two or three sentences about how you teach.";
  if (note.length < 40) return "Write two or three sentences about how you teach.";
  if (note.length > 500) return "Keep the note to 500 characters or fewer.";
  const sentences = note.split(/[.!?]+/).map((part) => part.trim()).filter(Boolean);
  if (sentences.length < 2) return "Write at least two sentences.";
  return "";
}

export function educationLevelError(value) {
  if (!EDUCATION_LEVELS.includes(value)) return "Select the education level you have completed.";
  return "";
}

export function pakistanPhoneDigits(value) {
  let digits = String(value || "").replace(/\D/g, "");
  if (digits.startsWith("92")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = digits.slice(1);
  return digits.slice(0, 10);
}

export function pakistanPhoneError(value) {
  const digits = pakistanPhoneDigits(value);
  if (!digits) return "Enter your phone number.";
  if (digits.length < 10) return "Enter the 10 digits after +92.";
  return "";
}

export function pakistanPhoneValue(value) {
  const digits = pakistanPhoneDigits(value);
  return digits.length === 10 ? `+92${digits}` : "";
}

export function reviewRatingError(value) {
  const rating = Number(value);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return "Choose a star rating.";
  return "";
}

export function reviewFeedbackError(value) {
  const feedback = (value || "").trim();
  if (!feedback) return "Write your review.";
  if (feedback.length < 12) return "Write at least one sentence.";
  if (feedback.length > 600) return "Keep the review to 600 characters or fewer.";
  return "";
}

export function reviewFieldErrors({ name, email, rating, feedback }) {
  return {
    name: nameError(name),
    email: emailError(email),
    rating: reviewRatingError(rating),
    feedback: reviewFeedbackError(feedback),
  };
}

export function emailError(value) {
  const email = (value || "").trim();
  if (!email) return "Enter your email.";
  if (email.length > 100) return "Email must be 100 characters or fewer.";
  if (!EMAIL.test(email)) return "Enter a valid email, like name@email.com.";
  return "";
}

export const passwordChecks = [
  { label: "At least 8 characters", met: (password) => password.length >= 8 },
  { label: "One uppercase letter", met: (password) => /[A-Z]/.test(password) },
  { label: "One digit", met: (password) => /\d/.test(password) },
  { label: "One special character", met: (password) => /[^A-Za-z0-9]/.test(password) },
];

export function passwordError(value, { login = false } = {}) {
  const password = value || "";
  if (!password) return "Enter your password.";
  if (login) {
    if (password.length > 64) return "Password must be 64 characters or fewer.";
    return "";
  }
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (password.length > 32) return "Password must be 32 characters or fewer.";
  if (!/[A-Z]/.test(password)) return "Password needs an uppercase letter.";
  if (!/\d/.test(password)) return "Password needs a digit.";
  if (!/[^A-Za-z0-9]/.test(password)) return "Password needs a special character, like ! or @.";
  return "";
}

const AUTH_MESSAGES = {
  "auth/invalid-email": "Enter a valid email, like name@email.com.",
  "auth/user-disabled": "This account is disabled. Write to the desk if that is a mistake.",
  "auth/user-not-found": "No account uses that email. Create one first.",
  "auth/wrong-password": "That password does not match this email.",
  "auth/invalid-credential": "That email and password do not match.",
  "auth/invalid-login-credentials": "That email and password do not match.",
  "auth/email-already-in-use": "That email is already registered. Log in instead.",
  "auth/weak-password": "Password must be at least 8 characters, with an uppercase letter, a digit, and a special character.",
  "auth/too-many-requests": "Too many attempts. Wait a minute and try again.",
  "auth/network-request-failed": "The connection failed. Check your network and try again.",
  "auth/popup-closed-by-user": "Google sign-in was closed before it finished.",
  "auth/cancelled-popup-request": "Google sign-in was cancelled.",
  "auth/popup-blocked": "The browser blocked the Google window. Allow pop-ups and try again.",
  "auth/account-exists-with-different-credential": "This email already has a password account. Log in with email.",
  "auth/operation-not-allowed": "This sign-in method is not switched on yet.",
  "auth/missing-continue-uri": "The verification email could not be prepared. Try again.",
  "auth/unauthorized-continue-uri": "The verification email could not be prepared. Try again.",
};

export function authErrorMessage(error) {
  if (error?.code && AUTH_MESSAGES[error.code]) return AUTH_MESSAGES[error.code];
  return "Something went wrong. Try again.";
}
