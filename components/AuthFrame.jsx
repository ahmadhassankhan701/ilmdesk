"use client";

import { useState } from "react";
import { Box, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import { CheckRounded, VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
import { pageBackground, pageColumnSx } from "@/lib/pageColumn";
import { accent, accentHover, ink, muted, primary, primaryHover } from "@/lib/brand";
import { passwordChecks } from "@/lib/formValidation";

export { accent, accentHover, ink, muted, primary, primaryHover };
export const coral = accent;

export const pillButton = {
  textTransform: "none",
  fontWeight: 600,
  borderRadius: 999,
  px: 2.75,
  py: 1.35,
  width: "100%",
  boxShadow: "none",
  fontSize: 15,
  letterSpacing: 0.2,
};

export const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "16px",
    bgcolor: "#fff",
    transition: "box-shadow 160ms ease",
    "& fieldset": { borderColor: "#E2E8EC" },
    "&:hover fieldset": { borderColor: ink },
    "&.Mui-focused": {
      boxShadow: "0 0 0 4px rgba(13, 154, 172, 0.16)",
    },
    "&.Mui-focused fieldset": { borderColor: primary, borderWidth: "1.5px" },
    "&.Mui-error fieldset": { borderColor: accent },
    "&.Mui-error.Mui-focused": { boxShadow: "0 0 0 4px rgba(255, 107, 107, 0.16)" },
  },
  "& .MuiOutlinedInput-input": {
    color: ink,
    fontSize: 15,
    padding: "15px 16px",
  },
};

export function Field({ label, error, ...props }) {
  return (
    <Box sx={{ mb: 0.5 }}>
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
        {label}
      </Typography>
      <TextField
        fullWidth
        error={Boolean(error)}
        helperText={error || " "}
        FormHelperTextProps={{ sx: { color: coral, mx: 0.25, mt: 0.5, minHeight: 18, lineHeight: 1.3 } }}
        sx={fieldSx}
        {...props}
      />
    </Box>
  );
}

export function PasswordField({ showRules = false, value = "", error, ...props }) {
  const [visible, setVisible] = useState(false);
  const password = String(value || "");
  return (
    <Box sx={{ mb: showRules ? 1.5 : 0 }}>
      <Field
        label="Password"
        value={value}
        error={error}
        type={visible ? "text" : "password"}
        {...(showRules
          ? {
              helperText: error || "",
              FormHelperTextProps: { sx: { color: coral, mx: 0.25, mt: 0.5, minHeight: error ? 18 : 0, lineHeight: 1.3 } },
            }
          : {})}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                type="button"
                aria-label={visible ? "Hide password" : "Show password"}
                onClick={() => setVisible((current) => !current)}
                edge="end"
                sx={{ color: muted, "&:hover": { color: coral } }}
              >
                {visible ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        {...props}
      />
      {showRules && (
        <Box sx={{ display: "grid", gap: 0.4, mt: 1.25, mb: 0.5 }}>
          {passwordChecks.map((rule) => {
            const met = rule.met(password);
            return (
              <Box key={rule.label} sx={{ display: "flex", alignItems: "center", gap: 0.75, color: met ? "#1c8c4e" : muted }}>
                <CheckRounded sx={{ fontSize: 16, opacity: met ? 1 : 0.35 }} />
                <Typography sx={{ fontSize: 13, fontWeight: met ? 600 : 500, color: "inherit" }}>{rule.label}</Typography>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}

export function OrDivider() {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, my: 3 }}>
      <Box sx={{ flex: 1, height: "1px", bgcolor: "#ebe6df" }} />
      <Typography sx={{ color: muted, fontSize: 11, fontWeight: 700, letterSpacing: 1.6 }}>OR</Typography>
      <Box sx={{ flex: 1, height: "1px", bgcolor: "#ebe6df" }} />
    </Box>
  );
}

export function RoleChoice({ value, onChange }) {
  const options = [
    { id: "student", label: "Student", detail: "Classes, courses, and quizzes" },
    { id: "teacher", label: "Teacher", detail: "Approved before you publish" },
  ];
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.25, mb: 2.5 }}>
      {options.map((option) => {
        const selected = value === option.id;
        return (
          <Box
            key={option.id}
            component="button"
            type="button"
            onClick={() => onChange(option.id)}
            sx={{
              textAlign: "left",
              borderRadius: "16px",
              px: 1.75,
              py: 1.5,
              border: selected ? `1.5px solid ${ink}` : "1px solid #E2E8EC",
              bgcolor: selected ? ink : "#fff",
              color: selected ? "#fff" : ink,
              cursor: "pointer",
              font: "inherit",
              boxShadow: selected ? "0 10px 24px rgba(17,17,19,0.16)" : "none",
            }}
          >
            <Typography sx={{ fontWeight: 700, fontSize: 15 }}>{option.label}</Typography>
            <Typography sx={{ mt: 0.4, fontSize: 12, lineHeight: 1.4, color: selected ? "rgba(255,255,255,0.68)" : muted }}>
              {option.detail}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}

export default function AuthFrame({ eyebrow, title, body, children }) {
  return (
    <Box sx={{ bgcolor: pageBackground, color: ink, pt: { xs: "96px", md: "112px" }, pb: { xs: 8, md: 12 } }}>
      <Box sx={pageColumnSx}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "0.9fr 1.1fr" },
            borderRadius: { xs: "24px", md: "32px" },
            overflow: "hidden",
            border: "1px solid #ebe6df",
            bgcolor: "#fff",
            minHeight: { md: 560 },
            boxShadow: "0 28px 70px rgba(17,17,19,0.08)",
          }}
        >
          <Box
            sx={{
              background: "linear-gradient(165deg, #16161a 0%, #071322 48%, #123044 100%)",
              color: "#fff",
              px: { xs: 3, md: 5 },
              py: { xs: 4, md: 6 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: primary,
              }}
            />
            <Box component="img" src="/ilmlogo.png" alt="Ilmdesk" sx={{ height: 36, width: "auto", alignSelf: "flex-start", mb: 3 }} />
            <Typography
              component="p"
              sx={{
                width: "fit-content",
                border: "1px solid rgba(255,255,255,0.16)",
                borderRadius: 999,
                px: 1.5,
                py: 0.4,
                fontSize: 12,
                letterSpacing: 0.6,
                mb: 2.5,
              }}
            >
              {eyebrow}
            </Typography>
            <Typography sx={{ fontWeight: 700, letterSpacing: -1.1, lineHeight: 1.08, fontSize: { xs: 34, md: 46 } }}>
              {title}
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.72)", fontSize: 16, lineHeight: 1.65, mt: 2, maxWidth: 380 }}>
              {body}
            </Typography>
          </Box>
          <Box sx={{ px: { xs: 3, md: 5 }, py: { xs: 3.5, md: 5 } }}>{children}</Box>
        </Box>
      </Box>
    </Box>
  );
}
