"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href="#home"
      aria-label="Back to top"
      className={`fixed bottom-5 right-5 z-40 grid h-11 w-11 place-items-center rounded-full bg-[#FFC300] text-black shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-1 hover:bg-[#ffd84a] ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <ArrowUp size={19} />
    </a>
  );
}
