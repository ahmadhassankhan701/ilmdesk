"use client";

import { Box, Dialog, IconButton, Typography, useMediaQuery } from "@mui/material";
import { Close, OpenInNew } from "@mui/icons-material";
import { primary } from "@/lib/brand";

export default function PDFModal({ open, setOpen, url, name = "PDF" }) {
  const fullScreen = useMediaQuery("(max-width:600px)");
  const close = () => setOpen(false);

  return (
    <Dialog
      open={open}
      onClose={close}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="lg"
      aria-labelledby="pdf-reader-title"
      PaperProps={{
        sx: {
          height: fullScreen ? "100%" : "min(88vh, 920px)",
          borderRadius: fullScreen ? 0 : "20px",
          overflow: "hidden",
          bgcolor: "#F0F3F5",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: { xs: 1.5, sm: 2 },
          py: 1,
          bgcolor: "#0A192F",
          color: "#fff",
        }}
      >
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography id="pdf-reader-title" noWrap sx={{ fontWeight: 700, fontSize: 15 }}>
            {name}
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.62)", fontSize: 12 }}>PDF</Typography>
        </Box>
        {url ? (
          <IconButton
            component="a"
            href={url}
            target="_blank"
            rel="noreferrer"
            aria-label="Open in a new tab"
            sx={{ color: "#fff", "&:hover": { color: primary } }}
          >
            <OpenInNew sx={{ fontSize: 20 }} />
          </IconButton>
        ) : null}
        <IconButton aria-label="Close reader" onClick={close} sx={{ color: "#fff", "&:hover": { color: primary } }}>
          <Close />
        </IconButton>
      </Box>
      <Box sx={{ flex: 1, minHeight: 0, bgcolor: "#E2E8EC" }}>
        {open && url ? (
          <Box
            component="iframe"
            title={name}
            src={url}
            sx={{ width: "100%", height: "100%", border: 0, display: "block", bgcolor: "#fff" }}
          />
        ) : null}
      </Box>
    </Dialog>
  );
}
