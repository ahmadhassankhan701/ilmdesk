import { Box, Button, TextField, Typography } from "@mui/material";
import React from "react";

const ContactForm = () => {
  return (
    <Box
      sx={{
        boxShadow:
          "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
        borderRadius: 5,
        px: 3,
        py: 5,
      }}
    >
      <Typography
        sx={{
          fontSize: "48px",
          fontWeight: "800",
          color: "#070F2C",
          mb: 5,
        }}
      >
        Feel free to get in touch.
      </Typography>
      <Box>
        <Box display={"flex"} justifyContent={"space-between"} gap={2}>
          <TextField placeholder="Name" fullWidth sx={{ mb: 3 }} />
          <TextField placeholder="Email" fullWidth sx={{ mb: 3 }} />
        </Box>
        <TextField placeholder="Subject" fullWidth sx={{ mb: 3 }} />
        <TextField
          placeholder="Message"
          fullWidth
          sx={{ mb: 3 }}
          multiline
          rows={3}
        />
        <Button
          fullWidth
          sx={{
            bgcolor: "#FF3158",
            fontSize: "16px",
            fontWeight: "600",
            textTransform: "none",
            color: "#ffffff",
            "&:hover": {
              bgcolor: "#FF3158",
              color: "#ffffff",
              opacity: 0.8,
            },
          }}
        >
          Contact Now
        </Button>
      </Box>
    </Box>
  );
};

export default ContactForm;
