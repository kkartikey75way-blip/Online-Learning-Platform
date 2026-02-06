import mongoose, { Schema, Document } from "mongoose";

export interface IAssignment extends Document {
  module: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  title: string;
  description: string;
  createdAt: Date;
}

const assignmentSchema = new Schema<IAssignment>({
  module: { type: Schema.Types.ObjectId, ref: "Module", required: true },
  course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Assignment = mongoose.model<IAssignment>(
  "Assignment",
  assignmentSchema
);
