import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import { lessonPath, matchesSegment, modulePath, subjectPath } from "@/lib/classPath";

function rows(snapshot) {
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

async function all(name) {
  return rows(await getDocs(collection(db, name)));
}

async function kids(name, field, parentId) {
  if (!parentId) return [];
  return rows(await getDocs(query(collection(db, name), where(field, "==", parentId))));
}

function pick(items, segment) {
  return items.find((item) => matchesSegment(item, segment, items)) || null;
}

export async function resolveSubjectPath(classSlug, subjectSlug) {
  const classes = await all("classes");
  const classItem = pick(classes, classSlug);
  if (!classItem) return null;
  const subjects = await kids("subjects", "classID", classItem.id);
  const subject = pick(subjects, subjectSlug);
  if (!subject) return null;
  const modules = await kids("branches", "subjectID", subject.id);
  return { classItem, classes, subject, subjects, modules };
}

export async function resolveModulePath(classSlug, subjectSlug, moduleSlug) {
  const subjectPathResult = await resolveSubjectPath(classSlug, subjectSlug);
  if (!subjectPathResult) return null;
  const module = pick(subjectPathResult.modules, moduleSlug);
  if (!module) return null;
  const chapters = await kids("chapters", "branchID", module.id);
  const topicGroups = await Promise.all(chapters.map((chapter) => kids("topics", "chapterID", chapter.id)));
  return { ...subjectPathResult, module, chapters, topics: topicGroups.flat() };
}

export async function resolveLessonPath(classSlug, subjectSlug, moduleSlug, chapterSlug, topicSlug) {
  const modulePathResult = await resolveModulePath(classSlug, subjectSlug, moduleSlug);
  if (!modulePathResult) return null;
  const chapter = pick(modulePathResult.chapters, chapterSlug);
  if (!chapter) return null;
  const topics = modulePathResult.topics.filter((topic) => topic.chapterID === chapter.id);
  const topic = pick(topics, topicSlug);
  if (!topic) return null;
  return { ...modulePathResult, chapter, topics, topic };
}

export async function legacyClassHref(kind, { id, chapterId } = {}) {
  if (!id) return "/classes";

  if (kind === "subject") {
    const subjectSnap = await getDoc(doc(db, "subjects", id));
    if (!subjectSnap.exists()) return "/classes";
    const subject = { id: subjectSnap.id, ...subjectSnap.data() };
    if (!subject.classID) return "/classes";
    const [classes, subjects] = await Promise.all([all("classes"), kids("subjects", "classID", subject.classID)]);
    const classItem = classes.find((item) => item.id === subject.classID);
    if (!classItem) return "/classes";
    return subjectPath(classItem, classes, subject, subjects);
  }

  if (kind === "module") {
    const moduleSnap = await getDoc(doc(db, "branches", id));
    if (!moduleSnap.exists()) return "/classes";
    const module = { id: moduleSnap.id, ...moduleSnap.data() };
    if (!module.subjectID) return "/classes";
    const subjectSnap = await getDoc(doc(db, "subjects", module.subjectID));
    if (!subjectSnap.exists()) return "/classes";
    const subject = { id: subjectSnap.id, ...subjectSnap.data() };
    if (!subject.classID) return "/classes";
    const [classes, subjects, modules] = await Promise.all([
      all("classes"),
      kids("subjects", "classID", subject.classID),
      kids("branches", "subjectID", subject.id),
    ]);
    const classItem = classes.find((item) => item.id === subject.classID);
    if (!classItem) return "/classes";
    return modulePath(classItem, classes, subject, subjects, module, modules);
  }

  const topicSnap = await getDoc(doc(db, "topics", id));
  if (!topicSnap.exists()) return "/classes";
  const topic = { id: topicSnap.id, ...topicSnap.data() };
  const chapterKey = chapterId || topic.chapterID;
  if (!chapterKey) return "/classes";
  const chapterSnap = await getDoc(doc(db, "chapters", chapterKey));
  if (!chapterSnap.exists()) return "/classes";
  const chapter = { id: chapterSnap.id, ...chapterSnap.data() };
  if (!chapter.branchID) return "/classes";
  const moduleSnap = await getDoc(doc(db, "branches", chapter.branchID));
  if (!moduleSnap.exists()) return "/classes";
  const module = { id: moduleSnap.id, ...moduleSnap.data() };
  if (!module.subjectID) return "/classes";
  const subjectSnap = await getDoc(doc(db, "subjects", module.subjectID));
  if (!subjectSnap.exists()) return "/classes";
  const subject = { id: subjectSnap.id, ...subjectSnap.data() };
  if (!subject.classID) return "/classes";
  const [classes, subjects, modules, chapters, topics] = await Promise.all([
    all("classes"),
    kids("subjects", "classID", subject.classID),
    kids("branches", "subjectID", subject.id),
    kids("chapters", "branchID", module.id),
    kids("topics", "chapterID", chapter.id),
  ]);
  const classItem = classes.find((item) => item.id === subject.classID);
  if (!classItem) return "/classes";
  return lessonPath({ classItem, classes, subject, subjects, module, modules, chapter, chapters, topic, topics });
}
