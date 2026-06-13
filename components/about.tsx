"use client";
import { motion } from "framer-motion";
import { fadeUp, viewportOnce } from "@/lib/motion";
import { SectionHeading } from "@/components/section-heading";
import { RichText } from "@/components/rich-text";
import { usePortfolioData } from "@/hooks/use-portfolio-data";
import { getIconComponent } from "@/lib/icon-map";

export function About() {
  const { data, loading } = usePortfolioData();
  const aboutItems = data.aboutItems;
  const aboutSection = data.aboutSection;

  if (loading) {
    return (
      <section id="about" className="container-page py-24">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#FFC300] border-t-transparent" />
      </section>
    );
  }

  return (
    <section id="about" className="container-page py-24">
      <SectionHeading
        eyebrow="About"
        title="Tentang Saya"
        description={aboutSection.sectionDescription}
      />
      <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          transition={{ duration: 0.55 }}
          className="lg:sticky lg:top-28 lg:self-start"
        >
          <p className="museum-label mb-5 text-xs font-semibold">Profile Notes</p>
          <h3 className="museum-serif max-w-md text-4xl font-normal leading-tight text-black dark:text-white sm:text-5xl">
            {aboutSection.profileNotes.heading}
          </h3>
          <p className="mt-6 max-w-md leading-8 text-neutral-600 dark:text-neutral-300">
            {aboutSection.profileNotes.description}
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-[1.35rem] top-0 hidden h-full w-px bg-black/10 dark:bg-white/15 sm:block" />
          <div className="max-h-[600px] overflow-y-auto space-y-10 pr-4 scrollbar-thin scrollbar-thumb-[#FFC300]/30 scrollbar-track-transparent hover:scrollbar-thumb-[#FFC300]/50">
            {aboutItems.map((item, index) => {
              const Icon = getIconComponent(item.icon);
              return (
                <motion.article
                  key={item.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={viewportOnce}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="relative grid gap-5 sm:grid-cols-[2.75rem_1fr]"
                >
                  <div className="relative z-10 grid h-11 w-11 place-items-center rounded-full bg-[#FFC300] text-black ring-8 ring-white dark:ring-[#050505]">
                    <Icon size={19} />
                  </div>
                  <div className="border-b border-black/10 pb-10 dark:border-white/15">
                    <div className="mb-3 flex items-baseline justify-between gap-6">
                      <h3 className="text-2xl font-black text-black dark:text-white">
                        {item.title}
                      </h3>
                      <span className="museum-label shrink-0 text-[10px] font-semibold">
                        0{index + 1}
                      </span>
                    </div>
                    <RichText
                      text={item.description}
                      className="max-w-2xl leading-8 text-neutral-600 dark:text-neutral-300"
                    />
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}