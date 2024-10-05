import mongoose, { Schema } from "mongoose";

const quizsetSchema = new Schema({
    title: {
        required: true,
        type: String
    },
    description: {
        required: false,
        type: String
    },
   slug: {
    required: true,
    type: String
   },
   quizIds: [{type: Schema.ObjectId, ref: 'Quiz'}],
   active: {
    required: true,
    type: Boolean,
    default: false
   }
})



export const Quizset = mongoose.models.Quizset ?? mongoose.model('Quizset', quizsetSchema)