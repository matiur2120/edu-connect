import { getDasboardInstructorData, REVIEW_DATA } from "@/lib/dashboard-helper";
import { getCourseDetails } from "@/queries/courses";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";

const reviews = [
  {
    id: 1,
    student: { name: "John Doe" },
    review: "Nice Course, Thanks for the help",
    rating: 5,
  },
  {
    id: 1,
    student: { name: "John Smilga" },
    review: "Nice Course, Thanks for the help",
    rating: 5,
  },
];
const ReviewsPage = async ({ params: { courseId } }) => {
  const courseData = await getCourseDetails(courseId);

  const courseReviews = await getDasboardInstructorData(REVIEW_DATA);
  const reviewDataForCourse = courseReviews.filter(
    (review) => review?.courseId.toString() === courseId
  );
  return (
    <div className="p-6">
      <h2>{courseData?.title}</h2>
      <DataTable columns={columns} data={reviewDataForCourse} />
    </div>
  );
};

export default ReviewsPage;
