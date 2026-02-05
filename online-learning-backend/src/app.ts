import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import courseRoutes from "./routes/course.routes";
import moduleRoutes from "./routes/module.routes";
import lessonRoutes from "./routes/lesson.routes";
import progressRoutes from "./routes/progress.routes";
import quizRoutes from "./routes/quiz.routes";
import assignmentRoutes from "./routes/assignment.routes";

const app = express();

/* ================== MIDDLEWARE ================== */
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

/* ================== ROUTES ================== */
app.use("/auth", authRoutes);
app.use("/courses", courseRoutes);
app.use("/modules", moduleRoutes);
app.use("/lessons", lessonRoutes);
app.use("/progress", progressRoutes);
app.use("/quizzes", quizRoutes);
app.use("/assignments", assignmentRoutes);

/* ================== HEALTH CHECK ================== */
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "OK" });
});

export default app;
