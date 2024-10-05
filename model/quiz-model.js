import mongoose, { Schema } from "mongoose";

const quizSchema = new Schema({
    question: {
        required: true,
        type: String
    },
    slug: {
        type: String,
        required: true
    },
    description: {
        required: false,
        type: String
    },
   mark: {
    required: true,
    type: Number,
    default: 5
   },
   options: {type: Array},
   explanations: {
    type: String,
   }
})



export const Quiz = mongoose.models.Quiz ?? mongoose.model('Quiz', quizSchema)