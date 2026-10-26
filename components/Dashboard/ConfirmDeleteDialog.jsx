"use client";

import { Box, Button, Dialog, Typography } from "@mui/material";
import { pillButton } from "@/components/AuthFrame";
import { accent, accentHover, ink, muted } from "@/lib/brand";

export default function ConfirmDeleteDialog({ open, title, body, confirmLabel, busy, onClose, onConfirm }) {
  return (
    <Dialog
      open={open}
      onClose={busy ? undefined : onClose}
      fullWidth
      maxWidth="xs"
      aria-labelledby="confirm-delete-title"
      PaperProps={{ sx: { borderRadius: "22px", p: { xs: 2.5, sm: 3 }, m: 2 } }}
    >
      <Typography id="confirm-delete-title" sx={{ fontWeight: 700, color: ink, fontSize: 22, letterSpacing: -0.4 }}>
        {title}
      </Typography>
      <Typography sx={{ color: muted, mt: 1.25, lineHeight: 1.65 }}>{body}</Typography>
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 3, flexWrap: "wrap" }}>
        <Button
          type="button"
          disabled={busy}
          onClick={onClose}
          sx={{ ...pillButton, width: "auto", py: 0.85, bgcolor: "transparent", color: ink, border: "1px solid #C9D3D9", "&:hover": { bgcolor: "#F0F3F5", boxShadow: "none" } }}
        >
          Cancel
        </Button>
        <Button
          type="button"
          disabled={busy}
          onClick={onConfirm}
          sx={{ ...pillButton, width: "auto", py: 0.85, bgcolor: accent, color: "#fff", "&:hover": { bgcolor: accentHover, boxShadow: "none" } }}
        >
          {busy ? "Deleting…" : confirmLabel}
        </Button>
      </Box>
    </Dialog>
  );
}
