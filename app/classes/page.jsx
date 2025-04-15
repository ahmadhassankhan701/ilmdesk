"use client";
import SubjectCard from "@/components/SpecialCards/SubjectCard";
import { db } from "@/firebase";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";

const page = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchClasses = async () => {
    try {
      setLoading(true);
      const classesSnapshot = await getDocs(collection(db, "classes"));
      const subjectsSnapshot = await getDocs(collection(db, "subjects"));

      // Convert snapshots to arrays
      const classesArray = classesSnapshot.docs.map((doc) => ({
        key: doc.id,
        ...doc.data(),
      }));

      const subjectsArray = subjectsSnapshot.docs.map((doc) => ({
        key: doc.id,
        ...doc.data(),
      }));

      // Create structured array
      const structuredData = classesArray.map((cls) => ({
        classId: cls.key,
        className: cls.name,
        subjects: subjectsArray.filter((subj) => subj.classID === cls.key),
      }));
      setLoading(false);
      return structuredData;
    } catch (error) {
      setLoading(false);
      console.error("Error fetching classes and subjects:", error);
    }
  };
  useEffect(() => {
    fetchClasses().then((data) => {
      setClasses(data);
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
                      <Skeleton variant="text" width={200} height={30} />
                      <Skeleton variant="text" width={150} height={20} />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      ) : classes.length === 0 ? (
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
              No classes available yet
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box display={"flex"} justifyContent={"center"}>
          <Box sx={{ mx: { xs: 0, sm: 10 } }} mt={15} width={"80%"}>
            <Grid container spacing={2}>
              {classes.map((classo) => (
                <Grid item xs={12} sm={6} md={4} key={classo.classId}>
                  <SubjectCard
                    image="/Currica/chemistry_subject.jpg"
                    title={classo.className}
                    subjects={classo.subjects}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default page;
