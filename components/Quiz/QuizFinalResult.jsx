import { Visibility } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";
import React from "react";

const QuizFinalResult = ({ result, studentName, length, duration }) => {
  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <Box
        sx={{
          border: "none",
          py: 1,
          px: 3,
          bgcolor: "#fff",
          width: { xs: "100%", sm: "100%", md: "100%" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            mt: 2,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: "25px",
                fontWeight: "700",
                color: "#000",
                mb: 3,
              }}
            >
              {studentName}
            </Typography>
            <Typography
              sx={{
                fontSize: "18px",
                fontWeight: "500",
                color: "gray",
                mb: 1,
              }}
            >
              Points {result.correct} / {length}
            </Typography>
            <Typography
              sx={{
                fontSize: "18px",
                fontWeight: "500",
                color: "gray",
                mb: 1,
              }}
            >
              Duration {duration} mins
            </Typography>
            <Divider
              sx={{ borderWidth: 2, borderColor: "lightgray", mb: 1, mt: 3 }}
            />
            <Divider
              sx={{
                borderWidth: 2,
                borderColor: "lightgray",
                width: "80%",
                mb: 1,
              }}
            />
          </Box>
          {result.percentage > 50 ? (
            <img src={"/happy.jpg"} width={200} height={200} alt="happy" />
          ) : (
            <img src={"/sad.jpg"} width={250} height={250} alt="sad" />
          )}
        </Box>
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          mt={2}
        >
          <Box sx={{ position: "relative", display: "inline-flex" }}>
            <CircularProgress
              variant="determinate"
              color={
                result.percentage > 70
                  ? "success"
                  : result.percentage > 50
                  ? "primary"
                  : "error"
              }
              value={parseFloat(result.percentage)}
              size={"10rem"}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: "absolute",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="caption"
                component="div"
                sx={{ color: "text.secondary" }}
              >
                {result.percentage}%
              </Typography>
            </Box>
          </Box>
        </Box>
        <Typography
          sx={{
            fontSize: "18px",
            fontWeight: "600",
            color: "gray",
            mb: 1,
            mt: 3,
          }}
        >
          Answers
        </Typography>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          flexWrap={"wrap"}
        >
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: "400",
              color: "gray",
              mb: 1,
            }}
          >
            Attempted
          </Typography>
          <Chip label={result.attempted} />
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: "400",
              color: "gray",
              mb: 1,
            }}
          >
            Correct
          </Typography>
          <Chip label={result.correct} />
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: "400",
              color: "gray",
              mb: 1,
            }}
          >
            Incorrect
          </Typography>
          <Chip label={result.incorrect} />
        </Box>
      </Box>
    </Box>
  );
};

export default QuizFinalResult;
