// Mock data for UI development — swap page.tsx imports to use these instead of Sanity

export const mockFeatured = {
  name: 'THRESHOLD',
  releaseType: 'ep',
  coverArt: null,
  previewClip: undefined,
  soundcloudUrl: 'https://soundcloud.com/wobar',
  spotifyUrl: undefined,
  youtubeUrl: undefined,
}

export const mockCatalog = [
  {
    name: 'RIFT VOL. 1',
    releaseType: 'mix',
    coverArt: null,
    previewClip: undefined,
    soundcloudUrl: 'https://soundcloud.com/wobar',
    spotifyUrl: undefined,
    youtubeUrl: undefined,
  },
  {
    name: 'DESCENSION',
    releaseType: 'single',
    coverArt: null,
    previewClip: undefined,
    soundcloudUrl: undefined,
    spotifyUrl: undefined,
    youtubeUrl: 'https://youtube.com/@wobar_music',
  },
  {
    name: 'MIRROR BASS',
    releaseType: 'single',
    coverArt: null,
    previewClip: undefined,
    soundcloudUrl: 'https://soundcloud.com/wobar',
    spotifyUrl: undefined,
    youtubeUrl: undefined,
  },
  {
    name: 'INTEGRATION',
    releaseType: 'ep',
    coverArt: null,
    previewClip: undefined,
    soundcloudUrl: undefined,
    spotifyUrl: undefined,
    youtubeUrl: 'https://youtube.com/@wobar_music',
  },
]

export const mockSets = [
  {
    date: '2026-04-12',
    venue: 'Schuba\'s Tavern',
    city: 'Chicago, IL',
    ticketUrl: 'https://www.ticketweb.com',
  },
  {
    date: '2026-04-26',
    venue: 'Elsewhere',
    city: 'Brooklyn, NY',
    ticketUrl: 'https://www.ticketweb.com',
  },
  {
    date: '2026-05-10',
    venue: 'Monarch',
    city: 'San Francisco, CA',
    ticketUrl: undefined,
  },
  {
    date: '2026-05-24',
    venue: 'Cervantes\' Masterpiece',
    city: 'Denver, CO',
    ticketUrl: 'https://www.ticketweb.com',
  },
]
