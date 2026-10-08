import { ModuleChaptersPage } from "@/app/classes/chapters/page";

export default function Page({ params }) {
  return <ModuleChaptersPage classSlug={params.classSlug} subjectSlug={params.subjectSlug} moduleSlug={params.moduleSlug} />;
}
