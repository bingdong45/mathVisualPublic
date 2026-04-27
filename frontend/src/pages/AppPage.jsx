import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DotGrid from '../components/DotGrid'
import { auth, animations, clearToken, isLoggedIn } from '../api'

const PENDING_HINTS = [
  'Spinning up your renderer…',
  'Almost in the queue…',
  'Allocating compute…',
  'Nearly there…',
  'Starting any second now…',
]

const STATUS_META = {
  idle:       { label: 'Ready',       color: '#94a3b8', bg: '#f8fafc' },
  PENDING:    { label: 'Queued',      color: '#ca8a04', bg: '#fefce8' },
  PROCESSING: { label: 'Generating',  color: '#2563eb', bg: '#eff6ff' },
  COMPLETED:  { label: 'Done',        color: '#16a34a', bg: '#f0fdf4' },
  FAILED:     { label: 'Failed',      color: '#dc2626', bg: '#fef2f2' },
}

export default function AppPage() {
  const navigate = useNavigate()
  const [prompt, setPrompt]     = useState('')
  const [status, setStatus]     = useState('idle')
  const [activeId, setActiveId] = useState(null)
  const [videoUrl, setVideoUrl] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const [user, setUser]         = useState(null)
  const [history, setHistory]   = useState([])
  const pollRef                 = useRef(null)
  const [hintIdx, setHintIdx]   = useState(0)

  useEffect(() => {
    if (status !== 'PENDING') return
    const t = setInterval(() => setHintIdx(i => (i + 1) % PENDING_HINTS.length), 2500)
    return () => clearInterval(t)
  }, [status])

  // Auth guard
  useEffect(() => {
    if (!isLoggedIn()) { navigate('/login'); return }
    auth.me()
      .then(setUser)
      .catch(() => { clearToken(); navigate('/login') })
    loadHistory()
  }, [])

  // Cleanup poll on unmount
  useEffect(() => () => clearInterval(pollRef.current), [])

  function loadHistory() {
    animations.history()
      .then(setHistory)
      .catch(() => {})
  }

  function startPolling(id) {
    let attempts = 0
    pollRef.current = setInterval(async () => {
      attempts++
      if (attempts > 60) { // 3 min max
        clearInterval(pollRef.current)
        setStatus('FAILED')
        setErrorMsg('Timed out waiting for video.')
        return
      }
      try {
        const data = await animations.get(id)
        if (data.status === 'COMPLETED') {
          clearInterval(pollRef.current)
          setVideoUrl(data.video_url)
          setStatus('COMPLETED')
          loadHistory()
        } else if (data.status === 'FAILED') {
          clearInterval(pollRef.current)
          setStatus('FAILED')
          setErrorMsg(data.error_message || 'Render failed.')
          loadHistory()
        }
        // PENDING / PROCESSING — keep polling
      } catch (_) {
        // transient error — keep polling
      }
    }, 3000)
  }

  function handleGenerate(e) {
    e.preventDefault()
    if (!prompt.trim()) return
    clearInterval(pollRef.current)
    setVideoUrl(null)
    setErrorMsg(null)
    setStatus('PENDING')

    animations.create(prompt)
      .then(data => {
        setActiveId(data.id)
        startPolling(data.id)
      })
      .catch(err => {
        setStatus('FAILED')
        setErrorMsg(err.message)
      })
  }

  function handleNewAnimation() {
    clearInterval(pollRef.current)
    setPrompt('')
    setStatus('idle')
    setActiveId(null)
    setVideoUrl(null)
    setErrorMsg(null)
  }

  function handleLogout() {
    clearToken()
    navigate('/')
  }

  const meta = STATUS_META[status] ?? STATUS_META['idle']
  const isRunning = status === 'PENDING' || status === 'PROCESSING'

  return (
    <div className="relative flex h-screen bg-white overflow-hidden">
      <DotGrid />

      {/* Sidebar */}
      <aside className="relative w-64 border-r border-slate-100 flex flex-col bg-white/95" style={{ zIndex: 1 }}>
        <div className="px-5 py-4 border-b border-slate-100">
          <Link to="/" className="font-display text-[19px] text-ink">
            Animaths<span className="text-primary">AI</span>
          </Link>
        </div>

        <div className="px-4 pt-4 pb-2">
          <button
            onClick={handleNewAnimation}
            className="w-full bg-primary text-white font-bold text-[13px] py-2.5 rounded-xl hover:bg-primary-600 transition-colors"
          >
            + New Animation
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2">
          <p className="text-[10px] font-bold tracking-widest uppercase text-slate-300 px-2 mb-2">Recent</p>
          {history.length === 0 ? (
            <p className="text-[12px] text-slate-300 px-3 py-2">No animations yet.</p>
          ) : (
            history.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  clearInterval(pollRef.current)
                  setPrompt(item.prompt)
                  setActiveId(item.id)
                  setStatus(item.status)
                  setVideoUrl(item.video_url)
                  setErrorMsg(item.error_message)
                  if (item.status === 'PENDING' || item.status === 'PROCESSING') {
                    startPolling(item.id)
                  }
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-[12px] truncate transition-colors ${
                  activeId === item.id
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                {item.prompt}
              </button>
            ))
          )}
        </div>

        <div className="border-t border-slate-100 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary-50 border-2 border-primary/30 flex items-center justify-center text-[12px] font-bold text-primary flex-shrink-0">
              {user ? user.username[0].toUpperCase() : '…'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-ink leading-tight truncate">
                {user ? user.username : 'Loading…'}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                {user ? user.email : ''}
              </p>
            </div>
            <button
              onClick={handleLogout}
              title="Log out"
              className="text-slate-300 hover:text-red-400 transition-colors flex-shrink-0"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="relative flex-1 flex flex-col overflow-hidden" style={{ zIndex: 1 }}>
        <div className="border-b border-slate-100 px-8 py-4 flex items-center justify-between bg-white/95">
          <div>
            <h1 className="font-display text-2xl text-ink tracking-tight">New Animation</h1>
            <p className="text-[13px] text-slate-400">Describe a math concept in plain language</p>
          </div>
          <div
            className="flex items-center gap-2 text-[13px] font-semibold px-3.5 py-1.5 rounded-full border"
            style={{ color: meta.color, background: meta.bg, borderColor: meta.color + '40' }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: meta.color }} />
            {meta.label}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-5">
          {/* Prompt form */}
          <form
            onSubmit={handleGenerate}
            className="border border-slate-200 rounded-2xl bg-white shadow-sm overflow-hidden focus-within:border-primary/40 transition-all duration-500"
          >
            <textarea
              rows={isRunning || status === 'COMPLETED' ? 2 : 4}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="e.g. Show a visual proof of the Pythagorean theorem using colored squares..."
              className="w-full resize-none outline-none px-6 pt-5 pb-3 font-display italic text-[16px] text-ink leading-relaxed placeholder:text-slate-300 bg-transparent transition-all duration-500"
            />
            <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
              <span className="text-[12px] text-slate-300">{prompt.length} / 500</span>
              <button
                type="submit"
                disabled={!prompt.trim() || isRunning}
                className="flex items-center gap-2 bg-primary text-white font-bold text-[13px] px-5 py-2 rounded-xl hover:bg-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {isRunning ? (
                  <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating</>
                ) : 'Generate Animation →'}
              </button>
            </div>
          </form>

          {/* Result panel */}
          <div
            className="border border-slate-200 rounded-2xl bg-white shadow-sm flex items-center justify-center flex-1 min-h-48 transition-all duration-500"
          >
            {status === 'idle' && (
              <div className="flex flex-col items-center gap-3 p-12 text-center max-w-xs">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-300 mb-2">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" width="28" height="28">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
                <p className="font-display text-[18px] text-slate-400 tracking-tight">Your animation will appear here</p>
                <p className="text-[13px] text-slate-300 leading-relaxed">
                  Type a math concept above and click Generate Animation to get started.
                </p>
              </div>
            )}

            {isRunning && (
              <div className="flex flex-col items-center gap-4 p-12 text-center max-w-sm">
                <div className="w-10 h-10 border-2 border-slate-200 border-t-primary rounded-full animate-spin" />
                <p className="font-display text-[18px] text-ink tracking-tight">
                  {status === 'PENDING' ? PENDING_HINTS[hintIdx] : 'Generating your animation…'}
                </p>
                <p className="text-[13px] text-slate-400 leading-relaxed">
                  {status === 'PENDING'
                    ? 'Picking up your job now — usually starts within a few seconds.'
                    : 'Claude is writing Manim code and rendering your video. This takes 30–60 seconds.'}
                </p>
                <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-700"
                    style={{ width: status === 'PENDING' ? '25%' : '55%' }}
                  />
                </div>
              </div>
            )}

            {status === 'COMPLETED' && videoUrl && (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 gap-4">
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  className="max-h-full max-w-full rounded-xl shadow-md"
                  style={{ maxHeight: '420px' }}
                />
              </div>
            )}

            {status === 'FAILED' && (
              <div className="flex flex-col items-center gap-3 p-12 text-center max-w-sm">
                <div className="w-12 h-12 rounded-full bg-red-50 border-2 border-red-200 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" width="20" height="20">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <p className="font-display text-[17px] text-red-600 tracking-tight">Render failed</p>
                {errorMsg && (
                  <p className="text-[12px] text-slate-400 leading-relaxed font-mono bg-slate-50 rounded-lg px-4 py-3 text-left w-full break-words">
                    {errorMsg}
                  </p>
                )}
                <button
                  onClick={handleGenerate}
                  className="mt-2 text-[13px] font-semibold text-primary hover:underline"
                >
                  Try again →
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
