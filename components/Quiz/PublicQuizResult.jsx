"use client";
import { AccessAlarmOutlined } from "@mui/icons-material";
import { Avatar, Box, Button, Grid, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import QuizFinalResult from "@/components/Quiz/QuizFinalResult";
import renderHTML from "react-render-html";

const PublicQuizResult = ({
  quizDuration = "",
  quizQuestions = [],
  quizTitle = "",
  quizSummary = [],
}) => {
  const route = useRouter();
  const [quiz, setQuiz] = useState({
    duration: "",
    questions: [],
    quizTitle: "",
  });
  const [summary, setSummary] = useState([]);
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    setQuiz({
      ...quiz,
      duration: quizDuration,
      questions: quizQuestions,
      quizTitle: quizTitle,
    });
    setSummary(quizSummary);
  }, [quizTitle]);

  const quizLength = quiz.questions?.length || 0;
  function normalizeText(text) {
    if (typeof text === "number") {
      text = text.toString(); // Convert numbers to strings
    }

    if (typeof text !== "string") {
      console.error("Invalid text to normalizeText:", text); // Log invalid text for debugging
      return ""; // Return an empty string or handle the error appropriately
    }

    let normalizedText = text.replace(/\s+/g, " ").trim(); // Normalize spaces
    return normalizedText;
  }
  return (
    <Box>
      <Box>
        {quiz &&
        quiz.questions.length &&
        summary.summary &&
        summary.summary.length ? (
          <Grid container spacing={2}>
            <Grid item xs={12} md={5}>
              <Box>
                <QuizFinalResult
                  result={summary.result}
                  studentName={summary.studentName}
                  length={quizLength}
                  duration={quiz.duration}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={7}>
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
                  <Typography
                    variant="body1"
                    component="div"
                    color={"#fff"}
                    sx={{ fontSize: { xs: 12, sm: 16 } }}
                  >
                    {quiz.quizTitle}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <AccessAlarmOutlined sx={{ color: "#fff" }} />
                    <Typography
                      variant="body1"
                      component="div"
                      color={"#fff"}
                      sx={{ fontSize: { xs: 12, sm: 16 } }}
                    >
                      {quiz.duration + "mins"}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body1"
                    component="div"
                    color={"#fff"}
                    sx={{ fontSize: { xs: 12, sm: 16 } }}
                  >
                    {summary.result.attempted} / {quizLength}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    padding: 2,
                  }}
                >
                  <Typography variant="h5" component="div">
                    {current + 1}
                  </Typography>
                  <Typography variant="body1" component="div">
                    {quiz.questions[current].title}
                  </Typography>
                </Box>
                <Box>
                  <Box
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
                      },
                      normalizeText(quiz.questions[current].option1) ===
                      normalizeText(quiz.questions[current].correctOption)
                        ? summary.summary[current].selectedOption === ""
                          ? { border: "2px solid gray" }
                          : { border: "2px solid green" }
                        : normalizeText(
                            summary.summary[current].selectedOption
                          ) === normalizeText(quiz.questions[current].option1)
                        ? { border: "2px solid red" }
                        : { border: "none" },
                    ]}
                  >
                    <Avatar>A</Avatar>
                    <Typography variant="body1" component="div">
                      {quiz.questions[current].option1}
                    </Typography>
                  </Box>
                  <Box
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
                      },
                      normalizeText(quiz.questions[current].option2) ===
                      normalizeText(quiz.questions[current].correctOption)
                        ? summary.summary[current].selectedOption === ""
                          ? { border: "2px solid gray" }
                          : { border: "2px solid green" }
                        : normalizeText(
                            summary.summary[current].selectedOption
                          ) === normalizeText(quiz.questions[current].option2)
                        ? { border: "2px solid red" }
                        : { border: "none" },
                    ]}
                  >
                    <Avatar>B</Avatar>
                    <Typography variant="body1" component="div">
                      {quiz.questions[current].option2}
                    </Typography>
                  </Box>
                  <Box
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
                      },
                      normalizeText(quiz.questions[current].option3) ===
                      normalizeText(quiz.questions[current].correctOption)
                        ? summary.summary[current].selectedOption === ""
                          ? { border: "2px solid gray" }
                          : { border: "2px solid green" }
                        : normalizeText(
                            summary.summary[current].selectedOption
                          ) === normalizeText(quiz.questions[current].option3)
                        ? { border: "2px solid red" }
                        : { border: "none" },
                    ]}
                  >
                    <Avatar>C</Avatar>
                    <Typography variant="body1" component="div">
                      {quiz.questions[current].option3}
                    </Typography>
                  </Box>
                  <Box
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
                      },
                      normalizeText(quiz.questions[current].option4) ===
                      normalizeText(quiz.questions[current].correctOption)
                        ? summary.summary[current].selectedOption === ""
                          ? { border: "2px solid gray" }
                          : { border: "2px solid green" }
                        : normalizeText(
                            summary.summary[current].selectedOption
                          ) === normalizeText(quiz.questions[current].option4)
                        ? { border: "2px solid red" }
                        : { border: "none" },
                    ]}
                  >
                    <Avatar>D</Avatar>
                    <Typography variant="body1" component="div">
                      {quiz.questions[current].option4}
                    </Typography>
                  </Box>
                </Box>
                <Box ml={2}>
                  <Typography
                    sx={{
                      fontSize: 16,
                      fontWeight: "800",
                      color: "red",
                    }}
                  >
                    Explanation
                  </Typography>
                  <Typography>
                    {renderHTML(quiz.questions[current].explanation)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 2,
                    padding: 2,
                    alignItems: "center",
                  }}
                >
                  <Button
                    disabled={current === 0}
                    size="small"
                    variant="contained"
                    sx={{ textTransform: "none" }}
                    color={"error"}
                    onClick={() => setCurrent(current - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color={"warning"}
                    sx={{ textTransform: "none" }}
                    disabled={current === quizLength - 1}
                    onClick={() => setCurrent(current + 1)}
                  >
                    Next
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    sx={{ textTransform: "none" }}
                    color={"secondary"}
                    onClick={() => route.back()}
                  >
                    Take More
                  </Button>
                </Box>
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
              <img src="/nodata.png" width={"100%"} height={350} />
              <Typography
                textAlign={"center"}
                fontSize={20}
                my={2}
                fontWeight={"bold"}
                letterSpacing={0.3}
              >
                No summary available
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PublicQuizResult;
