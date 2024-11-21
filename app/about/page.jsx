"use client";
import Achievement from "@/components/Achievements/Achievement";
import Instructor from "@/components/Instructors/Instructor";
import { ControlPoint, NavigateNext } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Backdrop,
  Box,
  Breadcrumbs,
  Grid,
  Typography,
} from "@mui/material";
import Link from "next/link";
import React from "react";

const page = () => {
  const breadCrumbs = [
    { name: "Home", url: "/" },
    { name: "About", url: "#" },
  ];
  return (
    <Box>
      <Box
        sx={{
          background: `url(/ResourcesTopBanner.png)`,
          backgroundColor: "#000000",
          backgroundSize: "cover",
          height: "50vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box width={"78%"}>
          <Typography
            sx={{
              fontSize: 48,
              fontWeight: 700,
              color: "#FFFFFF",
              mb: 1,
            }}
          >
            About Us
          </Typography>
          <Breadcrumbs
            separator={<NavigateNext fontSize="small" />}
            aria-label="breadcrumb"
            sx={{ color: "#fff" }}
          >
            {breadCrumbs.map((item, i) => (
              <Link
                href={item.url}
                key={i}
                style={{ color: "#fff", textDecoration: "none" }}
              >
                <Typography>{item.name}</Typography>
              </Link>
            ))}
          </Breadcrumbs>
        </Box>
      </Box>
      <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
        <Box width={"80%"}>
          <Box
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            flexDirection={"column"}
          >
            <Typography
              variant="h1"
              sx={{
                display: "flex",
                alignItems: "center",
                fontSize: 18,
                fontWeight: 800,
                color: "#000",
                textTransform: "capitalize",
                paddingBottom: 1,
                lineHeight: 1.5,
                mt: 15,
                mb: 1,
              }}
            >
              <img
                src="/dot.png"
                alt="dot"
                width={36}
                height={36}
                style={{ marginRight: "10px" }}
              />
              Our Story
            </Typography>
            <Typography
              sx={{
                color: "#212529",
                fontWeight: "800",
                mb: 3,
                textAlign: { xs: "left", sm: "center" },
                width: { xs: "90%", sm: "70%" },
                fontSize: { xs: "25px", sm: "30px", md: "34px" },
              }}
            >
              The Leading Global Marketplace for Learning and Instruction
            </Typography>
            <img src="/about.jpg" alt="about" height={"auto"} width={"100%"} />
          </Box>
          <Box mt={5}>
            <Achievement />
            <Instructor />
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6} position={"relative"} overflow={"hidden"}>
              <img
                src="/abouto.png"
                alt="abouto"
                width={"100%"}
                height={"500px"}
                style={{
                  height: "500px",
                  width: "auto",
                  maxWidth: "100%",
                  objectFit: "cover",
                }}
              />
              <Box
                sx={{
                  bgcolor: "#002935",
                  maxWidth: "410px",
                  padding: "40px 25px",
                  borderRadius: "8px",
                  boxShadow: "0px 8px 16px 0px rgba(0, 0, 0, 0.08)",
                  position: "absolute",
                  bottom: "30px",
                  right: "50px",
                }}
              >
                <Typography
                  sx={{ color: "#fff", fontSize: "20px", fontWeight: "800" }}
                >
                  Contact Us For a Free Learning Consulting Evaluation
                </Typography>
                <Box display={"flex"} alignItems={"center"} mt={2}>
                  <img src="/sido.png" alt="sido" />
                  <Typography sx={{ color: "#fff", fontSize: "30px", ml: 2 }}>
                    088 4500 105
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                display={"flex"}
                justifyContent={"center"}
                flexDirection={"column"}
              >
                <Typography
                  variant="h1"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: 18,
                    fontWeight: 800,
                    color: "#000",
                    textTransform: "capitalize",
                    paddingBottom: 1,
                    lineHeight: 1.5,
                    mt: 15,
                    mb: 1,
                  }}
                >
                  <img
                    src="/dot.png"
                    alt="dot"
                    width={36}
                    height={36}
                    style={{ marginRight: "10px" }}
                  />
                  FAQ
                </Typography>
                <Typography
                  sx={{
                    color: "#212529",
                    fontSize: "48px",
                    fontWeight: "800",
                    lineHeight: "62px",
                    textAlign: "left",
                    mb: 3,
                    width: "65%",
                  }}
                >
                  Frequently Asked Questions
                </Typography>
                <Typography
                  sx={{
                    color: "#212529",
                    fontSize: "18px",
                    fontWeight: "400",
                    textAlign: "left",
                    mb: 3,
                    width: "90%",
                  }}
                >
                  Architect client-centered total linkage for intuitive
                  benefits. Dynamically restore convergence before real-time
                  restore.
                </Typography>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ControlPoint />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                  >
                    1. Why choose us for your education?
                  </AccordionSummary>
                  <AccordionDetails>
                    We care about safety big time — and so do your site's
                    visitors. With a Shared Hosting account, you get an SSL
                    certificate for free to add to your site. In this day and
                    age, having an SSL for your site is a no-brainer best
                    practice. Not only does an SSL help your visitors feel safe
                    interacting with your site — this is particularly important
                    if you run an e-commerce site.
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ControlPoint />}
                    aria-controls="panel2-content"
                    id="panel2-header"
                  >
                    2. What we offer to you?
                  </AccordionSummary>
                  <AccordionDetails>
                    We care about safety big time — and so do your site's
                    visitors. With a Shared Hosting account, you get an SSL
                    certificate for free to add to your site. In this day and
                    age, having an SSL for your site is a no-brainer best
                    practice. Not only does an SSL help your visitors feel safe
                    interacting with your site — this is particularly important
                    if you run an e-commerce site.
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ControlPoint />}
                    aria-controls="panel3-content"
                    id="panel3-header"
                  >
                    3. How We Provide Services For You?
                  </AccordionSummary>
                  <AccordionDetails>
                    We care about safety big time — and so do your site's
                    visitors. With a Shared Hosting account, you get an SSL
                    certificate for free to add to your site. In this day and
                    age, having an SSL for your site is a no-brainer best
                    practice. Not only does an SSL help your visitors feel safe
                    interacting with your site — this is particularly important
                    if you run an e-commerce site.
                  </AccordionDetails>
                </Accordion>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default page;
