import { SUMMARY_SYSTEM_PROMPT } from "@/utils/prompts";

export const generateSummaryFromGemini = async (pdfText: string) => {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not defined in environment variables.");
    }

    try {
        const fullPrompt = `${SUMMARY_SYSTEM_PROMPT}

---

Please create a comprehensive summary of the following document:

${pdfText.slice(0, 100000)}`;

        console.log('🚀 Generating summary with Gemini 2.5 Flash...');
        console.log('📝 Input text length:', pdfText.length);

        // Use gemini-2.5-flash - your best available model
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: fullPrompt }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 8192,
                        topP: 0.8,
                        topK: 40,
                    }
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error('❌ API Error:', data);
            throw new Error(`Gemini API Error: ${data.error?.message || 'Unknown error'}`);
        }

        const summary = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!summary || summary.length < 100) {
            console.error('❌ Invalid response:', data);
            throw new Error("Empty or too short response from Gemini API");
        }

        console.log('✅ Summary generated successfully');
        console.log('📊 Summary length:', summary.length);

        return summary;

    } catch (error: any) {
        console.error("❌ Gemini API Error:", error);
        throw new Error(`Failed to generate summary: ${error.message}`);
    }
};