import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";
import type { UploadApiOptions } from "cloudinary";
import type { Request } from "express";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (
    _req: Request,
    file: Express.Multer.File
  ): Promise<UploadApiOptions> => {
    return {
      folder: "online-learning",
      resource_type: "auto", // image | video | pdf
      public_id: `${Date.now()}-${file.originalname}`,
    };
  },
});

export const upload = multer({ storage });
