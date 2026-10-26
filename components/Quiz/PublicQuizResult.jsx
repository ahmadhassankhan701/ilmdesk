"use client";
import { AccessAlarmOutlined } from "@mui/icons-material";
import { Avatar, Box, Button, Grid, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import QuizFinalResult from "@/components/Quiz/QuizFinalResult";
import renderHTML from "react-render-html";
import PDFQuizDownload from "../Modals/PDFQuizDownload";

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
  const [open, setOpen] = useState(false);
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

  return (
    <Box>
      <Box>
        {quiz && quizLength && summary.summary && summary.summary.length ? (
          <Grid container spacing={2}>
            <Grid item xs={12} md={5}>
              <Box>
                <QuizFinalResult
                  result={{
                    percentage: summary.percentage,
                    correct: summary.correct,
                    incorrect: summary.incorrect,
                    attempted: summary.attempted,
                  }}
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
                    {summary.attempted} / {quizLength}
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
                <Box sx={{ display: "grid", gap: 1, px: 2, pb: 1 }}>
                  {quiz.questions[current].options.map((option, idx) => {
                    const selected = summary.summary[current]?.selectedOption;
                    const correct = Number(quiz.questions[current].correctOption) === idx;
                    const chosen = selected !== null && selected !== undefined && Number(selected) === idx;
                    const tone = correct ? "correct" : chosen ? "wrong" : "plain";
                    const note = correct && chosen ? "Your answer · Correct" : correct ? "Correct" : chosen ? "Your answer" : "";
                    const toneSx = {
                      correct: { border: "1px solid #1B7F4E", bgcolor: "rgba(27, 127, 78, 0.08)", mark: "#1B7F4E", note: "#1B7F4E" },
                      wrong: { border: "1px solid #D64545", bgcolor: "rgba(214, 69, 69, 0.08)", mark: "#D64545", note: "#D64545" },
                      plain: { border: "1px solid #E2E8EC", bgcolor: "#fff", mark: "#F0F3F5", note: "#5C6B7A" },
                    }[tone];
                    return (
                      <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 1.5, borderRadius: "16px", border: toneSx.border, bgcolor: toneSx.bgcolor, px: 1.5, py: 1.25 }}>
                        <Avatar sx={{ bgcolor: tone === "plain" ? "#F0F3F5" : toneSx.mark, color: tone === "plain" ? "#0A192F" : "#fff", width: 36, height: 36, fontSize: 14, fontWeight: 700 }}>
                          {String.fromCharCode(65 + idx)}
                        </Avatar>
                        <Box>
                          <Typography>{option}</Typography>
                          {note ? <Typography sx={{ color: toneSx.note, fontSize: 12, fontWeight: 700, mt: 0.25 }}>{note}</Typography> : null}
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
                {String(quiz.questions[current].explanation || "").replace(/<[^>]*>/g, "").trim() ? (
                  <Box sx={{ mx: 2, mt: 1, pt: 1.5, borderTop: "1px solid #E2E8EC" }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 700, letterSpacing: 1.1, textTransform: "uppercase", color: "#0D9AAC" }}>
                      Explanation
                    </Typography>
                    <Typography id={"explanation"} sx={{ mt: 0.75, lineHeight: 1.6 }}>
                      {renderHTML(quiz.questions[current].explanation)}
                    </Typography>
                  </Box>
                ) : null}
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
                    color={"primary"}
                    onClick={() => setCurrent(current - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color={"secondary"}
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
                    color={"success"}
                    onClick={() => route.back()}
                  >
                    Done
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    sx={{ textTransform: "none" }}
                    color={"error"}
                    onClick={() => setOpen(true)}
                  >
                    Download
                  </Button>
                  <PDFQuizDownload
                    duration={quiz.duration}
                    questions={quiz.questions}
                    title={quiz.quizTitle}
                    summary={summary}
                    open={open}
                    setOpen={setOpen}
                  />
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
