'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        router.push('/admin')
        router.refresh()
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? 'Authentication failed.')
        setLoading(false)
      }
    } catch {
      setError('Network error.')
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-black)',
        padding: '2rem',
      }}
    >
      <div style={{ width: '100%', maxWidth: '380px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2rem',
              letterSpacing: '-0.03em',
              color: 'var(--color-white)',
              marginBottom: '0.5rem',
            }}
          >
            WOBAR ADMIN
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--color-white-dim)',
              letterSpacing: '0.06em',
            }}
          >
            SMS MANAGEMENT CONSOLE
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            disabled={loading}
            style={{
              background: 'var(--color-off-black)',
              border: error ? '1px solid #ff4444' : 'var(--border-subtle)',
              padding: '0.875rem 1.25rem',
              color: 'var(--color-white)',
              fontFamily: 'var(--font-mono)',
              fontSize: '1rem',
              outline: 'none',
              width: '100%',
            }}
          />

          {error && (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#ff6666', letterSpacing: '0.04em' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            style={{
              background: 'var(--color-purple)',
              color: 'var(--color-white)',
              border: 'none',
              padding: '0.875rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              cursor: loading || !password ? 'not-allowed' : 'pointer',
              opacity: !password ? 0.5 : 1,
            }}
          >
            {loading ? 'AUTHENTICATING...' : 'ENTER →'}
          </button>
        </form>
      </div>
    </div>
  )
}
