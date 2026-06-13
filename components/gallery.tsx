"use client";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { X, Calendar, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { usePortfolioData } from "@/hooks/use-portfolio-data";

type FilterType = "all" | "original" | "grayscale";

export function Gallery() {
  const { data, loading } = usePortfolioData();
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [filteredPhotos, setFilteredPhotos] = useState<any[]>([]);
  
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    if (data.gallery) {
      const filtered = filter === "all"
        ? data.gallery
        : data.gallery.filter(photo => photo.filter === filter);
      setFilteredPhotos(filtered.sort((a, b) => a.order - b.order));
      setCurrentPage(1);
    }
  }, [filter, data.gallery]);

  const totalPages = Math.ceil(filteredPhotos.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPhotos = filteredPhotos.slice(startIndex, endIndex);

  if (loading) {
    return (
      <section id="gallery" className="container-page py-24">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#FFC300] border-t-transparent" />
      </section>
    );
  }

  return (
    <section id="gallery" className="container-page py-24">
      <SectionHeading
        eyebrow="Gallery"
        title="Galeri Foto"
        description="Dokumentasi momen-momen penting dan karya fotografi saya."
      />

      <div className="flex justify-center gap-4 mb-12">
        <button
          onClick={() => setFilter("all")}
          className={`px-6 py-2 rounded-full text-sm font-bold transition ${
            filter === "all"
              ? "bg-[#FFC300] text-black"
              : "border border-black/10 bg-white text-neutral-600 hover:border-[#FFC300] dark:border-white/15 dark:bg-black dark:text-neutral-300"
          }`}
        >
          Semua Foto
        </button>
        <button
          onClick={() => setFilter("original")}
          className={`px-6 py-2 rounded-full text-sm font-bold transition ${
            filter === "original"
              ? "bg-[#FFC300] text-black"
              : "border border-black/10 bg-white text-neutral-600 hover:border-[#FFC300] dark:border-white/15 dark:bg-black dark:text-neutral-300"
          }`}
        >
          Original
        </button>
        <button
          onClick={() => setFilter("grayscale")}
          className={`px-6 py-2 rounded-full text-sm font-bold transition ${
            filter === "grayscale"
              ? "bg-[#FFC300] text-black"
              : "border border-black/10 bg-white text-neutral-600 hover:border-[#FFC300] dark:border-white/15 dark:bg-black dark:text-neutral-300"
          }`}
        >
          Hitam Putih
        </button>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        <AnimatePresence>
          {currentPhotos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -8 }}
              className="break-inside-avoid cursor-pointer group"
              onClick={() => setSelectedPhoto(photo)}
            >
              <div className="relative overflow-hidden rounded-lg border border-black/10 bg-white dark:border-white/15 dark:bg-black">
                <div className={`relative ${photo.filter === 'grayscale' ? 'grayscale' : ''}`}>
                  <Image
                    src={photo.imageUrl}
                    alt={photo.title}
                    width={600}
                    height={800}
                    className="w-full h-auto object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition duration-300">
                    <h3 className="font-bold text-lg">{photo.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-neutral-300 mt-1">
                      <Calendar size={14} />
                      {new Date(photo.uploadedAt).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

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
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            >
              <X size={24} />
            </button>

            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="relative max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`relative ${selectedPhoto.filter === 'grayscale' ? 'grayscale' : ''}`}>
                <Image
                  src={selectedPhoto.imageUrl}
                  alt={selectedPhoto.title}
                  width={1200}
                  height={800}
                  className="w-full h-auto rounded-lg"
                />
              </div>
              
              <div className="mt-4 text-white">
                <h2 className="text-2xl font-bold">{selectedPhoto.title}</h2>
                {selectedPhoto.description && (
                  <p className="mt-2 text-neutral-300">{selectedPhoto.description}</p>
                )}
                <div className="flex items-center gap-4 mt-3 text-sm text-neutral-400">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    {new Date(selectedPhoto.uploadedAt).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter size={16} />
                    {selectedPhoto.filter === 'grayscale' ? 'Hitam Putih' : 'Original'}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {filteredPhotos.length === 0 && (
        <div className="text-center py-20">
          <p className="text-neutral-500 text-lg">Belum ada foto di galeri.</p>
        </div>
      )}
    </section>
  );
}