'use server'

import { replaceMongoIdInArray } from "@/lib/convertData";
import { getLoggedInUser } from "@/lib/loggedin-user";
import { Assessment } from "@/model/assessment-model";
import { Quizset } from "@/model/quizset-model";
import { createQuiz, getQuizeSetById } from "@/queries/quizzes";
import { createAssessmentReport } from '@/queries/reports';
import mongoose from "mongoose";


export async function addQuizAction(quizSetId, data){
    try{
        const newQuiz = await createQuiz(data);
        const quizSetInfo = await Quizset.findById(quizSetId);
        quizSetInfo.quizIds.push(newQuiz._id);
        quizSetInfo.save()
        return newQuiz;
    }catch(error){
        throw error;
    }
}

export async function updateQuizSetAction(id, data){
    try{
        await Quizset.findByIdAndUpdate(id, data);

    }catch(error){
        throw error;
    }
}

export async function createQuizSet(data){
    try{
        const newQuizSet = await Quizset.create(data)
        return await JSON.parse(JSON.stringify(newQuizSet))

    }catch(error){
        throw error;
    }
}



export async function addQuizAssesment(courseId, quizSetId, answers){
    try{
        const quizSet = await getQuizeSetById(quizSetId);
        const quizzes = replaceMongoIdInArray(quizSet?.quizIds);
        const assessmentRecord = quizzes.map(quiz=>{
            const obj = {};
            obj.quizId = new mongoose.Types.ObjectId(quiz.id);
            const found = answers.find(a=> a.quizId === quiz.id);
            if(found){
                obj.attempted = true;
            }else{
                obj.attempted = false;
            }
            const mergeOptions = quiz.options.map(o=>({
                option: o.text,
                isCorrect: o.is_correct,
                isSelected: (function(){
                    const found = answers.find(a=> a.options[0].option === o.text);
                    if(found){
                        return true
                    }else{
                        return false;
                    }
                })()
            }))
            obj.options = mergeOptions;
            return obj;
        })
        const assessmentEntry = {};
        assessmentEntry.assessments = assessmentRecord;
        assessmentEntry.otherMarks = 0;
        const assessment = await Assessment.create(assessmentEntry)
        const loggedInUser = await getLoggedInUser();
        await createAssessmentReport({courseId: courseId, userId: loggedInUser?.id, quizAssessment: assessment?._id})

    }catch(error){
        throw error;
    }
}

