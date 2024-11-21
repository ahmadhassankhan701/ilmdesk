import { Box, Typography } from "@mui/material";
import React from "react";

const InfoCard = ({ image, title, subtitle }) => {
  return (
    <Box
      sx={{
        boxShadow:
          "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
        borderRadius: 5,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        py: 2,
        px: 3,
        gap: 2,
      }}
    >
      <img src={image} width={80} height={80} />
      <Typography
        sx={{ fontSize: "22px", fontWeight: "800", color: "#002935" }}
      >
        {title}
      </Typography>
      <Typography
        sx={{
          fontSize: "16px",
          fontWeight: "500",
          color: "#4A5355",
          textAlign: "center",
        }}
      >
        {subtitle}
      </Typography>
    </Box>
  );
};

export default InfoCard;
