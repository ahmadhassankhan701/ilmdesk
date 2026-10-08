"use client";

import { useParams } from "next/navigation";
import SideBar from "@/components/SideBar";
import { CourseStudio } from "@/components/Dashboard/CurriculumStudio";

export default function CourseCurriculumPage() {
  const params = useParams();
  const courseId = Array.isArray(params.id) ? params.id[0] : params.id;

  return (
    <SideBar>
      <CourseStudio courseId={courseId} />
    </SideBar>
  );
}
