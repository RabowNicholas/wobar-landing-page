import { neon, type NeonQueryFunction } from '@neondatabase/serverless'

let _sql: NeonQueryFunction<false, false> | null = null

function getDb(): NeonQueryFunction<false, false> {
  if (!_sql) {
    const url = process.env.DATABASE_URL
    if (!url || !url.startsWith('postgres')) {
      throw new Error('DATABASE_URL is not configured. Set it in .env.local.')
    }
    _sql = neon(url)
  }
  return _sql
}

// Proxy so existing `sql\`...\`` usage works unchanged
export const sql = new Proxy({} as NeonQueryFunction<false, false>, {
  apply(_target, _thisArg, args) {
    const db = getDb()
    return db(...(args as Parameters<NeonQueryFunction<false, false>>))
  },
  get(_target, prop) {
    const db = getDb()
    return (db as unknown as Record<string | symbol, unknown>)[prop]
  },
})
