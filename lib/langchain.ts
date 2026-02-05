import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

export async function extractTextFromPdf(fileUrl: string): Promise<string> {
    try {
        const response = await fetch(fileUrl);

        if (!response.ok) {
            throw new Error(`Failed to fetch PDF: ${response.statusText}`);
        }

        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const loader = new PDFLoader(new Blob([buffer]));
        const docs = await loader.load();

        if (!docs || docs.length === 0) {
            throw new Error("No content found in PDF");
        }

        const fullText = docs.map((doc) => doc.pageContent).join("\n\n");
        return fullText;
    } catch (error) {
        console.error("Error extracting PDF text:", error);
        throw error;
    }
}

export async function splitTextIntoChunks(
    text: string,
    chunkSize: number = 10000,
    chunkOverlap: number = 1000
) {
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize,
        chunkOverlap,
    });

    const chunks = await textSplitter.createDocuments([text]);
    return chunks;
}