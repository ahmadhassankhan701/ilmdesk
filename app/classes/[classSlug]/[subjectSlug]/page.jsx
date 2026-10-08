import { SubjectModulesPage } from "@/app/classes/branches/page";

export default function Page({ params }) {
  return <SubjectModulesPage classSlug={params.classSlug} subjectSlug={params.subjectSlug} />;
}
