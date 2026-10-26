import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "@/firebase";
import { blocksFromStored, CLASS_LEVELS, publishLesson } from "@/lib/curriculumFormat";
import { slugify, uniqueSlug } from "@/lib/classPath";

export { blocksFromStored, CLASS_LEVELS, DIFFICULTIES, emptyQuestion, newBlock, publishLesson, theoryForStudents, youtubeId } from "@/lib/curriculumFormat";

const THEORY = { class: "ClassesTheory", course: "CourseTheory" };
const QUIZZES = { class: "ClassQuizzes", course: "CourseQuizzes" };
const QUIZ_PARENT = { class: "topicId", course: "moduleId" };

function byCreated(items) {
  return [...items].sort((a, b) => {
    const aTime = a.createdAt?.toMillis?.() || 0;
    const bTime = b.createdAt?.toMillis?.() || 0;
    return aTime - bTime;
  });
}

export async function listClassItems(levelIndex, parentId) {
  const level = CLASS_LEVELS[levelIndex];
  const items = collection(db, level.collection);
  const request = level.parentField
    ? query(items, where(level.parentField, "==", parentId))
    : items;
  const snapshot = await getDocs(request);
  return byCreated(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
}

export async function addClassItem(levelIndex, parentId, name) {
  const trimmed = (name || "").trim();
  if (!trimmed) throw new Error("Enter a name.");
  const level = CLASS_LEVELS[levelIndex];
  const siblings = await listClassItems(levelIndex, parentId);
  const data = { name: trimmed, slug: uniqueSlug(slugify(trimmed), siblings), createdAt: new Date() };
  if (level.parentField) data[level.parentField] = parentId;
  const created = await addDoc(collection(db, level.collection), data);
  return created.id;
}

export async function renameClassItem(levelIndex, id, name) {
  const trimmed = (name || "").trim();
  if (!trimmed) throw new Error("Enter a name.");
  const level = CLASS_LEVELS[levelIndex];
  const ref = doc(db, level.collection, id);
  const current = await getDoc(ref);
  const data = current.data() || {};
  const update = { name: trimmed };
  if (!data.slug) {
    const siblings = await listClassItems(levelIndex, level.parentField ? data[level.parentField] : null);
    update.slug = uniqueSlug(slugify(data.name || trimmed), siblings.filter((item) => item.id !== id));
  }
  await updateDoc(ref, update);
}

export async function deleteClassItem(levelIndex, id) {
  await deleteDoc(doc(db, CLASS_LEVELS[levelIndex].collection, id));
}

function storagePathFromUrl(url) {
  if (!url || typeof url !== "string") return "";
  try {
    const parsed = new URL(url);
    const marker = "/o/";
    const index = parsed.pathname.indexOf(marker);
    if (index < 0) return "";
    const path = decodeURIComponent(parsed.pathname.slice(index + marker.length));
    return path.startsWith("CoursesImages/") ? path : "";
  } catch {
    return "";
  }
}

async function deleteLessonRecords(kind, id) {
  const theoryRef = doc(db, THEORY[kind], id);
  const theorySnap = await getDoc(theoryRef);
  if (theorySnap.exists()) {
    const blocks = Array.isArray(theorySnap.data().blocks) ? theorySnap.data().blocks : [];
    await Promise.all(
      blocks
        .filter((block) => block?.path)
        .map((block) => removeStoredFile(block.path).catch((error) => console.error(error)))
    );
    await deleteDoc(theoryRef);
  }
  const quizzes = await listQuizzes(kind, id);
  await Promise.all(quizzes.map((quiz) => deleteQuiz(kind, quiz.id)));
  if (kind !== "class") return;
  try {
    const reviews = await getDocs(query(collection(db, "ClassReviews"), where("topicId", "==", id)));
    await Promise.all(reviews.docs.map((item) => deleteDoc(item.ref).catch((error) => console.error(error))));
  } catch (error) {
    console.error(error);
  }
}

export async function deleteClassTree(classId) {
  const subjects = await listClassItems(1, classId);
  for (const subject of subjects) {
    const modules = await listClassItems(2, subject.id);
    for (const module of modules) {
      const chapters = await listClassItems(3, module.id);
      for (const chapter of chapters) {
        const topics = await listClassItems(4, chapter.id);
        for (const topic of topics) {
          await deleteLessonRecords("class", topic.id);
          await deleteDoc(doc(db, "topics", topic.id));
        }
        await deleteDoc(doc(db, "chapters", chapter.id));
      }
      await deleteDoc(doc(db, "branches", module.id));
    }
    await deleteDoc(doc(db, "subjects", subject.id));
  }
  await deleteDoc(doc(db, "classes", classId));
}

export async function deleteCourseTree(courseId) {
  const snap = await getDoc(doc(db, "courses", courseId));
  const modules = snap.exists() ? snap.data().modules || [] : [];
  for (const module of modules) {
    if (module?.id) await deleteLessonRecords("course", module.id);
  }
  const cover = storagePathFromUrl(snap.data()?.image);
  if (cover) await removeStoredFile(cover).catch((error) => console.error(error));
  await deleteDoc(doc(db, "courses", courseId));
}

export async function listCourses() {
  const snapshot = await getDocs(collection(db, "courses"));
  return snapshot.docs
    .map((item) => ({ id: item.id, ...item.data(), modules: item.data().modules || [] }))
    .sort((a, b) => (a.title || "").localeCompare(b.title || ""));
}

export async function saveCourse(id, details) {
  const payload = {
    title: details.title.trim(),
    subject: details.subject.trim(),
    price: String(details.price).trim(),
    image: details.image || "",
    difficulty: details.difficulty || "beginner",
    desc: (details.desc || "").trim(),
  };
  if (!payload.title || !payload.subject) throw new Error("Enter a title and a subject.");
  if (payload.price === "" || Number.isNaN(Number(payload.price)) || Number(payload.price) < 0) {
    throw new Error("Enter a price of 0 or more.");
  }
  if (id) {
    await updateDoc(doc(db, "courses", id), payload);
    return id;
  }
  const created = await addDoc(collection(db, "courses"), {
    ...payload,
    modules: [],
    students: [],
    createdAt: new Date(),
  });
  return created.id;
}

export async function deleteCourse(id) {
  await deleteDoc(doc(db, "courses", id));
}

export async function addCourseModule(courseId, modules, name) {
  const trimmed = (name || "").trim();
  if (!trimmed) throw new Error("Enter a module name.");
  const next = [
    ...(modules || []),
    { id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`, name: trimmed, createdAt: new Date() },
  ];
  await updateDoc(doc(db, "courses", courseId), { modules: next });
  return next;
}

export async function renameCourseModule(courseId, modules, moduleId, name) {
  const trimmed = (name || "").trim();
  if (!trimmed) throw new Error("Enter a module name.");
  const next = (modules || []).map((module) =>
    module.id === moduleId ? { ...module, name: trimmed } : module
  );
  await updateDoc(doc(db, "courses", courseId), { modules: next });
  return next;
}

export async function deleteCourseModule(courseId, modules, moduleId) {
  const next = (modules || []).filter((module) => module.id !== moduleId);
  await updateDoc(doc(db, "courses", courseId), { modules: next });
  return next;
}

export async function loadLesson(kind, id) {
  const snap = await getDoc(doc(db, THEORY[kind], id));
  const data = snap.exists() ? snap.data() : {};
  const quizzes = await listQuizzes(kind, id);
  return blocksFromStored({ ...data, quizzes });
}

export async function saveLesson(kind, id, blocks, courseId) {
  const existing = await listQuizzes(kind, id);
  const kept = new Set();
  const storedBlocks = [];
  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index];
    if (block.type !== "quiz") {
      storedBlocks.push({
        id: block.id,
        type: block.type,
        text: block.text || "",
        name: block.name || "",
        path: block.path || "",
        fileUrl: block.fileUrl || "",
        videoId: block.videoId || "",
        featured: Boolean(block.featured),
      });
      continue;
    }
    const quizId = await saveQuiz(
      kind,
      id,
      { ...block, id: block.quizId || undefined, order: index },
      courseId
    );
    kept.add(quizId);
    storedBlocks.push({ id: block.id, type: "quiz", quizId, order: index });
  }
  await Promise.all(
    existing.filter((quiz) => !kept.has(quiz.id)).map((quiz) => deleteQuiz(kind, quiz.id))
  );
  const payload = { ...publishLesson(blocks), blocks: storedBlocks };
  if (kind === "course") payload.courseId = courseId;
  await setDoc(doc(db, THEORY[kind], id), payload, { merge: true });
}

export async function uploadCurriculumFile(folder, ownerId, file) {
  const safeName = (file.name || "file").replace(/[^\w.\- ]+/g, "");
  const stamp = `${Date.now().toString(36)}-${safeName}`;
  const path = ownerId ? `${folder}/${ownerId}/${stamp}` : `${folder}/${stamp}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file, { contentType: file.type });
  const fileUrl = await getDownloadURL(storageRef);
  return { name: file.name, path, fileUrl };
}

export async function removeStoredFile(path) {
  if (!path) return;
  await deleteObject(ref(storage, path));
}

export async function listQuizzes(kind, parentId) {
  const request = query(
    collection(db, QUIZZES[kind]),
    where(QUIZ_PARENT[kind], "==", parentId)
  );
  const snapshot = await getDocs(request);
  return snapshot.docs
    .map((item) => ({ id: item.id, ...item.data() }))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export async function saveQuiz(kind, parentId, quiz, courseId) {
  const payload = {
    mode: quiz.mode || "online",
    quizTitle: (quiz.quizTitle || "").trim(),
    quizNumber: String(quiz.quizNumber || ""),
    duration: String(quiz.duration || ""),
    difficulty: quiz.difficulty || "beginner",
    questions: quiz.questions || [],
    [QUIZ_PARENT[kind]]: parentId,
    locked: 0,
    order: Number.isFinite(quiz.order) ? quiz.order : 0,
  };
  const label = payload.quizTitle || "Quiz";
  if (!payload.quizTitle) throw new Error("Enter a quiz title.");
  if (!payload.questions.length) throw new Error(`${label}: add at least one question.`);
  payload.questions.forEach((question, index) => {
    if (!(question.question || "").trim()) throw new Error(`${label}: question ${index + 1} is empty.`);
    if ((question.options || []).filter((option) => (option || "").trim()).length < 2) {
      throw new Error(`${label}: question ${index + 1} needs at least two options.`);
    }
  });
  if (kind === "course") payload.courseId = courseId;
  if (quiz.id) {
    await updateDoc(doc(db, QUIZZES[kind], quiz.id), payload);
    return quiz.id;
  }
  const created = await addDoc(collection(db, QUIZZES[kind]), payload);
  return created.id;
}

export async function deleteQuiz(kind, id) {
  await deleteDoc(doc(db, QUIZZES[kind], id));
}
