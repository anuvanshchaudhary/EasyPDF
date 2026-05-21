"use server";

import { currentUser } from "@clerk/nextjs/server";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { generateSummaryFromGemini } from "@/lib/gemini";
import { generateSummaryFromOpenAI } from "@/lib/openai";
import { createSummary, getUserSummaryCountLast24h } from "@/lib/summaries";
import { revalidatePath } from "next/cache";

export async function generatePdfSummary({
    fileUrl,
    fileName,
}: {
    fileUrl: string;
    fileName: string;
}) {
    try {
        console.log("🚀 Starting PDF processing:", fileName);

        const user = await currentUser();
        if (!user) {
            throw new Error("User not authenticated");
        }

        // Rate limit: max 10 summaries per 24 hours
        const recentCount = await getUserSummaryCountLast24h(user.id);
        if (recentCount >= 10) {
            throw new Error("Daily limit reached. You can generate up to 10 summaries per 24 hours.");
        }

        // Step 1: Load PDF from URL
        console.log("📥 Fetching PDF from:", fileUrl);
        const response = await fetch(fileUrl);

        if (!response.ok) {
            throw new Error(`Failed to fetch PDF: ${response.statusText}`);
        }

        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Step 2: Parse PDF with LangChain
        console.log("📖 Parsing PDF content...");
        const loader = new PDFLoader(new Blob([buffer]));
        const docs = await loader.load();

        if (!docs || docs.length === 0) {
            throw new Error("No content found in PDF");
        }

        // Step 3: Extract and combine text from all pages
        const fullText = docs.map((doc) => doc.pageContent).join("\n\n");
        console.log("📝 Extracted text length:", fullText.length, "characters");

        if (fullText.trim().length < 200) {
            throw new Error(
                "Could not extract text — this may be a scanned or image-based PDF. Please use a text-based PDF."
            );
        }

        // Step 4: Real chunking — 8000 chars with 500 overlap
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 8000,
            chunkOverlap: 500,
        });

        const chunks = await textSplitter.createDocuments([fullText]);
        console.log(`📦 Split into ${chunks.length} chunk(s)`);

        // Dynamic word limit: scale with input size (min 200, max 2000)
        const inputWords = fullText.split(/\s+/).length;
        const targetWords = Math.min(2000, Math.max(500, Math.floor(inputWords / 3)));
        console.log(`🎯 Target words: ${targetWords} (from ${inputWords} input words)`);

        console.log("✨ Generating AI summary...");

        let processedText: string;

        if (chunks.length === 1) {
            // Single chunk — process directly
            processedText = chunks[0].pageContent;
        } else {
            // Multiple chunks — hierarchical summarization
            console.log(`📚 Hierarchical mode: summarizing ${chunks.length} chunks individually...`);

            const MINI_SUMMARY_PROMPT = `Summarize the following section of a document in 2-3 concise bullet points (•). Be factual and specific.`;

            const miniSummaries: string[] = [];

            for (let i = 0; i < chunks.length; i++) {
                console.log(`  ↳ Processing chunk ${i + 1}/${chunks.length}...`);
                const miniPrompt = `${MINI_SUMMARY_PROMPT}\n\n${chunks[i].pageContent}`;
                try {
                    const mini = await generateSummaryFromGemini(miniPrompt);
                    miniSummaries.push(`### Section ${i + 1}\n${mini}`);
                } catch {
                    // If a mini-chunk fails, skip it rather than aborting the whole job
                    console.warn(`  ⚠️ Chunk ${i + 1} failed, skipping.`);
                }
            }

            // The combined mini-summaries become the "document" for the final pass
            processedText = miniSummaries.join("\n\n");
            console.log(`✅ Chunk summaries combined (${processedText.length} chars) — running final pass...`);
        }

        // Step 5: Generate final summary — Gemini primary, OpenAI fallback
        let summary: string;
        try {
            summary = await generateSummaryFromGemini(processedText, targetWords);
        } catch (geminiError: any) {
            if (geminiError.message === 'GEMINI_FAILED') {
                console.warn('⚠️ Gemini failed after retries. Falling back to OpenAI...');
                summary = await generateSummaryFromOpenAI(processedText, targetWords);
            } else {
                throw geminiError;
            }
        }

        if (!summary || summary.length < 200) {
            throw new Error("Generated summary is too short");
        }

        console.log("✅ Summary generated successfully!");
        console.log("📊 Summary length:", summary.length, "characters");

        // Extract title from summary or use filename
        const title = extractTitleFromSummary(summary) || fileName.replace('.pdf', '');

        return {
            data: {
                summary,
                title,
                fullText: processedText.substring(0, 5000), // Store first 5k chars for reference
            },
            message: "Summary generated successfully",
        };
    } catch (error: any) {
        console.error("❌ Error in generatePdfSummary:", error);
        return {
            data: null,
            message: error.message || "Failed to generate summary",
        };
    }
}

export async function storePdfSummaryAction({
    summary,
    fileUrl,
    title,
    fileName,
}: {
    summary: string;
    fileUrl: string;
    title: string;
    fileName: string;
}) {
    try {
        const user = await currentUser();
        if (!user) {
            throw new Error("User not authenticated");
        }

        console.log("💾 Saving summary to database...");

        // Save to database using the helper function
        const result = await createSummary({
            userId: user.id,
            fileName,
            title,
            summaryText: summary,
            originalFileUrl: fileUrl,
        });

        console.log("✅ Summary saved successfully with ID:", result.id);

        // Revalidate the dashboard to show the new summary
        revalidatePath("/dashboard");
        revalidatePath("/summaries");

        return {
            success: true,
            data: {
                id: result.id,
                title: result.title,
            },
            message: "Summary saved successfully",
        };
    } catch (error: any) {
        console.error("❌ Error storing summary:", error);
        return {
            success: false,
            data: null,
            message: error.message || "Failed to store summary",
        };
    }
}

// Helper function to extract title from markdown summary
function extractTitleFromSummary(summary: string): string | null {
    const lines = summary.split('\n');
    const titleLine = lines.find(line => line.trim().startsWith('#'));

    if (titleLine) {
        // Remove markdown heading symbols and brackets
        return titleLine
            .replace(/^#+\s*/, '')
            .replace(/\[|\]/g, '')
            .trim();
    }

    return null;
}