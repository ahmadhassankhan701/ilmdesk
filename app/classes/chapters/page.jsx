"use client";
import { db } from "@/firebase";
import {
  ExpandMore,
  Folder,
  NavigateNext,
  Topic,
  TopicOutlined,
  TopicRounded,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Breadcrumbs,
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
import { collection, getDocs, query, where } from "firebase/firestore";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState, Suspense } from "react";
import { Backdrop } from "@mui/material";

const ChaptersPage = () => {
  const route = useRouter();
  const searchParam = useSearchParams();
  const branchId = searchParam.get("id");
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchChapters = async () => {
    if (!branchId) {
      route.back();
      return;
    }
    try {
      setLoading(true);
      const docsRef = collection(db, "chapters");
      const q = query(docsRef, where("branchID", "==", branchId));
      const chaptersSnapshot = await getDocs(q);
      const topicsSnapshot = await getDocs(collection(db, "topics"));

      // Convert snapshots to arrays
      const chaptersArray = chaptersSnapshot.docs.map((doc) => ({
        key: doc.id,
        ...doc.data(),
      }));

      const topicsArray = topicsSnapshot.docs.map((doc) => ({
        key: doc.id,
        ...doc.data(),
      }));

      // Create structured array
      const structuredData = chaptersArray.map((chapter) => ({
        chapterId: chapter.key,
        chapterName: chapter.name,
        topics: topicsArray.filter((topic) => topic.chapterID === chapter.key),
      }));
      setLoading(false);
      return structuredData;
    } catch (error) {
      setLoading(false);
      console.error("Error fetching classes and subjects:", error);
    }
  };
  useEffect(() => {
    fetchChapters().then((data) => {
      setChapters(data);
    });
  }, []);

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
      ) : chapters.length === 0 ? (
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
              No chapters available yet
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box display={"flex"} justifyContent={"center"}>
          <Box sx={{ mx: { xs: 0, sm: 10 } }} mt={15} width={"80%"}>
            <Typography
              sx={{
                fontSize: 20,
                fontWeight: 800,
                color: "gray",
                mt: 1,
              }}
            >
              {chapters.length} chapters
            </Typography>
            <Box mt={5}>
              {chapters.map((item) => (
                <Accordion key={item.chapterId}>
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel2-content"
                    id="panel2-header"
                  >
                    {item.chapterName}
                  </AccordionSummary>
                  {item.topics.length === 0 ? (
                    <AccordionDetails>
                      <Typography fontSize={15} color={"gray"}>
                        No topic here
                      </Typography>
                    </AccordionDetails>
                  ) : (
                    <AccordionDetails>
                      <List>
                        {item.topics.map((topic) => (
                          <Link
                            key={topic.key}
                            href={{
                              pathname: "/classes/details",
                              query: {
                                id: topic.key,
                              },
                            }}
                            style={{
                              textDecoration: "none",
                              color: "inherit",
                            }}
                          >
                            <ListItem disablePadding>
                              <ListItemButton>
                                <ListItemIcon>
                                  <Topic />
                                </ListItemIcon>
                                <ListItemText primary={topic.name} />
                              </ListItemButton>
                            </ListItem>
                          </Link>
                        ))}
                      </List>
                    </AccordionDetails>
                  )}
                </Accordion>
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
    <ChaptersPage />
  </Suspense>
);
export default PageWrapper;
