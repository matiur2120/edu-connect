import { replaceMongoIdInArray } from "@/lib/convertData";
import { Testimonial } from "@/model/testimonial-model";


export async function getTestimonialsForCourse(courseId){
    console.log(courseId)
    const testimonials = await Testimonial.find({courseId: courseId}).lean();
    console.log(testimonials)
    return replaceMongoIdInArray(testimonials);
}