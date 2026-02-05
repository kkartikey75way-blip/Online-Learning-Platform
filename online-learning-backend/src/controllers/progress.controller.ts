import { Response } from "express";
import type { AuthRequest } from "../types/auth-request";
import { Progress } from "../models/progress.model";
import { Lesson } from "../models/lesson.model";
import { Module } from "../models/module.model";

export const markComplete = async (
  req: AuthRequest,
  res: Response
) => {
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

  // ✅ count lessons ONLY for this course
  const modules = await Module.find({ course: courseId });
  const moduleIds = modules.map((m) => m._id);

  const totalLessons = await Lesson.countDocuments({
    module: { $in: moduleIds },
  });

  const completedCount = progress.completedLessons.length;

  progress.progressPercent = Math.round(
    (completedCount / totalLessons) * 100
  );

  progress.completed = progress.progressPercent === 100;

  await progress.save();

  res.json(progress);
};
