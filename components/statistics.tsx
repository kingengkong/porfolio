"use client";
import { useRef } from "react";
import { motion } from "framer-motion";
import { useCountUp } from "@/hooks/use-count-up";
import { fadeUp, viewportOnce } from "@/lib/motion";
import { usePortfolioData } from "@/hooks/use-portfolio-data";
import { getIconComponent } from "@/lib/icon-map";

function StatCard({ stat, index }: { stat: any; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const count = useCountUp(ref, stat.value);
  const Icon = getIconComponent(stat.icon);

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="glass rounded-lg p-6 text-center"
    >
      <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-md bg-[#FFC300] text-black">
        <Icon size={22} />
      </div>
      <div className="text-4xl font-black text-black dark:text-white">
        {count}
        {stat.suffix}
      </div>
      <p className="mt-2 text-sm font-semibold text-neutral-600 dark:text-neutral-300">
        {stat.label}
      </p>
    </motion.div>
  );
}

export function Statistics() {
  const { data, loading } = usePortfolioData();
  const stats = data.stats;

  if (loading) {
    return (
      <section className="container-page py-20">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#FFC300] border-t-transparent" />
      </section>
    );
  }

  return (
    <section className="container-page py-20">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard key={stat.label} stat={stat} index={index} />
        ))}
      </div>
    </section>
  );
}