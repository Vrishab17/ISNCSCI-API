import { supabase } from '../lib/supabaseClient'

export default async function Home() {
  const { data, error } = await supabase
  
    .from('Patients')
    .select(`"NHI Number","First Name","Middles Names","Last Name","DOB","Sex"`)
    //.select('*')
    .order('Date Created', { ascending: false })
    .limit(20)

    // FOR DEBUG PURPOSES
    
    /*const firstRes = await supabase
  .from('Patients')
  .select('*')
  .limit(1);
console.log('patients:', data, 'error:', error)
console.log('First row:', firstRes.data, firstRes.error);*/
    

  if (error) {
    return (
      <main className="p-6">
        <h1 className="text-xl font-bold mb-4">Patients</h1>
        <div className="text-red-600">Error: {error.message}</div>
      </main>
    )
  }

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold mb-4">Patients</h1>

      <div className="grid gap-3">
        {(data ?? []).map((p, i) => (
          <div key={i} className="border rounded p-3">
            <div className="font-medium">
              {p['First Name']} {p['Middle Names']} {p['Last Name']}
            </div>
            <div className="text-sm text-gray-600">
              NHI: {p['NHI Number']} · DOB: {p['DOB']} · Sex: {p['Sex']}
            </div>
          </div>
        ))}

        {(!data || data.length === 0) && (
          <div className="text-gray-600">No patients found.</div>
        )}
      </div>
    </main>
  )
}