"use client";
import { CalendarTodayOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import React from "react";
const FooterGridMainTitle = styled(Typography)({
  fontWeight: "800",
  fontSize: 20,
  color: "#D9DDDE",
  textTransform: "capitalize",
  paddingBottom: 40,
  lineHeight: 1.5,
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
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <img
                src="/ilmlogo.png"
                alt="logo"
                style={{ width: 150, marginTop: 20 }}
              />
              <Box display={"flex"} alignItems={"center"} flexWrap={"nowrap"}>
                <TextField
                  variant="outlined"
                  placeholder="Enter your email"
                  fullWidth
                  sx={{
                    borderTopLeftRadius: 5,
                    borderBottomLeftRadius: 5,
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                    backgroundColor: "#fff",
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
            <Grid item xs={12} sm={6} md={4}>
              <FooterGridMainTitle>Useful Links</FooterGridMainTitle>
              <FooterGridOptions>About Us</FooterGridOptions>
              <FooterGridOptions>Resource Center</FooterGridOptions>
              <FooterGridOptions>Careers</FooterGridOptions>
              <FooterGridOptions>Instructor</FooterGridOptions>
              <FooterGridOptions>Become a Teacher</FooterGridOptions>
              <FooterGridOptions>Categories</FooterGridOptions>
              <FooterGridOptions>All Courses</FooterGridOptions>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
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
