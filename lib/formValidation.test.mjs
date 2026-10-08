import assert from "node:assert/strict";
import {
  authErrorMessage,
  educationLevelError,
  examsError,
  institutionError,
  qualificationError,
  teachingNoteError,
  emailError,
  nameError,
  reviewFeedbackError,
  reviewFieldErrors,
  reviewRatingError,
  pakistanPhoneDigits,
  pakistanPhoneError,
  pakistanPhoneValue,
  passwordError,
} from "./formValidation.js";

assert.equal(nameError(""), "Enter your name.");
assert.equal(nameError("A"), "Name must be at least 2 characters.");
assert.equal(nameError("A".repeat(33)), "Name must be 32 characters or fewer.");
assert.equal(nameError("Ada"), "");

assert.equal(emailError("ada"), "Enter a valid email, like name@email.com.");
assert.equal(emailError("ada@school.com"), "");
assert.equal(reviewRatingError(0), "Choose a star rating.");
assert.equal(reviewRatingError(4), "");
assert.equal(reviewFeedbackError("Too short"), "Write at least one sentence.");
assert.equal(reviewFeedbackError("The notes made this chapter much clearer."), "");
assert.equal(reviewFieldErrors({ name: "", email: "ada", rating: 0, feedback: "" }).email, "Enter a valid email, like name@email.com.");

assert.equal(passwordError("short"), "Password must be at least 8 characters.");
assert.equal(passwordError("longpass1"), "Password needs an uppercase letter.");
assert.equal(passwordError("Longpassword"), "Password needs a digit.");
assert.equal(passwordError("Longpass1"), "Password needs a special character, like ! or @.");
assert.equal(passwordError("Longpass1!"), "");
assert.equal(passwordError("secret", { login: true }), "");

assert.equal(pakistanPhoneDigits("+92 300 1234567"), "3001234567");
assert.equal(pakistanPhoneDigits("03001234567"), "3001234567");
assert.equal(pakistanPhoneError("300123"), "Enter the 10 digits after +92.");
assert.equal(pakistanPhoneError("3001234567"), "");
assert.equal(pakistanPhoneValue("03001234567"), "+923001234567");
assert.equal(educationLevelError(""), "Select the education level you have completed.");
assert.equal(educationLevelError("Matric"), "");
assert.equal(qualificationError("PhD"), "");
assert.equal(institutionError("A"), "Institution must be at least 2 characters.");
assert.equal(institutionError("Punjab University"), "");
assert.equal(examsError([]), "Select at least one exam you will teach.");
assert.equal(examsError(["MDCAT"]), "");
assert.equal(teachingNoteError("Too short."), "Write two or three sentences about how you teach.");
assert.equal(
  teachingNoteError("I teach organic chemistry with past papers. Students practise one full paper each week."),
  ""
);

assert.equal(authErrorMessage({ code: "auth/email-already-in-use" }), "That email is already registered. Log in instead.");
assert.equal(authErrorMessage({ code: "auth/unknown" }), "Something went wrong. Try again.");

console.log("form validation ok");
