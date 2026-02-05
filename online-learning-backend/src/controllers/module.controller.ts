import { Request, Response } from "express";
import { Module } from "../models/module.model";

export const createModule = async (req: Request, res: Response) => {
  try {
    const { title, courseId, order } = req.body;

    const module = await Module.create({
      title,
      course: courseId,
      order,
    });

    res.status(201).json(module);
  } catch {
    res.status(500).json({ message: "Failed to create module" });
  }
};

export const getModulesByCourse = async (
  req: Request,
  res: Response
) => {
  try {
    const modules = await Module.find({
      course: req.params.courseId,
    }).sort({ order: 1 });

    res.json(modules);
  } catch {
    res.status(500).json({ message: "Failed to fetch modules" });
  }
};
