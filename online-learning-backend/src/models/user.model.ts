import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  role: "STUDENT" | "INSTRUCTOR";
  provider: "GOOGLE" | "LOCAL";
  isVerified: boolean;

  verificationToken?: string;
  verificationTokenExpires?: Date;

  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      select: false,
    },

    avatar: String,

    role: {
      type: String,
      enum: ["STUDENT", "INSTRUCTOR"],
      default: "STUDENT",
    },

    provider: {
      type: String,
      enum: ["GOOGLE", "LOCAL"],
      default: "LOCAL",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationToken: String,
    verificationTokenExpires: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function (
  enteredPassword: string
) {
  if (!this.password) return false;
  return bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model<IUser>(
  "User",
  userSchema
);
