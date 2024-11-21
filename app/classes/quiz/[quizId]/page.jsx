"use client";
import { db } from "@/firebase";
import { AccessAlarmOutlined, NavigateNext } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Container,
  Typography,
} from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import renderHTML from "react-render-html";
ChartJS.register(ArcElement, Tooltip, Legend);
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins} mins : ${secs} secs`;
}

const page = ({ params }) => {
  const route = useRouter();
  const { quizId } = params;
  const [quiz, setQuiz] = useState([]);
  const [attemptedQuestions, setAttemptedQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [quizStart, setQuizStart] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [current, setCurrent] = useState(0);
  const [result, setResult] = useState({
    score: 0,
    percentage: 0,
  });
  useEffect(() => {
    const fetchQuiz = async () => {
      if (!quizId) {
        route.back();
        return;
      }
      const docRef = doc(db, `Quiz/${quizId}`);
      const docSnap = await getDoc(docRef);
      let items = [];
      if (docSnap.exists()) {
        items = {
          key: docSnap.id,
          ...docSnap.data(),
        };
      }
      setQuiz(items);
    };
    fetchQuiz();
  }, []);
  useEffect(() => {
    let timer;
    if (timeLeft === 0) {
      // Time's up, handle it here
      handleSubmit();
      clearInterval(timer);
      return;
    }

    timer = setInterval(() => {
      setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
    }, 1000);

    // Clear interval when component unmounts or time runs out
    return () => clearInterval(timer);
  }, [timeLeft]);

  const quizLength = quiz.questions?.length || 0;
  const handleAnswer = (answer, id) => {
    const alreadyAttempted = attemptedQuestions.includes(id);
    if (alreadyAttempted) {
      const attAnswers = [...answers];
      attAnswers.map((item) => {
        if (item.id === id) {
          item.answer = answer;
        }
      });
      setAnswers(attAnswers);
    } else {
      setAttemptedQuestions([...attemptedQuestions, id]);
      setAnswers([...answers, { answer, id }]);
    }
  };
  const handleSubmit = () => {
    let scores = 0;
    // Iterate over user's answers
    answers.forEach((userAnswer) => {
      // Find the corresponding question by id
      let question = quiz.questions.find((q) => q.id === userAnswer.id);

      if (question) {
        // Compare the user's answer with the correct answer
        if (userAnswer.answer === question.correctOption) {
          scores++; // Increment score if the answer is correct
        }
      }
    });
    const percentage = (scores / quizLength) * 100;
    setResult({ ...result, percentage: percentage.toFixed(2), score: scores });
    setTimeLeft(0);
    setQuizStart(false);
  };
  return (
    <Box>
      <Container mt={5}>
        <Box mt={15}>
          {quiz ? (
            quizStart ? (
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
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <AccessAlarmOutlined sx={{ color: "#fff" }} />
                    <Typography variant="body1" component="div" color={"#fff"}>
                      {formatTime(timeLeft)}
                    </Typography>
                  </Box>
                  <Typography variant="body1" component="div" color={"#fff"}>
                    {(attemptedQuestions && attemptedQuestions.length) || 0} /{" "}
                    {quizLength}
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
                      },
                      attemptedQuestions.includes(quiz.questions[current].id)
                        ? answers.filter(
                            (item) =>
                              item.answer === quiz.questions[current].option1
                          )?.length > 0
                          ? { border: "2px solid gray" }
                          : { border: "none" }
                        : { border: "none" },
                    ]}
                    onClick={() =>
                      handleAnswer(
                        quiz.questions[current].option1,
                        quiz.questions[current].id
                      )
                    }
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
                      },
                      attemptedQuestions.includes(quiz.questions[current].id)
                        ? answers.filter(
                            (item) =>
                              item.answer === quiz.questions[current].option2
                          )?.length > 0
                          ? { border: "2px solid gray" }
                          : { border: "none" }
                        : { border: "none" },
                    ]}
                    onClick={() =>
                      handleAnswer(
                        quiz.questions[current].option2,
                        quiz.questions[current].id
                      )
                    }
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
                      },
                      attemptedQuestions.includes(quiz.questions[current].id)
                        ? answers.filter(
                            (item) =>
                              item.answer === quiz.questions[current].option3
                          )?.length > 0
                          ? { border: "2px solid gray" }
                          : { border: "none" }
                        : { border: "none" },
                    ]}
                    onClick={() =>
                      handleAnswer(
                        quiz.questions[current].option3,
                        quiz.questions[current].id
                      )
                    }
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
                      },
                      attemptedQuestions.includes(quiz.questions[current].id)
                        ? answers.filter(
                            (item) =>
                              item.answer === quiz.questions[current].option4
                          )?.length > 0
                          ? { border: "2px solid gray" }
                          : { border: "none" }
                        : { border: "none" },
                    ]}
                    onClick={() =>
                      handleAnswer(
                        quiz.questions[current].option4,
                        quiz.questions[current].id
                      )
                    }
                  >
                    <Avatar>D</Avatar>
                    <Typography variant="body1" component="div">
                      {quiz.questions[current].option4}
                    </Typography>
                  </Box>
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
                  {attemptedQuestions.length == quizLength && (
                    <Button
                      onClick={handleSubmit}
                      size="small"
                      variant="contained"
                      color={"success"}
                    >
                      Submit
                    </Button>
                  )}
                </Box>
              </Box>
            ) : result.percentage !== 0 ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    borderRadius: 2,
                    border: "none",
                    padding: 1,
                    margin: 1,
                    bgcolor: "#fff",
                    boxShadow: "0 0 10px 0 rgba(0,0,0,0.1)",
                    width: { xs: "100%", sm: "50%", md: "40%" },
                  }}
                >
                  <Typography
                    variant="h5"
                    component="div"
                    color={"red"}
                    textAlign={"center"}
                  >
                    {quiz.quizTitle}
                  </Typography>
                  <Doughnut
                    data={{
                      labels: ["Correct", "Wrong"],
                      datasets: [
                        {
                          label: "Quiz Result",
                          data: [result.score, quizLength - result.score],
                          backgroundColor: ["rgb(0, 162, 0)", "rgb(255, 0, 0)"],
                          hoverOffset: 4,
                        },
                      ],
                    }}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      mt: 2,
                    }}
                  >
                    <Typography color="text.secondary">
                      Your Score: {result.score} / {quizLength}
                    </Typography>
                    <Typography color="text.secondary">
                      Percentage: {result.percentage}%
                    </Typography>
                    <Typography color="text.secondary">
                      Remarks: {result.percentage > 50 ? "Pass" : "Fail"}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      flexWrap: "wrap",
                      mt: 2,
                    }}
                  >
                    <Typography color="text.secondary">Summary</Typography>
                    <Box>
                      {attemptedQuestions.map((item, i) => (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            flexWrap: "wrap",
                            mt: 2,
                            bgcolor: "#f9f9f9",
                            padding: 1,
                            borderRadius: 2,
                          }}
                          key={i}
                        >
                          <Typography color="text.secondary">
                            Question {i + 1}: {quiz.questions[i].title}
                          </Typography>
                          <Box>
                            <Typography color="text.secondary">
                              Your Answer:{" "}
                              {answers.find((ans) => ans.id === item).answer}
                            </Typography>
                            <Typography color="text.secondary">
                              Correct Answer: {quiz.questions[i].correctOption}
                            </Typography>
                            <Typography color="text.secondary">
                              Explaination:{" "}
                              {renderHTML(quiz.questions[i].explanation)}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                  <Box mt={2}>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        bgcolor: "rgb(245, 3, 102)",
                        color: "#fff",
                        "&:hover": {
                          bgcolor: "rgb(245, 3, 102)",
                        },
                      }}
                      onClick={() => route.back()}
                    >
                      Take More
                    </Button>
                  </Box>
                </Box>
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    borderRadius: 2,
                    border: "none",
                    padding: 1,
                    margin: 1,
                    bgcolor: "#fff",
                    boxShadow: "0 0 10px 0 rgba(0,0,0,0.1)",
                    width: { xs: "100%", sm: "40%" },
                  }}
                >
                  <Typography
                    variant="h5"
                    component="div"
                    color={"red"}
                    textAlign={"center"}
                  >
                    {quiz.quizTitle}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{
                        color: "#fff",
                        bgcolor: "rgb(255, 49, 88)",
                        alignSelf: "center",
                        my: 2,
                        "&:hover": {
                          bgcolor: "rgb(255, 49, 88)",
                        },
                      }}
                      onClick={() => {
                        setQuizStart(true);
                        setTimeLeft(parseInt(quiz.duration * 60));
                      }}
                      disabled={quizLength === 0}
                    >
                      Start
                    </Button>
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{
                        color: "#fff",
                        bgcolor: "red",
                        alignSelf: "center",
                        mb: { xs: 0, sm: 1 },
                        "&:hover": {
                          bgcolor: "red",
                        },
                      }}
                      onClick={() => route.back()}
                    >
                      Cancel
                    </Button>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography color="text.secondary">
                      Mode: {quiz.mode}
                    </Typography>
                    <Typography color="text.secondary">
                      Duration: {quiz.duration}mins
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )
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
                  No quiz found
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default page;
