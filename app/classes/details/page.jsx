"use client";

import {
  Avatar,
  Backdrop,
  Box,
  Button,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import { Star, StarOutline } from "@mui/icons-material";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, Suspense } from "react";
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
  const searchParam = useSearchParams();
  const topicId = searchParam.get("id");
  const [content, setContent] = useState({});
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pdfModal, setPdfModal] = useState(false);
  const [pdfURL, setPdfURL] = useState("");

  useEffect(() => {
    if (topicId) {
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
      toast.error("Failed to fetch content");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizList = async () => {
    try {
      const quizzesRef = collection(db, "ClassQuizzes");
      const q = query(quizzesRef, where("topicId", "==", topicId));
      const querySnapshot = await getDocs(q);
      const quizzesData = querySnapshot.docs.map((doc) => ({
        key: doc.id,
        ...doc.data(),
      }));
      setQuizzes(quizzesData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const youtubeVideos = useMemo(() => content.youtubeLinks || [], [content]);
  const ratings = useMemo(() => content.ratings || [], [content]);

  return (
    <Box display="flex" justifyContent="center">
      <PDFModal open={pdfModal} setOpen={setPdfModal} url={pdfURL} />
      <Box
        sx={{ mx: { xs: 1, lg: 10 }, mt: 10, width: "100%", maxWidth: 1400 }}
      >
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <img src="/loader.gif" alt="Loading..." />
        </Backdrop>

        {Object.keys(content).length > 0 ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Box mt={5}>
                <Typography variant="h4" fontWeight={700} color="#001920">
                  Overview
                </Typography>
                <Box mt={2}>{renderHTML(content.theory)}</Box>
              </Box>

              {content.pdfs?.length > 0 && (
                <Box mt={5}>
                  <Typography variant="h5" fontWeight={700} color="#001920">
                    Content Files
                  </Typography>
                  <Box>
                    {content.pdfs.map((file, i) => (
                      <Box
                        key={i}
                        sx={{
                          bgcolor: "#fff",
                          borderRadius: 2,
                          boxShadow: 1,
                          p: 2,
                          mt: 1,
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography color="red">{file.name}</Typography>
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          sx={{ textTransform: "none" }}
                          onClick={() => {
                            setPdfURL(file.fileUrl);
                            setPdfModal(true);
                          }}
                        >
                          Read
                        </Button>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {youtubeVideos.length > 0 && (
                <Box mt={5}>
                  <Typography variant="h5" fontWeight={700} color="#001920">
                    Youtube Videos
                  </Typography>
                  <Grid container spacing={2} mt={1}>
                    {youtubeVideos.map((item, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Box
                          sx={{
                            bgcolor: "#fff",
                            borderRadius: 2,
                            boxShadow: 1,
                            p: 2,
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
              )}

              <Box mt={5}>
                <Typography variant="h5" fontWeight={700} color="#001920">
                  Reviews
                </Typography>
                {ratings.length > 0 ? (
                  ratings.map((review, i) => (
                    <Box
                      key={i}
                      sx={{
                        bgcolor: "#fff",
                        borderRadius: 2,
                        boxShadow: 1,
                        p: 3,
                        mt: 2,
                        display: "flex",
                        gap: 3,
                      }}
                    >
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                      >
                        <Avatar
                          src={review.userImage || "/avatar.png"}
                          sx={{ mb: 1 }}
                        />
                        <Typography variant="caption" color="gray">
                          {moment(review.createdAt.seconds * 1000).fromNow()}
                        </Typography>
                      </Box>
                      <Box>
                        <Box display="flex" alignItems="center" gap={1} my={1}>
                          {Array.from({ length: 5 }, (_, idx) =>
                            idx < parseInt(review.rating) ? (
                              <Star
                                key={idx}
                                sx={{
                                  color: "rgb(255, 164, 27)",
                                  fontSize: 16,
                                }}
                              />
                            ) : (
                              <StarOutline
                                key={idx}
                                sx={{
                                  color: "rgb(255, 164, 27)",
                                  fontSize: 16,
                                }}
                              />
                            )
                          )}
                        </Box>
                        <Typography>{review.feedback}</Typography>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Typography mt={2}>No reviews available</Typography>
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
                  boxShadow: 1,
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={700}
                  color="#001920"
                  mb={2}
                >
                  Free Quizzes
                </Typography>
                {quizzes?.length > 0 ? (
                  <QuizList type="classes" quizzes={quizzes} />
                ) : (
                  <Typography>No quizzes available</Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        ) : (
          <Box
            width="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            mt={10}
          >
            <Box sx={{ width: 400 }}>
              <img src="/no_item.png" alt="No content" width="100%" />
              <Typography align="center" fontWeight="bold" mt={2}>
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
        open
      >
        <img src="/loader.gif" alt="Loading..." width={100} height={100} />
      </Backdrop>
    }
  >
    <DetailsPage />
  </Suspense>
);

export default PageWrapper;
