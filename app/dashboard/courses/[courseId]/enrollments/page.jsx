import {
  ENROLLMENT_DATA,
  getDasboardInstructorData,
} from "@/lib/dashboard-helper";
import { getCourseDetails } from "@/queries/courses";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";

const EnrollmentsPage = async ({ params: { courseId } }) => {
  const courseInfo = await getCourseDetails(courseId);
  const enrollmentInfo = await getDasboardInstructorData(ENROLLMENT_DATA);
  const enrollmentForCourse = enrollmentInfo.filter(
    (enrollment) => enrollment?.course.toString() === courseId
  );
  // const filterForGetAReoprt = {
  //   course: enrollment?.course?._id,
  //   student: enrollment?.student?._id,
  // };

  return (
    <div className="p-6">
      <h2>{courseInfo?.title}</h2>
      <DataTable columns={columns} data={enrollmentForCourse} />
    </div>
  );
};

export default EnrollmentsPage;
