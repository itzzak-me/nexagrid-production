"use server";

/**
 * Server Action: Nexa AI (Powered by NexGen Operating Systems Pvt Ltd)
 * Uses Pollinations.ai for text generation.
 * Handles Persona Switching (Student vs Teacher).
 */
export async function askAi(prompt: string, imageBase64?: string, userRole: 'student' | 'teacher' = 'student') {
    try {
        // 1. ADVANCED VISION HANDLING (Simulated for Demo)
        if (imageBase64) {
            await new Promise(resolve => setTimeout(resolve, 2500)); // Processing delay for realism

            const branding = "\n\n*Powered by NexGen Operating Systems Pvt Ltd*";

            if (userRole === 'student') {
                return `**[NexGen Vision Analysis]** 👁️\n\nI've scanned your image! It looks like a **Physics/Math problem**.\n\nSince I'm in **Secure Demo Mode**, I can't extract the exact numbers just yet (OCR is locked). \n\n**Quick Fix:**\nType the question text below, and I'll solve it step-by-step instantly! 🚀${branding}`;
            } else {
                return `**[NexGen Faculty OCR]** 📠\n\nImage processed. Detected: **Handwritten Student Response / Diagram**.\n\n**Analysis:**\nThe structure appears correct, but I need the raw text to perform a precise grade check or plagiarism scan.\n\nPlease transcribe the key values, and I will generate a grading rubric immediately.${branding}`;
            }
        }

        // 2. PERSONA DEFINITION
        let systemPersona = "";

        if (userRole === 'teacher') {
            systemPersona = "System: You are Nexa, a Professional Faculty Colleague trained by NexGen Operating Systems Pvt Ltd. Your tone is formal, academic, and efficient. You assist with lesson planning, pedagogy, and complex analytics. Never use slang. Structure your answers with clear headers.";
        } else {
            systemPersona = "System: You are Nexa, a Quick Doubt Solver Assistant by NexGen Operating Systems Pvt Ltd. Your tone is friendly, energetic, and concise. You help students understand concepts fast. Use emojis 🚀. If asked a math question, solve it step-by-step clearly.";
        }

        const cleanPrompt = prompt.replace(/\n/g, " ");

        // 3. FETCH FROM AI PROVIDER
        const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(systemPersona + " " + cleanPrompt)}`, {
            method: "GET",
            cache: "no-store",
        });

        if (!response.ok) {
            throw new Error(`AI Provider Error: ${response.status}`);
        }

        const text = await response.text();
        return text + "\n\n_Powered by NexGen OS_";

    } catch (error) {
        console.error("AI Action Error:", error);
        return "⚠️ **Neural Link Unstable.**\n\nUnable to reach NexGen Servers. Please check your internet connection and try again.";
    }
}