import { Response } from "express";
import type { AuthRequest } from "../types/auth-request";
import { Assignment } from "../models/assignment.model";

export const submitAssignment = async (
  req: AuthRequest,
  res: Response
) => {
  const { assignmentId } = req.params;
  const { fileUrl } = req.body;

  if (!req.user || !fileUrl) {
    return res.status(400).json({ message: "Invalid submission. fileUrl is required." });
  }

  const assignment = await Assignment.findByIdAndUpdate(
    assignmentId,
    {
      $push: {
        submissions: {
          student: req.user._id,
          fileUrl: fileUrl,
        },
      },
    },
    { new: true }
  );

  return res.status(200).json(assignment);

};
