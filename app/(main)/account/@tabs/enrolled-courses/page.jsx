//import { CourseProgress } from "@/components/course-progress";

import { auth } from "@/auth";
import { getEnrollmentForUser } from "@/queries/enrollments";
import { getUserByEmail } from "@/queries/users";
import { redirect } from "next/navigation";
import EnrolledCoursecard from "../../component/enrolled-coursecard";

async function EnrolledCourses() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  const loggedInUserInfo = await getUserByEmail(session?.user?.email);
  const enrollmentsInfo = await getEnrollmentForUser(loggedInUserInfo?.id);
  return (
    <div className="grid sm:grid-cols-2 gap-6">
      {enrollmentsInfo && enrollmentsInfo.length > 0 ? (
        enrollmentsInfo.map((enrollment) => (
          <EnrolledCoursecard key={enrollment.id} enrollment={enrollment} />
        ))
      ) : (
        <h2>Nor Enrollment Found!</h2>
      )}
    </div>
  );
}

export default EnrolledCourses;
