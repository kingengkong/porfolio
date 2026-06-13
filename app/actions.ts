"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

// Buat Supabase client langsung di sini untuk menghindari null error
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase configuration in actions.ts");
}

const supabaseAdmin = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

// ==================== AUTH ====================
export async function verifyAdminPin(pin: string) {
  const correctPin = process.env.ADMIN_PIN || "123456";
  if (pin === correctPin) {
    return { success: true, message: "Login berhasil!" };
  }
  return { success: false, message: "PIN salah!" };
}

// ==================== CRUD PORTFOLIO ====================
export async function savePortfolioSection(
  section: string,
  content: any
) {
  if (!supabaseAdmin) {
    return { 
      success: false, 
      message: "Supabase client not initialized. Check your environment variables." 
    };
  }

  try {
    // Cek apakah section sudah ada
    const { data: existing } = await supabaseAdmin
      .from("portfolio_data")
      .select("id")
      .eq("section", section)
      .single();

    if (existing) {
      // Update
      const { error } = await supabaseAdmin
        .from("portfolio_data")
        .update({ content, updated_at: new Date().toISOString() })
        .eq("section", section);
      if (error) throw error;
    } else {
      // Insert
      const { error } = await supabaseAdmin
        .from("portfolio_data")
        .insert({ section, content });
      if (error) throw error;
    }

    revalidatePath("/");
    return { success: true, message: "Data berhasil disimpan!" };
  } catch (err: any) {
    return { success: false, message: err.message || "Gagal menyimpan data" };
  }
}

// Hapus file dari storage (opsional, dipanggil saat ganti gambar)
export async function deleteStorageFile(path: string) {
  if (!supabaseAdmin) {
    return { 
      success: false, 
      message: "Supabase client not initialized." 
    };
  }

  try {
    if (!path || path.startsWith("http")) {
      return { success: true };
    }
    await supabaseAdmin.storage.from("portfolio-assets").remove([path]);
    return { success: true };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}