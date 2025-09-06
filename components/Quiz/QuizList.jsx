import { ArrowForwardIos, Lock, Quiz } from "@mui/icons-material";
import {
  Avatar,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const QuizList = ({ quizzes, type }) => {
  const [experts, setExperts] = useState([]);
  const [intermediates, setIntermediates] = useState([]);
  const [beginners, setBeginners] = useState([]);
  useEffect(() => {
    const classifyQuizzes = () => {
      let beginnerItems = [];
      let interItems = [];
      let expertItems = [];
      quizzes.map((item) => {
        if (item.difficulty === "beginner") {
          beginnerItems.push(item);
        }
        if (item.difficulty === "intermediate") {
          interItems.push(item);
        }
        if (item.difficulty === "expert") {
          expertItems.push(item);
        }
      });
      setBeginners(beginnerItems);
      setIntermediates(interItems);
      setExperts(expertItems);
    };

    quizzes && classifyQuizzes();
  }, [quizzes]);
  const quiz = (item) => {
    return (
      <ListItem
        key={item.key}
        secondaryAction={
          item.locked ? (
            <IconButton
              sx={{
                bgcolor: "gray",
                "&:hover": { bgcolor: "gray" },
              }}
              edge="end"
            >
              <Lock sx={{ color: "white", fontSize: 14 }} />
            </IconButton>
          ) : (
            <Link
              href={
                item.mode === "offline"
                  ? {
                      pathname: `/${type}/offquiz/${item.key}`,
                    }
                  : {
                      pathname: `/${type}/quiz/${item.key}`,
                    }
              }
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <IconButton
                sx={{
                  bgcolor: "green",
                  color: "white",
                  "&:hover": { bgcolor: "green" },
                }}
                edge="end"
                aria-label="delete"
                disabled={item.locked}
              >
                <ArrowForwardIos sx={{ color: "white", fontSize: 14 }} />
              </IconButton>
            </Link>
          )
        }
      >
        <ListItemAvatar>
          <Avatar
            sx={{
              bgcolor: "purple",
              color: "white",
              "&:hover": { bgcolor: "green" },
            }}
          >
            <Quiz sx={{ color: "white" }} />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={`${item.quizNumber} - ${item.quizTitle}`}
          secondary={`mode: ${item.mode} - duration: ${item.duration} mins`}
        />
      </ListItem>
    );
  };
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <Typography
          sx={{
            fontSize: 20,
            fontWeight: 500,
          }}
        >
          Beginner
        </Typography>
        <List>
          {beginners ? (
            beginners.map((item) => quiz(item))
          ) : (
            <ListItem>No quizzes for beginners</ListItem>
          )}
        </List>
      </Grid>
      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <Typography
          sx={{
            fontSize: 20,
            fontWeight: 500,
          }}
        >
          Intermediate
        </Typography>
        <List>
          {Object.keys(intermediates).length > 0 ? (
            intermediates.map((item) => quiz(item))
          ) : (
            <ListItem>No quizzes for Intermediates</ListItem>
          )}
        </List>
      </Grid>
      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <Typography
          sx={{
            fontSize: 20,
            fontWeight: 500,
          }}
        >
          Expert
        </Typography>
        <List>
          {Object.keys(experts).length > 0 ? (
            experts.map((item) => quiz(item))
          ) : (
            <ListItem>No quizzes for Experts</ListItem>
          )}
        </List>
      </Grid>
    </Grid>
  );
};

export default QuizList;
