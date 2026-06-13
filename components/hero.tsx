"use client";
import Image from "next/image";
import { ArrowDown, Download, Send } from "lucide-react";
import { motion } from "framer-motion";
import { slideLeft, slideRight } from "@/lib/motion";
import { TypingText } from "@/components/typing-text";
import { usePortfolioData } from "@/hooks/use-portfolio-data";

export function Hero() {
  const { data, loading } = usePortfolioData();
  const profile = data.profile;

  if (loading) {
    return (
      <section id="home" className="container-page relative flex min-h-screen items-center pt-24">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#FFC300] border-t-transparent" />
      </section>
    );
  }

  return (
    <section id="home" className="container-page relative flex min-h-screen items-center pt-24">
      <div className="absolute left-1/2 top-1/2 -z-10 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFC300]/5 blur-[140px]" />
      <div className="grid w-full items-center gap-10 py-14 lg:grid-cols-[1fr_0.92fr] lg:gap-16">
        <motion.div
          variants={slideLeft}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <p className="museum-label mb-6 inline-flex border-b border-[#FFC300] pb-2 text-xs font-semibold">
            Portfolio Exhibit / Siswa SMK TI BAZMA
          </p>
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400">
            Halo, saya
          </p>
          <h1 className="museum-serif max-w-3xl text-[clamp(4rem,8vw,8.5rem)] font-normal leading-[0.82] text-black dark:text-white">
            {profile.name}
          </h1>
          <p className="mt-7 text-2xl font-black uppercase tracking-[0.05em] text-black dark:text-white sm:text-3xl">
            <TypingText words={profile.roles} />
          </p>
          <p className="mt-6 max-w-xl text-base leading-8 text-neutral-600 dark:text-neutral-300 sm:text-lg">
            {profile.summary}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={profile.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[#FFC300] px-5 py-3 text-sm font-bold text-black shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-[#ffd84a]"
            >
              <Download size={18} />
              Download CV
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-black/15 bg-white px-5 py-3 text-sm font-bold text-black transition hover:-translate-y-0.5 hover:border-[#FFC300] hover:text-[#FFC300] dark:border-white/15 dark:bg-black dark:text-white dark:hover:text-[#FFC300]"
            >
              <Send size={18} />
              Contact Me
            </a>
          </div>
        </motion.div>

        <motion.div
          variants={slideRight}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.65, ease: "easeOut", delay: 0.1 }}
          className="relative mx-auto w-full max-w-[500px]"
        >
          <div className="absolute -right-4 top-8 hidden h-32 w-7 bg-[#FFC300] lg:block" />
          <div className="relative border border-black/15 bg-white p-3 dark:border-white/15 dark:bg-black">
            <Image
              src={profile.profileImage || "/profile.svg"}
              alt={`Foto profil ${profile.name}`}
              width={520}
              height={620}
              priority
              className="aspect-[3/4] object-cover grayscale"
            />
            <div className="mt-3 flex items-center justify-between gap-4 border-t border-black/10 pt-3 text-left dark:border-white/15">
              <div>
                <p className="museum-label text-[10px] font-semibold">Artwork</p>
                <p className="text-sm font-bold text-black dark:text-white">{profile.name}</p>
              </div>
              <p className="text-right text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                {profile.location}
              </p>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              {profile.roles.map((role) => (
                <div
                  key={role}
                  className="border border-black/10 bg-white px-2 py-3 text-[10px] font-black uppercase tracking-[0.08em] text-neutral-700 dark:border-white/15 dark:bg-black dark:text-neutral-200"
                >
                  {role}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <a
        href="#about"
        aria-label="Scroll to about section"
        className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 animate-bounce rounded-full border border-black/10 bg-white p-3 text-black shadow-sm md:grid dark:border-white/15 dark:bg-black dark:text-white"
      >
        <ArrowDown size={18} />
      </a>
    </section>
  );
}