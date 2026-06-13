"use client";
import { usePortfolioData } from "@/hooks/use-portfolio-data";
import { getIconComponent } from "@/lib/icon-map";

export function Footer() {
  const { data, loading } = usePortfolioData();
  const profile = data.profile;

  if (loading) {
    return (
      <footer className="border-t border-black/10 py-8 dark:border-white/15">
        <div className="container-page flex justify-center">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#FFC300] border-t-transparent" />
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-black/10 py-8 dark:border-white/15">
      <div className="container-page flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
        <p className="text-sm text-neutral-600 dark:text-neutral-300">
          Copyright © {new Date().getFullYear()} {profile.name}. All rights reserved.
        </p>
        <div className="flex items-center gap-3">
          {profile.socials.map((social) => {
            const Icon = getIconComponent(social.icon);
            return (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="grid h-10 w-10 place-items-center rounded-full border border-black/10 bg-white text-neutral-600 transition hover:-translate-y-0.5 hover:border-[#FFC300] hover:text-[#FFC300] dark:border-white/15 dark:bg-black dark:text-neutral-300 dark:hover:text-[#FFC300]"
              >
                <Icon size={18} />
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}