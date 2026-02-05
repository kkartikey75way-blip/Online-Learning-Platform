import { Response } from "express";
import type { AuthRequest } from "../types/auth-request";
import { Course } from "../models/course.model";
import { Enrollment } from "../models/enrollment.model";

export const createCourse = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const {
      title,
      description,
      category,
      price,
      capacity,
      dripEnabled,
    } = req.body;

    const course = await Course.create({
      title,
      description,
      category,
      price,
      capacity,
      dripEnabled,
      instructor: req.user._id,
    });

    res.status(201).json(course);
  } catch {
    res.status(500).json({ message: "Course creation failed" });
  }
};

export const getAllCourses = async (
  _req: AuthRequest,
  res: Response
) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .populate("instructor", "name email")
      .sort({ createdAt: -1 });

    res.json(courses);
  } catch {
    res.status(500).json({ message: "Failed to fetch courses" });
  }
};

export const getCourseById = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("instructor", "name email");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);
  } catch {
    res.status(500).json({ message: "Failed to fetch course" });
  }
};

export const enrollInCourse = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user._id;
    const courseId = req.params.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.enrolledCount >= course.capacity) {
      return res.status(400).json({ message: "Course is full" });
    }

    const alreadyEnrolled = await Enrollment.findOne({
      user: userId,
      course: courseId,
    });

    if (alreadyEnrolled) {
      return res.status(400).json({
        message: "Already enrolled",
      });
    }

    await Enrollment.create({
      user: userId,
      course: courseId,
    });

    await Course.findByIdAndUpdate(courseId, {
      $inc: { enrolledCount: 1 },
    });

    res.json({ message: "Enrolled successfully" });
  } catch (error) {
    console.error("Enrollment error:", error);
    res.status(500).json({ message: "Enrollment failed" });
  }
};
export const getMyEnrolledCourses = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const enrollments = await Enrollment.find({
      user: req.user._id,
    }).populate({
      path: "course",
      populate: {
        path: "instructor",
        select: "name",
      },
    });

    res.json(enrollments);
  } catch {
    res
      .status(500)
      .json({ message: "Failed to fetch enrollments" });
  }
};

