import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import {
  AccountBalance,
  ClassOutlined,
  DashboardOutlined,
  Home,
  Logout,
  Notifications,
  Person,
  Quiz,
} from "@mui/icons-material";
import Link from "next/link";
import { Avatar } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useAuth } from "@/context/AuthContext";
const drawerWidth = 240;

export default function SideBar(props) {
  const { window } = props;
  const { setState, state } = useAuth();
  const route = useRouter();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  let sideArray = [
    {
      name: "Dashboard",
      icon: <DashboardOutlined sx={{ color: "#fff", fontSize: 20 }} />,
      route: "/dashboard",
    },
    {
      name: "Courses",
      icon: <ClassOutlined sx={{ color: "#fff", fontSize: 20 }} />,
      route: "/dashboard/courses",
    },
    {
      name: "Quizzes",
      icon: <Quiz sx={{ color: "#fff", fontSize: 20 }} />,
      route: "/dashboard/quizzes",
    },
    {
      name: "Account",
      icon: <AccountBalance sx={{ color: "#fff", fontSize: 20 }} />,
      route: "/dashboard/account",
    },
    {
      name: "Profile",
      icon: <Person sx={{ color: "#fff", fontSize: 20 }} />,
      route: "/dashboard/profile",
    },
  ];
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
      }}
    >
      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        width={"100%"}
        overflow={"hidden"}
        height={120}
      >
        <Link href={"/"}>
          <img
            src={"/ilmlogo.png"}
            alt="Logo"
            style={{
              cursor: "pointer",
              maxWidth: 150,
              height: "auto",
            }}
          />
        </Link>
      </Box>
      <Box
        height={"100%"}
        overflow={"auto"}
        display={"flex"}
        justifyContent={"center"}
      >
        <Box width={"100%"} mx={1}>
          <Box
            mt={2}
            px={1}
            py={2}
            bgcolor={"#36454F"}
            borderRadius={2}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Box ml={1}>
              <Typography
                sx={{
                  color: "#ffffff",
                  fontWeight: "bold",
                  textAlign: "left",
                  fontSize: 15,
                }}
              >
                {state?.user?.name || "John Doe"}
              </Typography>
              <Typography
                sx={{
                  color: "#ffffff",
                  fontWeight: "bold",
                  textAlign: "left",
                  fontSize: 13,
                  mt: 1,
                }}
              >
                Student
              </Typography>
            </Box>
            <Avatar
              alt="Profile Image"
              src={""}
              sx={{ width: 40, height: 40, bgcolor: "purple" }}
            />
          </Box>
          <List
            sx={{
              mt: 3,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            {sideArray &&
              sideArray.map((item, index) => (
                <Box
                  key={item.name}
                  onClick={() => route.push(item.route)}
                  sx={[
                    item.name === "Dashboard" && usePathname() === "/"
                      ? {
                          color: "#fff",
                          bgcolor: "#36454F",
                        }
                      : usePathname() === item.route
                      ? {
                          color: "#fff",
                          bgcolor: "#36454F",
                        }
                      : {
                          color: "#fff",
                        },
                    {
                      my: 1,
                      p: 2,
                      textTransform: "none",
                      fontSize: { xs: 12, md: 14 },
                      display: "flex",
                      justifyContent: "felx-start",
                      alignItems: "center",
                      gap: 2,
                      borderRadius: 2,
                      cursor: "pointer",
                      width: "100%",
                      "&:hover": {
                        color: "#f50366",
                        color: "#fff",
                      },
                    },
                  ]}
                >
                  {item.icon}
                  <Box>{item.name}</Box>
                </Box>
              ))}
          </List>
        </Box>
      </Box>
      <Box
        width={"100%"}
        mb={2}
        overflow={"hidden"}
        display={"flex"}
        justifyContent={"center"}
      >
        <Box
          display={"flex"}
          justifyContent={"flex-start"}
          alignItems={"center"}
          py={2}
          width={"90%"}
          bgcolor={"#f50366"}
          borderRadius={2}
          gap={4.8}
          sx={{ cursor: "pointer" }}
          onClick={() => {
            Cookies.remove("qasim_lms_auth");
            setState({
              ...state,
              user: null,
            });
            route.push("/");
          }}
        >
          <Logout sx={{ color: "#fff", fontSize: 24, ml: 2 }} />
          <Typography sx={{ fontSize: 16, color: "#fff" }}>Logout</Typography>
        </Box>
      </Box>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          boxShadow: "none",
          backgroundColor: "transparent",
          borderBottom: "none",
          height: 60,
          display: "flex",
          justifyContent: "center",
          bgcolor: "#002935",
          color: "#ffffff",
        }}
      >
        <Toolbar>
          <IconButton
            color="#ffffff"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon style={{ color: "#fff" }} />
          </IconButton>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            width={"100%"}
          >
            <Link href={"/"} style={{ textDecoration: "none" }}>
              <Box display={"flex"} alignItems={"center"} gap={1}>
                <Home sx={{ color: "#A6A6A6", fontSize: 20 }} />
                <Typography color="#A6A6A6">Home</Typography>
              </Box>
            </Link>
            <Box
              display={"flex"}
              gap={2}
              alignItems={"center"}
              borderRadius={20}
              px={2}
              py={0.5}
            >
              <Notifications sx={{ color: "#A6A6A6", fontSize: 20 }} />
              <Avatar
                alt={state?.user?.name}
                src="/images/favicon.png"
                sx={{ width: 35, height: 35, bgcolor: "#f50366" }}
              />
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
        }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
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
              border: "none",
              color: "#ffffff",
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: "#002935",
              color: "#ffffff",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {props.children}
      </Box>
    </Box>
  );
}
