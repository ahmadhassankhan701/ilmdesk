import Link from "next/link";
import { Box, Typography } from "@mui/material";
import { ink, muted, primary } from "@/lib/brand";

export default function PageTrail({ items, onDark = false }) {
  const quiet = onDark ? "rgba(255,255,255,0.62)" : muted;
  const strong = onDark ? "#fff" : ink;
  const slash = onDark ? "rgba(255,255,255,0.35)" : "#8A97A3";

  return (
    <Box
      component="nav"
      aria-label="Breadcrumb"
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        columnGap: 1,
        rowGap: 0.5,
        mt: onDark ? 4 : 0,
        mb: onDark ? 0 : 2.5,
        pt: onDark ? 2.5 : 0,
        borderTop: onDark ? "1px solid rgba(255,255,255,0.12)" : "none",
      }}
    >
      {items.map((item, index) => {
        const current = index === items.length - 1;
        return (
          <Box key={`${item.label}-${index}`} sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
            {index > 0 && (
              <Typography component="span" aria-hidden sx={{ color: slash, fontSize: 14 }}>
                /
              </Typography>
            )}
            {current || !item.href ? (
              <Typography component="span" sx={{ color: strong, fontSize: 14, fontWeight: 600 }}>
                {item.label}
              </Typography>
            ) : (
              <Typography
                component={Link}
                href={item.href}
                sx={{ color: quiet, fontSize: 14, fontWeight: 600, textDecoration: "none", "&:hover": { color: onDark ? "#fff" : primary } }}
              >
                {item.label}
              </Typography>
            )}
          </Box>
        );
      })}
    </Box>
  );
}
