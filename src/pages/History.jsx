import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import AddReading from '../components/AddReading'

function History() {
  const [readings, setReadings] = useState([])
  const [refresh, setRefresh] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [editRecord, setEditRecord] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

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

  async function handleDelete(id) {
    const confirm = window.confirm('Are you sure you want to delete this reading?')
    if (!confirm) return
    setDeletingId(id)
    await supabase.from('readings').delete().eq('id', id)
    setRefresh(r => r + 1)
    setDeletingId(null)
  }

  function handleEdit(record) {
    setEditRecord(record)
    setShowForm(true)
  }

  function handleClose() {
    setShowForm(false)
    setEditRecord(null)
  }

  return (
        <main className="py-12 fade-in">
        <div className="flex justify-between items-start mb-10">
        <div>
          <p className="text-emerald-400/60 text-sm font-medium tracking-widest uppercase mb-2">Records</p>
          <h2 className="text-3xl font-semibold">Reading History</h2>
          <p className="text-zinc-500 mt-1 text-sm">{readings.length} session{readings.length !== 1 ? 's' : ''} recorded</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="w-11 h-11 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-2xl flex items-center justify-center transition-colors shadow-lg shadow-emerald-900/40">
          +
        </button>
      </div>

      {readings.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
          <p className="text-zinc-600 text-sm">No readings yet. Log your first session 📖</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {readings.map(r => (
            <div key={r.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 flex justify-between items-center hover:border-emerald-900/50 transition-colors group">
              <div>
                <p className="font-medium text-sm">Page {r.page_from} → {r.page_to}</p>
                <p className="text-zinc-600 text-xs mt-1">{r.date} · {r.time}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-emerald-400 text-sm font-semibold">+{r.page_to - r.page_from + 1} pages</span>
                <button
                  onClick={() => handleEdit(r)}
                  className="text-zinc-700 hover:text-emerald-400 transition-colors opacity-0 group-hover:opacity-100 text-xs">
                  edit
                </button>
                <button
                  onClick={() => handleDelete(r.id)}
                  disabled={deletingId === r.id}
                  className="text-zinc-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 text-sm">
                  {deletingId === r.id ? '...' : '✕'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-6"
          onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}>
          <div className="w-full max-w-md">
            <AddReading
              onSave={() => { setRefresh(r => r + 1); handleClose() }}
              lastPage={readings.length > 0 ? readings[0].page_to : 0}
              onClose={handleClose}
              editRecord={editRecord}
            />
          </div>
        </div>
      )}
    </main>
  )
}

export default History