"use client";

import { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { EmailOutlined, FacebookOutlined, LocationOnOutlined, WhatsApp, YouTube } from "@mui/icons-material";
import { pageBackground, pageColumnSx } from "@/lib/pageColumn";
import { ink, muted, primary, primaryHover } from "@/lib/brand";

const email = "ilmdesk63@gmail.com";

const pillButton = {
  textTransform: "none",
  fontWeight: 600,
  borderRadius: 999,
  px: 2.75,
  py: 1.15,
  boxShadow: "none",
  fontSize: 15,
};

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    bgcolor: "#F0F3F5",
    "& fieldset": { borderColor: "#E2E8EC" },
    "&:hover fieldset": { borderColor: "#C9D3D9" },
    "&.Mui-focused fieldset": { borderColor: primary },
  },
};

const socials = [
  {
    label: "WhatsApp",
    href: "https://whatsapp.com/channel/0029VaCUDxF5fM5an8mLcp34",
    icon: <WhatsApp sx={{ fontSize: 18 }} />,
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@qasimmahi?si=T1GWa_w274PUNZtt",
    icon: <YouTube sx={{ fontSize: 18 }} />,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/1Fw8GGhhYC/",
    icon: <FacebookOutlined sx={{ fontSize: 18 }} />,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@ilmdesk?_r=1&_t=ZN-91wTgPxbK5e",
    icon: (
      <Box component="svg" viewBox="0 0 24 24" sx={{ width: 16, height: 16, fill: "currentColor" }}>
        <path d="M14.5 3c.4 2.4 1.8 3.9 4.2 4.1v2.4c-1.4 0-2.7-.4-3.9-1.2v6.4c0 3.4-2.6 6.1-6.1 6.1S2.6 18.1 2.6 14.7 5.2 8.6 8.7 8.6c.4 0 .8 0 1.2.1v2.6c-.4-.2-.8-.3-1.2-.3-2 0-3.5 1.6-3.5 3.7s1.6 3.7 3.5 3.7 3.4-1.6 3.4-3.6V3h2.4Z" />
      </Box>
    ),
  },
];

