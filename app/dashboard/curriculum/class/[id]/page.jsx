"use client";

import { useParams } from "next/navigation";
import SideBar from "@/components/SideBar";
import { ClassStudio } from "@/components/Dashboard/CurriculumStudio";

export default function ClassCurriculumPage() {
  const params = useParams();
  const classId = Array.isArray(params.id) ? params.id[0] : params.id;

  return (
    <SideBar>
      <ClassStudio classId={classId} />
    </SideBar>
  );
}
