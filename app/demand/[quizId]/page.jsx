"use client";
import { db } from "@/firebase";
import { AccessAlarmOutlined } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import QuizResult from "@/components/Quiz/QuizResult";
import { toast } from "react-toastify";

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins} mins : ${secs} secs`;
}

const page = ({ params }) => {
  const route = useRouter();
  const { quizId } = params;
  const loaderImage = "/loader.gif";
  const [quiz, setQuiz] = useState([]);
  const [student, setStudent] = useState({
    name: "",
    studentId: "",
  });
  const [attemptedQuestions, setAttemptedQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [quizStart, setQuizStart] = useState(false);
  const [loading, setLoading] = useState(false);
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
      const docRef = doc(db, `DemandQuiz/${quizId}`);
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
  const handleStart = async () => {
    try {
      setLoading(true);
      const userRef = doc(db, `Students/${student.studentId}`);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        if (userSnap.data().name != student.name) {
          setLoading(false);
          toast.error("Your name not matched");
          return;
        }
        const attemptRef = doc(db, `DemandQuiz/${quizId}`);
        const attemptSnap = await getDoc(attemptRef);
        if (attemptSnap.exists()) {
          let studentAttempts = attemptSnap.data().attempted;
          if (studentAttempts.length > 0) {
            let findStudent = studentAttempts.filter(
              (item) => item.studentId === student.studentId
            );
            if (findStudent.length > 0) {
              setLoading(false);
              toast.error("Quiz already attempted");
              return;
            } else {
              setLoading(false);
              setQuizStart(true);
              setTimeLeft(parseInt(quiz.duration * 60));
            }
          } else {
            setLoading(false);
            setQuizStart(true);
            setTimeLeft(parseInt(quiz.duration * 60));
          }
        } else {
          setLoading(false);
          toast.error("Quiz could not be fetched");
          return;
        }
      } else {
        setLoading(false);
        toast.error("User not registered yet. Please register first");
        return;
      }
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong");
      console.log(error);
    }
  };
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
  const handleViewSummary = () => {
    route.push(`/demand/summary/${quizId}?studentId=${student.studentId}`);
  };
  const handleSubmit = async () => {
    try {
      setLoading(true);
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
      let summaryItems = [];
      quiz.questions.map((item) => {
        let selectedvalue = answers.find((val) => val.id === item.id);
        summaryItems.push({
          questionId: item.id,
          title: item.title,
          selectedOption: (selectedvalue && selectedvalue.answer) || "",
          correctOption: item.correctOption,
          explaination: item.explanation,
        });
      });
      const attemptedDetails = {
        studentName: student.name,
        studentId: student.studentId,
        result: {
          attempted: answers.length,
          correct: scores,
          incorrect: answers.length - scores,
          percentage: percentage.toFixed(2),
        },
        summary: summaryItems,
      };
      const attemptRef = doc(db, `DemandQuiz/${quizId}`);
      await updateDoc(attemptRef, {
        attempted: arrayUnion(attemptedDetails),
      });
      setResult({
        ...result,
        percentage: percentage.toFixed(2),
        score: scores,
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
    <Box>
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
          <img src={loaderImage} width={250} height={250} />
        </Box>
      )}
      <Container mt={15}>
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
                        cursor: "pointer",
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
                        cursor: "pointer",
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
                        cursor: "pointer",
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
                        cursor: "pointer",
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
                    size="small"
                    variant="contained"
                    color={"warning"}
                    disabled={current === quizLength - 1}
                    onClick={() => setCurrent(current + 1)}
                  >
                    Next
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    size="small"
                    variant="contained"
                    color={"success"}
                    disabled={answers.length !== quizLength}
                  >
                    Submit
                  </Button>
                </Box>
              </Box>
            ) : result.percentage !== 0 ? (
              <Box mt={15}>
                <QuizResult
                  result={result}
                  studentName={student.name}
                  length={quizLength}
                  duration={quiz.duration}
                  attempted={answers.length}
                  handleViewSummary={handleViewSummary}
                />
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
                    <TextField
                      placeholder="Your id..."
                      value={student.studentId}
                      onChange={(e) =>
                        setStudent({ ...student, studentId: e.target.value })
                      }
                      sx={{ mb: 2 }}
                      fullWidth
                      variant="outlined"
                    />
                    <TextField
                      placeholder="Your name..."
                      value={student.name}
                      onChange={(e) =>
                        setStudent({ ...student, name: e.target.value })
                      }
                      fullWidth
                      variant="outlined"
                    />
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
                      disabled={
                        quizLength === 0 ||
                        student.studentId == "" ||
                        student.name == ""
                      }
                    >
                      Start
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
                      Total Questions: {quizLength}
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
