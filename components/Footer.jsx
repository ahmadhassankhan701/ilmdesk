"use client";

import { Box, Typography } from "@mui/material";
import { FacebookOutlined, WhatsApp, YouTube } from "@mui/icons-material";
import Link from "next/link";
import { pageBackground, pageColumnSx } from "@/lib/pageColumn";

const columns = [
  {
    title: "Learn",
    links: [
      { label: "Classes", href: "/classes" },
      { label: "Courses", href: "/courses" },
      { label: "About", href: "/about" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Log in", href: "/auth" },
      { label: "Create an account", href: "/auth/register" },
      { label: "Apply to teach", href: "/auth/register" },
    ],
  },
  {
    title: "Ilmdesk",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
];

const socials = [
  { label: "WhatsApp", href: "https://whatsapp.com/channel/0029VaCUDxF5fM5an8mLcp34", icon: <WhatsApp sx={{ fontSize: 18 }} /> },
  { label: "YouTube", href: "https://youtube.com/@qasimmahi?si=T1GWa_w274PUNZtt", icon: <YouTube sx={{ fontSize: 18 }} /> },
  { label: "Facebook", href: "https://www.facebook.com/share/1Fw8GGhhYC/", icon: <FacebookOutlined sx={{ fontSize: 18 }} /> },
];

const Footer = () => {
  return (
    <Box component="footer" sx={{ bgcolor: pageBackground, pt: { xs: 4, md: 6 }, pb: { xs: 3, md: 4 } }}>
      <Box sx={pageColumnSx}>
        <Box
          sx={{
            bgcolor: "#0A192F",
            color: "#fff",
            borderRadius: { xs: "24px", md: "28px" },
            px: { xs: 3, md: 5 },
            py: { xs: 4, md: 5 },
          }}
        >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.4fr 1fr 1fr 1fr" },
            gap: { xs: 4, md: 3 },
          }}
        >
          <Box>
            <img src="/ilmlogo.png" alt="Ilmdesk" style={{ height: 42, width: "auto" }} />
            <Typography sx={{ color: "rgba(255,255,255,0.68)", mt: 2, maxWidth: 280, lineHeight: 1.6, fontSize: 15 }}>
              Classes, courses, and quizzes from the teachers you study with.
            </Typography>
            <Box display="flex" gap={1} mt={2.5}>
              {socials.map((item) => (
                <Box
                  key={item.label}
                  component="a"
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.label}
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.16)",
                    color: "#fff",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    "&:hover": { color: "#0D9AAC", borderColor: "#0D9AAC" },
                  }}
                >
                  {item.icon}
                </Box>
              ))}
            </Box>
          </Box>
          {columns.map((column) => (
            <Box key={column.title}>
              <Typography sx={{ fontSize: 13, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#0D9AAC", mb: 1.75 }}>
                {column.title}
              </Typography>
              <Box display="flex" flexDirection="column" gap={1.1}>
                {column.links.map((link) => (
                  <Link key={link.label} href={link.href} style={{ textDecoration: "none" }}>
                    <Typography sx={{ color: "rgba(255,255,255,0.78)", fontSize: 15, "&:hover": { color: "#fff" } }}>
                      {link.label}
                    </Typography>
                  </Link>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
        <Box
          sx={{
            mt: 4,
            pt: 2.5,
            borderTop: "1px solid rgba(255,255,255,0.1)",
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
            © {new Date().getFullYear()} Ilmdesk
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
            Online learning, in one place
          </Typography>
        </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
