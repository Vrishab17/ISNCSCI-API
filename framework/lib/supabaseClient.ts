import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

console.log('SB URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('SB KEY prefix:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0, 12))

export const supabase = createClient(supabaseUrl, supabaseAnonKey)