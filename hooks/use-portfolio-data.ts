"use client";
import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabase";
import { getIconComponent } from "@/lib/icon-map";
import type {
  Profile,
  AboutItem,
  SkillCategory,
  Project,
  Certificate,
  Stat,
  ContactItem,
  AboutSection,
  GalleryPhoto,
} from "@/types/portfolio";

export type PortfolioData = {
  profile: Profile;
  aboutItems: AboutItem[];
  aboutSection: AboutSection;
  skillCategories: SkillCategory[];
  projects: Project[];
  stats: Stat[];
  certificates: Certificate[];
  contactInfo: ContactItem[];
  gallery: GalleryPhoto[];
};

const defaultAboutSection: AboutSection = {
  profileNotes: {
    heading: "Belajar teknologi dengan rasa ingin tahu, ketelitian, dan mata visual.",
    description: "Saya menikmati pekerjaan yang menggabungkan problem solving teknis dan presentasi visual yang rapi, dari troubleshooting perangkat sampai membuat tampilan web dan dokumentasi foto."
  },
  sectionDescription: "Ringkasan profil, pendidikan, pengalaman PKL, dan hobi yang membentuk cara saya belajar teknologi."
};

const defaultData: PortfolioData = {
  profile: {
    name: "Wais Al-Qorni",
    title: "IT Support & Web Developer",
    description: "Siswa SMK dengan passion di teknologi dan design.",
    summary: "Siswa SMK jurusan IT yang senang membangun website modern.",
    roles: ["IT Support", "Web Developer", "Photographer"],
    email: "email@example.com",
    location: "Indonesia",
    avatar: "/profile.svg",
    profileImage: "/profile.svg",
    cvUrl: "/cv.pdf",
    socials: [],
  },
  aboutItems: [],
  aboutSection: defaultAboutSection,
  skillCategories: [],
  projects: [],
  stats: [],
  certificates: [],
  contactInfo: [],
  gallery: [],
};

export function usePortfolioData() {
  const [data, setData] = useState<PortfolioData>(defaultData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: rows, error } = await supabaseClient
          .from("portfolio_data")
          .select("section, content");

        if (error) throw error;

        if (!rows || rows.length === 0) {
          setLoading(false);
          return;
        }

        const raw: Record<string, any> = {};
        rows.forEach((row) => {
          raw[row.section] = row.content;
        });

        const profile: Profile = raw.profile
          ? {
              ...raw.profile,
              socials: (raw.profile.socials || []).map((s: any) => ({
                ...s,
                icon: getIconComponent(s.icon),
              })),
            }
          : defaultData.profile;

        const aboutItems: AboutItem[] = (raw.aboutItems || []).map(
          (item: any) => ({
            ...item,
            icon: getIconComponent(item.icon),
          })
        );

        const aboutSection: AboutSection = raw.aboutSection || defaultAboutSection;

        const skillCategories: SkillCategory[] = (
          raw.skillCategories || []
        ).map((cat: any) => ({
          ...cat,
          icon: getIconComponent(cat.icon),
          skills: cat.skills.map((s: any) => ({
            ...s,
            icon: getIconComponent(s.icon),
          })),
        }));

        const stats: Stat[] = (raw.stats || []).map((s: any) => ({
          ...s,
          icon: getIconComponent(s.icon),
        }));

        const contactInfo: ContactItem[] = [
          {
            label: "Email",
            value: profile.email,
            href: `mailto:${profile.email}`,
            icon: getIconComponent("Mail"),
          },
          ...(raw.profile?.socials || []).map((s: any) => ({
            ...s,
            icon: getIconComponent(s.icon),
          })),
        ];

        const gallery: GalleryPhoto[] = raw.gallery || [];

        setData({
          profile,
          aboutItems,
          aboutSection,
          skillCategories,
          projects: raw.projects || [],
          stats,
          certificates: raw.certificates || [],
          contactInfo,
          gallery,
        });
      } catch (err) {
        console.error("Error fetching portfolio data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, loading };
}