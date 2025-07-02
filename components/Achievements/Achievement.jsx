import { Box, Container, Grid, Typography, styled } from "@mui/material";
import React from "react";
const AchievementGrid = styled(Grid)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
});
const Achievement = () => {
  return (
    <Box
      sx={{
        bgcolor: "#002935",
        borderRadius: 2,
        width: "100%",
      }}
    >
      <Grid container spacing={1} py={5}>
        <AchievementGrid item xs={12} sm={6} md={3}>
          <Typography
            sx={{
              fontSize: 48,
              fontWeight: 700,
              mb: 1,
              color: "#fff",
            }}
          >
            10k+
          </Typography>
          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 500,
              color: "#fff",
            }}
          >
            History Of High Achievers
          </Typography>
        </AchievementGrid>
        <AchievementGrid item xs={12} sm={6} md={3}>
          <Typography
            sx={{
              fontSize: 48,
              fontWeight: 700,
              mb: 1,
              color: "#fff",
            }}
          >
            1k+
          </Typography>
          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 500,
              color: "#fff",
            }}
          >
            Classes Completed
          </Typography>
        </AchievementGrid>
        <AchievementGrid item xs={12} sm={6} md={3}>
          <Typography
            sx={{
              fontSize: 48,
              fontWeight: 700,
              mb: 1,
              color: "#fff",
            }}
          >
            10+
          </Typography>
          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 500,
              color: "#fff",
            }}
          >
            Customized Courses
          </Typography>
        </AchievementGrid>
        <AchievementGrid item xs={12} sm={6} md={3}>
          <Typography
            sx={{
              fontSize: 48,
              fontWeight: 700,
              mb: 1,
              color: "#fff",
            }}
          >
            100+
          </Typography>
          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 500,
              color: "#fff",
            }}
          >
            Awards & Achievements
          </Typography>
        </AchievementGrid>
      </Grid>
    </Box>
  );
};

export default Achievement;
