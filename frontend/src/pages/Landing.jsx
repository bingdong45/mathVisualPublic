import React from 'react'
import { Link } from 'react-router-dom'
import Nav from '../components/Nav'
import DotGrid from '../components/DotGrid'

const STEPS = [
  {
    n: '01',
    title: 'Type your question',
    desc: 'Describe any mathematical concept in plain English — derivatives, integrals, geometry, proofs. No special syntax needed.',
  },
  {
    n: '02',
    title: 'AI generates the animation',
    desc: 'Our model writes a custom Manim animation script tailored to your exact question and renders it into a video.',
  },
  {
    n: '03',
    title: 'Watch and understand',
    desc: 'Your animation plays in the browser. Every video is saved to your history so you can revisit any time.',
  },
]

const FEATURES = [
  {
    icon: '✦',
    title: 'Natural Language',
    desc: 'No LaTeX, no code. Just describe what you want to understand and AnimathsAI handles the rest.',
  },
  {
    icon: '⟳',
    title: 'Instant Rendering',
    desc: 'Jobs run in the background. You get notified the moment your animation is ready to watch.',
  },
  {
    icon: '◫',
    title: 'Personal Library',
    desc: 'Every animation is saved to your account — build a replayable library of visual explanations.',
  },
]

export default function Landing() {
  return (
    <div className="relative bg-white min-h-screen">
      <DotGrid />
      <div className="relative" style={{ zIndex: 1 }}>
        <Nav />

        {/* ── HERO ────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-16 pt-32 pb-20 min-h-screen grid items-center gap-12" style={{ gridTemplateColumns: '5fr 7fr' }}>

          {/* Left: text */}
          <div className="flex flex-col">
            <div
              className="inline-flex items-center gap-2 bg-primary-50 text-primary text-xs font-bold tracking-widest uppercase rounded-full px-4 py-1.5 self-start mb-8"
              style={{ animation: 'fadeUp 0.55s ease 0.05s forwards' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
              AI-Powered Math Animations
            </div>

            <h1
              className="font-display text-[4.8rem] leading-[1.04] tracking-tight text-ink mb-6"
              style={{ animation: 'fadeUp 0.65s ease 0.18s forwards' }}
            >
              Turn math<br />into <em className="text-primary not-italic">motion</em>
            </h1>

            <p
              className="text-slate-500 text-lg leading-relaxed mb-10"
              style={{ animation: 'fadeUp 0.65s ease 0.3s forwards' }}
            >
              Type any mathematical concept in plain language. AnimathsAI generates
              a custom animated video explanation — no coding required.
            </p>

            <div
              className="flex items-center gap-3"
              style={{ animation: 'fadeUp 0.65s ease 0.4s forwards' }}
            >
              <Link
                to="/signup"
                className="bg-primary text-white font-bold text-[15px] px-7 py-3.5 rounded-xl hover:bg-primary-600 transition-colors shadow-sm"
              >
                Start Animating →
              </Link>
              <a
                href="#how-it-works"
                className="border border-slate-200 text-slate-600 font-medium text-[15px] px-7 py-3.5 rounded-xl hover:border-slate-300 hover:text-ink transition-colors"
              >
                See how it works
              </a>
            </div>
          </div>

          {/* Right: real demo video */}
          <div
            className="rounded-2xl overflow-hidden border border-slate-200 shadow-xl shadow-slate-200/60"
            style={{ animation: 'fadeUp 0.75s ease 0.3s forwards' }}
          >
            {/* Card chrome */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-white">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.6)]" />
                <span className="text-[11px] font-bold tracking-widest uppercase text-slate-400">Live example</span>
              </div>
              <span className="text-[11px] font-display italic text-slate-400">
                "Explain Derivatives"
              </span>
            </div>

            {/* Video */}
            <div className="bg-slate-950">
              <video
                src={`${import.meta.env.BASE_URL}demo.mp4`}
                autoPlay
                loop
                muted
                playsInline
                className="w-full block"
              />
            </div>
          </div>

        </section>

        {/* ── WORKFLOW STRIP ───────────────────────────── */}
        <div className="max-w-6xl mx-auto px-16 pb-20">
          <div
            className="grid items-center gap-4"
            style={{ gridTemplateColumns: '1fr auto 1fr auto 1fr' }}
          >
            {/* Step 1: prompt */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="px-4 py-2.5 border-b border-slate-100 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary opacity-80" />
                <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">Your prompt</span>
              </div>
              <div className="p-4">
                <p className="font-display italic text-[13px] text-ink leading-relaxed border-l-2 border-primary pl-3">
                  "Explain the Pythagorean theorem with a visual proof"
                  <span className="cursor-blink" />
                </p>
                <div className="flex justify-end mt-3">
                  <span className="bg-primary text-white text-[11px] font-bold px-3 py-1 rounded-lg">Generate →</span>
                </div>
              </div>
            </div>

            {/* Arrow 1 */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-px h-6 bg-gradient-to-b from-transparent via-slate-200 to-transparent" />
              <span className="text-slate-300 text-lg leading-none">→</span>
              <div className="w-px h-6 bg-gradient-to-b from-transparent via-slate-200 to-transparent" />
            </div>

            {/* Step 2: AI processing */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="px-4 py-2.5 border-b border-slate-100 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">AI Rendering</span>
              </div>
              <div className="p-4 flex flex-col gap-2">
                {[
                  { label: 'Writing Manim code…', done: true },
                  { label: 'Rendering frames…',   done: true },
                  { label: 'Encoding video…',     done: false },
                ].map(s => (
                  <div key={s.label} className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.done ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                    <span className="text-[11px] text-slate-500">{s.label}</span>
                  </div>
                ))}
                <div className="mt-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full w-[72%] bg-primary rounded-full" />
                </div>
              </div>
            </div>

            {/* Arrow 2 */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-px h-6 bg-gradient-to-b from-transparent via-slate-200 to-transparent" />
              <span className="text-slate-300 text-lg leading-none">→</span>
              <div className="w-px h-6 bg-gradient-to-b from-transparent via-slate-200 to-transparent" />
            </div>

            {/* Step 3: ready */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="px-4 py-2.5 border-b border-slate-100 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.6)]" />
                <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">Ready</span>
              </div>
              <div className="flex flex-col items-center gap-2 py-4 px-4 bg-slate-50">
                <div className="w-9 h-9 rounded-full bg-primary-50 border-2 border-primary flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13" className="text-primary ml-0.5">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <p className="text-[11px] text-slate-400 text-center leading-snug">
                  Pythagorean Theorem<br />Visual Proof
                </p>
                <div className="w-full h-0.5 rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full w-[38%] bg-primary rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-slate-100 max-w-5xl mx-auto" />

        {/* ── HOW IT WORKS ─────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-16 py-24" id="how-it-works">
          <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-primary mb-3">Process</p>
          <h2 className="font-display text-5xl text-ink tracking-tight mb-14 max-w-sm">
            Three steps to understanding
          </h2>

          <div className="grid grid-cols-3 gap-px bg-slate-100 rounded-2xl overflow-hidden">
            {STEPS.map((step, i) => (
              <div
                key={step.n}
                className="bg-white p-10 hover:bg-primary-50 transition-colors group"
              >
                <div className="font-display text-5xl text-slate-200 group-hover:text-primary/20 mb-6 tracking-tight transition-colors">
                  {step.n}
                </div>
                <h3 className="text-[17px] font-bold text-ink mb-3">{step.title}</h3>
                <p className="text-[14px] text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-slate-100 max-w-5xl mx-auto" />

        {/* ── FEATURES ─────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-16 py-24" id="features">
          <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-primary mb-3">Features</p>
          <h2 className="font-display text-5xl text-ink tracking-tight mb-14 max-w-sm">
            Built for learning
          </h2>

          <div className="grid grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-white border border-slate-200 rounded-2xl p-8 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary/20 flex items-center justify-center text-[18px] mb-5 group-hover:bg-primary group-hover:text-white transition-all">
                  {f.icon}
                </div>
                <h3 className="text-[16px] font-bold text-ink mb-2">{f.title}</h3>
                <p className="text-[14px] text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA BANNER ───────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-16 pb-24">
          <div className="bg-primary rounded-3xl px-16 py-16 flex items-center justify-between gap-10 relative overflow-hidden">
            {/* Subtle inner glow */}
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-10 w-56 h-56 bg-white/5 rounded-full blur-2xl pointer-events-none" />

            <div className="relative">
              <h2 className="font-display text-4xl text-white tracking-tight mb-2">
                Ready to visualize math?
              </h2>
              <p className="text-white/70 text-[15px]">
                Create your account — it only takes a moment.
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 relative flex-shrink-0">
              <Link
                to="/signup"
                className="bg-white text-primary font-bold text-[15px] px-8 py-3.5 rounded-xl hover:bg-primary-50 transition-colors whitespace-nowrap shadow-sm"
              >
                Create Free Account
              </Link>
              <span className="text-white/50 text-[12px]">No credit card required</span>
            </div>
          </div>
        </section>

        {/* ── FOOTER ───────────────────────────────────── */}
        <footer className="border-t border-slate-100 max-w-6xl mx-auto px-16 py-8 flex items-center justify-between">
          <Link to="/" className="font-display text-[17px] text-slate-400">
            Animaths<span className="text-primary">AI</span>
          </Link>
          <span className="text-[13px] text-slate-400">© 2026 AnimathsAI. All rights reserved.</span>
        </footer>
      </div>
    </div>
  )
}
