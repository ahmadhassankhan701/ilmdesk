export function slugify(value) {
  const slug = String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return slug || "item";
}

export function createdStamp(item) {
  const value = item?.createdAt;
  if (typeof value === "number") return value;
  return value?.toMillis?.() || (value?.seconds ? value.seconds * 1000 : 0) || value?.getTime?.() || 0;
}

export function itemId(item) {
  return String(item?.id || item?.key || "");
}

export function itemSlug(item, siblings = []) {
  if (item?.slug) return String(item.slug);
  const base = slugify(item?.name);
  const id = itemId(item);
  const group = siblings.filter((other) => !other.slug && slugify(other.name) === base);
  if (group.length <= 1) return base;
  const earliest = [...group].sort(
    (a, b) => createdStamp(a) - createdStamp(b) || itemId(a).localeCompare(itemId(b))
  )[0];
  if (itemId(earliest) === id) return base;
  return id ? `${base}-${id.slice(0, 6).toLowerCase()}` : base;
}

export function uniqueSlug(base, siblings) {
  const root = base || "item";
  const taken = new Set(siblings.map((item) => item.slug || slugify(item.name)));
  let slug = root;
  let count = 2;
  while (taken.has(slug)) {
    slug = `${root}-${count}`;
    count += 1;
  }
  return slug;
}

export function matchesSegment(item, segment, siblings = []) {
  const value = decodeURIComponent(String(segment || "")).trim().toLowerCase();
  if (!value) return false;
  if (itemId(item) === String(segment || "")) return true;
  if (String(item?.slug || "").toLowerCase() === value) return true;
  return itemSlug(item, siblings).toLowerCase() === value;
}

export function classAnchor(item, siblings) {
  return `class-${itemSlug(item, siblings)}`;
}

export function chapterAnchor(item, siblings) {
  return `chapter-${itemSlug(item, siblings)}`;
}

export function subjectPath(classItem, classes, subject, subjects) {
  return `/classes/${itemSlug(classItem, classes)}/${itemSlug(subject, subjects)}`;
}

export function modulePath(classItem, classes, subject, subjects, module, modules) {
  return `${subjectPath(classItem, classes, subject, subjects)}/${itemSlug(module, modules)}`;
}

export function lessonPath({ classItem, classes, subject, subjects, module, modules, chapter, chapters, topic, topics }) {
  const moduleHref = modulePath(classItem, classes, subject, subjects, module, modules);
  return `${moduleHref}/${itemSlug(chapter, chapters)}/${itemSlug(topic, topics)}`;
}
