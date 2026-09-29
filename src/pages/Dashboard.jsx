import { useEffect, useState } from 'react'

import {
  BookOpen,
  FolderOpen,
  Hash,
  Lightbulb,
  TrendingUp,
} from 'lucide-react'

import StatCard from '../components/StatCard'

import {
  getKnowledge,
  getResearch,
} from '../utils/api'

function Dashboard({ setActivePage }) {
  const [knowledgeEntries, setKnowledgeEntries] = useState([])
  const [researchEntries, setResearchEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadDashboard()
  }, [])

  async function loadDashboard() {
    try {
      setError('')

      const [
        knowledgeData,
        researchData,
      ] = await Promise.all([
        getKnowledge(),
        getResearch(),
      ])

      setKnowledgeEntries(knowledgeData)
      setResearchEntries(researchData)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const weeklyGoal = 7

  const now = new Date()
  const startOfWeek = new Date(now)

  const day = startOfWeek.getDay()
  const daysSinceMonday = day === 0 ? 6 : day - 1

  startOfWeek.setDate(
    startOfWeek.getDate() - daysSinceMonday
  )

  startOfWeek.setHours(0, 0, 0, 0)

  const learnedThisWeek = knowledgeEntries.filter(
    (entry) => {
      if (!entry.created_at) {
        return false
      }

      const createdAt = new Date(entry.created_at)

      return createdAt >= startOfWeek
    }
  ).length

  const goalPercentage = Math.min(
    100,
    Math.round(
      (learnedThisWeek / weeklyGoal) * 100
    )
  )

  const recentKnowledge = knowledgeEntries.slice(0, 3)

  const collections = new Set(
    knowledgeEntries
      .map((entry) => entry.collection?.trim())
      .filter(Boolean)
  )

  const tags = new Set(
    knowledgeEntries.flatMap(
      (entry) => entry.tags || []
    )
  )

  const collectionCount = collections.size
  const tagCount = tags.size

  if (loading) {
    return (
      <div className="py-12 text-center text-slate-500">
        Loading dashboard...
      </div>
    )
  }

  return (
    <div className="space-y-8">

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <section className="grid gap-6 md:grid-cols-3">

        <StatCard
          label="Learned"
          value={knowledgeEntries.length}
          icon={BookOpen}
        />

        <StatCard
          label="Research Later"
          value={researchEntries.length}
          icon={Lightbulb}
          iconClass="text-amber-400"
        />

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-400">
                Weekly Goal
              </p>

              <p className="mt-2 text-3xl font-bold">
                {learnedThisWeek} / {weeklyGoal}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300">
              {goalPercentage}%
            </div>

          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-violet-500 transition-all"
              style={{
                width: `${goalPercentage}%`,
              }}
            />
          </div>

          <p className="mt-3 text-sm text-slate-500">
            {learnedThisWeek >= weeklyGoal
              ? 'Weekly goal completed.'
              : `${weeklyGoal - learnedThisWeek} more ${
                  weeklyGoal - learnedThisWeek === 1
                    ? 'entry'
                    : 'entries'
                } to reach your goal.`}
          </p>
        </div>

      </section>

      <section>
        <div className="mb-4">
          <p className="text-sm font-medium text-violet-400">
            Learning Statistics
          </p>

          <h3 className="mt-1 text-xl font-semibold">
            Your knowledge at a glance
          </h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">
                  Collections
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {collectionCount}
                </p>
              </div>

              <div className="rounded-xl bg-violet-500/10 p-3">
                <FolderOpen
                  size={21}
                  className="text-violet-400"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">
                  Unique Tags
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {tagCount}
                </p>
              </div>

              <div className="rounded-xl bg-slate-800 p-3">
                <Hash
                  size={21}
                  className="text-slate-300"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">
                  Learned This Week
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {learnedThisWeek}
                </p>
              </div>

              <div className="rounded-xl bg-emerald-500/10 p-3">
                <TrendingUp
                  size={21}
                  className="text-emerald-400"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">
                  Research Queue
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {researchEntries.length}
                </p>
              </div>

              <div className="rounded-xl bg-amber-500/10 p-3">
                <Lightbulb
                  size={21}
                  className="text-amber-400"
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <div className="mb-5 flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-400">
                Recent Knowledge
              </p>

              <h3 className="mt-1 text-xl font-semibold">
                What you've learned lately
              </h3>
            </div>

            <button
              onClick={() => setActivePage('knowledge')}
              className="text-sm text-violet-400 hover:text-violet-300"
            >
              View all
            </button>

          </div>

          {recentKnowledge.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-800 p-8 text-center">
              <BookOpen
                size={26}
                className="mx-auto mb-3 text-slate-600"
              />

              <p className="text-slate-500">
                No knowledge added yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">

              {recentKnowledge.map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 transition hover:border-slate-700"
                >
                  <h4 className="font-medium">
                    {entry.title}
                  </h4>

                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                    {entry.content}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">

                    {entry.collection && (
                      <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs text-violet-300">
                        {entry.collection}
                      </span>
                    )}

                    {(entry.tags || [])
                      .slice(0, 2)
                      .map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300"
                        >
                          #{tag}
                        </span>
                      ))}

                  </div>
                </div>
              ))}

            </div>
          )}

        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <p className="text-sm text-slate-400">
            Quick Actions
          </p>

          <h3 className="mt-1 text-xl font-semibold">
            Keep your momentum
          </h3>

          <div className="mt-6 space-y-3">

            <button
              onClick={() => setActivePage('knowledge')}
              className="flex w-full items-center gap-3 rounded-xl bg-violet-500 px-4 py-3 font-medium text-white transition hover:bg-violet-400"
            >
              <BookOpen size={18} />
              Add Knowledge
            </button>

            <button
              onClick={() => setActivePage('research')}
              className="flex w-full items-center gap-3 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 font-medium text-slate-200 transition hover:border-slate-600"
            >
              <Lightbulb size={18} />
              Research Later
            </button>

          </div>

        </div>

      </section>

    </div>
  )
}

export default Dashboard