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


        const course = await Course.findById(courseId);
        if (!course || course.instructor.toString() !== instructorId.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }


        // Find unique students who have either sent messages to or received messages from this instructor for this course
        const studentMessages = await Message.find({
            course: courseId,
            $or: [{ sender: instructorId }, { receiver: instructorId }],
        });

        const studentIds = new Set<string>();
        studentMessages.forEach(msg => {
            const sid = msg.sender.toString() === instructorId.toString()
                ? msg.receiver.toString()
                : msg.sender.toString();
            studentIds.add(sid);
        });

        const studentData = await Promise.all(
            Array.from(studentIds).map(async (sid) => {
                const lastMsg = await Message.findOne({
                    course: courseId,
                    $or: [
                        { sender: sid, receiver: instructorId },
                        { sender: instructorId, receiver: sid }
                    ],
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
