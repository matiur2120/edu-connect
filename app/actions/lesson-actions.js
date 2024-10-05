'use server'
import { Lesson } from "@/model/lesson-model";
import { Module } from "@/model/module-model";
import { createLesson } from "@/queries/lessons";
import mongoose from "mongoose";

export async function createLessonAction(data){
    try{
        const title = data.get('title');
        const slug = data.get('slug')
        const moduleId = data.get('moduleId')
        const order = data.get('order');
        const createdLesson = await createLesson({title, slug, order})
        //const course = await Course.findById(courseId);
        const moduleInfo = await Module.findById(moduleId);
        moduleInfo.lessonIds.push(createdLesson._id);
        moduleInfo.save()
        return createdLesson;
    }catch(error){
        throw error;
    }
}

export async function reorderLessonsAction(data){
    try{
        await Promise.all(data.map(async(element)=>{
            await Lesson.findByIdAndUpdate(element.id, {order: element.position})
        }))
    }catch(error){
        throw error;
    }
}


export async function updateLessonAction(lessonId, dataToUpdate){
    try{
        await Lesson.findByIdAndUpdate(lessonId, dataToUpdate)
    }catch(error){
        throw error;
    }
}

export async function changeLessonPublishState(id){
    try{
        const lesson = await Lesson.findById(id).lean();
        console.log(lesson)
        const updatedLesson = await Lesson.findByIdAndUpdate(id, {active: !lesson.active}, {lean: true});
        console.log(updatedLesson)
        return updatedLesson.active;

    }catch(error){
        throw error;
    }

}

export async function deleteLessonAction(lessonId, moduleId){
    try{ 
        const moduleInfo = await Module.findById(moduleId);
        moduleInfo.lessonIds.pull(new mongoose.Types.ObjectId(lessonId))
        await Lesson.findByIdAndDelete(lessonId);
        moduleInfo.save();
         

    }catch(error){
        throw error;
    }
}