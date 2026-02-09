import { Request, Response } from "express";
import { googleAuthService } from "../services/googleAuth.service";

export const googleAuth = async (
  req: Request,
  res: Response
) => {
  try {
    const { idToken, role } = req.body;

    if (!idToken) {
      return res
        .status(400)
        .json({ message: "ID token is required" });
    }
    const { user, token, refreshToken, isNewUser } =
      await googleAuthService(idToken, role);

    return res.status(200).json({
      message: isNewUser
        ? "Signup successful"
        : "Login successful",
      token,
      refreshToken,
      user,
    });
  } catch (error) {
    console.error("Google auth error:", error);

    return res.status(401).json({
      message: "Google authentication failed",
    });
  }
};
