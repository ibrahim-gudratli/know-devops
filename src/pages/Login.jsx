import { useState } from 'react'
import { login } from '../utils/api'
import Signup from './Signup'

function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSignup, setShowSignup] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    setError('')
    setLoading(true)

    try {
      const result = await login(username, password)

      localStorage.setItem('know_token', result.token)
      localStorage.setItem(
        'know_user',
        JSON.stringify(result.user)
      )

      onLogin(result.user)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (showSignup) return <Signup onLogin={onLogin} />

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            k<span className="text-violet-400">N</span>ow
          </h1>

          <p className="mt-2 text-slate-400">Capture curiosity.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Username</label>

            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
              autoComplete="username"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Password</label>

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-violet-500"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-violet-500 px-4 py-3 font-medium transition hover:bg-violet-400 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <p className="mt-4 text-center">
            <button type="button" onClick={() => setShowSignup(true)} className="text-violet-400 underline">
              Create an account
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login