import { CourseProgress } from "@/components/course-progress";
import { Badge } from "@/components/ui/badge";
import { getCategoryDetailsById } from "@/queries/categories";
import { getCourseDetails } from "@/queries/courses";
import { getAReport } from "@/queries/reports";
import { BookOpen } from "lucide-react";
import Image from "next/image";

const EnrolledCoursecard = async ({ enrollment }) => {
  const categoryInfo = await getCategoryDetailsById(
    enrollment?.course?.category
  );
  const courseInfo = await getCourseDetails(enrollment?.course);
  const totalModule = courseInfo?.modules ? courseInfo?.modules?.length : 0;
  const filterForGetAReoprt = {
    course: enrollment?.course?._id,
    student: enrollment?.student?._id,
  };
  const report = await getAReport(filterForGetAReoprt);
  const totalCompletedModules = report?.totalCompletedModeules
    ? report?.totalCompletedModeules?.length
    : 0;
  const otherMarks = report?.quizAssessment
    ? report?.quizAssessment?.otherMarks
    : 0;
  //Get all Quizzes and Assessments
  const quizzes = report?.quizAssessment?.assessments;
  const totalQuize = quizzes?.length ?? 0;
  //Find attempted quizzes
  const quizzesTaken = quizzes
    ? quizzes?.filter((quize) => quize.attempted)
    : [];
  const quizzesTakenCount = quizzesTaken ? quizzesTaken?.length : 0;
  //Find how many quize ans correct
  const correctAns = quizzesTaken
    ?.map((quize) =>
      quize?.options?.filter(
        (opt) => opt?.isCorrect === true && opt?.isSelected === true
      )
    )
    .filter((element) => element.length > 0)
    .flat().length;
  const markFromQuize = correctAns * 5 || 0;
  const totalMark = otherMarks + markFromQuize;
  const courseProgress = totalModule
    ? Math.floor((totalCompletedModules / totalModule) * 100)
    : 0;

  return (
    <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
      <div className="relative w-full aspect-video rounded-md overflow-hidden">
        <Image
          src={`/assets/images/courses/${enrollment?.course?.thumbnail}`}
          alt={"course"}
          className="object-cover"
          fill
        />
      </div>
      <div className="flex flex-col pt-2">
        <div className="text-lg md:text-base font-medium group-hover:text-sky-700 line-clamp-2">
          {enrollment?.course?.title}
        </div>
        <p className="text-xs text-muted-foreground">{categoryInfo?.title}</p>
        <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
          <div className="flex items-center gap-x-1 text-slate-500">
            <div>
              <BookOpen className="w-4" />
            </div>
            <span>{enrollment?.course?.modules?.length} Chapters</span>
          </div>
        </div>
        <div className=" border-b pb-2 mb-2">
          <div className="flex items-center justify-between">
            <p className="text-md md:text-sm font-medium text-slate-700">
              Total Modules: {enrollment?.course?.modules?.length}
            </p>
            <p className="text-md md:text-sm font-medium text-slate-700">
              Completed Modules{" "}
              <Badge variant="success">{totalCompletedModules}</Badge>
            </p>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-md md:text-sm font-medium text-slate-700">
              Total Quizzes: {totalQuize}
            </p>

            <p className="text-md md:text-sm font-medium text-slate-700">
              Quiz taken <Badge variant="success">{quizzesTakenCount}</Badge>
            </p>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-md md:text-sm font-medium text-slate-700">
              Mark from Quizzes
            </p>

            <p className="text-md md:text-sm font-medium text-slate-700">
              {markFromQuize}
            </p>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-md md:text-sm font-medium text-slate-700">
              Others
            </p>

            <p className="text-md md:text-sm font-medium text-slate-700">
              {otherMarks}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-md md:text-sm font-medium text-slate-700">
            Total Marks
          </p>

          <p className="text-md md:text-sm font-medium text-slate-700">
            {totalMark}
          </p>
        </div>

        <CourseProgress
          size="sm"
          value={courseProgress}
          variant={courseProgress === 100 ? "success" : ""}
        />
      </div>
    </div>
  );
};

export default EnrolledCoursecard;
