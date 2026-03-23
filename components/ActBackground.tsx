'use client'

interface ActBackgroundProps {
  act: 1 | 2 | 3 | 4 | 5
  className?: string
}

export default function ActBackground({ act, className = '' }: ActBackgroundProps) {
  const styles: Record<number, React.CSSProperties> = {
    1: {
      background: 'radial-gradient(ellipse 60% 60% at 50% 50%, #6B21A8 0%, #1A0533 50%, #050508 100%)',
      animation: 'pulse-glow 4s ease-in-out infinite',
    },
    2: {
      background: [
        'radial-gradient(ellipse 80% 40% at 20% 80%, #0891B2 0%, transparent 60%)',
        'radial-gradient(ellipse 60% 60% at 80% 20%, #6B21A8 0%, transparent 50%)',
        'radial-gradient(ellipse 100% 100% at 50% 50%, #1A0533 0%, #050508 80%)',
      ].join(', '),
    },
    3: {
      background: '#050508',
      backgroundImage: [
        'radial-gradient(circle at 50% 50%, transparent calc(15% - 1px), rgba(131,24,67,0.12) 15%, transparent calc(15% + 1px))',
        'radial-gradient(circle at 50% 50%, transparent calc(30% - 1px), rgba(131,24,67,0.09) 30%, transparent calc(30% + 1px))',
        'radial-gradient(circle at 50% 50%, transparent calc(45% - 1px), rgba(131,24,67,0.06) 45%, transparent calc(45% + 1px))',
        'radial-gradient(circle at 50% 50%, transparent calc(60% - 1px), rgba(131,24,67,0.04) 60%, transparent calc(60% + 1px))',
        'radial-gradient(circle at 50% 50%, transparent calc(75% - 1px), rgba(131,24,67,0.03) 75%, transparent calc(75% + 1px))',
      ].join(', '),
    },
    4: {
      background: [
        'radial-gradient(circle at 50% 50%, #7C3AED 0%, transparent 35%)',
        'radial-gradient(circle at 50% 50%, #0891B2 0%, transparent 55%)',
        'radial-gradient(circle at 50% 50%, #D97706 0%, transparent 75%)',
        '#050508',
      ].join(', '),
      animation: 'burst-rings 3s ease-in-out infinite',
    },
    5: {
      background: 'radial-gradient(ellipse 60% 60% at 50% 50%, #6B21A8 0%, #1A0533 50%, #050508 100%)',
      animation: 'pulse-close 6s ease-in-out infinite',
    },
  }

  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        ...styles[act],
      }}
    />
  )
}
