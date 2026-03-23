import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

function isAuthenticated(req: NextRequest): boolean {
  return req.cookies.get('admin-session')?.value === 'authenticated'
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ subscriberId: string }> }
) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const { subscriberId } = await params
  const id = parseInt(subscriberId, 10)
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID.' }, { status: 400 })

  try {
    const [subscriber] = await sql`
      SELECT id, phone, opted_in, opted_out_at, created_at
      FROM subscribers WHERE id = ${id}
    `
    if (!subscriber) return NextResponse.json({ error: 'Not found.' }, { status: 404 })

    const messages = await sql`
      SELECT id, direction, body, twilio_sid, created_at
      FROM messages
      WHERE subscriber_id = ${id}
      ORDER BY created_at ASC
    `
    return NextResponse.json({ subscriber, messages })
  } catch (err) {
    console.error('[admin/messages GET]', err)
    return NextResponse.json({ error: 'Database error.' }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ subscriberId: string }> }
) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const { subscriberId } = await params
  const id = parseInt(subscriberId, 10)
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID.' }, { status: 400 })

  let body: { message?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid body.' }, { status: 400 })
  }

  if (!body.message?.trim()) {
    return NextResponse.json({ error: 'Message is required.' }, { status: 400 })
  }

  try {
    const [subscriber] = await sql`SELECT phone, opted_in FROM subscribers WHERE id = ${id}`
    if (!subscriber) return NextResponse.json({ error: 'Subscriber not found.' }, { status: 404 })
    if (!subscriber.opted_in) {
      return NextResponse.json({ error: 'Subscriber has opted out.' }, { status: 400 })
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const fromNumber = process.env.TWILIO_FROM_NUMBER

    let twilioSid: string | null = null

    if (accountSid && authToken && fromNumber) {
      const params = new URLSearchParams({
        To: subscriber.phone,
        From: fromNumber,
        Body: body.message,
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
        twilioSid = data.sid ?? null
      }
    }

    await sql`
      INSERT INTO messages (subscriber_id, direction, body, twilio_sid, created_at)
      VALUES (${id}, 'outbound', ${body.message}, ${twilioSid}, NOW())
    `

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[admin/messages POST]', err)
    return NextResponse.json({ error: 'Server error.' }, { status: 500 })
  }
}
