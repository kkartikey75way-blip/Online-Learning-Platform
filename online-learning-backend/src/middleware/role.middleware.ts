import { Response, NextFunction } from "express";
import type { AuthRequest } from "../types/auth-request";

export const instructorOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  if (req.user.role !== "INSTRUCTOR") {
    return res.status(403).json({
      message: "Instructor access only",
    });
  }

  next();
};
