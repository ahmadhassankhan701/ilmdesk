"use client";
import { CalendarTodayOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  Divider,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import React from "react";
const FooterGridMainTitle = styled(Typography)({
  fontWeight: "800",
  fontSize: 20,
  color: "#D9DDDE",
  textTransform: "capitalize",
  paddingBottom: 40,
  lineHeight: 1.5,
  textAlign: "left",
});
const FooterGridOptions = styled(Typography)({
  fontWeight: 400,
  fontSize: 16,
  color: "#E6E8E9",
  textTransform: "none",
  paddingBottom: 5,
  lineHeight: 1.5,
  textAlign: "left",
});
const Footer = () => {
  return (
    <Box
      sx={{
        background: `url("/footerBg.png")`,
        backgroundColor: "#002935",
        pt: 10,
        pb: 3,
        mt: 10,
      }}
    >
      <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
        <Box width={"80%"}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
              <img
                src="/ilmlogo.png"
                alt="logo"
                style={{ width: 150, marginTop: 20, marginBottom: 20 }}
              />
              <Box display={"flex"} alignItems={"center"} flexWrap={"nowrap"}>
                <TextField
                  variant="outlined"
                  placeholder="Enter your email"
                  sx={{
                    borderTopLeftRadius: 5,
                    borderBottomLeftRadius: 5,
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                    backgroundColor: "#fff",
                    width: 300,
                  }}
                  InputProps={{
                    style: {
                      backgroundColor: "#fff",
                    },
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    borderRadius: 0,
                    width: 120,
                    height: 57,
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    borderTopRightRadius: 5,
                    borderBottomRightRadius: 5,
                    backgroundColor: "#ff3158",
                    textTransform: "none",
                  }}
                >
                  Subscribe
                </Button>
              </Box>
            </Grid>
            <Grid
              size={{ xs: 12, sm: 6, md: 3 }}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"flex-start"}
              flexDirection={"column"}
            >
              <FooterGridMainTitle>Useful Links</FooterGridMainTitle>
              <FooterGridOptions>About Us</FooterGridOptions>
              <FooterGridOptions>Resource Center</FooterGridOptions>
              <FooterGridOptions>Careers</FooterGridOptions>
              <FooterGridOptions>Instructor</FooterGridOptions>
              <FooterGridOptions>Become a Teacher</FooterGridOptions>
              <FooterGridOptions>Categories</FooterGridOptions>
              <FooterGridOptions>All Courses</FooterGridOptions>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FooterGridMainTitle>Courses</FooterGridMainTitle>
              <FooterGridOptions>News & Blogs</FooterGridOptions>
              <FooterGridOptions>Contacts</FooterGridOptions>
              <FooterGridOptions>Pricing</FooterGridOptions>
              <FooterGridOptions>Terms & Conditions</FooterGridOptions>
            </Grid>
          </Grid>
          <Divider sx={{ backgroundColor: "#4A5355", my: 5 }} />
          <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
            <Typography
              sx={{
                fontWeight: "400",
                fontSize: 16,
                lineHeight: 1.5,
                paddingBottom: 1,
                color: "#E6E8E9",
                maxWidth: 650,
                textAlign: "center",
              }}
            >
              © 2024 AoPerho Learning Management System, All rights reserved.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
