import assert from "node:assert/strict";
import { messagesFor } from "./deskLetters.js";
import { paymentMessage, teacherMessage } from "./deskEmail.js";

process.env.NEXT_PUBLIC_OWNER_EMAIL = "qasim@ilmdesk.com";

const payment = paymentMessage({
  kind: "approved",
  name: "Ada <script>",
  courseName: "Organic",
  amount: "2500",
  siteUrl: "https://ilmdesk.com/courses/extra",
});
assert.equal(payment.subject, "Your place on Organic is open");
assert.match(payment.html, /ILMDESK/);
assert.match(payment.html, /Ada &lt;script&gt;/);
assert.match(payment.html, /https:\/\/ilmdesk\.com\/dashboard\/courses/);
assert.doesNotMatch(payment.html, /courses\/extra/);

const teacher = teacherMessage({
  audience: "desk",
  kind: "rejected",
  name: "Ada",
  focus: "Chemistry",
  siteUrl: "javascript:alert(1)",
});
assert.match(teacher.subject, /Teacher not approved/);
assert.match(teacher.html, /https:\/\/ilmdesk\.com\/dashboard\/teachers/);
assert.doesNotMatch(teacher.html, /javascript:/);

const letters = messagesFor(
  { type: "payment", kind: "rejected", to: "ada@school.com", name: "Ada", courseName: "Organic", amount: "0" },
  "https://ilmdesk.com"
);
assert.equal(letters.length, 2);
assert.equal(letters[0].to, "ada@school.com");
assert.equal(letters[1].to, "qasim@ilmdesk.com");

const reviewOnly = messagesFor(
  { type: "review", kind: "approved", to: "ada@school.com", name: "Ada", topicName: "Alkanes", feedback: "Clear." },
  "https://ilmdesk.com"
);
assert.equal(reviewOnly.length, 1);

assert.equal(messagesFor({ type: "payment", kind: "approved", to: "not-an-email" }, "https://ilmdesk.com"), null);

console.log("desk email ok");
