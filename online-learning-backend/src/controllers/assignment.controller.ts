import { Response } from "express";
import type { AuthRequest } from "../types/auth-request";
import { Assignment } from "../models/assignment.model";
import { Submission } from "../models/submission.model";
import { Course } from "../models/course.model";

export const createAssignment = async (req: AuthRequest, res: Response) => {
  try {
    const { moduleId, courseId, title, description } = req.body;
    const userId = req.user!._id;

    const course = await Course.findById(courseId);
    if (!course || course.instructor.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Only instructors can create assignments" });
    }

    const assignment = await Assignment.findOneAndUpdate(
      { module: moduleId },
      { course: courseId, title, description },
      { upsert: true, new: true }
    );

    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: "Failed to create assignment" });
  }
};

export const getAssignmentById = async (req: AuthRequest, res: Response) => {
  try {
    const { assignmentId } = req.params;
    const assignment = await Assignment.findById(assignmentId);
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch assignment" });
  }
};

export const getModuleAssignment = async (req: AuthRequest, res: Response) => {
  try {
    const { moduleId } = req.params;
    const assignment = await Assignment.findOne({ module: moduleId });
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch assignment" });
  }
};

export const submitAssignment = async (req: AuthRequest, res: Response) => {
  try {
    const { assignmentId } = req.params;
    const { link } = req.body;
    const userId = req.user!._id;

    if (!link) {
      return res.status(400).json({ message: "Submission link is required" });
    }

    const submission = await Submission.findOneAndUpdate(
      { assignment: assignmentId, student: userId },
      { link, submittedAt: new Date() },
      { upsert: true, new: true }
    );

    res.status(200).json(submission);
  } catch (error) {
    res.status(500).json({ message: "Failed to submit assignment" });
  }
};

export const getMySubmission = async (req: AuthRequest, res: Response) => {
  try {
    const { assignmentId } = req.params;
    const userId = req.user!._id;
    const submission = await Submission.findOne({ assignment: assignmentId, student: userId });
    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch submission" });
  }
};

export const gradeSubmission = async (req: AuthRequest, res: Response) => {
  try {
    const { submissionId } = req.params;
    const { grade, feedback } = req.body;
    const instructorId = req.user!._id;

    const submission = await Submission.findById(submissionId).populate({
      path: 'assignment',
      populate: { path: 'course' }
    });

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    const assignment = submission.assignment as any;
    if (assignment.course.instructor.toString() !== instructorId.toString()) {
      return res.status(403).json({ message: "Only the course instructor can grade submissions" });
    }

    submission.grade = grade;
    submission.feedback = feedback;
    await submission.save();

    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: "Failed to grade submission" });
  }
};

export const getAssignmentSubmissions = async (req: AuthRequest, res: Response) => {
  try {
    const { assignmentId } = req.params;
    const submissions = await Submission.find({ assignment: assignmentId }).populate("student", "name email");
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch submissions" });
  }
};
