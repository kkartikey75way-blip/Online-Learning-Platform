import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

const generateToken = (userId: string) =>
  jwt.sign(
    { userId },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

export const googleAuthService = async (
  idToken: string,
  role?: "STUDENT" | "INSTRUCTOR"
) => {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload?.email) {
    throw new Error("Invalid Google token");
  }

  let user = await User.findOne({
    email: payload.email,
  });

  let isNewUser = false;
  if (!user) {
    user = await User.create({
      name: payload.name || "Google User",
      email: payload.email,
      avatar: payload.picture,
      role: role ?? "STUDENT",
      provider: "GOOGLE",
      isVerified: true, 
    });

    isNewUser = true;
  }

  const token = generateToken(user._id.toString());

  return {
    user,
    token,
    isNewUser,
  };
};
