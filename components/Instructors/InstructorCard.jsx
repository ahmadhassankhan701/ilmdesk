import { Box, Typography } from "@mui/material";
const InstructorCard = ({
  image = "/heroCard2.png",
  title = "John Doe",
  subtitle = "Bussiness Developer",
}) => {
  return (
    <Box
      boxShadow={
        "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px"
      }
      sx={{
        height: 500,
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
          height: "80%",
          objectFit: "cover",
          objectPosition: "center",
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        }}
      />
      <Box
        sx={{
          px: 3,
          width: "100%",
        }}
      >
        <Typography
          component={"h2"}
          sx={{
            fontSize: 20,
            fontWeight: 600,
            color: "#000",
            mt: 1,
          }}
        >
          {title}
        </Typography>
        <Box
          display={"flex"}
          alignItems={"center"}
          gap={1}
          sx={{ cursor: "pointer", my: 1 }}
        >
          <Typography
            sx={{
              color: "#4A5355",
              fontSize: 15,
              fontWeight: 400,
              cursor: "pointer",
              textTransform: "none",
            }}
          >
            {subtitle}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default InstructorCard;
