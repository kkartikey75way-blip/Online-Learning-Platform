import { Response } from "express";
import type { AuthRequest } from "../types/auth-request";
import { Course } from "../models/course.model";
import { Enrollment } from "../models/enrollment.model";


export const createCourse = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user || req.user.role !== "INSTRUCTOR") {
      return res.status(403).json({
        message: "Only instructors can create courses",
      });
    }

    const {
      title,
      description,
      category,
      price,
      capacity,
      dripEnabled,
    } = req.body;

    if (!title || !description || !category || !capacity) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const course = await Course.create({
      title,
      description,
      category,
      price: price ?? 0,
      capacity,
      dripEnabled: dripEnabled ?? false,
      instructor: req.user._id,
      isPublished: false, // 👈 DRAFT by default
      enrolledCount: 0,
    });

    res.status(201).json(course);
  } catch (error) {
    console.error("Create course error:", error);
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
  } catch (error) {
    console.error("Fetch courses error:", error);
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
  } catch (error) {
    console.error("Fetch course error:", error);
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

    const courseId = req.params.id;

    const course = await Course.findById(courseId);
    if (!course || !course.isPublished) {
      return res.status(404).json({ message: "Course not available" });
    }

    if (course.enrolledCount >= course.capacity) {
      return res.status(400).json({ message: "Course is full" });
    }

    const exists = await Enrollment.findOne({
      user: req.user._id,
      course: courseId,
    });

    if (exists) {
      return res.status(400).json({
        message: "Already enrolled",
      });
    }

    // Atomic operation
    await Enrollment.create({
      user: req.user._id,
      course: courseId,
      progress: 0,
      completed: false,
    });

    await Course.updateOne(
      { _id: courseId },
      { $inc: { enrolledCount: 1 } }
    );

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
  } catch (error) {
    console.error("Fetch enrollments error:", error);
    res.status(500).json({
      message: "Failed to fetch enrollments",
    });
  }
};
