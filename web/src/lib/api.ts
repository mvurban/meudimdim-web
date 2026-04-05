import { getSession, signOut } from "next-auth/react"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"

let _cachedToken: string | undefined = undefined
let _tokenExpiry = 0
let _sessionPromise: Promise<string | undefined> | null = null
const TOKEN_TTL_MS = 5 * 60 * 1000 // 5 minutos

async function getToken(): Promise<string | undefined> {
  if (_cachedToken && Date.now() < _tokenExpiry) return _cachedToken

  if (!_sessionPromise) {
    _sessionPromise = getSession()
      .then(s => {
        _cachedToken = s?.idToken
        _tokenExpiry = Date.now() + TOKEN_TTL_MS
        return _cachedToken
      })
      .finally(() => { _sessionPromise = null })
  }
  return _sessionPromise
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getToken()
  const hasBody = options.body !== undefined

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(hasBody ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (!res.ok) {
    if (res.status === 401) {
      // Sessão expirada — faz signOut para limpar o cookie e redireciona para login
      if (typeof window !== 'undefined') {
        signOut({ callbackUrl: '/' })
      }
      throw new Error('Unauthorized')
    }
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? `API error ${res.status}`)
  }

  if (res.status === 204) return undefined as T
  return res.json()
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
}
