import { useEffect, useState } from 'react'

import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  FolderOpen,
} from 'lucide-react'

import { getKnowledge } from '../utils/api'

function Collections() {
  const [entries, setEntries] = useState([])
  const [openCollections, setOpenCollections] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadEntries()
  }, [])

  async function loadEntries() {
    try {
      setError('')

      const data = await getKnowledge()

      setEntries(data)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const groupedCollections = entries.reduce(
    (groups, entry) => {
      const collection = entry.collection?.trim()

      if (!collection) {
        return groups
      }

      if (!groups[collection]) {
        groups[collection] = []
      }

      groups[collection].push(entry)

      return groups
    },
    {}
  )

  const collections = Object.entries(groupedCollections)

  function toggleCollection(name) {
    setOpenCollections({
      ...openCollections,
      [name]: !openCollections[name],
    })
  }

  if (loading) {
    return (
      <div className="py-12 text-center text-slate-500">
        Loading collections...
      </div>
    )
  }

  return (
    <div className="space-y-6">

      <div>
        <h3 className="text-2xl font-semibold">
          Collections
        </h3>

        <p className="mt-1 text-slate-400">
          Browse your knowledge by topic.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {collections.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center">
          <FolderOpen
            size={32}
            className="mx-auto mb-4 text-slate-600"
          />

          <p className="text-slate-400">
            No collections yet.
          </p>

          <p className="mt-1 text-sm text-slate-600">
            Add a collection when saving knowledge
            and it will appear here.
          </p>
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">

        {collections.map(([name, items]) => {
          const isOpen = openCollections[name]

          return (
            <div
              key={name}
              className={`rounded-2xl border bg-slate-900 transition ${
                isOpen
                  ? 'border-violet-500/30'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >

              <button
                onClick={() => toggleCollection(name)}
                className="flex w-full items-center justify-between p-6 text-left"
              >
                <div className="flex items-center gap-4">

                  <div className="rounded-xl bg-violet-500/10 p-3">
                    <FolderOpen
                      size={22}
                      className="text-violet-400"
                    />
                  </div>

                  <div>
                    <h4 className="font-semibold">
                      {name}
                    </h4>

                    <p className="mt-1 text-sm text-slate-500">
                      {items.length}{' '}
                      {items.length === 1
                        ? 'knowledge entry'
                        : 'knowledge entries'}
                    </p>
                  </div>

                </div>

                {isOpen ? (
                  <ChevronUp
                    size={19}
                    className="text-slate-500"
                  />
                ) : (
                  <ChevronDown
                    size={19}
                    className="text-slate-500"
                  />
                )}
              </button>

              {isOpen && (
                <div className="border-t border-slate-800 p-4">

                  <div className="space-y-3">

                    {items.map((entry) => (
                      <div
                        key={entry.id}
                        className="rounded-xl bg-slate-950/60 p-4"
                      >
                        <div className="flex gap-3">

                          <BookOpen
                            size={17}
                            className="mt-1 shrink-0 text-violet-400"
                          />

                          <div>
                            <h5 className="font-medium">
                              {entry.title}
                            </h5>

                            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                              {entry.content}
                            </p>

                            {(entry.tags || []).length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-2">

                                {(entry.tags || []).map((tag) => (
                                  <span
                                    key={tag}
                                    className="rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-400"
                                  >
                                    #{tag}
                                  </span>
                                ))}

                              </div>
                            )}
                          </div>

                        </div>
                      </div>
                    ))}

                  </div>
                </div>
              )}

            </div>
          )
        })}

      </div>

    </div>
  )
}

export default Collections