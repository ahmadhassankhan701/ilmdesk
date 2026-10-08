"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Button, InputAdornment, MenuItem, Typography } from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { auth, db } from "@/firebase";
import { useAuth } from "@/context/AuthContext";
import AuthFrame, { accent, Field, ink, muted, pillButton, primary, primaryHover, RoleChoice } from "@/components/AuthFrame";
import { completeProfile } from "@/lib/accounts";
import { destinationFor, ROLES } from "@/lib/roles";
import {
  EDUCATION_LEVELS,
  TEACHING_EXAMS,
  TEACHING_QUALIFICATIONS,
  educationLevelError,
  examsError,
  institutionError,
  pakistanPhoneDigits,
  pakistanPhoneError,
  pakistanPhoneValue,
  qualificationError,
  teachingNoteError,
} from "@/lib/formValidation";

function ProfilePage() {
  const route = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "";
  const courseId = searchParams.get("id") || "";
  const { state, setState } = useAuth();
  const [form, setForm] = useState({
    phone: "",
    city: "",
    focus: "",
    qualification: "",
    institution: "",
    exams: [],
    teachingNote: "",
  });
  const [errors, setErrors] = useState({});
  const [chosen, setChosen] = useState(ROLES.student);
  const [saving, setSaving] = useState(false);
  const [ready, setReady] = useState(false);
  const isOwner = state.user?.role === ROLES.owner;
  const teaching = !isOwner && chosen === ROLES.teacher;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setReady(true);
        return;
      }
      try {
        const snap = await getDoc(doc(db, "Users", firebaseUser.uid));
        const data = snap.exists() ? snap.data() : {};
        setForm({
          phone: pakistanPhoneDigits(data.phone || ""),
          city: data.city || "",
          focus: data.role === ROLES.teacher || EDUCATION_LEVELS.includes(data.focus) ? data.focus || "" : "",
          qualification: TEACHING_QUALIFICATIONS.includes(data.qualification) ? data.qualification : "",
          institution: data.institution || "",
          exams: Array.isArray(data.exams) ? data.exams.filter((exam) => TEACHING_EXAMS.includes(exam)) : [],
          teachingNote: data.teachingNote || "",
        });
        setChosen(data.role === ROLES.teacher ? ROLES.teacher : ROLES.student);
      } catch (error) {
        console.error(error);
      } finally {
        setReady(true);
      }
    });
    return unsubscribe;
  }, []);

  const save = async (event) => {
    event.preventDefault();
    const city = form.city.trim();
    const focus = teaching ? form.focus.trim() : form.focus;
    const nextErrors = {
      phone: pakistanPhoneError(form.phone),
      city: !city ? "Enter your city." : city.length < 2 ? "City must be at least 2 characters." : city.length > 32 ? "City must be 32 characters or fewer." : "",
      focus: teaching
        ? !focus
          ? "Enter the subject you teach."
          : focus.length > 40
            ? "Keep this to 40 characters or fewer."
            : ""
        : educationLevelError(focus),
      qualification: teaching ? qualificationError(form.qualification) : "",
      institution: teaching ? institutionError(form.institution) : "",
      exams: teaching ? examsError(form.exams) : "",
      teachingNote: teaching ? teachingNoteError(form.teachingNote) : "",
    };
    setErrors(nextErrors);
    const message = nextErrors.phone || nextErrors.city || nextErrors.focus || nextErrors.qualification || nextErrors.institution || nextErrors.exams || nextErrors.teachingNote;
    if (message) {
      toast.error(message);
      return;
    }
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) {
      toast.error("Sign in again to save this profile.");
      route.push("/auth");
      return;
    }
    try {
      setSaving(true);
      const user = await completeProfile(
        firebaseUser,
        {
          phone: pakistanPhoneValue(form.phone),
          city,
          focus,
          qualification: form.qualification,
          institution: form.institution,
          exams: form.exams,
          teachingNote: form.teachingNote,
          role: isOwner ? ROLES.owner : chosen,
        },
        setState
      );
      toast.success("Profile saved.");
      route.push(destinationFor(user, { redirectTo, courseId }));
    } catch (error) {
      console.error(error);
      toast.error("The profile could not be saved. Check the fields and try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AuthFrame
      eyebrow="Profile"
      title="Finish the profile, then the dashboard."
      body={
        teaching
          ? "Add your qualification and how you teach. The dashboard opens next, with tools locked until the owner verifies you."
          : "Choose student or teacher, then add the details the desk keeps for you."
      }
    >
      <Box component="form" onSubmit={save}>
        <Typography sx={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.6, mb: 0.75 }}>Complete your profile</Typography>
        <Typography sx={{ color: muted, mb: 2.5 }}>{state.user?.email || "Signed-in account"}</Typography>
        {!isOwner && (
          <RoleChoice
            value={chosen}
            onChange={(next) => {
              setChosen(next);
              setForm((current) => ({
                ...current,
                focus: "",
                qualification: "",
                institution: "",
                exams: [],
                teachingNote: "",
              }));
              setErrors((current) => ({
                ...current,
                focus: "",
                qualification: "",
                institution: "",
                exams: "",
                teachingNote: "",
              }));
            }}
          />
        )}
        <Field
          label="Phone"
          required
          placeholder="300 1234567"
          inputMode="numeric"
          autoComplete="tel-national"
          disabled={!ready}
          error={errors.phone}
          value={form.phone}
          onChange={(event) => {
            setForm({ ...form, phone: pakistanPhoneDigits(event.target.value) });
            setErrors((current) => ({ ...current, phone: "" }));
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Typography sx={{ color: ink, fontWeight: 700, fontSize: 15 }}>+92</Typography>
              </InputAdornment>
            ),
          }}
        />
        <Field
          label="City"
          required
          placeholder="Lahore"
          disabled={!ready}
          error={errors.city}
          value={form.city}
          onChange={(event) => {
            setForm({ ...form, city: event.target.value });
            setErrors((current) => ({ ...current, city: "" }));
          }}
        />
        {teaching ? (
          <Field
            label="Subject you teach"
            required
            placeholder="Chemistry"
            disabled={!ready}
            error={errors.focus}
            value={form.focus}
            onChange={(event) => {
              setForm({ ...form, focus: event.target.value });
              setErrors((current) => ({ ...current, focus: "" }));
            }}
          />
        ) : null}
        {teaching ? (
          <>
            <Field
              select
              label="Highest qualification"
              required
              disabled={!ready}
              error={errors.qualification}
              value={form.qualification}
              onChange={(event) => {
                setForm({ ...form, qualification: event.target.value });
                setErrors((current) => ({ ...current, qualification: "" }));
              }}
              SelectProps={{
                displayEmpty: true,
                renderValue: (selected) => selected || "Select a qualification",
              }}
            >
              <MenuItem value="" sx={{ display: "none" }} />
              {TEACHING_QUALIFICATIONS.map((level) => (
                <MenuItem key={level} value={level}>
                  {level}
                </MenuItem>
              ))}
            </Field>
            <Field
              label="Institution"
              required
              placeholder="University or college"
              disabled={!ready}
              error={errors.institution}
              value={form.institution}
              onChange={(event) => {
                setForm({ ...form, institution: event.target.value });
                setErrors((current) => ({ ...current, institution: "" }));
              }}
            />
            <Box sx={{ mb: 1.5 }}>
              <Typography
                sx={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 1.15,
                  textTransform: "uppercase",
                  mb: 0.85,
                  color: muted,
                }}
              >
                Exams you will teach
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {TEACHING_EXAMS.map((exam) => {
                  const selected = form.exams.includes(exam);
                  return (
                    <Box
                      key={exam}
                      component="button"
                      type="button"
                      disabled={!ready}
                      onClick={() => {
                        setForm((current) => ({
                          ...current,
                          exams: selected ? current.exams.filter((item) => item !== exam) : [...current.exams, exam],
                        }));
                        setErrors((current) => ({ ...current, exams: "" }));
                      }}
                      sx={{
                        borderRadius: 999,
                        px: 1.6,
                        py: 0.8,
                        border: selected ? `1.5px solid ${ink}` : "1px solid #E2E8EC",
                        bgcolor: selected ? ink : "#fff",
                        color: selected ? "#fff" : ink,
                        cursor: "pointer",
                        font: "inherit",
                        fontSize: 14,
                        fontWeight: 600,
                      }}
                    >
                      {exam}
                    </Box>
                  );
                })}
              </Box>
              <Typography sx={{ color: accent, mx: 0.25, mt: 0.75, minHeight: 18, fontSize: 12 }}>{errors.exams || " "}</Typography>
            </Box>
            <Field
              label="How you teach"
              required
              multiline
              minRows={4}
              placeholder="Two or three sentences on how you teach this subject for these exams."
              disabled={!ready}
              error={errors.teachingNote}
              value={form.teachingNote}
              onChange={(event) => {
                setForm({ ...form, teachingNote: event.target.value });
                setErrors((current) => ({ ...current, teachingNote: "" }));
              }}
            />
          </>
        ) : (
          <Field
            select
            label="Education level completed"
            required
            disabled={!ready}
            error={errors.focus}
            value={form.focus}
            onChange={(event) => {
              setForm({ ...form, focus: event.target.value });
              setErrors((current) => ({ ...current, focus: "" }));
            }}
            SelectProps={{
              displayEmpty: true,
              renderValue: (selected) => selected || "Select a level",
            }}
          >
            <MenuItem value="" sx={{ display: "none" }} />
            {EDUCATION_LEVELS.map((level) => (
              <MenuItem key={level} value={level}>
                {level}
              </MenuItem>
            ))}
          </Field>
        )}
        <Button
          type="submit"
          variant="contained"
          disabled={saving || !ready}
          sx={{ ...pillButton, bgcolor: primary, color: "#fff", "&:hover": { bgcolor: primaryHover, boxShadow: "none" } }}
        >
          {saving ? "Saving…" : "Save and continue"}
        </Button>
      </Box>
    </AuthFrame>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ProfilePage />
    </Suspense>
  );
}
