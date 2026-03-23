import TextureOverlay from '@/components/TextureOverlay'
import HeroSection from '@/components/sections/HeroSection'
import TransmissionSection from '@/components/sections/TransmissionSection'
import TourSection from '@/components/sections/TourSection'
import MusicSection from '@/components/sections/MusicSection'
import CaptureSection from '@/components/sections/CaptureSection'
import PortalContainer from '@/components/PortalContainer'
import { getSets, getFeaturedRelease, getCatalogReleases } from '@/lib/sanity/queries'

export const revalidate = 60

export default async function Home() {
  const [sets, featured, catalog] = await Promise.all([
    getSets().catch(() => []),
    getFeaturedRelease().catch(() => null),
    getCatalogReleases().catch(() => []),
  ])

  return (
    <>
      <TextureOverlay />
      <PortalContainer>
        <HeroSection />
        <MusicSection featured={featured} catalog={catalog} />
        <TourSection sets={sets} />
        <TransmissionSection />
        <CaptureSection />
      </PortalContainer>
    </>
  )
}
