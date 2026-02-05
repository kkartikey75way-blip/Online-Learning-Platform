import { Response } from "express";
import type { AuthRequest } from "../types/auth-request";
import { Assignment } from "../models/assignment.model";

export const submitAssignment = async (
  req: AuthRequest,
  res: Response
) => {
  const { assignmentId } = req.params;

  if (!req.user || !req.file) {
    return res.status(400).json({ message: "Invalid submission" });
  }

  const assignment = await Assignment.findByIdAndUpdate(
    assignmentId,
    {
      $push: {
        submissions: {
          student: req.user._id,
          fileUrl: (req.file as any).path,
        },
      },
    },
    { new: true }
  );

  res.json(assignment);
};
