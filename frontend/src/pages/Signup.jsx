import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Nav from '../components/Nav'
import DotGrid from '../components/DotGrid'
import { auth, setToken, isLoggedIn } from '../api'

function strengthLevel(pw) {
  if (!pw)         return 0
  if (pw.length < 5)  return 1
  if (pw.length < 8)  return 2
  if (pw.length < 12) return 3
  return 4
}
const STRENGTH_COLORS = ['', '#ef4444', '#f97316', '#eab308', '#22c55e']
const STRENGTH_LABELS = ['', 'Too short', 'Weak', 'Good', 'Strong']

export default function Signup() {
  const navigate = useNavigate()
  const [form, setForm]       = useState({ username: '', email: '', password: '', confirmPassword: '', terms: false })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { if (isLoggedIn()) navigate('/app') }, [])
  const strength = strengthLevel(form.password)

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return }
    setLoading(true)
    setError('')
    try {
      const data = await auth.signup({ username: form.username, email: form.email, password: form.password })
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
            className="w-full max-w-md"
            style={{ animation: 'fadeUp 0.5s ease 0.05s forwards' }}
          >
            <div className="text-center mb-8">
              <h1 className="font-display text-[2.2rem] text-ink tracking-tight mb-2">
                Create your <em className="text-primary not-italic">account</em>
              </h1>
              <p className="text-[14px] text-slate-400">Start generating math animations for free</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-[13px] rounded-xl px-4 py-3">
                    {error}
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold tracking-widest uppercase text-slate-400">Username</label>
                  <input
                    type="text" name="username" placeholder="mathwiz42"
                    autoComplete="username"
                    value={form.username} onChange={handleChange} required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition placeholder:text-slate-300"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold tracking-widest uppercase text-slate-400">Email</label>
                  <input
                    type="email" name="email" placeholder="you@example.com"
                    autoComplete="email"
                    value={form.email} onChange={handleChange} required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition placeholder:text-slate-300"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold tracking-widest uppercase text-slate-400">Password</label>
                  <input
                    type="password" name="password" placeholder="••••••••"
                    autoComplete="new-password"
                    value={form.password} onChange={handleChange} required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition placeholder:text-slate-300"
                  />
                  <div className="flex gap-1 mt-0.5">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
                        style={{ background: i <= strength ? STRENGTH_COLORS[strength] : '#e2e8f0' }} />
                    ))}
                  </div>
                  {form.password && (
                    <p className="text-[12px]" style={{ color: STRENGTH_COLORS[strength] }}>
                      {STRENGTH_LABELS[strength]}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold tracking-widest uppercase text-slate-400">Confirm password</label>
                  <input
                    type="password" name="confirmPassword" placeholder="••••••••"
                    autoComplete="new-password"
                    value={form.confirmPassword} onChange={handleChange} required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition placeholder:text-slate-300"
                  />
                </div>

                <label className="flex items-start gap-2.5 text-[13px] text-slate-500 cursor-pointer mt-1">
                  <input type="checkbox" name="terms" checked={form.terms} onChange={handleChange} required
                    className="mt-0.5 accent-primary flex-shrink-0" />
                  <span>
                    I agree to the <a href="#" className="text-primary">Terms of Service</a> and <a href="#" className="text-primary">Privacy Policy</a>
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white font-bold text-[15px] py-3 rounded-xl hover:bg-primary-600 disabled:opacity-60 transition-colors flex items-center justify-center gap-2 mt-1"
                >
                  {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  {loading ? 'Creating account…' : 'Create Account'}
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
                Already have an account?{' '}
                <Link to="/login" className="text-primary font-semibold hover:opacity-75 transition-opacity">
                  Log in →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
