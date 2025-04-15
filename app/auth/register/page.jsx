"use client";
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  Backdrop,
} from "@mui/material";
import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { styled } from "@mui/material/styles";
import {
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "../../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Link from "next/link";
import GoogleSignInButton from "@/components/SpecialCards/GoogleSignInButton";
import Cookies from "js-cookie";
import { useAuth } from "@/context/AuthContext";

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
const RegisterPage = () => {
  const route = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");
  const { setState } = useAuth();
  const loaderImage = "/loader.gif";
  const googleProvider = new GoogleAuthProvider();
  const [details, setDetails] = useState({
    name: "",
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
    if (
      details.name === "" ||
      details.email === "" ||
      details.password === ""
    ) {
      toast.error("Please fill all the fields");
      return;
    }
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        details.email,
        details.password
      );
      handleMailVerification(userCredential.user);
    } catch (error) {
      setLoading(false);
      if (error.code === "auth/email-already-in-use") {
        toast.error("Email already registered. Try using different email");
      } else {
        toast.error(error.message);
      }
      console.log(error);
    }
  };
  const handleMailVerification = async (users) => {
    try {
      await sendEmailVerification(auth.currentUser);
      updateProfile(auth.currentUser, {
        displayName: details.name,
      });
      let user = {
        name: details.name,
        email: details.email,
        image: "",
        createdAt: new Date(),
      };
      await setDoc(doc(db, "Students", users.uid), user);
      setLoading(false);
      toast.success(
        "Verification mail sent. Once verified then you can login!"
      );
      route.push(`/auth?redirect=${redirectTo}`);
    } catch (e) {
      setLoading(false);
      toast.error(e.message);
      console.log(e);
    }
  };
  const googleLogin = async () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
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
      route.push(redirectTo);
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
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          mt: 15,
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
            <img src={loaderImage} />
          </Box>
        )}
        <Grid
          container
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          flexDirection={"column"}
        >
          <Grid
            item
            xs={12}
            sm={6}
            lg={4}
            border={"none"}
            bgcolor={"#fff"}
            borderRadius={2}
            sx={{
              boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
            }}
            mx={1}
          >
            <Box
              sx={{
                background: `url(/ResourcesTopBanner.png)`,
                backgroundColor: "#000000",
                backgroundSize: "cover",
                height: "20vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 2,
              }}
            >
              <Typography
                variant={"h5"}
                textAlign={"center"}
                mt={1}
                mb={5}
                fontWeight={"bold"}
                color={"#fff"}
              >
                Student Register
              </Typography>
            </Box>
            <Box padding={5}>
              <StyledTextField
                id="outlined-basic"
                label="Your name"
                variant="outlined"
                fullWidth
                sx={{ my: 1 }}
                InputProps={{
                  style: {
                    color: "#A0AAB4",
                  },
                }}
                onChange={(e) => handleChange("name", e.target.value)}
              />
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
                  type: "password",
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
                  Already a user?{" "}
                  <Link
                    href={`/auth?redirect=${redirectTo}`}
                    style={{ textDecoration: "none", color: "red" }}
                  >
                    Sign in
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
                title={"Sign up with Google"}
                onClick={googleLogin}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

const PageWrapper = () => (
  <Suspense
    fallback={
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
      >
        <img src={"/loader.gif"} width={100} height={100} />
      </Backdrop>
    }
  >
    <RegisterPage />
  </Suspense>
);
export default PageWrapper;
