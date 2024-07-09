import { replaceMongoIdInArray, replaceMongoIdInObject } from "@/lib/convertData";
import { Category } from "@/model/category-model";
import { Course } from "@/model/course-model";
import { Module } from "@/model/module-model";
import { Testimonial } from "@/model/testimonial-model";
import { User } from "@/model/user-model";
import { getEnrollmentsForCourse } from "./enrollments";
import { getTestimonialsForCourse } from "./testimonials";

export async function getCourseList(){
    const coures = await Course.find({}).select(["title", "subtitle", 'thumbnail', 'modules', 'price', 'category', 'instructor', 'testimonials'

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


export async function getCourseDetailsByInstructor(instructorId){
    const courses = await Course.find({instructor: instructorId}).lean()

    const enrollments = await Promise.all(courses.map(async(course)=>{
        const enrollment = await getEnrollmentsForCourse(course._id.toString());
        return enrollment;
    }))
   
    const totalEnrollments = enrollments.reduce((acc, currentValue)=>{
        return acc.length + currentValue.length;
    }, 0)
    
   
    const testimonials = await Promise.all(courses.map(async(course)=>{
        const testimonial = await getTestimonialsForCourse(course._id.toString());
        return testimonial;
    }))
  
    const totalTestimonials = testimonials.flat();
    const reviews = totalTestimonials.length;

   const totalRating = totalTestimonials.reduce((acc, currentValue)=>{
    return acc + currentValue.rating;
   }, 0);
   const avgRating = (totalRating / reviews).toPrecision(2);
   

    return {
        'courses': courses.length,
        'enrollments': totalEnrollments,
        'reviews': reviews,
        'averageRating': avgRating
    }

}