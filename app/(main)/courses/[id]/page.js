//import { CourseProgress } from "@/components/course-progress";


import { replaceMongoIdInArray } from "@/lib/convertData";
import { getCourseDetails } from "@/queries/courses";
import CourseDetails from "./_components/CourseDetails";
import CourseDetailsIntro from "./_components/CourseDetailsIntro";
import Testimonials from "./_components/Testimonials";

const SingleCoursePage = async({params: {id}}) => {
    const course = await getCourseDetails(id);
  
   
  return (
    <>
     <CourseDetailsIntro
     course={course}
    />

     <CourseDetails course={course} />

      {/* Testimonials */}
      {course?.testimonials && <Testimonials testimonials={replaceMongoIdInArray(course?.testimonials)}/>}
     
      {/* Releated Course */}
     {/* <RelatedCourses courses={courses} /> */}
      {/* Authors */}
      {/* https://avatars.githubusercontent.com/u/1416832?v=4 */}
      {/* https://avatars.githubusercontent.com/u/3633137?v=4 */}
    </>
  );
};
export default SingleCoursePage;
