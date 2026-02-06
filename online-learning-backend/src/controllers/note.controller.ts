import { Response } from "express";
import type { AuthRequest } from "../types/auth-request";
import { Note } from "../models/note.model";

export const saveNote = async (req: AuthRequest, res: Response) => {
    try {
        const { lessonId } = req.params;
        const { content } = req.body;
        const userId = req.user!._id;

        const note = await Note.findOneAndUpdate(
            { user: userId, lesson: lessonId },
            { content },
            { upsert: true, new: true }
        );

        res.json(note);
    } catch (error) {
        res.status(500).json({ message: "Failed to save note" });
    }
};

export const getNote = async (req: AuthRequest, res: Response) => {
    try {
        const { lessonId } = req.params;
        const userId = req.user!._id;

        const note = await Note.findOne({ user: userId, lesson: lessonId });
        res.json(note);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch note" });
    }
};
