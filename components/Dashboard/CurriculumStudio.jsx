"use client";

import { useEffect, useState } from "react";
import { Box, Button, IconButton, MenuItem, TextField, Typography } from "@mui/material";
import { ArrowBack, ArrowForward, ChevronRight, Close, EditOutlined } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import PageTitle from "@/components/Dashboard/PageTitle";
import LessonComposer from "@/components/Dashboard/LessonComposer";
import { fieldSx, ink, muted, pillButton, primary, primaryHover } from "@/components/AuthFrame";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase";
import {
  addClassItem,
  addCourseModule,
  deleteClassItem,
  deleteCourseModule,
  listClassItems,
  renameClassItem,
  renameCourseModule,
  saveCourse,
  uploadCurriculumFile,
} from "@/lib/curriculum";
import { CLASS_LEVELS, DIFFICULTIES } from "@/lib/curriculumFormat";
import { ROLES } from "@/lib/roles";

const CLASS_STEPS = ["Class", "Subject", "Module", "Chapter", "Topic", "Lesson"];
const COURSE_STEPS = ["Course", "Modules", "Lesson"];
const pine = "#0D9AAC";

function panel(accent = pine) {
  return {
    bgcolor: "#fff",
    borderRadius: "22px",
    borderTop: `3px solid ${accent}`,
    p: { xs: 2, md: 2.5 },
  };
}

function BackLink({ onClick }) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        mb: 2,
        p: 0,
        border: 0,
        bgcolor: "transparent",
        color: ink,
        cursor: "pointer",
        font: "inherit",
        fontWeight: 600,
        fontSize: 15,
        "&:hover": { color: pine },
      }}
    >
      <ArrowBack sx={{ fontSize: 18 }} />
      Back
    </Box>
  );
}

function StepMove({ onBack, onNext, canBack, canNext }) {
  const link = {
    display: "inline-flex",
    alignItems: "center",
    gap: 0.6,
    p: 0,
    border: 0,
    bgcolor: "transparent",
    color: ink,
    cursor: "pointer",
    font: "inherit",
    fontWeight: 600,
    fontSize: 15,
    "&:hover": { color: pine },
    "&:disabled": { color: "#8A97A3", cursor: "default" },
  };
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2.5 }}>
      <Box component="button" type="button" onClick={onBack} disabled={!canBack} sx={link}>
        <ArrowBack sx={{ fontSize: 18 }} />
        Back
      </Box>
      <Box component="button" type="button" onClick={onNext} disabled={!canNext} sx={link}>
        Next
        <ArrowForward sx={{ fontSize: 18 }} />
      </Box>
    </Box>
  );
}

function useBrandAdmin() {
  const { state, ready } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!ready) return;
    if (!state.user) router.replace("/auth");
    else if (state.user.role !== ROLES.owner) router.replace("/dashboard");
  }, [ready, state.user, router]);
  return ready && state.user?.role === ROLES.owner;
}

