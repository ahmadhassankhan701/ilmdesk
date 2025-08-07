"use client";

import {
  CheckCircleOutlineOutlined,
  Star,
  StarOutline,
} from "@mui/icons-material";
import {
  Avatar,
  Backdrop,
  Box,
  Button,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { toast } from "react-toastify";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import renderHTML from "react-render-html";
import moment from "moment";
import { useAuth } from "@/context/AuthContext";

const Loader = () => (
  <Backdrop
    sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
    open={true}
  >
    <img src="/loader.gif" width={100} height={100} alt="Loading..." />
  </Backdrop>
);

const Ratings = ({ rating = 5 }) => (
  <Box display="flex" alignItems="center" gap={1} my={2}>
    {Array(rating)
      .fill()
      .map((_, i) => (
        <Star
          key={`filled-${i}`}
          sx={{ color: "rgb(255, 164, 27)", fontSize: 14 }}
        />
      ))}
    {Array(5 - rating)
      .fill()
      .map((_, i) => (
        <StarOutline
          key={`outlined-${i}`}
          sx={{ color: "rgb(255, 164, 27)", fontSize: 14 }}
        />
      ))}
  </Box>
);

const CourseHeader = ({ content }) => (
  <Box
    bgcolor="#fff"
    borderRadius={2}
    boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
    transform="translateY(-50px)"
    p={1}
  >
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <Box display="flex" justifyContent="center" gap={2}>
          <Avatar
            src="/avatar.png"
            sx={{ bgcolor: "transparent", fontSize: 50 }}
          />
          <Box textAlign="center">
            <Typography fontWeight={700} fontSize={16}>
              Mr Qasim
            </Typography>
            <Typography fontWeight={500} fontSize={14}>
              Sr. Instructor
            </Typography>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} md={4}>
        <Box textAlign="center">
          <Typography fontWeight={700} fontSize={16}>
            Subject
          </Typography>
          <Typography fontWeight={500} fontSize={14}>
            {content.subject}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} md={4}>
        <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
          <Typography fontWeight={700} fontSize={16} color="rgb(74, 83, 85)">
            {content.ratings?.length || 5} ratings
          </Typography>
          <Ratings rating={content.ratings?.length || 5} />
        </Box>
      </Grid>
    </Grid>
  </Box>
);

const CourseReviews = ({ reviews }) => (
  <Box mt={5}>
    <Typography variant="h6" fontSize={30} fontWeight={700} color="#001920">
      Reviews
    </Typography>
    {reviews.length > 0 ? (
      reviews.map((review, i) => (
        <Box
          key={i}
          bgcolor="#fff"
          borderRadius={2}
          boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
          p={3}
          mt={2}
          display="flex"
          gap={3}
        >
          <Box textAlign="center">
            <Avatar
              src={review.userImage || "/avatar.png"}
              sx={{ fontSize: 50, mb: 1 }}
            />
            <Typography fontSize={14} color="gray">
              {moment(review.createdAt.seconds * 1000).fromNow()}
            </Typography>
          </Box>
          <Box>
            <Ratings rating={parseInt(review.rating)} />
            <Typography variant="body1">{review.feedback}</Typography>
          </Box>
        </Box>
      ))
    ) : (
      <Typography mt={1}>No reviews available</Typography>
    )}
  </Box>
);

const CourseSidebar = ({ price, courseId, isUserLoggedIn, modules }) => (
  <Box
    bgcolor="#fff"
    p={3}
    borderRadius={3}
    mt={5}
    boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
  >
    <Typography fontSize={18} fontWeight={700} color="#001920" mb={0.5}>
      Course Pricing
    </Typography>
    <Typography fontSize={36} fontWeight={700} color="#FF3158" mb={0.5}>
      {price ? `Rs. ${price}` : "Free"}
    </Typography>
    <Typography fontSize={22} fontWeight={700} color="#001920" mb={2}>
      Course Features
    </Typography>
    <List>
      {[
        "Detailed Explanation",
        "PDF Material",
        "Quiz Practice",
        "Youtube Tutorials",
      ].map((item, i) => (
        <ListItem key={i}>
          <ListItemIcon>
            <CheckCircleOutlineOutlined sx={{ color: "red" }} />
          </ListItemIcon>
          <ListItemText primary={item} />
        </ListItem>
      ))}
    </List>
    <Typography fontSize={22} fontWeight={700} color="#001920" mb={2}>
      Course Modules
    </Typography>
    <List>
      {modules?.map((item, i) => (
        <ListItem key={i}>
          <ListItemIcon>
            <CheckCircleOutlineOutlined sx={{ color: "red" }} />
          </ListItemIcon>
          <ListItemText primary={item.name} />
        </ListItem>
      ))}
    </List>
    <Box display="flex" justifyContent="center">
      <Link
        href={
          isUserLoggedIn
            ? `/courses/checkout?id=${courseId}`
            : "/auth?redirect=/courses/checkout"
        }
        style={{ textDecoration: "none" }}
      >
        <Button
          sx={{
            bgcolor: "#FF3158",
            textTransform: "none",
            color: "#fff",
            borderRadius: 2,
            width: 250,
            "&:hover": { bgcolor: "#FF3158", opacity: 0.8 },
          }}
        >
          Enroll Now
        </Button>
      </Link>
    </Box>
  </Box>
);

const DetailsPage = () => {
  const { state } = useAuth();
  const searchParam = useSearchParams();
  const courseId = searchParam.get("id");
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "courses", courseId);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          setContent({ key: snapshot.id, ...snapshot.data(), ratings: [] });
        }
      } catch (error) {
        toast.error("Failed to fetch content");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [courseId]);

  if (loading) return <Loader />;

  if (!content || !content.title)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" mt={20}>
        <Box width={400}>
          <img src="/no_item.png" width="100%" alt="No content" />
        </Box>
      </Box>
    );

  return (
    <Box display="flex" justifyContent="center">
      <Box width="80%" mx={{ xs: 1, lg: 10 }}>
        <Grid container spacing={2} mt={7}>
          <Grid item xs={12} lg={8} mt={5}>
            <img
              src={content.image || "/courseCategImg.jpg"}
              style={{
                width: "100%",
                height: 500,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                objectFit: "cover",
              }}
              alt="Course"
            />
            <CourseHeader content={content} />
            <Box mt={5}>
              <Typography
                variant="h6"
                fontSize={30}
                fontWeight={700}
                color="#001920"
              >
                Overview
              </Typography>
              <Typography variant="body1" fontSize={16} color="#001920" mt={1}>
                {renderHTML(content.desc)}
              </Typography>
            </Box>
            <CourseReviews reviews={content.ratings} />
          </Grid>
          <Grid item xs={12} lg={4}>
            <CourseSidebar
              price={content.price}
              courseId={courseId}
              isUserLoggedIn={Boolean(state?.user)}
              modules={content.modules}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

const PageWrapper = () => (
  <Suspense fallback={<Loader />}>
    <DetailsPage />
  </Suspense>
);

export default PageWrapper;
