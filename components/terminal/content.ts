// The world's written body — hardcoded. This file IS the source of truth for
// Passages + lore fragments. To add content, append to the arrays below.
//
// ── ADD A PASSAGE ─────────────────────────────────────────────────
//   {
//     title: 'passage ii — <name>',   // shown in the `passages` list + header
//     ep: 'portal ii',                // optional — the EP it seals (omit if none)
//     body: [                         // one string per line; '' = blank line
//       'first line of the void poem',
//       '',
//       'next stanza…',
//     ],
//   },
// Order in the array = order in the list (`passages 1`, `passages 2`, …).
//
// ── ADD A LORE FRAGMENT ───────────────────────────────────────────
//   Append a string[] (lines) to LORE. `wander` serves one at random.

export type Passage = {
  title: string
  ep?: string
  body: string[]
}

export type LoreFragment = string[]

export const PASSAGES: Passage[] = [
  {
    title: 'blind',
    body: [
      'the darkness is the only place where you can see yourself fully',
    ],
  },
  {
    title: 'standing dead',
    body: [
      'i sway in the wind more than i ever have before.',
      'my purpose is complete in this cycle.',
      'yet my structure is still giving.',
      'i am still giving.',
      'i once was lush and full of green and now i slowly rot and give back to the earth from which i came.',
      'i sway in the wind more than i ever have before.',
      'soon i will fall and be no more.',
    ],
  },
  {
    title: 'two trees',
    body: [
      'we were separate for a time as we wandered the ether.',
      'we were together once in a past life.',
      'now we find ourselves here.',
      'in the desert.',
      'growing next to each other.',
      'as the years pass, we reach out.',
      'eventually entangling our forms in this existence.',
      'we share our energy.',
      'we share nutrients.',
      'our love.',
      'together we are stronger.',
      'thank you.',
    ],
  },
]

// wander — belief-mirrors / calling cards. the void and the beliefs, said back to the Wanderer.
// NOT Passages (those are narrative void poems, Nick-authored). model: "blind," not the tree poems.
export const LORE: LoreFragment[] = [
  // it's all within you / the portal goes in
  ['the portal does not add anything to you.', 'it clears what was in the way.'],
  ['nothing in here is new —', 'you are only done looking away.'],
  ['every other door opens out.', 'this one opens in.'],
  ['you spent the whole time looking up.', 'it was always down, and in.'],

  // bass as mirror / the blind spot
  ['the one angle you were never given', 'is the one you see everything else from.'],
  ['the mirror does not show you something new.', 'it shows you the part you keep behind you.'],
  ['whatever you came to find', 'was at the center before you started walking.'],

  // no escape / the shadow is the portal
  ['the shadow is not in the way of the door.', 'the shadow is the door.'],
  ['the way out is further in.', 'it was always further in.'],

  // intention is everything
  ['what you leave unnamed at the door', 'still comes in with you.'],
  ['the void hands back exactly what you carried in,', 'turned all the way up.'],

  // dissolution / surrender
  ['the drop is not the peak.', 'it is the moment you come apart', '', 'and do not need putting back.'],
  ['understanding was never the price of entry.', 'letting go was.'],

  // the paradox
  ['none of it matters.', 'all of it matters.', '', 'you already live in the space between.'],
  ['nothing you do is important.', 'everything you do is sacred.', 'the freedom is in refusing to choose.'],

  // your path alone / no guru
  ['there is no guide here.', 'a mirror, a frequency, and what you carried in.'],
  ['no one is coming to walk this for you.', 'that is the good news, once it lands.'],

  // synchronicity
  ['nothing found you by accident.', 'not the track. not the dark. not this.'],
  ['the track that found you', 'was always going to find you.'],

  // transformation, not only entertainment
  ['the sound does its half.', 'the other half was always yours.'],

  // axis 1 — the timeless self
  ['you were never a line through time.', 'you were the whole shape, at once.'],
  ['every moment you have lived is still happening.', 'you only feel one at a time.'],

  // axis 2 — the all-possibility self / the source
  ['you are not one person.', 'you are every version,', 'standing in the same dark.'],
  ['follow yourself out far enough', 'and you stop being only yourself.'],

  // facelessness
  ['there is no single face at the center.', 'no one to be.'],

  // the three versions
  ['further along the same path,', 'you already made it out.', '', 'it has been reaching back the whole time.'],
  ['the wounded one does not need fixing.', 'it can move.'],

  // the core tension — heavy and sacred
  ['it is heavy because it is holy.', 'here, the two were never separate.'],

  // wandering / the ether / recognition
  ['everyone you meet in here', 'went quiet too.'],
  ['you walk this alone.', 'so does everyone else in the ether.', 'that is what you have in common.'],
]
