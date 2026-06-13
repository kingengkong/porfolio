"use client";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { fadeUp, viewportOnce } from "@/lib/motion";
import { SectionHeading } from "@/components/section-heading";
import { usePortfolioData } from "@/hooks/use-portfolio-data";
import type { Certificate } from "@/types/portfolio";

export function Certificates() {
  const { data, loading } = usePortfolioData();
  const certificates = data.certificates;
  const [selected, setSelected] = useState<Certificate | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6; // 6 certificates per halaman

  // Hitung pagination
  const totalPages = Math.ceil(certificates.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCertificates = certificates.slice(startIndex, endIndex);

  if (loading) {
    return (
      <section id="certificates" className="container-page py-24">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#FFC300] border-t-transparent" />
      </section>
    );
  }

  return (
    <section id="certificates" className="container-page py-24">
      <SectionHeading
        eyebrow="Certificates"
        title="Sertifikat"
        description="Dokumentasi pencapaian belajar dan pelatihan yang relevan dengan bidang IT."
      />
      <div className="grid gap-6 md:grid-cols-3">
        {currentCertificates.map((certificate, index) => (
          <motion.button
            key={certificate.title}
            type="button"
            onClick={() => setSelected(certificate)}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            whileHover={{ y: -7, scale: 1.015 }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
            className="glass overflow-hidden rounded-lg text-left"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={certificate.image}
                alt={certificate.title}
                fill
                className="object-cover transition duration-500 hover:scale-105"
              />
            </div>
            <div className="p-5">
              <h3 className="font-bold text-black dark:text-white">{certificate.title}</h3>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
                {certificate.issuer}
              </p>
            </div>
          </motion.button>
        ))}
      </div>

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

      {selected ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[60] grid place-items-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-3xl rounded-lg bg-white p-3 shadow-2xl dark:bg-black"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close certificate preview"
              onClick={() => setSelected(null)}
              className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-black/80 text-white"
            >
              <X size={18} />
            </button>
            <Image
              src={selected.image}
              alt={selected.title}
              width={1200}
              height={850}
              className="rounded-md"
            />
            <div className="px-2 py-4">
              <h3 className="text-xl font-bold text-black dark:text-white">
                {selected.title}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-300">{selected.issuer}</p>
            </div>
          </motion.div>
        </div>
      ) : null}
    </section>
  );
}