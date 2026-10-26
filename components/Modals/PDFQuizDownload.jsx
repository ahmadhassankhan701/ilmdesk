"use client";

import { Document, Page, StyleSheet, Text, View, PDFViewer } from "@react-pdf/renderer";
import { Box, Dialog, IconButton, Typography, useMediaQuery } from "@mui/material";
import { Close } from "@mui/icons-material";
import { renderPdfContent, replaceHtmlTags } from "@/utils/helper";
import { primary } from "@/lib/brand";

const GREEN = "#1B7F4E";
const GREEN_WASH = "#E7F6EE";
const RED = "#D64545";
const RED_WASH = "#FDECEC";
const NAVY = "#0A192F";
const MUTED = "#5C6B7A";
const LINE = "#E2E8EC";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#F0F3F5",
    color: NAVY,
    fontFamily: "Helvetica",
    fontSize: 11,
    padding: 28,
  },
  hero: {
    backgroundColor: NAVY,
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
  },
  eyebrow: {
    color: "#0D9AAC",
    fontSize: 9,
    letterSpacing: 1.4,
    marginBottom: 6,
  },
  heroTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
  },
  heroMeta: {
    color: "#C9D3D9",
    fontSize: 11,
    marginTop: 6,
  },
  stats: {
    flexDirection: "row",
    marginBottom: 16,
  },
  stat: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: LINE,
    padding: 10,
    marginRight: 8,
  },
  statLast: {
    marginRight: 0,
  },
  statLabel: {
    color: MUTED,
    fontSize: 8,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  statValue: {
    color: NAVY,
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
  },
  question: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: LINE,
    padding: 14,
    marginBottom: 12,
  },
  questionLabel: {
    color: MUTED,
    fontSize: 8,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  questionText: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    lineHeight: 1.4,
    marginBottom: 10,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    padding: 8,
    marginBottom: 6,
  },
  mark: {
    width: 18,
    height: 18,
    borderRadius: 9,
    textAlign: "center",
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    paddingTop: 3,
    marginRight: 8,
  },
  optionBody: {
    flex: 1,
  },
  optionText: {
    fontSize: 11,
    lineHeight: 1.35,
  },
  optionNote: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    marginTop: 2,
  },
  explainLabel: {
    color: "#0D9AAC",
    fontSize: 8,
    letterSpacing: 0.8,
    marginTop: 8,
    marginBottom: 4,
  },
  explain: {
    color: MUTED,
    fontSize: 10,
    lineHeight: 1.45,
  },
  footer: {
    marginTop: 8,
    color: MUTED,
    fontSize: 9,
    lineHeight: 1.4,
  },
});

const tones = {
  both: { border: GREEN, fill: GREEN_WASH, mark: GREEN, ink: "#ffffff", note: GREEN, label: "Your answer · Correct" },
  correct: { border: GREEN, fill: GREEN_WASH, mark: GREEN, ink: "#ffffff", note: GREEN, label: "Correct" },
  wrong: { border: RED, fill: RED_WASH, mark: RED, ink: "#ffffff", note: RED, label: "Your answer" },
  plain: { border: LINE, fill: "#ffffff", mark: "#F0F3F5", ink: NAVY, note: MUTED, label: "" },
};

function letter(index) {
  return String.fromCharCode(65 + index);
}

function optionTone(question, row, index) {
  const correct = Number(question?.correctOption) === index;
  const selected = row?.selectedOption;
  const chosen = selected !== null && selected !== undefined && Number(selected) === index;
  if (correct && chosen) return "both";
  if (correct) return "correct";
  if (chosen) return "wrong";
  return "plain";
}

