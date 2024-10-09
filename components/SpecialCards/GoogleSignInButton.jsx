import React from "react";
import { Button, SvgIcon } from "@mui/material";

const GoogleIcon = (props) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path
      d="M21.805 10.023h-9.32v3.957h5.49c-.485 2.53-2.54 3.956-5.49 3.956-3.317 0-6.026-2.71-6.026-6.04s2.71-6.04 6.026-6.04c1.475 0 2.7.53 3.69 1.4l2.71-2.723c-1.686-1.575-3.882-2.55-6.4-2.55C6.62 2.03 2.495 6.16 2.495 11.896c0 5.737 4.125 9.865 9.981 9.865 5.605 0 9.71-3.91 9.71-9.646 0-.63-.086-1.25-.18-1.81z"
      fill="#4285F4"
    />
    <path
      d="M3.269 7.85l3.255 2.385c.924-2.74 3.35-4.75 6.127-4.75 1.475 0 2.7.53 3.69 1.4l2.71-2.722C16.498 2.585 14.302 1.61 11.785 1.61c-4.034 0-7.526 2.635-8.516 6.24z"
      fill="#34A853"
    />
    <path
      d="M11.785 21.27c2.46 0 4.525-.806 6.03-2.195l-2.685-2.095c-.75.53-1.71.83-2.83.83-2.945 0-5.42-2.01-6.175-4.73L3.233 16.1c1.01 3.64 4.5 6.17 8.552 6.17z"
      fill="#FBBC05"
    />
    <path
      d="M21.805 10.023h-9.32v3.957h5.49c-.235 1.2-.88 2.2-1.82 2.92l2.685 2.095c1.57-1.455 2.49-3.62 2.49-6.045 0-.63-.086-1.25-.18-1.81z"
      fill="#EA4335"
    />
  </SvgIcon>
);

const GoogleSignInButton = ({ onClick, title }) => {
  return (
    <Button
      variant="outlined"
      startIcon={<GoogleIcon />}
      onClick={onClick}
      fullWidth
      sx={{
        textTransform: "none",
        borderColor: "rgb(255, 49, 88)",
        color: "rgb(255, 49, 88)",
        my: 3,
        "&:hover": {
          borderColor: "rgb(255, 49, 88)",
          backgroundColor: "rgb(255, 49, 88)",
          color: "#fff",
        },
      }}
    >
      {title}
    </Button>
  );
};

export default GoogleSignInButton;
