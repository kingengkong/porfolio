"use client";

import { useEffect, useState } from "react";
import { useInView } from "framer-motion";
import type { RefObject } from "react";

export function useCountUp(
  ref: RefObject<Element | null>,
  end: number,
  duration = 1200
) {
  const [count, setCount] = useState(0);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!isInView) return;

    let frame = 0;
    const totalFrames = Math.round(duration / 16);

    const counter = window.setInterval(() => {
      frame += 1;
      const progress = Math.min(frame / totalFrames, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(end * eased));

      if (progress === 1) {
        window.clearInterval(counter);
      }
    }, 16);

    return () => window.clearInterval(counter);
  }, [duration, end, isInView]);

  return count;
}
