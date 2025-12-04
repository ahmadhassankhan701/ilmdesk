"use client";

import {
  Avatar,
  Backdrop,
  Box,
  Button,
  CardMedia,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Star, StarOutline } from "@mui/icons-material";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, Suspense, useCallback } from "react";
import { toast } from "react-toastify";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/firebase";
import renderHTML from "react-render-html";
import moment from "moment";
import PDFModal from "@/components/Modals/PDFModal";
import QuizList from "@/components/Quiz/QuizList";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { wrapImagesInContainer } from "@/utils/helper";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}
const DetailsPage = () => {
  const searchParam = useSearchParams();
  const topicId = searchParam.get("id");
  const chapterId = searchParam.get("chapterId");
  const route = useRouter();
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    name: "",
    rating: 0,
    feedback: "",
  });
  const [topics, setTopics] = useState([]);
  const [content, setContent] = useState({});
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pdfModal, setPdfModal] = useState(false);
  const [pdfURL, setPdfURL] = useState("");

  useEffect(() => {
    if (topicId) {
      fetchContent();
      fetchReviews();
      fetchQuizList();
    }
  }, [topicId]);
  const theme = useTheme();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const fetchTopics = useCallback(async () => {
    if (!chapterId) {
      route.back();
      return;
    }

    setLoading(true);
    try {
      const topicsRef = collection(db, "topics");

      const topicsQuery = query(topicsRef, where("chapterID", "==", chapterId));

      const topicsSnapshot = await getDocs(topicsQuery);

      // Convert snapshots to arrays

      const topicsArray = topicsSnapshot.docs.map((doc) => ({
        key: doc.id,
        ...doc.data(),
      }));

      // Structure the data
      const structuredData = topicsArray
        .filter((topic) => topic.key !== topicId)
        .sort((a, b) => a.createdAt - b.createdAt);

      setTopics(structuredData);
    } catch (error) {
      console.error("Error fetching chapters and topics:", error);
    } finally {
      setLoading(false);
    }
  }, [chapterId, route]);
  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);
  const fetchReviews = async () => {
    try {
      const docRef = doc(db, "Reviews", topicId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setReviews(docSnap.data().ratings);
      }
    } catch (error) {
      toast.error("Failed to fetch reviews");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleAddReview = async () => {
    if (
      newReview.name === "" ||
      newReview.rating === 0 ||
      newReview.rating > 5 ||
      newReview.rating < 1 ||
      newReview.feedback === ""
    ) {
      toast.error("Please fill all the fields properly");
      return;
    }
    try {
      setLoading(true);
      const reviewRef = doc(db, "Reviews", topicId);
      const docRef = await getDoc(reviewRef);
      if (docRef.exists()) {
        await updateDoc(reviewRef, {
          ...docRef.data(),
          ratings: [
            ...docRef.data().ratings,
            {
              name: newReview.name,
              rating: newReview.rating,
              feedback: newReview.feedback,
              createdAt: new Date(),
            },
          ],
        });
      } else {
        await setDoc(reviewRef, {
          ratings: [
            {
              name: newReview.name,
              rating: newReview.rating,
              feedback: newReview.feedback,
              createdAt: new Date(),
            },
          ],
        });
      }
      fetchReviews();
      toast.success("Review added successfully");
      setNewReview({
        name: "",
        rating: 0,
        feedback: "",
      });
    } catch (error) {
      console.log(error);
      toast.error("Review could not be added");
    } finally {
      setLoading(false);
    }
  };

  const youtubeVideos = useMemo(() => content.youtubeLinks || [], [content]);

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
        <Box sx={{ width: "100%" }}>
          <AppBar position="static">
            <Tabs
              value={value}
              onChange={(evt, val) => setValue(val)}
              indicatorColor="secondary"
              textColor="inherit"
              aria-label="full width tabs example"
              sx={{ bgcolor: "#002935" }}
              variant="scrollable"
              scrollButtons={false}
            >
              <Tab label="Theory" {...a11yProps(0)} />
              <Tab label="Files" {...a11yProps(1)} />
              <Tab label="Videos" {...a11yProps(2)} />
              <Tab label="Quizzes" {...a11yProps(3)} />
            </Tabs>
          </AppBar>
          {Object.keys(content).length > 0 ? (
            <Box>
              <TabPanel value={value} index={0}>
                {content?.theory ? (
                  <Box mt={0}>
                    <Typography fontSize={35} fontWeight={700} color="#001920">
                      Overview
                    </Typography>
                    <Box mt={2}>
                      {renderHTML(wrapImagesInContainer(content.theory))}
                    </Box>
                    <Box mt={5}>
                      <Typography
                        fontSize={35}
                        fontWeight={700}
                        color="#001920"
                      >
                        Reviews
                      </Typography>
                      {reviews.length > 0 ? (
                        reviews.map((review, i) => (
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
                                {moment(
                                  review.createdAt.seconds * 1000
                                ).fromNow()}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography
                                fontSize={20}
                                fontWeight={"bold"}
                                color="black"
                              >
                                {review.name}
                              </Typography>
                              <Box
                                display="flex"
                                alignItems="center"
                                gap={1}
                                my={1}
                              >
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
                              <Typography
                                fontSize={14}
                                color="grey"
                                fontWeight={"regular"}
                              >
                                {review.feedback}
                              </Typography>
                            </Box>
                          </Box>
                        ))
                      ) : (
                        <Typography mt={2}>No reviews available</Typography>
                      )}
                    </Box>
                  </Box>
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
                    </Box>
                  </Box>
                )}
              </TabPanel>
              <TabPanel value={value} index={1}>
                {content.pdfs?.length > 0 ? (
                  <Box>
                    <Box>
                      <Grid container spacing={1}>
                        {content.pdfs.map((file, i) => (
                          <Grid key={i} size={{ xs: 12, md: 6, lg: 4 }}>
                            <Box
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
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  </Box>
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
                    </Box>
                  </Box>
                )}
              </TabPanel>
              <TabPanel value={value} index={2} dir={theme.direction}>
                {youtubeVideos.length > 0 ? (
                  <Box>
                    <Grid container spacing={2} sx={{ padding: 1, mb: 1 }}>
                      {youtubeVideos.map((item, index) => (
                        <Grid
                          size={{ xs: 12, md: 6, lg: 4 }}
                          key={`quest-${index}`}
                        >
                          <Box
                            sx={{
                              bgcolor: "transparent",
                              border: "none",
                            }}
                          >
                            <CardMedia
                              component="iframe"
                              title={`YouTube Video ${index + 1}`}
                              src={`https://www.youtube.com/embed/${item}`}
                              height={250}
                              allowFullScreen
                              sx={{
                                borderRadius: 5,
                                bgcolor: "transparent",
                                border: "none",
                              }}
                            />
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
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
                    </Box>
                  </Box>
                )}
              </TabPanel>
              <TabPanel value={value} index={3} dir={theme.direction}>
                <Box
                  sx={{
                    bgcolor: "#fff",
                    p: 3,
                    borderRadius: 3,
                    mt: 2,
                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                  }}
                >
                  {quizzes?.length > 0 ? (
                    <QuizList type="classes" quizzes={quizzes} />
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
                      </Box>
                    </Box>
                  )}
                </Box>
              </TabPanel>
            </Box>
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
              </Box>
            </Box>
          )}
        </Box>
        <Box my={5}>
          <AppBar position="static">
            <Tabs
              value={0}
              indicatorColor="secondary"
              textColor="inherit"
              aria-label="full width tabs example"
              sx={{ bgcolor: "#002935" }}
              variant="scrollable"
              scrollButtons={false}
            >
              <Tab label="Add Reviews" />
            </Tabs>
          </AppBar>
          <Box mt={2}>
            <Grid
              container
              spacing={2}
              sx={{
                padding: 1,
                mb: 1,
                bgcolor: "#fff",
                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                borderRadius: 3,
                p: 2,
              }}
            >
              <Grid size={{ xs: 12 }}>
                <TextField
                  sx={{
                    width: "100%",
                    mt: 1,
                  }}
                  value={newReview.name}
                  placeholder="Your name"
                  onChange={(e) =>
                    setNewReview({ ...newReview, name: e.target.value })
                  }
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  sx={{
                    width: "100%",
                  }}
                  type="number"
                  helperText={
                    newReview.rating > 5 || newReview.rating < 1
                      ? "Rating should be between 1 and 5"
                      : ""
                  }
                  value={newReview.rating}
                  placeholder="Rating e.g 4"
                  onChange={(e) =>
                    setNewReview({ ...newReview, rating: e.target.value })
                  }
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  sx={{
                    width: "100%",
                  }}
                  multiline
                  rows={4}
                  value={newReview.feedback}
                  placeholder="Feedback"
                  onChange={(e) =>
                    setNewReview({ ...newReview, feedback: e.target.value })
                  }
                />
              </Grid>
              <Button
                variant="contained"
                color="secondary"
                size="small"
                sx={{ fontSize: 14, textTransform: "none" }}
                onClick={handleAddReview}
              >
                Submit
              </Button>
            </Grid>
          </Box>
        </Box>
        <Box>
          <AppBar position="static">
            <Tabs
              value={0}
              indicatorColor="secondary"
              textColor="inherit"
              aria-label="full width tabs example"
              sx={{ bgcolor: "#002935" }}
              variant="scrollable"
              scrollButtons={false}
            >
              <Tab label="Relevant Topics" />
            </Tabs>
          </AppBar>
          {topics.length > 0 ? (
            <Box mt={2}>
              {topics.map((item) => (
                <a
                  href={`/classes/details?id=${item.key}&chapterId=${chapterId}`}
                  style={{ textDecoration: "none" }}
                  key={item.key}
                >
                  <Box
                    sx={{
                      bgcolor: "#fff",
                      borderRadius: 2,
                      boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                      px: 3,
                      py: 1,
                      mt: 2,
                      display: "flex",
                      gap: 3,
                    }}
                  >
                    <Box>
                      <Typography
                        variant="body1"
                        sx={{ fontSize: 16, color: "#000" }}
                      >
                        {item.name}
                      </Typography>
                    </Box>
                  </Box>
                </a>
              ))}
            </Box>
          ) : (
            <Box
              width="100%"
              display="flex"
              justifyContent="center"
              alignItems="center"
              mt={10}
            >
              <Box sx={{ width: 250 }}>
                <img src="/no_item.png" alt="No content" width="100%" />
              </Box>
            </Box>
          )}
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
