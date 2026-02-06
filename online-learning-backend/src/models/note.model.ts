import mongoose, { Schema, Document } from "mongoose";

export interface INote extends Document {
    user: mongoose.Types.ObjectId;
    lesson: mongoose.Types.ObjectId;
    content: string;
    updatedAt: Date;
}

const noteSchema = new Schema<INote>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        lesson: { type: Schema.Types.ObjectId, ref: "Lesson", required: true },
        content: { type: String, required: true },
    },
    { timestamps: true }
);

// Ensure a user has only one note per lesson
noteSchema.index({ user: 1, lesson: 1 }, { unique: true });

export const Note = mongoose.model<INote>("Note", noteSchema);
