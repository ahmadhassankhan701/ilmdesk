import {
  Page,
  Text,
  View,
  Document,
  PDFDownloadLink,
  Image,
  Svg,
  Circle,
  PDFViewer,
} from "@react-pdf/renderer";
import { styles } from "./PDFStyles";
import renderHTML from "react-render-html";
import { Box, Button, IconButton, Modal } from "@mui/material";
import { Close } from "@mui/icons-material";
const style = {
  width: "100%",
  height: "100%",
  bgcolor: "lightgray",
  border: "none",
  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
  overflow: "auto",
};
const CircularProgress = ({ percentage, radius = 100, strokeWidth = 5 }) => {
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${
    (percentage / 100) * circumference
  } ${circumference}`;

  return (
    <Svg width={radius * 2} height={radius * 2}>
      <Circle
        cx={radius}
        cy={radius}
        r={radius - strokeWidth / 2}
        stroke="#ccc"
        strokeWidth={strokeWidth}
        fill="#fff"
      />
      <Circle
        cx={radius}
        cy={radius}
        r={radius - strokeWidth / 2}
        stroke="red"
        strokeWidth={strokeWidth}
        fill="#fff"
        strokeDasharray={strokeDasharray}
        strokeLinecap="round"
        transform={`rotate(-90 ${radius} ${radius})`}
        style={{ transition: "stroke-dasharray 0.3s ease 0s" }}
      />
      <Text
        x={radius}
        y={radius}
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fontSize: 20, color: "green" }}
      >
        {`${percentage}%`}
      </Text>
    </Svg>
  );
};
export default function PDFQuizDownload({
  duration = "",
  questions = [],
  title = "",
  summary = [],
  open,
  setOpen,
}) {
  const quizLength = questions?.length || 0;
  const handleClose = () => {
    setOpen(false);
  };
  const ResultPDF = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.brand}>
          <View>
            <Image src="/ilmlogo.png" style={styles.brandImage} />
          </View>
          <View style={styles.spaceY}>
            <Text style={styles.textBold}>IlmDesk</Text>
            <Text>
              The Leading Global Marketplace for Learning and Instruction
            </Text>
            <Text>City, State 12345</Text>
          </View>
        </View>
        <View style={styles.header}>
          <View
            style={{
              width: "100%",
            }}
          >
            <View
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "row",
                flexWrap: "wrap",
                marginTop: 2,
              }}
            >
              <View
                style={{ display: "flex", gap: 10, flexDirection: "column" }}
              >
                <Text
                  style={{
                    fontSize: "25px",
                    fontWeight: "700",
                    color: "#000",
                    marginBottom: 5,
                  }}
                >
                  {summary.studentName}
                </Text>
                <Text
                  style={{
                    fontSize: "18px",
                    fontWeight: "500",
                    color: "gray",
                    marginBottom: 2,
                  }}
                >
                  Points: {summary.correct} / {quizLength}
                </Text>
                <Text
                  style={{
                    fontSize: "18px",
                    fontWeight: "500",
                    color: "gray",
                    marginBottom: 1,
                  }}
                >
                  Duration: {duration} mins
                </Text>
                <View
                  style={{
                    width: "100%",
                    borderWidth: 2,
                    borderColor: "lightgray",
                    marginTop: 15,
                    marginBottom: 2,
                  }}
                />
                <View
                  style={{
                    width: "80%",
                    borderWidth: 2,
                    borderColor: "lightgray",
                    marginTop: 5,
                    marginBottom: 2,
                  }}
                />
              </View>
              {summary.percentage > 50 ? (
                <Image
                  src={"/happy.jpg"}
                  style={{ width: 200, height: 200 }}
                  alt="happy"
                />
              ) : (
                <Image
                  src={"/sad.jpg"}
                  style={{ width: 250, height: 250 }}
                  alt="sad"
                />
              )}
            </View>

            <View
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 2,
              }}
            >
              <View
                style={{
                  marginTop: 40,
                }}
              >
                <CircularProgress percentage={summary.percentage} />
              </View>
            </View>

            <Text
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "gray",
                marginBottom: 1,
                marginTop: 50,
              }}
            >
              Answers
            </Text>
            <View
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "row",
                alignItems: "center",
                flexWrap: "wrap",
                marginTop: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "400",
                  color: "gray",
                  marginBottom: 1,
                }}
              >
                Attempted
              </Text>
              <Text
                style={{
                  borderRadius: 50,
                  backgroundColor: "gray",
                  padding: 10,
                  color: "#fff",
                }}
              >
                {summary.attempted}
              </Text>
              <Text
                style={{
                  fontSize: "14px",
                  fontWeight: "400",
                  color: "gray",
                  marginBottom: 1,
                }}
              >
                Correct
              </Text>
              <Text
                style={{
                  borderRadius: 50,
                  backgroundColor: "gray",
                  padding: 10,
                  color: "#fff",
                }}
              >
                {summary.correct}
              </Text>
              <Text
                style={{
                  fontSize: "14px",
                  fontWeight: "400",
                  color: "gray",
                  marginBottom: 1,
                }}
              >
                Incorrect
              </Text>
              <Text
                style={{
                  borderRadius: 50,
                  backgroundColor: "gray",
                  padding: 10,
                  color: "#fff",
                }}
              >
                {summary.incorrect}
              </Text>
            </View>
          </View>
        </View>

        <View>
          <View
            style={{
              boxShadow: "0 0 10px 0 rgba(0,0,0,0.1)",
              paddingBottom: 10,
            }}
          >
            <View
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 0 10px 0 rgba(0,0,0,0.1)",
                padding: 2,
                flexDirection: "row",
                width: "100%",
              }}
            >
              <Text style={{ color: "#000", fontSize: 16 }}>{title}</Text>
              <View
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Text style={{ color: "#000", fontSize: 16 }}>
                  {duration} mins
                </Text>
              </View>
              <Text style={{ color: "#000", fontSize: 16 }}>
                {summary.attempted} / {quizLength}
              </Text>
            </View>
            {questions.map((question, index) => (
              <View key={index}>
                <View
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    flexDirection: "row",
                    gap: 20,
                    padding: 2,
                    marginBottom: 20,
                    marginTop: 30,
                  }}
                >
                  <Text style={{ fontSize: 16 }}>{index + 1 + "."}</Text>
                  <Text style={{ fontSize: 14 }}>{question.question}</Text>
                </View>
                <View>
                  {question.options.map((option, idx) => (
                    <View
                      key={idx}
                      style={[
                        {
                          display: "flex",
                          alignItems: "center",
                          flexDirection: "row",
                          justifyContent: "flex-start",
                          gap: 20,
                          boxShadow: "0 0 10px 0 rgba(0,0,0,0.1)",
                          backgroundColor: "lightgray",
                          padding: 10,
                          borderRadius: 10,
                          marginVertical: 20,
                          cursor: "pointer",
                          borderWidth: 2,
                          borderColor:
                            idx === question.correctOption
                              ? summary.summary[index].selectedOption === null
                                ? "gray"
                                : "green"
                              : summary.summary[index].selectedOption === idx
                              ? "red"
                              : "lightgray",
                        },
                      ]}
                    >
                      <Text
                        style={{
                          borderRadius: 50,
                          backgroundColor: "gray",
                          paddingVertical: 10,
                          paddingHorizontal: 13,
                          color: "#fff",
                        }}
                      >
                        {idx + 1}
                      </Text>
                      <Text>{option}</Text>
                    </View>
                  ))}
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "800",
                      color: "red",
                    }}
                  >
                    Explanation
                  </Text>
                  <Text style={{ marginTop: 20 }}>
                    {question.explanation
                      ? renderHTML(question.explanation)
                      : ""}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box sx={style}>
          <Box
            height={"100vh"}
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Box
              display={"flex"}
              justifyContent={"flex-end"}
              alignItems={"flex-end"}
              width={"100%"}
              bgcolor={"rgb(60, 60, 60)"}
            >
              <IconButton
                onClick={handleClose}
                size="small"
                sx={{
                  zIndex: 2,
                  color: "red",
                  mr: 3,
                  mt: 1,
                  bgcolor: "gray",
                }}
                color="gray"
              >
                <Close sx={{ color: "#fff", fontSize: 13 }} />
              </IconButton>
            </Box>
            <PDFViewer width="100%" height="100%" frameBorder={0}>
              <ResultPDF />
            </PDFViewer>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
