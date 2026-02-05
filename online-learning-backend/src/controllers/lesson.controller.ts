import { Response } from "express";
import type { AuthRequest } from "../types/auth-request";
import { Lesson } from "../models/lesson.model";

export const createLesson = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { title, moduleId, content, order } = req.body;

    const videoUrl = req.file
      ? (req.file as any).path // Cloudinary URL
      : undefined;

    const lesson = await Lesson.create({
      title,
      module: moduleId,
      content,
      videoUrl,
      order,
    });

    res.status(201).json(lesson);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lesson creation failed" });
  }
};
