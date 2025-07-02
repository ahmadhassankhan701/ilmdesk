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
  const instructorImg1 = "/Currica/qasim.jpeg";
  const instructorImg2 = "/Currica/kashif.jpeg";
  const instructorImg3 = "/Currica/lady.jpeg";
  return (
    <Box
      sx={{
        backgroundColor: "#002935",
        my: 5,
        pt: 5,
        pb: 5,
      }}
      id="instructors"
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
            Learn from expert educators — bringing academic excellence to every
            lesson.
          </Typography>
        </Box>
        <Slider {...settings} className="slick_slider">
          <div>
            <InstructorCard
              title="Muhammad Qasim"
              subtitle="Competitive Chemistry Exams Teacher"
              image={instructorImg1}
            />
          </div>
          <div>
            <InstructorCard
              title="DR KASHIF KHAN"
              subtitle="Mdcat Biology Teacher"
              image={instructorImg2}
            />
          </div>
          <div>
            <InstructorCard
              title="Arfa Saleem"
              subtitle="Professional education and english teacher"
              image={instructorImg3}
            />
          </div>
          <div>
            <InstructorCard
              title="Muhammad Qasim"
              subtitle="Competitive Chemistry Exams Teacher"
              image={instructorImg1}
            />
          </div>
          <div>
            <InstructorCard
              title="DR KASHIF KHAN"
              subtitle="Mdcat Biology Teacher"
              image={instructorImg2}
            />
          </div>
          <div>
            <InstructorCard
              title="Arfa Saleem"
              subtitle="Professional education and english teacher"
              image={instructorImg3}
            />
          </div>
        </Slider>
      </Container>
    </Box>
  );
};

export default Instructor;
