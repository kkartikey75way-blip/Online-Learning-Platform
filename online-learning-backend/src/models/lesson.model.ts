import mongoose, { Schema, Document } from "mongoose";

export interface ILesson extends Document {
  title: string;
  module: mongoose.Types.ObjectId;
  videoUrl?: string;
  content?: string;
  order: number;
  isDripLocked: boolean;
}

const lessonSchema = new Schema<ILesson>(
  {
    title: { type: String, required: true },
    module: {
      type: Schema.Types.ObjectId,
      ref: "Module",
      required: true,
    },
    videoUrl: String,
    content: String,
    order: { type: Number, default: 0 },
    isDripLocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Lesson = mongoose.model<ILesson>(
  "Lesson",
  lessonSchema
);
