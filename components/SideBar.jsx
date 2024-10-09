import { useAuth } from "@/context/AuthContext";
import { auth } from "@/firebase";
import {
  AccountBalanceOutlined,
  LogoutOutlined,
  MenuBookOutlined,
  Person2Outlined,
} from "@mui/icons-material";
import { Avatar, Box, Divider, Grid, Typography } from "@mui/material";
import { signOut } from "firebase/auth";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";

const SideBar = ({ children, active }) => {
  const route = useRouter();
  const { state, setState } = useAuth();
  const handleLogout = async () => {
    try {
      await signOut(auth);
      Cookies.remove("qasim_lms_auth");
      setState({
        user: null,
      });
      route.push("/");
    } catch (error) {
      toast.error("Logout failed");
      console.log(error);
    }
  };
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={3}>
        <Box
          sx={{
            bgcolor: "rgb(0, 41, 53)",
            borderRadius: 1,
            p: 2,
            mt: 5,
            boxShadow:
              "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {state && state.user && state.user.image ? (
              <Avatar src={state.user.image} sx={{ width: 100, height: 100 }} />
            ) : (
              <Avatar sx={{ width: 100, height: 100 }}>
                {state && state.user && state.user.name.charAt(0)}
              </Avatar>
            )}
            <Typography
              sx={{
                fontSize: 16,
                fontWeight: 800,
                color: "#fff",
                mt: 2,
              }}
            >
              {state && state.user && state.user.name}
            </Typography>
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 400,
                color: "#f5036d",
              }}
            >
              {state && state.user && state.user.uid}
            </Typography>
          </Box>
          <Divider sx={{ my: 3, bgcolor: "#fff" }} />
          <Box>
            {["Dashboard", "My Courses", "Account Details", "Profile"].map(
              (item, i) => (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 1,
                    mb: 1,
                    cursor: "pointer",
                    gap: 3,
                    "&:hover": {
                      bgcolor: "#ff3158",
                    },
                  }}
                  bgcolor={active === item ? "#ff3158" : "transparent"}
                  key={i}
                >
                  {i === 0 ? (
                    <Person2Outlined sx={{ color: "#fff" }} />
                  ) : i === 1 ? (
                    <MenuBookOutlined sx={{ color: "#fff" }} />
                  ) : (
                    <AccountBalanceOutlined sx={{ color: "#fff" }} />
                  )}
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 400,
                    }}
                    color={"#fff"}
                  >
                    {item}
                  </Typography>
                </Box>
              )
            )}
            <Divider sx={{ my: 2, bgcolor: "#fff" }} />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                p: 1,
                mb: 1,
                cursor: "pointer",
                gap: 3,
              }}
              onClick={handleLogout}
            >
              <LogoutOutlined sx={{ color: "#fff" }} />
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 400,
                  color: "#fff",
                }}
              >
                Logout
              </Typography>
            </Box>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} sm={9} mt={5}>
        {children}
      </Grid>
    </Grid>
  );
};

export default SideBar;
