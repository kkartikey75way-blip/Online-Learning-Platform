import mongoose, { Schema, Document } from "mongoose";

export interface IQuestion extends Document {
  quiz: mongoose.Types.ObjectId;
  text: string;
  options: string[];
  correctAnswer: number;
}

const questionSchema = new Schema<IQuestion>({
  quiz: {
    type: Schema.Types.ObjectId,
    ref: "Quiz",
    required: true,
  },
  text: { type: String, required: true },
  options: [String],
  correctAnswer: Number,
});

export const Question = mongoose.model<IQuestion>(
  "Question",
  questionSchema
);
