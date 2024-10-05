import { replaceMongoIdInObject } from "@/lib/convertData";
import { Lesson } from "@/model/lesson-model";


export async function getLesson(lessonId){
    try{
        const lesson = await Lesson.findById(lessonId).lean();
        return replaceMongoIdInObject(lesson);
    }catch(error){
        throw error;
    }
}

export async function createLesson(data){
    try{
        const newLesson = await Lesson.create(data);
        return await JSON.parse(JSON.stringify(newLesson));
    }catch(error){
        throw error;
    }
    
}

export async function getLessonBySlug(slug){
    try{
       const lesson =  await Lesson.findOne({slug: slug}).lean();
       return replaceMongoIdInObject(lesson)

    }catch(error){
        throw error;
    }
}