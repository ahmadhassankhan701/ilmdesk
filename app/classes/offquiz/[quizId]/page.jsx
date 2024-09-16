"use client";
import { db } from "@/firebase";
import renderHTML from "react-render-html";
import { ExpandMore, NavigateNext } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const page = ({ params }) => {
  const route = useRouter();
  const { quizId } = params;
  const [quiz, setQuiz] = useState([]);
  const [attemptedQuestions, setAttemptedQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [current, setCurrent] = useState(0);

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

  const breadCrumbs = [
    { name: "Home", url: "/" },
    { name: "Courses", url: "/classes" },
    { name: "Chapters", url: "/classes/chapters" },
    { name: quiz.quizTitle ? quiz.quizTitle : "Offline Quiz", url: "#" },
  ];
  const quizLength = quiz.questions?.length || 0;
  const handleAnswer = (answer, id) => {
    const alreadyAttempted = attemptedQuestions.includes(id);
    if (!alreadyAttempted) {
      setAttemptedQuestions([...attemptedQuestions, id]);
      setAnswers([...answers, { answer, id }]);
    }
  };
  return (
    <Box>
      <Box
        sx={{
          background: `url(/ResourcesTopBanner.png)`,
          backgroundColor: "#000000",
          backgroundSize: "cover",
          height: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          pl: 10,
          justifyContent: "center",
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: 48,
              fontWeight: 700,
              color: "#FFFFFF",
              mb: 1,
            }}
          >
            {quiz.subject}
          </Typography>
          <Breadcrumbs
            separator={<NavigateNext fontSize="small" />}
            aria-label="breadcrumb"
            sx={{ color: "#fff" }}
          >
            {breadCrumbs.map((item, i) => (
              <Link
                href={item.url}
                key={i}
                style={{ color: "#fff", textDecoration: "none" }}
              >
                <Typography>{item.name}</Typography>
              </Link>
            ))}
          </Breadcrumbs>
        </Box>
      </Box>
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
                  {current + 1} / {quizLength}
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
                  {current + 1}.{" "}
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
                      ? quiz.questions[current]?.correctOption ===
                        quiz.questions[current].option1
                        ? { border: "2px solid green" }
                        : answers.findIndex(
                            (item) =>
                              item.answer === quiz.questions[current].option1 &&
                              item.id === quiz.questions[current].id
                          ) !== -1
                        ? { border: "2px solid red" }
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
                      ? quiz.questions[current]?.correctOption ===
                        quiz.questions[current].option2
                        ? { border: "2px solid green" }
                        : answers.findIndex(
                            (item) =>
                              item.answer === quiz.questions[current].option2 &&
                              item.id === quiz.questions[current].id
                          ) !== -1
                        ? { border: "2px solid red" }
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
                      ? quiz.questions[current]?.correctOption ===
                        quiz.questions[current].option3
                        ? { border: "2px solid green" }
                        : answers.findIndex(
                            (item) =>
                              item.answer === quiz.questions[current].option3 &&
                              item.id === quiz.questions[current].id
                          ) !== -1
                        ? { border: "2px solid red" }
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
                      ? quiz.questions[current]?.correctOption ===
                        quiz.questions[current].option4
                        ? { border: "2px solid green" }
                        : answers.findIndex(
                            (item) =>
                              item.answer === quiz.questions[current].option4 &&
                              item.id === quiz.questions[current].id
                          ) !== -1
                        ? { border: "2px solid red" }
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
              {attemptedQuestions.includes(quiz.questions[current].id) && (
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
                      {renderHTML(quiz.questions[current].explanation)}
                    </AccordionDetails>
                  </Accordion>
                </Box>
              )}
              <Box
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
              </Box>
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
    </Box>
  );
};

export default page;
