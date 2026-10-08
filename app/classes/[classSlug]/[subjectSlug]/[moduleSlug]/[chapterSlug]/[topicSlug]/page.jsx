import { LessonPage } from "@/app/classes/details/page";

export default function Page({ params }) {
  return (
    <LessonPage
      classSlug={params.classSlug}
      subjectSlug={params.subjectSlug}
      moduleSlug={params.moduleSlug}
      chapterSlug={params.chapterSlug}
      topicSlug={params.topicSlug}
    />
  );
}
