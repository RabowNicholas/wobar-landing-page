'use client'

import { useState } from 'react'
import Link from 'next/link'

type BroadcastState = 'idle' | 'confirming' | 'sending' | 'done' | 'error'

interface BroadcastResult {
  sent: number
  failed: number
  total: number
}

export default function BroadcastPage() {
  const [message, setMessage] = useState('')
  const [state, setState] = useState<BroadcastState>('idle')
  const [result, setResult] = useState<BroadcastResult | null>(null)
  const [error, setError] = useState('')

  async function handleSend() {
    setState('sending')
    setError('')

    try {
      const res = await fetch('/api/admin/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      })
      const data = await res.json()
      if (res.ok) {
        setResult(data)
        setState('done')
      } else {
        setError(data.error ?? 'Broadcast failed.')
        setState('error')
      }
    } catch {
      setError('Network error.')
      setState('error')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-black)', padding: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', borderBottom: 'var(--border-subtle)', paddingBottom: '1.5rem' }}>
        <Link href="/admin" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-white-dim)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          ← BACK
        </Link>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: 'var(--color-white)', letterSpacing: '-0.02em' }}>
          BROADCAST
        </h1>
      </div>

      <div style={{ maxWidth: '600px' }}>
        {state === 'done' && result ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ padding: '2rem', border: 'var(--border-purple)', background: 'var(--color-off-black)' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-purple)', marginBottom: '0.5rem' }}>
                ✓ SENT
              </p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--color-white-dim)', letterSpacing: '0.06em' }}>
                {result.sent} sent · {result.failed} failed · {result.total} total
              </p>
            </div>
            <button
              onClick={() => { setState('idle'); setMessage(''); setResult(null) }}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.75rem', background: 'transparent', color: 'var(--color-white-dim)', border: 'var(--border-subtle)', cursor: 'pointer' }}
            >
              NEW BROADCAST
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-white-dim)', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '0.75rem' }}>
                MESSAGE
              </label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                disabled={state !== 'idle' && state !== 'confirming' && state !== 'error'}
                placeholder="Your message to all opted-in subscribers..."
                rows={6}
                style={{
                  width: '100%',
                  background: 'var(--color-off-black)',
                  border: 'var(--border-subtle)',
                  padding: '1rem 1.25rem',
                  color: 'var(--color-white)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem',
                  outline: 'none',
                  resize: 'vertical',
                  lineHeight: 1.6,
                }}
              />
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'rgba(240,240,240,0.3)', letterSpacing: '0.04em', marginTop: '0.5rem' }}>
                {message.length} chars · Twilio segments vary by carrier
              </p>
            </div>

            {error && (
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#ff6666' }}>{error}</p>
            )}

            {state === 'confirming' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ padding: '1rem 1.25rem', background: 'rgba(123,47,255,0.08)', border: 'var(--border-purple)' }}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--color-purple)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    ⚠ CONFIRM BROADCAST
                  </p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--color-white-dim)', marginTop: '0.5rem', lineHeight: 1.6 }}>
                    This will send to all opted-in subscribers. This cannot be undone.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={handleSend}
                    style={{ flex: 1, background: 'var(--color-purple)', color: 'var(--color-white)', border: 'none', padding: '0.875rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}
                  >
                    CONFIRM SEND →
                  </button>
                  <button
                    onClick={() => setState('idle')}
                    style={{ padding: '0.875rem 1.5rem', background: 'transparent', color: 'var(--color-white-dim)', border: 'var(--border-subtle)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setState('confirming')}
                disabled={!message.trim() || state === 'sending'}
                style={{
                  background: 'var(--color-purple)',
                  color: 'var(--color-white)',
                  border: 'none',
                  padding: '0.875rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  cursor: !message.trim() ? 'not-allowed' : 'pointer',
                  opacity: !message.trim() ? 0.5 : 1,
                  width: '100%',
                }}
              >
                {state === 'sending' ? 'SENDING...' : 'BROADCAST TO ALL →'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
