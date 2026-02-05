import { SUMMARY_SYSTEM_PROMPT } from "@/utils/prompts";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function generateSummaryFromOpenAI(pdfText: string) {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    // We append strict formatting rules to whatever system prompt you already have
                    content: `${SUMMARY_SYSTEM_PROMPT} 
                    
                    CRITICAL OUTPUT RULES:
                    1. You are generating content for a Flashcard/Slide App.
                    2. You MUST separate every single slide with exactly this separator: "---"
                    3. Do not number the slides.
                    4. Start every slide with a "## Title".
                    5. Produce at least 5-7 distinct slides.
                    `
                },
                {
                    role: "user",
                    content: `Here is the document text. Please summarize it into 5-7 distinct slides/flashcards using the "---" separator strictly.
                    
                    Text to summarize:
                    ${pdfText.slice(0, 50000)}`
                },
            ],
            temperature: 0.7,
            max_tokens: 2000, // Increased to allow for multiple slides
        });

        const summary = completion.choices[0].message.content;

        if (!summary) throw new Error("No content generated");

        return summary;

    } catch (error: any) {
        console.error("OpenAI API Error:", error);
        if (error?.status === 429) {
            throw new Error("RATE_LIMIT_EXCEEDED");
        }
        throw error;
    }
}