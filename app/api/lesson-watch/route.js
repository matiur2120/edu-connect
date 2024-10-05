import { getLoggedInUser } from "@/lib/loggedin-user";
import { Watch } from "@/model/watch-model";
import { getLesson } from "@/queries/lessons";
import { getModuleBySlug } from "@/queries/modules";
import { createWatchReport } from "@/queries/reports";
import { NextResponse } from "next/server";

const STARTED ="started"
const COMPLETED = 'completed'

async function updateReport(userId, lessonId,  moduleId,  courseId){
    try{
      await createWatchReport({userId, lessonId,  moduleId,  courseId})
      console.log('hello from update Report...')
    }catch(error){
        throw error;
    }
}


export async function POST(request){
    try{
    const {state, lessonId, moduleSlug, courseId, lastTime} = await request.json();
    const loggedInUser = await getLoggedInUser();
    const lessonInfo = await getLesson(lessonId);
    const moduleInfo = await getModuleBySlug(moduleSlug);
   
    if (!loggedInUser) {
        return new NextResponse(`You are not authenticated.`, {
            status: 401,
        });
    }
    if (state !== STARTED && state !== COMPLETED) {
        return new NextResponse(`Invalid state. Can not process request.`, {
            status: 500,
        });
    }

    if (!lessonInfo) {
        return new NextResponse(`Invalid lesson. Can not process request.`, {
            status: 500,
        });
    }
   
    const found = await Watch.findOne({
        user: loggedInUser?.id,
        lesson: lessonInfo?.id,
        module: moduleInfo?.id
    }).lean()
    const watchEntry = {
        state,
        lastTime: lastTime,
        lesson: lessonId,
        module: moduleInfo?.id,
        user: loggedInUser?.id
    }
    if (state === STARTED) {
        if (!found) {
            watchEntry["created_at"] = Date.now();
            await Watch.create(watchEntry);
        }
    } else if (state === COMPLETED) {
        if (!found) {
            watchEntry["created_at"] = Date.now();
            await Watch.create(watchEntry);
            await updateReport(loggedInUser?.id, lessonId, moduleInfo?.id, courseId )
        } else {
            if (found.state === STARTED) {
                watchEntry["modified_at"] = Date.now();
                await Watch.findByIdAndUpdate(found._id, {
                    state: COMPLETED,
                });
                await updateReport(loggedInUser?.id, lessonId, moduleInfo?.id, courseId)
            }
        }
    }
  
    return new NextResponse('Watch Record has been updated!', {
        status: 200
    })

    }catch(error){
        throw error;
    }
}