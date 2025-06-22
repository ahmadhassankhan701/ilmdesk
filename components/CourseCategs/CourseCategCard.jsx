import {
  Alarm,
  ArrowForward,
  RateReview,
  Star,
  StarOutline,
} from "@mui/icons-material";
import { Box, Avatar, Typography, Button } from "@mui/material";
const CourseCategCard = ({
  image = "/heroCard2.png",
  title = "fgd",
  subtitle = "dfsfds",
}) => {
  return (
    <Box
      boxShadow={
        "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px"
      }
      sx={{
        height: 400,
        m: 2,
        mb: 5,
        borderRadius: 5,
        alignSelf: "center",
      }}
    >
      <img
        src={image}
        alt="course"
        style={{
          width: "100%",
          height: "50%",
          objectFit: "cover",
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        }}
      />
      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        sx={{ transform: "translateY(-30px)" }}
      >
        <img
          src="/courseCategIcon1.png"
          alt="course"
          style={{ width: 70, height: 70, borderRadius: "100%" }}
        />
      </Box>
      <Box
        sx={{
          px: 3,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          component={"h2"}
          sx={{
            fontSize: 20,
            fontWeight: 600,
            color: "rgb(0, 25, 32)",
            mt: 1,
          }}
        >
          COMPITITIVE EXAMS
        </Typography>
        <Box
          display={"flex"}
          alignItems={"center"}
          gap={1}
          sx={{ cursor: "pointer", my: 2 }}
        >
          <Typography
            sx={{
              color: "rgb(74, 83, 85)",
              fontSize: 15,
              fontWeight: 400,
              cursor: "pointer",
              textTransform: "none",
            }}
          >
            16 Courses
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default CourseCategCard;
