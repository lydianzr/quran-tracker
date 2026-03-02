function JuzProgress({ currentPage }) {
  const juzBoundaries = [
    20, 41, 61, 81, 101, 121, 141, 161, 181, 201,
    221, 241, 261, 281, 301, 321, 341, 361, 381, 401,
    421, 441, 461, 481, 501, 521, 541, 561, 581, 604
  ]

  const currentJuz = juzBoundaries.findIndex(b => currentPage <= b) + 1
  const prevBoundary = currentJuz === 1 ? 0 : juzBoundaries[currentJuz - 2]
  const nextBoundary = juzBoundaries[currentJuz - 1]
  const progress = currentPage === 0 ? 0 : Math.round(((currentPage - prevBoundary) / (nextBoundary - prevBoundary)) * 100)

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-6">
      <div className="flex justify-between items-center mb-4">
        <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Juz Progress</p>
        <span className="text-emerald-400 text-sm font-medium">Juz {currentJuz} / 30</span>
      </div>

      <div className="w-full bg-zinc-800 rounded-full h-2 mb-3">
        <div
          className="progress-shimmer h-2 rounded-full transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex justify-between text-xs text-zinc-600">
        <span>pg {prevBoundary + 1}</span>
        <span className="text-emerald-500/70">{progress}% through this juz</span>
        <span>pg {nextBoundary}</span>
      </div>
    </div>
  )
}

export default JuzProgress