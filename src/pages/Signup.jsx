import { useState } from 'react'
import { signup, confirmSignup, resendSignupCode } from '../utils/api'

export default function Signup({ onLogin }) {
  const [stage, setStage] = useState('start') // start | confirm
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleStart(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signup(email, username)
      setStage('confirm')
    } catch (err) {
      setError(err.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleConfirm(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = await confirmSignup(email, code, password, username)
      localStorage.setItem('know_token', result.token)
      localStorage.setItem('know_user', JSON.stringify(result.user))
      if (onLogin) onLogin(result.user)
    } catch (err) {
      setError(err.message || 'Confirmation failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    setError('')
    setLoading(true)
    try {
      await resendSignupCode(email)
    } catch (err) {
      setError(err.message || 'Resend failed')
    } finally {
      setLoading(false)
    }
  }

  if (stage === 'start') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
        <form onSubmit={handleStart} className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8">
          <h2 className="text-2xl font-bold mb-4">Create an account</h2>

          {error && <div className="text-red-400 mb-3">{error}</div>}

          <label className="block text-sm text-slate-300 mb-1">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 mb-4" />

          <label className="block text-sm text-slate-300 mb-1">Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 mb-4" />

          <button className="w-full rounded-xl bg-violet-500 px-4 py-3 text-black font-semibold" disabled={loading}>
            {loading ? 'Sending...' : 'Send confirmation code'}
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <form onSubmit={handleConfirm} className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8">
        <h2 className="text-2xl font-bold mb-4">Confirm your account</h2>

        {error && <div className="text-red-400 mb-3">{error}</div>}

        <label className="block text-sm text-slate-300 mb-1">Confirmation code</label>
        <input value={code} onChange={(e) => setCode(e.target.value)} required className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 mb-4" />

        <label className="block text-sm text-slate-300 mb-1">Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 mb-4" />

        <div className="flex gap-2">
          <button className="flex-1 rounded-xl bg-violet-500 px-4 py-3 text-black font-semibold" disabled={loading}>
            {loading ? 'Confirming...' : 'Confirm and sign in'}
          </button>

          <button type="button" onClick={handleResend} className="rounded-xl border border-slate-700 px-4 py-3">
            Resend
          </button>
        </div>
      </form>
    </div>
  )
}
