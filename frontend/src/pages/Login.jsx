import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Nav from '../components/Nav'
import DotGrid from '../components/DotGrid'
import { auth, setToken, isLoggedIn } from '../api'

export default function Login() {
  const navigate = useNavigate()

  // If already logged in, go straight to app
  useEffect(() => {
    if (isLoggedIn()) navigate('/app')
  }, [])

  const [form, setForm]     = useState({ email: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const data = await auth.login({ email: form.email, password: form.password })
      setToken(data.access_token)
      navigate('/app')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-white flex flex-col">
      <DotGrid />
      <div className="relative flex flex-col flex-1" style={{ zIndex: 1 }}>
        <Nav />

        <div className="flex-1 flex items-center justify-center px-6 py-20">
          <div
            className="w-full max-w-sm"
            style={{ animation: 'fadeUp 0.5s ease 0.05s forwards' }}
          >
            <div className="text-center mb-8">
              <h1 className="font-display text-[2.2rem] text-ink tracking-tight mb-2">
                Welcome <em className="text-primary not-italic">back</em>
              </h1>
              <p className="text-[14px] text-slate-400">Log in to your AnimathsAI account</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-[13px] rounded-xl px-4 py-3">
                    {error}
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold tracking-widest uppercase text-slate-400">
                    Email
                  </label>
                  <input
                    type="email" name="email"
                    placeholder="you@example.com" autoComplete="email"
                    value={form.email} onChange={handleChange} required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition placeholder:text-slate-300"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold tracking-widest uppercase text-slate-400">
                    Password
                  </label>
                  <input
                    type="password" name="password"
                    placeholder="••••••••" autoComplete="current-password"
                    value={form.password} onChange={handleChange} required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition placeholder:text-slate-300"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white font-bold text-[15px] py-3 rounded-xl hover:bg-primary-600 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
                >
                  {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  {loading ? 'Logging in…' : 'Log In'}
                </button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-3 text-[12px] text-slate-300">or</span>
                </div>
              </div>

              <p className="text-center text-[14px] text-slate-400">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary font-semibold hover:opacity-75 transition-opacity">
                  Sign up →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
