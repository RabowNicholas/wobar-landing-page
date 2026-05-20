import TextureOverlay from '@/components/TextureOverlay'
import MusicSection from '@/components/sections/MusicSection'
import ConnectSection from '@/components/sections/ConnectSection'
import PortalContainer from '@/components/PortalContainer'
import { getFeaturedRelease, getCatalogReleases } from '@/lib/sanity/queries'

export const revalidate = 60

export default async function Home() {
  const [featured, catalog] = await Promise.all([
    getFeaturedRelease().catch(() => null),
    getCatalogReleases().catch(() => []),
  ])

  return (
    <>
      <TextureOverlay />
      <PortalContainer>
        <MusicSection featured={featured} catalog={catalog} />
        <ConnectSection />
      </PortalContainer>
    </>
  )
}
