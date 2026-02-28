"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI with your secret key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

/**
 * Server Action: Nexa AI (Engineered via Google Vertex)
 * Powered by NexGen Operating Systems Pvt Ltd.
 * Handles Persona Switching & Multi-modal Vision.
 */
export async function askAi(prompt: string, imageBase64?: string, userRole: 'student' | 'teacher' = 'student') {
    try {
        // 1. CHOOSE THE MODEL (Flash is best for speed and cost-efficiency)
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // 2. DEFINE SYSTEM PERSONAS
        const teacherPersona = "You are Nexa, a Professional Faculty Colleague by NexGen OS. Tone: Formal, academic, efficient. Help with lesson plans, grading rubrics, and pedagogy. Use clear headers and Markdown.";
        const studentPersona = "You are Nexa, a friendly Student Tutor by NexGen OS. Tone: Energetic, concise, helpful. Use emojis 🚀. Explain concepts step-by-step. Encourage peer learning.";

        const systemInstruction = userRole === 'teacher' ? teacherPersona : studentPersona;

        // 3. HANDLE MULTI-MODAL (VISION) VS TEXT-ONLY
        let result;

        if (imageBase64) {
            // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
            const base64Data = imageBase64.split(",")[1];

            result = await model.generateContent([
                { text: `${systemInstruction}\n\nUser Question: ${prompt}` },
                {
                    inlineData: {
                        data: base64Data,
                        mimeType: "image/jpeg" // You can adjust this based on the actual image type
                    }
                }
            ]);
        } else {
            // Text-only generation
            result = await model.generateContent(`${systemInstruction}\n\nUser Question: ${prompt}`);
        }

        const response = await result.response;
        const text = response.text();

        // 4. BRANDED FOOTER
        return text + "\n\n_Nexa AI Core • Engineered via Google Vertex_";

    } catch (error) {
        console.error("Nexa AI Core Error:", error);
        return "⚠️ **Neural Link Unstable.**\n\nNexa AI is currently undergoing maintenance. Please verify your connection to NexGen Servers.";
    }
}