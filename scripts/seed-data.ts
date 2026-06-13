// Load environment variables dari .env.local
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";

// Buat client langsung dengan environment yang sudah di-load
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Error: Missing Supabase configuration");
  console.log("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl);
  console.log("SUPABASE_SERVICE_ROLE_KEY:", supabaseServiceKey ? "set" : "missing");
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
import {
  profile,
  aboutItems,
  skillCategories,
  projects,
  stats,
  certificates,
} from "@/lib/data";

// Konversi komponen Lucide menjadi string nama ikon
function iconToString(icon: any): string {
  return icon?.displayName || icon?.name || "HelpCircle";
}

async function seed() {
  const sections = [
    {
      section: "profile",
      content: {
        ...profile,
        socials: profile.socials.map((s) => ({ ...s, icon: iconToString(s.icon) })),
      },
    },
    {
      section: "aboutItems",
      content: aboutItems.map((item) => ({ ...item, icon: iconToString(item.icon) })),
    },
    {
      section: "skillCategories",
      content: skillCategories.map((cat) => ({
        ...cat,
        icon: iconToString(cat.icon),
        skills: cat.skills.map((s) => ({ ...s, icon: iconToString(s.icon) })),
      })),
    },
    { section: "projects", content: projects },
    {
      section: "stats",
      content: stats.map((s) => ({ ...s, icon: iconToString(s.icon) })),
    },
    { section: "certificates", content: certificates },
  ];

  for (const item of sections) {
    const { error } = await supabaseAdmin.from("portfolio_data").upsert(item as any, {
      onConflict: "section",
    });
    if (error) {
      console.error(`Error seeding ${item.section}:`, error);
    } else {
      console.log(`✅ Seeded: ${item.section}`);
    }
  }

  console.log("🎉 Seeding complete!");
}

seed();