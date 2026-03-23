import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

function isAuthenticated(req: NextRequest): boolean {
  return req.cookies.get('admin-session')?.value === 'authenticated'
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  let body: { message?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid body.' }, { status: 400 })
  }

  if (!body.message?.trim()) {
    return NextResponse.json({ error: 'Message is required.' }, { status: 400 })
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const fromNumber = process.env.TWILIO_FROM_NUMBER

  if (!accountSid || !authToken || !fromNumber) {
    return NextResponse.json({ error: 'Twilio not configured.' }, { status: 500 })
  }

  try {
    const subscribers = await sql`
      SELECT id, phone FROM subscribers WHERE opted_in = true
    `

    let sent = 0
    let failed = 0

    for (const sub of subscribers) {
      try {
        const params = new URLSearchParams({
          To: sub.phone,
          From: fromNumber,
          Body: body.message!,
        })

        const twilioRes = await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
          {
            method: 'POST',
            headers: {
              Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString(),
          }
        )

        if (twilioRes.ok) {
          const data = await twilioRes.json()
          await sql`
            INSERT INTO messages (subscriber_id, direction, body, twilio_sid, created_at)
            VALUES (${sub.id}, 'outbound', ${body.message}, ${data.sid ?? null}, NOW())
          `
          sent++
        } else {
          failed++
        }
      } catch {
        failed++
      }
    }

    return NextResponse.json({ success: true, sent, failed, total: subscribers.length })
  } catch (err) {
    console.error('[admin/broadcast]', err)
    return NextResponse.json({ error: 'Server error.' }, { status: 500 })
  }
}
