"use client";
import { NavigateNext, Search } from "@mui/icons-material";
import {
  Backdrop,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Divider,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Skeleton,
  Typography,
} from "@mui/material";
import Link from "next/link";
import PCourseSlimCard from "@/components/PopularCourses/PCourseSlimCard";
import { useEffect, useState } from "react";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import { toast } from "react-toastify";
const page = () => {
  const breadCrumbs = [
    { name: "Home", url: "/" },
    { name: "Courses", url: "#" },
  ];
  const [content, setContent] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [filter, setFilter] = useState({
    difficulty: "beginner",
    subject: "chemistry",
  });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const docsRef = collection(db, "subjects");
        const snapshot = await getDocs(docsRef);
        let items = [];
        if (snapshot.size !== 0) {
          snapshot.docs.map((doc) => {
            if (items.includes(doc.data().name) === false) {
              items.push(doc.data().name);
            }
          });
        }
        setSubjects(items);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSubjects();
    fetchContent();
  }, []);
  const fetchContent = async () => {
    try {
      setLoading(true);
      const docsRef = collection(db, "courses");
      const q = query(docsRef, limit(6));
      const snapshot = await getDocs(q);
      let items = [];
      if (snapshot.size !== 0) {
        snapshot.docs.map((doc) => {
          items.push({ key: doc.id, ...doc.data() });
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
      const { subject, difficulty } = filter;
      const docsRef = collection(db, "courses");
      const q = query(
        docsRef,
        where("difficulty", "==", `${difficulty}`),
        where("subject", "==", `${subject}`)
      );
      const snapshot = await getDocs(q);
      let items = [];
      if (snapshot.size !== 0) {
        snapshot.docs.map((doc) => {
          items.push({ key: doc.id, ...doc.data() });
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
          height: "40vh",
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
                defaultValue="beginner"
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
                Subjects
              </Typography>
              <Divider sx={{ my: 3 }} />
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="chemistry"
                name="radio-buttons-group"
                onChange={(e) =>
                  setFilter({ ...filter, subject: e.target.value })
                }
              >
                {subjects.map((subject, idx) => (
                  <FormControlLabel
                    key={idx}
                    value={subject}
                    control={<Radio />}
                    label={subject}
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
            {loading ? (
              // Show Skeleton while loading
              <Box display={"flex"} justifyContent={"center"}>
                <Box sx={{ mx: { xs: 0, sm: 10 } }} width={"80%"}>
                  <Grid container spacing={2}>
                    {[...Array(3)].map((_, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card key={index} sx={{ mb: 2 }}>
                          <CardContent>
                            <Skeleton
                              variant="rectangular"
                              width={"100%"}
                              height={118}
                            />
                            <Skeleton
                              variant="text"
                              width={"80%"}
                              height={30}
                            />
                            <Skeleton
                              variant="text"
                              width={"80%"}
                              height={30}
                            />
                            <Skeleton
                              variant="text"
                              width={"50%"}
                              height={30}
                            />
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Box>
            ) : content.length === 0 ? (
              <Box
                width={"100%"}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Box sx={{ width: 400 }}>
                  <img src="/no_item.png" width={"100%"} height={"auto"} />
                  <Typography
                    textAlign={"center"}
                    fontSize={16}
                    my={2}
                    fontWeight={"bold"}
                  >
                    No course available yet
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Grid container spacing={1}>
                <Backdrop
                  sx={{
                    color: "#fff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                  }}
                  open={loading}
                >
                  <img src={"/loader.gif"} />
                </Backdrop>
                {content.map((item) => (
                  <Grid key={item.key} item xs={12} sm={6} lg={4}>
                    <Link
                      style={{ textDecoration: "none" }}
                      href={{
                        pathname: "/courses/details",
                        query: {
                          id: item.key,
                        },
                      }}
                    >
                      <PCourseSlimCard data={item} />
                    </Link>
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default page;
