import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

function isAuthenticated(req: NextRequest): boolean {
  return req.cookies.get('admin-session')?.value === 'authenticated'
}

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  try {
    const rows = await sql`
      SELECT
        s.id,
        s.phone,
        s.opted_in,
        s.opted_out_at,
        s.created_at,
        m.body AS last_message,
        m.direction AS last_direction,
        m.created_at AS last_message_at,
        (
          SELECT COUNT(*)
          FROM messages
          WHERE subscriber_id = s.id AND direction = 'inbound'
        ) AS inbound_count
      FROM subscribers s
      LEFT JOIN LATERAL (
        SELECT body, direction, created_at
        FROM messages
        WHERE subscriber_id = s.id
        ORDER BY created_at DESC
        LIMIT 1
      ) m ON true
      ORDER BY COALESCE(m.created_at, s.created_at) DESC
    `
    return NextResponse.json({ subscribers: rows })
  } catch (err) {
    console.error('[admin/subscribers]', err)
    return NextResponse.json({ error: 'Database error.' }, { status: 500 })
  }
}
