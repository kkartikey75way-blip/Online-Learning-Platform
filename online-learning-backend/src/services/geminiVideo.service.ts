import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function getVideoRecommendations(lessonTitle: string) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are an online learning assistant.

Lesson title: "${lessonTitle}"

Generate 3 high-quality YouTube search queries for tutorial or explanation videos.
Return the result as a JSON array of strings only.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const queries: string[] = JSON.parse(text);

    const videoUrls = queries.map(q => ({
        title: q,
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`
    }));

    return videoUrls;
}
