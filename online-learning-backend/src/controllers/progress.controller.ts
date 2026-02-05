import { Response } from "express";
import type { AuthRequest } from "../types/auth-request";
import { Progress } from "../models/progress.model";
import { Lesson } from "../models/lesson.model";

export const markComplete = async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.sendStatus(401);

  const { courseId, lessonId } = req.body;

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

  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId);
  }

  const total = await Lesson.countDocuments({});
  progress.progressPercent = Math.round(
    (progress.completedLessons.length / total) * 100
  );

  progress.completed = progress.progressPercent === 100;
  await progress.save();

  res.json(progress);
};
