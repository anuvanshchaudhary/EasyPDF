"use client";
import { parseSection } from "@/utils/summary-helper";

function splitMarkdownSections(markdown: string): string[] {
  const lines = markdown.split(/\r?\n/);
  const sections: string[] = [];
  let current: string[] = [];
  let inCodeBlock = false;

  for (const line of lines) {
    // Toggle code block state on triple-backtick fences
    if (line.trim().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      current.push(line);
      continue;
    }

    // Only treat # as a section delimiter when NOT inside a code block
    if (!inCodeBlock && /^#{1,6}\s+/.test(line)) {
      if (current.length > 0) {
        const joined = current.join("\n").trim();
        if (joined) sections.push(joined);
      }
      current = [line];
    } else {
      current.push(line);
    }
  }

  // Push the final accumulated section
  if (current.length > 0) {
    const joined = current.join("\n").trim();
    if (joined) sections.push(joined);
  }

  return sections;
}

export function SummaryViewer({ summary }: { summary: string }) {
  const sections = splitMarkdownSections(summary)
    .map(parseSection)
    .filter((section) => section.points.length > 0);

  return (
    <div className="space-y-12 w-full">
      {sections.map((section, index) => (
        <div
          key={index}
          className={`mb-12 border-4 border-black p-8 shadow-reverse bg-white transition-transform duration-300 hover:scale-[1.01] ${index % 2 === 0 ? '-rotate-1' : 'rotate-1'}`}
        >
          {section.title && (
            <h3 className="font-mono text-3xl font-black bg-black text-white inline-block px-2 mb-6 uppercase">
              {section.title}
            </h3>
          )}
          <ul className="list-disc list-inside font-serif text-2xl font-bold space-y-4 marker:text-4xl">
            {section.points.map((point, ptIndex) => (
              <li key={ptIndex}>
                {point.replace(/^[-*•]\s*/, '').replace(/\*\*/g, '')}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
