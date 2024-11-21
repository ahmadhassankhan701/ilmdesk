"use client";
import BranchCard from "@/components/SpecialCards/BranchCard";
import { db } from "@/firebase";
import { NavigateNext } from "@mui/icons-material";
import { Backdrop, Box, Breadcrumbs, Grid, Typography } from "@mui/material";
import { collection, getDocs, query, where } from "firebase/firestore";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";

const BranchesPage = () => {
  const route = useRouter();
  const searchParam = useSearchParams();
  const selectedClass = searchParam.get("selectedClass");
  const subject = searchParam.get("subject");
  const [branches, setBranches] = useState([]);
  useEffect(() => {
    const fetchBranches = async () => {
      if (!selectedClass || !subject) {
        route.back();
        return;
      }
      const docsRef = collection(db, `Quiz`);
      const q = query(
        docsRef,
        where("class", "==", selectedClass),
        where("subject", "==", subject)
      );
      const snapshot = await getDocs(q);
      let branchesArray = [];
      if (snapshot.size !== 0) {
        snapshot.forEach((doc) => {
          if (branchesArray.includes(doc.data().branch) == false) {
            branchesArray.push(doc.data().branch);
          }
        });
        setBranches(branchesArray);
      }
    };
    fetchBranches();
  }, []);

  const breadCrumbs = [
    { name: "Home", url: "/" },
    { name: "Classes", url: "/classes/" },
    { name: "Branches", url: "#" },
  ];
  return (
    <Box display={"flex"} justifyContent={"center"}>
      <Box sx={{ mx: { xs: 0, sm: 10 } }} mt={15} width={"80%"}>
        <Grid container spacing={2}>
          {Object.keys(branches).length > 0 ? (
            branches.map((branch) => (
              <Grid item xs={12} sm={6} md={4} key={branch}>
                <Link
                  href={{
                    pathname: "/classes/chapters",
                    query: { selectedClass, subject, branch },
                  }}
                  key={branch}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <BranchCard
                    image="/Currica/chemistry_subject.jpg"
                    title={branch}
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
              <Box sx={{ width: 400 }}>
                <img src="/no_item.png" width={"100%"} height={350} />
                <Typography
                  textAlign={"center"}
                  fontSize={16}
                  my={2}
                  fontWeight={"bold"}
                >
                  No branches found
                </Typography>
              </Box>
            </Box>
          )}
        </Grid>
      </Box>
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
    <BranchesPage />
  </Suspense>
);
export default PageWrapper;
