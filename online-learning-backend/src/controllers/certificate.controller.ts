import { Response } from "express";
import type { AuthRequest } from "../types/auth-request";
import { Certificate } from "../models/certificate.model";

export const getMyCertificates = async (
  req: AuthRequest,
  res: Response
) => {
  const certs = await Certificate.find({
    user: req.user!._id,
  }).populate("course", "title");

  res.json(certs);
};
