"use client";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { fadeUp, viewportOnce } from "@/lib/motion";
import { SectionHeading } from "@/components/section-heading";
import { usePortfolioData } from "@/hooks/use-portfolio-data";
import { getIconComponent } from "@/lib/icon-map";

type SelectedSkill = {
  category: string;
  name: string;
  icon: string;
};

export function Skills() {
  const { data, loading } = usePortfolioData();
  const skillCategories = data.skillCategories;
  const [selectedSkill, setSelectedSkill] = useState<SelectedSkill | null>(null);
  
  // Pagination state untuk setiap kategori
  const [categoryPages, setCategoryPages] = useState<Record<string, number>>({});
  const SKILLS_PER_PAGE = 6; // 6 skills per halaman per kategori

  const getCategoryPage = (categoryTitle: string) => categoryPages[categoryTitle] || 1;
  
  const setCategoryPage = (categoryTitle: string, page: number) => {
    setCategoryPages(prev => ({ ...prev, [categoryTitle]: page }));
  };

  if (loading) {
    return (
      <section id="skills" className="container-page py-24">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#FFC300] border-t-transparent" />
      </section>
    );
  }

  return (
    <section id="skills" className="container-page relative py-24">
      <SectionHeading
        eyebrow="Skills"
        title="Skill Teknis"
        description="Kumpulan kemampuan yang saya pelajari di sekolah, praktik mandiri, dan pengalaman PKL."
      />
      <motion.div
        animate={{
          filter: selectedSkill ? "blur(8px)" : "blur(0px)",
          opacity: selectedSkill ? 0.38 : 1,
          scale: selectedSkill ? 0.985 : 1,
        }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="space-y-12"
      >
        {skillCategories.map((category, categoryIndex) => {
          const CategoryIcon = getIconComponent(category.icon);
          const currentPage = getCategoryPage(category.title);
          const totalPages = Math.ceil(category.skills.length / SKILLS_PER_PAGE);
          const startIndex = (currentPage - 1) * SKILLS_PER_PAGE;
          const endIndex = startIndex + SKILLS_PER_PAGE;
          const currentSkills = category.skills.slice(startIndex, endIndex);

          return (
            <motion.div
              key={category.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              transition={{ duration: 0.5, delay: categoryIndex * 0.08 }}
              className="grid gap-5 border-t border-black/10 pt-6 dark:border-white/15 lg:grid-cols-[14rem_1fr]"
            >
              <div>
                <div className="mb-3 flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-[#FFC300] text-black">
                    <CategoryIcon size={18} />
                  </span>
                  <h3 className="text-xl font-black text-black dark:text-white">
                    {category.title}
                  </h3>
                </div>
                <p className="museum-label text-[10px] font-semibold">
                  Collection 0{categoryIndex + 1}
                </p>
              </div>

              <div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
                  {currentSkills.map((skill, skillIndex) => {
                    const Icon = getIconComponent(skill.icon);

                    return (
                      <motion.button
                        key={skill.name}
                        type="button"
                        layoutId={`skill-${skill.name}`}
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={viewportOnce}
                        transition={{
                          duration: 0.42,
                          delay: categoryIndex * 0.05 + skillIndex * 0.035,
                          ease: "easeOut",
                        }}
                        whileHover={{
                          y: -6,
                          borderColor: "#FFC300",
                          boxShadow: "0 16px 45px rgba(255, 195, 0, 0.12)",
                        }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() =>
                          setSelectedSkill({
                            category: category.title,
                            name: skill.name,
                            icon: skill.icon,
                          })
                        }
                        className="group aspect-square border border-black/10 bg-white p-4 text-left transition dark:border-white/15 dark:bg-black"
                      >
                        <div className="flex h-full flex-col justify-between">
                          <Icon
                            size={22}
                            className="text-black transition group-hover:text-[#FFC300] dark:text-white dark:group-hover:text-[#FFC300]"
                          />
                          <div>
                            <p className="text-sm font-black text-black dark:text-white">
                              {skill.name}
                            </p>
                            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
                              {category.title}
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Pagination untuk kategori ini */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-6">
                    <button
                      onClick={() => setCategoryPage(category.title, Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-black/10 bg-white text-xs font-bold transition hover:border-[#FFC300] disabled:opacity-50 disabled:cursor-not-allowed dark:border-white/15 dark:bg-black dark:text-neutral-300"
                    >
                      <ChevronLeft size={14} />
                      Prev
                    </button>
                    
                    <span className="px-3 py-1.5 text-xs font-bold text-neutral-600 dark:text-neutral-400">
                      {currentPage} / {totalPages}
                    </span>
                    
                    <button
                      onClick={() => setCategoryPage(category.title, Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-black/10 bg-white text-xs font-bold transition hover:border-[#FFC300] disabled:opacity-50 disabled:cursor-not-allowed dark:border-white/15 dark:bg-black dark:text-neutral-300"
                    >
                      Next
                      <ChevronRight size={14} />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <AnimatePresence>
        {selectedSkill ? (
          <motion.div
            className="fixed inset-0 z-[60] grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedSkill(null)}
          >
            <motion.div
              layoutId={`skill-${selectedSkill.name}`}
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.92 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="relative w-full max-w-md border border-white/15 bg-white p-7 text-black shadow-2xl dark:bg-black dark:text-white"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                aria-label="Close skill preview"
                onClick={() => setSelectedSkill(null)}
                className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-black/10 text-black transition hover:border-[#FFC300] hover:text-[#FFC300] dark:border-white/15 dark:text-white"
              >
                <X size={18} />
              </button>

              <div className="grid h-16 w-16 place-items-center rounded-full bg-[#FFC300] text-black">
                {(() => {
                  const SelectedIcon = getIconComponent(selectedSkill.icon);
                  return <SelectedIcon size={28} />;
                })()}
              </div>
              <p className="museum-label mt-8 text-xs font-semibold">
                {selectedSkill.category}
              </p>
              <h3 className="museum-serif mt-3 text-5xl font-normal leading-none">
                {selectedSkill.name}
              </h3>
              <p className="mt-5 leading-8 text-neutral-600 dark:text-neutral-300">
                Skill ini menjadi bagian dari koleksi kemampuan saya dalam jalur{" "}
                {selectedSkill.category}. Fokusnya adalah praktik, eksplorasi, dan
                peningkatan kualitas kerja secara bertahap.
              </p>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}