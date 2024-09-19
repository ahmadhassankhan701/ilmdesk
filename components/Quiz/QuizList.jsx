import { ArrowForwardIos, Quiz } from "@mui/icons-material";
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
import Link from "next/link";
import React, { useEffect, useState } from "react";

const QuizList = ({ quizzes }) => {
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

  return (
    <Box>
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
          beginners.map((item) => (
            <ListItem
              key={item.key}
              secondaryAction={
                <Link
                  href={
                    item.mode === "offline"
                      ? {
                          pathname: `/classes/offquiz/${item.key}`,
                        }
                      : {
                          pathname: `/classes/quiz/${item.key}`,
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
                  >
                    <ArrowForwardIos sx={{ color: "white" }} />
                  </IconButton>
                </Link>
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
                primary={`${item.quizNumber} - ${item.quizTitle} (${item.totalQuestions} questions)`}
                secondary={`mode: ${item.mode} - duration: ${item.duration} mins`}
              />
            </ListItem>
          ))
        ) : (
          <ListItem>No quizzes for beginners</ListItem>
        )}
      </List>
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
          intermediates.map((item) => (
            <ListItem
              key={item.key}
              secondaryAction={
                <Link
                  href={
                    item.mode === "offline"
                      ? {
                          pathname: `/classes/offquiz/${item.key}`,
                        }
                      : {
                          pathname: `/classes/quiz/${item.key}`,
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
                  >
                    <ArrowForwardIos sx={{ color: "white" }} />
                  </IconButton>
                </Link>
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
                primary={`${item.quizNumber} - ${item.quizTitle} (${item.totalQuestions} questions)`}
                secondary={`mode: ${item.mode} - duration: ${item.duration} mins`}
              />
            </ListItem>
          ))
        ) : (
          <ListItem>No quizzes for Intermediates</ListItem>
        )}
      </List>
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
          experts.map((item) => (
            <ListItem
              key={item.key}
              secondaryAction={
                <Link
                  href={
                    item.mode === "offline"
                      ? {
                          pathname: `/classes/offquiz/${item.key}`,
                        }
                      : {
                          pathname: `/classes/quiz/${item.key}`,
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
                  >
                    <ArrowForwardIos sx={{ color: "white" }} />
                  </IconButton>
                </Link>
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
                primary={`${item.quizNumber} - ${item.quizTitle} (${item.totalQuestions} questions)`}
                secondary={`mode: ${item.mode} - duration: ${item.duration} mins`}
              />
            </ListItem>
          ))
        ) : (
          <ListItem>No quizzes for Experts</ListItem>
        )}
      </List>
    </Box>
  );
};

export default QuizList;
