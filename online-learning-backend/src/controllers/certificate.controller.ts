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

import { Progress } from "../models/progress.model";
import { v4 as uuidv4 } from "uuid";

export const issueCertificate = async (req: AuthRequest, res: Response) => {
  try {
    const { courseId } = req.body;
    const userId = req.user!._id;


    const progress = await Progress.findOne({ user: userId, course: courseId });
    if (!progress || progress.progressPercent < 100) {
      return res.status(400).json({ message: "Course not 100% complete" });
    }


    const existing = await Certificate.findOne({ user: userId, course: courseId });
    if (existing) {
      return res.json(existing);
    }


    const cert = await Certificate.create({
      user: userId,
      course: courseId,
      credentialId: uuidv4(),
      issueDate: new Date()
    });

    res.status(201).json(cert);
  } catch (error) {
    console.error("Certificate Issue Error:", error);
    res.status(500).json({ message: "Failed to issue certificate" });
  }
};
