import { Box, Typography, Grid, Container } from "@mui/material";
import CourseCategCard from "./CourseCategCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
const CourseCateg = () => {
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
  const courseCategImg = "/courseCategImg.jpg";
  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      flexDirection={"column"}
      sx={{
        backgroundImage: `url("/courseCategBg.png")`,
        my: 15,
        pt: 15,
        pb: 20,
      }}
    >
      <Typography
        component="h2"
        sx={{
          fontWeight: "800",
          fontSize: { xs: 26, sm: 36 },
          lineHeight: 1.2,
          paddingBottom: 1,
          color: "#000",
          textAlign: "center",
        }}
      >
        Our Courses
        <span style={{ color: "#ff3158", marginLeft: 10 }}>Categories</span>
      </Typography>
      <Typography
        sx={{
          fontWeight: "400",
          fontSize: 16,
          lineHeight: 1.5,
          paddingBottom: 1,
          color: "#4A5355",
          maxWidth: 650,
          mt: 1,
          textAlign: "center",
        }}
      >
        Browse a wide range of course categories designed to meet diverse
        learning needs.
      </Typography>
      <Container sx={{ my: 5 }}>
        <Slider {...settings} className="slick_slider">
          <div>
            <CourseCategCard title="Business" image={courseCategImg} />
          </div>
          <div>
            <CourseCategCard title="Business" image={courseCategImg} />
          </div>
          <div>
            <CourseCategCard title="Business" image={courseCategImg} />
          </div>
          <div>
            <CourseCategCard title="Business" image={courseCategImg} />
          </div>
          <div>
            <CourseCategCard title="Business" image={courseCategImg} />
          </div>
          <div>
            <CourseCategCard title="Business" image={courseCategImg} />
          </div>
        </Slider>
      </Container>
    </Box>
  );
};

export default CourseCateg;
