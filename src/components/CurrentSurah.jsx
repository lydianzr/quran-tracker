import { getSurahByPage } from '../lib/quranData'

function CurrentSurah({ currentPage }) {
  const surah = getSurahByPage(currentPage)

  if (!surah) return null

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-6">
      <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-4">Currently Reading</p>
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-white">{surah.name}</h3>
          <p className="text-zinc-500 text-xs mt-1">Surah {surah.number} · {surah.ayahs} ayahs · starts pg {surah.startPage}</p>
        </div>
        <p className="arabic text-3xl text-emerald-300/80">{surah.arabic}</p>
      </div>
    </div>
  )
}

export default CurrentSurah
