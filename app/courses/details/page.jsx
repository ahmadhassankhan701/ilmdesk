"use client";
import {
  CheckCircleOutlineOutlined,
  Star,
  StarOutline,
} from "@mui/icons-material";
import {
  Avatar,
  Backdrop,
  Box,
  Button,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { toast } from "react-toastify";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import renderHTML from "react-render-html";
import moment from "moment";
import { useAuth } from "@/context/AuthContext";
const DetailsPage = () => {
  const { state } = useAuth();
  const route = useRouter();
  const searchParam = useSearchParams();
  const courseId = searchParam.get("id");
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const isUserLoggedIn = state && state.user ? true : false;
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
  }, []);

  return (
    <Box display={"flex"} justifyContent={"center"}>
      <Box sx={{ mx: { xs: 1, lg: 10 } }} width={"80%"}>
        <Box>
          <Box sx={{ mx: { xs: 1, lg: 2 }, mt: 7 }}>
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={loading}
            >
              <img src={"/loader.gif"} />
            </Backdrop>
            {content && content.theory ? (
              <Grid container spacing={2}>
                <Grid item xs={12} lg={8}>
                  <img
                    src={content.image ? content.image : "/courseCategImg.jpg"}
                    style={{
                      width: "100%",
                      height: 500,
                      marginTop: 43,
                      borderRadius: 10,
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                  />
                  <Box
                    sx={{
                      bgcolor: "#fff",
                      borderTopLeftRadius: 0,
                      borderTopRightRadius: 0,
                      borderBottomLeftRadius: 10,
                      borderBottomRightRadius: 10,
                      boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                      transform: "translateY(-50px)",
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <Box display={"flex"} justifyContent={"center"} gap={2}>
                          <Box>
                            <Avatar
                              src={"/avatar.png"}
                              sizes="large"
                              sx={{ bgcolor: "transparent", fontSize: 50 }}
                            />
                          </Box>
                          <Box>
                            <Typography
                              sx={{
                                fontWeight: "700",
                                fontSize: 16,
                                paddingBottom: 1,
                                color: "#000",
                                textAlign: "center",
                              }}
                            >
                              Mr Qasim
                            </Typography>
                            <Typography
                              sx={{
                                fontWeight: 500,
                                fontSize: 14,
                                paddingBottom: 1,
                                color: "#000",
                                textAlign: "center",
                              }}
                            >
                              Sr. Instructor
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Box>
                          <Typography
                            sx={{
                              fontWeight: "700",
                              fontSize: 16,
                              paddingBottom: 1,
                              color: "#000",
                              textAlign: "center",
                            }}
                          >
                            Subject
                          </Typography>
                          <Typography
                            sx={{
                              fontWeight: 500,
                              fontSize: 14,
                              paddingBottom: 1,
                              color: "#000",
                              textAlign: "center",
                            }}
                          >
                            {content.subject}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Box
                          display={"flex"}
                          alignItems={"center"}
                          justifyContent={"center"}
                          gap={1}
                          sx={{ cursor: "pointer", my: 2 }}
                        >
                          <Typography
                            sx={{
                              color: "rgb(74, 83, 85)",
                              fontSize: 16,
                              fontWeight: 700,
                              cursor: "pointer",
                              textTransform: "none",
                            }}
                          >
                            {content.ratings.length || 5} ratings
                          </Typography>
                          {Array(3)
                            .fill()
                            .map((_, i) => (
                              <Star
                                key={i}
                                sx={{
                                  color: "rgb(255, 164, 27)",
                                  fontSize: 14,
                                }}
                              />
                            ))
                            .concat(
                              Array(5 - 3)
                                .fill()
                                .map((_, i) => (
                                  <StarOutline
                                    key={i}
                                    sx={{
                                      color: "rgb(255, 164, 27)",
                                      fontSize: 14,
                                    }}
                                  />
                                ))
                            )}
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                  <Box sx={{ mt: 5 }}>
                    <Typography
                      variant="h6"
                      sx={{ fontSize: 30, fontWeight: 700, color: "#001920" }}
                    >
                      Overview
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ fontSize: 16, color: "#001920", mt: 1 }}
                    >
                      {renderHTML(content.theory)}
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 5 }}>
                    <Typography
                      variant="h6"
                      sx={{ fontSize: 30, fontWeight: 700, color: "#001920" }}
                    >
                      Reviews
                    </Typography>
                    {Object.keys(content.ratings).length ? (
                      content.ratings.map((review, i) => (
                        <Box
                          sx={{
                            bgcolor: "#fff",
                            borderRadius: 2,
                            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                            p: 3,
                            mt: 2,
                            display: "flex",
                            gap: 3,
                          }}
                          key={i}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Avatar
                              src={
                                review.userImage
                                  ? review.userImage
                                  : "/avatar.png"
                              }
                              sx={{
                                bgcolor: "transparent",
                                fontSize: 50,
                                mb: 1,
                              }}
                            />
                            <Typography
                              sx={{
                                fontWeight: 500,
                                fontSize: 14,
                                paddingBottom: 1,
                                color: "gray",
                                minWidth: 100,
                                textAlign: "center",
                              }}
                            >
                              {moment(
                                review.createdAt.seconds * 1000
                              ).fromNow()}
                            </Typography>
                          </Box>
                          <Box>
                            <Box
                              display={"flex"}
                              alignItems={"center"}
                              gap={1}
                              sx={{ cursor: "pointer", my: 2 }}
                            >
                              {Array(parseInt(review.rating))
                                .fill()
                                .map((_, i) => (
                                  <Star
                                    key={i}
                                    sx={{
                                      color: "rgb(255, 164, 27)",
                                      fontSize: 14,
                                    }}
                                  />
                                ))
                                .concat(
                                  Array(5 - parseInt(review.rating))
                                    .fill()
                                    .map((_, i) => (
                                      <StarOutline
                                        key={i}
                                        sx={{
                                          color: "rgb(255, 164, 27)",
                                          fontSize: 14,
                                        }}
                                      />
                                    ))
                                )}
                            </Box>
                            <Typography variant="body1">
                              {review.feedback}
                            </Typography>
                          </Box>
                        </Box>
                      ))
                    ) : (
                      <Typography mt={1}>No reviews available</Typography>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12} lg={4}>
                  <Box
                    sx={{
                      bgcolor: "#fff",
                      p: 3,
                      borderRadius: 3,
                      mt: 5,
                      boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 0.5,
                        fontSize: 18,
                        fontWeight: 700,
                        color: "#001920",
                      }}
                    >
                      Course Pricing
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 0.5,
                        fontSize: 36,
                        fontWeight: 700,
                        color: "#FF3158",
                      }}
                    >
                      {content.price ? `Rs. ${content.price}` : "Free"}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 2,
                        fontSize: 22,
                        fontWeight: 700,
                        color: "#001920",
                      }}
                    >
                      Course Features
                    </Typography>
                    <List>
                      {[
                        "Detailed Explanation",
                        "PDF Material",
                        "Quiz Practice",
                        "Youtube Tutorials",
                      ].map((item, i) => (
                        <ListItem key={i}>
                          <ListItemIcon>
                            <CheckCircleOutlineOutlined sx={{ color: "red" }} />
                          </ListItemIcon>
                          <ListItemText primary={item} />
                        </ListItem>
                      ))}
                    </List>
                    <Box display={"flex"} justifyContent={"center"}>
                      <Link
                        style={{ textDecoration: "none" }}
                        href={
                          isUserLoggedIn
                            ? `/courses/checkout?id=${courseId}`
                            : "/auth?redirect=/courses/checkout"
                        }
                      >
                        <Button
                          sx={{
                            bgcolor: "#FF3158",
                            textTransform: "none",
                            color: "#fff",
                            borderRadius: 2,
                            alignSelf: "center",
                            width: 250,
                            "&:hover": {
                              bgcolor: "#FF3158",
                              opacity: 0.8,
                            },
                          }}
                        >
                          Enroll Now
                        </Button>
                      </Link>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            ) : (
              //   JSON.stringify(content, null, 4)
              <Box
                width={"100%"}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                bgcolor={"#ffffff"}
              >
                <Box sx={{ width: { xs: "100%", sm: 400 } }}>
                  <img
                    src="/no_item.jpg"
                    width={"100%"}
                    height={350}
                    style={{ objectFit: "contain", objectPosition: "center" }}
                  />
                  <Typography
                    textAlign={"center"}
                    fontSize={16}
                    my={2}
                    fontWeight={"bold"}
                  >
                    No content available
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
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
    <DetailsPage />
  </Suspense>
);
export default PageWrapper;
