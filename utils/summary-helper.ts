export function validateSummary(summary: string): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  if (summary.length < 500) {
    issues.push("Summary is too short (minimum 500 characters)");
  }

  if (!summary.includes('#')) {
    issues.push("Summary missing title/headers");
  }

  const sectionCount = (summary.match(/##/g) || []).length;
  if (sectionCount < 3) {
    issues.push("Summary has too few sections");
  }

  if (summary.includes('---')) {
    issues.push("Summary contains flashcard separators (should be removed)");
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}

export function extractSummaryMetadata(summary: string) {
  const lines = summary.split('\n');
  const title = lines.find(line => line.startsWith('#'))?.replace(/^#+\s*/, '') || 'Untitled';
  const wordCount = summary.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200); // Average reading speed

  return {
    title,
    wordCount,
    readingTime,
  };
}

// Keep these for backward compatibility with old summaries (if any exist)
export const parseSection = (
  section: string
): { title: string; points: string[] } => {
  const [title, ...content] = section.split("\n");
  const cleanTitle = title.startsWith("#")
    ? title.substring(1).trim()
    : title.trim();

  const points: string[] = [];
  let currentPoint = "";
  content.forEach((line) => {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith("•") || trimmedLine.startsWith("🔹")) {
      if (currentPoint) points.push(currentPoint.trim());
      currentPoint = trimmedLine;
    } else if (!trimmedLine) {
      if (currentPoint) points.push(currentPoint.trim());
      currentPoint = "";
    } else {
      currentPoint += " " + trimmedLine;
    }
  });
  if (currentPoint) points.push(currentPoint.trim());
  return {
    title: cleanTitle,
    points: points.filter(
      (point) => point && !point.startsWith("#") && !point.startsWith("[Choose")
    ),
  };
};

export function parsePoint(point: string) {
  const isNumbered = /^\d+\./.test(point);
  const isMainPoint = /^[•🔹]/.test(point);
  const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]/u;
  const hasEmoji = emojiRegex.test(point);
  const isEmpty = !point.trim();
  return { isNumbered, isMainPoint, hasEmoji, isEmpty };
}

export function parseEmojiPoint(content: string) {
  const cleanContent = content.replace(/^[•🔹]\s*/, "").trim();
  const matches = cleanContent.match(/^(\p{Emoji}+)(.+)$/u);
  if (!matches) return null;

  const [_, emoji, text] = matches;
  return {
    emoji: emoji.trim(),
    text: text.trim(),
  };
}