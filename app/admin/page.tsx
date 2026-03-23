'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Subscriber {
  id: number
  phone: string
  opted_in: boolean
  opted_out_at: string | null
  created_at: string
  last_message: string | null
  last_direction: 'inbound' | 'outbound' | null
  last_message_at: string | null
  inbound_count: string
}

function timeSince(iso: string) {
  const d = new Date(iso)
  const diff = Date.now() - d.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export default function AdminDashboard() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load() {
    try {
      const res = await fetch('/api/admin/subscribers')
      if (!res.ok) throw new Error('Failed to load')
      const data = await res.json()
      setSubscribers(data.subscribers)
    } catch {
      setError('Failed to load subscribers.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const optedIn = subscribers.filter(s => s.opted_in).length

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-black)', padding: '2rem' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
          borderBottom: 'var(--border-subtle)',
          paddingBottom: '1.5rem',
        }}
      >
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: 'var(--color-white)', letterSpacing: '-0.02em' }}>
            SUBSCRIBERS
          </h1>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-white-dim)', letterSpacing: '0.06em', marginTop: '0.25rem' }}>
            {optedIn} OPTED IN · {subscribers.length} TOTAL
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link
            href="/admin/broadcast"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '0.6rem 1.25rem',
              background: 'var(--color-purple)',
              color: 'var(--color-white)',
            }}
          >
            BROADCAST →
          </Link>
          <button
            onClick={async () => {
              await fetch('/api/admin/auth', { method: 'DELETE' })
              window.location.href = '/admin/login'
            }}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '0.6rem 1.25rem',
              background: 'transparent',
              color: 'var(--color-white-dim)',
              border: 'var(--border-subtle)',
              cursor: 'pointer',
            }}
          >
            LOGOUT
          </button>
        </div>
      </div>

      {loading && (
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--color-white-dim)', letterSpacing: '0.06em' }}>
          LOADING...
        </p>
      )}

      {error && (
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#ff6666' }}>{error}</p>
      )}

      {!loading && !error && subscribers.length === 0 && (
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--color-white-dim)', letterSpacing: '0.06em' }}>
          NO SUBSCRIBERS YET.
        </p>
      )}

      {/* Subscriber list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {subscribers.map((sub, i) => (
          <Link
            key={sub.id}
            href={`/admin/subscribers/${sub.id}`}
            style={{
              display: 'grid',
              gridTemplateColumns: '160px 1fr auto',
              alignItems: 'center',
              gap: '1.5rem',
              padding: '1rem 0',
              borderTop: i === 0 ? 'var(--border-subtle)' : 'none',
              borderBottom: 'var(--border-subtle)',
              textDecoration: 'none',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--color-off-black)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
          >
            <div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--color-white)', letterSpacing: '0.04em' }}>
                {sub.phone}
              </p>
              <span
                style={{
                  display: 'inline-block',
                  marginTop: '0.25rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  padding: '0.15rem 0.4rem',
                  background: sub.opted_in ? 'rgba(123,47,255,0.15)' : 'rgba(255,50,50,0.1)',
                  color: sub.opted_in ? 'var(--color-purple)' : '#ff6666',
                  border: `1px solid ${sub.opted_in ? 'rgba(123,47,255,0.3)' : 'rgba(255,50,50,0.3)'}`,
                }}
              >
                {sub.opted_in ? 'OPTED IN' : 'OPTED OUT'}
              </span>
            </div>

            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.85rem',
                color: 'var(--color-white-dim)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {sub.last_message ?? '—'}
            </p>

            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'rgba(240,240,240,0.3)', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
              {sub.last_message_at ? timeSince(sub.last_message_at) : timeSince(sub.created_at)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
