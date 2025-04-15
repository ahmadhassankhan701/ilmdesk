// import { useAuth } from "@/context/AuthContext";
// import { auth } from "@/firebase";
// import {
//   AccountBalanceOutlined,
//   Dashboard,
//   LogoutOutlined,
//   MenuBookOutlined,
//   Person2Outlined,
// } from "@mui/icons-material";
// import { Avatar, Box, Divider, Grid, Typography } from "@mui/material";
// import { signOut } from "firebase/auth";
// import Cookies from "js-cookie";
// import { useRouter } from "next/navigation";
// import React from "react";
// import { toast } from "react-toastify";

// const SideBar = ({ children, active }) => {
//   const route = useRouter();
//   const { state, setState } = useAuth();
//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       Cookies.remove("qasim_lms_auth");
//       setState({
//         user: null,
//       });
//       route.push("/");
//     } catch (error) {
//       toast.error("Logout failed");
//       console.log(error);
//     }
//   };
//   return (
//     <Grid container spacing={2}>
//       <Grid item xs={12} sm={3}>
//         <Box
//           sx={{
//             bgcolor: "rgb(0, 41, 53)",
//             borderRadius: 3,
//             p: 2,
//             mt: 5,
//             boxShadow:
//               "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
//           }}
//         >
//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "center",
//               flexDirection: "column",
//               alignItems: "center",
//             }}
//           >
//             {state && state.user && state.user.image ? (
//               <Avatar src={state.user.image} sx={{ width: 100, height: 100 }} />
//             ) : (
//               <Avatar sx={{ width: 100, height: 100 }}>
//                 {state && state.user && state.user.name.charAt(0)}
//               </Avatar>
//             )}
//             <Typography
//               sx={{
//                 fontSize: 16,
//                 fontWeight: 800,
//                 color: "#fff",
//                 mt: 2,
//               }}
//             >
//               {state && state.user && state.user.name}
//             </Typography>
//           </Box>
//           <Divider sx={{ my: 3, bgcolor: "#fff" }} />
//           <Box>
//             {[
//               { name: "Dashboard", icon: <Dashboard sx={{ color: "#fff" }} /> },
//               {
//                 name: "My Courses",
//                 icon: <MenuBookOutlined sx={{ color: "#fff" }} />,
//               },
//               {
//                 name: "Account Details",
//                 icon: <AccountBalanceOutlined sx={{ color: "#fff" }} />,
//               },
//               {
//                 name: "Profile",
//                 icon: <Person2Outlined sx={{ color: "#fff" }} />,
//               },
//             ].map((item, i) => (
//               <Box
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   p: 1,
//                   mb: 1,
//                   cursor: "pointer",
//                   gap: 3,
//                   borderRadius: 2,
//                   "&:hover": {
//                     bgcolor: "#ff3158",
//                   },
//                 }}
//                 bgcolor={active === item.name ? "#ff3158" : "transparent"}
//                 key={i}
//               >
//                 {item.icon}
//                 <Typography
//                   sx={{
//                     fontSize: 14,
//                     fontWeight: 400,
//                   }}
//                   color={"#fff"}
//                 >
//                   {item.name}
//                 </Typography>
//               </Box>
//             ))}
//             <Divider sx={{ my: 2, bgcolor: "#fff" }} />
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 p: 1,
//                 mb: 1,
//                 cursor: "pointer",
//                 gap: 3,
//               }}
//               onClick={handleLogout}
//             >
//               <LogoutOutlined sx={{ color: "#fff" }} />
//               <Typography
//                 sx={{
//                   fontSize: 14,
//                   fontWeight: 400,
//                   color: "#fff",
//                 }}
//               >
//                 Logout
//               </Typography>
//             </Box>
//           </Box>
//         </Box>
//       </Grid>
//       <Grid item xs={12} sm={9} mt={5}>
//         {children}
//       </Grid>
//     </Grid>
//   );
// };

// export default SideBar;

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import {
  ArrowBack,
  ArrowBackIos,
  ClassOutlined,
  DashboardOutlined,
  LibraryBooksOutlined,
  Logout,
  ManageAccountsOutlined,
  MenuBookOutlined,
  Notifications,
  PeopleOutline,
  Person,
  Quiz,
  QuizOutlined,
  Undo,
} from "@mui/icons-material";
import Link from "next/link";
import Cookies from "js-cookie";
import { Avatar, Button, InputBase, styled } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { usePathname } from "next/navigation";
const drawerWidth = 240;
const Search = styled("div")(({ theme }) => ({
  backgroundColor: "lightgray",
  borderRadius: 20,
  position: "relative",
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "gray",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "gray",
  fontSize: 16,
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));
export default function SideBar(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  let sideArray = [
    {
      name: "Dashboard",
      icon: <DashboardOutlined sx={{ color: "#fff", fontSize: 20 }} />,
    },
    {
      name: "Courses",
      icon: <ClassOutlined sx={{ color: "#fff", fontSize: 20 }} />,
    },
    {
      name: "Quizzes",
      icon: <Quiz sx={{ color: "#fff", fontSize: 20 }} />,
    },
    {
      name: "Profile",
      icon: <Person sx={{ color: "#fff", fontSize: 20 }} />,
    },
  ];
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const handleNavigation = (item) => {
    const lowerCased = item.toLowerCase();
    if (lowerCased === "home") route.push("/");
    else route.push("/" + lowerCased);
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
        // bgcolor={"primary.dark"}
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
            bgcolor={"#f50366"}
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
                Ahmad Hassan Khan
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
                  onClick={() => handleNavigation(item.name)}
                  sx={[
                    item.name === "Dashboard" && usePathname() === "/"
                      ? {
                          color: "#fff",
                          bgcolor: "#f50366",
                        }
                      : usePathname().includes(item.name.toLowerCase())
                      ? {
                          color: "#fff",
                          bgcolor: "#f50366",
                        }
                      : {
                          color: "#fff",
                        },
                    {
                      my: 1,
                      p: 2,
                      textTransform: "none",
                      fontSize: { xs: 8, sm: 10, md: 14 },
                      display: "flex",
                      justifyContent: "felx-start",
                      alignItems: "center",
                      gap: 2,
                      borderRadius: 2,
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
            // Cookies.remove("lms_admin_auth");
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
          height: 100,
          display: "flex",
          justifyContent: "center",
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
            <MenuIcon />
          </IconButton>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            width={"100%"}
          >
            <Link href={"/"} style={{ textDecoration: "none" }}>
              <Box display={"flex"} alignItems={"center"} gap={2}>
                <Undo sx={{ color: "#A6A6A6" }} />
                <Typography color="#A6A6A6">Back to Home</Typography>
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
              <Search>
                <SearchIconWrapper>
                  <SearchIcon sx={{ fontSize: 20 }} />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search…"
                  inputProps={{ "aria-label": "search" }}
                />
              </Search>
              <Notifications sx={{ color: "#A0AAB4", fontSize: 20 }} />
              <Logout sx={{ color: "#A0AAB4", fontSize: 20 }} />
              <Avatar
                alt="Remy Sharp"
                src="/images/favicon.png"
                sx={{ width: 35, height: 35, bgcolor: "pink" }}
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
              backgroundColor: "red",
              // backgroundColor: "#3c4b64",
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
          mt: 5,
        }}
      >
        <Toolbar />
        {props.children}
      </Box>
    </Box>
  );
}
