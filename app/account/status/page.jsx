"use client";

import { establishSession } from "@/lib/accounts";
import { destinationFor, roleLabel, statusLabel, STATUSES } from "@/lib/roles";
import { pageBackground, pageColumnSx } from "@/lib/pageColumn";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/firebase";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const copyFor = (user) => {
  if (user?.status === STATUSES.rejected) {
    return {
      title: "Teaching application was not approved",
      body: "This account cannot publish yet. The brand owner can still approve it later.",
    };
  }
  if (user?.status === STATUSES.pending) {
    return {
      title: "Waiting for approval",
      body: "Your teaching account is pending. You can browse the public site. Publishing opens after the owner approves you.",
    };
  }
  return {
    title: "Account is active",
    body: "This account can continue to the dashboard.",
  };
};

export default function AccountStatusPage() {
  const { state, setState } = useAuth();
  const router = useRouter();
  const [checking, setChecking] = useState(false);
  const user = state.user;
  const copy = copyFor(user);

  const refresh = async () => {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) {
      toast.error("Sign in again to refresh this account.");
      router.push("/auth");
      return;
    }
    try {
      setChecking(true);
      const nextUser = await establishSession(firebaseUser, { setState });
      const next = destinationFor(nextUser);
      if (next === "/account/status") {
        toast.success("Still waiting for the owner.");
        return;
      }
      router.push(next);
    } catch (error) {
      console.error(error);
      toast.error("Could not refresh this account.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <Box sx={{ bgcolor: pageBackground, color: "#0A192F", pt: { xs: "96px", md: "112px" }, pb: { xs: 8, md: 12 } }}>
      <Box sx={pageColumnSx}>
        <Box sx={{ maxWidth: 640, bgcolor: "#fff", border: "1px solid #ebe6df", borderRadius: "24px", p: { xs: 3, md: 4 } }}>
          <Typography sx={{ color: "#0D9AAC", fontSize: 13, fontWeight: 700, letterSpacing: 1.1, textTransform: "uppercase" }}>
            Account
          </Typography>
          <Typography sx={{ fontSize: { xs: 28, md: 36 }, fontWeight: 700, letterSpacing: -0.6, mt: 1, lineHeight: 1.15 }}>
            {copy.title}
          </Typography>
          <Typography sx={{ mt: 2, color: "#5C6B7A", lineHeight: 1.65 }}>{copy.body}</Typography>
          {user && (
            <Typography sx={{ mt: 2, fontWeight: 600 }}>
              {user.name} · {roleLabel(user.role)} · {statusLabel(user.status)}
            </Typography>
          )}
          <Button
            variant="contained"
            disabled={checking}
            onClick={refresh}
            sx={{
              mt: 3,
              bgcolor: "#0D9AAC",
              color: "#fff",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 999,
              px: 2.75,
              py: 1.15,
              boxShadow: "none",
              "&:hover": { bgcolor: "#0A8494", boxShadow: "none" },
            }}
          >
            {checking ? "Checking…" : "Check approval"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
