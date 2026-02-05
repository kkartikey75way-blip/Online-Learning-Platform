import mongoose, { Schema, Document } from "mongoose";

export interface ILesson extends Document {
  title: string;
  module: mongoose.Types.ObjectId;
  videoUrl: string;
  content: string;
  order: number;
  releaseDate?: Date;
  duration: number; // minutes
}

const lessonSchema = new Schema<ILesson>(
  {
    title: { type: String, required: true },
    module: {
      type: Schema.Types.ObjectId,
      ref: "Module",
      required: true,
    },
    videoUrl: { type: String, required: true },
    content: { type: String },
    order: { type: Number, required: true },
    releaseDate: { type: Date },
    duration: { type: Number },
  },
  { timestamps: true }
);

export const Lesson = mongoose.model<ILesson>("Lesson", lessonSchema);
