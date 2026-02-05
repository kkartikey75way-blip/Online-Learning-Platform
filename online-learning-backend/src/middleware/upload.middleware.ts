import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: "lesson-videos",
    resource_type: "video",
  }),
});

export const uploadVideo = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max
  },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("video/")) {
      cb(new Error("Only video files allowed"));
    } else {
      cb(null, true);
    }
  },
});
