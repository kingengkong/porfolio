import { supabaseClient } from "./supabase";

const BUCKET_NAME = "portfolio-assets";

export async function uploadFile(
  file: File,
  folder: string // "profile", "projects", "certificates", "cv"
): Promise<{ url: string; path: string }> {
  // Buat nama file unik dengan timestamp
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const filePath = `${folder}/${timestamp}-${safeName}`;

  const { error } = await supabaseClient.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw error;

  // Dapatkan URL publik
  const { data } = supabaseClient.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return {
    url: data.publicUrl,
    path: filePath,
  };
}

// Hapus file lama saat diganti
export async function deleteFile(path: string): Promise<void> {
  if (!path || path.startsWith("http")) return; // Skip URL eksternal
  await supabaseClient.storage.from(BUCKET_NAME).remove([path]);
}