import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import courseRoutes from "./routes/course.routes";
import moduleRoutes from "./routes/module.routes";
import lessonRoutes from "./routes/lesson.routes";
import progressRoutes from "./routes/progress.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);

app.use("/api/modules", moduleRoutes);
app.use("/api/lessons", lessonRoutes);

app.use("/api/progress", progressRoutes);

export default app;