export function ClassStudio({ classId }) {
  const allowed = useBrandAdmin();
  const router = useRouter();
  const isNew = classId === "new";
  const [path, setPath] = useState([]);
  const [cursor, setCursor] = useState(isNew ? 0 : 1);
  const [items, setItems] = useState([]);
  const [draft, setDraft] = useState("");
  const [rename, setRename] = useState({ id: "", name: "" });
  const [loading, setLoading] = useState(!isNew);

  useEffect(() => {
    if (!allowed || isNew) return undefined;
    let ignore = false;
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, "classes", classId));
        if (ignore) return;
        if (!snap.exists()) {
          toast.error("That class was not found.");
          router.replace("/dashboard/curriculum");
          return;
        }
        setPath([{ id: snap.id, name: snap.data().name || "Class" }]);
        setCursor(1);
      } catch (error) {
        console.error(error);
        toast.error("Could not open this class.");
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, [allowed, classId, isNew, router]);

  useEffect(() => {
    if (!allowed || cursor < 1 || cursor > 4 || !path[cursor - 1]) return undefined;
    let ignore = false;
    const load = async () => {
      try {
        const rows = await listClassItems(cursor, path[cursor - 1].id);
        if (!ignore) setItems(rows);
      } catch (error) {
        console.error(error);
        toast.error("Could not load this step.");
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, [allowed, cursor, path]);

  const createClass = async (event) => {
    event.preventDefault();
    try {
      const name = draft.trim();
      const id = await addClassItem(0, null, name);
      router.replace(`/dashboard/curriculum/class/${id}`);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Could not create this class.");
    }
  };

  const addCurrent = async (event) => {
    event.preventDefault();
    try {
      await addClassItem(cursor, path[cursor - 1].id, draft);
      setDraft("");
      setItems(await listClassItems(cursor, path[cursor - 1].id));
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Could not add this.");
    }
  };

  if (!allowed) return null;

  const onLesson = cursor === CLASS_LEVELS.length;
  const level = CLASS_LEVELS[Math.min(cursor, CLASS_LEVELS.length - 1)];
  const canForward = cursor < CLASS_STEPS.length - 1 && Boolean(path[cursor]);
  const openAt = (item) => {
    setDraft("");
    setRename({ id: "", name: "" });
    setPath((current) => [...current.slice(0, cursor), item]);
    setCursor(cursor + 1);
  };

  const reachable = (index) => {
    if (isNew) return index === 0;
    if (index === 0) return Boolean(path[0]);
    return Boolean(path[index - 1]);
  };

  return (
    <Box sx={{ pb: { xs: 4, md: 6 } }}>
      <PageTitle eyebrow="Curriculum" title={isNew ? "New class" : path[0]?.name || "Class"} body="Name the class, then add the subject, module, chapter, topic, and lesson. You can move back to an earlier step and forward again." />
      <BackLink onClick={() => router.push("/dashboard/curriculum")} />
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "280px 1fr" }, gap: 2, alignItems: "start" }}>
        <Box sx={panel()}>
          <Typography sx={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.1, textTransform: "uppercase", color: pine, mb: 1.5 }}>Steps</Typography>
          {CLASS_STEPS.map((step, index) => {
            const current = index === cursor;
            const open = reachable(index);
            return (
              <Box
                key={step}
                onClick={() => {
                  if (open && index !== cursor) setCursor(index);
                }}
                sx={{ display: "flex", gap: 1.2, alignItems: "center", py: 0.85, cursor: open && index !== cursor ? "pointer" : "default", color: current ? ink : open ? muted : "#8A97A3" }}
              >
                <Box sx={{ width: 22, height: 22, borderRadius: "50%", bgcolor: current ? pine : open ? "rgba(13, 154, 172, 0.12)" : "#E2E8EC", color: current ? "#fff" : open ? pine : muted, fontSize: 12, fontWeight: 700, display: "grid", placeItems: "center" }}>{index + 1}</Box>
                <Box>
                  <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{step}</Typography>
                  {path[index] && <Typography sx={{ fontSize: 12, color: muted }}>{path[index].name}</Typography>}
                </Box>
              </Box>
            );
          })}
        </Box>
        {isNew ? (
          <Box component="form" onSubmit={createClass} sx={panel()}>
            <Typography sx={{ fontWeight: 700, color: ink, fontSize: 22, mb: 0.5 }}>Name the class</Typography>
            <Typography sx={{ color: muted, fontSize: 14, mb: 2 }}>This is the first step. Subjects come next.</Typography>
            <TextField size="small" fullWidth placeholder="Class name" value={draft} onChange={(event) => setDraft(event.target.value)} sx={{ ...fieldSx, mb: 2 }} />
            <Button type="submit" sx={{ ...pillButton, width: "auto", bgcolor: primary, color: "#fff", "&:hover": { bgcolor: primaryHover, boxShadow: "none" } }}>Continue</Button>
          </Box>
        ) : loading || path.length === 0 ? (
          <Typography sx={{ color: muted }}>Loading…</Typography>
        ) : cursor === 0 ? (
          <Box sx={panel()}>
            <Typography sx={{ fontWeight: 700, color: ink, fontSize: 22 }}>{path[0].name}</Typography>
            <Typography sx={{ color: muted, fontSize: 14, mt: 0.4 }}>This class is saved. Continue to its subjects, or go back to the full list.</Typography>
            <StepMove canBack={false} canNext onBack={() => {}} onNext={() => setCursor(1)} />
          </Box>
        ) : onLesson ? (
          <Box>
            <LessonComposer kind="class" contentId={path[4].id} title={path[4].name} />
            <StepMove canBack canNext={false} onBack={() => setCursor(4)} onNext={() => {}} />
          </Box>
        ) : (
          <Box sx={panel()}>
            <Typography sx={{ fontWeight: 700, color: ink, fontSize: 22 }}>{path[cursor - 1].name}</Typography>
            <Typography sx={{ color: muted, fontSize: 14, mt: 0.4, mb: 2 }}>Add a {level.label.toLowerCase()}, then open it to continue.</Typography>
            <Box component="form" onSubmit={addCurrent} sx={{ display: "flex", gap: 1, mb: 2 }}>
              <TextField size="small" fullWidth placeholder={`New ${level.label.toLowerCase()}`} value={draft} onChange={(event) => setDraft(event.target.value)} sx={fieldSx} />
              <Button type="submit" sx={{ ...pillButton, width: "auto", px: 2.2, bgcolor: primary, color: "#fff", "&:hover": { bgcolor: primaryHover, boxShadow: "none" } }}>Add</Button>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {items.map((item) => (
                <Row
                  key={item.id}
                  name={item.name}
                  selected={path[cursor]?.id === item.id}
                  editing={rename.id === item.id}
                  editName={rename.name}
                  onEditName={(name) => setRename({ id: item.id, name })}
                  onOpen={() => openAt(item)}
                  onStartRename={() => setRename({ id: item.id, name: item.name })}
                  onCancelRename={() => setRename({ id: "", name: "" })}
                  onSaveRename={async () => {
                    try {
                      await renameClassItem(cursor, item.id, rename.name);
                      setRename({ id: "", name: "" });
                      setPath((current) => current.map((node, index) => (index === cursor && node.id === item.id ? { ...node, name: rename.name.trim() } : node)));
                      setItems(await listClassItems(cursor, path[cursor - 1].id));
                    } catch (error) {
                      console.error(error);
                      toast.error(error.message || "Could not rename this.");
                    }
                  }}
                  onRemove={async () => {
                    if (!window.confirm(`Remove ${item.name}?`)) return;
                    try {
                      await deleteClassItem(cursor, item.id);
                      setPath((current) => (current[cursor]?.id === item.id ? current.slice(0, cursor) : current));
                      setItems(await listClassItems(cursor, path[cursor - 1].id));
                    } catch (error) {
                      console.error(error);
                      toast.error("Could not remove this.");
                    }
                  }}
                />
              ))}
              {items.length === 0 && <Typography sx={{ color: muted }}>Nothing here yet.</Typography>}
            </Box>
            <StepMove canBack={cursor > 0} canNext={canForward} onBack={() => setCursor(cursor - 1)} onNext={() => setCursor(cursor + 1)} />
          </Box>
        )}
      </Box>
    </Box>
  );
}

