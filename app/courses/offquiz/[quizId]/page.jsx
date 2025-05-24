"use client";
import { db } from "@/firebase";
import renderHTML from "react-render-html";
import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Skeleton,
  Typography,
} from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
const QUESTIONS_PER_PAGE = 10;
const page = ({ params }) => {
  const route = useRouter();
  const { quizId } = params;
  const [quiz, setQuiz] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!quizId) {
        route.back();
        return;
      }
      setLoading(true);
      const docRef = doc(db, `CourseQuizzes/${quizId}`);
      const docSnap = await getDoc(docRef);
      let items = [];
      if (docSnap.exists()) {
        items = {
          key: docSnap.id,
          ...docSnap.data(),
        };
      }
      setQuiz(items);
      setLoading(false);
    };
    fetchQuiz();
  }, [quizId]);

  const quizLength = quiz.questions?.length || 0;
  const handleOptionSelect = (questionId, optionIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: optionIndex,
    });
  };

  const currentQuestions = quiz?.questions?.slice(
    (page - 1) * QUESTIONS_PER_PAGE,
    page * QUESTIONS_PER_PAGE
  );
  return (
    <Box mt={15}>
      {loading ? (
        // Show Skeleton while loading
        <Box display={"flex"} justifyContent={"center"}>
          <Box sx={{ mx: { xs: 0, sm: 10 } }} width={"80%"}>
            <Grid container spacing={2}>
              {[...Array(3)].map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card key={index} sx={{ mb: 2 }}>
                    <CardContent>
                      <Skeleton
                        variant="rectangular"
                        width={"100%"}
                        height={118}
                      />
                      <Skeleton variant="text" width={"80%"} height={30} />
                      <Skeleton variant="text" width={"80%"} height={30} />
                      <Skeleton variant="text" width={"50%"} height={30} />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      ) : quiz.length === 0 ? (
        <Box
          width={"100%"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          mt={15}
        >
          <Box sx={{ width: 400 }}>
            <img src="/no_item.png" width={"100%"} height={"auto"} />
            <Typography
              textAlign={"center"}
              fontSize={16}
              my={2}
              fontWeight={"bold"}
            >
              No quiz available yet
            </Typography>
          </Box>
        </Box>
      ) : (
        <Container mt={5}>
          <Box mt={5}>
            {quiz.questions ? (
              <Box
                sx={{
                  boxShadow: "0 0 10px 0 rgba(0,0,0,0.1)",
                  pb: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    border: "none",
                    boxShadow: "0 0 10px 0 rgba(0,0,0,0.1)",
                    padding: 2,
                    bgcolor: "rgb(245, 3, 102)",
                  }}
                >
                  <Typography variant="body1" component="div" color={"#fff"}>
                    {quiz.quizTitle}
                  </Typography>
                  <Typography variant="body1" component="div" color={"#fff"}>
                    Total Questions: {quizLength}
                  </Typography>
                </Box>
                {currentQuestions.map((q, index) => {
                  const globalIndex = (page - 1) * QUESTIONS_PER_PAGE + index; // Ensure a unique index across pages
                  return (
                    <Box key={globalIndex}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          padding: 2,
                        }}
                      >
                        <Typography variant="h5" component="div">
                          {globalIndex + 1}.{" "}
                        </Typography>
                        <Typography variant="body1" component="div">
                          {q.question}
                        </Typography>
                      </Box>
                      <Box>
                        {q.options.map((option, idx) => {
                          const isSelected =
                            selectedAnswers[globalIndex] === idx;
                          const isCorrect = q.correctOption === idx;
                          return (
                            <Box
                              key={idx}
                              sx={[
                                {
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 2,
                                  boxShadow: "0 0 10px 0 rgba(0,0,0,0.1)",
                                  margin: 2,
                                  padding: 1,
                                  borderRadius: 2,
                                  my: 2,
                                  cursor: "pointer",
                                  border: `2px solid ${
                                    isSelected
                                      ? isCorrect
                                        ? "green"
                                        : "red"
                                      : "none"
                                  }`,
                                  backgroundColor:
                                    isCorrect && isSelected ? "lightgreen" : "",
                                },
                              ]}
                              onClick={() =>
                                handleOptionSelect(globalIndex, idx)
                              }
                            >
                              <Avatar>{idx + 1}</Avatar>
                              <Typography variant="body1" component="div">
                                {option}
                              </Typography>
                            </Box>
                          );
                        })}
                      </Box>
                      {selectedAnswers[globalIndex] !== undefined &&
                        q.explanation !== "" && (
                          <Box
                            sx={{
                              margin: 2,
                              padding: 1,
                              my: 2,
                            }}
                          >
                            <Accordion
                              sx={{
                                boxShadow: "0 0 10px 0 rgba(0,0,0,0.1)",
                                borderRadius: 2,
                              }}
                            >
                              <AccordionSummary
                                expandIcon={<ExpandMore />}
                                aria-controls="panel2-content"
                                id="panel2-header"
                              >
                                Explanation
                              </AccordionSummary>
                              <AccordionDetails>
                                {renderHTML(q.explanation)}
                              </AccordionDetails>
                            </Accordion>
                          </Box>
                        )}
                    </Box>
                  );
                })}
                <Pagination
                  count={Math.ceil(quizLength / QUESTIONS_PER_PAGE)}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  sx={{ mt: 4, display: "flex", justifyContent: "center" }}
                />
                {/* <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 2,
                  padding: 2,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <Button
                  size="small"
                  variant="contained"
                  color={"secondary"}
                  onClick={() => route.back()}
                >
                  Cancel
                </Button>
                <Button
                  disabled={current === 0}
                  size="small"
                  variant="contained"
                  color={"error"}
                  onClick={() => setCurrent(current - 1)}
                >
                  Previous
                </Button>
                <Button
                  disabled={current === quizLength - 1}
                  size="small"
                  variant="contained"
                  color={"warning"}
                  onClick={() => setCurrent(current + 1)}
                >
                  Next
                </Button>
                <FormControl fullWidth sx={{ width: 150 }}>
                  <InputLabel id="demo-simple-select-label">
                    Go to question
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={current + 1}
                    label="Go to question"
                    onChange={(e) => setCurrent(parseInt(e.target.value) - 1)}
                  >
                    {quiz.questions.map((item, i) => (
                      <MenuItem key={i} value={i + 1}>
                        {i + 1}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box> */}
              </Box>
            ) : (
              <Box
                width={"100%"}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                bgcolor={"#ffffff"}
              >
                <Box sx={{ width: 400 }}>
                  <img src="/no_item.jpg" width={"100%"} height={350} />
                  <Typography
                    textAlign={"center"}
                    fontSize={16}
                    my={2}
                    fontWeight={"bold"}
                  >
                    No quiz available
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Container>
      )}
    </Box>
  );
};

export default page;
