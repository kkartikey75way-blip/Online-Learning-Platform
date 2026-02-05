import mongoose, { Schema, Document } from "mongoose";

export interface IAssignment extends Document {
  lesson: mongoose.Types.ObjectId;
  submissions: {
    student: mongoose.Types.ObjectId;
    fileUrl: string;
    grade?: number;
  }[];
}

const assignmentSchema = new Schema<IAssignment>({
  lesson: { type: Schema.Types.ObjectId, ref: "Lesson" },
  submissions: [
    {
      student: { type: Schema.Types.ObjectId, ref: "User" },
      fileUrl: String,
      grade: Number,
    },
  ],
});

export const Assignment = mongoose.model<IAssignment>(
  "Assignment",
  assignmentSchema
);
