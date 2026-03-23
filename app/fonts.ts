import { Bebas_Neue, Space_Mono, Inter } from 'next/font/google'

export const display = Bebas_Neue({ weight: '400', subsets: ['latin'], variable: '--font-display' })
export const mono = Space_Mono({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-mono' })
export const body = Inter({ subsets: ['latin'], variable: '--font-body' })
