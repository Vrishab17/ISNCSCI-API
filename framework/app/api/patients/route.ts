// app/api/patients/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    return NextResponse.json(
      { error: 'Missing Supabase env vars on server' },
      { status: 500 }
    )
  }

  const sb = createClient(url, serviceKey, { auth: { persistSession: false } })
  const { data, error } = await sb.from('Patients').select('*').limit(5)
  return NextResponse.json({ data, error }, { status: error ? 400 : 200 })
}