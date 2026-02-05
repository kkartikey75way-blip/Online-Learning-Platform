import mongoose, { Schema, Document } from "mongoose";

export interface IAssignment extends Document {
  course: mongoose.Types.ObjectId;
  title: string;
  description: string;
  dueDate: Date;
}

const assignmentSchema = new Schema<IAssignment>(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: String,
    description: String,
    dueDate: Date,
  },
  { timestamps: true }
);

export const Assignment = mongoose.model<IAssignment>(
  "Assignment",
  assignmentSchema
);
