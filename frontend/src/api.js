const BASE = '/api'

// ── Token helpers ────────────────────────────────────────────
export function getToken()        { return localStorage.getItem('token') }
export function setToken(t)       { localStorage.setItem('token', t) }
export function clearToken()      { localStorage.removeItem('token') }
export function isLoggedIn()      { return !!getToken() }

// ── Core fetch wrapper ───────────────────────────────────────
async function request(method, path, body) {
  const headers = { 'Content-Type': 'application/json' }
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(BASE + path, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || `Request failed (${res.status})`)
  }

  return res.json()
}

// ── Auth endpoints ───────────────────────────────────────────
export const auth = {
  signup: ({ username, email, password }) =>
    request('POST', '/auth/signup', { username, email, password }),

  login: ({ email, password }) =>
    request('POST', '/auth/login', { email, password }),

  me: () => request('GET', '/auth/me'),
}

// ── Animation endpoints (backend not yet implemented) ────────
export const animations = {
  create:  (prompt)  => request('POST', '/animations', { prompt }),
  get:     (id)      => request('GET',  `/animations/${id}`),
  history: ()        => request('GET',  '/animations'),
}
