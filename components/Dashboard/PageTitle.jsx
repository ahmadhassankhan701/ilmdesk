import { Box, Typography } from "@mui/material";

const ink = "#0A192F";
const muted = "#5C6B7A";

export default function PageTitle({ eyebrow, title, body }) {
  return (
    <Box sx={{ mb: 3.5 }}>
      {eyebrow && (
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.3,
            textTransform: "uppercase",
            color: muted,
          }}
        >
          {eyebrow}
        </Typography>
      )}
      <Typography
        sx={{
          mt: eyebrow ? 0.6 : 0,
          fontSize: { xs: 32, md: 42 },
          fontWeight: 700,
          letterSpacing: -1.1,
          lineHeight: 1.05,
          color: ink,
        }}
      >
        {title}
      </Typography>
      {body && (
        <Typography sx={{ mt: 1.25, maxWidth: 560, color: muted, fontSize: 16, lineHeight: 1.6 }}>
          {body}
        </Typography>
      )}
    </Box>
  );
}
