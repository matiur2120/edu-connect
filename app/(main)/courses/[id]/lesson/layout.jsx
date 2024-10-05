import { getLoggedInUser } from "@/lib/loggedin-user";
import { hasEnrollmentForCourse } from "@/queries/enrollments";
import { redirect } from "next/navigation";
import { CourseSidebar } from "./_components/course-sidebar";
import { CourseSidebarMobile } from "./_components/course-sidebar-mobile";

const CourseLayout = async ({ children, params: { id } }) => {
  const loggedInUser = await getLoggedInUser();
  const hasEnrollment = await hasEnrollmentForCourse(id, loggedInUser.id);
  if (!loggedInUser) {
    redirect("/login");
  }
  if (!hasEnrollment) {
    redirect("/courses");
  }
  return (
    <div className="">
      <div className="h-[80px] lg:pl-96 fixed top-[60px] inset-y-0 w-full z-10">
        <div className="p-4 relative lg:hidden border-b h-full flex items-center bg-white shadow-sm">
          {/* Course Sidebar For Mobile */}
          <CourseSidebarMobile courseId={id} />
          {/* <NavbarRoutes /> */}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="hidden lg:flex h-full w-96 flex-col  inset-y-0 z-50">
          {/* sidebar starts */}
          <CourseSidebar courseId={id} />
          {/* sidebar ends */}
        </div>
        <main className="lg:pl-96 lg:pt-[20px] pt-[80px] h-full col-span-10 px-4">
          {children}
        </main>
      </div>
    </div>
  );
};
export default CourseLayout;
