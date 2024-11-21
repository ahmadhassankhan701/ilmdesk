import { Box, Typography, Grid, Container } from "@mui/material";
import InstructorCard from "./InstructorCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
const Instructor = () => {
  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    slidesToShow: 3,
    speed: 500,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  const courseCategImg = "/instructor1.jpg";
  return (
    <Box
      sx={{
        backgroundColor: "#002935",
        my: 5,
        pt: 5,
        pb: 5,
      }}
    >
      <Container sx={{ my: 5 }}>
        <Box>
          <Typography
            component="h2"
            sx={{
              fontWeight: "800",
              fontSize: { xs: 26, sm: 36 },
              lineHeight: 1.2,
              paddingBottom: 1,
              color: "#fff",
              ml: 1,
            }}
          >
            Our Expert
            <span style={{ color: "#ff3158", marginLeft: 10 }}>
              Instructors
            </span>
          </Typography>
          <Typography
            sx={{
              fontWeight: "400",
              fontSize: 16,
              lineHeight: 1.5,
              paddingBottom: 5,
              color: "#fff",
              maxWidth: 650,
              mt: 1,
              ml: 1,
            }}
          >
            Architect client-centered total linkage for intuitive benefits.
            Dynamically restore before real-time partnerships total linkage for
            intuitive benefits
          </Typography>
        </Box>
        <Slider {...settings} className="slick_slider">
          <div>
            <InstructorCard title="Business" image={courseCategImg} />
          </div>
          <div>
            <InstructorCard title="Business" image={courseCategImg} />
          </div>
          <div>
            <InstructorCard title="Business" image={courseCategImg} />
          </div>
          <div>
            <InstructorCard title="Business" image={courseCategImg} />
          </div>
          <div>
            <InstructorCard title="Business" image={courseCategImg} />
          </div>
          <div>
            <InstructorCard title="Business" image={courseCategImg} />
          </div>
        </Slider>
      </Container>
    </Box>
  );
};

export default Instructor;
