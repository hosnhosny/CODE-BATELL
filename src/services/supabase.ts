import { createClient } from '@supabase/supabase-js';

// هذه القيم ستحصل عليها من لوحة تحكم Supabase بعد إنشاء مشروع
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);