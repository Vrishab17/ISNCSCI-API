// app/page.tsx
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function Landing() {
  return (
    <main className="p-6 sm:p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">ISNCSCI Assessments</h1>
      <p className="text-slate-600 mt-2">
        Enter an NHI to view patient info, past assessments, and drafts.
      </p>

      {/* Simple GET form that goes to /patient?nhi=... */}
      <form action="/patient" method="get" className="mt-8 flex gap-3">
        <input
          name="nhi"
          placeholder="Enter NHI"
          className="border rounded px-3 py-2 w-64"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Open
        </button>
      </form>

      <div className="mt-6 text-sm text-slate-500">
        Or try a test link:&nbsp;
        <Link className="text-blue-600 underline" href="/patient?nhi=1">
          /patient?nhi=1
        </Link>
      </div>
    </main>
  )
}