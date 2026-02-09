import { Response } from "express";
import type { AuthRequest } from "../types/auth-request";
import { Course } from "../models/course.model";
import { Enrollment } from "../models/enrollment.model";
import { Progress } from "../models/progress.model";

import { InstructorService } from "../services/instructor.service";

export const getInstructorStats = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const stats = await InstructorService.getStats(req.user._id.toString());
    res.json(stats);
  } catch (error) {
    console.error("Instructor stats error:", error);
    res.status(500).json({
      message: "Failed to fetch instructor stats",
    });
  }
};

export const getCourseStudentAnalytics = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { courseId } = req.params;
    const analytics = await InstructorService.getStudentAnalytics(courseId);
    res.json(analytics);
  } catch (error) {
    console.error("Fetch course analytics error:", error);
    res.status(500).json({
      message: "Failed to fetch student analytics",
    });
  }
};
