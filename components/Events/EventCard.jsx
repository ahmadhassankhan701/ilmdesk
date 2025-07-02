import {
  Alarm,
  ArrowCircleRightOutlined,
  AssignmentInd,
} from "@mui/icons-material";
import { Box, Avatar, Typography, Grid, Container } from "@mui/material";
const EventCard = ({
  title = "Competitive Exams",
  difficulty = "Beginner",
}) => {
  return (
    <Container
      sx={{
        borderRadius: 2,
        bgcolor: "#fff",
        py: 5,
        my: 2,
        boxShadow:
          "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
      }}
    >
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          sm={3}
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Box
            sx={{
              borderRadius: 10,
              position: "relative",
            }}
          >
            <Avatar
              src="/avatar.png"
              sx={{ width: 200, height: 200, alignSelf: "center" }}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                bgcolor: "rgb(0, 25, 32)",
                borderRadius: "100%",
                position: "absolute",
                top: -30,
                right: -30,
                px: 2,
                py: 1,
              }}
            >
              <Typography
                component={"h2"}
                sx={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: "white",
                  mt: 1,
                }}
              >
                1
              </Typography>
              <Box
                display={"flex"}
                alignItems={"center"}
                gap={1}
                sx={{
                  cursor: "pointer",
                  mb: 2,
                  color: "white",
                  fontSize: 12,
                  fontWeight: 500,
                }}
              >
                <Typography>Dec, 2025</Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={9}>
          <Box
            sx={{
              padding: "15px 30px",
              width: "100%",
            }}
          >
            <Typography
              component={"h2"}
              sx={{
                fontSize: 28,
                fontWeight: 700,
                color: "rgb(0, 25, 32)",
                my: 2,
                maxWidth: 480,
              }}
            >
              {title}
            </Typography>
            <Box display={"flex"} gap={2} alignItems={"center"} my={4}>
              <Box
                display={"flex"}
                color={"white"}
                gap={1}
                alignItems={"center"}
              >
                <Alarm sx={{ color: "#4A5355" }} />
                <Typography color={"#4A5355"} fontSize={14} fontWeight={"500"}>
                  4 hours
                </Typography>
              </Box>
              <Box
                display={"flex"}
                color={"white"}
                gap={1}
                alignItems={"center"}
              >
                <AssignmentInd sx={{ color: "#4A5355" }} />
                <Typography color={"#4A5355"} fontSize={14} fontWeight={"500"}>
                  {difficulty}
                </Typography>
              </Box>
            </Box>
            <Box
              display={"flex"}
              alignItems={"center"}
              gap={1}
              sx={{ cursor: "pointer", my: 2 }}
            >
              <Box
                display={"flex"}
                color={"white"}
                gap={1}
                alignItems={"center"}
              >
                <ArrowCircleRightOutlined sx={{ color: "red", fontSize: 40 }} />
                <Typography color={"#4A5355"} fontSize={16} fontWeight={700}>
                  More Information
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EventCard;
