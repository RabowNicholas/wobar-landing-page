interface PlaceholderBlockProps {
  label: string
  height?: string
  className?: string
}

export default function PlaceholderBlock({
  label,
  height = '200px',
  className = '',
}: PlaceholderBlockProps) {
  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{
        height,
        background: '#0a0a0a',
        border: '1px solid rgba(123, 47, 255, 0.3)',
        borderRadius: '4px',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          color: 'rgba(123, 47, 255, 0.6)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}
      >
        [ {label} ]
      </span>
    </div>
  )
}
