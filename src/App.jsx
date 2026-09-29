import { useState } from 'react'

import Sidebar from './components/Sidebar'
import navigation from './components/navigation'
import Dashboard from './pages/Dashboard'
import Knowledge from './pages/Knowledge'
import ResearchLater from './pages/ResearchLater'
import Collections from './pages/Collections'
import Login from './pages/Login'

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('know_user')
    const token = localStorage.getItem('know_token')

    if (!savedUser || !token) {
      return null
    }

    return JSON.parse(savedUser)
  })

  const [activePage, setActivePage] = useState('dashboard')

  if (!user) {
    return <Login onLogin={setUser} />
  }

  const pageContent = {
    dashboard: {
      title: 'Keep building what you know.',
      description:
        'Capture what you learn, save what you want to research, and grow your personal knowledge base.',
    },
    knowledge: {
      title: 'Your knowledge.',
      description:
        'Everything you have learned and decided to keep.',
    },
    research: {
      title: 'Research later.',
      description:
        'Ideas and topics waiting for you to explore them.',
    },
    collections: {
      title: 'Your collections.',
      description:
        'Organize related knowledge into meaningful groups.',
    },
  }

  const currentPage = pageContent[activePage]

  function logout() {
    localStorage.removeItem('know_token')
    localStorage.removeItem('know_user')
    setUser(null)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="border-b border-slate-800 bg-slate-950 md:hidden">
        <div className="flex items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              k<span className="text-violet-400">N</span>ow
            </h1>

            <p className="text-xs text-slate-500">
              Capture curiosity.
            </p>
          </div>

          <button
            onClick={logout}
            className="text-sm text-slate-400 hover:text-white"
          >
            Sign out
          </button>
        </div>

        <nav className="flex overflow-x-auto border-t border-slate-900 px-2">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = activePage === item.id

            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`flex min-w-fit flex-1 flex-col items-center gap-1 border-b-2 px-4 py-3 text-xs transition ${
                  isActive
                    ? 'border-violet-500 text-white'
                    : 'border-transparent text-slate-500'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      <div className="flex min-h-screen">
        <Sidebar
          activePage={activePage}
          setActivePage={setActivePage}
        />

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 md:p-10">
          <div className="mx-auto max-w-6xl">
            <div className="mb-6 hidden justify-end md:flex">
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-500">
                  Welcome, {user.username}
                </span>

                <button
                  onClick={logout}
                  className="text-sm text-slate-400 hover:text-white"
                >
                  Sign out
                </button>
              </div>
            </div>

            <header className="mb-8 md:mb-10">
              <p className="text-sm font-medium text-violet-400">
                {
                  navigation.find(
                    (item) => item.id === activePage
                  )?.label
                }
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                {currentPage.title}
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                {currentPage.description}
              </p>
            </header>

            {activePage === 'dashboard' && (
              <Dashboard setActivePage={setActivePage} />
            )}

            {activePage === 'knowledge' && <Knowledge />}

            {activePage === 'research' && <ResearchLater />}

            {activePage === 'collections' && <Collections />}
          </div>
        </main>
      </div>
    </div>
  )
}

export default App