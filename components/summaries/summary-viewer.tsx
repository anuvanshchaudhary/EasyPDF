"use client";
import { parseSection } from "@/utils/summary-helper";

export function SummaryViewer({ summary }: { summary: string }) {
  const sections = summary
    .split(/(?:\r?\n|^)#{1,6}\s+/)
    .map((section) => section.trim())
    .filter(Boolean)
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
                {/* Basic cleanup of points if they contain markdown bullets already */}
                {point.replace(/^[-*•]\s*/, '')}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
