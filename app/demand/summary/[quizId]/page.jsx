"use client";
import { db } from "@/firebase";
import { AccessAlarmOutlined } from "@mui/icons-material";
import { Avatar, Box, Button, Grid, Typography } from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import QuizFinalResult from "@/components/Quiz/QuizFinalResult";
import renderHTML from "react-render-html";

const page = ({ params }) => {
  const route = useRouter();
  const { quizId } = params;
  const searchParams = useSearchParams();
  const studentId = searchParams.get("studentId");
  const loaderImage = "/loader.gif";
  const [quiz, setQuiz] = useState({
    duration: "",
    questions: [],
    quizTitle: "",
  });
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!quizId || !studentId) {
        setLoading(false);
        toast.error("Must have an id for quiz");
        route.push("/");
        return;
      }
      try {
        setLoading(true);
        const docRef = doc(db, `DemandQuiz/${quizId}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.attempted.length > 0) {
            let userAttempt = data.attempted.filter(
              (item) => item.studentId === studentId
            );
            if (userAttempt) {
              setQuiz({
                ...quiz,
                duration: data.duration,
                questions: data.questions,
                quizTitle: data.quizTitle,
              });
              setSummary(userAttempt[0]);
            }
          }
          setLoading(false);
        } else {
          setLoading(false);
          toast.error("No quiz found");
          route.push("/");
          return;
        }
      } catch (error) {
        setLoading(false);
        toast.error(error.message);
        console.log(error);
      }
    };
    fetchQuiz();
  }, []);

  const quizLength = quiz.questions?.length || 0;

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
      <Box sx={{ mx: { xs: 0, sm: 5, md: 5 }, mt: { xs: 0, sm: 5, md: 5 } }}>
        {quiz &&
        quiz.questions.length &&
        summary.summary &&
        summary.summary.length ? (
          <Grid container spacing={2}>
            <Grid item xs={12} md={5}>
              <Box mt={15}>
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
                      {quiz.duration + "mins"}
                    </Typography>
                  </Box>
                  <Typography variant="body1" component="div" color={"#fff"}>
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
                      quiz.questions[current].option1 ===
                      quiz.questions[current].correctOption
                        ? summary.summary[current].selectedOption === ""
                          ? { border: "2px solid gray" }
                          : { border: "2px solid green" }
                        : summary.summary[current].selectedOption ===
                          quiz.questions[current].option1
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
                      quiz.questions[current].option2 ===
                      quiz.questions[current].correctOption
                        ? summary.summary[current].selectedOption === ""
                          ? { border: "2px solid gray" }
                          : { border: "2px solid green" }
                        : summary.summary[current].selectedOption ===
                          quiz.questions[current].option2
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
                      quiz.questions[current].option3 ===
                      quiz.questions[current].correctOption
                        ? summary.summary[current].selectedOption === ""
                          ? { border: "2px solid gray" }
                          : { border: "2px solid green" }
                        : summary.summary[current].selectedOption ===
                          quiz.questions[current].option3
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
                      quiz.questions[current].option4 ===
                      quiz.questions[current].correctOption
                        ? summary.summary[current].selectedOption === ""
                          ? { border: "2px solid gray" }
                          : { border: "2px solid green" }
                        : summary.summary[current].selectedOption ===
                          quiz.questions[current].option4
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
                    Explaination
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

export default page;
