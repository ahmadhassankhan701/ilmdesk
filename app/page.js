"use client";
import Achievement from "@/components/Achievements/Achievement";
import Event from "@/components/Events/Event";
import CourseCateg from "@/components/CourseCategs/CourseCateg";
import TopHeroCards from "@/components/HeroCards/TopHeroCards";
import PopularCourses from "@/components/PopularCourses/PopularCourses";
import {
  FacebookOutlined,
  Instagram,
  LinkedIn,
  Twitter,
} from "@mui/icons-material";
import { Typography } from "@mui/material";
import { Box, Button } from "@mui/material";
import Instructor from "@/components/Instructors/Instructor";
import Blog from "@/components/Blogs/Blog";

export default function Home() {
  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      flexDirection={"column"}
    >
      <Box
        sx={{
          backgroundImage: `url(/homeBanner.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "950px",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          width: "100%",
          alignItems: "center",
        }}
      >
        <Box display={"flex"} alignItems={"center"} gap={10} width={"80%"}>
          <Box
            sx={{ display: { sm: "flex", xs: "none" } }}
            flexDirection={"column"}
            alignItems={"center"}
            gap={2}
          >
            <FacebookOutlined sx={{ color: "#fff", fontSize: 24 }} />
            <Twitter sx={{ color: "#fff", fontSize: 24 }} />
            <Instagram sx={{ color: "#fff", fontSize: 24 }} />
            <LinkedIn sx={{ color: "#fff", fontSize: 24 }} />
            <Typography
              variant="p"
              sx={{
                fontSize: 16,
                fontWeight: 700,
                lineHeight: 1,
                color: "#fff",
                display: "inline-block",
                writingMode: "vertical-lr",
                transform: "rotate(180deg)",
                textAlign: "center",
              }}
            >
              <span
                style={{
                  width: 2,
                  height: 32,
                  marginBottom: 5,
                  display: "inline-block",
                  background: "#ff3158",
                }}
              ></span>
              Let's keep in touch
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="h1"
              sx={{
                display: "flex",
                alignItems: "center",
                fontSize: 18,
                fontWeight: 800,
                color: "#ff3158",
                textTransform: "capitalize",
                paddingBottom: 1,
                lineHeight: 1.5,
              }}
            >
              <img src="/dot.png" alt="dot" width={36} height={36} />
              The Leader in Online Learning
            </Typography>
            <Typography
              variant="h2"
              component={"h2"}
              sx={{
                fontSize: {
                  xs: 40,
                  sm: 60,
                },
                fontWeight: 800,
                color: "#fff",
                letterSpacing: -0.8,
                textTransform: "uppercase",
                my: 2,
                lineHeight: 1.5,
              }}
            >
              Explore Live <br /> Creative Classes
            </Typography>
            <Typography
              variant="p"
              component={"p"}
              sx={{
                fontSize: "18px",
                maxWidth: 620,
                paddingTop: 2,
                paddingBottom: 10,
                color: "#ccc",
                fontWeight: 400,
              }}
            >
              Architect client-centered total linkage for intuitive benefits
              restore convergence before real-time partnerships.
            </Typography>
            <Box
              display={"flex"}
              alignItems={"center"}
              sx={{
                gap: {
                  xs: 1,
                  sm: 3,
                },
              }}
            >
              <Button
                variant={"contained"}
                size="large"
                sx={{
                  bgcolor: "#ff3158",
                  fontSize: { xs: 12, sm: 16 },
                  "&:hover": {
                    bgcolor: "#f50366",
                  },
                }}
              >
                Get Started
              </Button>
              <Button
                size={"large"}
                variant={"outlined"}
                sx={{
                  borderColor: "#ff3158",
                  color: "#ff3158",
                  fontSize: { xs: 12, sm: 16 },
                  "&:hover": {
                    color: "#f50366",
                    borderColor: "#f50366",
                  },
                }}
              >
                Explore More
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box sx={{ width: { xs: "95%", md: "80%" } }}>
        <TopHeroCards />
        <PopularCourses />
        <CourseCateg />
        <Box sx={{ background: `url("/eventsBg.png")` }}>
          <Box
            sx={{
              transform: "translateY(-200px)",
            }}
          >
            <Achievement />
          </Box>
          <Event />
        </Box>
        <Instructor />
        <Blog />
      </Box>
    </Box>
  );
}
