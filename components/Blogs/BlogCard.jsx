import {
  ArrowForwardOutlined,
  CalendarTodayOutlined,
  ChatBubbleOutline,
} from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
const BlogCard = ({ image = "/heroCard2.png", title = "Blog" }) => {
  return (
    <Box
      boxShadow={
        "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px"
      }
      sx={{
        height: 420,
        width: "100%",
        borderRadius: 5,
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
        sx={{
          padding: "15px 30px",
          width: "100%",
        }}
      >
        <Box display={"flex"} gap={2} alignItems={"center"}>
          <Box display={"flex"} color={"white"} gap={1} alignItems={"center"}>
            <CalendarTodayOutlined sx={{ color: "red", fontSize: 14 }} />
            <Typography color={"red"} fontSize={12} fontWeight={"500"}>
              July 1, 2025
            </Typography>
          </Box>
          <Box display={"flex"} color={"white"} gap={1} alignItems={"center"}>
            <ChatBubbleOutline sx={{ color: "red", fontSize: 14 }} />
            <Typography color={"red"} fontSize={12} fontWeight={"500"}>
              0
            </Typography>
          </Box>
        </Box>
        <Typography
          component={"h2"}
          sx={{
            fontSize: 22,
            fontWeight: 600,
            color: "rgb(0, 25, 32)",
            my: 2,
          }}
        >
          {title}
        </Typography>
        <Box display={"flex"} gap={0.5}>
          <Typography
            sx={{
              fontWeight: "700",
              fontSize: 14,
              color: "#002935",
            }}
          >
            Explore More
          </Typography>
          <ArrowForwardOutlined sx={{ color: "#ff3158", fontSize: 20 }} />
        </Box>
      </Box>
    </Box>
  );
};

export default BlogCard;
