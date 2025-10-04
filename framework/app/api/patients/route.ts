import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabaseClient'

// GET /api/patient?nhi=ABC1234
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const nhi = searchParams.get('nhi')?.trim()
  if (!nhi) return NextResponse.json({ error: 'Missing nhi' }, { status: 400 })

  const [patient, drafts, finals] = await Promise.all([
    supabase.from('Patients')
      .select(`"NHI Number","First Name","Last Name","DOB","Sex"`)
      .eq('NHI Number', nhi).limit(1).maybeSingle(),
    supabase.from('DraftAssessments')
      .select(`id,"Title","Date Created","PDF URL",Notes`)
      .eq('NHI Number', nhi).order('Date Created', { ascending: false }),
    supabase.from('Final Assessment')
      .select(`id,"Title","Date Created","PDF URL"`)
      .eq('NHI Number', nhi).order('Date Created', { ascending: false }),
  ])

  const body = {
    patient: patient.data ?? null,
    drafts: drafts.data ?? [],
    finals: finals.data ?? [],
    errors: [patient.error?.message, drafts.error?.message, finals.error?.message].filter(Boolean)
  }

  // Optional: CORS for PAS origin
  const origin = process.env.ALLOWED_ORIGIN ?? '*'
  return NextResponse.json(body, {
    status: body.errors.length ? 206 : 200,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Vary': 'Origin',
    }
  })
}

// Preflight (if PAS uses POST/PUT later)
export async function OPTIONS() {
  const origin = process.env.ALLOWED_ORIGIN ?? '*'
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}