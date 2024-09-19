import { auth } from "@/auth";
import { getCourseDetails, getCourseDetailsByInstructor } from "@/queries/courses";
import { getAReport } from "@/queries/reports";
import { getUserByEmail, getUserDetailsById } from "@/queries/users";

export const COURSE_DATA = 'course'
export const REVIEW_DATA = 'review'
export const ENROLLMENT_DATA = 'enrollment'


const populateReviewData = async(reviews)=>{
    const populateReviews = await Promise.all(
        reviews.map(async(review)=> {
          const student =  await getUserDetailsById(review?.user);
          review["studentName"] = `${student?.firstName} ${student?.lastName}`
          return review;
        })
    )
    return populateReviews;

}
const populateEnrollmentData = async(enrollments) =>{
    const populateEnrollments = await Promise.all(
        enrollments.map(async(enrollment)=> {
          const student =  await getUserDetailsById(enrollment?.student);
          enrollment["studentName"] = `${student?.firstName} ${student?.lastName}`
          enrollment["studentEmail"] = student?.email
          const filterForGetAReoprt = {
            course: enrollment?.course,
            student: enrollment?.student,
          };
          const report = await getAReport(filterForGetAReoprt);
          enrollment['progress'] = 0;
          enrollment['quizeMarks'] = 0;
          console.log(report)
          if(report){
            const courseInfo = await getCourseDetails(enrollment?.course);
            //Course progress calculation
            const totalModules = courseInfo?.modules.length;
            const totalCompletedModules = report?.totalCompletedModeules.length;
            console.log(totalModules, totalCompletedModules)
            const progress = (totalCompletedModules / totalModules) * 100;
            enrollment['progress'] = progress
            //Calculation quize marks for course
            //Get all Quizzes and Assessments
            const quizzes = report?.quizAssessment?.assessments;
            //Find attempted quizzes
            const quizzesTaken = quizzes?.filter((quize) => quize.attempted);
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
            enrollment['quizeMarks'] = markFromQuize;
          }
          return enrollment;
        })
    )
    return populateEnrollments;
}
export async function getDasboardInstructorData(dataType){
    try{
        const session = await auth();
        const instructor = await getUserByEmail(session?.user?.email);
        const data = await getCourseDetailsByInstructor(instructor?.id, true);
        switch(dataType){
          case COURSE_DATA: return data?.courses;
          case REVIEW_DATA: return await populateReviewData(data?.testimonials);
          case ENROLLMENT_DATA: return await populateEnrollmentData(data?.enrollments);
          default: return data;
        }
      

    }catch(error){
        throw error;
    }
}