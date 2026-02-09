import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.routes";
import courseRoutes from "./routes/course.routes";
import moduleRoutes from "./routes/module.routes";
import lessonRoutes from "./routes/lesson.routes";
import progressRoutes from "./routes/progress.routes";
import instructorRoutes from "./routes/instructor.routes";
import assignmentRoutes from "./routes/assignment.routes";
import quizRoutes from "./routes/quiz.routes";
import certificateRoutes from "./routes/certificate.routes";
import geminiVideoRoutes from "./routes/geminiVideo.routes";
import discussionRoutes from "./routes/discussion.routes";
import noteRoutes from "./routes/note.routes";
import messageRoutes from "./routes/message.routes";

import { errorHandler } from "./middleware/error.middleware";

const app = express();

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes"
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // stricter limit for auth routes
  message: "Too many login attempts, please try again after 15 minutes"
});

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.use(express.json());
app.use(generalLimiter);

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/instructor", instructorRoutes);

app.use("/api/assignments", assignmentRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/discussions", discussionRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/messages", messageRoutes);

app.use("/api/ai/videos", geminiVideoRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "OK" });
});

app.use(errorHandler);

export default app;
