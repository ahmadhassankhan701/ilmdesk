"use client";

import {
  Avatar,
  Backdrop,
  Box,
  Button,
  CardMedia,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
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
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

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
  const theme = useTheme();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
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
        <Box sx={{ width: "100%" }}>
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
          {Object.keys(content).length > 0 && (
            <>
              <TabPanel value={value} index={0} dir={theme.direction}>
                {content?.theory ? (
                  <Box mt={5}>
                    <Typography variant="h4" fontWeight={700} color="#001920">
                      Overview
                    </Typography>
                    <Box mt={2}>{renderHTML(content.theory)}</Box>
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
                                {moment(
                                  review.createdAt.seconds * 1000
                                ).fromNow()}
                              </Typography>
                            </Box>
                            <Box>
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
                              <Typography>{review.feedback}</Typography>
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
              <TabPanel value={value} index={1} dir={theme.direction}>
                {content.pdfs?.length > 0 ? (
                  <Box mt={5}>
                    <Typography
                      variant="h6"
                      fontSize={30}
                      fontWeight={700}
                      color="#001920"
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
                  <Box mt={5}>
                    <Typography
                      variant="h6"
                      sx={{ fontSize: 30, fontWeight: 700, color: "#001920" }}
                    >
                      Youtube Videos
                    </Typography>
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
            </>
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
