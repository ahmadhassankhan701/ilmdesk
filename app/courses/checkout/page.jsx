"use client";
import {
  Alert,
  Backdrop,
  Box,
  Button,
  Card,
  CardContent,
  styled,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import PCourseSlimCard from "@/components/PopularCourses/PCourseSlimCard";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db, storage } from "@/firebase";
import { toast } from "react-toastify";
import { CloudUpload } from "@mui/icons-material";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});
function CheckoutPage() {
  const { state } = useAuth();
  const route = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("id");
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const userId = state?.user?.uid;
  const userName = state?.user?.name;
  // Redirect if not logged in
  useEffect(() => {
    if (!state?.user) {
      route.push("/auth?redirect=/courses/checkout");
    }
  }, [state]);
  // Fetch content and enrollment only when userId & courseId are available
  useEffect(() => {
    if (userId && courseId) {
      checkIfEnrolled();
      fetchContent();
    }
  }, [userId, courseId]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, "CourseTheory", courseId);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        setContent({ key: snapshot.id, ...snapshot.data(), ratings: [] });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error("Failed to fetch content");
    }
  };

  const checkIfEnrolled = async () => {
    try {
      const docRef = collection(db, "Payments");
      const q = query(
        docRef,
        where("courseId", "==", courseId),
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return;
      }

      const status = querySnapshot.docs[0].data().status;

      if (status === "approved") {
        toast.success("Already enrolled in this course");
        route.push("/dashboard/courses");
      } else if (status === "pending") {
        toast.success("Paid already. Wait for approval");
        route.push("/dashboard/courses");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleFileInput = async (e) => {
    try {
      const file = e.target.files[0];
      if (file === undefined || file === null) {
        return;
      }
      setLoading(true);
      const formData = new FormData();
      formData.append("document", file);
      const filedata = [...formData];
      const filename = filedata[0][1].name;
      const fileSize = filedata[0][1].size;
      const fileExtension = filename.split(".").pop();
      if (
        fileExtension !== "png" &&
        fileExtension !== "jpg" &&
        fileExtension !== "jpeg" &&
        fileExtension !== "avif" &&
        fileExtension !== "pdf"
      ) {
        setLoading(false);
        toast.error("File should be image or pdf");
        return;
      }
      if (fileSize > 2000000) {
        setLoading(false);
        toast.error("File size should not exceed 2MB");
        return;
      }
      const path = `Payments/${courseId}/${userId}`;
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      const paymentData = {
        userId: userId,
        userName: userName,
        courseId,
        courseName: content ? content.title : "",
        amount: content ? content.price : 0,
        status: "pending",
        receiptUrl: url, // Uploaded file
        paidAt: new Date(),
        confirmedAt: new Date(),
      };
      const docRef = collection(db, "Payments");
      await addDoc(docRef, paymentData);
      setLoading(false);
      toast.success("Receipt uploaded. Wait for confirmation!");
      route.push("/dashboard/account");
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong");
      console.log(error);
    }
  };
  const handleJazzcash = async () => {
    alert("Coming Soon");
    // try {
    //   setLoading(true);
    //   const res = await fetch("/api/jazzcash", {
    //     method: "POST",
    //     body: JSON.stringify({
    //       amount: 500, // PKR
    //       email: "test@example.com",
    //       phone: "03001234567",
    //     }),
    //   });

    //   const { paymentData, paymentURL } = await res.json();

    //   // Create a form and submit it to JazzCash
    //   const form = document.createElement("form");
    //   form.method = "POST";
    //   form.action = paymentURL;

    //   for (const key in paymentData) {
    //     const input = document.createElement("input");
    //     input.type = "hidden";
    //     input.name = key;
    //     input.value = paymentData[key];
    //     form.appendChild(input);
    //   }

    //   document.body.appendChild(form);
    //   form.submit();
    // } catch (error) {
    //   console.log(error);
    // }
  };
  return (
    <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
      <Box width={"80%"} mt={10}>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <img src={"/loader.gif"} />
        </Backdrop>
        <Box sx={{ padding: 4, backgroundColor: "#f5f5f5" }}>
          <Grid container spacing={4}>
            {/* Left Side – Course Details */}
            <Grid size={{ xs: 12, sm: 7 }}>
              <PCourseSlimCard data={content} />
            </Grid>

            {/* Right Side – Payment Options */}
            <Grid size={{ xs: 12, sm: 5 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Choose a Payment Method
                  </Typography>
                  <Box>
                    <Typography
                      sx={{ fontSize: 15, color: "#000", mt: 2 }}
                      variant="h6"
                      gutterBottom
                    >
                      Title: Muhammad Qasim
                    </Typography>
                    <Box
                      display={"flex"}
                      justifyContent={"space-between"}
                      alignItems={"center"}
                      flexWrap={"wrap"}
                    >
                      <Typography
                        sx={{ fontSize: 15, color: "gray", mt: 2 }}
                        variant="h6"
                        gutterBottom
                      >
                        Jazzcash: +923086403836
                      </Typography>
                      <Typography
                        sx={{ fontSize: 15, color: "gray", mt: 2 }}
                        variant="h6"
                        gutterBottom
                      >
                        Easypaisa: +923086403836
                      </Typography>
                    </Box>
                    <Typography
                      sx={{ fontSize: 15, color: "gray", mt: 2 }}
                      variant="h6"
                      gutterBottom
                    >
                      Allied Bank: 02370010087574630015
                    </Typography>
                    <Alert severity="info">
                      Please make payment and upload the receipt. You will
                      receive a confirmation of enrolment
                    </Alert>
                    <Button
                      component="label"
                      role={undefined}
                      variant="contained"
                      tabIndex={-1}
                      startIcon={<CloudUpload />}
                      onChange={(e) => handleFileInput(e)}
                      size="small"
                      color="success"
                      sx={{ mt: 1 }}
                    >
                      Upload Receipt
                      <VisuallyHiddenInput type="file" />
                    </Button>
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
                      my: 2,
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
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      mt: 2,
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleJazzcash}
                    >
                      Pay with JazzCash
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => alert("Easypaisa Payment Coming Soon")}
                    >
                      Pay with Easypaisa
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => alert("Bank Transfer Coming Soon")}
                    >
                      Bank Transfer
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
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
    <CheckoutPage />
  </Suspense>
);
export default PageWrapper;
