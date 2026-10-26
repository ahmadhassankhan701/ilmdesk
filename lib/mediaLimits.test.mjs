import assert from "node:assert/strict";
import { canPassThrough, encodeSteps, fittedSize, PDF_MAX_BYTES, uploadSpec } from "./mediaLimits.js";

const lesson = uploadSpec("lesson");
assert.equal(lesson.edge, 1600);
assert.equal(lesson.target, 300 * 1024);
assert.equal(lesson.max, 800 * 1024);
assert.deepEqual(lesson.steps[0], { edge: 1600, quality: 0.75 });
assert.equal(lesson.steps.some((step) => step.edge === 1200), true);
assert.equal(lesson.steps.at(-1).edge, 1000);

assert.deepEqual(fittedSize(4000, 3000, 1600), { width: 1600, height: 1200 });
assert.deepEqual(fittedSize(3000, 4000, 1600), { width: 1200, height: 1600 });
assert.deepEqual(fittedSize(800, 600, 1600), { width: 800, height: 600 });

assert.equal(uploadSpec("profile").edge, 800);
assert.equal(uploadSpec("cover").max, 500 * 1024);
assert.equal(PDF_MAX_BYTES, 5 * 1024 * 1024);
assert.equal(canPassThrough({ type: "image/jpeg", size: 180 * 1024 }, "lesson"), true);
assert.equal(canPassThrough({ type: "image/png", size: 180 * 1024 }, "lesson"), false);
assert.equal(canPassThrough({ type: "image/jpeg", size: 900 * 1024 }, "lesson"), false);
assert.equal(encodeSteps(1600).length, 9);

console.log("media limits ok");
