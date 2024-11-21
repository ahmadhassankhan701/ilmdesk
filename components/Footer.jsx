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
              <Typography
                sx={{
                  fontWeight: "400",
                  fontSize: 16,
                  lineHeight: 1.5,
                  paddingBottom: 1,
                  color: "#fff",
                  maxWidth: 650,
                  my: 3,
                }}
              >
                SSL for your site is a no-brainer best practice. Not only lMS
                Website site.
              </Typography>
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
            <Grid item xs={12} sm={6} md={2}>
              <FooterGridMainTitle>Useful Links</FooterGridMainTitle>
              <FooterGridOptions>About Us</FooterGridOptions>
              <FooterGridOptions>Resource Center</FooterGridOptions>
              <FooterGridOptions>Careers</FooterGridOptions>
              <FooterGridOptions>Instructor</FooterGridOptions>
              <FooterGridOptions>Become a Teacher</FooterGridOptions>
              <FooterGridOptions>Categories</FooterGridOptions>
              <FooterGridOptions>All Courses</FooterGridOptions>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FooterGridMainTitle>Courses</FooterGridMainTitle>
              <FooterGridOptions>Digital Marketing</FooterGridOptions>
              <FooterGridOptions>News & Blogs</FooterGridOptions>
              <FooterGridOptions>Contacts</FooterGridOptions>
              <FooterGridOptions>Pricing</FooterGridOptions>
              <FooterGridOptions>Terms & Conditions</FooterGridOptions>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FooterGridMainTitle>Recent Post</FooterGridMainTitle>
              <Box display={"flex"} alignItems={"center"} gap={2}>
                <img
                  src="/popularCourseCard1.jpg"
                  alt="card"
                  style={{ width: 100, height: 80, borderRadius: 5 }}
                />
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: 16,
                      lineHeight: "21px",
                      color: "#fff",
                      pb: 1,
                      cursor: "pointer",
                      "&:hover": {
                        color: "#ff3158",
                      },
                    }}
                  >
                    Augmented Reality In Business Service
                  </Typography>
                  <Box
                    display={"flex"}
                    color={"white"}
                    gap={1}
                    alignItems={"center"}
                  >
                    <CalendarTodayOutlined
                      sx={{ color: "#fff", fontSize: 14 }}
                    />
                    <Typography color={"#fff"} fontSize={12} fontWeight={"500"}>
                      July 24, 2021
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box display={"flex"} alignItems={"center"} gap={2} mt={3}>
                <img
                  src="/popularCourseCard1.jpg"
                  alt="card"
                  style={{ width: 100, height: 80, borderRadius: 5 }}
                />
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: 16,
                      lineHeight: "21px",
                      color: "#fff",
                      pb: 1,
                      cursor: "pointer",
                      "&:hover": {
                        color: "#ff3158",
                      },
                    }}
                  >
                    Augmented Reality In Business Service
                  </Typography>
                  <Box
                    display={"flex"}
                    color={"white"}
                    gap={1}
                    alignItems={"center"}
                  >
                    <CalendarTodayOutlined
                      sx={{ color: "#fff", fontSize: 14 }}
                    />
                    <Typography color={"#fff"} fontSize={12} fontWeight={"500"}>
                      July 24, 2021
                    </Typography>
                  </Box>
                </Box>
              </Box>
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
