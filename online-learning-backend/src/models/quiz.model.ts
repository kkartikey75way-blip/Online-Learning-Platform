import mongoose, { Schema, Document } from "mongoose";

export interface IQuiz extends Document {
  lesson: mongoose.Types.ObjectId;
  questions: {
    question: string;
    options: string[];
    correctIndex: number;
  }[];
}

const quizSchema = new Schema<IQuiz>({
  lesson: { type: Schema.Types.ObjectId, ref: "Lesson", required: true },
  questions: [
    {
      question: String,
      options: [String],
      correctIndex: Number,
    },
  ],
});

export const Quiz = mongoose.model<IQuiz>("Quiz", quizSchema);
