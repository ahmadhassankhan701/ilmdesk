"use client";
import { Star, StarOutline } from "@mui/icons-material";
import PropTypes from "prop-types";
import {
  AppBar,
  Avatar,
  Backdrop,
  Box,
  Button,
  CardMedia,
  Typography,
  Tabs,
  Tab,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
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
import QuizList from "@/components/Quiz/QuizList";
import PDFCourseModal from "@/components/Modals/PDFCourseModal";
import { useAuth } from "@/context/AuthContext";

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
const ContentPage = () => {
  const { state } = useAuth();
  const route = useRouter();
  const theme = useTheme();
  const searchParam = useSearchParams();
  const courseId = searchParam.get("id");
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [content, setContent] = useState(null);
  const [quizzes, setQuizzes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pdfModal, setPdfModal] = useState(false);
  const [pdfURL, setPdfURL] = useState("");
  const userId = state && state.user ? state.user.uid : 0;
  useEffect(() => {
    if (!courseId) {
      route.back();
    } else {
      checkIfEnrolled();
      fetchContent();
      fetchQuizList();
    }
  }, [courseId]);
  const checkIfEnrolled = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, "CourseTheory", courseId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const students = docSnap.data().students;
        if (students.includes(userId) === false) route.push("/courses");
      } else {
        route.back();
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error("Failed to fetch enrolled user");
    }
  };
  const fetchContent = async () => {
    try {
      const docRef = doc(db, "CourseTheory", courseId);
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
      const quizzesRef = collection(db, "CourseQuizzes");
      const q = query(quizzesRef, where("courseId", "==", courseId));
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
      <PDFCourseModal open={pdfModal} setOpen={setPdfModal} url={pdfURL} />
      <Box
        sx={{ mx: { xs: 1, lg: 10 }, width: { xs: "95%", lg: "80%" } }}
        mt={10}
      >
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <img src={"/loader.gif"} />
        </Backdrop>
        <Box>
          <AppBar position="static">
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="secondary"
              textColor="inherit"
              aria-label="full width tabs example"
              sx={{ bgcolor: "#002935" }}
              centered
              variant="scrollable"
              scrollButtons={false}
            >
              <Tab label="Theory" {...a11yProps(0)} />
              <Tab label="Files" {...a11yProps(1)} />
              <Tab label="Videos" {...a11yProps(2)} />
              <Tab label="Quizzes" {...a11yProps(3)} />
            </Tabs>
          </AppBar>
          <TabPanel value={value} index={0} dir={theme.direction}>
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
            </Box>
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            {content && content.pdfs?.length > 0 ? (
              <Box sx={{ mt: 5 }}>
                <Typography
                  variant="h6"
                  sx={{ fontSize: 30, fontWeight: 700, color: "#001920" }}
                >
                  Content Files
                </Typography>
                <Box>
                  <Grid container>
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
                width={"100%"}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                mt={10}
              >
                <Box sx={{ width: 400 }}>
                  <img src="/no_item.png" width={"100%"} height={"auto"} />
                </Box>
              </Box>
            )}
          </TabPanel>
          <TabPanel value={value} index={2} dir={theme.direction}>
            {content && content.youtubeLinks?.length > 0 ? (
              <Box sx={{ mt: 5 }}>
                <Typography
                  variant="h6"
                  sx={{ fontSize: 30, fontWeight: 700, color: "#001920" }}
                >
                  Youtube Videos
                </Typography>
                <Box>
                  <Grid container spacing={2} sx={{ padding: 1, mb: 1 }}>
                    {content.youtubeLinks.map((item, index) => (
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
              </Box>
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
                </Box>
              </Box>
            )}
          </TabPanel>
          <TabPanel value={value} index={3} dir={theme.direction}>
            <Grid>
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
                  <QuizList type={"courses"} quizzes={quizzes} />
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
                    </Box>
                  </Box>
                )}
              </Box>
            </Grid>
          </TabPanel>
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
    <ContentPage />
  </Suspense>
);
export default PageWrapper;
