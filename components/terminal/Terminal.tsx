'use client'

import { useEffect, useRef, useState, FormEvent } from 'react'
import {
  PROMPT_GLYPH, INTRO, MENU, UNKNOWN, DEFLECT_BANK,
  LISTEN_PROMPT, LISTEN_INVALID, openingLine, PLATFORMS,
  PASSAGE_MISSING, BACK_WORD, BACK_LINE,
} from './daemon'
import { PASSAGES, LORE } from './content'

// NOTE: the `mirror` command + SMS crossing are disabled until the texting-list
// feature is finished. The mirror copy still lives in daemon.ts; re-add the case,
// the mirror Mode, and the phone-submit flow when ready.
type Mode = 'command' | 'listen'
type Block = { id: number; kind: 'daemon' | 'user'; text: string }

const INTRO_TEXT = INTRO.join('\n')
const TYPE_MS = 18

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function Terminal() {
  const [blocks, setBlocks] = useState<Block[]>([])
  const [reveal, setReveal] = useState(0) // chars of intro shown
  const [showIntro, setShowIntro] = useState(true)
  const [mode, setMode] = useState<Mode>('command')
  const [value, setValue] = useState('')
  const [typingId, setTypingId] = useState<number | null>(null) // daemon block being typed
  const [typed, setTyped] = useState(0) // chars revealed of that block
  const [kbInset, setKbInset] = useState(0) // keyboard height (px) when open

  const inputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const idRef = useRef(0)

  const introDone = reveal >= INTRO_TEXT.length

  // Typewriter the intro (instant if reduced motion).
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) { setReveal(INTRO_TEXT.length); return }
    const t = setInterval(() => {
      setReveal((r) => {
        if (r >= INTRO_TEXT.length) { clearInterval(t); return r }
        return r + 1
      })
    }, TYPE_MS)
    return () => clearInterval(t)
  }, [])

  // Focus input once the intro finishes (avoid popping the mobile keyboard early).
  useEffect(() => {
    if (introDone) inputRef.current?.focus()
  }, [introDone])

  // Type out the current daemon block, char by char.
  useEffect(() => {
    if (typingId == null) return
    const block = blocks.find((b) => b.id === typingId)
    if (!block || typed >= block.text.length) { setTypingId(null); return }
    const t = setTimeout(() => setTyped((c) => c + 1), TYPE_MS)
    return () => clearTimeout(t)
  }, [typingId, typed, blocks])

  // Keep the newest line + prompt pinned to the bottom. When the keyboard is up,
  // scroll the whole document down so the extra bottom padding lifts the prompt
  // clear of the keyboard; otherwise just track the newest line.
  function scrollToBottom() {
    requestAnimationFrame(() => {
      const vv = window.visualViewport
      const kb = vv ? Math.max(0, window.innerHeight - vv.height - vv.offsetTop) : 0
      if (kb > 80) {
        window.scrollTo({ top: document.documentElement.scrollHeight })
      } else {
        bottomRef.current?.scrollIntoView({ block: 'end' })
      }
    })
  }

  useEffect(() => {
    scrollToBottom()
  }, [blocks, reveal, typed, kbInset])

  // Track keyboard height from the visual viewport (open/close resizes it).
  useEffect(() => {
    const vv = window.visualViewport
    if (!vv) return
    const onResize = () => {
      setKbInset(Math.max(0, window.innerHeight - vv.height - vv.offsetTop))
    }
    vv.addEventListener('resize', onResize)
    vv.addEventListener('scroll', onResize)
    return () => {
      vv.removeEventListener('resize', onResize)
      vv.removeEventListener('scroll', onResize)
    }
  }, [])

  function push(kind: Block['kind'], text: string) {
    const id = ++idRef.current
    setBlocks((b) => [...b, { id, kind, text }])
    return id
  }

  function daemon(lines: string[]) {
    const id = push('daemon', lines.join('\n'))
    if (!prefersReduced()) { setTypingId(id); setTyped(0) }
  }
  function echo(text: string) { push('user', text) }

  function openLink(url: string) {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  function runCommand(raw: string) {
    const norm = raw.trim().toLowerCase()
    const [cmd] = norm.split(/\s+/)

    switch (cmd) {
      case 'menu':
      case 'help':
      case '?':
      case 'look':
      case 'ls':
        return daemon(MENU)
      case 'clear':
        setBlocks([]); setShowIntro(false); setTypingId(null); setTyped(0); return
      case 'poem':
      case 'poems':
      case 'passage':
      case 'passages': {
        if (!PASSAGES.length) return daemon(PASSAGE_MISSING)
        const p = PASSAGES[Math.floor(Math.random() * PASSAGES.length)]
        return daemon([p.title, ...(p.ep ? [p.ep] : []), '', ...p.body])
      }
      case 'listen':
      case 'music':
        setMode('listen'); return daemon(LISTEN_PROMPT)
      case 'wander':
      case 'lore':
        return daemon(LORE[Math.floor(Math.random() * LORE.length)])
      default: {
        const hit = DEFLECT_BANK.find((d) => d.match.some((m) => norm.includes(m)))
        if (hit) return daemon(hit.line)
        return daemon(UNKNOWN)
      }
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    // Any input during the intro just completes it.
    if (!introDone) { setReveal(INTRO_TEXT.length); return }

    const raw = value
    setValue('')
    const norm = raw.trim().toLowerCase()
    if (!norm) return

    echo(raw.trim())

    if (mode === 'listen') {
      if (norm === BACK_WORD) { setMode('command'); return daemon(BACK_LINE) }
      const n = parseInt(norm, 10)
      const p = PLATFORMS[n - 1]
      if (p) { setMode('command'); daemon(openingLine(p.label)); return openLink(p.url) }
      return daemon(LISTEN_INVALID)
    }

    runCommand(raw)
  }

  return (
    <main
      className="terminal"
      onClick={() => introDone && inputRef.current?.focus()}
    >
      <div
        className="terminal-scroll"
        style={kbInset ? { paddingBottom: `${kbInset + 72}px` } : undefined}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="term-logo" src="/logo-white.png" alt="wobar" />

        {showIntro && (
          <pre className="term-block term-daemon">{INTRO_TEXT.slice(0, reveal)}</pre>
        )}

        {blocks.map((b) => {
          const shown = b.id === typingId ? b.text.slice(0, typed) : b.text
          return (
            <pre key={b.id} className={`term-block ${b.kind === 'user' ? 'term-user' : 'term-daemon'}`}>
              {b.kind === 'user' ? `${PROMPT_GLYPH} ${shown}` : shown}
            </pre>
          )
        })}

        {introDone && (
          <form onSubmit={handleSubmit} className="term-prompt">
            <span className="term-glyph">{PROMPT_GLYPH}</span>
            <input
              ref={inputRef}
              className="term-input"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onFocus={() => setTimeout(scrollToBottom, 300)}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              aria-label="terminal input"
            />
          </form>
        )}

        <div ref={bottomRef} />
      </div>
    </main>
  )
}
