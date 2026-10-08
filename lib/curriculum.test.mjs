import assert from "node:assert/strict";
import { blocksFromStored, CLASS_LEVELS, publishLesson, theoryForStudents, youtubeId } from "./curriculumFormat.js";

assert.equal(CLASS_LEVELS.map((level) => level.label).join(" > "), "Class > Subject > Module > Chapter > Topic");
assert.equal(CLASS_LEVELS[2].collection, "branches");
assert.equal(CLASS_LEVELS[2].parentField, "subjectID");
assert.equal(CLASS_LEVELS[3].parentField, "branchID");

assert.equal(youtubeId("dQw4w9WgXcQ"), "dQw4w9WgXcQ");
assert.equal(youtubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ"), "dQw4w9WgXcQ");
assert.equal(youtubeId("https://youtu.be/dQw4w9WgXcQ"), "dQw4w9WgXcQ");
assert.equal(youtubeId("https://www.youtube.com/embed/dQw4w9WgXcQ"), "dQw4w9WgXcQ");
assert.equal(youtubeId("https://youtube.com/shorts/dQw4w9WgXcQ"), "dQw4w9WgXcQ");
assert.equal(youtubeId("not a link"), "");

assert.equal(
  theoryForStudents("Line one\nLine two", [{ fileUrl: "https://cdn.example/a.png", name: "Atom" }]),
  '<p>Line one<br />Line two</p><p><img src="https://cdn.example/a.png" alt="Atom" /></p>'
);
assert.equal(
  theoryForStudents("<p>Already html</p>", [{ fileUrl: "https://cdn.example/a.png", name: "Atom" }]),
  '<p>Already html</p><p><img src="https://cdn.example/a.png" alt="Atom" /></p>'
);
assert.equal(
  theoryForStudents('<p><img src="https://cdn.example/a.png" alt="Atom" /></p>', [
    { fileUrl: "https://cdn.example/a.png", name: "Atom" },
  ]),
  '<p><img src="https://cdn.example/a.png" alt="Atom" /></p>'
);

const published = publishLesson([
  { type: "text", text: "Start here" },
  { type: "image", name: "Atom", path: "ClassImages/a", fileUrl: "https://cdn.example/a.png" },
  { type: "video", videoId: "dQw4w9WgXcQ" },
  { type: "pdf", name: "Notes", path: "ClassPDFFiles/a", fileUrl: "https://cdn.example/a.pdf" },
]);
assert.equal(published.theory, '<p>Start here</p><p><img src="https://cdn.example/a.png" alt="Atom" /></p>');
assert.equal(publishLesson([{ type: "text", text: "<p><strong>Bold</strong> line</p>" }]).theory, "<p><strong>Bold</strong> line</p>");
assert.equal(publishLesson([{ type: "text", text: "<p></p>" }]).theory, "");
assert.deepEqual(published.youtubeLinks, ["dQw4w9WgXcQ"]);
assert.equal(published.pdfs[0].name, "Notes");
assert.equal(published.images[0].featured, true);

const featuredFirst = publishLesson([
  { type: "image", name: "Later", fileUrl: "https://cdn.example/a.png", featured: false },
  { type: "image", name: "Lead", fileUrl: "https://cdn.example/b.png", featured: true },
]);
assert.equal(featuredFirst.images[0].name, "Lead");
assert.equal(featuredFirst.images[0].featured, true);
assert.equal(featuredFirst.images[1].featured, false);
assert.equal(
  featuredFirst.theory,
  '<p><img src="https://cdn.example/b.png" alt="Lead" /></p><p><img src="https://cdn.example/a.png" alt="Later" /></p>'
);

const restored = blocksFromStored({
  theory: "<p>Old notes</p>",
  youtubeLinks: ["dQw4w9WgXcQ"],
  quizzes: [{ id: "q1", quizTitle: "Check", questions: [{ question: "Q", options: ["A", "B"], correctOption: 0 }] }],
});
assert.equal(restored[0].type, "text");
assert.equal(restored[1].type, "video");
assert.equal(restored[2].quizTitle, "Check");

console.log("curriculum ok");
