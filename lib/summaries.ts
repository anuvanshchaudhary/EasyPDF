import { getDbConnection } from "./neondb";

export async function getSummaries(userId: string) {
  try {
    const sql = await getDbConnection();
    const summaries = await sql`
      SELECT 
        id, 
        user_id, 
        title, 
        original_file_url,
        summary_text, 
        created_at, 
        updated_at, 
        status, 
        file_name,
        LENGTH(summary_text) - LENGTH(REPLACE(summary_text, ' ', '')) + 1 as word_count
      FROM pdf_summaries
      WHERE user_id=${userId}
      ORDER BY created_at DESC
    `;
    return summaries;
  } catch (err) {
    console.error("Error fetching summaries:", err);
    return [];
  }
}

export async function getSummaryById(id: string) {
  try {
    const sql = await getDbConnection();

    const [summary] = await sql`
      SELECT 
        id, 
        user_id, 
        title, 
        original_file_url,
        summary_text, 
        created_at, 
        updated_at, 
        status, 
        file_name, 
        LENGTH(summary_text) - LENGTH(REPLACE(summary_text, ' ', '')) + 1 as word_count,
        ROUND(LENGTH(summary_text) / 5.0) as estimated_reading_time_seconds
      FROM pdf_summaries 
      WHERE id=${id}
    `;

    if (!summary) {
      console.warn(`Summary not found for id: ${id}`);
      return null;
    }

    return summary;
  } catch (err) {
    console.error("Error fetching Summary By id:", err);
    return null;
  }
}

export async function createSummary({
  userId,
  fileName,
  title,
  summaryText,
  originalFileUrl,
}: {
  userId: string;
  fileName: string;
  title?: string;
  summaryText: string;
  originalFileUrl?: string;
}) {
  try {
    const sql = await getDbConnection();

    // Extract title from summary if not provided
    const summaryTitle = title || extractTitleFromSummary(summaryText) || fileName;

    const [result] = await sql`
      INSERT INTO pdf_summaries (
        user_id, 
        file_name, 
        title,
        summary_text, 
        original_file_url,
        status,
        created_at,
        updated_at
      )
      VALUES (
        ${userId}, 
        ${fileName}, 
        ${summaryTitle},
        ${summaryText}, 
        ${originalFileUrl || null},
        'completed',
        NOW(),
        NOW()
      )
      RETURNING *
    `;

    return result;
  } catch (err) {
    console.error("Error creating summary:", err);
    throw new Error("Failed to create summary");
  }
}

export async function updateSummary({
  id,
  userId,
  summaryText,
  title,
}: {
  id: string;
  userId: string;
  summaryText?: string;
  title?: string;
}) {
  try {
    const sql = await getDbConnection();

    const [result] = await sql`
      UPDATE pdf_summaries
      SET 
        summary_text = COALESCE(${summaryText || null}, summary_text),
        title = COALESCE(${title || null}, title),
        updated_at = NOW()
      WHERE id=${id} AND user_id=${userId}
      RETURNING *
    `;

    if (!result) {
      throw new Error("Summary not found or unauthorized");
    }

    return result;
  } catch (err) {
    console.error("Error updating summary:", err);
    throw new Error("Failed to update summary");
  }
}

export async function deleteSummary(id: string, userId: string) {
  try {
    const sql = await getDbConnection();

    const result = await sql`
      DELETE FROM pdf_summaries
      WHERE id=${id} AND user_id=${userId}
      RETURNING id
    `;

    return result.length > 0;
  } catch (err) {
    console.error("Error deleting summary:", err);
    return false;
  }
}

export async function deleteAllSummaries(userId: string) {
  try {
    const sql = await getDbConnection();

    await sql`
      DELETE FROM pdf_summaries
      WHERE user_id=${userId}
    `;

    return true;
  } catch (err) {
    console.error("Error deleting all summaries:", err);
    return false;
  }
}

export async function markSummaryFailed(id: string, userId: string): Promise<void> {
  try {
    const sql = await getDbConnection();

    await sql`
      UPDATE pdf_summaries
      SET status = 'failed', updated_at = NOW()
      WHERE id=${id} AND user_id=${userId}
    `;
  } catch (err) {
    console.error("Error marking summary as failed:", err);
  }
}

export async function getUserSummaryCountLast24h(userId: string): Promise<number> {
  try {
    const sql = await getDbConnection();

    const [result] = await sql`
      SELECT COUNT(*) as count
      FROM pdf_summaries
      WHERE user_id=${userId}
        AND created_at > NOW() - INTERVAL '24 hours'
    `;

    return Number(result?.count ?? 0);
  } catch (err) {
    console.error("Error fetching 24h summary count:", err);
    return 0;
  }
}

// Helper function to extract title from summary markdown
function extractTitleFromSummary(summary: string): string | null {
  const lines = summary.split('\n');
  const titleLine = lines.find(line => line.trim().startsWith('#'));

  if (titleLine) {
    return titleLine.replace(/^#+\s*/, '').trim();
  }

  return null;
}

// Get summary statistics
export async function getSummaryStats(userId: string) {
  try {
    const sql = await getDbConnection();

    const [stats] = await sql`
      SELECT 
        COUNT(*) as total_summaries,
        SUM(LENGTH(summary_text) - LENGTH(REPLACE(summary_text, ' ', '')) + 1) as total_words,
        AVG(LENGTH(summary_text) - LENGTH(REPLACE(summary_text, ' ', '')) + 1) as avg_words_per_summary,
        MAX(created_at) as last_summary_date
      FROM pdf_summaries
      WHERE user_id=${userId}
    `;

    return stats;
  } catch (err) {
    console.error("Error fetching summary stats:", err);
    return null;
  }
}