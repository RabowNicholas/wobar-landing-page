'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface Message {
  id: number
  direction: 'inbound' | 'outbound'
  body: string
  twilio_sid: string | null
  created_at: string
}

interface Subscriber {
  id: number
  phone: string
  opted_in: boolean
  opted_out_at: string | null
  created_at: string
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function SubscriberThread() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [subscriber, setSubscriber] = useState<Subscriber | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  async function load() {
    try {
      const res = await fetch(`/api/admin/messages/${id}`)
      if (res.status === 401) { router.push('/admin/login'); return }
      if (!res.ok) throw new Error()
      const data = await res.json()
      setSubscriber(data.subscriber)
      setMessages(data.messages)
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendReply(e: React.FormEvent) {
    e.preventDefault()
    if (!reply.trim()) return
    setSending(true)
    setSendError('')

    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: reply }),
      })
      if (res.ok) {
        setReply('')
        await load()
      } else {
        const data = await res.json().catch(() => ({}))
        setSendError(data.error ?? 'Send failed.')
      }
    } catch {
      setSendError('Network error.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-black)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '1.5rem 2rem', borderBottom: 'var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Link
          href="/admin"
          style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-white-dim)', letterSpacing: '0.08em', textTransform: 'uppercase' }}
        >
          ← BACK
        </Link>
        {subscriber && (
          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--color-white)', letterSpacing: '0.04em' }}>
              {subscriber.phone}
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: subscriber.opted_in ? 'var(--color-purple)' : '#ff6666', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {subscriber.opted_in ? 'OPTED IN' : 'OPTED OUT'}
            </p>
          </div>
        )}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflow: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '720px', margin: '0 auto', width: '100%' }}>
        {loading && (
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--color-white-dim)' }}>LOADING...</p>
        )}

        {messages.map(msg => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              justifyContent: msg.direction === 'outbound' ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                maxWidth: '70%',
                padding: '0.875rem 1.25rem',
                background: msg.direction === 'outbound' ? 'var(--color-purple)' : 'var(--color-charcoal)',
                borderRadius: msg.direction === 'outbound' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
              }}
            >
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--color-white)', lineHeight: 1.5 }}>
                {msg.body}
              </p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'rgba(240,240,240,0.5)', letterSpacing: '0.04em', marginTop: '0.4rem' }}>
                {formatTime(msg.created_at)}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Reply input */}
      <div style={{ padding: '1.5rem 2rem', borderTop: 'var(--border-subtle)' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          {subscriber && !subscriber.opted_in && (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#ff6666', letterSpacing: '0.06em', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
              ⚠ Subscriber has opted out — cannot send messages
            </p>
          )}
          {sendError && (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#ff6666', marginBottom: '0.5rem' }}>{sendError}</p>
          )}
          <form onSubmit={sendReply} style={{ display: 'flex', gap: '0.75rem' }}>
            <textarea
              value={reply}
              onChange={e => setReply(e.target.value)}
              placeholder="Type a message..."
              disabled={sending || (subscriber ? !subscriber.opted_in : false)}
              rows={2}
              style={{
                flex: 1,
                background: 'var(--color-off-black)',
                border: 'var(--border-subtle)',
                padding: '0.875rem 1.25rem',
                color: 'var(--color-white)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.9rem',
                outline: 'none',
                resize: 'none',
                lineHeight: 1.5,
              }}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  sendReply(e as unknown as React.FormEvent)
                }
              }}
            />
            <button
              type="submit"
              disabled={sending || !reply.trim() || (subscriber ? !subscriber.opted_in : false)}
              style={{
                background: 'var(--color-purple)',
                color: 'var(--color-white)',
                border: 'none',
                padding: '0 1.5rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                opacity: sending || !reply.trim() ? 0.5 : 1,
                alignSelf: 'stretch',
              }}
            >
              {sending ? '...' : 'SEND'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
