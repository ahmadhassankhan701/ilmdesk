import { Box, Typography, Grid, Container } from "@mui/material";
import BlogCard from "./BlogCard";

const Blog = () => {
  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      flexDirection={"column"}
      mt={10}
    >
      <Typography
        component="h2"
        sx={{
          fontWeight: "800",
          fontSize: 36,
          lineHeight: 1.2,
          paddingBottom: 1,
          color: "#000",
          textAlign: "center",
        }}
      >
        Most Popular
        <span style={{ color: "#ff3158", marginLeft: 10 }}>Blogs</span>
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
        SSL for your site is a no-brainer best practice. Not only does an SSL
        help your visitors feel safe interacting with your site—this is
        particularly important if you run an e-commerce site.
      </Typography>
      <Container sx={{ mt: 5 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <BlogCard
              image={"/popularCourseCard1.jpg"}
              title={"10K+ Online Courses"}
              subtitle={"View More"}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <BlogCard
              image={"/popularCourseCard1.jpg"}
              title={"10K+ Online Courses"}
              subtitle={"View More"}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <BlogCard
              image={"/popularCourseCard2.jpg"}
              title={"Expert Instructor"}
              subtitle={"View More"}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Blog;
