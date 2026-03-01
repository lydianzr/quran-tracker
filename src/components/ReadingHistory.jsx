import { useState } from 'react'
import { supabase } from '../lib/supabase'

function ReadingHistory({ readings, onRefresh, onEdit }) {
  const [deletingId, setDeletingId] = useState(null)

  async function handleDelete(id) {
    const confirm = window.confirm('Are you sure you want to delete this reading?')
    if (!confirm) return

    setDeletingId(id)
    await supabase.from('readings').delete().eq('id', id)
    onRefresh()
    setDeletingId(null)
  }

  if (readings.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
        <p className="text-zinc-600 text-sm">No readings yet. Log your first session 📖</p>
      </div>
    )
  }

  return (
    <div>
      <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-4">Reading History</p>
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
                onClick={() => onEdit(r)}
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
    </div>
  )
}

export default ReadingHistory