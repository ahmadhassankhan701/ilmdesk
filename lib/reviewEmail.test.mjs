import assert from "node:assert/strict";
import { reviewMessage } from "./reviewEmail.js";

const approved = reviewMessage({
  kind: "approved",
  name: "Ada <script>",
  topicName: "Alkanes",
  feedback: "Clear notes & a worked example.",
  siteUrl: "https://ilmdesk.com/classes/extra",
});

assert.equal(approved.subject, "Your note is on Alkanes");
assert.match(approved.html, /ILMDESK/);
assert.match(approved.html, /#0A192F/);
assert.match(approved.html, /#0D9AAC/);
assert.match(approved.html, /Ada &lt;script&gt;/);
assert.match(approved.html, /Clear notes &amp; a worked example\./);
assert.match(approved.html, /https:\/\/ilmdesk\.com\/classes/);
assert.doesNotMatch(approved.html, /classes\/extra/);
assert.match(approved.text, /Hi Ada <script>,/);
assert.match(approved.text, /ilmdesk63@gmail.com/);

const rejected = reviewMessage({
  kind: "rejected",
  name: "",
  topicName: "",
  feedback: "",
  siteUrl: "javascript:alert(1)",
});

assert.equal(rejected.subject, "Your note on this lesson was not published");
assert.match(rejected.html, /Not published/);
assert.match(rejected.html, /Hi there,/);
assert.match(rejected.html, /https:\/\/ilmdesk\.com\/classes/);
assert.doesNotMatch(rejected.html, /javascript:/);

assert.throws(() => reviewMessage({ kind: "deleted", name: "Ada", topicName: "Alkanes" }), /approve or reject/);

console.log("review email ok");
