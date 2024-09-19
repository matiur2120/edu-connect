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