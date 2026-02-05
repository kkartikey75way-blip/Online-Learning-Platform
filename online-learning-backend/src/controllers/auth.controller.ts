import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User } from "../models/user.model";
import { sendEmail } from "../utils/sendEmail";

const generateToken = (userId: string) =>
  jwt.sign(
    { userId },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

   
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const verificationToken = crypto
      .randomBytes(32)
      .toString("hex");

    await User.create({
      name,
      email,
      password,
      role: role === "INSTRUCTOR" ? "INSTRUCTOR" : "STUDENT",
      provider: "LOCAL",
      isVerified: false,
      verificationToken,
      verificationTokenExpires: new Date(
        Date.now() + 24 * 60 * 60 * 1000
      ),
    });

    try {
      const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

      await sendEmail(
        email,
        "Verify your email",
        `<p>Click to verify:</p><a href="${verifyUrl}">${verifyUrl}</a>`
      );
    } catch (emailErr) {
      console.error("Email error (ignored):", emailErr);
    }

    return res.status(201).json({
      message:
        "Registration successful. Please verify your email.",
    });
  } catch (err) {
    console.error("REGISTER FAILED:", err);
    return res.status(500).json({
      message: "Registration failed",
    });
  }
};

export const login = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email }).select(
      "+password"
    );

    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid credentials" });
    }

    if (user.provider === "GOOGLE") {
      return res.status(400).json({
        message: "Please login using Google",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email first",
      });
    }

    const isMatch = await user.comparePassword(
      password
    );

    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id.toString());

    return res.status(200).json({
      token,
      user,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ message: "Login failed" });
  }
};
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: new Date() },
    });

    if (user) {
      user.isVerified = true;
      user.verificationToken = undefined;
      user.verificationTokenExpires = undefined;

      await user.save();

      return res.json({
        message: "Email verified successfully",
        alreadyVerified: false,
      });
    }

    const alreadyVerifiedUser = await User.findOne({
      isVerified: true,
    });

    if (alreadyVerifiedUser) {
      return res.json({
        message: "Email already verified",
        alreadyVerified: true,
      });
    }

    return res.status(400).json({
      message: "Invalid or expired verification link",
    });
  } catch (error) {
    console.error("Verify email error:", error);
    return res.status(500).json({
      message: "Verification failed",
    });
  }
};




