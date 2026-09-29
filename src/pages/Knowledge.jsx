import { useEffect, useMemo, useState } from 'react'

import {
  BookOpen,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react'

import {
  getKnowledge,
  createKnowledge,
  updateKnowledge,
  deleteKnowledge,
} from '../utils/api'

function Knowledge() {
  const [showForm, setShowForm] = useState(false)
  const [editingEntry, setEditingEntry] = useState(null)

  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [searchQuery, setSearchQuery] = useState('')
  const [collectionFilter, setCollectionFilter] = useState('all')

  const [form, setForm] = useState({
    title: '',
    content: '',
    collection: '',
    tags: '',
  })

  const [editForm, setEditForm] = useState({
    title: '',
    content: '',
    collection: '',
    tags: '',
  })

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

  const collections = useMemo(() => {
    return [
      ...new Set(
        entries
          .map((entry) => entry.collection?.trim())
          .filter(Boolean)
      ),
    ].sort()
  }, [entries])

  const filteredEntries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return entries.filter((entry) => {
      const matchesCollection =
        collectionFilter === 'all' ||
        entry.collection === collectionFilter

      const searchableText = [
        entry.title,
        entry.content,
        entry.collection,
        ...(entry.tags || []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      const matchesSearch =
        !query || searchableText.includes(query)

      return matchesCollection && matchesSearch
    })
  }, [entries, searchQuery, collectionFilter])

  function handleChange(event) {
    const { name, value } = event.target

    setForm({
      ...form,
      [name]: value,
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!form.title.trim() || !form.content.trim()) {
      return
    }

    try {
      setError('')

      const newEntry = await createKnowledge({
        title: form.title.trim(),
        content: form.content.trim(),
        collection: form.collection.trim(),
        tags: form.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
      })

      setEntries((currentEntries) => [
        newEntry,
        ...currentEntries,
      ])

      setForm({
        title: '',
        content: '',
        collection: '',
        tags: '',
      })

      setShowForm(false)
    } catch (error) {
      setError(error.message)
    }
  }

  function startEditing(entry) {
    setEditingEntry(entry)

    setEditForm({
      title: entry.title,
      content: entry.content || '',
      collection: entry.collection || '',
      tags: (entry.tags || []).join(', '),
    })

    setShowForm(false)
  }

  function handleEditChange(event) {
    const { name, value } = event.target

    setEditForm({
      ...editForm,
      [name]: value,
    })
  }

  async function saveEdit(event) {
    event.preventDefault()

    if (
      !editForm.title.trim() ||
      !editForm.content.trim()
    ) {
      return
    }

    try {
      setError('')

      const updatedEntry = await updateKnowledge(
        editingEntry.id,
        {
          title: editForm.title.trim(),
          content: editForm.content.trim(),
          collection: editForm.collection.trim(),
          tags: editForm.tags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean),
        }
      )

      setEntries((currentEntries) =>
        currentEntries.map((entry) =>
          entry.id === updatedEntry.id
            ? updatedEntry
            : entry
        )
      )

      setEditingEntry(null)
    } catch (error) {
      setError(error.message)
    }
  }

  async function deleteEntry(id) {
    try {
      setError('')

      await deleteKnowledge(id)

      setEntries((currentEntries) =>
        currentEntries.filter((entry) => entry.id !== id)
      )

      if (editingEntry?.id === id) {
        setEditingEntry(null)
      }
    } catch (error) {
      setError(error.message)
    }
  }

  function clearFilters() {
    setSearchQuery('')
    setCollectionFilter('all')
  }

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    collectionFilter !== 'all'

  return (
    <div className="space-y-6">

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-semibold">
            Knowledge Library
          </h3>

          <p className="mt-1 text-slate-400">
            Save, search, and organize what you learn.
          </p>
        </div>

        <button
          onClick={() => {
            setShowForm(true)
            setEditingEntry(null)
          }}
          className="flex items-center gap-2 rounded-xl bg-violet-500 px-4 py-3 font-medium transition hover:bg-violet-400"
        >
          <Plus size={18} />
          Add Knowledge
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <div className="flex flex-col gap-3 md:flex-row">

          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              type="text"
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(event.target.value)
              }
              placeholder="Search knowledge, tags, or collections..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 outline-none transition focus:border-violet-500"
            />
          </div>

          <select
            value={collectionFilter}
            onChange={(event) =>
              setCollectionFilter(event.target.value)
            }
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-300 outline-none transition focus:border-violet-500"
          >
            <option value="all">
              All collections
            </option>

            {collections.map((collection) => (
              <option
                key={collection}
                value={collection}
              >
                {collection}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="rounded-xl border border-slate-700 px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-800"
            >
              Clear
            </button>
          )}

        </div>

        <p className="mt-3 text-sm text-slate-500">
          Showing {filteredEntries.length} of {entries.length}{' '}
          {entries.length === 1 ? 'entry' : 'entries'}
        </p>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
        >
          <div className="mb-6 flex items-center justify-between">
            <h4 className="text-xl font-semibold">
              Add new knowledge
            </h4>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-5">

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Title
              </label>

              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="e.g. Why gravity affects time"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                What did you learn?
              </label>

              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                required
                rows="6"
                placeholder="Write what you learned in your own words..."
                className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-violet-500"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Collection
                </label>

                <input
                  name="collection"
                  value={form.collection}
                  onChange={handleChange}
                  placeholder="e.g. Physics & Universe"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Tags
                </label>

                <input
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  placeholder="physics, relativity, time"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-violet-500"
                />
              </div>

            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-xl border border-slate-700 px-4 py-3 text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-xl bg-violet-500 px-5 py-3 font-medium transition hover:bg-violet-400"
              >
                Save Knowledge
              </button>
            </div>

          </div>
        </form>
      )}

      {editingEntry && (
        <form
          onSubmit={saveEdit}
          className="rounded-2xl border border-slate-700 bg-slate-900 p-6"
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-violet-400">
                Edit Knowledge
              </p>

              <h4 className="mt-1 text-xl font-semibold">
                Update what you learned
              </h4>
            </div>

            <button
              type="button"
              onClick={() => setEditingEntry(null)}
              className="text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-5">

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Title
              </label>

              <input
                name="title"
                value={editForm.title}
                onChange={handleEditChange}
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                What did you learn?
              </label>

              <textarea
                name="content"
                value={editForm.content}
                onChange={handleEditChange}
                required
                rows="6"
                className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-violet-500"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Collection
                </label>

                <input
                  name="collection"
                  value={editForm.collection}
                  onChange={handleEditChange}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Tags
                </label>

                <input
                  name="tags"
                  value={editForm.tags}
                  onChange={handleEditChange}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-violet-500"
                />
              </div>

            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingEntry(null)}
                className="rounded-xl border border-slate-700 px-4 py-3 text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-xl bg-violet-500 px-5 py-3 font-medium transition hover:bg-violet-400"
              >
                Save Changes
              </button>
            </div>

          </div>
        </form>
      )}

      {loading && (
        <div className="py-12 text-center text-slate-500">
          Loading knowledge...
        </div>
      )}

      {!loading &&
        entries.length === 0 &&
        !showForm &&
        !editingEntry && (
          <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center">
            <BookOpen
              size={30}
              className="mx-auto mb-4 text-slate-600"
            />

            <p className="text-slate-400">
              Nothing here yet.
            </p>

            <p className="mt-1 text-sm text-slate-600">
              Add something you've learned today.
            </p>
          </div>
        )}

      {!loading &&
        entries.length > 0 &&
        filteredEntries.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-800 p-10 text-center">
            <Search
              size={28}
              className="mx-auto mb-4 text-slate-600"
            />

            <p className="text-slate-400">
              No matching knowledge found.
            </p>

            <button
              onClick={clearFilters}
              className="mt-4 text-sm font-medium text-violet-400 hover:text-violet-300"
            >
              Clear search and filters
            </button>
          </div>
        )}

      <div className="grid gap-4">
        {filteredEntries.map((entry) => (
          <article
            key={entry.id}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
          >
            <h4 className="text-xl font-semibold">
              {entry.title}
            </h4>

            <p className="mt-3 leading-7 text-slate-400">
              {entry.content}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">

              {entry.collection && (
                <button
                  onClick={() =>
                    setCollectionFilter(entry.collection)
                  }
                  className="rounded-full bg-violet-500/10 px-3 py-1 text-xs text-violet-300 transition hover:bg-violet-500/20"
                >
                  {entry.collection}
                </button>
              )}

              {(entry.tags || []).map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearchQuery(tag)}
                  className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300 transition hover:bg-slate-700"
                >
                  #{tag}
                </button>
              ))}

            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => startEditing(entry)}
                className="flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800"
              >
                <Pencil size={15} />
                Edit
              </button>

              <button
                onClick={() => deleteEntry(entry.id)}
                className="flex items-center gap-2 rounded-xl border border-red-500/20 px-4 py-2 text-sm text-red-400 transition hover:bg-red-500/10"
              >
                <Trash2 size={15} />
                Delete
              </button>
            </div>

          </article>
        ))}
      </div>

    </div>
  )
}

export default Knowledge