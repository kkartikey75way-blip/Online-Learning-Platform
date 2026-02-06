import { Response } from "express";
import type { AuthRequest } from "../types/auth-request";
import { Message } from "../models/message.model";
import { Course } from "../models/course.model";
import { getIO } from "../socket";

export const sendMessage = async (req: AuthRequest, res: Response) => {
    try {
        const { courseId } = req.params;
        const { content, receiverId } = req.body;
        const senderId = req.user!._id;

        if (!content || !receiverId) {
            return res.status(400).json({ message: "Content and receiverId are required" });
        }

        const message = await Message.create({
            sender: senderId,
            receiver: receiverId,
            course: courseId,
            content,
        });

        const populatedMessage = await message.populate("sender", "name");

        // Emit to receiver's personal room
        getIO().to(receiverId.toString()).emit("private_message", populatedMessage);

        res.status(201).json(message);
    } catch (error) {
        console.error("Send message error:", error);
        res.status(500).json({ message: "Failed to send message" });
    }
};

export const getConversation = async (req: AuthRequest, res: Response) => {
    try {
        const { courseId, otherUserId } = req.params;
        const userId = req.user!._id;

        const messages = await Message.find({
            course: courseId,
            $or: [
                { sender: userId, receiver: otherUserId },
                { sender: otherUserId, receiver: userId },
            ],
        })
            .populate("sender", "name")
            .sort({ createdAt: 1 });

        res.json(messages);
    } catch (error) {
        console.error("Fetch conversation error:", error);
        res.status(500).json({ message: "Failed to fetch messages" });
    }
};

export const getStudentConversations = async (req: AuthRequest, res: Response) => {
    try {
        const { courseId } = req.params;
        const instructorId = req.user!._id;

        // Verify ownership
        const course = await Course.findById(courseId);
        if (!course || course.instructor.toString() !== instructorId.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // This is a simplified version to get list of students who messaged
        const students = await Message.distinct("sender", {
            course: courseId,
            receiver: instructorId,
        });

        const studentData = await Promise.all(
            students.map(async (sid) => {
                const lastMsg = await Message.findOne({
                    course: courseId,
                    $or: [{ sender: sid }, { receiver: sid }],
                })
                    .sort({ createdAt: -1 })
                    .populate("sender", "name");
                return {
                    studentId: sid,
                    lastMessage: lastMsg,
                };
            })
        );

        res.json(studentData);
    } catch (error) {
        console.error("Fetch student conversations error:", error);
        res.status(500).json({ message: "Failed to fetch conversations" });
    }
};
