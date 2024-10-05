import mongoose, { Schema } from "mongoose";

const watchSchema = new Schema({
    state: {
        required: true,
        type: String,
        default: 'started'
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now()
    },
    modified_at: {
        type: Date,
        required: true,
        default: Date.now()
    },
   lesson: {
    type: Schema.ObjectId,
    ref: 'Lesson'
   },
   user: {
    type: Schema.ObjectId,
    ref: 'User'
   },
   module: {
    type: Schema.ObjectId,
    ref: 'Module'
   },
   lastTime: {
    type: Number,
    required: true,
    default: 0
    }
})



export const Watch = mongoose.models.Watch ?? mongoose.model('Watch', watchSchema)