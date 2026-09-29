import { useEffect, useState } from 'react'

import {
  ArrowRight,
  Lightbulb,
  Pencil,
  Plus,
  Trash2,
  X,
} from 'lucide-react'

import {
  getResearch,
  createResearch,
  updateResearch,
  deleteResearch,
  completeResearch as completeResearchApi,
} from '../utils/api'

function ResearchLater() {
  const [showForm, setShowForm] = useState(false)
  const [completingEntry, setCompletingEntry] = useState(null)
  const [editingEntry, setEditingEntry] = useState(null)

  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    title: '',
    notes: '',
    tags: '',
  })

  const [editForm, setEditForm] = useState({
    title: '',
    notes: '',
    tags: '',
  })

  const [completionForm, setCompletionForm] = useState({
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
      const data = await getResearch()
      setEntries(data)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  function handleChange(event) {
    const { name, value } = event.target

    setForm({
      ...form,
      [name]: value,
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!form.title.trim()) {
      return
    }

    try {
      setError('')

      const newEntry = await createResearch({
        title: form.title.trim(),
        notes: form.notes.trim(),
        tags: form.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
      })

      setEntries((currentEntries) => [newEntry, ...currentEntries])

      setForm({
        title: '',
        notes: '',
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
      notes: entry.notes || '',
      tags: (entry.tags || []).join(', '),
    })

    setCompletingEntry(null)
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

    if (!editForm.title.trim()) {
      return
    }

    try {
      setError('')

      const updatedEntry = await updateResearch(editingEntry.id, {
        title: editForm.title.trim(),
        notes: editForm.notes.trim(),
        tags: editForm.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
      })

      setEntries((currentEntries) =>
        currentEntries.map((entry) =>
          entry.id === updatedEntry.id ? updatedEntry : entry
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
      await deleteResearch(id)

      setEntries((currentEntries) =>
        currentEntries.filter((entry) => entry.id !== id)
      )

      if (editingEntry?.id === id) setEditingEntry(null)
      if (completingEntry?.id === id) setCompletingEntry(null)
    } catch (error) {
      setError(error.message)
    }
  }

  function startCompletion(entry) {
    setCompletingEntry(entry)

    setCompletionForm({
      title: entry.title,
      content: entry.notes || '',
      collection: '',
      tags: (entry.tags || []).join(', '),
    })

    setEditingEntry(null)
    setShowForm(false)
  }

  function handleCompletionChange(event) {
    const { name, value } = event.target

    setCompletionForm({
      ...completionForm,
      [name]: value,
    })
  }

async function completeResearch(event) {
  event.preventDefault()

  if (
    !completionForm.title.trim() ||
    !completionForm.content.trim()
  ) {
    return
  }

  try {
    setError('')

    await completeResearchApi(
      completingEntry.id,
      {
        title: completionForm.title.trim(),
        content: completionForm.content.trim(),
        collection: completionForm.collection.trim(),
        tags: completionForm.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
      }
    )

    setEntries((currentEntries) =>
      currentEntries.filter(
        (entry) => entry.id !== completingEntry.id
      )
    )

    setCompletingEntry(null)

    setCompletionForm({
      title: '',
      content: '',
      collection: '',
      tags: '',
    })
  } catch (error) {
    setError(error.message)
  }
}

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold">
            Research Later
          </h3>

          <p className="mt-1 text-slate-400">
            Keep track of ideas you want to explore.
          </p>
        </div>

        <button
          onClick={() => {
            setShowForm(true)
            setEditingEntry(null)
            setCompletingEntry(null)
          }}
          className="flex items-center gap-2 rounded-xl bg-violet-500 px-4 py-3 font-medium transition hover:bg-violet-400"
        >
          <Plus size={18} />
          Add Topic
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
        >
          <div className="mb-6 flex items-center justify-between">
            <h4 className="text-xl font-semibold">
              Add research topic
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
                Topic
              </label>

              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="e.g. Embedded Systems"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                What do you want to investigate?
              </label>

              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows="4"
                placeholder="Questions, ideas, or things you want to understand..."
                className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-violet-500"
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
                placeholder="hardware, programming, electronics"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-violet-500"
              />
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
                Save Topic
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
                Edit Research
              </p>

              <h4 className="mt-1 text-xl font-semibold">
                Update this research topic
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
                Topic
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
                Research notes
              </label>

              <textarea
                name="notes"
                value={editForm.notes}
                onChange={handleEditChange}
                rows="4"
                className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-violet-500"
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

      {completingEntry && (
        <form
          onSubmit={completeResearch}
          className="rounded-2xl border border-violet-500/30 bg-slate-900 p-6"
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-violet-400">
                Complete Research
              </p>

              <h4 className="mt-1 text-xl font-semibold">
                Turn this research into knowledge
              </h4>
            </div>

            <button
              type="button"
              onClick={() => setCompletingEntry(null)}
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
                value={completionForm.title}
                onChange={handleCompletionChange}
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
                value={completionForm.content}
                onChange={handleCompletionChange}
                required
                rows="6"
                placeholder="Write what you learned after researching this topic..."
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
                  value={completionForm.collection}
                  onChange={handleCompletionChange}
                  placeholder="e.g. Computer Science"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Tags
                </label>

                <input
                  name="tags"
                  value={completionForm.tags}
                  onChange={handleCompletionChange}
                  placeholder="computing, hardware"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-violet-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setCompletingEntry(null)}
                className="rounded-xl border border-slate-700 px-4 py-3 text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-violet-500 px-5 py-3 font-medium transition hover:bg-violet-400"
              >
                Save as Knowledge
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </form>
      )}

      {loading && (
        <div className="py-12 text-center text-slate-500">
          Loading research...
        </div>
      )}

      {!loading &&
        entries.length === 0 &&
        !showForm &&
        !editingEntry &&
        !completingEntry && (
          <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center">
            <Lightbulb
              size={30}
              className="mx-auto mb-4 text-slate-600"
            />

            <p className="text-slate-400">
              Nothing waiting for research.
            </p>
          </div>
        )}

      <div className="grid gap-4">
        {entries.map((entry) => (
          <article
            key={entry.id}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
          >
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-amber-500/10 p-3">
                <Lightbulb
                  size={20}
                  className="text-amber-400"
                />
              </div>

              <div className="flex-1">
                <h4 className="text-xl font-semibold">
                  {entry.title}
                </h4>

                {entry.notes && (
                  <p className="mt-2 text-slate-400">
                    {entry.notes}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  {(entry.tags || []).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    onClick={() => startCompletion(entry)}
                    className="flex items-center gap-2 rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-300 transition hover:bg-violet-500/20"
                  >
                    Complete Research
                    <ArrowRight size={16} />
                  </button>

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
              </div>
            </div>
          </article>
        ))}
      </div>

    </div>
  )
}

export default ResearchLater