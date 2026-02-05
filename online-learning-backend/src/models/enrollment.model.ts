import mongoose, { Schema, Document } from "mongoose";

export interface IEnrollment extends Document {
  user: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  enrolledAt: Date;
}

const enrollmentSchema = new Schema<IEnrollment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    enrolledAt: { type: Date, default: Date.now }, 
  },
  { timestamps: true }
);

export const Enrollment = mongoose.model<IEnrollment>(
  "Enrollment",
  enrollmentSchema
);
