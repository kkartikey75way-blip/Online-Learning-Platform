import { Response } from "express";
import type { AuthRequest } from "../types/auth-request";
import { Lesson } from "../models/lesson.model";
import { Module } from "../models/module.model";
import { Enrollment } from "../models/enrollment.model";
import { Course } from "../models/course.model";
import mongoose from "mongoose";

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

    if (!mongoose.Types.ObjectId.isValid(moduleId)) {
      return res.status(400).json({
        message: "Invalid moduleId",
      });
    }

    const lesson = await Lesson.create({
      title,
      module: moduleId,
      content: content || "",
      videoUrl: videoUrl || null,
      order: order ?? 0,
    });

    return res.status(201).json(lesson);
  } catch (error) {
    console.error("Create lesson error:", error);
    return res.status(500).json({
      message: "Lesson creation failed",
    });
  }
};

export const getLessonsByModule = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { moduleId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(moduleId)) {
      return res.status(400).json({
        message: "Invalid moduleId",
      });
    }

    // 1. Find the module to get the course ID
    const module = await Module.findById(moduleId);
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    const courseId = module.course;
    const userId = req.user?._id;

    // 2. Check if user is the instructor
    const course = await Course.findById(courseId);
    const isInstructor = course?.instructor.toString() === userId?.toString();

    // 3. Check if user is enrolled
    const isEnrolled = await Enrollment.findOne({
      user: userId,
      course: courseId,
    });

    if (!isInstructor && !isEnrolled) {
      return res.status(403).json({
        message: "You must be enrolled to access lesson content",
      });
    }

    const lessons = await Lesson.find({ module: moduleId }).sort({ order: 1 });

    return res.status(200).json(lessons);
  } catch (error) {
    console.error("Fetch lessons error:", error);
    return res.status(500).json({
      message: "Failed to fetch lessons",
    });
  }
};
