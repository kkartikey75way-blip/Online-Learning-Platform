import { Request, Response } from "express";
import type { AuthRequest } from "../types/auth-request";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User } from "../models/user.model";
import { sendEmail } from "../utils/sendEmail";

import { AuthService } from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    const verificationToken = crypto.randomBytes(32).toString("hex");

    await User.create({
      name,
      email,
      password,
      role,
      provider: "LOCAL",
      isVerified: false,
      verificationToken,
      verificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

    await sendEmail(
      email,
      "Verify your email",
      `<p>Click below:</p><a href="${verifyUrl}">${verifyUrl}</a>`
    );

    return res.status(201).json({
      message: "Verification email sent",
    });
  } catch (err: unknown) {
    console.error(err);
    res.status(500).json({ message: "Signup failed" });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.json({
        message: "Email already verified",
        alreadyVerified: true,
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.json({ message: "Email verified", alreadyVerified: false });
  } catch (err: unknown) {
    res.status(500).json({ message: "Verification failed" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "Verify email first" });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = AuthService.generateAccessToken(user._id.toString());
    const refreshToken = AuthService.generateRefreshToken(user._id.toString());

    // Use findByIdAndUpdate to avoid triggering pre("save") hooks
    await User.findByIdAndUpdate(user._id, { refreshToken });

    // Remove password from user object before sending
    const userObj = user.toObject();
    delete userObj.password;

    res.json({ token: accessToken, refreshToken, user: userObj });
  } catch (err: unknown) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ message: "Token required" });

  try {
    const user = await User.findOne({ refreshToken: token });
    if (!user) return res.status(403).json({ message: "Invalid refresh token" });

    AuthService.verifyToken(token);

    const newAccessToken = AuthService.generateAccessToken(user._id.toString());
    const newRefreshToken = AuthService.generateRefreshToken(user._id.toString());

    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({ token: newAccessToken, refreshToken: newRefreshToken });
  } catch (err: unknown) {
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user!._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user context" });
  }
};

export const updateInterests = async (req: AuthRequest, res: Response) => {
  try {
    const { interests } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user!._id,
      { interests },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to update interests" });
  }
};
