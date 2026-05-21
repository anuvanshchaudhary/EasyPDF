"use server";

import { getDbConnection } from "@/lib/neondb";
import { createSummary, deleteSummary, deleteAllSummaries } from "@/lib/summaries";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { generateSummaryFromGemini } from "@/lib/gemini";

export async function deleteSummaryAction({
    summaryId,
}: {
    summaryId: string;
}) {
    try {
        const user = await currentUser();
        const userId = user?.id;

        if (!userId) {
            throw new Error("User not found");
        }

        const success = await deleteSummary(summaryId, userId);

        if (success) {
            revalidatePath("/dashboard");
            return { success: true };
        }

        return { success: false };
    } catch (error) {
        console.error("Error Deleting Summary", error);
        return { success: false };
    }
}

export async function deleteAllSummariesAction() {
    try {
        const user = await currentUser();
        const userId = user?.id;

        if (!userId) {
            throw new Error("User not found");
        }

        const success = await deleteAllSummaries(userId);

        if (success) {
            revalidatePath("/dashboard");
            return { success: true };
        }

        return { success: false };
    } catch (error) {
        console.error("Error Deleting All Summaries", error);
        return { success: false };
    }
}

export async function generateSummaryAction({
    pdfText,
    fileName,
    originalFileUrl,
}: {
    pdfText: string;
    fileName: string;
    originalFileUrl?: string;
}) {
    try {
        const user = await currentUser();
        const userId = user?.id;

        if (!userId) {
            throw new Error("User not found");
        }

        console.log('Starting summary generation for:', fileName);
        console.log('PDF text length:', pdfText.length);

        // Validate input
        if (!pdfText || pdfText.length < 100) {
            throw new Error("Insufficient text extracted from PDF. Please ensure the PDF contains readable text.");
        }

        // Generate summary
        const summaryText = await generateSummaryFromGemini(pdfText);

        // Validate output
        if (!summaryText || summaryText.length < 200) {
            throw new Error("Generated summary is too short. Please try again.");
        }

        console.log('Summary generated successfully');
        console.log('Summary length:', summaryText.length);

        // Save to database using the helper function
        const result = await createSummary({
            userId,
            fileName,
            summaryText,
            originalFileUrl,
        });

        revalidatePath("/dashboard");

        return {
            success: true,
            summaryId: result.id,
            summary: summaryText,
        };

    } catch (error: any) {
        console.error("Error generating summary:", error);
        return {
            success: false,
            error: error.message || "Failed to generate summary",
        };
    }
}

// Optional: Add action to regenerate summary
export async function regenerateSummaryAction({
    summaryId,
    pdfText,
}: {
    summaryId: string;
    pdfText: string;
}) {
    try {
        const user = await currentUser();
        const userId = user?.id;

        if (!userId) {
            throw new Error("User not found");
        }

        // Generate new summary
        const newSummaryText = await generateSummaryFromGemini(pdfText);

        // Update in database
        const sql = await getDbConnection();
        const [result] = await sql`
            UPDATE pdf_summaries
            SET 
                summary_text = ${newSummaryText},
                updated_at = NOW()
            WHERE id=${summaryId} AND user_id=${userId}
            RETURNING *
        `;

        if (!result) {
            throw new Error("Summary not found or unauthorized");
        }

        revalidatePath("/dashboard");
        revalidatePath(`/summary/${summaryId}`);

        return {
            success: true,
            summary: newSummaryText,
        };

    } catch (error: any) {
        console.error("Error regenerating summary:", error);
        return {
            success: false,
            error: error.message || "Failed to regenerate summary",
        };
    }
}