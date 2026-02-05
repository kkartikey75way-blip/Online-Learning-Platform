import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";
import type { Request } from "express";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (
    _req: Request,
    file: Express.Multer.File
  ) => {
    return {
      folder: "online-learning/lessons",
      resource_type: "video",
      public_id: `${Date.now()}-${file.originalname}`,
    };
  },
});

export const upload = multer({ storage });
