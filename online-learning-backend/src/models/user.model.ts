import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: "STUDENT" | "INSTRUCTOR";
  provider: "LOCAL" | "GOOGLE";
  isVerified: boolean;
  interests?: string[];
  verificationToken?: string;
  verificationTokenExpires?: Date;
  refreshToken?: string;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true, index: true },
    password: { type: String, select: false },
    role: { type: String, enum: ["STUDENT", "INSTRUCTOR"], default: "STUDENT" },
    provider: { type: String, enum: ["LOCAL", "GOOGLE"], default: "LOCAL" },
    isVerified: { type: Boolean, default: false },
    interests: { type: [String], default: [] },
    verificationToken: String,
    verificationTokenExpires: Date,
    refreshToken: String,
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compare(password, this.password!);
};

export const User = mongoose.model<IUser>("User", userSchema);
