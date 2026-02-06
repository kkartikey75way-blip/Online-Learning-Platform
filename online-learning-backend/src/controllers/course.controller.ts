import { Response } from "express";
import type { AuthRequest } from "../types/auth-request";
import { Course } from "../models/course.model";
import { Enrollment } from "../models/enrollment.model";
import { Progress } from "../models/progress.model";

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

    // Initialize progress
    await Progress.create({
      user: req.user._id,
      course: courseId,
      completedLessons: [],
      percentage: 0,
    });

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
      return res.status(401).json({
        message: "Unauthorized",
      });
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

    const progress = await Progress.find({
      user: req.user._id,
    });

    const progressMap = new Map(
      progress.map((p) => [
        p.course.toString(),
        p.progressPercent,
      ])
    );

    const result = enrollments.map((e) => ({
      ...e,
      progressPercent:
        progressMap.get(e.course._id.toString()) || 0,
    }));

    res.json(result);
  } catch (error) {
    console.error("Fetch enrollments error:", error);
    res.status(500).json({
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

    // Optional: Delete related enrollments/progress/lessons/modules here if desired
    // For now, simple document deletion
    await Course.findByIdAndDelete(req.params.id);

    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Delete failed" });
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

