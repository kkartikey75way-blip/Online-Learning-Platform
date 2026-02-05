import type { Request } from "express";
import type { IUser } from "../models/user.model";

export interface AuthRequest extends Request {
  user?: IUser;
}
