import mongoose, { Schema, Document } from "mongoose";

export interface IDiscussionPost extends Document {
    course: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    title: string;
    content: string;
    createdAt: Date;
}

const discussionPostSchema = new Schema<IDiscussionPost>(
    {
        course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        title: { type: String, required: true },
        content: { type: String, required: true },
    },
    { timestamps: true }
);

export const DiscussionPost = mongoose.model<IDiscussionPost>(
    "DiscussionPost",
    discussionPostSchema
);

export interface IDiscussionComment extends Document {
    post: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
}

const discussionCommentSchema = new Schema<IDiscussionComment>(
    {
        post: { type: Schema.Types.ObjectId, ref: "DiscussionPost", required: true },
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        content: { type: String, required: true },
    },
    { timestamps: true }
);

export const DiscussionComment = mongoose.model<IDiscussionComment>(
    "DiscussionComment",
    discussionCommentSchema
);
