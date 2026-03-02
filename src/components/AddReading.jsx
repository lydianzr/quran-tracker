import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

function AddReading({ onSave, lastPage, onClose, editRecord }) {
  const today = new Date().toISOString().split('T')[0]
  const now = new Date().toTimeString().slice(0, 5)

  const [date, setDate] = useState(today)
  const [time, setTime] = useState(now)
  const [mode, setMode] = useState('until')
  const [pageUntil, setPageUntil] = useState('')
  const [pageCount, setPageCount] = useState('')
  const [fromPage, setFromPage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (editRecord) {
      setDate(editRecord.date)
      setTime(editRecord.time.slice(0, 5))
      setFromPage((editRecord.page_from - 1).toString())
      setPageUntil(editRecord.page_to.toString())
      setMode('until')
    } else {
      setFromPage(lastPage.toString())
    }
  }, [editRecord, lastPage])

  async function handleSubmit(e) {
    e.preventDefault()

    let page_from = parseInt(fromPage) + 1
    let page_to = mode === 'until'
      ? parseInt(pageUntil)
      : parseInt(fromPage) + parseInt(pageCount)

    if (page_to < page_from) {
      alert('Page cannot be less than your starting page!')
      return
    }

    if (page_to > 604) {
      alert('Page cannot exceed 604!')
      return
    }

    setLoading(true)

    if (editRecord) {
      await supabase.from('readings').update({
        date,
        time,
        page_from,
        page_to,
      }).eq('id', editRecord.id)
    } else {
      const { data: { user } } = await supabase.auth.getUser()
      await supabase.from('readings').insert({
        date,
        time,
        page_from,
        page_to,
        user_id: user.id,
      })
    }

    onSave()
    setPageUntil('')
    setPageCount('')
    setLoading(false)
  }

  const inputClass = "w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-600 transition-colors"
  const labelClass = "text-zinc-500 text-xs font-medium uppercase tracking-wider mb-1.5 block"

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
      <div className="flex justify-between items-center mb-5">
        <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider">
          {editRecord ? 'Edit Reading' : 'Log Reading'}
        </p>
        <button type="button" onClick={onClose} className="text-zinc-600 hover:text-zinc-400 text-xl transition-colors">✕</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className={labelClass}>Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Time</label>
          <input type="time" value={time} onChange={e => setTime(e.target.value)} className={inputClass} />
        </div>
      </div>

      <div className="mb-4">
        <label className={labelClass}>Continuing from page</label>
        <input type="number" min="0" max="603" value={fromPage}
          onChange={e => setFromPage(e.target.value)} className={inputClass} />
      </div>

      <div className="flex gap-2 mb-4">
        <button type="button" onClick={() => setMode('until')}
          className={`flex-1 py-2 rounded-xl text-xs font-medium transition-colors ${mode === 'until' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-600/40' : 'bg-zinc-800 text-zinc-500 border border-zinc-700'}`}>
          Read until page
        </button>
        <button type="button" onClick={() => setMode('count')}
          className={`flex-1 py-2 rounded-xl text-xs font-medium transition-colors ${mode === 'count' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-600/40' : 'bg-zinc-800 text-zinc-500 border border-zinc-700'}`}>
          Read X pages
        </button>
      </div>

      {mode === 'until' ? (
        <div className="mb-5">
          <label className={labelClass}>Read until page</label>
          <input type="number" min={parseInt(fromPage) + 1} max="604" placeholder="e.g. 9" value={pageUntil}
            onChange={e => setPageUntil(e.target.value)} className={inputClass} />
        </div>
      ) : (
        <div className="mb-5">
          <label className={labelClass}>Number of pages read</label>
          <input type="number" min="1" max={604 - parseInt(fromPage)} placeholder="e.g. 4" value={pageCount}
            onChange={e => setPageCount(e.target.value)} className={inputClass} />
        </div>
      )}

      <button type="submit" disabled={loading}
        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-xl text-sm transition-colors">
        {loading ? 'Saving...' : editRecord ? 'Update Reading' : 'Save Reading'}
      </button>
    </form>
  )
}

export default AddReading