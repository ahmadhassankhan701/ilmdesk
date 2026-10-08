"use client";

import { useEffect, useRef, useState } from "react";
import { Avatar, Box, Button, InputAdornment, MenuItem, Typography } from "@mui/material";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import SideBar from "@/components/SideBar";
import PageTitle from "@/components/Dashboard/PageTitle";
import { Field, ink, muted, pillButton, primary, primaryHover } from "@/components/AuthFrame";
import { auth, db, storage } from "@/firebase";
import { useAuth } from "@/context/AuthContext";
import { updateOwnProfile } from "@/lib/accounts";
import { roleLabel } from "@/lib/roles";
import {
  EDUCATION_LEVELS,
  educationLevelError,
  nameError,
  pakistanPhoneDigits,
  pakistanPhoneError,
  pakistanPhoneValue,
} from "@/lib/formValidation";

const emptyForm = { name: "", phone: "", city: "", focus: "" };

function cityError(value) {
  const city = (value || "").trim();
  if (!city) return "Enter your city.";
  if (city.length < 2) return "City must be at least 2 characters.";
  if (city.length > 32) return "City must be 32 characters or fewer.";
  return "";
}

export default function StudentProfile() {
  const { state, setState } = useAuth();
  const fileRef = useRef(null);
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const teacher = state?.user?.role === "teacher";

  useEffect(() => {
    if (!state?.user?.uid) return undefined;
    let ignore = false;
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, "Users", state.user.uid));
        const data = snap.exists() ? snap.data() : {};
        if (ignore) return;
        setProfile(data);
        setForm({
          name: data.name || state.user.name || "",
          phone: pakistanPhoneDigits(data.phone || ""),
          city: data.city || "",
          focus: data.focus || "",
        });
      } catch (error) {
        console.error(error);
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, [state?.user?.uid, state?.user?.name]);

  useEffect(() => {
    return () => {
      if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const shownImage = preview || profile?.image || "";

  const chooseImage = (event) => {
    const next = event.target.files?.[0];
    event.target.value = "";
    if (!next) return;
    if (!next.type.startsWith("image/")) {
      toast.error("Choose an image file.");
      return;
    }
    if (next.size > 2_000_000) {
      toast.error("Image must be 2MB or smaller.");
      return;
    }
    if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    setFile(next);
    setPreview(URL.createObjectURL(next));
  };

  const removePreview = () => {
    if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview("");
  };

  const copyUserId = async () => {
    if (!state?.user?.uid) return;
    try {
      await navigator.clipboard.writeText(state.user.uid);
      toast.success("User id copied.");
    } catch (error) {
      console.error(error);
      toast.error("Could not copy the user id.");
    }
  };

  const save = async (event) => {
    event.preventDefault();
    const focusError = teacher
      ? !form.focus.trim()
        ? "Enter the subject you teach."
        : form.focus.trim().length > 40
          ? "Keep this to 40 characters or fewer."
          : ""
      : educationLevelError(form.focus);
    const nextErrors = {
      name: nameError(form.name),
      phone: pakistanPhoneError(form.phone),
      city: cityError(form.city),
      focus: focusError,
    };
    setErrors(nextErrors);
    const message = nextErrors.name || nextErrors.phone || nextErrors.city || nextErrors.focus;
    if (message) {
      toast.error(message);
      return;
    }
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) {
      toast.error("Sign in again to save this profile.");
      return;
    }
    try {
      setSaving(true);
      let image = profile?.image || "";
      if (file) {
        const storageRef = ref(storage, `Profiles/${firebaseUser.uid}/avatar`);
        await uploadBytes(storageRef, file, { contentType: file.type });
        image = await getDownloadURL(storageRef);
      }
      await updateOwnProfile(
        firebaseUser,
        {
          name: form.name,
          phone: pakistanPhoneValue(form.phone),
          city: form.city,
          focus: form.focus,
          image,
        },
        setState
      );
      setProfile((current) => ({ ...(current || {}), name: form.name.trim(), phone: pakistanPhoneValue(form.phone), city: form.city.trim(), focus: form.focus.trim(), image }));
      removePreview();
      toast.success("Profile saved.");
    } catch (error) {
      console.error(error);
      toast.error("The profile could not be saved. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SideBar>
      <Box sx={{ pb: { xs: 4, md: 6 }, maxWidth: 720, mx: "auto" }}>
        <PageTitle eyebrow="Account" title="Profile" body="Update your details. A new photo is saved when you submit." />
        <Box component="form" onSubmit={save} sx={{ bgcolor: "#fff", borderRadius: "22px", p: { xs: 2.5, md: 3.5 }, borderTop: `3px solid ${primary}` }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3, flexWrap: "wrap" }}>
            <Avatar src={shownImage || undefined} sx={{ width: 88, height: 88, bgcolor: ink, fontSize: 32, fontWeight: 700 }}>
              {(form.name || "I").slice(0, 1).toUpperCase()}
            </Avatar>
            <Box>
              <Typography sx={{ fontWeight: 700, color: ink }}>{roleLabel(state?.user?.role)}</Typography>
              <Typography sx={{ color: muted, fontSize: 14 }}>{state?.user?.email}</Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.25, flexWrap: "wrap" }}>
                <Typography sx={{ color: muted, fontSize: 13, wordBreak: "break-all" }}>User id {state?.user?.uid}</Typography>
                <Button
                  type="button"
                  onClick={copyUserId}
                  sx={{ ...pillButton, width: "auto", py: 0.4, px: 1.4, minWidth: 0, bgcolor: "transparent", color: ink, border: "1px solid #C9D3D9", "&:hover": { bgcolor: "#F0F3F5" } }}
                >
                  Copy id
                </Button>
              </Box>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  sx={{ ...pillButton, width: "auto", py: 0.8, px: 2, bgcolor: ink, color: "#fff", "&:hover": { bgcolor: "#132A46" } }}
                >
                  Choose photo
                </Button>
                {file && (
                  <Button
                    type="button"
                    onClick={removePreview}
                    sx={{ ...pillButton, width: "auto", py: 0.8, px: 2, bgcolor: "transparent", color: primary, border: `1px solid ${primary}`, "&:hover": { bgcolor: "rgba(13, 154, 172, 0.08)" } }}
                  >
                    Remove preview
                  </Button>
                )}
              </Box>
              <input ref={fileRef} hidden type="file" accept="image/*" onChange={chooseImage} />
            </Box>
          </Box>
          <Field
            label="Name"
            required
            value={form.name}
            error={errors.name}
            onChange={(event) => {
              setForm({ ...form, name: event.target.value });
              setErrors((current) => ({ ...current, name: "" }));
            }}
          />
          <Field
            label="Phone"
            required
            placeholder="300 1234567"
            inputMode="numeric"
            value={form.phone}
            error={errors.phone}
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
            value={form.city}
            error={errors.city}
            onChange={(event) => {
              setForm({ ...form, city: event.target.value });
              setErrors((current) => ({ ...current, city: "" }));
            }}
          />
          {teacher ? (
            <Field
              label="Subject you teach"
              required
              value={form.focus}
              error={errors.focus}
              onChange={(event) => {
                setForm({ ...form, focus: event.target.value });
                setErrors((current) => ({ ...current, focus: "" }));
              }}
            />
          ) : (
            <Field
              select
              label="Education level completed"
              required
              value={EDUCATION_LEVELS.includes(form.focus) ? form.focus : ""}
              error={errors.focus}
              onChange={(event) => {
                setForm({ ...form, focus: event.target.value });
                setErrors((current) => ({ ...current, focus: "" }));
              }}
              SelectProps={{ displayEmpty: true, renderValue: (selected) => selected || "Select a level" }}
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
            disabled={saving}
            sx={{ ...pillButton, width: { xs: "100%", sm: "auto" }, minWidth: 180, bgcolor: primary, color: "#fff", "&:hover": { bgcolor: primaryHover, boxShadow: "none" } }}
          >
            {saving ? "Saving…" : "Save profile"}
          </Button>
        </Box>
      </Box>
    </SideBar>
  );
}
