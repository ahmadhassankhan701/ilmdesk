"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Box, Button, CircularProgress, Skeleton, TextField, Typography } from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import renderHTML from "react-render-html";
import { db } from "@/firebase";
import { accent, accentHover, ink, muted, navy, primary, primaryHover } from "@/lib/brand";
import { pageBackground, pageColumnSx } from "@/lib/pageColumn";
import PageTrail from "@/components/PageTrail";
import PDFQuizDownload from "@/components/Modals/PDFQuizDownload";
import { nameError } from "@/lib/formValidation";
import { topicsHref } from "@/lib/classCatalog";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    bgcolor: "#F0F3F5",
    "& fieldset": { borderColor: "#E2E8EC" },
    "&:hover fieldset": { borderColor: "#C9D3D9" },
    "&.Mui-focused fieldset": { borderColor: primary },
  },
};

function formatClock(seconds) {
  const safe = Math.max(0, Number(seconds) || 0);
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

function letter(index) {
  return String.fromCharCode(65 + index);
}

function plain(html) {
  return String(html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function sameOption(selected, correct) {
  return selected !== undefined && selected !== null && Number(selected) === Number(correct);
}

export default function PublicQuizPage({ params }) {
  const router = useRouter();
  const quizId = params?.quizId;
  const [quiz, setQuiz] = useState(null);
  const [status, setStatus] = useState("loading");
  const [studentName, setStudentName] = useState("");
  const [nameMessage, setNameMessage] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [needsConfirm, setNeedsConfirm] = useState(false);
  const [summary, setSummary] = useState(null);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [topicList, setTopicList] = useState("/classes");
  const submitted = useRef(false);
  const answersRef = useRef({});
  const quizRef = useRef(null);
  const finishRef = useRef(() => {});

  answersRef.current = selectedAnswers;
  quizRef.current = quiz;

  useEffect(() => {
    let ignore = false;

    (async () => {
      if (!quizId) {
        setStatus("missing");
        return;
      }
      try {
        const snap = await getDoc(doc(db, "ClassQuizzes", quizId));
        if (ignore) return;
        if (!snap.exists()) {
          setQuiz(null);
          setStatus("missing");
          return;
        }
        const next = { key: snap.id, ...snap.data() };
        if (next.mode === "offline") {
          router.replace(`/classes/offquiz/${snap.id}`);
          return;
        }
        setQuiz(next);
        setStatus("intro");
        if (next.topicId) {
          topicsHref(next.topicId).then((href) => {
            if (!ignore) setTopicList(href);
          }).catch((error) => console.error(error));
        }
      } catch (error) {
        console.error(error);
        if (!ignore) setStatus("failed");
      }
    })();

    return () => {
      ignore = true;
    };
  }, [quizId, router]);

  const questions = Array.isArray(quiz?.questions) ? quiz.questions : [];
  const quizLength = questions.length;
  const minutes = Number.parseInt(quiz?.duration, 10);
  const timed = Number.isFinite(minutes) && minutes > 0;
  const locked = Boolean(quiz?.locked);
  const answeredCount = Object.keys(selectedAnswers).length;
  const question = questions[current];
  const lowTime = timed && status === "running" && timeLeft !== null && timeLeft <= 60;

  const finish = (expired) => {
    const liveQuiz = quizRef.current;
    const liveQuestions = Array.isArray(liveQuiz?.questions) ? liveQuiz.questions : [];
    if (!liveQuestions.length || submitted.current) return;
    submitted.current = true;
    const answers = answersRef.current;
    let correct = 0;
    const rows = liveQuestions.map((item, index) => {
      const selected = Object.prototype.hasOwnProperty.call(answers, index) ? answers[index] : null;
      const isCorrect = sameOption(selected, item.correctOption);
      if (isCorrect) correct += 1;
      return {
        title: item.question,
        selectedOption: selected,
        correctOption: item.correctOption,
        isCorrect,
      };
    });
    const percentage = (correct / liveQuestions.length) * 100;
    setSummary({
      studentName: studentName.trim(),
      attempted: Object.keys(answers).length,
      correct,
      incorrect: liveQuestions.length - correct,
      percentage,
      summary: rows,
    });
    setStatus("done");
    setNeedsConfirm(false);
    if (expired) toast.info("Time is up. Your answers were submitted.");
  };

  finishRef.current = finish;

  useEffect(() => {
    if (status !== "running" || !timed) return undefined;
    const timer = window.setInterval(() => {
      setTimeLeft((currentTime) => (currentTime <= 1 ? 0 : currentTime - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [status, timed]);

  useEffect(() => {
    if (status === "running" && timed && timeLeft === 0) finishRef.current(true);
  }, [status, timed, timeLeft]);

  const start = () => {
    const message = nameError(studentName);
    setNameMessage(message);
    if (message || locked || quizLength === 0) return;
    submitted.current = false;
    setCurrent(0);
    setSelectedAnswers({});
    setNeedsConfirm(false);
    if (timed) setTimeLeft(minutes * 60);
    setStatus("running");
  };

  const choose = (index) => {
    setSelectedAnswers((currentAnswers) => ({ ...currentAnswers, [current]: index }));
    setNeedsConfirm(false);
  };

  const goTo = (index) => {
    setCurrent(index);
    setNeedsConfirm(false);
  };

  const submit = () => {
    if (answeredCount < quizLength && !needsConfirm) {
      setNeedsConfirm(true);
      return;
    }
    finish(false);
  };

  const title = quiz?.quizTitle || "Quiz";

  return (
    <Box sx={{ bgcolor: pageBackground, color: ink, pt: { xs: "96px", md: "112px" }, pb: { xs: 8, md: 12 } }}>
      <Box sx={pageColumnSx}>
        {status === "loading" ? (
          <Skeleton variant="rounded" height={280} sx={{ borderRadius: "28px", bgcolor: "rgba(10, 25, 47, 0.08)" }} />
        ) : status === "failed" ? (
          <Notice title="This quiz could not be loaded" body="Refresh the page and try again." />
        ) : status === "missing" ? (
          <Notice title="This quiz is not on the syllabus" body="Go back to classes and open the lesson again." />
        ) : status === "intro" ? (
          <>
            <Hero
              title={title}
              body={
                locked
                  ? "This practice is closed for now."
                  : "Put your name on the paper, then work through the questions. You can move back and forth before you submit."
              }
            />
            <Box sx={{ mt: 3, bgcolor: "#fff", border: "1px solid #E2E8EC", borderRadius: "22px", p: { xs: 2.5, md: 3 }, maxWidth: 640 }}>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                <Meta label="Questions" value={quizLength || "None"} />
                <Meta label="Time" value={timed ? `${minutes} min` : "Untimed"} />
                {quiz?.difficulty ? <Meta label="Level" value={quiz.difficulty} /> : null}
              </Box>
              {locked ? (
                <Typography sx={{ color: muted, mt: 2.5, lineHeight: 1.6 }}>
                  The desk has locked this quiz. Open it again when it is available.
                </Typography>
              ) : quizLength === 0 ? (
                <Typography sx={{ color: muted, mt: 2.5 }}>This quiz has no questions yet.</Typography>
              ) : (
                <>
                  <Box mt={2.5}>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 0.75 }}>Name</Typography>
                    <TextField
                      fullWidth
                      placeholder="Your name"
                      value={studentName}
                      error={Boolean(nameMessage)}
                      helperText={nameMessage || "This name is printed on your result."}
                      onChange={(event) => {
                        setStudentName(event.target.value);
                        setNameMessage("");
                      }}
                      sx={fieldSx}
                    />
                  </Box>
                  <Button
                    variant="contained"
                    onClick={start}
                    sx={{
                      mt: 2.5,
                      textTransform: "none",
                      fontWeight: 600,
                      borderRadius: 999,
                      px: 2.75,
                      py: 1.1,
                      bgcolor: accent,
                      boxShadow: "none",
                      "&:hover": { bgcolor: accentHover, boxShadow: "none" },
                    }}
                  >
                    Start Quiz
                  </Button>
                </>
              )}
            </Box>
          </>
        ) : (
          <>
            <Box
              sx={{
                position: "sticky",
                top: { xs: 76, md: 88 },
                zIndex: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                bgcolor: navy,
                color: "#fff",
                borderRadius: "18px",
                px: { xs: 2, md: 2.5 },
                py: 1.5,
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: 12, letterSpacing: 1, fontWeight: 700, color: primary, textTransform: "uppercase" }}>
                  {status === "done" ? "Result" : "Quiz"}
                </Typography>
                <Typography sx={{ fontWeight: 700, fontSize: { xs: 16, md: 18 }, lineHeight: 1.3, mt: 0.25 }} noWrap>
                  {title}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1.5, md: 2.5 }, flexShrink: 0 }}>
                {status === "running" && timed ? (
                  <Typography sx={{ fontWeight: 700, fontVariantNumeric: "tabular-nums", color: lowTime ? accent : "#fff" }} aria-label="Time remaining">
                    {formatClock(timeLeft)}
                  </Typography>
                ) : null}
                <Typography sx={{ color: "rgba(255,255,255,0.78)", fontSize: 14 }}>
                  {status === "done" ? `${summary?.correct || 0} / ${quizLength}` : `${answeredCount} / ${quizLength}`}
                </Typography>
              </Box>
            </Box>

            {status === "running" ? (
              <Box sx={{ mt: 1.5, display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1.6fr) minmax(220px, 0.55fr)" }, alignItems: "start" }}>
                <Box sx={{ bgcolor: "#fff", border: "1px solid #E2E8EC", borderRadius: "22px", p: { xs: 2, md: 3 } }}>
                  <Typography sx={{ color: muted, fontSize: 13, fontWeight: 700, letterSpacing: 0.8 }}>
                    QUESTION {current + 1} OF {quizLength}
                  </Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: { xs: 20, md: 24 }, letterSpacing: -0.4, lineHeight: 1.35, mt: 1 }}>
                    {question?.question}
                  </Typography>
                  <Box sx={{ display: "grid", gap: 1, mt: 2.5 }}>
                    {(question?.options || []).map((option, index) => {
                      const selected = selectedAnswers[current] === index;
                      return (
                        <Box
                          key={`${current}-${index}`}
                          component="button"
                          type="button"
                          aria-pressed={selected}
                          onClick={() => choose(index)}
                          sx={{
                            width: "100%",
                            textAlign: "left",
                            font: "inherit",
                            color: ink,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            borderRadius: "16px",
                            border: selected ? `1px solid ${primary}` : "1px solid #E2E8EC",
                            bgcolor: selected ? "rgba(13, 154, 172, 0.08)" : "#fff",
                            px: 1.5,
                            py: 1.25,
                            "&:hover": { borderColor: primary },
                          }}
                        >
                          <Box
                            sx={{
                              width: 36,
                              height: 36,
                              borderRadius: "50%",
                              display: "grid",
                              placeItems: "center",
                              flexShrink: 0,
                              fontWeight: 700,
                              bgcolor: selected ? primary : "#F0F3F5",
                              color: selected ? "#fff" : ink,
                            }}
                          >
                            {letter(index)}
                          </Box>
                          <Typography sx={{ lineHeight: 1.45 }}>{option}</Typography>
                        </Box>
                      );
                    })}
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, mt: 3 }}>
                    <Button
                      disabled={current === 0}
                      onClick={() => goTo(current - 1)}
                      sx={{ textTransform: "none", fontWeight: 600, color: ink }}
                    >
                      Previous
                    </Button>
                    {current < quizLength - 1 ? (
                      <Button
                        variant="contained"
                        onClick={() => goTo(current + 1)}
                        sx={{ textTransform: "none", fontWeight: 600, borderRadius: 999, px: 2.5, bgcolor: primary, boxShadow: "none", "&:hover": { bgcolor: primaryHover, boxShadow: "none" } }}
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        onClick={submit}
                        sx={{ textTransform: "none", fontWeight: 600, borderRadius: 999, px: 2.5, bgcolor: accent, boxShadow: "none", "&:hover": { bgcolor: accentHover, boxShadow: "none" } }}
                      >
                        {needsConfirm ? "Submit anyway" : "Submit"}
                      </Button>
                    )}
                  </Box>
                </Box>
                <Box sx={{ bgcolor: "#fff", border: "1px solid #E2E8EC", borderRadius: "22px", p: { xs: 2, md: 2.5 }, position: { md: "sticky" }, top: { md: 156 } }}>
                  <Typography sx={{ color: primary, fontSize: 13, fontWeight: 700, letterSpacing: 1.1, textTransform: "uppercase" }}>
                    Questions
                  </Typography>
                  <Typography sx={{ color: muted, fontSize: 14, mt: 0.75, lineHeight: 1.5 }}>
                    {needsConfirm
                      ? `${quizLength - answeredCount} still open. Submit again to hand it in.`
                      : `${answeredCount} answered. You can jump to any question.`}
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mt: 1.75 }}>
                    {questions.map((_, index) => (
                      <QuestionChip
                        key={index}
                        index={index}
                        current={index === current}
                        answered={Object.prototype.hasOwnProperty.call(selectedAnswers, index)}
                        onClick={() => goTo(index)}
                      />
                    ))}
                  </Box>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={submit}
                    sx={{ mt: 2, textTransform: "none", fontWeight: 600, borderRadius: 999, py: 1.05, bgcolor: accent, boxShadow: "none", "&:hover": { bgcolor: accentHover, boxShadow: "none" } }}
                  >
                    {needsConfirm ? "Submit anyway" : "Submit"}
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box sx={{ mt: 1.5, display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", md: "minmax(240px, 0.7fr) minmax(0, 1.5fr)" }, alignItems: "start" }}>
                <Box sx={{ bgcolor: "#fff", border: "1px solid #E2E8EC", borderRadius: "22px", p: { xs: 2.5, md: 3 }, position: { md: "sticky" }, top: { md: 156 } }}>
                  <Typography sx={{ color: primary, fontSize: 13, fontWeight: 700, letterSpacing: 1.1, textTransform: "uppercase" }}>
                    {summary?.studentName}
                  </Typography>
                  <Box sx={{ display: "grid", placeItems: "center", mt: 2 }}>
                    <Box sx={{ position: "relative", width: 148, height: 148 }}>
                      <CircularProgress variant="determinate" value={100} size={148} thickness={4} sx={{ color: "#E2E8EC", position: "absolute", inset: 0 }} />
                      <CircularProgress variant="determinate" value={Math.max(0, Math.min(100, summary?.percentage || 0))} size={148} thickness={4} sx={{ color: primary, position: "absolute", inset: 0 }} />
                      <Box sx={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
                        <Typography sx={{ fontWeight: 700, fontSize: 28, letterSpacing: -0.6 }}>{Math.round(summary?.percentage || 0)}%</Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ display: "grid", gap: 1, mt: 2.5 }}>
                    <ScoreRow label="Correct" value={summary?.correct || 0} />
                    <ScoreRow label="Incorrect" value={summary?.incorrect || 0} />
                    <ScoreRow label="Attempted" value={summary?.attempted || 0} />
                  </Box>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => setDownloadOpen(true)}
                    sx={{ mt: 2.5, textTransform: "none", fontWeight: 600, borderRadius: 999, borderColor: "#E2E8EC", color: ink, "&:hover": { borderColor: primary, bgcolor: "transparent" } }}
                  >
                    Download
                  </Button>
                  <Button
                    fullWidth
                    component={Link}
                    href={topicList}
                    sx={{ mt: 1, textTransform: "none", fontWeight: 600, color: primary }}
                  >
                    Back to topics
                  </Button>
                  <PDFQuizDownload
                    duration={quiz?.duration || ""}
                    questions={questions}
                    title={title}
                    summary={summary || {}}
                    open={downloadOpen}
                    setOpen={setDownloadOpen}
                  />
                </Box>
                <Box sx={{ bgcolor: "#fff", border: "1px solid #E2E8EC", borderRadius: "22px", p: { xs: 2, md: 3 } }}>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mb: 2.5 }}>
                    {questions.map((_, index) => {
                      const row = summary?.summary?.[index];
                      const chosen = row?.selectedOption !== null && row?.selectedOption !== undefined;
                      return (
                        <QuestionChip
                          key={index}
                          index={index}
                          current={index === current}
                          correct={Boolean(row?.isCorrect)}
                          wrong={chosen && !row?.isCorrect}
                          onClick={() => setCurrent(index)}
                        />
                      );
                    })}
                  </Box>
                  <Typography sx={{ color: muted, fontSize: 13, fontWeight: 700, letterSpacing: 0.8 }}>
                    QUESTION {current + 1} OF {quizLength}
                  </Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: { xs: 20, md: 24 }, letterSpacing: -0.4, lineHeight: 1.35, mt: 1 }}>
                    {question?.question}
                  </Typography>
                  <Box sx={{ display: "grid", gap: 1, mt: 2.5 }}>
                    {(question?.options || []).map((option, index) => {
                      const selected = summary?.summary?.[current]?.selectedOption;
                      const correct = sameOption(index, question?.correctOption);
                      const chosen = sameOption(selected, index);
                      const tone = correct ? "correct" : chosen ? "wrong" : "plain";
                      const note = correct && chosen ? "Your answer · Correct" : correct ? "Correct" : chosen ? "Your answer" : "";
                      return <ReviewOption key={`${current}-${index}`} letter={letter(index)} option={option} tone={tone} note={note} />;
                    })}
                  </Box>
                  {plain(question?.explanation) ? (
                    <Box sx={{ mt: 2.5, pt: 2, borderTop: "1px solid #E2E8EC" }}>
                      <Typography sx={{ color: primary, fontSize: 13, fontWeight: 700, letterSpacing: 1.1, textTransform: "uppercase" }}>
                        Explanation
                      </Typography>
                      <Box sx={{ mt: 1, color: ink, lineHeight: 1.7, "& p": { mb: 1 }, "& a": { color: primary } }}>
                        {renderHTML(question.explanation)}
                      </Box>
                    </Box>
                  ) : null}
                  <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, mt: 3 }}>
                    <Button disabled={current === 0} onClick={() => setCurrent(current - 1)} sx={{ textTransform: "none", fontWeight: 600, color: ink }}>
                      Previous
                    </Button>
                    <Button
                      disabled={current >= quizLength - 1}
                      variant="contained"
                      onClick={() => setCurrent(current + 1)}
                      sx={{ textTransform: "none", fontWeight: 600, borderRadius: 999, px: 2.5, bgcolor: primary, boxShadow: "none", "&:hover": { bgcolor: primaryHover, boxShadow: "none" } }}
                    >
                      Next
                    </Button>
                  </Box>
                </Box>
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}

