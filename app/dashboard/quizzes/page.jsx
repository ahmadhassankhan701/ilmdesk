"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import SideBar from "@/components/SideBar";

const dummyQuizzes = [
  { id: 1, title: "Quiz 1", questions: 10, duration: "30 mins" },
  { id: 2, title: "Quiz 2", questions: 15, duration: "45 mins" },
  { id: 3, title: "Quiz 3", questions: 20, duration: "60 mins" },
];

const QuizzesPage = () => {
  return (
    <SideBar>
      <Paper>
        <Typography variant="h4" component="h1" gutterBottom>
          Quizzes Here
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Questions</TableCell>
                <TableCell>Duration</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dummyQuizzes.map((quiz) => (
                <TableRow key={quiz.id}>
                  <TableCell>{quiz.id}</TableCell>
                  <TableCell>{quiz.title}</TableCell>
                  <TableCell>{quiz.questions}</TableCell>
                  <TableCell>{quiz.duration}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </SideBar>
  );
};

export default QuizzesPage;
