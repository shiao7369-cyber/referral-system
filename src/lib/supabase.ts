import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ============================================================
// Mock data for development (when Supabase is not configured)
// ============================================================
export const isDemoMode = !supabaseUrl || supabaseUrl === 'https://your-project.supabase.co'
