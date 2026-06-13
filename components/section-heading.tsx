"use client";

import { motion } from "framer-motion";
import { fadeUp, viewportOnce } from "@/lib/motion";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="mx-auto mb-14 max-w-3xl text-center"
    >
      <p className="museum-label mb-3 text-xs font-semibold">
        {eyebrow}
      </p>
      <h2 className="museum-serif text-4xl font-normal leading-none text-black dark:text-white sm:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-7 text-neutral-600 dark:text-neutral-300">
          {description}
        </p>
      ) : null}
    </motion.div>
  );
}
