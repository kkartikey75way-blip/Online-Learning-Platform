import { Request, Response } from "express";
import { User } from "../models/user.model";

export const verifyEmail = async (
  req: Request,
  res: Response
) => {
  try {
    const { token } = req.params;

    // 🔹 Try to find valid token first
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

    // 🔹 If token invalid, check if user already verified
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
    res.status(500).json({ message: "Verification failed" });
  }
};

