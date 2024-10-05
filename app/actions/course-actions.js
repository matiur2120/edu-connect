'use server'

import { getLoggedInUser } from "@/lib/loggedin-user";
import { Course } from "@/model/course-model";
import { createCourse } from "@/queries/courses";

export async function createCourseAction(data){
    try{
        const loggedInUser = await getLoggedInUser();
        data["instructor"] = loggedInUser?.id;
        const course = await createCourse(data);
        return course;

    }catch(error){
        throw error;
    }
}


export async function updateCourseAction(courseId, dataToUpdate){
    try{
        await Course.findByIdAndUpdate(courseId, dataToUpdate)

    }catch(error){
        throw error;
    }
}

export async function changeCoursePublishState(courseId){
    try{
        const course = await Course.findById(courseId).lean();
        const updatedCourse = await Course.findByIdAndUpdate(courseId, {active: !course.active})
        return updatedCourse.active;

    }catch(error){
        throw error;
    }
}

export async function deleteCourseAction(courseId){
    try{
        await Course.findByIdAndDelete(courseId)

    }catch(error){
        throw error;
    }

}