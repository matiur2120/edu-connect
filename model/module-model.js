import mongoose, { Schema } from "mongoose";

const moduleSchema = new Schema({
  title: {
    type: String,
    required: true, 
  },
  description: {
    type: String,
  },
  active: {
    type: Boolean,
    required: true,
    default: false,
  },
  slug: {
    type: String,
    required: true,
  },
  course: {
    type: Schema.ObjectId,
    required: true,
  },
  lessonIds: [{type: Schema.ObjectId, ref: 'Lesson'}],
  duration: {
    type: Number
  },
  order: {
    type: Number,
    required: true,
  }
});

export const Module = mongoose.models.Module ?? mongoose.model("Module", moduleSchema);