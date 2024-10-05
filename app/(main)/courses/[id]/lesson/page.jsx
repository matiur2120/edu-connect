import { Separator } from "@/components/ui/separator";
import {
  replaceMongoIdInArray,
  replaceMongoIdInObject,
} from "@/lib/convertData";
import { getCourseDetails } from "@/queries/courses";
import { getLessonBySlug } from "@/queries/lessons";
import { LessonVideo } from "./_components/lesson-video";
import VideoDescription from "./_components/video-description";

const Course = async ({ params: { id }, searchParams: { name, module } }) => {
  const courseInfo = await getCourseDetails(id);
  const modules = replaceMongoIdInArray(courseInfo.modules).toSorted((a, b) => {
    return a.order - b.order;
  });
  const defautlLesson = replaceMongoIdInObject(
    modules[0]?.lessonIds.toSorted((a, b) => {
      return a.order - b.order;
    })[0]
  );
  const defaultModule = module ? module : modules[0]?.slug;
  const lessonToPlay = name ? await getLessonBySlug(name) : defautlLesson;

  return (
    <div>
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4 w-full">
          {/* <VideoPlayer /> */}
          <LessonVideo
            lesson={lessonToPlay}
            module={defaultModule}
            courseId={id}
          />
        </div>
        <div>
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-2xl font-semibold mb-2">
              {lessonToPlay?.title}
            </h2>
            {/* <Button size="lg">Enroll</Button> */}
          </div>
          <Separator />
          <VideoDescription description={lessonToPlay?.description} />
        </div>
      </div>
    </div>
  );
};
export default Course;
