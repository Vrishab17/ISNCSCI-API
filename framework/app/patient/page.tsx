// app/patient/page.tsx
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"

// Next 15: searchParams is a Promise
type SearchParams = Promise<Record<string, string | string[] | undefined>>

export const dynamic = "force-dynamic"

export default async function PatientPage({
  searchParams,
}: { searchParams: SearchParams }) {
  // ✅ Await searchParams to avoid double-render / double-submit issues
  const params = await searchParams
  const raw = params?.nhi
  const nhi = typeof raw === "string" ? raw.trim() : ""

  // No NHI yet → show tiny helper form that navigates with one click
  if (!nhi) {
    return (
      <main className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Patient</h1>
        <p className="text-gray-600">
          No NHI provided. Pass it as a query param, e.g.{" "}
          <code className="bg-black/5 px-1 py-0.5 rounded">/patient?nhi=ABC1234</code>.
        </p>

        {/* Simple GET form (works w/out JS) */}
        <form
          action="/patient"
          method="get"
          className="mt-6 flex gap-2"
          autoComplete="off" /* helps Safari */
        >
          <input
            name="nhi"
            placeholder="Enter NHI"
            className="border rounded px-3 py-2"
            required
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Open
          </button>
        </form>
      </main>
    )
  }

  // --- Queries ---
  const { data: patients, error: pErr } = await supabase
    .from("Patients")
    .select(`"NHI Number","First Name","Last Name","DOB","Sex"`)
    .eq("NHI Number", nhi)
    .limit(1)

  const patient = patients?.[0]

  const { data: drafts, error: dErr } = await supabase
    .from("DraftAssessments")
    .select(`id,"Title","Date Created","PDF URL",Notes,"NHI Number"`)
    .eq("NHI Number", nhi)
    .order("Date Created", { ascending: false })

  const { data: finals, error: fErr } = await supabase
    .from("Final Assessment")
    .select(`id,"Title","Date Created","PDF URL","NHI Number"`)
    .eq("NHI Number", nhi)
    .order("Date Created", { ascending: false })

  const err = pErr?.message || dErr?.message || fErr?.message

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="text-2xl font-bold">
          {patient ? (
            <>
              {patient["First Name"]} {patient["Last Name"]}
              <span className="text-gray-500 font-normal"> · NHI: {nhi}</span>
            </>
          ) : (
            <>NHI: {nhi}</>
          )}
        </h1>

        {/* Create a new draft for this NHI */}
        <form action="/api/assessments" method="post">
          <input type="hidden" name="nhi" value={nhi} />
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            + New Assessment
          </button>
        </form>
      </div>

      {err && <p className="text-red-600 mt-3">Error: {err}</p>}

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-3">Draft Assessments</h2>
        <div className="grid gap-3">
          {(drafts ?? []).map((d: any) => (
            <div key={d.id} className="rounded border p-3">
              <div className="font-medium">{d["Title"] ?? "Untitled draft"}</div>
              <div className="text-sm text-gray-600">
                Created: {d["Date Created"]} ·{" "}
                <Link className="text-blue-600" href={`/assessments/${d.id}/edit`}>
                  Continue draft
                </Link>
                {d["PDF URL"] && (
                  <>
                    {" "}·{" "}
                    <a className="text-blue-600" href={d["PDF URL"]} target="_blank">
                      PDF
                    </a>
                  </>
                )}
              </div>
              {d.Notes && <p className="text-sm mt-1">{d.Notes}</p>}
            </div>
          ))}
          {(!drafts || drafts.length === 0) && (
            <div className="text-gray-600">No drafts yet.</div>
          )}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-3">Past (Final) Assessments</h2>
        <div className="grid gap-3">
          {(finals ?? []).map((fa: any) => (
            <div key={fa.id} className="rounded border p-3">
              <div className="font-medium">{fa["Title"] ?? "Final assessment"}</div>
              <div className="text-sm text-gray-600">
                Created: {fa["Date Created"]} ·{" "}
                {fa["PDF URL"] ? (
                  <a className="text-blue-600" href={fa["PDF URL"]} target="_blank">
                    PDF
                  </a>
                ) : (
                  "No PDF"
                )}
              </div>
            </div>
          ))}
          {(!finals || finals.length === 0) && (
            <div className="text-gray-600">No final assessments yet.</div>
          )}
        </div>
      </section>
    </main>
  )
}