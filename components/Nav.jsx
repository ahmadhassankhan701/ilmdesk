"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Tooltip from "@mui/material/Tooltip";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Cookies from "js-cookie";
import Link from "next/link";
const theme = createTheme({
  typography: {
    fontFamily: "Poppins, sans-serif",
  },
});
const drawerWidth = 240;
const navItems = ["Home", "Courses", "Classes", "About", "Contact"];

function Nav(props) {
  const route = useRouter();
  const { state, setState } = useAuth();
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };
  const isLoggedIn = state && state.user ? true : false;
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        height={200}
      >
        <img src={"/ilmlogo.png"} style={{ maxWidth: 200, height: "auto" }} />
      </Box>
      <Divider sx={{ bgcolor: "white" }} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexWrap: { xs: "nowrap", sm: "wrap" },
        }}
      >
        {navItems.map((item) => (
          <Button
            key={item}
            sx={[
              item === "Home" && usePathname() === "/"
                ? {
                    color: "#ff3158",
                  }
                : usePathname().includes(item.toLowerCase())
                ? {
                    color: "#ff3158",
                  }
                : {
                    color: "#fff",
                  },
              {
                my: 1,
                textTransform: "none",
                fontSize: { xs: 12, md: 14 },
                "&:hover": {
                  color: "#f50366",
                },
              },
            ]}
            onClick={() => handleNavigation(item)}
          >
            {item}
          </Button>
        ))}
      </Box>
      {!isLoggedIn ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <Button
            size="small"
            variant={"outlined"}
            sx={{
              borderColor: "#ff3158",
              color: "#ff3158",
              "&:hover": {
                color: "#f50366",
                borderColor: "#f50366",
              },
              mx: 1,
            }}
            onClick={() => route.push("/auth")}
          >
            Login
          </Button>
          <Button
            size="small"
            variant={"contained"}
            sx={{
              bgcolor: "#ff3158",
              "&:hover": {
                bgcolor: "#f50366",
              },
            }}
            onClick={() => route.push("/auth/register")}
          >
            Register
          </Button>
        </Box>
      ) : (
        <Button
          sx={{
            mt: 3,
            textTransform: "none",
          }}
          color="error"
          variant="contained"
          onClick={() => handleNavigation("Dashboard")}
        >
          Dashboard
        </Button>
      )}
    </Box>
  );
  const handleNavigation = (item) => {
    const lowerCased = item.toLowerCase();
    if (lowerCased === "home") route.push("/");
    else route.push("/" + lowerCased);
  };
  const container =
    window !== undefined ? () => window().document.body : undefined;
  const handleLogout = () => {
    setAnchorEl(null);
    Cookies.remove("qasim_lms_auth");
    setState((state) => ({ ...state, user: null }));
    route.push("/");
  };
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          component="nav"
          sx={{
            backgroundImage: `url(/headerBg.png)`,
            backgroundColor: "transparent",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            boxShadow: "none",
          }}
        >
          <Toolbar>
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              width={"100%"}
            >
              <Box
                sx={{ display: { xs: "flex", sm: "none" } }}
                alignItems={"center"}
                justifyContent={"space-between"}
                width={"100%"}
              >
                <Box>
                  <img
                    src={"/ilmlogo.png"}
                    style={{
                      maxWidth: 150,
                      height: "auto",
                      marginLeft: "50px",
                    }}
                    onClick={() => route.push("/")}
                  />
                </Box>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{
                    ml: { xs: 10 },
                    display: { sm: "none" },
                  }}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
              <Box
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                width={"80%"}
              >
                <Box sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}>
                  <img
                    src={"/ilmlogo.png"}
                    style={{
                      maxWidth: 200,
                      height: "auto",
                      cursor: "pointer",
                    }}
                    onClick={() => route.push("/")}
                  />
                </Box>
                <Box
                  sx={{
                    display: { xs: "none", sm: "flex" },
                    flexWrap: { xs: "nowrap", sm: "wrap" },
                  }}
                >
                  {navItems.map((item) => (
                    <Button
                      key={item}
                      sx={[
                        item === "Home" && usePathname() === "/"
                          ? {
                              color: "#ff3158",
                            }
                          : usePathname().includes(item.toLowerCase())
                          ? {
                              color: "#ff3158",
                            }
                          : {
                              color: "#fff",
                            },
                        {
                          ml: 1,
                          textTransform: "none",
                          fontSize: { xs: 8, sm: 10, md: 14 },
                          "&:hover": {
                            color: "#f50366",
                          },
                        },
                      ]}
                      onClick={() => handleNavigation(item)}
                    >
                      {item}
                    </Button>
                  ))}
                  {isLoggedIn ? (
                    <React.Fragment>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          textAlign: "center",
                        }}
                      >
                        <Tooltip title="Account settings">
                          <IconButton
                            onClick={handleClick}
                            size="small"
                            sx={{ ml: 2 }}
                            aria-controls={open ? "account-menu" : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? "true" : undefined}
                          >
                            {state.user?.image ? (
                              <Avatar
                                src={state.user.image}
                                sx={{ width: 32, height: 32 }}
                              />
                            ) : (
                              <Avatar sx={{ width: 32, height: 32 }}>
                                {state.user?.name?.charAt(0)}
                              </Avatar>
                            )}
                          </IconButton>
                        </Tooltip>
                      </Box>
                      <Menu
                        anchorEl={anchorEl}
                        id="account-menu"
                        open={open}
                        onClose={handleClose}
                        onClick={handleClose}
                        sx={{
                          overflow: "visible",
                          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                          mt: 1.5,
                          "& .MuiAvatar-root": {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                          },
                          "&::before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            top: 52,
                            right: 56,
                            width: 10,
                            height: 10,
                            bgcolor: "background.paper",
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0,
                          },
                        }}
                        transformOrigin={{
                          horizontal: "right",
                          vertical: "top",
                        }}
                        anchorOrigin={{
                          horizontal: "right",
                          vertical: "bottom",
                        }}
                      >
                        <Link
                          href={"/dashboard"}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <MenuItem>
                            {state.user?.image ? (
                              <Avatar
                                src={state.user.image}
                                sx={{ width: 32, height: 32 }}
                              />
                            ) : (
                              <Avatar sx={{ width: 32, height: 32 }}>
                                {state.user?.name?.charAt(0)}
                              </Avatar>
                            )}{" "}
                            Profile
                          </MenuItem>
                        </Link>
                        <Divider />
                        <MenuItem onClick={handleClose}>
                          <ListItemIcon>
                            <PersonAdd fontSize="small" />
                          </ListItemIcon>
                          Add another account
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                          <ListItemIcon>
                            <Settings fontSize="small" />
                          </ListItemIcon>
                          Settings
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>
                          <ListItemIcon>
                            <Logout fontSize="small" />
                          </ListItemIcon>
                          Logout
                        </MenuItem>
                      </Menu>
                    </React.Fragment>
                  ) : (
                    <Box
                      display={"flex"}
                      justifyContent={"center"}
                      alignItems={"center"}
                    >
                      <Button
                        size="small"
                        variant={"outlined"}
                        sx={{
                          borderColor: "#ff3158",
                          color: "#ff3158",
                          fontSize: { xs: 8, sm: 10, md: 12 },
                          textTransform: "none",
                          "&:hover": {
                            color: "#f50366",
                            borderColor: "#f50366",
                          },
                          mx: 1,
                        }}
                        onClick={() => route.push("/auth")}
                      >
                        Login
                      </Button>
                      <Button
                        size="small"
                        variant={"contained"}
                        sx={{
                          bgcolor: "#ff3158",
                          my: 0.4,
                          fontSize: { xs: 8, sm: 10, md: 12 },
                          textTransform: "none",
                          "&:hover": {
                            bgcolor: "#f50366",
                          },
                        }}
                        onClick={() => route.push("/auth/register")}
                      >
                        Register
                      </Button>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>
        <nav>
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
                backgroundColor: "#002935",
              },
            }}
          >
            {drawer}
          </Drawer>
        </nav>
      </Box>
    </ThemeProvider>
  );
}

export default Nav;
