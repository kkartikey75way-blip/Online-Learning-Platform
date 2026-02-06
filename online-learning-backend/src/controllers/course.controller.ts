import { Response } from "express";
import mongoose from "mongoose";

import type { AuthRequest } from "../types/auth-request";
import { Course } from "../models/course.model";
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
      (course.instructor as any)._id.toString() ===
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
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const courseId = req.params.id;

    const course = await Course.findById(courseId);
    if (!course || !course.isPublished) {
      return res.status(404).json({
        message: "Course not available",
      });
    }

    if (course.enrolledCount >= course.capacity) {
      return res.status(400).json({
        message: "Course is full",
      });
    }

    const alreadyEnrolled = await Enrollment.findOne({
      user: req.user._id,
      course: courseId,
    });

    if (alreadyEnrolled) {
      return res.status(400).json({
        message: "Already enrolled",
      });
    }

    // Create enrollment
    await Enrollment.create({
      user: req.user._id,
      course: courseId,
    });

    // Initialize progress (Upsert to avoid E11000 duplicate key error)
    await Progress.findOneAndUpdate(
      { user: req.user._id, course: courseId },
      {
        $setOnInsert: {
          completedLessons: [],
          progressPercent: 0,
          completed: false
        }
      },
      { upsert: true, new: true }
    );

    // Increment count
    await Course.updateOne(
      { _id: courseId },
      { $inc: { enrolledCount: 1 } }
    );

    res.json({
      message: "Enrolled successfully",
    });
  } catch (error) {
    console.error("Enrollment error:", error);
    res.status(500).json({
      message: "Enrollment failed",
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

    // 🔹 CASCADE DELETION WITH VERBOSE LOGGING
    console.log(`[DELETE] Starting deletion for course: ${course._id} (${course.title})`);

    // 1. Find Modules
    const modules = await Module.find({ course: course._id });
    const moduleIds = modules.map(m => m._id);
    console.log(`[DELETE] Step 1: Found ${moduleIds.length} modules.`);

    // 2. Find Lessons
    const lessons = moduleIds.length
      ? await Lesson.find({ module: { $in: moduleIds } })
      : [];
    const lessonIds = lessons.map(l => l._id);
    console.log(`[DELETE] Step 2: Found ${lessonIds.length} lessons.`);

    // 3. Find Assignments & Quizzes
    const assignments = lessonIds.length
      ? await Assignment.find({ lesson: { $in: lessonIds } })
      : [];
    const assignmentIds = assignments.map(a => a._id);

    const quizzes = lessonIds.length
      ? await Quiz.find({ lesson: { $in: lessonIds } })
      : [];
    const quizIds = quizzes.map(q => q._id);
    console.log(`[DELETE] Step 3: Found ${assignmentIds.length} assignments and ${quizIds.length} quizzes.`);

    // 4. Delete Dependent Data
    try {
      if (assignmentIds.length) {
        const delSub = await Submission.deleteMany({ assignment: { $in: assignmentIds } });
        console.log(`[DELETE] Step 4a: Deleted ${delSub.deletedCount} submissions.`);
      }

      if (quizIds.length) {
        const delQue = await Question.deleteMany({ quiz: { $in: quizIds } });
        console.log(`[DELETE] Step 4b: Deleted ${delQue.deletedCount} quiz questions.`);
      }

      const delAsg = await Assignment.deleteMany({ _id: { $in: assignmentIds } });
      const delQiz = await Quiz.deleteMany({ _id: { $in: quizIds } });
      console.log(`[DELETE] Step 4c: Deleted assignments (${delAsg.deletedCount}) and quizzes (${delQiz.deletedCount}).`);

      const delLes = await Lesson.deleteMany({ _id: { $in: lessonIds } });
      console.log(`[DELETE] Step 4d: Deleted ${delLes.deletedCount} lessons.`);

      const delMod = await Module.deleteMany({ _id: { $in: moduleIds } });
      console.log(`[DELETE] Step 4e: Deleted ${delMod.deletedCount} modules.`);

      // 5. User-related data
      const delEnr = await Enrollment.deleteMany({ course: course._id });
      const delPrg = await Progress.deleteMany({ course: course._id });
      const delCer = await Certificate.deleteMany({ course: course._id });
      console.log(`[DELETE] Step 5: Deleted enrollments (${delEnr.deletedCount}), progress (${delPrg.deletedCount}), and certificates (${delCer.deletedCount}).`);

      // 6. Final: delete course
      await Course.findByIdAndDelete(course._id);
      console.log(`[DELETE] Step 6: Course ${course._id} deleted successfully.`);

      return res.json({
        message: "Course deleted successfully",
        details: {
          modules: moduleIds.length,
          lessons: lessonIds.length,
          assignments: assignmentIds.length,
          quizzes: quizIds.length
        }
      });

    } catch (stepError) {
      console.error("[DELETE] Error during cascading steps:", stepError);
      throw stepError; // Re-throw to be caught by the outer catch
    }

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

