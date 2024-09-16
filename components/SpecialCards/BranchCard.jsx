import { Box, Typography } from "@mui/material";
const BranchCard = ({ image = "/heroCard2.png", title = "Class" }) => {
  return (
    <Box
      boxShadow={
        "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px"
      }
      sx={{
        // height: 300,
        maxWidth: 400,
        m: 2,
        mb: 5,
        borderRadius: 5,
        alignSelf: "center",
        bgcolor: "#fff",
      }}
    >
      <img
        src={image}
        alt="course"
        style={{
          width: "100%",
          objectFit: "cover",
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        }}
      />
      <Box
        sx={{
          px: 3,
          width: "100%",
          mb: 3,
        }}
      >
        <Typography
          component={"h2"}
          sx={{
            fontSize: 20,
            fontWeight: 600,
            color: "gray",
            textAlign: "center",
            py: 2,
          }}
        >
          {title}
        </Typography>
      </Box>
    </Box>
  );
};

export default BranchCard;
