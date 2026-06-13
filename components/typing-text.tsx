"use client";

import { useEffect, useState } from "react";

type TypingTextProps = {
  words: string[];
};

export function TypingText({ words }: TypingTextProps) {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIndex];
    const timeout = window.setTimeout(
      () => {
        if (!deleting && text.length < word.length) {
          setText(word.slice(0, text.length + 1));
        } else if (!deleting) {
          setDeleting(true);
        } else if (text.length > 0) {
          setText(word.slice(0, text.length - 1));
        } else {
          setDeleting(false);
          setWordIndex((index) => (index + 1) % words.length);
        }
      },
      deleting ? 55 : 95
    );

    return () => window.clearTimeout(timeout);
  }, [deleting, text, wordIndex, words]);

  return (
    <span className="text-gradient">
      {text}
      <span className="ml-1 inline-block h-6 w-0.5 translate-y-1 animate-pulse bg-[#FFC300]" />
    </span>
  );
}
