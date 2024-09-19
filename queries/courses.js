import { replaceMongoIdInArray, replaceMongoIdInObject } from "@/lib/convertData";
import { Category } from "@/model/category-model";
import { Course } from "@/model/course-model";
import { Module } from "@/model/module-model";
import { Testimonial } from "@/model/testimonial-model";
import { User } from "@/model/user-model";
import { getEnrollmentsForCourse } from "./enrollments";
import { getTestimonialsForCourse } from "./testimonials";

export async function getCourseList(){
    const coures = await Course.find({active: true}).select(["title", "subtitle", 'thumbnail', 'modules', 'price', 'category', 'instructor', 'testimonials'

    ]).populate({
        path: 'category',
        model: Category
    }).populate({
        path: 'instructor',
        model: User
    }).populate({
        path: 'testimonials',
        model: Testimonial
    }).populate({
        path: 'modules',
        model: Module

    }).lean();
    return replaceMongoIdInArray(coures);
}


export async function getCourseDetails(id){
    const course = await Course.findById(id)
    .populate({
        path: 'category',
        model: Category
    }).populate({
        path: 'instructor',
        model: User
    }).populate({
        path: 'testimonials',
        model: Testimonial,
        populate: {
            path: 'user',
            model: 'User'
        }
    }).populate({
        path: 'modules',
        model: Module

    })
    .lean()
    return replaceMongoIdInObject(course);
}

export async function createCourse(courseData){
    try{
        const course = await Course.create(courseData)
        return JSON.parse(JSON.stringify(course))

    }catch(error){
        throw error;
    }
}




export async function getCourseDetailsByInstructor(instructorId, expand=false){
    try{
        const publishedCourses = await Course.find({instructor: instructorId, active: true}).lean()

        const enrollments = await Promise.all(publishedCourses.map(async(course)=>{
            const enrollment = await getEnrollmentsForCourse(course._id.toString());
            return enrollment;
        }))
    
        const groupByCourses = Object.groupBy(enrollments.flat(), ({course})=>course)
        const totalRevenue = publishedCourses.reduce((acc, course)=>{
            return (acc + groupByCourses[course._id].length * course.price)

        }, 0)
        

        const totalEnrollments = enrollments.reduce((acc, currentValue)=>{
            return acc + currentValue.length;
        }, 0)
    
    
        const testimonials = await Promise.all(publishedCourses.map(async(course)=>{
            const testimonial = await getTestimonialsForCourse(course._id.toString());
            return testimonial;
        }))
    
        const totalTestimonials = testimonials.flat();
        const reviews = totalTestimonials.length;

    const totalRating = totalTestimonials.reduce((acc, currentValue)=>{
        return acc + currentValue.rating;
    }, 0);
    const avgRating = (totalRating / reviews).toPrecision(2);
    
    if(expand){
        const allCourses = await Course.find({instructor: instructorId}).lean()
        return{
            'courses': allCourses.flat(),
            'enrollments': enrollments.flat(),
            'testimonials': testimonials.flat()
            
        }
    }
        return {
            'courses': publishedCourses.length,
            'enrollments': totalEnrollments,
            'revenue': totalRevenue,
            'reviews': reviews,
            'averageRating': avgRating
        }
    }catch(error){
        throw new Error(error);
    }

}
