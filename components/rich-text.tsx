"use client";

type RichTextProps = {
  text: string;
  className?: string;
};

type TextBlock =
  | { type: "paragraph"; content: string }
  | { type: "ol"; items: string[] }
  | { type: "ul"; items: string[] };

function parseRichText(text: string): TextBlock[] {
  if (!text) return [];

  const lines = text.split("\n").map((l) => l.trim());
  const blocks: TextBlock[] = [];
  let currentParagraph: string[] = [];

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      blocks.push({ type: "paragraph", content: currentParagraph.join(" ") });
      currentParagraph = [];
    }
  };

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    if (!line) {
      flushParagraph();
      i++;
      continue;
    }

    const olMatch = line.match(/^(\d+)[.\)\-]\s+(.*)$/);
    const ulMatch = line.match(/^[\-\*•]\s+(.*)$/);

    if (olMatch) {
      flushParagraph();
      const items: string[] = [];
      while (i < lines.length) {
        const nextLine = lines[i].trim();
        if (!nextLine) break;
        const match = nextLine.match(/^(\d+)[.\)\-]\s+(.*)$/);
        if (match) {
          items.push(match[2]);
          i++;
        } else {
          break;
        }
      }
      if (items.length > 0) {
        blocks.push({ type: "ol", items });
      }
    } else if (ulMatch) {
      flushParagraph();
      const items: string[] = [];
      while (i < lines.length) {
        const nextLine = lines[i].trim();
        if (!nextLine) break;
        const match = nextLine.match(/^[\-\*•]\s+(.*)$/);
        if (match) {
          items.push(match[1]);
          i++;
        } else {
          break;
        }
      }
      if (items.length > 0) {
        blocks.push({ type: "ul", items });
      }
    } else {
      currentParagraph.push(line);
      i++;
    }
  }

  flushParagraph();
  return blocks;
}

export function RichText({ text, className = "" }: RichTextProps) {
  const blocks = parseRichText(text);

  if (blocks.length === 0) return null;

  return (
    <div className={`space-y-3 ${className}`}>
      {blocks.map((block, idx) => {
        if (block.type === "paragraph") {
          return <p key={idx}>{block.content}</p>;
        }
        if (block.type === "ol") {
          return (
            <ol key={idx} className="list-decimal space-y-1 pl-6">
              {block.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ol>
          );
        }
        if (block.type === "ul") {
          return (
            <ul key={idx} className="list-disc space-y-1 pl-6">
              {block.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          );
        }
        return null;
      })}
    </div>
  );
}