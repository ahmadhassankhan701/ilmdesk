"use client";
import BranchCard from "@/components/SpecialCards/BranchCard";
import { db } from "@/firebase";
import {
  Backdrop,
  Box,
  Card,
  CardContent,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import { collection, getDocs, query, where } from "firebase/firestore";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";

const BranchesPage = () => {
  const route = useRouter();
  const searchParam = useSearchParams();
  const subjectId = searchParam.get("id");
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchBranches = async () => {
      if (!subjectId) {
        route.back();
        return;
      }
      setLoading(true);
      const docsRef = collection(db, "branches");
      const q = query(docsRef, where("subjectID", "==", subjectId));
      const snapshot = await getDocs(q);
      let branchesArray = [];
      if (snapshot.size !== 0) {
        snapshot.forEach((doc) => {
          branchesArray.push({ key: doc.id, name: doc.data().name });
        });
        setBranches(branchesArray);
      }
      setLoading(false);
    };
    fetchBranches();
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
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      ) : branches.length === 0 ? (
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
              No branches available yet
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box display={"flex"} justifyContent={"center"}>
          <Box sx={{ mx: { xs: 0, sm: 10 } }} mt={15} width={"80%"}>
            <Grid container spacing={2}>
              {branches.map((branch) => (
                <Grid item xs={12} sm={6} md={4} key={branch.key}>
                  <Link
                    href={{
                      pathname: "/classes/chapters",
                      query: { id: branch.key },
                    }}
                    key={branch.key}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <BranchCard
                      image="/Currica/chemistry_subject.jpg"
                      title={branch.name}
                    />
                  </Link>
                </Grid>
              ))}
            </Grid>
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
    <BranchesPage />
  </Suspense>
);
export default PageWrapper;
