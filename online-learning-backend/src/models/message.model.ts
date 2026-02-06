import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
    sender: mongoose.Types.ObjectId;
    receiver: mongoose.Types.ObjectId;
    course: mongoose.Types.ObjectId;
    content: string;
    isRead: boolean;
    createdAt: Date;
}

const messageSchema = new Schema<IMessage>(
    {
        sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
        receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
        course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
        content: { type: String, required: true },
        isRead: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Index for fast fetching of conversation history
messageSchema.index({ sender: 1, receiver: 1, course: 1 });
messageSchema.index({ receiver: 1, sender: 1, course: 1 });

export const Message = mongoose.model<IMessage>("Message", messageSchema);
