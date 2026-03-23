'use client'

import Image from 'next/image'

interface LogoMarkProps {
  size?: number
  ambient?: boolean
  className?: string
}

export default function LogoMark({ size = 120, ambient = false, className = '' }: LogoMarkProps) {
  if (ambient) {
    return (
      <div
        className={`fixed bottom-6 left-6 z-10 ${className}`}
        style={{ opacity: 0.4, pointerEvents: 'none' }}
      >
        <div className="logo-outer" style={{ width: 32, height: 32 }}>
          <div className="logo-inner" style={{ width: 32, height: 32 }}>
            <Image
              src="/logo.png"
              alt="WOBAR"
              width={32}
              height={32}
              style={{ display: 'block' }}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`inline-block ${className}`} style={{ width: size, height: size }}>
      <div className="logo-outer" style={{ width: size, height: size }}>
        <div className="logo-inner" style={{ width: size, height: size }}>
          <Image
            src="/logo.png"
            alt="WOBAR"
            width={size}
            height={size}
            style={{ display: 'block' }}
          />
        </div>
      </div>
    </div>
  )
}
