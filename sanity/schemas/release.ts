export default {
  name: 'release',
  title: 'Release',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Release Name',
      type: 'string',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'releaseType',
      title: 'Release Type',
      type: 'string',
      options: {
        list: [
          { title: 'Original Track', value: 'original' },
          { title: 'Remix / Flip', value: 'remix' },
          { title: 'Live Set', value: 'live_set' },
          { title: 'Mix / Channel Drop', value: 'mix' }
        ]
      },
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'coverArt',
      title: 'Cover Art',
      type: 'image',
      options: { hotspot: true }
    },
    {
      name: 'featured',
      title: 'Featured Release',
      type: 'boolean',
      description: 'Only one release should be featured at a time. Featured release appears large at top.'
    },
    {
      name: 'url',
      title: 'Link',
      type: 'url',
      description: 'One link only. Pre-save smart link before drop, streaming link (Spotify/SoundCloud/YouTube/etc.) after. Update at release time.'
    }
  ]
}
