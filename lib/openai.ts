import { SUMMARY_SYSTEM_PROMPT } from "@/utils/prompts";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function generateSummaryFromOpenAI(pdfText: string, targetWords?: number) {
    try {
        const wordLimitInstruction = targetWords
            ? `\nYour response MUST be between ${targetWords} and ${targetWords + 100} words total.`
            : '';

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `${SUMMARY_SYSTEM_PROMPT}${wordLimitInstruction}`,
                },
                {
                    role: "user",
                    content: `Please create a comprehensive summary of the following document:\n\n${pdfText.slice(0, 50000)}`,
                },
            ],
            temperature: 0.3,
            max_tokens: 1500,
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