export function CourseStudio({ courseId }) {
  const allowed = useBrandAdmin();
  const router = useRouter();
  const isNew = courseId === "new";
  const [course, setCourse] = useState(null);
  const [details, setDetails] = useState({ title: "", subject: "", price: "0", image: "", difficulty: "beginner", desc: "" });
  const [module, setModule] = useState(null);
  const [step, setStep] = useState(isNew ? 0 : 1);
  const [draft, setDraft] = useState("");
  const [rename, setRename] = useState({ id: "", name: "" });
  const [loading, setLoading] = useState(!isNew);

  useEffect(() => {
    if (!allowed || isNew) return undefined;
    let ignore = false;
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, "courses", courseId));
        if (ignore) return;
        if (!snap.exists()) {
          toast.error("That course was not found.");
          router.replace("/dashboard/curriculum");
          return;
        }
        const data = snap.data();
        const next = { id: snap.id, ...data, modules: data.modules || [] };
        setCourse(next);
        setDetails({
          title: data.title || "",
          subject: data.subject || "",
          price: data.price ?? "0",
          image: data.image || "",
          difficulty: data.difficulty || "beginner",
          desc: data.desc || "",
        });
      } catch (error) {
        console.error(error);
        toast.error("Could not open this course.");
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, [allowed, courseId, isNew, router]);

  const createCourse = async (event) => {
    event.preventDefault();
    try {
      const title = details.title.trim();
      const subject = details.subject.trim();
      const id = await saveCourse(null, { ...details, title, subject });
      router.replace(`/dashboard/curriculum/course/${id}`);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Could not create this course.");
    }
  };

  if (!allowed) return null;

  const openStep = (index) => {
    if (isNew) return index === 0;
    if (index === 2) return Boolean(module);
    return Boolean(course);
  };

  return (
    <Box sx={{ pb: { xs: 4, md: 6 } }}>
      <PageTitle eyebrow="Curriculum" title={isNew ? "New course" : details.title || "Course"} body="Name the course, add its modules, then publish each module as a lesson. You can move back and forward between these steps." />
      <BackLink onClick={() => router.push("/dashboard/curriculum")} />
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "280px 1fr" }, gap: 2, alignItems: "start" }}>
        <Box sx={panel()}>
          <Typography sx={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.1, textTransform: "uppercase", color: pine, mb: 1.5 }}>Steps</Typography>
          {COURSE_STEPS.map((label, index) => {
            const current = index === step;
            const open = openStep(index);
            return (
              <Box
                key={label}
                onClick={() => {
                  if (open && index !== step) setStep(index);
                }}
                sx={{ display: "flex", gap: 1.2, alignItems: "center", py: 0.85, cursor: open && index !== step ? "pointer" : "default", color: current ? ink : open ? muted : "#8A97A3" }}
              >
                <Box sx={{ width: 22, height: 22, borderRadius: "50%", bgcolor: current ? pine : open ? "rgba(13, 154, 172, 0.12)" : "#E2E8EC", color: current ? "#fff" : open ? pine : muted, fontSize: 12, fontWeight: 700, display: "grid", placeItems: "center" }}>{index + 1}</Box>
                <Box>
                  <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{label}</Typography>
                  {index === 2 && module && <Typography sx={{ fontSize: 12, color: muted }}>{module.name}</Typography>}
                </Box>
              </Box>
            );
          })}
        </Box>
        {isNew ? (
          <Box component="form" onSubmit={createCourse} sx={panel()}>
            <Typography sx={{ fontWeight: 700, color: ink, fontSize: 22, mb: 0.5 }}>Name the course</Typography>
            <Typography sx={{ color: muted, fontSize: 14, mb: 2 }}>Title and subject are enough to start. Modules come next.</Typography>
            <TextField size="small" fullWidth label="Title" value={details.title} onChange={(event) => setDetails({ ...details, title: event.target.value })} sx={{ ...fieldSx, mb: 1.5 }} />
            <TextField size="small" fullWidth label="Subject" value={details.subject} onChange={(event) => setDetails({ ...details, subject: event.target.value })} sx={{ ...fieldSx, mb: 2 }} />
            <Button type="submit" sx={{ ...pillButton, width: "auto", bgcolor: primary, color: "#fff", "&:hover": { bgcolor: primaryHover, boxShadow: "none" } }}>Continue</Button>
          </Box>
        ) : loading || !course ? (
          <Typography sx={{ color: muted }}>Loading…</Typography>
        ) : step === 0 ? (
          <Box>
            <CourseDetails
              details={details}
              setDetails={setDetails}
              onSave={async () => {
                try {
                  await saveCourse(course.id, details);
                  setCourse({ ...course, ...details });
                  toast.success("Course details saved.");
                } catch (error) {
                  console.error(error);
                  toast.error(error.message || "Could not save this course.");
                }
              }}
            />
            <StepMove canBack={false} canNext onBack={() => {}} onNext={() => setStep(1)} />
          </Box>
        ) : step === 2 && module ? (
          <Box>
            <LessonComposer kind="course" contentId={module.id} courseId={course.id} title={module.name} />
            <StepMove canBack canNext={false} onBack={() => setStep(1)} onNext={() => {}} />
          </Box>
        ) : (
          <Box sx={panel()}>
              <Typography sx={{ fontWeight: 700, color: ink, fontSize: 22 }}>Modules</Typography>
              <Typography sx={{ color: muted, fontSize: 14, mt: 0.4, mb: 2 }}>Open a module to publish its lesson. You can come back to this list afterward.</Typography>
              <Box
                component="form"
                onSubmit={async (event) => {
                  event.preventDefault();
                  try {
                    const modules = await addCourseModule(course.id, course.modules, draft);
                    setCourse({ ...course, modules });
                    setDraft("");
                  } catch (error) {
                    console.error(error);
                    toast.error(error.message || "Could not add this module.");
                  }
                }}
                sx={{ display: "flex", gap: 1, mb: 2 }}
              >
                <TextField size="small" fullWidth placeholder="New module" value={draft} onChange={(event) => setDraft(event.target.value)} sx={fieldSx} />
                <Button type="submit" sx={{ ...pillButton, width: "auto", px: 2.2, bgcolor: primary, color: "#fff", "&:hover": { bgcolor: primaryHover, boxShadow: "none" } }}>Add</Button>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {(course.modules || []).map((item) => (
                  <Row
                    key={item.id}
                    name={item.name}
                    selected={module?.id === item.id}
                    editing={rename.id === item.id}
                    editName={rename.name}
                    onEditName={(name) => setRename({ id: item.id, name })}
                    onOpen={() => {
                      setModule(item);
                      setStep(2);
                    }}
                    onStartRename={() => setRename({ id: item.id, name: item.name })}
                    onCancelRename={() => setRename({ id: "", name: "" })}
                    onSaveRename={async () => {
                      try {
                        const modules = await renameCourseModule(course.id, course.modules, item.id, rename.name);
                        setCourse({ ...course, modules });
                        if (module?.id === item.id) setModule({ ...module, name: rename.name.trim() });
                        setRename({ id: "", name: "" });
                      } catch (error) {
                        console.error(error);
                        toast.error(error.message || "Could not rename this module.");
                      }
                    }}
                    onRemove={async () => {
                      if (!window.confirm(`Remove ${item.name}?`)) return;
                      try {
                        const modules = await deleteCourseModule(course.id, course.modules, item.id);
                        setCourse({ ...course, modules });
                        if (module?.id === item.id) setModule(null);
                      } catch (error) {
                        console.error(error);
                        toast.error("Could not remove this module.");
                      }
                    }}
                  />
                ))}
                {(course.modules || []).length === 0 && <Typography sx={{ color: muted }}>No modules yet.</Typography>}
              </Box>
            <StepMove canBack canNext={Boolean(module)} onBack={() => setStep(0)} onNext={() => setStep(2)} />
          </Box>
        )}
      </Box>
    </Box>
  );
}

