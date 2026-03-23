import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

// Twilio sends application/x-www-form-urlencoded
export async function POST(req: NextRequest) {
  let from: string, body: string

  try {
    const form = await req.formData()
    from = (form.get('From') as string) ?? ''
    body = (form.get('Body') as string) ?? ''
  } catch {
    return new NextResponse('<?xml version="1.0"?><Response/>', {
      status: 200,
      headers: { 'Content-Type': 'text/xml' },
    })
  }

  const trimmed = body.trim().toUpperCase()

  try {
    // Upsert subscriber record
    const rows = await sql`
      INSERT INTO subscribers (phone, opted_in, created_at)
      VALUES (${from}, true, NOW())
      ON CONFLICT (phone) DO UPDATE SET phone = EXCLUDED.phone
      RETURNING id, opted_in
    `
    const subscriberId = rows[0]?.id

    if (subscriberId) {
      // Store inbound message
      await sql`
        INSERT INTO messages (subscriber_id, direction, body, created_at)
        VALUES (${subscriberId}, 'inbound', ${body}, NOW())
      `

      // Handle STOP / UNSTOP
      if (trimmed === 'STOP') {
        await sql`
          UPDATE subscribers
          SET opted_in = false, opted_out_at = NOW()
          WHERE id = ${subscriberId}
        `
      } else if (trimmed === 'UNSTOP' || trimmed === 'START') {
        await sql`
          UPDATE subscribers
          SET opted_in = true, opted_out_at = NULL
          WHERE id = ${subscriberId}
        `
      }
    }
  } catch (err) {
    console.error('[sms/inbound]', err)
  }

  // Return empty TwiML (no auto-reply)
  return new NextResponse('<?xml version="1.0"?><Response/>', {
    status: 200,
    headers: { 'Content-Type': 'text/xml' },
  })
}
