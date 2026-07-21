import LegalPage from '@/components/LegalPage'

export const metadata = {
  title: 'WOBAR — Privacy Policy',
  description: 'Privacy policy for Wobar, operated by NDR Business Consulting LLC.',
}

const CONTACT = 'contact.wobar@gmail.com'

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="July 2026">
      <p>
        Wobar is a music project operated by <strong>NDR Business Consulting LLC</strong>{' '}
        (&ldquo;Wobar,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;). This policy explains what we
        collect, how we use it, and your choices — with particular detail on our text-message
        program. Questions: <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.
      </p>

      <h2>Information we collect</h2>
      <ul>
        <li>
          <strong>Phone number and message content</strong> — only if you text us. When you send a
          message to our number, we store your number and the messages exchanged.
        </li>
        <li>
          <strong>Anonymous usage</strong> — which navigation paths are used on the site. We bucket
          these to a fixed set of known commands; free text you type is never stored.
        </li>
      </ul>

      <h2>Text messaging (SMS) program</h2>
      <p>
        <strong>How you opt in.</strong> Our messaging program is entirely self-initiated. You opt
        in by texting the keyword <code>MIRROR</code> to our number, which you find on{' '}
        <a href="https://wobar.music">wobar.music</a>. That inbound text is your express consent to
        receive messages from us. We never collect your phone number through a web form.
      </p>
      <p>
        <strong>What you receive.</strong> After you opt in, we may send occasional messages
        (&ldquo;glimpses&rdquo;) related to Wobar — releases, moments, and one-to-one replies.
        Message frequency is irregular and recurring.
      </p>
      <p>
        <strong>Cost.</strong> Message and data rates may apply, depending on your mobile carrier
        and plan.
      </p>
      <p>
        <strong>How to stop.</strong> Reply <code>STOP</code> at any time to opt out; you will
        receive no further messages. Reply <code>HELP</code> for help, or email{' '}
        <a href={`mailto:${CONTACT}`}>{CONTACT}</a>. Carriers are not liable for delayed or
        undelivered messages.
      </p>
      <p>
        <strong>
          No mobile information will be shared with third parties or affiliates for marketing or
          promotional purposes.
        </strong>{' '}
        Text-messaging originator opt-in data and consent are never shared with any third parties.
      </p>

      <h2>How we use information</h2>
      <p>
        We use your information solely to operate the messaging program you opted into and to
        respond to you. We do not sell your personal information.
      </p>

      <h2>Service providers</h2>
      <p>
        We use <strong>Twilio</strong> to send and receive text messages and <strong>Vercel</strong>{' '}
        to host the site. These providers process data only to deliver the service. As stated above,
        SMS opt-in and consent data is not shared for marketing purposes.
      </p>

      <h2>Retention and your choices</h2>
      <p>
        You can opt out of texts at any time by replying <code>STOP</code>. To request deletion of
        your data, email <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.
      </p>

      <h2>Changes</h2>
      <p>
        We may update this policy. Material changes will be posted here with a new date above.
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
