"use client";
import { Star, StarOutline } from "@mui/icons-material";
import {
  Avatar,
  Backdrop,
  Box,
  Button,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { toast } from "react-toastify";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/firebase";
import renderHTML from "react-render-html";
import moment from "moment";
import PDFModal from "@/components/Modals/PDFModal";
import QuizList from "@/components/Quiz/QuizList";
const DetailsPage = () => {
  const route = useRouter();
  const searchParam = useSearchParams();
  const topicId = searchParam.get("id");
  const [content, setContent] = useState(null);
  const [quizzes, setQuizzes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pdfModal, setPdfModal] = useState(false);
  const [pdfURL, setPdfURL] = useState("");
  useEffect(() => {
    if (!topicId) {
      route.back();
      return;
    } else {
      fetchContent();
      fetchQuizList();
    }
  }, [topicId]);
  const fetchContent = async () => {
    try {
      const docRef = doc(db, "ClassesTheory", topicId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setContent({ key: docSnap.id, ...docSnap.data() });
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error("Failed to fetch content");
    }
  };
  const fetchQuizList = async () => {
    try {
      setLoading(true);
      const quizzesRef = collection(db, "ClassQuizzes");
      const q = query(quizzesRef, where("topicId", "==", topicId));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.size == 0) {
        setLoading(false);
        return;
      }
      let quizzesData = [];
      querySnapshot.forEach((doc) => {
        quizzesData.push({ key: doc.id, ...doc.data() });
      });
      setQuizzes(quizzesData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <Box display={"flex"} justifyContent={"center"}>
      <PDFModal open={pdfModal} setOpen={setPdfModal} url={pdfURL} />
      <Box sx={{ mx: { xs: 1, lg: 10 } }} mt={10} width={"80%"}>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <img src={"/loader.gif"} />
        </Backdrop>
        {content || quizzes ? (
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Box sx={{ mt: 5 }}>
                <Typography
                  variant="h6"
                  sx={{ fontSize: 30, fontWeight: 700, color: "#001920" }}
                >
                  Overview
                </Typography>
                <Typography
                  variant="div"
                  component={"div"}
                  sx={{ fontSize: 16, color: "#001920", mt: 1 }}
                >
                  {content && content.theory
                    ? renderHTML(content.theory)
                    : "No theory yet"}
                </Typography>
              </Box>
              {content && content.pdfs?.length > 0 && (
                <Box sx={{ mt: 5 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontSize: 30, fontWeight: 700, color: "#001920" }}
                  >
                    Content Files
                  </Typography>
                  <Box>
                    {content.pdfs.map((file, i) => (
                      <Box
                        key={i}
                        sx={{
                          bgcolor: "#fff",
                          borderRadius: 2,
                          boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                          p: 1,
                          mt: 1,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Box>
                          <Typography
                            variant="body1"
                            sx={{ fontSize: 16, color: "red" }}
                          >
                            {file.name}
                          </Typography>
                        </Box>
                        <Box
                          display={"flex"}
                          alignItems={"center"}
                          justifyContent={"center"}
                          gap={1}
                        >
                          <Button
                            variant="contained"
                            color="secondary"
                            size="small"
                            sx={{ fontSize: 14, textTransform: "none" }}
                            onClick={() => {
                              setPdfURL(file?.fileUrl);
                              setPdfModal(true);
                            }}
                          >
                            Read
                          </Button>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
              {content && content.youtubeLinks?.length > 0 && (
                <Box sx={{ mt: 5 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontSize: 30, fontWeight: 700, color: "#001920" }}
                  >
                    Youtube Videos
                  </Typography>
                  <Box>
                    <Grid container spacing={1} sx={{ padding: 1, mb: 1 }}>
                      {content.youtubeLinks.map((item, index) => (
                        <Grid item xs={12} sm={6} key={`quest-${index}`}>
                          <Box
                            sx={{
                              bgcolor: "#fff",
                              borderRadius: 2,
                              boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                              p: 1,
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <CardMedia
                              component="iframe"
                              title={`YouTube Video ${index + 1}`}
                              src={`https://www.youtube.com/embed/${item}`}
                              height={250}
                              allowFullScreen
                            />
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Box>
              )}
              <Box sx={{ mt: 5 }}>
                <Typography
                  variant="h6"
                  sx={{ fontSize: 30, fontWeight: 700, color: "#001920" }}
                >
                  Reviews
                </Typography>
                {content && content.ratings?.length > 0 ? (
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
                            review.userImage ? review.userImage : "/avatar.png"
                          }
                          sx={{ bgcolor: "transparent", fontSize: 50, mb: 1 }}
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
                          {moment(review.createdAt.seconds * 1000).fromNow()}
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
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  bgcolor: "#fff",
                  p: 3,
                  borderRadius: 3,
                  mt: 2,
                  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    fontSize: 22,
                    fontWeight: 700,
                    color: "#001920",
                  }}
                >
                  Free Quizzes
                </Typography>
                {quizzes ? (
                  <QuizList type={"classes"} quizzes={quizzes} />
                ) : (
                  <Typography>No quizzes available</Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        ) : (
          <Box
            width={"100%"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            mt={10}
          >
            <Box sx={{ width: 400 }}>
              <img src="/no_item.png" width={"100%"} height={"auto"} />
              <Typography
                textAlign={"center"}
                fontSize={16}
                my={2}
                fontWeight={"bold"}
              >
                No content available yet
              </Typography>
            </Box>
          </Box>
        )}
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
