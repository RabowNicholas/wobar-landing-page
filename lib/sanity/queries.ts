import { sanityClient } from './client'

// ── Site Config ──────────────────────────────────────────────
export async function getSiteConfig() {
  return sanityClient.fetch(`*[_type == "siteConfig"][0]{
    transmission_text,
    capture_headline,
    capture_subline,
    booking_email,
    press_photos_url,
    social_instagram,
    social_twitter,
    social_spotify,
    social_soundcloud,
    social_youtube
  }`)
}

// ── Releases ─────────────────────────────────────────────────
export async function getReleases() {
  return sanityClient.fetch(`*[_type == "release"] | order(release_date desc){
    _id,
    title,
    act_label,
    cover_art,
    smart_link_url,
    release_date
  }`)
}

// ── Featured Track ────────────────────────────────────────────
export async function getFeaturedTrack() {
  return sanityClient.fetch(`*[_type == "featuredTrack"][0]{
    title,
    act_label,
    cover_art,
    smart_link_url
  }`)
}

// ── Tour Dates ────────────────────────────────────────────────
export async function getTourDates() {
  return sanityClient.fetch(`*[_type == "tourDate" && date >= now()] | order(date asc){
    _id,
    date,
    venue,
    city,
    ticket_url
  }`)
}

// ── EPK Config ────────────────────────────────────────────────
export async function getEpkConfig() {
  return sanityClient.fetch(`*[_type == "epkConfig"][0]{
    bio_short,
    bio_medium,
    bio_long,
    epk_tracks[]{
      title,
      act_label,
      cover_art,
      smart_link_url
    },
    notable_shows[]{
      date,
      venue,
      city,
      note
    },
    press_photos[]{
      _key,
      asset->{url},
      caption
    },
    press_quotes[]{
      _key,
      quote,
      attribution
    }
  }`)
}

// ── About Section ─────────────────────────────────────────────
export async function getAboutSection() {
  return sanityClient.fetch(`*[_type == "aboutSection"][0]{
    bio_text,
    about_image,
    press_photos_url
  }`)
}

// ── Sets (new) ─────────────────────────────────────────────
export async function getSets() {
  return sanityClient.fetch(`*[_type == "set"] | order(date asc) {
    date,
    venue,
    city,
    ticketUrl
  }`)
}

// ── Music Catalog (new schema) ─────────────────────────────
export async function getFeaturedRelease() {
  return sanityClient.fetch(`*[_type == "release" && featured == true][0] {
    name, releaseType, coverArt, previewClip { asset->{ url } }, soundcloudUrl, spotifyUrl, youtubeUrl
  }`)
}

export async function getCatalogReleases() {
  return sanityClient.fetch(`*[_type == "release" && featured != true] | order(_createdAt desc) {
    name, releaseType, coverArt, previewClip { asset->{ url } }, soundcloudUrl, spotifyUrl, youtubeUrl
  }`)
}
