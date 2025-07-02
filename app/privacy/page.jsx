"use client";
import { Box, styled, Typography } from "@mui/material";
import React from "react";

const Title = styled(Typography)(() => ({
  fontSize: 24,
  fontWeight: "bold",
  marginTop: 20,
}));
const SubTitle = styled(Typography)(() => ({
  fontSize: 20,
  fontWeight: "400",
  marginTop: 10,
}));
const page = () => {
  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      flexDirection={"column"}
      mt={20}
    >
      <Box width={"80%"}>
        <Box>
          <Typography
            sx={{
              fontSize: 30,
              fontWeight: "bold",
            }}
          >
            Ilmdesk Terms and Conditions
          </Typography>
          <Typography
            sx={{
              fontSize: 20,
              fontWeight: "400",
              marginTop: 5,
            }}
          >
            Last Updated: {new Date().toLocaleDateString()}
          </Typography>
          <Typography
            sx={{
              fontSize: 20,
              fontWeight: "400",
            }}
          >
            Welcome to Ilmdesk. These Terms and Conditions ("Terms") govern your
            access to and use of our website, services, content, and
            applications (collectively, the “Platform”). By accessing or using
            Ilmdesk, you agree to be bound by these Terms. Please read them
            carefully before using our Platform.
          </Typography>
        </Box>
        <Box>
          <Title sx={{}}>1. Acceptance of Terms</Title>
          <SubTitle>
            By registering with Ilmdesk, creating an account, or using any part
            of the Platform, you acknowledge that you have read, understood, and
            agree to be bound by these Terms. If you do not agree with any part
            of these Terms, please refrain from using our services.
          </SubTitle>
        </Box>
        <Box>
          <Title sx={{}}>2. Eligibility</Title>
          <SubTitle>
            You must be at least 13 years old to use Ilmdesk. By using our
            Platform, you represent that: You are of legal age to form a binding
            contract. All registration information you submit is accurate and
            truthful. You will maintain the accuracy of such information. If you
            are using Ilmdesk on behalf of an institution or entity, you
            represent that you have the authority to bind such entity to these
            Terms.
          </SubTitle>
        </Box>
        <Box>
          <Title sx={{}}>3. User Accounts</Title>
          <SubTitle>
            You must create an account to access most features. You are
            responsible for maintaining the confidentiality of your account and
            password. You are responsible for all activities under your account.
            You agree to notify us immediately of any unauthorized use of your
            account.
          </SubTitle>
        </Box>
        <Box>
          <Title sx={{}}>4. Use of the Platform</Title>
          <SubTitle>
            You agree to use Ilmdesk only for lawful purposes. You may not: Use
            the Platform in any way that violates any applicable laws or
            regulations. Copy, modify, distribute, sell, or lease any part of
            our Platform without our prior written consent. Access or tamper
            with non-public areas of the Platform or our systems. Upload or
            distribute viruses, malware, or other harmful code.
          </SubTitle>
        </Box>
        <Box>
          <Title sx={{}}>5. User Content</Title>
          <SubTitle>
            Ilmdesk allows users to upload, submit, or share content including
            quizzes, files, posts, comments, and more. You retain ownership of
            your content, but by uploading it to Ilmdesk, you grant us a
            worldwide, non-exclusive, royalty-free license to use, display,
            reproduce, and distribute such content solely for the purpose of
            operating and improving our services. You are solely responsible for
            the content you share, and you must ensure it does not: Infringe on
            the intellectual property rights of others. Contain defamatory,
            obscene, or offensive material. Violate any applicable laws.
          </SubTitle>
        </Box>
        <Box>
          <Title sx={{}}>6. Intellectual Property</Title>
          <SubTitle>
            All content provided by Ilmdesk—including but not limited to text,
            graphics, logos, videos, and software—is owned by or licensed to us
            and is protected by intellectual property laws. You may not use our
            content without our express permission.
          </SubTitle>
        </Box>
        <Box>
          <Title sx={{}}>7. Subscriptions and Payments</Title>
          <SubTitle>
            Some features may be offered as paid subscriptions. If applicable:
            Prices are subject to change with notice. You agree to provide
            accurate payment information. All payments are non-refundable except
            where required by law or expressly stated in writing by Ilmdesk.
          </SubTitle>
        </Box>
        <Box>
          <Title sx={{}}>8. Termination</Title>
          <SubTitle>
            Ilmdesk reserves the right to: Suspend or terminate your account at
            any time without notice if you breach these Terms. Remove any
            content that violates our policies or applicable laws. You may
            terminate your account at any time by contacting us or using the
            account deletion feature.
          </SubTitle>
        </Box>
        <Box>
          <Title sx={{}}>9. Disclaimers</Title>
          <SubTitle>
            Ilmdesk is provided “as is” without warranties of any kind. We do
            not guarantee that the Platform will be error-free, uninterrupted,
            or secure. Ilmdesk is not liable for any user-submitted content or
            third-party links on the Platform.
          </SubTitle>
        </Box>
        <Box>
          <Title sx={{}}>10. Limitation of Liability</Title>
          <SubTitle>
            To the fullest extent permitted by law, Ilmdesk and its affiliates
            shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages resulting from: Your use or
            inability to use the Platform. Any unauthorized access to your data.
            Any content posted on the Platform.
          </SubTitle>
        </Box>
        <Box>
          <Title sx={{}}>11. Privacy</Title>
          <SubTitle>
            Your use of Ilmdesk is also governed by our Privacy Policy (link to
            be added). Please review it to understand how we collect, use, and
            share information.
          </SubTitle>
        </Box>
        <Box>
          <Title sx={{}}>12. Modifications to Terms</Title>
          <SubTitle>
            Ilmdesk may update these Terms at any time. We will notify you of
            changes by updating the “Last Updated” date. Continued use of the
            Platform after changes constitutes your acceptance of the revised
            Terms.
          </SubTitle>
        </Box>
        <Box>
          <Title sx={{}}>13. Governing Law</Title>
          <SubTitle>
            These Terms shall be governed by and construed in accordance with
            the laws of [Insert Country/State]. Any disputes arising under these
            Terms shall be subject to the exclusive jurisdiction of the courts
            of [Insert Jurisdiction].
          </SubTitle>
        </Box>
        <Box>
          <Title sx={{}}>14. Contact Us</Title>
          <SubTitle>
            If you have any questions or concerns about these Terms, please
            contact us at: 📧 Email: support@ilmdesk.com 🌐 Website:
            www.ilmdesk.com
          </SubTitle>
        </Box>
      </Box>
    </Box>
  );
};

export default page;
