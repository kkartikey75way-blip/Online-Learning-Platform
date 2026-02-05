import { Response } from "express";
import { Lesson } from "../models/lesson.model";
import { Progress } from "../models/progress.model";
import type { AuthRequest } from "../types/auth-request";

export const markLessonComplete = async (
  req: AuthRequest,
  res: Response
) => {
  const { lessonId, courseId } = req.body;

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  let progress = await Progress.findOne({
    user: req.user._id,
    course: courseId,
  });

  if (!progress) {
    progress = await Progress.create({
      user: req.user._id,
      course: courseId,
      completedLessons: [],
    });
  }

  if (
    !progress.completedLessons.some(
      (id) => id.toString() === lessonId
    )
  ) {
    progress.completedLessons.push(lessonId);
  }

  const totalLessons = await Lesson.countDocuments({
    course: courseId,
  });

  progress.percentage = Math.round(
    (progress.completedLessons.length / totalLessons) * 100
  );

  progress.completed = progress.percentage === 100;

  await progress.save();

  res.json(progress);
};