function Hero({ title, body }) {
  return (
    <Box
      sx={{
        borderRadius: { xs: "24px", md: "32px" },
        background: "linear-gradient(145deg, #0A192F 0%, #071322 55%, #123044 100%)",
        px: { xs: 3, sm: 4.5, md: 6 },
        py: { xs: 5, md: 7 },
      }}
    >
      <Typography
        component="p"
        sx={{
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.16)",
          borderRadius: 999,
          px: 1.5,
          py: 0.4,
          fontSize: 12,
          letterSpacing: 0.6,
          mb: 2.5,
          width: "fit-content",
        }}
      >
        Quiz
      </Typography>
      <Typography component="h1" sx={{ color: "#fff", fontWeight: 700, letterSpacing: -1.2, lineHeight: 1.05, fontSize: { xs: 36, sm: 48, md: 56 }, maxWidth: 760 }}>
        {title}
      </Typography>
      <Typography sx={{ color: "rgba(255,255,255,0.72)", fontSize: 17, lineHeight: 1.65, maxWidth: 560, mt: 2.5 }}>{body}</Typography>
      <PageTrail onDark items={[{ label: "Classes", href: "/classes" }, { label: title }]} />
    </Box>
  );
}

function Notice({ title, body }) {
  return (
    <Box sx={{ bgcolor: "#fff", border: "1px solid #E2E8EC", borderRadius: "24px", p: { xs: 3, md: 4 } }}>
      <Typography sx={{ fontWeight: 700, fontSize: 22 }}>{title}</Typography>
      <Typography sx={{ color: muted, mt: 1 }}>{body}</Typography>
      <Typography component={Link} href="/classes" sx={{ display: "inline-block", color: primary, fontWeight: 600, mt: 1.5, textDecoration: "none", "&:hover": { color: primaryHover } }}>
        Back to classes
      </Typography>
    </Box>
  );
}

