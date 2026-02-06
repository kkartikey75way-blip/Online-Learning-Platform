import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || ""); // Ensure key is picked up

async function listModels() {
    try {
        // Access the model manager to list models is not directly exposed easily in simple usage, 
        // typically we just try to generate content.
        // But let's try a known standard model: gemini-pro
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        console.log("Testing gemini-pro...");
        await model.generateContent("Hello");
        console.log("gemini-pro works!");
    } catch (e: any) {
        console.log("gemini-pro failed:", e.message);
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        console.log("Testing gemini-1.5-flash...");
        await model.generateContent("Hello");
        console.log("gemini-1.5-flash works!");
    } catch (e: any) {
        console.log("gemini-1.5-flash failed:", e.message);
    }
}

listModels();
