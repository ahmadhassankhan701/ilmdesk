"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Close from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Tooltip from "@mui/material/Tooltip";
import Logout from "@mui/icons-material/Logout";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { clearSession } from "@/lib/accounts";
import { destinationFor } from "@/lib/roles";
import { pageColumnSx } from "@/lib/pageColumn";

const navItems = ["Home", "Courses", "Classes", "About", "Contact"];
const primary = "#0D9AAC";
const accent = "#FF6B6B";
const accentHover = "#E85D5D";

function Nav() {
  const route = useRouter();
  const pathname = usePathname();
  const { state, setState } = useAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const isLoggedIn = Boolean(state?.user);

  const closeDrawer = () => setMobileOpen(false);
  const go = (path) => {
    closeDrawer();
    route.push(path);
  };
  const handleNavigation = (item) => {
    const lowerCased = item.toLowerCase();
    go(lowerCased === "home" ? "/" : `/${lowerCased}`);
  };
  const handleLogout = () => {
    setAnchorEl(null);
    closeDrawer();
    clearSession(setState);
    route.push("/");
  };
  const isActive = (item) => {
    if (item === "Home") return pathname === "/";
    return pathname.startsWith("/" + item.toLowerCase());
  };

  const linkSx = (item) => ({
    textTransform: "none",
    fontSize: 14.5,
    fontWeight: isActive(item) ? 600 : 500,
    color: isActive(item) ? "#fff" : "rgba(255,255,255,0.68)",
    px: 1.6,
    py: 0.7,
    minWidth: 0,
    borderRadius: "10px",
    whiteSpace: "nowrap",
    "&:hover": { color: "#fff", backgroundColor: "rgba(255,255,255,0.06)" },
    ...(isActive(item) && { backgroundColor: "rgba(13, 154, 172, 0.28)", color: "#fff" }),
  });

  const actions = isLoggedIn ? (
    <Tooltip title="Account">
      <IconButton
        onClick={(event) => setAnchorEl(event.currentTarget)}
        size="small"
        aria-controls={open ? "account-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <Avatar src={state.user?.image || undefined} sx={{ width: 34, height: 34, bgcolor: primary, fontSize: 15 }}>
          {state.user?.name?.charAt(0)}
        </Avatar>
      </IconButton>
    </Tooltip>
  ) : (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.25, flexShrink: 0 }}>
      <Button
        size="small"
        onClick={() => route.push("/auth")}
        sx={{ color: "#fff", textTransform: "none", fontWeight: 500, "&:hover": { backgroundColor: "rgba(255,255,255,0.06)" } }}
      >
        Log in
      </Button>
      <Button
        size="small"
        variant="contained"
        onClick={() => route.push("/auth/register")}
        sx={{
          bgcolor: accent,
          color: "#fff",
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 999,
          px: 2,
          ml: 0.75,
          boxShadow: "none",
          "&:hover": { bgcolor: accentHover, boxShadow: "none" },
        }}
      >
        Get started
      </Button>
    </Box>
  );

  return (
    <>
      <AppBar
        component="nav"
        elevation={0}
        sx={{
          backgroundColor: "transparent",
          backgroundImage: "none",
          boxShadow: "none",
          pt: 1.5,
        }}
      >
        <Box sx={{ ...pageColumnSx, px: 0 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              minHeight: 64,
              px: { xs: 1.25, md: 2 },
              borderRadius: "18px",
              bgcolor: "#0A192F",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(16px)",
            }}
          >
            <Box sx={{ cursor: "pointer", flexShrink: 0, display: "flex" }} onClick={() => route.push("/")}>
              <img src="/ilmlogo.png" alt="Ilmdesk" style={{ height: 38, width: "auto", maxWidth: 132 }} />
            </Box>
            <Box sx={{ display: { xs: "none", md: "flex" }, flexGrow: 1, justifyContent: "center", gap: 0.25 }}>
              {navItems.map((item) => (
                <Button key={item} sx={linkSx(item)} onClick={() => handleNavigation(item)}>
                  {item}
                </Button>
              ))}
            </Box>
            <Box sx={{ display: { xs: "none", md: "flex" }, ml: "auto" }}>{actions}</Box>
            <IconButton
              aria-label="open menu"
              onClick={() => setMobileOpen(true)}
              sx={{
                display: { md: "none" },
                ml: "auto",
                color: "#fff",
                width: 32,
                height: 32,
                "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
              }}
            >
              <MenuIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
        </Box>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={() => setAnchorEl(null)}
        onClick={() => setAnchorEl(null)}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        sx={{ mt: 1 }}
      >
        <Link href={destinationFor(state.user)} style={{ textDecoration: "none", color: "inherit" }}>
          <MenuItem>
            <Avatar src={state.user?.image || undefined} sx={{ width: 28, height: 28, mr: 1.25, bgcolor: primary, fontSize: 14 }}>
              {state.user?.name?.charAt(0)}
            </Avatar>
            {state.user?.profileComplete ? "Dashboard" : "Finish profile"}
          </MenuItem>
        </Link>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Log out
        </MenuItem>
      </Menu>

      <Drawer
        variant="temporary"
        anchor="top"
        open={mobileOpen}
        onClose={closeDrawer}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: "100%",
            height: "100dvh",
            maxHeight: "100dvh",
            backgroundColor: "#0A192F",
            color: "#fff",
          },
        }}
      >
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column", py: 2.5, px: 2 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box onClick={() => go("/")} sx={{ cursor: "pointer", display: "flex" }}>
              <img src="/ilmlogo.png" alt="Ilmdesk" style={{ height: 38, width: "auto" }} />
            </Box>
            <IconButton aria-label="Close menu" onClick={closeDrawer} sx={{ color: "#fff" }}>
              <Close />
            </IconButton>
          </Box>
          <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", mb: 1 }} />
          {navItems.map((item) => (
            <Button
              key={item}
              fullWidth
              sx={{ ...linkSx(item), justifyContent: "flex-start", py: 1.3, px: 2, borderRadius: "12px" }}
              onClick={() => handleNavigation(item)}
            >
              {item}
            </Button>
          ))}
          <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", my: 1.5 }} />
          <Box display="flex" flexDirection="column" gap={1.25} px={1.5} sx={{ mt: "auto", pb: 2 }}>
            {isLoggedIn ? (
              <>
                <Button variant="contained" onClick={() => go(destinationFor(state.user))} sx={{ bgcolor: primary, textTransform: "none", borderRadius: 999, boxShadow: "none" }}>
                  {state.user?.profileComplete ? "Dashboard" : "Finish profile"}
                </Button>
                <Button variant="outlined" startIcon={<Logout />} onClick={handleLogout} sx={{ borderColor: "rgba(255,255,255,0.3)", color: "#fff", textTransform: "none", borderRadius: 999 }}>
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Button variant="outlined" onClick={() => go("/auth")} sx={{ borderColor: "rgba(255,255,255,0.3)", color: "#fff", textTransform: "none", borderRadius: 999 }}>
                  Log in
                </Button>
                <Button variant="contained" onClick={() => go("/auth/register")} sx={{ bgcolor: accent, textTransform: "none", borderRadius: 999, boxShadow: "none", "&:hover": { bgcolor: accentHover } }}>
                  Get started
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Drawer>
    </>
  );
}

export default Nav;
