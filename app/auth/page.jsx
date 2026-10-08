"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Button, Typography } from "@mui/material";
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { toast } from "react-toastify";
import { auth } from "@/firebase";
import { useAuth } from "@/context/AuthContext";
import GoogleSignInButton from "@/components/SpecialCards/GoogleSignInButton";
import AuthFrame, { Field, ink, muted, OrDivider, PasswordField, pillButton, primary, primaryHover } from "@/components/AuthFrame";
import { clearSession, establishSession, hasAccountRecord, needsEmailVerification, sendAccountVerification } from "@/lib/accounts";
import { authSearch, destinationFor, isOwnerEmail } from "@/lib/roles";
import { authErrorMessage, emailError, passwordError } from "@/lib/formValidation";

function LoginPage() {
  const route = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "";
  const courseId = searchParams.get("id") || "";
  const { setState } = useAuth();
  const [details, setDetails] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const busy = loading || resending;
  const registerHref = `/auth/register${authSearch({ redirectTo, courseId })}`;

  const finishSignIn = async (firebaseUser) => {
    await firebaseUser.reload();
    const fresh = auth.currentUser || firebaseUser;
    if (needsEmailVerification(fresh)) {
      try {
        await sendAccountVerification(fresh);
        toast.error(`Verify ${fresh.email} before you log in. We sent the verification email again.`);
      } catch (error) {
        toast.error(
          error.code === "auth/too-many-requests"
            ? `Verify ${fresh.email} before you log in. Use the email we already sent.`
            : `Verify ${fresh.email} before you log in.`
        );
      }
      await clearSession(setState);
      return;
    }
    const user = await establishSession(fresh, { setState });
    route.push(destinationFor(user, { redirectTo, courseId }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {
      email: emailError(details.email),
      password: passwordError(details.password, { login: true }),
    };
    setErrors(nextErrors);
    const message = nextErrors.email || nextErrors.password;
    if (message) {
      toast.error(message);
      return;
    }
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, details.email.trim(), details.password);
      await finishSignIn(userCredential.user);
    } catch (error) {
      toast.error(authErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    const nextErrors = {
      email: emailError(details.email),
      password: passwordError(details.password, { login: true }),
    };
    setErrors(nextErrors);
    const message = nextErrors.email || nextErrors.password;
    if (message) {
      toast.error(message);
      return;
    }
    try {
      setResending(true);
      const userCredential = await signInWithEmailAndPassword(auth, details.email.trim(), details.password);
      await userCredential.user.reload();
      const fresh = auth.currentUser || userCredential.user;
      if (!needsEmailVerification(fresh)) {
        toast.success("This email is already verified. Log in.");
        await clearSession(setState);
        return;
      }
      try {
        await sendAccountVerification(fresh);
        toast.success(`Verification email sent to ${fresh.email}.`);
      } catch (error) {
        toast.error(
          error.code === "auth/too-many-requests"
            ? `A verification email is already on its way to ${fresh.email}. Check your inbox.`
            : authErrorMessage(error)
        );
      }
      await clearSession(setState);
    } catch (error) {
      toast.error(authErrorMessage(error));
    } finally {
      setResending(false);
    }
  };

  const googleLogin = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      const firebaseUser = result.user;
      const known = isOwnerEmail(firebaseUser.email) || (await hasAccountRecord(firebaseUser.uid));
      if (!known) {
        await clearSession(setState);
        toast.error("No account uses that Google email yet. Create an account first.");
        route.push(registerHref);
        return;
      }
      await finishSignIn(firebaseUser);
    } catch (error) {
      toast.error(authErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFrame
      eyebrow="Log in"
      title="Back to your classes."
      body="Log in continues an account that is already registered. A new account starts on the register page, then finishes a profile before the dashboard."
    >
      <Box component="form" onSubmit={handleSubmit}>
        <Typography sx={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.6, mb: 2.5 }}>Log in</Typography>
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
          autoComplete="current-password"
          placeholder="Your password"
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
          disabled={busy}
          sx={{ ...pillButton, bgcolor: primary, color: "#fff", "&:hover": { bgcolor: primaryHover, boxShadow: "none" } }}
        >
          {loading ? "Signing in…" : "Log in"}
        </Button>
        <Typography sx={{ color: muted, mt: 2.5, fontSize: 14 }}>
          Missed the verification email?{" "}
          <Button
            type="button"
            disabled={busy}
            onClick={resendVerification}
            sx={{
              p: 0,
              minWidth: 0,
              color: ink,
              fontWeight: 600,
              fontSize: 14,
              lineHeight: 1.4,
              textTransform: "none",
              verticalAlign: "baseline",
              "&:hover": { bgcolor: "transparent", color: primary },
            }}
          >
            {resending ? "Sending…" : "Send it again"}
          </Button>
        </Typography>
        <Typography sx={{ color: muted, mt: 1.25, fontSize: 14 }}>
          New to Ilmdesk?{" "}
          <Link href={registerHref} style={{ color: ink, fontWeight: 600 }}>
            Create an account
          </Link>
        </Typography>
        <OrDivider />
        <GoogleSignInButton title="Continue with Google" onClick={googleLogin} disabled={busy} />
      </Box>
    </AuthFrame>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <LoginPage />
    </Suspense>
  );
}
