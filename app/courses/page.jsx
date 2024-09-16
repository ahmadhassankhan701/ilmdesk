"use client";
import { NavigateNext, Search } from "@mui/icons-material";
import {
  Backdrop,
  Box,
  Breadcrumbs,
  Button,
  Divider,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import Link from "next/link";
import PCourseSlimCard from "@/components/PopularCourses/PCourseSlimCard";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import { toast } from "react-toastify";
const page = () => {
  const breadCrumbs = [
    { name: "Home", url: "/" },
    { name: "Courses", url: "#" },
  ];
  const [content, setContent] = useState([]);
  const [curriculum, setCurriculum] = useState({
    courses: [],
    subjects: [],
  });
  const [filter, setFilter] = useState({
    difficulty: "intermediate",
    category: "PPSC",
    subject: "Chemistry",
  });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchCurriculum = async () => {
      try {
        const docsRef = collection(db, "Curriculum");
        const snapshot = await getDocs(docsRef);
        let items = [];
        let subjectItems = [];
        if (snapshot.size !== 0) {
          snapshot.docs.map((doc) => {
            if (doc.data().type === "course") {
              items.push({ key: doc.id, value: doc.data().name });
            }
            if (doc.data().type === "subject") {
              subjectItems.push({ key: doc.id, value: doc.data().name });
            }
          });
        }
        setCurriculum({
          courses: items,
          subjects: subjectItems,
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchCurriculum();
    fetchContent();
  }, []);
  const fetchContent = async () => {
    try {
      setLoading(true);
      const docsRef = collection(db, "Course/PPSC/Chemistry");
      const q = query(docsRef, where("difficulty", "==", "intermediate"));
      const snapshot = await getDocs(q);
      let items = [];
      if (snapshot.size !== 0) {
        snapshot.docs.map((doc) => {
          if (items.includes(doc.data().courseTitle) === false) {
            items.push({ key: doc.id, ...doc.data() });
          }
        });
      }
      setContent(items);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Could not fetch content");
      console.log(error);
    }
  };
  const handleFilter = async () => {
    try {
      setLoading(true);
      const { category, subject, difficulty } = filter;
      const docsRef = collection(db, `Course/${category}/${subject}`);
      const q = query(docsRef, where("difficulty", "==", difficulty));
      const snapshot = await getDocs(q);
      let items = [];
      if (snapshot.size !== 0) {
        snapshot.docs.map((doc) => {
          if (items.includes(doc.data().courseTitle) === false) {
            items.push({ key: doc.id, ...doc.data() });
          }
        });
      }
      setContent(items);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Could not fetch content");
      console.log(error);
    }
  };
  return (
    <Box>
      <Box
        sx={{
          background: `url(/ResourcesTopBanner.png)`,
          backgroundColor: "#000000",
          backgroundSize: "cover",
          height: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          pl: 10,
          justifyContent: "center",
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: 48,
              fontWeight: 700,
              color: "#FFFFFF",
              mb: 1,
            }}
          >
            Courses
          </Typography>
          <Breadcrumbs
            separator={<NavigateNext fontSize="small" />}
            aria-label="breadcrumb"
            sx={{ color: "#fff" }}
          >
            {breadCrumbs.map((item, i) => (
              <Link
                href={item.url}
                key={i}
                style={{ color: "#fff", textDecoration: "none" }}
              >
                <Typography>{item.name}</Typography>
              </Link>
            ))}
          </Breadcrumbs>
        </Box>
      </Box>
      <Box sx={{ mx: { xs: 1, lg: 10 } }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <Box
              sx={{
                bgcolor: "#fff",
                borderRadius: 1,
                p: 2,
                mt: 5,
                boxShadow:
                  "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
              }}
            >
              <Typography
                sx={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#001920",
                }}
              >
                Difficulty Level
              </Typography>
              <Divider sx={{ my: 3 }} />
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="intermediate"
                name="radio-buttons-group"
                onChange={(e) =>
                  setFilter({ ...filter, difficulty: e.target.value })
                }
              >
                <FormControlLabel
                  value="beginner"
                  control={<Radio />}
                  label="Beginner"
                />
                <FormControlLabel
                  value="intermediate"
                  control={<Radio />}
                  label="Intermediate"
                />
                <FormControlLabel
                  value="expert"
                  control={<Radio />}
                  label="Expert"
                />
              </RadioGroup>
            </Box>
            <Box
              sx={{
                bgcolor: "#fff",
                borderRadius: 1,
                p: 2,
                mt: 2,
                boxShadow:
                  "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
              }}
            >
              <Typography
                sx={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#001920",
                }}
              >
                Category
              </Typography>
              <Divider sx={{ my: 3 }} />
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="PPSC"
                name="radio-buttons-group"
                onChange={(e) =>
                  setFilter({ ...filter, category: e.target.value })
                }
              >
                {curriculum.courses.map((course) => (
                  <FormControlLabel
                    key={course.key}
                    value={course.value}
                    control={<Radio />}
                    label={course.value}
                  />
                ))}
              </RadioGroup>
            </Box>
            <Box
              sx={{
                bgcolor: "#fff",
                borderRadius: 1,
                p: 2,
                mt: 2,
                boxShadow:
                  "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
              }}
            >
              <Typography
                sx={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#001920",
                }}
              >
                Subjects
              </Typography>
              <Divider sx={{ my: 3 }} />
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="Chemistry"
                name="radio-buttons-group"
                onChange={(e) =>
                  setFilter({ ...filter, subject: e.target.value })
                }
              >
                {curriculum.subjects.map((subject) => (
                  <FormControlLabel
                    key={subject.key}
                    value={subject.value}
                    control={<Radio />}
                    label={subject.value}
                  />
                ))}
              </RadioGroup>
            </Box>
            <Button
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                mt: 2,
                bgcolor: "#ff3158",
                "&:hover": {
                  bgcolor: "#f50366",
                },
                textTransform: "none",
              }}
              startIcon={<Search />}
              onClick={handleFilter}
            >
              Find
            </Button>
          </Grid>
          <Grid item xs={12} sm={9} mt={5}>
            <Grid container spacing={1}>
              <Backdrop
                sx={{
                  color: "#fff",
                  zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={loading}
              >
                <img src={"/loader.gif"} width={100} height={100} />
              </Backdrop>
              {Object.keys(content).length > 0 ? (
                content.map((item) => (
                  <Grid key={item.key} item xs={12} sm={6} lg={4}>
                    <Link
                      style={{ textDecoration: "none" }}
                      href={{
                        pathname: "/courses/details",
                        query: {
                          courseTitle: item.courseTitle,
                          course: item.course,
                          subject: item.subject,
                        },
                      }}
                    >
                      <PCourseSlimCard
                        image={item.image ? item.image : "/courseCategImg.jpg"}
                        category={item.course}
                        title={item.courseTitle}
                        number_of_ratings={item.ratings?.length}
                        rating={item.ratings?.length > 0 ? 4 : 0}
                        cost={item.cost}
                      />
                    </Link>
                  </Grid>
                ))
              ) : (
                <Box
                  width={"100%"}
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  bgcolor={"#ffffff"}
                >
                  <Box sx={{ width: { xs: "100%", sm: 400 } }}>
                    <img
                      src="/no_item.jpg"
                      width={"100%"}
                      height={350}
                      style={{ objectFit: "contain", objectPosition: "center" }}
                    />
                    <Typography
                      textAlign={"center"}
                      fontSize={16}
                      my={2}
                      fontWeight={"bold"}
                    >
                      No content available
                    </Typography>
                  </Box>
                </Box>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default page;
