import Groq from "groq-sdk";
import dotenv from "dotenv";
import ytSearch from "yt-search";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function getVideoRecommendations(lessonTitle: string) {
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are an educational assistant. Generate 3 specific YouTube search queries to find the best tutorial videos for the topic: "${lessonTitle}". Return ONLY a JSON array of strings.`
                },
                {
                    role: "user",
                    content: lessonTitle
                }
            ],
            model: "llama-3.1-8b-instant",
            temperature: 0.5,
        });

        const content = chatCompletion.choices[0]?.message?.content || "[]";

        let queries: string[] = [];
        try {
            const cleaned = content.replace(/```json/g, "").replace(/```/g, "").trim();
            queries = JSON.parse(cleaned);
        } catch (e) {
            console.warn("Failed to parse Groq response:", content);
            queries = [lessonTitle];
        }

        // Parallel search for videos
        const results = await Promise.all(queries.map(async (q) => {
            try {
                const searchResult = await ytSearch(q);
                const video = searchResult.videos[0]; // Get first video
                if (video) {
                    return {
                        title: video.title,
                        url: video.url, // Direct link
                        duration: video.timestamp
                    };
                }
                return null;
            } catch (err) {
                console.error(`Search failed for ${q}:`, err);
                return null;
            }
        }));

        // Filter nulls and fallback if empty
        const validResults = results.filter(r => r !== null);

        if (validResults.length === 0) {
            return [{
                title: `${lessonTitle} (Search)`,
                url: `https://www.youtube.com/results?search_query=${encodeURIComponent(lessonTitle)}`
            }];
        }

        return validResults;

    } catch (error) {
        console.error("Groq/Video API Error:", error);
        return [{
            title: lessonTitle,
            url: `https://www.youtube.com/results?search_query=${encodeURIComponent(lessonTitle)}`
        }];
    }
}
