import { Request, Response, NextFunction } from "express";
import { User, IUser } from "../models/user.model";
import { AuthService } from "../services/auth.service";

export interface AuthRequest extends Request {
  user?: IUser;
}

interface JwtPayload {
  userId: string;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = AuthService.verifyToken(token) as JwtPayload;
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const authenticateOptional = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return next();
  }

  try {
    const decoded = AuthService.verifyToken(token) as JwtPayload;
    req.user = await User.findById(decoded.userId) || undefined;
    next();
  } catch {
    // If invalid token, just treat as guest
    next();
  }
};
