import { Alarm, Star, StarOutline } from "@mui/icons-material";
import { Box, Avatar, Typography, Button } from "@mui/material";
const PCourseWideCard = ({
  image,
  title = "Nutrition: Build Your Perfect Diet & Meal Plan",
  subject = "nutrition",
  author = "Muhammad Qasim",
  authorImage,
}) => {
  const avatar = "/avatar.png";

  return (
    <Box
      display={"flex"}
      gap={3}
      alignItems={"center"}
      boxShadow={
        "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px"
      }
      sx={{
        backgroundImage: `url("${
          image ? image : "/popularCourseWideCard.jpg"
        }")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: 420,
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        width: "100%",
        borderRadius: 5,
        position: "relative",
        "&::after": {
          position: "absolute",
          content: '""',
          width: "100%",
          height: "100%",
          left: 0,
          top: 0,
          pointerEvents: "none",
          borderRadius: 5,
          background:
            "linear-gradient(360deg, #001920 0%, rgba(0, 25, 32, 0) 100%)",
        },
      }}
    >
      <Box
        sx={{
          padding: "40px 30px",
          position: "absolute",
          content: '""',
          width: "100%",
          bottom: 0,
          left: 0,
          zIndex: 1,
        }}
      >
        <Box display={"flex"} gap={2} alignItems={"center"}>
          <Button
            variant="contained"
            size="small"
            sx={{
              bgcolor: "#FF3158",
              textTransform: "none",
              "&:hover": {
                bgcolor: "#FF3158",
              },
            }}
          >
            {subject}
          </Button>
          <Box display={"flex"} color={"white"} gap={1} alignItems={"center"}>
            <Alarm sx={{ color: "white" }} />
            <Typography color={"white"} fontSize={14} fontWeight={"bold"}>
              4 hours
            </Typography>
          </Box>
        </Box>
        <Typography
          component={"h2"}
          sx={{
            fontSize: 22,
            fontWeight: 800,
            color: "white",
            my: 2,
          }}
        >
          {title}
        </Typography>
        <Box display={"flex"} gap={2}>
          <Box display={"flex"} alignItems={"center"} gap={1}>
            <Avatar
              src={authorImage ? authorImage : avatar}
              sx={{ bgcolor: "transparent" }}
            />
          </Box>
          <Box>
            <Typography
              sx={{
                fontWeight: "700",
                fontSize: 16,
                paddingBottom: 1,
                color: "white",
              }}
            >
              {author}
            </Typography>
            <Box
              display={"flex"}
              alignItems={"center"}
              gap={1}
              sx={{ cursor: "pointer" }}
            >
              <Typography
                sx={{
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  textTransform: "none",
                }}
              >
                5 ratings
              </Typography>
              <Star sx={{ color: "rgb(255, 164, 27)", fontSize: 14 }} />
              <Star sx={{ color: "rgb(255, 164, 27)", fontSize: 14 }} />
              <Star sx={{ color: "rgb(255, 164, 27)", fontSize: 14 }} />
              <StarOutline sx={{ color: "rgb(255, 164, 27)", fontSize: 14 }} />
              <StarOutline sx={{ color: "rgb(255, 164, 27)", fontSize: 14 }} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PCourseWideCard;
