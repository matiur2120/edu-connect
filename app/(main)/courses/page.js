
// import { CourseProgress } from "@/components/course-progress";
import { getCourseList } from "@/queries/courses";

// for mobile sidebar
import ActiveFilter from "./_components/ActiveFilter";
import CourseCard from "./_components/CourseCard";
import FilterCourse from "./_components/FilterCourse";
import FilterCourseMobile from "./_components/FilterCourseMobile";
import SearchCourse from "./_components/SearchCourse";
import SortCourse from "./_components/SortCourse";


const PRICE_OPTIONS = [
  { label: "Free", value: "free" },
  { label: "Paid", value: "paid" },
];

const SIZE_FILTERS = {
  id: "size",
  name: "Size",
  options: [
    { value: "S", label: "S" },
    { value: "M", label: "M" },
    { value: "L", label: "L" },
  ],
};

const CATEGORY_OPTIONS = [
  {
    id: 1,
    label: "Design",
    value: "design",
  },

  {
    id: 3,
    label: "Development",
    value: "development",
  },
  {
    id: 4,
    label: "Marketing",
    value: "marketing",
  },
  {
    id: 5,
    label: "IT & Software",
    value: "it-software",
  },
  {
    id: 6,
    label: "Personal Development",
    value: "personal-development",
  },
  {
    id: 7,
    label: "Business",
    value: "business",
  },
  {
    id: 8,
    label: "Photography",
    value: "photography",
  },
  {
    id: 9,
    label: "Music",
    value: "music",
  },
];

const CoursesPage = async() => {
    const courses = await getCourseList();


  //   apply checkbox filter
 
  return (
    <section
      id="courses"
      className="container space-y-6   dark:bg-transparent py-6"
    >
      {/* <h2 className="text-xl md:text-2xl font-medium">All Courses</h2> */}
      {/* header */}
      <div className="flex items-baseline justify-between  border-gray-200 border-b pb-6 flex-col gap-4 lg:flex-row">
       <SearchCourse />

        <div className="flex items-center justify-end gap-2 max-lg:w-full">
         <SortCourse />

          {/* Filter Menus For Mobile */}

         <FilterCourseMobile />
        </div>
      </div>
      {/* header ends */}
      {/* active filters */}
     <ActiveFilter filter={{
        categories: ["development"],
        price: ["free"],
        sort: "",
      }} />
      <section className="pb-24 pt-6">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
          {/* Filters */}
          {/* these component can be re use for mobile also */}
          <FilterCourse />
          {/* Course grid */}
          <div className="lg:col-span-3 grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
            {courses.map((course) => {
              return (
             <CourseCard course={course} key={course.id} />
              );
            })}
          </div>
        </div>
      </section>
    </section>
  );
};
export default CoursesPage;
