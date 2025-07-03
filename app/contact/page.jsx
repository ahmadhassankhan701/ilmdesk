"use client";
import React from "react";
import { NavigateNext } from "@mui/icons-material";
import { Box, Breadcrumbs, Container, Grid, Typography } from "@mui/material";
import Link from "next/link";
import InfoCard from "@/components/HeroCards/InfoCard";
import ContactForm from "@/components/Quiz/ContactForm";
const page = () => {
  const breadCrumbs = [
    { name: "Home", url: "/" },
    { name: "Contact", url: "#" },
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
            Contact Us
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
      <Box
        display={"flex"}
        justifyContent={"center"}
        flexDirection={"column"}
        alignItems={"center"}
      >
        <Grid
          container
          spacing={2}
          mt={5}
          sx={{ width: { xs: "95%", sm: "80%" } }}
        >
          <Grid item xs={12} md={4}>
            <InfoCard
              image={"/contact1.png"}
              title={"Office Address"}
              subtitle={
                "Near Shaukat Khanum Hospital, Lahore, Punjab 54500 Pakistan"
              }
            />
            <Box mt={2}>
              <InfoCard
                image={"/contact3.png"}
                title={"Email Address"}
                subtitle={"ilmdesk63@gmail.com"}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <ContactForm />
          </Grid>
        </Grid>
        <Box>
          <Box
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            flexDirection={"column"}
            mt={10}
          >
            <Typography
              component="h2"
              sx={{
                fontWeight: "800",
                fontSize: 36,
                lineHeight: 1.2,
                paddingBottom: 1,
                color: "#000",
                textAlign: "center",
              }}
            >
              Support & Assistance
            </Typography>
            <Typography
              sx={{
                fontWeight: "400",
                fontSize: 16,
                lineHeight: 1.5,
                paddingBottom: 1,
                color: "#4A5355",
                maxWidth: 650,
                mt: 1,
                textAlign: "center",
              }}
            >
              We offer a user-friendly interface, 24/7 support, regular updates
              on content, and a feedback mechanism to ensure you receive the
              best possible service.
            </Typography>
            <Box sx={{ mt: 5, display: "flex", justifyContent: "center" }}>
              <Grid container spacing={2} width={"80%"}>
                <Grid item xs={12} sm={6} md={4}>
                  <InfoCard
                    image={"/contact1.png"}
                    title={"Office Address"}
                    subtitle={
                      "Near Shaukat Khanum Hospital, Lahore, Punjab 54500 Pakistan"
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <InfoCard
                    image={"/contact2.png"}
                    title={"Help & Support"}
                    subtitle={
                      "We offer a user-friendly interface, 24/7 support, regular updates on content, and a feedback mechanism to ensure you receive the best possible service."
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <InfoCard
                    image={"/contact3.png"}
                    title={"Email Address"}
                    subtitle={"ilmdesk63@gmail.com"}
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default page;
