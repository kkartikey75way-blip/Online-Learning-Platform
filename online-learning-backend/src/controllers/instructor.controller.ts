import { Response } from "express";
import type { AuthRequest } from "../types/auth-request";
import { Course } from "../models/course.model";
import { Enrollment } from "../models/enrollment.model";
import { Progress } from "../models/progress.model";

export const getInstructorStats = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const instructorId = req.user._id;


    const courses = await Course.find({
      instructor: instructorId,
    });

    const courseIds = courses.map((c) => c._id);


    const enrollments = await Enrollment.find({
      course: { $in: courseIds },
    });


    const uniqueStudents = new Set(
      enrollments.map((e) => e.user.toString())
    );


    const progress = await Progress.find({
      course: { $in: courseIds },
    });


    const averageCompletion =
      progress.length === 0
        ? 0
        : Math.round(
            progress.reduce(
              (sum, p) => sum + p.progressPercent,
              0
            ) / progress.length
          );

    // 6️⃣ Per-course stats
    const courseStats = courses.map((course) => {
      const courseEnrollments = enrollments.filter(
        (e) => e.course.toString() === course._id.toString()
      );

      const courseProgress = progress.filter(
        (p) => p.course.toString() === course._id.toString()
      );

      const completion =
        courseProgress.length === 0
          ? 0
          : Math.round(
              courseProgress.reduce(
                (s, p) => s + p.progressPercent,
                0
              ) / courseProgress.length
            );

      return {
        id: course._id,
        title: course.title,
        enrolled: courseEnrollments.length,
        capacity: course.capacity,
        completion,
        isPublished: course.isPublished,
      };
    });

    res.json({
      totalCourses: courses.length,
      totalEnrollments: enrollments.length,
      totalStudents: uniqueStudents.size,
      averageCompletion,
      courseStats,
    });
  } catch (error) {
    console.error("Instructor stats error:", error);
    res.status(500).json({
      message: "Failed to fetch instructor stats",
    });
  }
};
