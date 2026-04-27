import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Nav() {
  const { pathname } = useLocation()
  const isApp = pathname === '/app'

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="font-display text-xl text-ink tracking-tight">
          Animaths<span className="text-primary">AI</span>
        </Link>

        {/* Center links */}
        {!isApp && (
          <ul className="flex items-center gap-8 list-none">
            <li>
              <a href="/#how-it-works" className="text-sm font-medium text-slate-500 hover:text-ink transition-colors">
                How it works
              </a>
            </li>
            <li>
              <a href="/#features" className="text-sm font-medium text-slate-500 hover:text-ink transition-colors">
                Features
              </a>
            </li>
          </ul>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          {isApp ? (
            <Link to="/" className="text-sm font-medium text-slate-500 hover:text-ink transition-colors px-4 py-2">
              ← Back to home
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-slate-500 hover:text-ink transition-colors px-4 py-2 rounded-lg"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="text-sm font-bold bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  )
}
