import { replaceMongoIdInObject } from "@/lib/convertData";
import { Assessment } from "@/model/assessment-model";
import { Module } from "@/model/module-model";
import { Report } from "@/model/report-model";
import mongoose from "mongoose";
import { getCourseDetails } from "./courses";

export async function getAReport(filter) {
    try{
        const report = await Report.findOne(filter).populate({
            path: 'quizAssessment',
            model: Assessment
        }).lean();
        return replaceMongoIdInObject(report);
    }catch(error){
        throw error;
    }
    
}

export async function createAssessmentReport(data){
    try{
        let report = await Report.findOne({
            course: data?.courseId,
            student: data?.userId
        })
        if(!report){
            report = await Report.create({course: data.courseId, student: data.userId, quizAssessment: data.quizAssessment});
        }else{
            if(!report.quizAssessment){
                report.quizAssessment = data.quizAssessment;
                report.save()
            }
        }
        

    }catch(error){
        throw error;
    }
}

export async function createWatchReport(data) {
    try {
      let report = await Report.findOne({
        course: data?.courseId,
        student: data?.userId,
      });
      if (!report) {
        report = await Report.create({
          course: data.courseId,
          student: data.userId,
        });
      }
  
      const foundLessonId = report.totalCompletedLessons.find(
        (lesson) => lesson.toString() === data.lessonId
      );
      if (!foundLessonId) {
        report.totalCompletedLessons.push(
          new mongoose.Types.ObjectId(data.lessonId)
        );
      }
      const moduleInfo = await Module.findById(data.moduleId);
      const lessonIdsToCheck = moduleInfo?.lessonIds;
      const completedLessonIds = report.totalCompletedLessons;
  
      const isModuleComplete = lessonIdsToCheck.every((lesson) =>
          completedLessonIds.includes(lesson)
      );
      if (isModuleComplete) {
        const foundModule = report.totalCompletedModules.find(
          (module) => module.toString() === data.moduleId
        );
        if (!foundModule) {
          report.totalCompletedModules.push(
            new mongoose.Types.ObjectId(data.moduleId)
          );
        }
      }
      //Check if the course has completed.
      //If so add the completion time
      const courseInfo = await getCourseDetails(data?.courseId);
      const modules = courseInfo?.modules;
      const modulesCount = modules?.length ?? 0;
      const completedModules = report?.totalCompletedModules;
      const completedModulesCount = completedModules?.length ?? 0;
      if(completedModulesCount >= 1 && completedModulesCount === modulesCount){
        report.completion_date = Date.now();
      }


      report.save();
    } catch (error) {
      throw error;
    }
  }
  


