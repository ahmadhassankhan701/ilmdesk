"use client";
import SubjectCard from "@/components/SpecialCards/SubjectCard";
import { db } from "@/firebase";
import { NavigateNext } from "@mui/icons-material";
import { Box, Breadcrumbs, Grid, Typography } from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const page = () => {
  const [classes, setClasses] = useState([]);
  useEffect(() => {
    const fetchClasses = async () => {
      const docsRef = collection(db, "Curriculum");
      const snapshot = await getDocs(docsRef);
      let items = [];
      if (snapshot.size !== 0) {
        snapshot.docs.map((doc) => {
          if (doc.data().type === "class") {
            items.push({
              key: doc.id,
              classname: doc.data().name,
              subjects: doc.data().subjects,
            });
          }
        });
      }
      setClasses(items);
    };
    fetchClasses();
  }, []);

  return (
    <Box display={"flex"} justifyContent={"center"}>
      <Box sx={{ mx: { xs: 0, sm: 10 } }} mt={15} width={"80%"}>
        <Grid container spacing={2}>
          {Object.keys(classes).length > 0 ? (
            classes.map((classo) => (
              <Grid item xs={12} sm={6} md={4} key={classo.key}>
                <SubjectCard
                  image="/Currica/chemistry_subject.jpg"
                  title={classo.classname}
                  subjects={classo.subjects}
                />
              </Grid>
            ))
          ) : (
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
                  No classes available yet
                </Typography>
              </Box>
            </Box>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default page;
