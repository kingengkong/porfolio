"use client";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Github, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { fadeUp, viewportOnce } from "@/lib/motion";
import { SectionHeading } from "@/components/section-heading";
import { usePortfolioData } from "@/hooks/use-portfolio-data";
import type { Project } from "@/types/portfolio";

export function Projects() {
  const { data, loading } = usePortfolioData();
  const projects = data.projects;
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6; // 6 projects per halaman

  // Hitung pagination
  const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProjects = projects.slice(startIndex, endIndex);

  if (loading) {
    return (
      <section id="projects" className="container-page py-24">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#FFC300] border-t-transparent" />
      </section>
    );
  }

  return (
    <section id="projects" className="container-page relative py-24">
      <SectionHeading
        eyebrow="Projects"
        title="Project Pilihan"
        description="Beberapa contoh project web, dashboard, dan aplikasi pendukung operasional IT."
      />
      <motion.div
        animate={{
          filter: selectedProject ? "blur(9px)" : "blur(0px)",
          opacity: selectedProject ? 0.34 : 1,
          scale: selectedProject ? 0.985 : 1,
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="grid gap-10 lg:grid-cols-3 lg:items-start"
      >
        <AnimatePresence>
          {currentProjects.map((project, index) => (
            <motion.article
              key={project.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              transition={{ duration: 0.48, delay: index * 0.1 }}
              className={index === 1 ? "lg:mt-16" : index === 2 ? "lg:mt-8" : ""}
            >
              <motion.button
                type="button"
                layoutId={`project-frame-${project.title}`}
                onClick={() => setSelectedProject(project)}
                whileHover={{ y: -10, rotate: index === 1 ? -0.8 : 0.8 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.24, ease: "easeOut" }}
                className="group w-full border border-black/10 bg-white p-3 text-left shadow-[0_24px_70px_rgba(0,0,0,0.08)] transition hover:border-[#FFC300] dark:border-white/15 dark:bg-black dark:shadow-[0_24px_70px_rgba(0,0,0,0.35)]"
              >
                <div className="relative overflow-hidden bg-neutral-100 dark:bg-neutral-950">
                  <div className="absolute left-4 top-4 z-10 h-9 w-9 bg-[#FFC300]" />
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={900}
                    height={560}
                    className="aspect-[4/3] w-full object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 border-[18px] border-white/80 mix-blend-screen dark:border-black/60" />
                </div>
              </motion.button>

              <div className="mt-4 grid grid-cols-[1fr_auto] gap-4 border-t border-black/10 pt-4 dark:border-white/15">
                <div>
                  <p className="museum-label mb-2 text-[10px] font-semibold">
                    Exhibit 0{startIndex + index + 1}
                  </p>
                  <h3 className="text-xl font-black text-black dark:text-white">
                    {project.title}
                  </h3>
                  <p className="mt-2 max-w-sm text-sm leading-7 text-neutral-600 dark:text-neutral-300">
                    {project.description}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label={`Preview ${project.title}`}
                  onClick={() => setSelectedProject(project)}
                  className="mt-1 grid h-10 w-10 place-items-center rounded-full border border-black/10 text-black transition hover:border-[#FFC300] hover:bg-[#FFC300] dark:border-white/15 dark:text-white dark:hover:text-black"
                >
                  <ExternalLink size={16} />
                </button>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-4 py-2 rounded-md border border-black/10 bg-white text-sm font-bold transition hover:border-[#FFC300] disabled:opacity-50 disabled:cursor-not-allowed dark:border-white/15 dark:bg-black dark:text-neutral-300"
          >
            <ChevronLeft size={16} />
            Previous
          </button>
          
          <span className="px-4 py-2 text-sm font-bold text-neutral-600 dark:text-neutral-400">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 px-4 py-2 rounded-md border border-black/10 bg-white text-sm font-bold transition hover:border-[#FFC300] disabled:opacity-50 disabled:cursor-not-allowed dark:border-white/15 dark:bg-black dark:text-neutral-300"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      <AnimatePresence>
        {selectedProject ? (
          <motion.div
            className="fixed inset-0 z-[60] grid place-items-center bg-black/76 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              layoutId={`project-frame-${selectedProject.title}`}
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.92 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative grid w-full max-w-5xl gap-0 border border-white/15 bg-white p-3 text-black shadow-2xl dark:bg-black dark:text-white lg:grid-cols-[1.2fr_0.8fr]"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                aria-label="Close project preview"
                onClick={() => setSelectedProject(null)}
                className="absolute right-5 top-5 z-10 grid h-10 w-10 place-items-center rounded-full border border-black/10 bg-white/85 text-black transition hover:border-[#FFC300] hover:text-[#FFC300] dark:border-white/15 dark:bg-black/85 dark:text-white"
              >
                <X size={18} />
              </button>

              <div className="relative min-h-[320px] overflow-hidden bg-neutral-100 dark:bg-neutral-950">
                <Image
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  fill
                  className="object-cover grayscale"
                />
                <div className="absolute bottom-5 left-5 bg-[#FFC300] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-black">
                  Featured Work
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <p className="museum-label text-xs font-semibold">Project Archive</p>
                <h3 className="museum-serif mt-4 text-5xl font-normal leading-none">
                  {selectedProject.title}
                </h3>
                <p className="mt-5 leading-8 text-neutral-600 dark:text-neutral-300">
                  {selectedProject.description}
                </p>

                <div className="mt-7 flex flex-wrap gap-2">
                  {selectedProject.tech.map((tech) => (
                    <span
                      key={tech}
                      className="border border-black/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.08em] text-black dark:border-white/15 dark:text-white"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={selectedProject.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-[#FFC300] px-5 py-3 text-sm font-bold text-black transition hover:bg-[#ffd84a]"
                  >
                    <ExternalLink size={17} />
                    Demo
                  </a>
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-md border border-black/15 bg-white px-5 py-3 text-sm font-bold text-black transition hover:border-[#FFC300] hover:text-[#FFC300] dark:border-white/15 dark:bg-black dark:text-white dark:hover:text-[#FFC300]"
                  >
                    <Github size={17} />
                    GitHub
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}