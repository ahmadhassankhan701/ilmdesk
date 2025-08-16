"use client";
import SideBar from "@/components/SideBar";
import React from "react";

const StudentProfile = () => {
  const student = {
    name: "John Doe",
    age: 20,
    email: "johndoe@example.com",
    major: "Computer Science",
    university: "Example University",
    bio: "A passionate learner and aspiring software developer.",
    courses: [
      { id: 1, title: "Introduction to Programming", grade: "A" },
      { id: 2, title: "Data Structures", grade: "B+" },
      { id: 3, title: "Web Development", grade: "A-" },
    ],
  };

  return (
    <SideBar>
      <div className="student-profile">
        <h1>{student.name}'s Profile</h1>
        <p>
          <strong>Age:</strong> {student.age}
        </p>
        <p>
          <strong>Email:</strong> {student.email}
        </p>
        <p>
          <strong>Major:</strong> {student.major}
        </p>
        <p>
          <strong>University:</strong> {student.university}
        </p>
        <p>
          <strong>Bio:</strong> {student.bio}
        </p>

        <h2>Courses</h2>
        <ul>
          {student.courses.map((course) => (
            <li key={course.id}>
              {course.title} - Grade: {course.grade}
            </li>
          ))}
        </ul>
      </div>
    </SideBar>
  );
};

export default StudentProfile;
