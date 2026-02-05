"use server";

import { currentUser } from "@clerk/nextjs/server";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { generateSummaryFromGemini } from "@/lib/gemini";
import { createSummary } from "@/lib/summaries";
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

        if (fullText.length < 100) {
            throw new Error("PDF contains insufficient text content");
        }

        // Step 4: Split text if it's too long (optional, for very large PDFs)
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 100000, // Process up to 100k characters
            chunkOverlap: 2000,
        });

        const chunks = await textSplitter.createDocuments([fullText]);
        const processedText = chunks[0].pageContent;

        console.log("✨ Generating AI summary...");

        // Step 5: Generate summary using Gemini
        const summary = await generateSummaryFromGemini(processedText);

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