"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, Box, Drawer, IconButton, Typography } from "@mui/material";
import {
  AccountBalanceWalletOutlined,
  ClassOutlined,
  Close,
  DashboardOutlined,
  Groups,
  LanguageOutlined,
  Logout,
  Menu,
  MenuBookOutlined,
  PersonOutline,
  RateReviewOutlined,
  QuizOutlined,
} from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";
import { clearSession } from "@/lib/accounts";
import { isTeacherWaiting, roleLabel } from "@/lib/roles";

const drawerWidth = 280;
const ink = "#0A192F";
const primary = "#0D9AAC";
const sand = "#F0F3F5";

const NAV = [
  { name: "Dashboard", icon: DashboardOutlined, route: "/dashboard" },
  { name: "Courses", icon: ClassOutlined, route: "/dashboard/courses" },
  { name: "Quizzes", icon: QuizOutlined, route: "/dashboard/quizzes" },
  { name: "Payments", icon: AccountBalanceWalletOutlined, route: "/dashboard/account" },
  { name: "Profile", icon: PersonOutline, route: "/dashboard/profile" },
];

function NavList({ items, pathname, locked, onNavigate }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.6, px: 1.75 }}>
      <Typography
        sx={{
          px: 1.5,
          mb: 0.6,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 1.4,
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.38)",
        }}
      >
        Desk
      </Typography>
      {items.map((item) => {
        const Icon = item.icon;
        const active = item.route === "/dashboard"
          ? pathname === "/dashboard"
          : pathname === item.route || pathname.startsWith(`${item.route}/`);
        const disabled = locked && item.route !== "/dashboard";
        return (
          <Box
            key={item.route}
            onClick={() => {
              if (disabled) return;
              onNavigate(item.route);
            }}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.35,
              px: 1.4,
              py: 1.15,
              borderRadius: "14px",
              color: active ? "#fff" : "rgba(255,255,255,0.72)",
              bgcolor: active ? "rgba(255,255,255,0.08)" : "transparent",
              boxShadow: active ? `inset 3px 0 0 ${primary}` : "none",
              cursor: disabled ? "default" : "pointer",
              opacity: disabled ? 0.35 : 1,
              pointerEvents: disabled ? "none" : "auto",
              transition: "background-color 160ms ease, color 160ms ease",
              "&:hover": disabled ? {} : { bgcolor: "rgba(255,255,255,0.06)", color: "#fff" },
            }}
          >
            <Icon sx={{ fontSize: 18 }} />
            <Typography sx={{ fontSize: 14.5, fontWeight: 600 }}>{item.name}</Typography>
          </Box>
        );
      })}
    </Box>
  );
}

export default function SideBar({ children }) {
  const { setState, state } = useAuth();
  const route = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const waiting = isTeacherWaiting(state?.user);
  const owner = state?.user?.role === "owner";
  const items = owner
    ? [
        { name: "Dashboard", icon: DashboardOutlined, route: "/dashboard" },
        { name: "Curriculum", icon: MenuBookOutlined, route: "/dashboard/curriculum" },
        { name: "Reviews", icon: RateReviewOutlined, route: "/dashboard/reviews" },
        { name: "Payments", icon: AccountBalanceWalletOutlined, route: "/dashboard/account" },
        { name: "Teachers", icon: Groups, route: "/dashboard/teachers" },
        { name: "Profile", icon: PersonOutline, route: "/dashboard/profile" },
      ]
    : NAV;

  const go = (path) => {
    setMobileOpen(false);
    route.push(path);
  };

  const drawer = (showClose) => (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", position: "relative" }}>
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
      <Box sx={{ px: 2.25, pt: 3, pb: 2.5, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" onClick={() => setMobileOpen(false)}>
          <Box component="img" src="/ilmlogo.png" alt="Ilmdesk" sx={{ height: 36, width: "auto", display: "block" }} />
        </Link>
        {showClose && (
          <IconButton aria-label="Close menu" onClick={() => setMobileOpen(false)} sx={{ color: "#fff" }}>
            <Close />
          </IconButton>
        )}
      </Box>
      <NavList items={items} pathname={pathname} locked={waiting} onNavigate={go} />
      <Box
        onClick={() => go("/")}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.35,
          mx: 1.75,
          mt: 1.5,
          px: 1.4,
          py: 1.15,
          borderRadius: "14px",
          color: "rgba(255,255,255,0.72)",
          cursor: "pointer",
          "&:hover": { bgcolor: "rgba(255,255,255,0.06)", color: "#fff" },
        }}
      >
        <LanguageOutlined sx={{ fontSize: 18 }} />
        <Typography sx={{ fontSize: 14.5, fontWeight: 600 }}>Visit website</Typography>
      </Box>
      <Box sx={{ mt: "auto", px: 1.75, pb: 2.25 }}>
        <Box
          sx={{
            borderRadius: "18px",
            bgcolor: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
            overflow: "hidden",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, px: 1.25, py: 1.25 }}>
            <Avatar src={state?.user?.image || undefined} sx={{ width: 38, height: 38, bgcolor: primary, fontSize: 15, fontWeight: 700 }}>
              {(state?.user?.name || "I").slice(0, 1).toUpperCase()}
            </Avatar>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography noWrap sx={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>
                {state?.user?.name || "Ilmdesk"}
              </Typography>
              <Typography noWrap sx={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>
                {state?.user?.email || roleLabel(state?.user?.role)}
              </Typography>
            </Box>
          </Box>
          <Box
            onClick={() => {
              setMobileOpen(false);
              clearSession(setState);
              route.push("/");
            }}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 1.5,
              py: 1.05,
              borderTop: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.72)",
              cursor: "pointer",
              "&:hover": { color: "#fff", bgcolor: "rgba(255,255,255,0.04)" },
            }}
          >
            <Logout sx={{ fontSize: 16 }} />
            <Typography sx={{ fontSize: 13.5, fontWeight: 600 }}>Log out</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  const paperSx = {
    boxSizing: "border-box",
    width: drawerWidth,
    bgcolor: ink,
    color: "#fff",
    borderRight: "none",
    backgroundImage: "linear-gradient(180deg, #0E2138 0%, #071322 55%, #123044 140%)",
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: sand }}>
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          anchor="top"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              ...paperSx,
              width: "100%",
              height: "100dvh",
              maxHeight: "100dvh",
            },
          }}
        >
          {drawer(true)}
        </Drawer>
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": paperSx,
          }}
        >
          {drawer(false)}
        </Drawer>
      </Box>
      <Box sx={{ flexGrow: 1, minWidth: 0, px: { xs: 2, md: 4 }, py: { xs: 2, md: 4 } }}>
        <Box
          sx={{
            display: { xs: "flex", md: "none" },
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2.5,
            pl: 1.5,
            pr: 0.75,
            py: 0.6,
            borderRadius: "18px",
            bgcolor: ink,
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <Box component="img" src="/ilmlogo.png" alt="Ilmdesk" sx={{ height: 34, width: "auto", display: "block" }} />
          <IconButton
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            sx={{
              color: "#fff",
              width: 32,
              height: 32,
              "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
            }}
          >
            <Menu sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>
        <Box sx={{ width: "100%" }}>{children}</Box>
      </Box>
    </Box>
  );
}
