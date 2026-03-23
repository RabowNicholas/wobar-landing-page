import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

function toE164(digits: string): string | null {
  // Expects 10-digit US number or 11-digit with leading 1
  const clean = digits.replace(/\D/g, '')
  if (clean.length === 10) return `+1${clean}`
  if (clean.length === 11 && clean[0] === '1') return `+${clean}`
  return null
}

export async function POST(req: NextRequest) {
  let body: { phone?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const e164 = toE164(body.phone ?? '')
  if (!e164) {
    return NextResponse.json({ error: 'Invalid phone number. Please enter a 10-digit US number.' }, { status: 400 })
  }

  try {
    // Upsert subscriber
    const rows = await sql`
      INSERT INTO subscribers (phone, opted_in, created_at)
      VALUES (${e164}, true, NOW())
      ON CONFLICT (phone) DO UPDATE
        SET opted_in = true, opted_out_at = NULL
      RETURNING id, opted_in
    `
    const subscriberId = rows[0].id

    // Send opt-in SMS via Twilio
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const fromNumber = process.env.TWILIO_FROM_NUMBER

    let twilioSid: string | null = null

    if (accountSid && authToken && fromNumber) {
      const twilioBody = `You're on the WOBAR list. Expect transmissions. Reply STOP to unsubscribe.`

      const params = new URLSearchParams({
        To: e164,
        From: fromNumber,
        Body: twilioBody,
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
        const twilioData = await twilioRes.json()
        twilioSid = twilioData.sid ?? null

        // Store outbound message
        await sql`
          INSERT INTO messages (subscriber_id, direction, body, twilio_sid, created_at)
          VALUES (${subscriberId}, 'outbound', ${twilioBody}, ${twilioSid}, NOW())
        `
      }
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    console.error('[subscribe]', err)
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 })
  }
}