function Row({ name, selected, editing, editName, onEditName, onOpen, onStartRename, onSaveRename, onCancelRename, onRemove }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, border: `1px solid ${selected ? pine : "#E2E8EC"}`, bgcolor: selected ? "rgba(13, 154, 172, 0.08)" : "#fff", borderRadius: "16px", px: 1.2, py: 0.6 }}>
      {editing ? (
        <TextField size="small" fullWidth value={editName} onChange={(event) => onEditName(event.target.value)} sx={fieldSx} />
      ) : (
        <Box onClick={onOpen} sx={{ flex: 1, py: 0.8, cursor: "pointer" }}>
          <Typography sx={{ color: ink, fontWeight: 650 }}>{name}</Typography>
        </Box>
      )}
      {editing ? (
        <>
          <Button type="button" onClick={onSaveRename} sx={{ ...pillButton, width: "auto", py: 0.6, bgcolor: ink, color: "#fff" }}>Save</Button>
          <IconButton aria-label="Cancel rename" onClick={onCancelRename}><Close sx={{ fontSize: 18 }} /></IconButton>
        </>
      ) : (
        <>
          <IconButton aria-label={`Rename ${name}`} onClick={onStartRename}><EditOutlined sx={{ fontSize: 18 }} /></IconButton>
          <IconButton aria-label={`Remove ${name}`} onClick={onRemove}><Close sx={{ fontSize: 18 }} /></IconButton>
          <IconButton aria-label={`Open ${name}`} onClick={onOpen}><ChevronRight /></IconButton>
        </>
      )}
    </Box>
  );
}

