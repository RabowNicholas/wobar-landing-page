import LegalPage from '@/components/LegalPage'

export const metadata = {
  title: 'WOBAR — SMS Terms',
  description: 'Text-messaging program terms for Wobar, operated by NDR Business Consulting LLC.',
}

const CONTACT = 'contact.wobar@gmail.com'

export default function SmsTermsPage() {
  return (
    <LegalPage title="SMS Terms" updated="July 2026">
      <p>
        These are the terms of the Wobar text-messaging program, operated by{' '}
        <strong>NDR Business Consulting LLC</strong>. By opting in you agree to them.
      </p>

      <h2>Program</h2>
      <p>
        The Wobar SMS program sends occasional messages (&ldquo;glimpses&rdquo;) — releases,
        moments, and one-to-one replies — to people who opt in.
      </p>

      <h2>Opt-in</h2>
      <p>
        You opt in by texting the keyword <code>MIRROR</code> to our number, found on{' '}
        <a href="https://wobar.music">wobar.music</a>. That inbound message is your consent to
        receive texts. We do not collect phone numbers through any web form.
      </p>

      <h2>Message frequency</h2>
      <p>Recurring and irregular — messages come when they come, not on a fixed schedule.</p>

      <h2>Cost</h2>
      <p>Message and data rates may apply, depending on your carrier and plan.</p>

      <h2>Opt-out and help</h2>
      <p>
        Reply <code>STOP</code> at any time to cancel; you will receive one confirmation and no
        further messages. Reply <code>HELP</code> for help, or email{' '}
        <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.
      </p>

      <h2>Carriers</h2>
      <p>
        Carriers are not liable for delayed or undelivered messages. Supported carriers may change.
      </p>

      <h2>Privacy</h2>
      <p>
        Your number and consent are handled per our <a href="/privacy">Privacy Policy</a>. Mobile
        opt-in data is never shared with third parties for marketing.
      </p>

      <h2>Contact</h2>
      <p>
        NDR Business Consulting LLC
        <br />
        4964 W 4750 S, West Haven, UT 84401
        <br />
        <a href={`mailto:${CONTACT}`}>{CONTACT}</a>
      </p>
    </LegalPage>
  )
}
