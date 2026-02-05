import mongoose, { Schema, Document } from "mongoose";

export interface IQuiz extends Document {
  course: mongoose.Types.ObjectId;
  title: string;
}

const quizSchema = new Schema<IQuiz>(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: { type: String, required: true },
  },
  { timestamps: true }
);

export const Quiz = mongoose.model<IQuiz>("Quiz", quizSchema);
