import { Request, Response } from "express";
import { Lesson } from "../models/lesson.model";

export const createLesson = async (req: Request, res: Response) => {
  try {
    const {
      title,
      moduleId,
      videoUrl,
      content,
      order,
      releaseDate,
      duration,
    } = req.body;

    const lesson = await Lesson.create({
      title,
      module: moduleId,
      videoUrl,
      content,
      order,
      releaseDate,
      duration,
    });

    res.status(201).json(lesson);
  } catch {
    res.status(500).json({ message: "Failed to create lesson" });
  }
};

export const getLessonsByModule = async (
  req: Request,
  res: Response
) => {
  try {
    const lessons = await Lesson.find({
      module: req.params.moduleId,
    }).sort({ order: 1 });

    res.json(lessons);
  } catch {
    res.status(500).json({ message: "Failed to fetch lessons" });
  }
};
