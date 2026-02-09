import mongoose, { Schema, Document } from "mongoose";

export interface IProgress extends Document {
  user: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  completedLessons: mongoose.Types.ObjectId[];
  progressPercent: number;
  completed: boolean;
}

const schema = new Schema<IProgress>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true,
    index: true,
  },
  completedLessons: [{ type: Schema.Types.ObjectId, ref: "Lesson" }],
  progressPercent: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
});

export const Progress = mongoose.model<IProgress>(
  "Progress",
  schema
);
