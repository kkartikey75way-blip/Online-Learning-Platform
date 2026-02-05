import mongoose, { Schema, Document } from "mongoose";

export interface ISubmission extends Document {
  assignment: mongoose.Types.ObjectId;
  student: mongoose.Types.ObjectId;
  fileUrl?: string;
  marks?: number;
}

const submissionSchema = new Schema<ISubmission>(
  {
    assignment: {
      type: Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileUrl: String,
    marks: Number,
  },
  { timestamps: true }
);

export const Submission = mongoose.model<ISubmission>(
  "Submission",
  submissionSchema
);
