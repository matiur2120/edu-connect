import { CourseProgress } from "@/components/course-progress";
import { getLoggedInUser } from "@/lib/loggedin-user";
import { Watch } from "@/model/watch-model";
import { getCourseDetails } from "@/queries/courses";
import { getAReport } from "@/queries/reports";
import DownloadCertificate from "./download-certificate";
import GiveReview from "./give-review";
import { Quiz } from "./quiz";
import { SidebarModules } from "./sidebar-modules";

const quizes = [
  {
    id: "quiz-1",
    title: "Quiz title 1",
    description: "Quiz description",
    options: [
      { label: "Option-1", id: 1, isCorrect: true },
      { label: "Option-2", id: 2, isCorrect: false },
      { label: "Option-3", id: 3, isCorrect: false },
      { label: "Option-4", id: 4, isCorrect: true },
    ],
  },
  {
    id: "quiz-2",
    title: "Quiz title 2",
    description: "Quiz description",
    options: [
      { label: "Quiz-2 Option-1", id: 1, isCorrect: true },
      { label: "Quiz-2 Option-2", id: 2, isCorrect: false },
      { label: "Quiz-2 Option-3", id: 3, isCorrect: false },
      { label: "Quiz-2 Option-4", id: 4, isCorrect: true },
    ],
  },
];

export const CourseSidebar = async ({ courseId }) => {
  const loggedInUser = await getLoggedInUser();
  const report = await getAReport({
    course: courseId,
    student: loggedInUser.id,
  });

  const courseInfo = await getCourseDetails(courseId);
  const updatedModules = await Promise.all(
    courseInfo.modules.map(async (module) => {
      const moduleId = module?._id.toString();
      const lessons = module?.lessonIds;
      const updatedLessons = await Promise.all(
        lessons.map(async (lesson) => {
          const lessonId = lesson?._id.toString();
          const watch = await Watch.findOne({
            lesson: lessonId,
            module: moduleId,
            user: loggedInUser.id,
          });
          if (watch?.state === "completed") {
            lesson.state = "completed";
          }
          return lesson;
        })
      );
      return module;
    })
  );
  const totalCompletedModules = report?.totalCompletedModules
    ? report?.totalCompletedModules.length
    : 0;
  const totalModules = courseInfo?.modules.length;
  const totalProgress =
    totalModules > 0
      ? Math.floor((totalCompletedModules / totalModules) * 100)
      : 0;

  const quizSet = courseInfo?.quizSet;
  console.log(quizSet);
  const isQuizTaken = report?.quizAssessment ? true : false;
  console.log(isQuizTaken);

  return (
    <>
      <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
        <div className="p-8 flex flex-col border-b">
          <h1 className="font-semibold">Reactive Accelerator</h1>
          <div className="mt-10">
            <CourseProgress variant="success" value={totalProgress} />
          </div>
        </div>

        <SidebarModules courseId={courseId} modules={updatedModules} />
        <div className="w-full px-6 mb-6 mt-10 border-t pt-5">
          {quizSet && (
            <Quiz
              courseId={courseId}
              isQuizTaken={isQuizTaken}
              quizSet={quizSet}
            />
          )}
        </div>
        <div className="w-full px-6 mb-6">
          <DownloadCertificate courseId={courseId} progress={totalProgress} />
          <GiveReview courseId={courseId} />
        </div>
      </div>
    </>
  );
};