function Meta({ label, value }) {
  return (
    <Box>
      <Typography sx={{ color: muted, fontSize: 12, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase" }}>{label}</Typography>
      <Typography sx={{ fontWeight: 700, fontSize: 18, mt: 0.35, textTransform: "capitalize" }}>{value}</Typography>
    </Box>
  );
}

function QuestionChip({ index, current, answered, correct, wrong, onClick }) {
  let bgcolor = "#fff";
  let color = ink;
  let border = "1px solid #E2E8EC";
  if (correct) {
    bgcolor = "rgba(27, 127, 78, 0.12)";
    color = "#1B7F4E";
    border = "1px solid #1B7F4E";
  } else if (wrong) {
    bgcolor = "rgba(214, 69, 69, 0.12)";
    color = "#D64545";
    border = "1px solid #D64545";
  } else if (answered) {
    bgcolor = "rgba(13, 154, 172, 0.12)";
    color = primary;
    border = `1px solid ${primary}`;
  }
  if (current) {
    bgcolor = navy;
    color = "#fff";
    border = `1px solid ${navy}`;
  }
  return (
    <Box
      component="button"
      type="button"
      aria-label={`Question ${index + 1}`}
      aria-current={current ? "true" : undefined}
      onClick={onClick}
      sx={{
        width: 36,
        height: 36,
        borderRadius: "10px",
        border,
        bgcolor,
        color,
        font: "inherit",
        fontWeight: 700,
        fontSize: 13,
        cursor: "pointer",
      }}
    >
      {index + 1}
    </Box>
  );
}

function ReviewOption({ letter: mark, option, tone, note }) {
  const toneSx = {
    correct: { borderColor: "#1B7F4E", bgcolor: "rgba(27, 127, 78, 0.08)", markBg: "#1B7F4E", markColor: "#fff" },
    wrong: { borderColor: "#D64545", bgcolor: "rgba(214, 69, 69, 0.08)", markBg: "#D64545", markColor: "#fff" },
    plain: { borderColor: "#E2E8EC", bgcolor: "#fff", markBg: "#F0F3F5", markColor: ink },
  }[tone];
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, borderRadius: "16px", border: `1px solid ${toneSx.borderColor}`, bgcolor: toneSx.bgcolor, px: 1.5, py: 1.25 }}>
      <Box sx={{ width: 36, height: 36, borderRadius: "50%", display: "grid", placeItems: "center", flexShrink: 0, fontWeight: 700, bgcolor: toneSx.markBg, color: toneSx.markColor }}>
        {mark}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ lineHeight: 1.45 }}>{option}</Typography>
        {note ? <Typography sx={{ color: tone === "wrong" ? "#D64545" : "#1B7F4E", fontSize: 12, fontWeight: 700, mt: 0.25 }}>{note}</Typography> : null}
      </Box>
    </Box>
  );
}

function ScoreRow({ label, value }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, borderTop: "1px solid #E2E8EC", pt: 1 }}>
      <Typography sx={{ color: muted }}>{label}</Typography>
      <Typography sx={{ fontWeight: 700 }}>{value}</Typography>
    </Box>
  );
}
