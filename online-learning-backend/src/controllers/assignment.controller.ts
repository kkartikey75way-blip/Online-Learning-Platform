import { Response } from "express";
import type { AuthRequest } from "../types/auth-request";
import { Submission } from "../models/submission.model";

export const submitAssignment = async (
  req: AuthRequest,
  res: Response
) => {
  if (!req.user) return res.sendStatus(401);

  const submission = await Submission.create({
    assignment: req.body.assignmentId,
    student: req.user._id,
    fileUrl: req.file?.path,
  });

  res.status(201).json(submission);
};
