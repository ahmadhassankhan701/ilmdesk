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
import PageTitle from "@/components/Dashboard/PageTitle";
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
    <Box>
        <SideBar>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: { xs: "stretch", md: "flex-end" }, gap: 2, flexDirection: { xs: "column", md: "row" } }}>
            <PageTitle eyebrow="Learning" title="Courses" body="Courses you are enrolled in." />
            <Paper
              component="form"
              onSubmit={(event) => {
                event.preventDefault();
                handleFilter();
              }}
              sx={{
                mb: { md: 3.5 },
                p: "4px 6px",
                display: "flex",
                alignItems: "center",
                width: { xs: "100%", md: 280 },
                borderRadius: 999,
                boxShadow: "none",
                border: "1px solid rgba(17,17,19,0.08)",
              }}
            >
              <InputBase
                sx={{ ml: 1.5, flex: 1, fontSize: 14 }}
                placeholder="Search by title"
                inputProps={{ "aria-label": "search course" }}
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
              />
              <IconButton type="submit" sx={{ p: "8px" }} aria-label="search" onClick={handleFilter}>
                <SearchIcon />
              </IconButton>
            </Paper>
          </Box>
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
              <Box sx={{ bgcolor: "#fff", borderRadius: "22px", p: 3, width: "100%" }}>
                <Typography sx={{ fontWeight: 700, color: "#0A192F" }}>No enrolled courses yet.</Typography>
                <Typography sx={{ color: "#5C6B7A", mt: 0.75 }}>
                  A course appears here after a payment is approved.
                </Typography>
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
  );
};

export default Courses;
