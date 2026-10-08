"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Button, Typography } from "@mui/material";
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { toast } from "react-toastify";
import { auth } from "@/firebase";
import { useAuth } from "@/context/AuthContext";
import GoogleSignInButton from "@/components/SpecialCards/GoogleSignInButton";
import AuthFrame, { accentHover, coral, Field, ink, muted, OrDivider, PasswordField, pillButton } from "@/components/AuthFrame";
import { clearSession, ensureAccount, establishSession, sendAccountVerification } from "@/lib/accounts";
import { authSearch, destinationFor } from "@/lib/roles";
import { authErrorMessage, emailError, nameError, passwordError } from "@/lib/formValidation";

function RegisterPage() {
  const route = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "";
  const courseId = searchParams.get("id") || "";
  const { setState } = useAuth();
  const [details, setDetails] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const loginHref = `/auth${authSearch({ redirectTo, courseId })}`;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {
      name: nameError(details.name),
      email: emailError(details.email),
      password: passwordError(details.password),
    };
    setErrors(nextErrors);
    const message = nextErrors.name || nextErrors.email || nextErrors.password;
    if (message) {
      toast.error(message);
      return;
    }
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, details.email.trim(), details.password);
      const firebaseUser = userCredential.user;
      await updateProfile(firebaseUser, { displayName: details.name.trim() });
      await ensureAccount(
        {
          uid: firebaseUser.uid,
          displayName: details.name.trim(),
          email: details.email.trim(),
          photoURL: firebaseUser.photoURL || "",
        },
      );
      await sendAccountVerification(firebaseUser);
      await clearSession(setState);
      toast.success(`Verification email sent to ${details.email.trim()}. Open it, then log in.`);
      route.push(loginHref);
    } catch (error) {
      toast.error(authErrorMessage(error));
      try {
        await clearSession(setState);
      } catch (signOutError) {
        console.error(signOutError);
      }
    } finally {
      setLoading(false);
    }
  };

  const googleSignUp = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      const user = await establishSession(result.user, { setState });
      route.push(destinationFor(user, { redirectTo, courseId }));
    } catch (error) {
      toast.error(authErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFrame
      eyebrow="Register"
      title="Create the account. Choose a role next."
      body="Registration opens the account. On the profile page you choose student or teacher, then the dashboard unlocks."
    >
      <Box component="form" onSubmit={handleSubmit}>
        <Typography sx={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.6 }}>Create an account</Typography>
        <Typography sx={{ color: muted, mt: 0.75, mb: 2.5, lineHeight: 1.5 }}>
          Name, email, and password. Student or teacher is chosen when you complete the profile.
        </Typography>
        <Field
          label="Name"
          required
          autoComplete="name"
          placeholder="Your name"
          error={errors.name}
          value={details.name}
          onChange={(event) => {
            setDetails({ ...details, name: event.target.value });
            setErrors((current) => ({ ...current, name: "" }));
          }}
        />
        <Field
          label="Email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@email.com"
          error={errors.email}
          value={details.email}
          onChange={(event) => {
            setDetails({ ...details, email: event.target.value });
            setErrors((current) => ({ ...current, email: "" }));
          }}
        />
        <PasswordField
          required
          showRules
          autoComplete="new-password"
          placeholder="Create a password"
          error={errors.password}
          value={details.password}
          onChange={(event) => {
            setDetails({ ...details, password: event.target.value });
            setErrors((current) => ({ ...current, password: "" }));
          }}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{ ...pillButton, bgcolor: coral, color: "#fff", "&:hover": { bgcolor: accentHover, boxShadow: "none" } }}
        >
          {loading ? "Creating account…" : "Create account"}
        </Button>
        <Typography sx={{ color: muted, mt: 2.5, fontSize: 14 }}>
          Already registered?{" "}
          <Link href={loginHref} style={{ color: ink, fontWeight: 600 }}>
            Log in
          </Link>
        </Typography>
        <OrDivider />
        <GoogleSignInButton title="Continue with Google" onClick={googleSignUp} />
      </Box>
    </AuthFrame>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <RegisterPage />
    </Suspense>
  );
}
