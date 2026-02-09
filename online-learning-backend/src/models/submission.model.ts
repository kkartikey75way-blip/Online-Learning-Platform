import mongoose, { Schema, Document } from "mongoose";

export interface ISubmission extends Document {
  assignment: mongoose.Types.ObjectId;
  student: mongoose.Types.ObjectId;
  link: string;
  grade?: number;
  feedback?: string;
  submittedAt: Date;
}

const submissionSchema = new Schema<ISubmission>({
  assignment: { type: Schema.Types.ObjectId, ref: "Assignment", required: true, index: true },
  student: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  link: { type: String, required: true },
  grade: { type: Number },
  feedback: { type: String },
  submittedAt: { type: Date, default: Date.now },
});

export const Submission = mongoose.model<ISubmission>(
  "Submission",
  submissionSchema
);
