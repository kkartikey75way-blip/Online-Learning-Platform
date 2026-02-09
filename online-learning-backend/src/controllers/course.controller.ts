import { Response } from "express";
import mongoose from "mongoose";

import type { AuthRequest } from "../types/auth-request";
import { Course } from "../models/course.model";
import { User } from "../models/user.model";
import { Enrollment } from "../models/enrollment.model";
import { Progress } from "../models/progress.model";
import { Module } from "../models/module.model";
import { Lesson } from "../models/lesson.model";
import { Assignment } from "../models/assignment.model";
import { Quiz } from "../models/quiz.model";
import { Question } from "../models/question.model";
import { Submission } from "../models/submission.model";
import { Certificate } from "../models/certificate.model";


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
      isPublished: false, // draft
      enrolledCount: 0,
    });

    res.status(201).json(course);
  } catch (error) {
    console.error("Create course error:", error);
    res.status(500).json({
      message: "Course creation failed",
    });
  }
};

export const getAllCourses = async (
  _req: AuthRequest,
  res: Response
) => {
  try {
    const courses = await Course.find({
      isPublished: true,
    })
      .populate("instructor", "name")
      .sort({ createdAt: -1 });

    res.json(courses);
  } catch (error) {
    console.error("Fetch courses error:", error);
    res.status(500).json({
      message: "Failed to fetch courses",
    });
  }
};
export const getCoursesByInstructor = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { instructorId } = req.params;
    const courses = await Course.find({
      instructor: instructorId,
      isPublished: true,
    })
      .populate("instructor", "name")
      .sort({ createdAt: -1 });

    res.json(courses);
  } catch (error) {
    console.error("Fetch instructor courses error:", error);
    res.status(500).json({
      message: "Failed to fetch instructor courses",
    });
  }
};

export const getRecommendedCourses = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    interface CourseQuery {
      isPublished: boolean;
      category?: { $in: string[] };
    }

    const query: CourseQuery = { isPublished: true };

    if (user.interests && user.interests.length > 0) {
      query.category = { $in: user.interests };
    }

    const recommendations = await Course.find(query)
      .populate("instructor", "name")
      .sort({ enrolledCount: -1 })
      .limit(6);

    if (recommendations.length === 0 && user.interests && user.interests.length > 0) {
      const generalPopular = await Course.find({ isPublished: true })
        .populate("instructor", "name")
        .sort({ enrolledCount: -1 })
        .limit(6);
      return res.json(generalPopular);
    }

    res.json(recommendations);
  } catch (error) {
    console.error("Fetch recommendations error:", error);
    res.status(500).json({
      message: "Failed to fetch recommendations",
    });
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
      return res.status(404).json({
        message: "Course not found",
      });
    }

    const isInstructor =
      !!req.user &&
      course.instructor &&
      (course.instructor as { _id: { toString(): string } })._id.toString() ===
      req.user._id.toString();

    if (!course.isPublished && !isInstructor) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    return res.json(course);
  } catch (error) {
    console.error("Fetch course error:", error);
    return res.status(500).json({
      message: "Failed to fetch course",
    });
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
    await CourseService.enrollUser(req.user._id.toString(), courseId);

    res.json({
      message: "Enrolled successfully",
    });
  } catch (error: unknown) {
    console.error("Enrollment error:", error);
    const message = error instanceof Error ? error.message : "Enrollment failed";
    res.status(400).json({
      message,
    });
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
    })
      .populate({
        path: "course",
        populate: {
          path: "instructor",
          select: "name",
        },
      })
      .lean();

    // ✅ FILTER OUT orphaned enrollments
    const validEnrollments = enrollments.filter(
      (e) => e.course !== null
    );

    const progress = await Progress.find({
      user: req.user._id,
    });

    const progressMap = new Map(
      progress.map((p) => [
        p.course.toString(),
        p.progressPercent,
      ])
    );

    const result = validEnrollments.map((e) => ({
      ...e,
      progressPercent:
        progressMap.get(e.course._id.toString()) || 0,
    }));

    return res.json(result);
  } catch (error) {
    console.error("Fetch enrollments error:", error);
    return res.status(500).json({
      message: "Failed to fetch enrollments",
    });
  }
};

export const publishCourse = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }
    if (
      course.instructor.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You do not own this course",
      });
    }

    course.isPublished = true;
    await course.save();

    res.json({
      message: "Course published successfully",
      isPublished: true,
    });
  } catch (err) {
    console.error("Publish error:", err);
    res.status(500).json({
      message: "Publish failed",
    });
  }
};

import { CourseService } from "../services/course.service";

export const deleteCourse = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You do not own this course" });
    }

    await CourseService.deleteCourseCascade(req.params.id);

    return res.json({
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Course deletion failed:", error);
    return res.status(500).json({
      message: "Failed to delete course",
      error: String(error),
    });
  }
};


export const updateCourse = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You do not own this course" });
    }

    const {
      title,
      description,
      category,
      price,
      capacity,
      dripEnabled,
    } = req.body;

    course.title = title || course.title;
    course.description = description || course.description;
    course.category = category || course.category;
    course.price = price !== undefined ? price : course.price;
    course.capacity = capacity !== undefined ? capacity : course.capacity;
    course.dripEnabled = dripEnabled !== undefined ? dripEnabled : course.dripEnabled;

    await course.save();

    return res.status(200).json(course);

  } catch (err) {
    console.error("Update error:", err);
    return res.status(500).json({ message: "Update failed" });
  }
};

