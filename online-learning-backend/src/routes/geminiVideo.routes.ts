import { Router } from "express";
import { getVideoRecommendations } from "../services/geminiVideo.service";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const { heading } = req.query;

        if (!heading) {
            return res.status(400).json({ message: "Lesson heading required" });
        }

        const videos = await getVideoRecommendations(heading as string);
        return res.json({ videos });
    } catch (error) {
        console.error("Gemini error:", error);

        return res.status(200).json({
            videos: [],
            message: "AI recommendations temporarily unavailable",
        });
    }
});

export default router;
