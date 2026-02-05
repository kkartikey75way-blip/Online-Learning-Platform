import mongoose, { Schema, Document } from "mongoose";

export interface ICourse extends Document {
  title: string;
  description: string;
  category: string;
  instructor: mongoose.Types.ObjectId;
  price: number;
  capacity: number;
  enrolledCount: number;
  isPublished: boolean;
  dripEnabled: boolean;
}

const courseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },

    instructor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    price: { type: Number, default: 0 },
    capacity: { type: Number, required: true },
    enrolledCount: { type: Number, default: 0 },

    isPublished: { type: Boolean, default: true },
    dripEnabled: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Course = mongoose.model<ICourse>("Course", courseSchema);
