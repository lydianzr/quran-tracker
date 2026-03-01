import { supabase } from '../lib/supabase'

function Navbar({ session, page, setPage }) {
  async function handleLogout() {
    await supabase.auth.signOut()
  }

  return (
    <nav className="border-b border-emerald-900/30">
      <div className="max-w-3xl mx-auto px-6">
        <div className="flex items-center justify-between py-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-sm">
              ☾
            </div>
            <h1 className="text-base font-semibold tracking-wide text-emerald-400">Quran Tracker</h1>
          </div>
          <div className="flex items-center gap-4">
            {session && (
<button onClick={handleLogout}
  className="text-zinc-400 hover:text-red-400 text-sm border border-zinc-700 hover:border-red-400/50 px-3 py-1.5 rounded-lg transition-colors">
  Sign out
</button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6">
          <button
            onClick={() => setPage('home')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${page === 'home' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>
            Dashboard
          </button>
          <button
            onClick={() => setPage('history')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${page === 'history' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>
            History
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar