import { Response } from "express";
import type { AuthRequest } from "../types/auth-request";
import { DiscussionPost, DiscussionComment } from "../models/discussion.model";
import { getIO } from "../socket";

export const createPost = async (req: AuthRequest, res: Response) => {
    try {
        const { courseId } = req.params;
        const { title, content } = req.body;
        const userId = req.user!._id;

        const post = await DiscussionPost.create({
            course: courseId,
            user: userId,
            title,
            content,
        });

        const populatedPost = await post.populate("user", "name");
        getIO().to(courseId).emit("new_post", populatedPost);

        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: "Failed to create post" });
    }
};

export const getCoursePosts = async (req: AuthRequest, res: Response) => {
    try {
        const { courseId } = req.params;
        const posts = await DiscussionPost.find({ course: courseId })
            .populate("user", "name")
            .sort({ createdAt: -1 });

        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch posts" });
    }
};

export const createComment = async (req: AuthRequest, res: Response) => {
    try {
        const { postId } = req.params;
        const { content } = req.body;
        const userId = req.user!._id;

        const comment = await DiscussionComment.create({
            post: postId,
            user: userId,
            content,
        });

        const populatedComment = await comment.populate("user", "name");
        const discussionPost = await DiscussionPost.findById(postId);
        if (discussionPost) {
            getIO().to(discussionPost.course.toString()).emit("new_comment", populatedComment);
        }

        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ message: "Failed to create comment" });
    }
};

export const getPostComments = async (req: AuthRequest, res: Response) => {
    try {
        const { postId } = req.params;
        const comments = await DiscussionComment.find({ post: postId })
            .populate("user", "name")
            .sort({ createdAt: 1 });

        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch comments" });
    }
};
