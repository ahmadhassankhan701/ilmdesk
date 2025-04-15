import { ChevronRightOutlined } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import Link from "next/link";
const SubjectCard = ({
  image = "/heroCard2.png",
  title = "Class",
  subjects = [],
}) => {
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
          height: "80%",
          objectFit: "cover",
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
            textAlign: "center",
          }}
        >
          {title}
        </Typography>
      </Box>
      {subjects.length > 0 && (
        <Box
          sx={{
            px: 3,
            py: 3,
            width: "100%",
          }}
        >
          {subjects.map((subject) => (
            <Link
              href={{
                pathname: "/classes/branches",
                query: { id: subject.key },
              }}
              key={subject.key}
              style={{ textDecoration: "none" }}
            >
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
                bgcolor={"lightgray"}
                mt={1}
                borderRadius={2}
                p={1}
                sx={{ cursor: "pointer" }}
              >
                <Typography
                  component={"h2"}
                  sx={{
                    fontSize: 16,
                    fontWeight: 400,
                    color: "gray",
                    mt: 1,
                    textAlign: "left",
                  }}
                >
                  {subject.name}
                </Typography>
                <ChevronRightOutlined sx={{ color: "gray" }} />
              </Box>
            </Link>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default SubjectCard;
