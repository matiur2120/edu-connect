import mongoose, { Schema } from "mongoose";

const lessonSchema = new Schema({
    title:{
        required: true,
        type: String
    },
    description: {
        type: String   
    },
    duration: {
        type: Number,
        required: true,
        default: 0
    },
    video_url: {
        type: String
    },
    active: {
        type: Boolean,
        required: true,
        default: false
    },
    slug: {
        required: true,
        type: String
    },
    access: {
        required: true,
        type: String,
        default: 'private'
    },
    order: {
        type: Number,
        required: true
    }


})

export const Lesson = mongoose.models.Lesson ?? mongoose.model('Lesson', lessonSchema)