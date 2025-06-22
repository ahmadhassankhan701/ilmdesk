import { Box, Typography } from "@mui/material";
import React from "react";
import EventCard from "./EventCard";

const Event = () => {
  return (
    <Box sx={{ transform: "translateY(-100px)" }}>
      <Box
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Typography
          component="h2"
          sx={{
            fontWeight: 700,
            fontSize: { xs: 36, sm: 40 },
            lineHeight: 1.2,
            paddingBottom: 1,
            color: "#000",
            textAlign: "center",
          }}
        >
          Upcoming Courses
        </Typography>
        <Typography
          sx={{
            fontWeight: "400",
            fontSize: 16,
            lineHeight: 1.5,
            paddingBottom: 1,
            color: "#4A5355",
            maxWidth: 590,
            mt: 1,
            textAlign: "center",
          }}
        >
          Advance your skills with our upcoming courses — designed to keep you
          ahead.
        </Typography>
      </Box>
      <Box mt={10}>
        <EventCard />
        <EventCard />
        <EventCard />
        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          gap={1}
        >
          <Typography
            component={"h2"}
            sx={{
              fontSize: 16,
              fontWeight: 500,
              color: "#4A5355",
              textAlign: "center",
              cursor: "pointer",
              mt: 2,
            }}
          >
            Wants to see the full list of Upcoming Events?
          </Typography>
          <Typography
            component={"h2"}
            sx={{
              fontSize: 16,
              fontWeight: 500,
              color: "#ff3158",
              textAlign: "center",
              cursor: "pointer",
              mt: 2,
            }}
          >
            View full Events Over view
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Event;
