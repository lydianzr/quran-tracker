import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import AddReading from '../components/AddReading'
import JuzProgress from '../components/JuzProgress'
import CurrentSurah from '../components/CurrentSurah'

function Home() {
  const [readings, setReadings] = useState([])
  const [refresh, setRefresh] = useState(0)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    async function fetchReadings() {
      const { data, error } = await supabase
        .from('readings')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error) setReadings(data)
    }
    fetchReadings()
  }, [refresh])

  const totalPages = readings.length > 0 ? readings[0].page_to : 0
  const juzCompleted = Math.floor(totalPages / 20)

  function calcStreak() {
    if (readings.length === 0) return 0
    const dates = [...new Set(readings.map(r => r.date))].sort().reverse()
    let streak = 1
    for (let i = 0; i < dates.length - 1; i++) {
      const diff = (new Date(dates[i]) - new Date(dates[i + 1])) / (1000 * 60 * 60 * 24)
      if (diff === 1) streak++
      else break
    }
    return streak
  }

  const streak = calcStreak()

  return (
<main className="py-12 fade-in">
      <div className="flex justify-between items-start mb-10">
        <div>
          <p className="text-emerald-400/60 text-sm font-medium tracking-widest uppercase mb-2">Dashboard</p>
          <h2 className="text-3xl font-semibold">Assalamualaikum 👋</h2>
          <p className="text-zinc-500 mt-1 text-sm">May Allah make it easy for you.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="w-11 h-11 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-2xl flex items-center justify-center transition-colors shadow-lg shadow-emerald-900/40">
          +
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="card-glow bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-3">Latest Page</p>
          <h3 className="text-4xl font-semibold text-emerald-400">{totalPages}</h3>
          <p className="text-zinc-600 text-xs mt-2">of 604 pages</p>
        </div>
        <div className="card-glow bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-3">Juz Done</p>
          <h3 className="text-4xl font-semibold text-emerald-400">{juzCompleted}</h3>
          <p className="text-zinc-600 text-xs mt-2">of 30 juz</p>
        </div>
        <div className="card-glow bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-3">Streak</p>
          <h3 className="text-4xl font-semibold text-emerald-400">{streak}</h3>
          <p className="text-zinc-600 text-xs mt-2">{streak === 1 ? 'day' : 'days'} in a row 🔥</p>
        </div>
      </div>

      <CurrentSurah currentPage={totalPages} />
      <JuzProgress currentPage={totalPages} />

      {showForm && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-6"
          onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false) }}>
          <div className="w-full max-w-md">
            <AddReading
              onSave={() => { setRefresh(r => r + 1); setShowForm(false) }}
              lastPage={totalPages}
              onClose={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

    </main>
  )
}

export default Home