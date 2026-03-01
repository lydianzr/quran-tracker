import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import History from './pages/History'
import Auth from './pages/Auth'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState('home')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-zinc-600 text-sm">Loading...</p>
    </div>
  )

  if (!session) return <Auth />

  return (
    <div>
      <Navbar session={session} page={page} setPage={setPage} />
      {page === 'home' ? <Home /> : <History />}
    </div>
  )
}

export default App