import { Response } from "express";
import type { AuthRequest } from "../types/auth-request";
import { Progress } from "../models/progress.model";
import { Course } from "../models/course.model";
import { Module } from "../models/module.model";
import { Lesson } from "../models/lesson.model";
import { Enrollment } from "../models/enrollment.model";

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

  const enrollment = await Enrollment.findOne({
    user: userId,
    course: courseId,
  });

  const isInstructor = course.instructor.toString() === userId.toString();

  if (!enrollment && !isInstructor) {
    return res.status(403).json({ message: "Not enrolled in this course" });
  }

  let progress = await Progress.findOne({
    user: userId,
    course: courseId,
  });

  if (!progress && isInstructor) {
    // Return a dummy progress for instructor preview
    return res.json({
      progressPercent: 0,
      completedLessons: [],
      unlockedLessons: (await Lesson.find({ module: { $in: (await Module.find({ course: courseId })).map(m => m._id) } })).map(l => l._id.toString())
    });
  }

  if (!progress) {
    return res.status(404).json({ message: "Progress not found" });
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
    progress = await Progress.findOneAndUpdate(
      { user: userId, course: courseId },
      {
        $setOnInsert: {
          completedLessons: [],
          progressPercent: 0,
          completed: false,
        },
      },
      { upsert: true, new: true }
    ) as any;
  }

  if (!progress) {
    return res.status(500).json({ message: "Failed to initialize progress" });
  }

  if (
    progress.completedLessons.some(
      (l) => l.toString() === lessonId
    )
  ) {
    return res.json(progress);
  }

  progress.completedLessons.push(lessonId as any);

  const modules = await Module.find({ course: courseId });
  const moduleIds = modules.map((m) => m._id);

  const totalLessons = await Lesson.countDocuments({
    module: { $in: moduleIds },
  });

  const completedCount = progress.completedLessons.length;

  progress.progressPercent = Math.round(
    (completedCount / totalLessons) * 100
  );

  progress.completed =
    progress.progressPercent === 100;

  await progress.save();

  return res.status(200).json(progress);
};
