/**
 * FormattedAnswer — renders the markdown-like RAG response.
 * Handles: **bold**, bullet lists (* / -), sub-bullets, newlines.
 */
export default function FormattedAnswer({ text }) {
  if (!text) return null;

  const lines = text.split("\n").filter((l) => l.trim() !== "");

  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => {
        const trimmed = line.trim();

        // Bullet line
        if (/^\*\s|^-\s/.test(trimmed)) {
          const bulletContent = trimmed.replace(/^\*\s*|^-\s*/, "");
          return (
            <div key={i} className="flex gap-2 ml-2">
              <span className="text-gray-400 select-none">•</span>
              <span>{renderInline(bulletContent)}</span>
            </div>
          );
        }

        // Indented sub-bullet
        if (/^\s{2,}[-*]\s/.test(line)) {
          const subContent = line.replace(/^\s+[-*]\s*/, "");
          return (
            <div key={i} className="flex gap-2 ml-6">
              <span className="text-gray-300 select-none">–</span>
              <span>{renderInline(subContent)}</span>
            </div>
          );
        }

        // Regular line
        return <p key={i}>{renderInline(trimmed)}</p>;
      })}
    </div>
  );
}

/** Render inline markdown: **bold** */
function renderInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}
