import EpkNav from '@/components/epk/EpkNav'
import EpkHero from '@/components/epk/EpkHero'
import EpkBio from '@/components/epk/EpkBio'
import EpkMusic from '@/components/epk/EpkMusic'
import EpkShows from '@/components/epk/EpkShows'
import EpkPress from '@/components/epk/EpkPress'
import EpkContact from '@/components/epk/EpkContact'
import { getEpkConfig, getSiteConfig } from '@/lib/sanity/queries'

export const revalidate = 60

export default async function EpkPage() {
  const [epk, config] = await Promise.all([
    getEpkConfig().catch(() => null),
    getSiteConfig().catch(() => null),
  ])

  return (
    <>
      <EpkNav />
      <main>
        <EpkHero />
        <EpkBio
          bioShort={epk?.bio_short}
          bioMedium={epk?.bio_medium}
          bioLong={epk?.bio_long}
        />
        <EpkMusic tracks={epk?.epk_tracks} />
        <EpkShows shows={epk?.notable_shows} />
        <EpkPress
          photos={epk?.press_photos}
          quotes={epk?.press_quotes}
        />
        <EpkContact bookingEmail={config?.booking_email} />
      </main>
    </>
  )
}