function CourseDetails({ details, setDetails, onSave }) {
  const set = (patch) => setDetails({ ...details, ...patch });
  const addCover = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file?.type?.startsWith("image/")) {
      toast.error("Choose an image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Use an image under 2MB.");
      return;
    }
    try {
      const stored = await uploadCurriculumFile("CoursesImages", "", file);
      set({ image: stored.fileUrl });
    } catch (error) {
      console.error(error);
      toast.error("Could not upload that image.");
    }
  };
  return (
    <Box sx={panel()}>
      <Typography sx={{ fontWeight: 700, color: ink, fontSize: 22, mb: 1.5 }}>Course details</Typography>
      <TextField size="small" fullWidth label="Title" value={details.title} onChange={(event) => set({ title: event.target.value })} sx={{ ...fieldSx, mb: 1.5 }} />
      <TextField size="small" fullWidth label="Subject" value={details.subject} onChange={(event) => set({ subject: event.target.value })} sx={{ ...fieldSx, mb: 1.5 }} />
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, mb: 1.5 }}>
        <TextField size="small" label="Price (Rs)" value={details.price} onChange={(event) => set({ price: event.target.value })} sx={fieldSx} />
        <TextField select size="small" label="Level" value={details.difficulty} onChange={(event) => set({ difficulty: event.target.value })} sx={fieldSx}>
          {DIFFICULTIES.map((level) => (
            <MenuItem key={level} value={level}>{level}</MenuItem>
          ))}
        </TextField>
      </Box>
      <TextField size="small" fullWidth multiline minRows={3} label="Description" value={details.desc} onChange={(event) => set({ desc: event.target.value })} sx={{ ...fieldSx, mb: 1.5 }} />
      {details.image && <Box component="img" src={details.image} alt="" sx={{ width: 160, height: 96, objectFit: "cover", borderRadius: "12px", mb: 1.5 }} />}
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        <Button component="label" sx={{ ...pillButton, width: "auto", py: 0.7, bgcolor: ink, color: "#fff", "&:hover": { bgcolor: "#132A46" } }}>
          {details.image ? "Replace image" : "Add image"}
          <input hidden type="file" accept="image/*" onChange={addCover} />
        </Button>
        <Button type="button" onClick={onSave} sx={{ ...pillButton, width: "auto", py: 0.7, bgcolor: primary, color: "#fff", "&:hover": { bgcolor: primaryHover, boxShadow: "none" } }}>
          Save details
        </Button>
      </Box>
    </Box>
  );
}
