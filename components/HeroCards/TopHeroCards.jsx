import React from "react";
import TopHeroCard from "./TopHeroCard";
import { Box, Container, Grid } from "@mui/material";
const TopHeroCards = () => {
  return (
    <Box
      sx={{
        transform: "translateY(-80px)",
        bgcolor: "#F5F5F5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        pt: 3,
        px: 3,
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <TopHeroCard
            image={"/heroCard1.png"}
            title={"Book Library & Store"}
            subtitle={"View More"}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TopHeroCard
            image={"/heroCard2.png"}
            title={"10K+ Online Courses"}
            subtitle={"View More"}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TopHeroCard
            image={"/heroCard3.png"}
            title={"Expert Instructor"}
            subtitle={"View More"}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default TopHeroCards;
