"use client";
import { db } from "@/firebase";
import { AccessAlarmOutlined } from "@mui/icons-material";
import { Avatar, Box, Button, TextField, Typography } from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PublicQuizResult from "@/components/Quiz/PublicQuizResult";
import { useAuth } from "@/context/AuthContext";

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins} mins : ${secs} secs`;
}

const page = ({ params }) => {
  const route = useRouter();
  const { state } = useAuth();
  const { quizId } = params;
  const loaderImage = "/loader.gif";
  const [quiz, setQuiz] = useState([]);
  const [quizSummary, setQuizSummary] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizStart, setQuizStart] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [current, setCurrent] = useState(0);
  const [result, setResult] = useState({
    score: 0,
    percentage: 0,
  });
  const userName = state && state.user ? state.user.name : "John Doe";
  useEffect(() => {
    const fetchQuiz = async () => {
      if (!quizId) {
        route.back();
        return;
      }
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
    };
    fetchQuiz();
  }, [state && state.user]);
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
  const handleStart = async () => {
    setQuizStart(true);
    setTimeLeft(parseInt(quiz.duration * 60));
  };

  const handleOptionSelect = (index) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [current]: index,
    });
  };

  const handleNext = () => {
    if (current < quizLength - 1) {
      setCurrent(current + 1);
    }
  };

  const handlePrevious = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      let calculatedScore = 0;
      let summaryItems = [];

      quiz.questions.forEach((q, index) => {
        const isCorrect = selectedAnswers[index] === q.correctOption;
        if (isCorrect) calculatedScore++;

        summaryItems.push({
          title: q.question,
          selectedOption:
            selectedAnswers[index] !== undefined
              ? selectedAnswers[index]
              : null,
          correctOption: q.correctOption,
          isCorrect,
        });
      });

      const percentage = (calculatedScore / quizLength) * 100;
      setQuizSummary({
        studentName,
        attempted: Object.keys(selectedAnswers).length,
        correct: calculatedScore,
        incorrect: quizLength - calculatedScore,
        percentage: percentage.toFixed(2),
        summary: summaryItems,
      });
      setResult({
        ...result,
        percentage: percentage.toFixed(2),
        score: calculatedScore,
      });
      setTimeLeft(0);
      setQuizStart(false);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong");
      console.log(error);
    }
  };
  return (
    <Box display={"flex"} justifyContent={"center"}>
      {loading && (
        <Box
          sx={{
            position: "absolute",
            backgroundColor: "#212333",
            opacity: 0.7,
            zIndex: 999,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img src={loaderImage} />
        </Box>
      )}
      <Box sx={{ width: { xs: "95%", md: "80%" } }}>
        <Box mt={5}>
          {quiz ? (
            quizStart ? (
              <Box
                sx={{
                  boxShadow: "0 0 10px 0 rgba(0,0,0,0.1)",
                  pb: 1,
                  mt: 15,
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
                    {Object.keys(selectedAnswers).length || 0} / {quizLength}
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
                    {quiz.questions[current].question}
                  </Typography>
                </Box>
                <Box>
                  {quiz.questions[current].options.map((option, idx) => (
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
                        },
                        selectedAnswers[current] === idx
                          ? { border: "2px solid gray" }
                          : { border: "none" },
                      ]}
                      onClick={() => handleOptionSelect(idx)}
                    >
                      <Avatar>{idx + 1}</Avatar>
                      <Typography variant="body1" component="div">
                        {option}
                      </Typography>
                    </Box>
                  ))}
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
                    onClick={handlePrevious}
                  >
                    Previous
                  </Button>
                  {current < quizLength - 1 ? (
                    <Button
                      size="small"
                      variant="contained"
                      color={"warning"}
                      onClick={handleNext}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      variant="contained"
                      color={"success"}
                      onClick={handleSubmit}
                    >
                      Submit
                    </Button>
                  )}
                </Box>
              </Box>
            ) : result.percentage !== 0 ? (
              <Box mt={15}>
                <PublicQuizResult
                  quizDuration={quiz.duration}
                  quizQuestions={quiz.questions}
                  quizTitle={quiz.quizTitle}
                  quizSummary={quizSummary}
                />
                {/* {JSON.stringify(quizSummary, null, 4)} */}
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mt: 15,
                }}
              >
                <Box
                  sx={{
                    borderRadius: 2,
                    border: "none",
                    padding: 1,
                    margin: 1,
                    p: 5,
                    bgcolor: "#fff",
                    boxShadow: "0 0 10px 0 rgba(0,0,0,0.1)",
                    width: { xs: "100%", sm: "70%", md: "50%" },
                  }}
                >
                  <Typography
                    variant="h5"
                    component="div"
                    color={"red"}
                    textAlign={"center"}
                    mb={3}
                    fontWeight={"bold"}
                  >
                    {quiz.quizTitle}
                  </Typography>
                  <Box>
                    <Typography fontSize={18} fontWeight={"bold"}>
                      Name: {userName}
                    </Typography>
                    <Typography color="text.secondary">
                      Total Questions: {quizLength}
                    </Typography>
                    <Typography color="text.secondary">
                      Duration: {quiz.duration}mins
                    </Typography>
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
                      onClick={handleStart}
                      disabled={quizLength === 0}
                    >
                      Start
                    </Button>
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
      </Box>
    </Box>
  );
};

export default page;