const cards = [
  {
    icon: <LocationOnOutlined sx={{ fontSize: 20 }} />,
    label: "Studio",
    title: "Lahore",
    detail: "Near Shaukat Khanum Hospital, Lahore, Punjab 54500 Pakistan",
    href: "https://www.google.com/maps/search/?api=1&query=Near%20Shaukat%20Khanum%20Hospital%20Lahore",
    action: "Open in maps",
  },
  {
    icon: <EmailOutlined sx={{ fontSize: 20 }} />,
    label: "Email",
    title: email,
    detail: "Class questions, course access, and teaching applications.",
    href: `mailto:${email}`,
    action: "Write an email",
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  const send = (event) => {
    event.preventDefault();
    const body = `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(form.subject || "Ilmdesk message")}&body=${encodeURIComponent(body)}`;
  };

  return (
    <Box sx={{ bgcolor: pageBackground, color: ink, pt: { xs: "96px", md: "112px" }, pb: { xs: 8, md: 12 } }}>
      <Box sx={pageColumnSx}>
        <Box
          sx={{
            borderRadius: { xs: "24px", md: "32px" },
            background: "linear-gradient(145deg, #0A192F 0%, #071322 55%, #123044 100%)",
            px: { xs: 3, sm: 4.5, md: 6 },
            py: { xs: 5, md: 7 },
          }}
        >
          <Typography
            component="p"
            sx={{
              alignSelf: "flex-start",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.16)",
              borderRadius: 999,
              px: 1.5,
              py: 0.4,
              fontSize: 12,
              letterSpacing: 0.6,
              mb: 2.5,
              width: "fit-content",
            }}
          >
            Ilmdesk desk
          </Typography>
          <Typography
            component="h1"
            sx={{
              color: "#fff",
              fontWeight: 700,
              letterSpacing: -1.4,
              lineHeight: 1.05,
              fontSize: { xs: 40, sm: 52, md: 64 },
              maxWidth: 640,
            }}
          >
            A note to the people who run your classes.
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.72)", fontSize: 17, lineHeight: 1.65, maxWidth: 520, mt: 2.5 }}>
            Questions about a class, a paid course, or teaching on Ilmdesk. The same address answers all of them.
          </Typography>
        </Box>

        <Box
          sx={{
            mt: { xs: 2.5, md: 3 },
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "0.82fr 1.18fr" },
            gap: 1.5,
            alignItems: "start",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {cards.map((card) => (
              <Box
                key={card.label}
                sx={{
                  bgcolor: "#fff",
                  border: "1px solid #E2E8EC",
                  borderRadius: "24px",
                  p: { xs: 2.5, md: 3 },
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "12px",
                    bgcolor: "rgba(13, 154, 172, 0.12)",
                    color: primary,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 1.75,
                  }}
                >
                  {card.icon}
                </Box>
                <Typography sx={{ color: primary, fontSize: 13, fontWeight: 700, letterSpacing: 1.1, textTransform: "uppercase" }}>
                  {card.label}
                </Typography>
                <Typography sx={{ fontWeight: 700, fontSize: { xs: 20, md: 22 }, letterSpacing: -0.4, mt: 0.5, wordBreak: "break-word" }}>
                  {card.title}
                </Typography>
                <Typography sx={{ color: muted, mt: 1, lineHeight: 1.6 }}>{card.detail}</Typography>
                <Box
                  component="a"
                  href={card.href}
                  target={card.href.startsWith("http") ? "_blank" : undefined}
                  rel={card.href.startsWith("http") ? "noreferrer" : undefined}
                  sx={{
                    display: "inline-block",
                    mt: 1.75,
                    color: ink,
                    fontWeight: 600,
                    fontSize: 14,
                    textDecoration: "none",
                    borderBottom: `1px solid ${primary}`,
                    pb: 0.2,
                    "&:hover": { color: primary },
                  }}
                >
                  {card.action}
                </Box>
              </Box>
            ))}

            <Box
              sx={{
                bgcolor: ink,
                color: "#fff",
                borderRadius: "24px",
                p: { xs: 2.5, md: 3 },
              }}
            >
              <Typography sx={{ fontWeight: 700, fontSize: 18, letterSpacing: -0.3 }}>Find Ilmdesk where you already scroll</Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.68)", mt: 1, lineHeight: 1.6, fontSize: 15 }}>
                Class updates and new lessons go out on these channels first.
              </Typography>
              <Box display="flex" gap={1} mt={2.25}>
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
                      "&:hover": { color: primary, borderColor: primary },
                    }}
                  >
                    {item.icon}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          <Box
            component="form"
            onSubmit={send}
            sx={{
              bgcolor: "#fff",
              border: "1px solid #E2E8EC",
              borderRadius: "24px",
              p: { xs: 2.5, md: 4 },
            }}
          >
            <Typography sx={{ color: primary, fontSize: 13, fontWeight: 700, letterSpacing: 1.1, textTransform: "uppercase" }}>
              Message
            </Typography>
            <Typography sx={{ fontSize: { xs: 28, md: 36 }, fontWeight: 700, letterSpacing: -0.7, mt: 0.75, lineHeight: 1.1 }}>
              Tell us what you need.
            </Typography>
            <Typography sx={{ color: muted, mt: 1.25, mb: 3, lineHeight: 1.6 }}>
              Send opens your email app with this note addressed to {email}.
            </Typography>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
              <Box>
                <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 0.75 }}>Name</Typography>
                <TextField required fullWidth placeholder="Your name" value={form.name} onChange={update("name")} sx={fieldSx} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 0.75 }}>Email</Typography>
                <TextField required type="email" fullWidth placeholder="you@email.com" value={form.email} onChange={update("email")} sx={fieldSx} />
              </Box>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 0.75 }}>Subject</Typography>
              <TextField fullWidth placeholder="A class, a course, or teaching" value={form.subject} onChange={update("subject")} sx={fieldSx} />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 0.75 }}>Message</Typography>
              <TextField
                required
                fullWidth
                multiline
                minRows={5}
                placeholder="Write the question in a few lines."
                value={form.message}
                onChange={update("message")}
                sx={fieldSx}
              />
            </Box>
            <Button
              type="submit"
              variant="contained"
              sx={{ ...pillButton, mt: 2.5, bgcolor: primary, color: "#fff", "&:hover": { bgcolor: primaryHover, boxShadow: "none" } }}
            >
              Send message
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
