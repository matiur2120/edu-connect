import { replaceMongoIdInObject } from "@/lib/convertData";
import { Lesson } from "@/model/lesson-model";
import { Module } from "@/model/module-model";


export async function createModule(moduleData){
    try{
        const newModule = await Module.create(moduleData);
        return await JSON.parse(JSON.stringify(newModule));
    }catch(error){
        throw error;
    }
}

export async function getModuleById(moduleId){
    try{
        const moduleInfo = await Module.findById(moduleId).populate({
            path: 'lessonIds',
            model: Lesson 
        }).lean();
        return replaceMongoIdInObject(moduleInfo)


    }catch(error){
        throw error;
    }
}

export async function getModuleBySlug(slug){
    try{
        const moduleInfo = await Module.findOne({slug: slug}).lean();
        return replaceMongoIdInObject(moduleInfo)
        
    }catch(error){
        throw error;
    }
}