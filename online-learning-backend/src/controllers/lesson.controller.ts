import { Response } from "express";
import type { AuthRequest } from "../types/auth-request";
import { Lesson } from "../models/lesson.model";

/**
 * CREATE LESSON (Instructor)
 */
export const createLesson = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { title, moduleId, content, order, videoUrl } = req.body;

    if (!req.user || req.user.role !== "INSTRUCTOR") {
      return res.status(403).json({
        message: "Only instructors can create lessons",
      });
    }

    if (!title || !moduleId) {
      return res.status(400).json({
        message: "Title and moduleId are required",
      });
    }

    const lesson = await Lesson.create({
      title,
      module: moduleId,
      content,
      videoUrl,
      order: order ?? 0,
    });

    res.status(201).json(lesson);
  } catch (error) {
    console.error("Create lesson error:", error);
    res.status(500).json({
      message: "Lesson creation failed",
    });
  }
};

/**
 * ✅ GET LESSONS BY MODULE (Student + Instructor)
 */
export const getLessonsByModule = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { moduleId } = req.params;

    const lessons = await Lesson.find({
      module: moduleId,
    }).sort({ order: 1 });

    res.json(lessons);
  } catch (error) {
    console.error("Fetch lessons error:", error);
    res.status(500).json({
      message: "Failed to fetch lessons",
    });
  }
};
