import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";

import authRoutes from "./routes/auth.routes";
import courseRoutes from "./routes/course.routes";
import moduleRoutes from "./routes/module.routes";
import lessonRoutes from "./routes/lesson.routes";
import progressRoutes from "./routes/progress.routes";

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/courses", courseRoutes);
app.use("/modules", moduleRoutes);
app.use("/lessons", lessonRoutes);
app.use("/progress", progressRoutes);

app.listen(process.env.PORT, () =>
  console.log(`Server running on ${process.env.PORT}`)
);
