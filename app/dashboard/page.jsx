"use client";
import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import SideBar from "@/components/SideBar";
import StatsCard from "@/components/SpecialCards/StatsCard";
import {
  EditNoteOutlined,
  MenuBookOutlined,
  PlayCircleOutlineRounded,
  QuizOutlined,
} from "@mui/icons-material";

import { StackedBarChart } from "@/components/Charts/AllCharts";
import DashboardLeftCard from "@/components/SpecialCards/DashboardLeftCard";
import DashboardRightCard from "@/components/SpecialCards/DashboardRightCard";
import DoughStatsCard from "@/components/SpecialCards/DoughStatsCard";
import LineChartComp from "@/components/Charts/LineChartComp";

const Dashboard = () => {
  return (
    <Box display={"flex"} justifyContent={"center"}>
      <Box width={"100%"}>
        <SideBar>
          <Grid container spacing={1} mb={2}>
            <Grid>
              <Typography
                sx={{
                  fontSize: 28,
                  fontWeight: "800",
                  color: "#A6A6A6",
                }}
              >
                Dashboard
              </Typography>
              <Typography
                sx={{
                  fontSize: 16,
                  fontWeight: "800",
                  color: "#A0AAB4",
                }}
              >
                Your Statistics
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <StatsCard
                icon={<MenuBookOutlined />}
                title={"courses"}
                figures={"50+"}
                color="red"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <StatsCard
                icon={<QuizOutlined />}
                title={"quizzes"}
                figures={"500+"}
                color="green"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <StatsCard
                icon={<PlayCircleOutlineRounded />}
                title={"videos"}
                figures={"50+"}
                color="blue"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <StatsCard
                icon={<EditNoteOutlined />}
                title={"blogs"}
                figures={"150+"}
                color="orange"
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} mt={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <DashboardLeftCard />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <DashboardRightCard />
            </Grid>
          </Grid>
          <Grid
            container
            spacing={2}
            mt={5}
            display={"flex"}
            justifyContent={"center"}
          >
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: 3,
                  boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
                  width: "100%",
                  p: 2,
                }}
              >
                <StackedBarChart />
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: 3,
                  boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
                  width: "100%",
                  p: 2,
                }}
              >
                <LineChartComp />
                <Typography
                  sx={{
                    fontSize: "1rem",
                    fontWeight: "500",
                    letterSpacing: "0.1em",
                    color: "#A0AAB4",
                    mt: 2,
                  }}
                >
                  Recent Stats
                </Typography>
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  mt={2}
                >
                  <DoughStatsCard />
                  <DoughStatsCard />
                  <DoughStatsCard />
                  <DoughStatsCard />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </SideBar>
      </Box>
    </Box>
  );
};

export default Dashboard;
