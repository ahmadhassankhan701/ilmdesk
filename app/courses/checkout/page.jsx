"use client";
import {
  Backdrop,
  Box,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import PCourseSlimCard from "@/components/PopularCourses/PCourseSlimCard";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { toast } from "react-toastify";

function CheckoutPage() {
  const route = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("id");
  const { state } = useAuth();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(false);
  if (!state && !state.user) {
    route.push("/auth?redirect=/courses/checkout");
  }
  useEffect(() => {
    const fetchContent = async () => {
      if (!courseId) {
        route.back();
        return;
      }
      try {
        // Fetch content from the database
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
    fetchContent();
  }, [courseId]);

  const item = {
    image: "",
    subject: "chemistry",
    title: "Title Chemsitry",
    number_of_ratings: 3,
    creatorImage: "",
    author: "Ahmad Hassan Khan",
    price: "10000",
  };
  const handleJazzcash = async () => {
    try {
      alert("jazzzu");
    } catch (error) {
      console.log(error);
    }
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
                      onClick={() => alert("Easypaisa Payment Initiated")}
                    >
                      Pay with Easypaisa
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => alert("Bank Transfer Instructions Shown")}
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
