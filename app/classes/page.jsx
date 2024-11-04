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

  const breadCrumbs = [
    { name: "Home", url: "/" },
    { name: "Classes", url: "#" },
  ];
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
            Classes
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
      <Box sx={{ mx: { xs: 0, sm: 10 } }} mt={5}>
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
              bgcolor={"#ffffff"}
            >
              <Box sx={{ width: 400 }}>
                <img src="/no_item.jpg" width={"100%"} height={350} />
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
