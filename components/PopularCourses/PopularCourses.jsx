"use client";
import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import PCourseWideCard from "./PCourseWideCard";
import PCourseSlimCard from "./PCourseSlimCard";
import { useEffect, useState } from "react";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { db } from "@/firebase";

const PopularCourses = () => {
  const [content, setContent] = useState([]);
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const docsRef = collection(db, "CourseTheory");
        const q = query(docsRef, limit(3));
        const snapshot = await getDocs(q);
        let items = [];
        if (snapshot.empty) {
          return;
        }
        snapshot.docs.map((doc) => {
          items.push({ key: doc.id, ...doc.data() });
        });
        setContent(items);
      } catch (error) {
        setLoading(false);
        toast.error("Could not fetch content");
        console.log(error);
      }
    };
    fetchContent();
  }, []);
  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      flexDirection={"column"}
      mt={5}
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
        <span style={{ color: "#ff3158", marginLeft: 10 }}>Course</span>
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
        Find the perfect course to match your goals and interests. From
        foundational to advanced levels, our programs support every stage of
        learning.​ Begin your journey today and achieve your full potential
        through guided learning.
      </Typography>
      <Box sx={{ mt: 5, width: "100%" }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, lg: 6 }}>
            {content.length > 0 ? (
              <PCourseWideCard
                image={content[0].image || "/popularCourseWideCard.jpg"}
                title={content[0].title}
                subject={content[0].subject}
                author={"Muhammad Qasim"}
                authorImage={"/Currica/qasim.jpeg"}
              />
            ) : (
              <PCourseWideCard
                image={"/popularCourseWideCard.jpg"}
                title={"Competitive Chemistry"}
                subject={"Chemistry"}
                author={"Muhammad Qasim"}
                authorImage={"/Currica/qasim.jpeg"}
              />
            )}
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            {content.length > 1 ? (
              <PCourseSlimCard
                data={{
                  image: content[1].image,
                  title: content[1].title,
                  subtitle: "View More",
                  subject: content[1].subject,
                  number_of_ratings: 3,
                  authorImage: "/Currica/qasim.jpeg",
                  author: "Muhammad Qasim",
                  price: content[1].price,
                }}
              />
            ) : (
              <PCourseSlimCard
                data={{
                  image: "/popularCourseCard1.jpg",
                  title: "10K+ Online Courses",
                  subtitle: "View More",
                  subject: "Chemistry",
                  number_of_ratings: 3,
                  authorImage: "/Currica/qasim.jpeg",
                  author: "Muhammad Qasim",
                  price: "5000",
                }}
              />
            )}
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            {content.length > 2 ? (
              <PCourseSlimCard
                data={{
                  image: content[2].image,
                  title: content[2].title,
                  subtitle: "View More",
                  subject: content[2].subject,
                  number_of_ratings: 3,
                  authorImage: "/Currica/qasim.jpeg",
                  author: "Muhammad Qasim",
                  price: content[2].price,
                }}
              />
            ) : (
              <PCourseSlimCard
                data={{
                  image: "/popularCourseCard1.jpg",
                  title: "10K+ Online Courses",
                  subtitle: "View More",
                  subject: "Chemistry",
                  number_of_ratings: 3,
                  authorImage: "/Currica/qasim.jpeg",
                  author: "Muhammad Qasim",
                  price: "5000",
                }}
              />
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default PopularCourses;
