import { OAuth2Client } from "google-auth-library";
import { User } from "../models/user.model";
import { AuthService } from "./auth.service";

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
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

  const accessToken = AuthService.generateAccessToken(user._id.toString());
  const refreshToken = AuthService.generateRefreshToken(user._id.toString());

  await User.findByIdAndUpdate(user._id, { refreshToken });

  return {
    user,
    token: accessToken,
    refreshToken,
    isNewUser,
  };
};
