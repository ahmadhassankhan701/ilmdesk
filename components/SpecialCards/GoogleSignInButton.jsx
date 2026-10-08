import React from "react";
import { Box, Button } from "@mui/material";

const GoogleMark = () => (
  <Box
    sx={{
      width: 28,
      height: 28,
      borderRadius: "50%",
      bgcolor: "#fff",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    <Box component="svg" viewBox="0 0 24 24" sx={{ width: 16, height: 16 }}>
      <path fill="#4285F4" d="M21.6 12.23c0-.74-.06-1.28-.2-1.84H12v3.34h5.5c-.11.92-.72 2.3-2.06 3.23l-.02.12 2.98 2.26.2.02c1.88-1.7 2.96-4.2 2.96-7.13Z" />
      <path fill="#34A853" d="M12 22c2.7 0 4.96-.87 6.62-2.38l-3.16-2.4c-.84.58-1.98.98-3.46.98-2.64 0-4.88-1.74-5.68-4.15l-.12.01-3.1 2.35-.04.11C4.8 19.78 8.14 22 12 22Z" />
      <path fill="#FBBC05" d="M6.32 14.05A6.18 6.18 0 0 1 6 12c0-.71.12-1.4.31-2.05l-.01-.14-3.14-2.39-.1.05A9.84 9.84 0 0 0 2 12c0 1.61.39 3.13 1.06 4.53l3.26-2.48Z" />
      <path fill="#EA4335" d="M12 5.8c1.88 0 3.14.8 3.86 1.46l2.82-2.7C16.95 2.96 14.7 2 12 2 8.14 2 4.8 4.22 3.06 7.47l3.25 2.48C7.12 7.54 9.36 5.8 12 5.8Z" />
    </Box>
  </Box>
);

const GoogleSignInButton = ({ onClick, title, disabled = false }) => {
  return (
    <Button
      type="button"
      disabled={disabled}
      onClick={onClick}
      fullWidth
      startIcon={<GoogleMark />}
      sx={{
        textTransform: "none",
        bgcolor: "#0A192F",
        color: "#fff",
        borderRadius: 999,
        py: 1.15,
        fontWeight: 600,
        fontSize: 15,
        letterSpacing: 0.2,
        boxShadow: "0 12px 28px rgba(17,17,19,0.16)",
        "& .MuiButton-startIcon": { marginRight: 1.25 },
        "&:hover": {
          bgcolor: "#132A46",
          boxShadow: "0 14px 32px rgba(17,17,19,0.2)",
        },
      }}
    >
      {title}
    </Button>
  );
};

export default GoogleSignInButton;
