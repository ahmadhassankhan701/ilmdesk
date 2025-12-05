"use client";
import {
  Box,
  Card,
  CardContent,
  IconButton,
  InputBase,
  Paper,
  Skeleton,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Grid from "@mui/material/Grid2";
import SideBar from "@/components/SideBar";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import Link from "next/link";
import PCourseSlimCard from "@/components/PopularCourses/PCourseSlimCard";
const Courses = () => {
  const { state } = useAuth();
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [filteredcourses, setFilteredCourses] = useState([]);
  const [filterText, setFilterText] = useState("");
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const docsRef = collection(db, "courses");
        const q = query(
          docsRef,
          where("students", "array-contains", state.user.uid)
        );
        const snapshot = await getDocs(q);
        let items = [];
        if (snapshot.size !== 0) {
          snapshot.docs.map((doc) => {
            items.push({ key: doc.id, ...doc.data() });
          });
        }
        setCourses(items);
        setFilteredCourses(items);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error("Could not fetch courses");
        console.log(error);
      }
    };
    state && state.user && fetchContent();
  }, [state && state.user]);
  const handleFilter = async () => {
    try {
      setLoading(true);
      let newArr = [...courses];
      if (filterText !== "") {
        const filter = newArr?.filter((course) =>
          course.title
            .toLowerCase()
            .trim()
            .includes(filterText.toLowerCase().trim())
        );

        setFilteredCourses(filter);
      } else {
        setFilteredCourses(newArr);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Could not fetch courses");
      console.log(error);
    }
  };

  return (
    <Box display={"flex"} justifyContent={"center"}>
      <Box width={"100%"}>
        <SideBar>
          <Grid container spacing={1} mb={2} width={"100%"}>
            <Grid
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              size={12}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: 28,
                    fontWeight: "800",
                    color: "#A6A6A6",
                  }}
                >
                  Courses
                </Typography>
                <Typography
                  sx={{
                    fontSize: 16,
                    fontWeight: "800",
                    color: "#A0AAB4",
                  }}
                >
                  Find Your Courses here...
                </Typography>
              </Box>
              <Paper
                component="form"
                sx={{
                  p: "2px 4px",
                  display: "flex",
                  alignItems: "center",
                  width: 300,
                  borderRadius: 3,
                }}
              >
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="Search by Title"
                  inputProps={{ "aria-label": "search course" }}
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                />
                <IconButton
                  type="button"
                  sx={{ p: "10px" }}
                  aria-label="search"
                  onClick={handleFilter}
                >
                  <SearchIcon />
                </IconButton>
              </Paper>
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            {loading ? (
              // Show Skeleton while loading
              <Grid
                container
                spacing={2}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                width={"100%"}
              >
                {[...Array(3)].map((_, index) => (
                  <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                    <Card key={index} sx={{ mb: 2 }}>
                      <CardContent>
                        <Skeleton
                          variant="rectangular"
                          width={"100%"}
                          height={118}
                        />
                        <Skeleton variant="text" width={"80%"} height={30} />
                        <Skeleton variant="text" width={"80%"} height={30} />
                        <Skeleton variant="text" width={"50%"} height={30} />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : filteredcourses.length === 0 ? (
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
              filteredcourses.map((item) => (
                <Grid key={item.key} size={{ xs: 12, sm: 6, lg: 4 }}>
                  <Link
                    style={{ textDecoration: "none" }}
                    href={{
                      pathname: "/courses/modules",
                      query: {
                        id: item.key,
                      },
                    }}
                  >
                    <PCourseSlimCard data={item} />
                  </Link>
                </Grid>
              ))
            )}
          </Grid>
        </SideBar>
      </Box>
    </Box>
  );
};

export default Courses;
