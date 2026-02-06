import { Response } from "express";
import type { AuthRequest } from "../types/auth-request";
import { Progress } from "../models/progress.model";
import { Course } from "../models/course.model";
import { Module } from "../models/module.model";
import { Lesson } from "../models/lesson.model";

export const getCourseProgress = async (
  req: AuthRequest,
  res: Response
) => {
  const { courseId } = req.params;
  const userId = req.user!._id;

  const course = await Course.findById(courseId);
  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  let progress = await Progress.findOne({
    user: userId,
    course: courseId,
  });

  if (!progress) {
    progress = await Progress.create({
      user: userId,
      course: courseId,
      completedLessons: [],
      progressPercent: 0,
      completed: false,
    });
  }

  const modules = await Module.find({ course: courseId });
  const moduleIds = modules.map((m) => m._id);

  const lessons = await Lesson.find({
    module: { $in: moduleIds },
  }).sort({ order: 1 });

  const completedSet = new Set(
    progress.completedLessons.map((l) => l.toString())
  );

  // 🔐 DRIP LOGIC
  let unlockedLessons: string[] = [];

  if (!course.dripEnabled) {
    unlockedLessons = lessons.map((l) => l._id.toString());
  } else {
    lessons.forEach((lesson, index) => {
      if (index === 0) {
        unlockedLessons.push(lesson._id.toString());
      } else {
        const prev = lessons[index - 1];
        if (completedSet.has(prev._id.toString())) {
          unlockedLessons.push(lesson._id.toString());
        }
      }
    });
  }

  res.json({
    progressPercent: progress.progressPercent,
    completedLessons: [...completedSet],
    unlockedLessons,
  });
};

export const markLessonComplete = async (
  req: AuthRequest,
  res: Response
) => {
  const { courseId, lessonId } = req.body;
  const userId = req.user!._id;

  let progress = await Progress.findOne({
    user: userId,
    course: courseId,
  });

  if (!progress) {
    progress = await Progress.create({
      user: userId,
      course: courseId,
      completedLessons: [],
    });
  }

  if (
    progress.completedLessons.some(
      (l) => l.toString() === lessonId
    )
  ) {
    return res.json(progress);
  }

  progress.completedLessons.push(lessonId);

  const modules = await Module.find({ course: courseId });
  const moduleIds = modules.map((m) => m._id);

  const totalLessons = await Lesson.countDocuments({
    module: { $in: moduleIds },
  });

  const completedCount =
    progress.completedLessons.length;

  progress.progressPercent = Math.round(
    (completedCount / totalLessons) * 100
  );

  progress.completed =
    progress.progressPercent === 100;

  await progress.save();

  return res.status(200).json(progress);
};
