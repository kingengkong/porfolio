import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Client untuk komponen frontend (Hanya bisa READ karena RLS)
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Server Client untuk Server Actions (Bisa READ & WRITE menggunakan Service Role)
// Hanya di-inisialisasi jika service key tersedia (server-side only)
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;