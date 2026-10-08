import assert from "node:assert/strict";
import {
  chapterAnchor,
  itemSlug,
  lessonPath,
  matchesSegment,
  slugify,
  subjectPath,
  uniqueSlug,
} from "./classPath.js";

assert.equal(slugify("FSc Part 1"), "fsc-part-1");
assert.equal(slugify("Organic & Physical"), "organic-and-physical");
assert.equal(slugify("  "), "item");

const first = { id: "aaaaaa111", name: "Chemistry", createdAt: 1 };
const second = { id: "bbbbbb222", name: "Chemistry", createdAt: 2 };
assert.equal(itemSlug(first, [first, second]), "chemistry");
assert.equal(itemSlug(second, [first, second]), "chemistry-bbbbbb");
assert.equal(itemSlug({ id: "cccccc333", name: "Chemistry", slug: "chem" }, [first]), "chem");
assert.equal(uniqueSlug("chemistry", [{ slug: "chemistry" }]), "chemistry-2");

const classes = [{ id: "class1", name: "Class 11" }];
const subjects = [{ id: "sub1", name: "Chemistry" }];
assert.equal(subjectPath(classes[0], classes, subjects[0], subjects), "/classes/class-11/chemistry");
assert.equal(matchesSegment(subjects[0], "chemistry", subjects), true);
assert.equal(matchesSegment(subjects[0], "sub1", subjects), true);
assert.equal(chapterAnchor({ id: "ch1", name: "Hydrocarbons" }, [{ id: "ch1", name: "Hydrocarbons" }]), "chapter-hydrocarbons");

const href = lessonPath({
  classItem: classes[0],
  classes,
  subject: subjects[0],
  subjects,
  module: { id: "mod1", name: "Organic" },
  modules: [{ id: "mod1", name: "Organic" }],
  chapter: { id: "ch1", name: "Hydrocarbons" },
  chapters: [{ id: "ch1", name: "Hydrocarbons" }],
  topic: { id: "top1", name: "Alkanes" },
  topics: [{ id: "top1", name: "Alkanes" }],
});
assert.equal(href, "/classes/class-11/chemistry/organic/hydrocarbons/alkanes");

console.log("class path ok");
