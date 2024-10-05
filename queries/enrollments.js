import { replaceMongoIdInArray } from "@/lib/convertData";
import { Course } from "@/model/course-model";
import { Enrollment } from "@/model/enrollment-model";

export async function getEnrollmentsForCourse(courseId){
    const enrollments = await Enrollment.find({course: courseId}).lean();

    return replaceMongoIdInArray(enrollments)
}


export async function getEnrollmentForUser(userId){
    try{
        const enrollments = await Enrollment.find({student: userId}).populate({
            path: 'course',
            modle: Course
        }).lean();
        return replaceMongoIdInArray(enrollments)
    }catch(error){
        throw error;
    }

}

export async function hasEnrollmentForCourse(courseId, studentId){
    try{
        const enrollment = await Enrollment.findOne({
            course: courseId,
            student: studentId
        }).populate({
            path: 'course',
            modle: Course
        }).lean()
        if(!enrollment) return false;
        return true;
    }catch(error){
        throw error;
    }
}

export async function enrollForCourse(courseId, userId, paymentMethod){
    const newEnrollment = {
        course: courseId,
        student: userId,
        method: paymentMethod,
        enrollment_date: Date.now(),
        status: 'not-started'
    }
    try{
        const response = await Enrollment.create(newEnrollment);
        return response;
    }catch(error){
        throw error;
    }
}