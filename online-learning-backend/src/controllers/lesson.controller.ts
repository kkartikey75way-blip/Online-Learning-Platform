import cloudinary from "../config/cloudinary";
import type { AuthRequest } from "../types/auth-request";
import { Response } from "express";
import { Lesson } from "../models/lesson.model";

export const createLesson = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { title, moduleId, content, order } = req.body;

    let videoUrl: string | undefined;

    if (req.file) {
      const result = await cloudinary.uploader.upload(
        req.file.path,
        {
          folder: "online-learning",
          resource_type: "auto",
        }
      );

      videoUrl = result.secure_url;
    }

    const lesson = await Lesson.create({
      title,
      module: moduleId,
      content,
      order,
      videoUrl,
    });

    res.status(201).json(lesson);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lesson creation failed" });
  }
};
