"use client";
import { db } from "@/firebase";
import { ExpandMore, Topic } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Skeleton,
  Typography,
} from "@mui/material";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState, Suspense, useCallback } from "react";
import { Backdrop } from "@mui/material";

const ModulesPage = () => {
  const route = useRouter();
  const searchParam = useSearchParams();
  const courseId = searchParam.get("id");
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchModules = useCallback(async () => {
    if (!courseId) {
      route.back();
      return;
    }
    try {
      setLoading(true);
      const modulesRef = doc(db, "courses", courseId);
      const docSnapshot = await getDoc(modulesRef);
      if (!docSnapshot.exists()) {
        console.error("Course not found");
        route.back();
        return;
      }
      const courseData = docSnapshot.data();
      setModules(courseData.modules || []);
    } catch (error) {
      console.error("Error fetching modules", error);
    } finally {
      setLoading(false);
    }
  }, [courseId, route]);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  return (
    <Box>
      {loading ? (
        // Show Skeleton while loading
        <Box display={"flex"} justifyContent={"center"}>
          <Box sx={{ mx: { xs: 0, sm: 10 } }} mt={15} width={"80%"}>
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
                      <Skeleton variant="text" width={"80%"} height={30} />
                      <Skeleton variant="text" width={"80%"} height={30} />
                      <Skeleton variant="text" width={"50%"} height={30} />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      ) : modules.length === 0 ? (
        <Box
          width={"100%"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          mt={15}
        >
          <Box sx={{ width: 400 }}>
            <img src="/no_item.png" width={"100%"} height={"auto"} />
            <Typography
              textAlign={"center"}
              fontSize={16}
              my={2}
              fontWeight={"bold"}
            >
              No modules available yet
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box display={"flex"} justifyContent={"center"}>
          <Box sx={{ mx: { xs: 0, sm: 10 } }} mt={15} width={"80%"}>
            <Typography
              sx={{
                fontSize: 24,
                fontWeight: 800,
                color: "gray",
                mt: 1,
              }}
            >
              Modules
            </Typography>
            <Box mt={5}>
              {modules.map((item) => (
                <Link
                  key={item.id}
                  href={{
                    pathname: "/courses/content",
                    query: {
                      id: item.id,
                      courseId: courseId, // Pass the courseId to the content page
                    },
                  }}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    marginBottom: 10,
                  }}
                >
                  <Accordion sx={{ mb: 1 }}>
                    <AccordionSummary
                      aria-controls="panel2-content"
                      id="panel2-header"
                    >
                      {item.name}
                    </AccordionSummary>
                  </Accordion>
                </Link>
              ))}
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};
const PageWrapper = () => (
  <Suspense
    fallback={
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
      >
        <img src={"/loader.gif"} width={100} height={100} />
      </Backdrop>
    }
  >
    <ModulesPage />
  </Suspense>
);
export default PageWrapper;
