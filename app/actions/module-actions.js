'use server'
//import { Course } from "@/model/course-model";
import { Course } from "@/model/course-model";
import { Module } from "@/model/module-model";
import { createModule } from "@/queries/modules";
import mongoose from "mongoose";


export async function createModuleAction(data){
    try{
        const title = data.get('title');
        const slug = data.get('slug')
        const courseId = data.get('courseId')
        const order = data.get('order');
        const createdModule = await createModule({title, slug, course: courseId, order})
        //const course = await Course.findById(courseId);
        const course = await Course.findById(courseId);
        course.modules.push(createdModule._id);
        course.save()
        return createdModule;
    }catch(error){
        throw error;
    }
}


export async function reorderModulesAction(data){
    try{
        await Promise.all(data.map(async(element)=>{
            await Module.findByIdAndUpdate(element.id, {order: element.position})
        }))
    }catch(error){
        throw error;
    }
}


export async function updateModuleAction(moduleId, dataToUpdate){
    try{
        await Module.findByIdAndUpdate(moduleId, dataToUpdate)
    }catch(error){
        throw error;
    }
}


export async function changeModulePublishState(id){
    try{
        const findModule = await Module.findById(id).lean();
        const updatedModule = await Module.findByIdAndUpdate(id, {active: !findModule.active}, {lean: true});
        console.log(updatedModule)
        return updatedModule.active;

    }catch(error){
        throw error;
    }

}

export async function deleteModuleAction(moduleId, courseId){
    try{ 
        const courseInfo = await Course.findById(courseId);
        courseInfo.modules.pull(new mongoose.Types.ObjectId(moduleId))
        await Module.findByIdAndDelete(moduleId);
        courseInfo.save();
         

    }catch(error){
        throw error;
    }
}