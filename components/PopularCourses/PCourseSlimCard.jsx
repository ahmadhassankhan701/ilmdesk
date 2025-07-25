import { Alarm, Star, StarOutline } from "@mui/icons-material";
import { Box, Avatar, Typography, Button } from "@mui/material";
const PCourseWideCard = ({ data }) => {
  const rating = 5;
  return (
    <Box>
      {data && (
        <Box
          boxShadow={
            "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px"
          }
          sx={{
            width: "100%",
            borderRadius: 5,
          }}
        >
          <Box position={"relative"}>
            <img
              src={data.image ? data.image : "/popularCourseCard1.jpg"}
              alt="course"
              style={{
                width: "100%",
                height: 150,
                objectFit: "cover",
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              }}
            />
            <Box position="absolute" bottom={10} right={10} zIndex={10}>
              {/* Price Tag */}
              <Box
                sx={{
                  position: "relative",
                  transform: "rotate(-8deg)",
                  bgcolor: "#FF3158",
                  color: "#fff",
                  px: 2.5,
                  py: 1,
                  borderRadius: "8px",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.25)",
                  border: "2px dashed #fff",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: 80,
                  minHeight: 40,
                }}
              >
                {/* Hole (inside the tag) */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 4,
                    left: 4,
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    bgcolor: "#fff",
                    border: "2px solid #FF3158",
                    zIndex: 2,
                  }}
                />

                {/* Price Text */}
                <Typography
                  sx={{
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: 16,
                  }}
                >
                  {data.price ? `Rs. ${data.price}` : "Free"}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              padding: "15px 30px",
              width: "100%",
              height: "250px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Box display={"flex"} gap={2} alignItems={"center"}>
              <Button
                variant="contained"
                size="small"
                sx={{
                  bgcolor: "#FF3158",
                  textTransform: "none",
                  "&:hover": {
                    bgcolor: "#FF3158",
                  },
                }}
              >
                {data.subject}
              </Button>
              <Box
                display={"flex"}
                color={"white"}
                gap={1}
                alignItems={"center"}
                width={"100%"}
              >
                <Box display={"flex"} gap={1} alignItems={"center"}>
                  <Alarm sx={{ color: "#000" }} />
                  <Typography color={"#000"} fontSize={14} fontWeight={"500"}>
                    2 hours
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Typography
              component={"h2"}
              sx={{
                fontSize: 22,
                fontWeight: 600,
                color: "rgb(0, 25, 32)",
                mt: 2,
              }}
            >
              {data.title}
            </Typography>
            <Box
              display={"flex"}
              alignItems={"center"}
              gap={1}
              sx={{ cursor: "pointer", my: 2 }}
            >
              <Typography
                sx={{
                  color: "rgb(74, 83, 85)",
                  fontSize: 12,
                  fontWeight: 400,
                  cursor: "pointer",
                  textTransform: "none",
                }}
              >
                {data.number_of_ratings ? data.number_of_ratings : 5} ratings
              </Typography>
              {Array(rating)
                .fill()
                .map((_, i) => (
                  <Star
                    key={i + "-filled"}
                    sx={{ color: "rgb(255, 164, 27)", fontSize: 14 }}
                  />
                ))
                .concat(
                  Array(5 - rating)
                    .fill()
                    .map((_, i) => (
                      <StarOutline
                        key={i}
                        sx={{ color: "rgb(255, 164, 27)", fontSize: 14 }}
                      />
                    ))
                )}
            </Box>
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              flexWrap={"nowrap"}
              gap={2}
            >
              <Box display={"flex"} gap={2} alignItems={"center"}>
                <Box display={"flex"} alignItems={"center"} gap={1}>
                  <Avatar
                    src={data.authorImage ? data.authorImage : "/avatar.png"}
                    sx={{ bgcolor: "transparent" }}
                  />
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontWeight: "700",
                      fontSize: 16,
                      paddingBottom: 1,
                      color: "#000",
                    }}
                  >
                    {data.author ? data.author : "Qasim"}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default PCourseWideCard;
