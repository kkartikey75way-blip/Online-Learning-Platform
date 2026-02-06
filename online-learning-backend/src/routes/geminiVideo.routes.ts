import { Router } from "express";
import { getVideoRecommendations } from "../services/geminiVideo.service";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const { heading } = req.query;

        if (!heading) {
            return res.status(400).json({ message: "Lesson heading is required" });
        }

        const videos = await getVideoRecommendations(heading as string);
        res.json({ lesson: heading, videos });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch video recommendations" });
    }
});

export default router;
