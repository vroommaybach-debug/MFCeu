import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

const isPlaceholder = !import.meta.env.VITE_SUPABASE_URL || supabaseUrl.includes('placeholder') || supabaseUrl.includes('test');

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: !isPlaceholder,
    autoRefreshToken: !isPlaceholder,
    detectSessionInUrl: !isPlaceholder
  }
});
