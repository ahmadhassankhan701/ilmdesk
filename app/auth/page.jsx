"use client";
import { Box, Typography, Button, Grid, TextField } from "@mui/material";
import React from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { styled } from "@mui/material/styles";
import { Google } from "@mui/icons-material";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db } from "../../firebase";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import GoogleSignInButton from "@/components/SpecialCards/GoogleSignInButton";
import { doc, getDoc, setDoc } from "firebase/firestore";

const StyledTextField = styled(TextField)({
  "& label": {
    color: "#A0AAB4",
  },
  "& label.Mui-focused": {
    color: "#A0AAB4",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#A0AAB4",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#A0AAB4",
      color: "#A0AAB4",
    },
    "&:hover fieldset": {
      borderColor: "#A0AAB4",
      color: "#A0AAB4",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#A0AAB4",
      color: "#A0AAB4",
    },
  },
});
const page = () => {
  const route = useRouter();
  const { setState } = useAuth();
  const loaderImage = "/loader.gif";
  const googleProvider = new GoogleAuthProvider();
  const [details, setDetails] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const handleChange = (name, val) => {
    setDetails({
      ...details,
      [name]: val,
    });
  };
  const handleSubmit = async () => {
    if (details.email === "" || details.password === "") {
      toast.error("Please fill all the fields");
      return;
    }
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        details.email,
        details.password
      );
      handleUserVerification(userCredential.user);
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
      console.log(error);
    }
  };
  const handleUserVerification = async (users) => {
    try {
      if (users.emailVerified) {
        const user = {
          uid: users.uid,
          name: users.displayName,
          email: users.email,
          image: users.photoURL,
        };
        const stateData = { user };
        setState({
          user: stateData.user,
        });
        Cookies.set("qasim_lms_auth", JSON.stringify(stateData), {
          expires: 7,
        });
        setLoading(false);
        route.push("/dashboard");
      } else {
        // await sendEmailVerification(auth.currentUser);
        await signOut(auth);
        setLoading(false);
        toast.error("Verification email sent to you. Verify then Login!");
      }
    } catch (error) {
      setLoading(false);
      alert(error.message);
      console.log(error);
    }
  };
  const googleLogin = async () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        // The signed-in user info.
        const data = result.user;
        handleUserState(data);
      })
      .catch((error) => {
        // Handle Errors here.
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
        toast.error(errorMessage);
        console.log(errorMessage);
        console.log(email);
        console.log(credential);
      });
  };
  const saveUserDatabase = async (data) => {
    try {
      let userData = {
        name: data.displayName,
        email: data.email,
        image: data.photoURL || "",
        createdAt: new Date(),
      };
      await setDoc(doc(db, "Students", data.uid), userData);
    } catch (error) {
      setLoading(false);
      toast.error("User data not saved");
      console.log(error);
    }
  };
  const handleUserState = async (data) => {
    try {
      setLoading(true);
      const docSnap = await getDoc(doc(db, "Students", data.uid));
      if (docSnap.exists() === false) {
        saveUserDatabase(data);
      }
      let user = {
        uid: data.uid,
        name: data.displayName,
        email: data.email,
        image: data.photoURL,
      };
      const stateData = { user };
      setState({
        user: stateData.user,
      });
      Cookies.set("qasim_lms_auth", JSON.stringify(stateData), {
        expires: 7,
      });
      setLoading(false);
      route.push("/dashboard");
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong");
      console.log(error);
    }
  };
  return (
    <Box>
      <Box
        sx={{
          background: `url(/ResourcesTopBanner.png)`,
          backgroundColor: "#000000",
          backgroundSize: "cover",
          height: "50vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          pl: 10,
          justifyContent: "center",
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: 48,
              fontWeight: 700,
              color: "#FFFFFF",
              mb: 1,
            }}
          >
            Login
          </Typography>
          <Typography
            sx={{
              fontSize: 25,
              fontWeight: 500,
              color: "#FFFFFF",
              mb: 1,
            }}
          >
            Login to avail our best services
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          mt: 5,
        }}
      >
        {loading && (
          <Box
            sx={{
              position: "absolute",
              backgroundColor: "#212333",
              opacity: 0.7,
              zIndex: 999,
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img src={loaderImage} width={100} height={100} />
          </Box>
        )}
        <Grid
          container
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Grid
            item
            xs={12}
            sm={6}
            lg={4}
            border={"none"}
            padding={5}
            bgcolor={"#fff"}
            borderRadius={2}
            sx={{
              boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
            }}
            mx={1}
          >
            <Typography
              variant={"h5"}
              textAlign={"center"}
              mt={1}
              mb={5}
              fontWeight={"bold"}
              color={"#212333"}
            >
              Student Login
            </Typography>
            <StyledTextField
              id="outlined-basic"
              label="Your email"
              variant="outlined"
              fullWidth
              sx={{ my: 1 }}
              InputProps={{
                style: {
                  color: "#A0AAB4",
                },
              }}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            <StyledTextField
              id="outlined-basics"
              label="Password"
              variant="outlined"
              fullWidth
              sx={{
                my: 1,
              }}
              InputProps={{
                style: {
                  color: "#A0AAB4",
                },
              }}
              onChange={(e) => handleChange("password", e.target.value)}
            />
            <Button
              variant="contained"
              sx={{
                color: "#fff",
                backgroundColor: "#ff3158",
                my: 1,
                "&:hover": { backgroundColor: "#f50366" },
              }}
              fullWidth
              onClick={handleSubmit}
            >
              Submit
            </Button>
            <Box
              display={"flex"}
              justifyContent={"flex-end"}
              alignItems={"center"}
              my={2}
            >
              <Typography textAlign={"center"} alignSelf={"flex-end"}>
                Not a user?{" "}
                <Link
                  href={"/auth/register"}
                  style={{ textDecoration: "none", color: "red" }}
                >
                  Register now
                </Link>
              </Typography>
            </Box>
            <Typography
              variant="p"
              sx={{
                fontSize: 16,
                fontWeight: 700,
                lineHeight: 1,
                color: "gray",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 3,
                textAlign: "center",
              }}
            >
              <span
                style={{
                  width: "42%",
                  height: 2,
                  marginBottom: 5,
                  display: "inline-block",
                  background: "gray",
                }}
              ></span>
              OR
              <span
                style={{
                  width: "42%",
                  height: 2,
                  marginBottom: 5,
                  display: "inline-block",
                  background: "gray",
                }}
              ></span>
            </Typography>
            <GoogleSignInButton
              title={"Sign in with Google"}
              onClick={googleLogin}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default page;
