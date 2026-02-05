import { Response } from "express";
import { Module } from "../models/module.model";
import type { AuthRequest } from "../types/auth-request";

export const createModule = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { title, courseId, order } = req.body;

    if (!req.user || req.user.role !== "INSTRUCTOR") {
      return res.status(403).json({ message: "Instructor only" });
    }

    const module = await Module.create({
      title,
      course: courseId,
      order,
    });

    res.status(201).json(module);
  } catch (err) {
    res.status(500).json({ message: "Module creation failed" });
  }
};

export const getModulesByCourse = async (
  req: AuthRequest,
  res: Response
) => {
  const modules = await Module.find({
    course: req.params.courseId,
  }).sort({ order: 1 });

  res.json(modules);
};
