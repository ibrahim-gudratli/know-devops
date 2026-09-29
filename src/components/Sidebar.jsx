import navigation from './navigation'

function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-800 bg-slate-950 p-6 md:block">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">
          k<span className="text-violet-400">N</span>ow
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Capture curiosity.
        </p>
      </div>

      <nav className="space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = activePage === item.id

          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition ${
                isActive
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Icon size={18} />
              {item.label}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar