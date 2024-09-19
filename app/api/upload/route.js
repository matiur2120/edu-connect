import { Course } from '@/model/course-model';
import fs from 'fs';
import { NextResponse } from "next/server";
import { pipeline } from "stream";
import { promisify } from "util";
const pump = promisify(pipeline);

export const POST = async(req, res) =>{
    try{
        const formData = await req.formData();
        const file = formData.get('files');
        const id = formData.get('courseId')
        const destination = formData.get('destination');
        if(!destination){
            return new NextResponse('Destination is not specified',{
                status: 500
            })
        }
        const filePath = `${destination}/${file.name}`
        await pump(file.stream(), fs.createWriteStream(filePath));
        await Course.findByIdAndUpdate(id, {thumbnail: file.name})
        return new NextResponse(`File ${file.name} uploaded successfully.`,{
            status: 200
        })

    }catch(error){
        return new NextResponse(error.message, {
            status: 500
        })
    }
}