function plainText(html) {
  return String(html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function ResultDocument({ duration, questions, title, summary }) {
  const rows = Array.isArray(summary?.summary) ? summary.summary : [];
  const total = questions.length;
  const score = Math.round(Number(summary?.percentage) || 0);
  const minutes = String(duration || "").trim();

  return (
    <Document title={`${title || "Quiz"} result`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>ILMDESK</Text>
          <Text style={styles.heroTitle}>{title || "Quiz result"}</Text>
          <Text style={styles.heroMeta}>
            {[summary?.studentName, minutes ? `${minutes} min` : ""] .filter(Boolean).join("  ·  ") || "Quiz result"}
          </Text>
        </View>
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>SCORE</Text>
            <Text style={styles.statValue}>{score}%</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>CORRECT</Text>
            <Text style={styles.statValue}>{summary?.correct ?? 0}/{total}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>INCORRECT</Text>
            <Text style={styles.statValue}>{summary?.incorrect ?? 0}</Text>
          </View>
          <View style={[styles.stat, styles.statLast]}>
            <Text style={styles.statLabel}>ATTEMPTED</Text>
            <Text style={styles.statValue}>{summary?.attempted ?? 0}</Text>
          </View>
        </View>
        {questions.map((question, index) => {
          const row = rows[index];
          const explanation = plainText(question.explanation);
          return (
            <View key={index} style={styles.question}>
              <Text style={styles.questionLabel}>QUESTION {index + 1}</Text>
              <Text style={styles.questionText}>{question.question}</Text>
              {(question.options || []).map((option, optionIndex) => {
                const tone = tones[optionTone(question, row, optionIndex)];
                return (
                  <View key={optionIndex} style={[styles.option, { borderColor: tone.border, backgroundColor: tone.fill }]}>
                    <Text style={[styles.mark, { backgroundColor: tone.mark, color: tone.ink }]}>{letter(optionIndex)}</Text>
                    <View style={styles.optionBody}>
                      <Text style={styles.optionText}>{option}</Text>
                      {tone.label ? <Text style={[styles.optionNote, { color: tone.note }]}>{tone.label}</Text> : null}
                    </View>
                  </View>
                );
              })}
              {explanation ? (
                <View>
                  <Text style={styles.explainLabel}>EXPLANATION</Text>
                  {/<\/?[a-z][\s\S]*>/i.test(question.explanation) ? (
                    renderPdfContent(replaceHtmlTags(question.explanation))
                  ) : (
                    <Text style={styles.explain}>{explanation}</Text>
                  )}
                </View>
              ) : null}
            </View>
          );
        })}
        <Text style={styles.footer}>Ilmdesk · Near Shaukat Khanum Hospital, Lahore · ilmdesk63@gmail.com</Text>
      </Page>
    </Document>
  );
}

export default function PDFQuizDownload({ duration = "", questions = [], title = "", summary = {}, open, setOpen }) {
  const fullScreen = useMediaQuery("(max-width:600px)");
  const close = () => setOpen(false);
  const list = Array.isArray(questions) ? questions : [];

  return (
    <Dialog
      open={open}
      onClose={close}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="lg"
      aria-labelledby="quiz-result-pdf-title"
      PaperProps={{
        sx: {
          height: fullScreen ? "100%" : "min(88vh, 920px)",
          borderRadius: fullScreen ? 0 : "20px",
          overflow: "hidden",
          bgcolor: "#F0F3F5",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: { xs: 1.5, sm: 2 }, py: 1, bgcolor: "#0A192F", color: "#fff" }}>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography id="quiz-result-pdf-title" noWrap sx={{ fontWeight: 700, fontSize: 15 }}>
            {title || "Quiz result"}
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.62)", fontSize: 12 }}>Result PDF</Typography>
        </Box>
        <IconButton aria-label="Close result" onClick={close} sx={{ color: "#fff", "&:hover": { color: primary } }}>
          <Close />
        </IconButton>
      </Box>
      <Box sx={{ flex: 1, minHeight: 0, bgcolor: "#E2E8EC" }}>
        {open ? (
          <PDFViewer width="100%" height="100%" style={{ border: 0 }}>
            <ResultDocument duration={duration} questions={list} title={title} summary={summary || {}} />
          </PDFViewer>
        ) : null}
      </Box>
    </Dialog>
  );
}
