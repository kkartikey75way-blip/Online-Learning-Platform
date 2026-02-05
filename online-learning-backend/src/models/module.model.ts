import mongoose, { Schema, Document } from "mongoose";

export interface IModule extends Document {
  title: string;
  course: mongoose.Types.ObjectId;
  order: number;
}

const moduleSchema = new Schema<IModule>(
  {
    title: { type: String, required: true },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Module = mongoose.model<IModule>("Module", moduleSchema);
