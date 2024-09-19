import { COURSE_DATA, getDasboardInstructorData } from "@/lib/dashboard-helper";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";

const CoursesPage = async () => {
  const courseData = await getDasboardInstructorData(COURSE_DATA);
  return (
    <div className="p-6">
      <DataTable columns={columns} data={courseData} />
    </div>
  );
};

export default CoursesPage;
