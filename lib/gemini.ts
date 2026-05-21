import { SUMMARY_SYSTEM_PROMPT } from "@/utils/prompts";

export const generateSummaryFromGemini = async (pdfText: string, targetWords?: number) => {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not defined in environment variables.");
    }

    const wordLimitInstruction = targetWords
        ? `\nYour response MUST be between ${targetWords} and ${targetWords + 100} words total.`
        : '';

    const fullPrompt = `${SUMMARY_SYSTEM_PROMPT}${wordLimitInstruction}

---

Please create a comprehensive summary of the following document:

${pdfText.slice(0, 100000)}`;

    const delays = [0, 1000, 2000];

    for (let attempt = 0; attempt < delays.length; attempt++) {
        if (delays[attempt] > 0) {
            console.log(`⏳ Gemini retry attempt ${attempt + 1}, waiting ${delays[attempt]}ms...`);
            await new Promise((res) => setTimeout(res, delays[attempt]));
        }

        try {
            console.log(`🚀 Gemini attempt ${attempt + 1}/3...`);
            console.log('📝 Input text length:', pdfText.length);

            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: fullPrompt }] }],
                        generationConfig: {
                            temperature: 0.3,
                            maxOutputTokens: 1500,
                            topP: 0.8,
                            topK: 40,
                        },
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                console.error(`❌ Gemini API Error (attempt ${attempt + 1}):`, data);
                // Don't retry on auth/quota errors — fail fast
                if (data.error?.code === 401 || data.error?.code === 403) {
                    throw new Error(`Gemini auth error: ${data.error?.message}`);
                }
                throw new Error(`Gemini API Error: ${data.error?.message || 'Unknown error'}`);
            }

            const summary = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!summary || summary.length < 100) {
                throw new Error("Empty or too short response from Gemini API");
            }

            console.log('✅ Summary generated successfully');
            console.log('📊 Summary length:', summary.length);
            return summary;

        } catch (error: any) {
            console.error(`❌ Gemini attempt ${attempt + 1} failed:`, error.message);
            if (attempt === delays.length - 1) {
                // All retries exhausted
                throw new Error('GEMINI_FAILED');
            }
        }
    }

    // Should never reach here but TypeScript needs a return path
    throw new Error('GEMINI_FAILED');
};