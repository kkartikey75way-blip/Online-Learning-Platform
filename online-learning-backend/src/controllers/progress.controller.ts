import { Response } from "express";
import type { AuthRequest } from "../types/auth-request";
import mongoose from "mongoose";
import { Progress } from "../models/progress.model";
import { Lesson } from "../models/lesson.model";
import { Module } from "../models/module.model";

export const markLessonComplete = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { courseId, lessonId } = req.body;
    const userId = req.user._id;

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
        (id: mongoose.Types.ObjectId) =>
          id.toString() === lessonId
      )
    ) {
      return res.json(progress);
    }

    progress.completedLessons.push(
      new mongoose.Types.ObjectId(lessonId)
    );

    const modules = await Module.find(
      { course: courseId },
      "_id"
    );

    const moduleIds = modules.map((m) => m._id);


    const totalLessons = await Lesson.countDocuments({
      module: { $in: moduleIds },
    });

    const completedCount =
      progress.completedLessons.length;

    progress.progressPercent =
      totalLessons === 0
        ? 0
        : Math.round(
            (completedCount / totalLessons) * 100
          );

    progress.completed =
      progress.progressPercent === 100;

    await progress.save();

    res.json(progress);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update progress",
    });
  }
};
