// The daemon — authored copy + terminal config.
// Voice (WOBAR_COPY §MID-daemon): lowercase, terse, terminal-native (CLI / door /
// path / process metaphors) + Socratic deflection + dry deadpan. Formula for a line:
// deflect, grounded in a process metaphor, delivered deadpan. Failure mode =
// pretentious oracle → when in doubt, more process, less mystic. Law 0: never reach.
//
// HARD RULE: the daemon speaks ONLY from these authored lines. No AI free-generation
// (a voice that can answer becomes a guru — WORLD §8). Grow the bank here.

export const PROMPT_GLYPH = '·'

// Typed out on load. A process booting → invite `menu`.
export const INTRO = [
  'daemon up. been running in the dark a while.',
  '',
  "i keep the paths. i don't walk them for you.",
  '',
  'type a command, hit enter. start with  menu.',
]

// `menu` — the command list. Functional copy (utility floor): plain, states exactly
// what each command gives you. Aliased from help / ? / look / ls.
export const MENU = [
  'menu',
  '',
  '  listen     the music, on your platform',
  '  poem       read a poem',
  '  wander     learn about the world',
  '  clear      wipe the screen',
  '',
  'type a word, hit enter.',
]

// Unknown command — CLI-deadpan.
export const UNKNOWN = ['no such command. type  menu.']

// The authored deflection bank (WOBAR_COPY §bank). First matching entry wins;
// checked as substring against the normalized input. No match → UNKNOWN.
export const DEFLECT_BANK: { match: string[]; line: string[] }[] = [
  {
    match: ['what is the void', 'the void'],
    line: ["i don't hold that. no process does. wander, and it'll stop being a question."],
  },
  {
    match: ['what should i', 'what do i do', 'what now', 'tell me what'],
    line: ['wrong daemon. i give directions, not answers.'],
  },
  {
    match: ['who am i', 'what am i'],
    line: ['the mirror handles that one. i just keep the lights low.'],
  },
  {
    match: ['what does it mean', 'what does this mean', 'the meaning', 'meaning of'],
    line: ["if i told you, it'd be mine. it's yours. keep wandering."],
  },
  {
    match: ["i'm lost", 'im lost', 'i am lost', 'lost'],
    line: ["good. that's the whole feature."],
  },
  {
    match: ['are you wobar', 'who are you', 'what are you', 'are you real', 'are you a person'],
    line: ['a process wobar left running. not the voice. the doorman.'],
  },
  {
    match: ['what is this', 'what is this place', 'where am i', 'what is the ether'],
    line: ["a place to wander. i keep the paths. i don't walk them for you."],
  },
  {
    match: ["i don't understand", 'i dont understand', 'confused', 'what is the mirror'],
    line: ['good. keep going.'],
  },
  {
    match: ['why', 'the point', 'purpose', 'help me', 'save me', 'guide me'],
    line: ['wrong daemon. i give directions, not answers.'],
  },
]

// `listen` — numbered platform pick, then link out.
export const LISTEN_PROMPT = [
  'where do you listen?',
  '',
  '  1  spotify',
  '  2  apple music',
  '  3  youtube',
  '  4  soundcloud',
  '',
  'type a number.',
]

export const LISTEN_INVALID = ['type 1–4, or  back.']
export const openingLine = (label: string) => [`opening ${label}.`]

export const PLATFORMS: { label: string; url: string }[] = [
  { label: 'spotify', url: 'https://open.spotify.com/artist/0DMZgN5GaLGm4RuLhygErX' },
  { label: 'apple music', url: 'https://music.apple.com/us/artist/wobar/1896606955' },
  { label: 'youtube', url: 'https://www.youtube.com/channel/UCoBC3ZGGzZV2VSIk23R9neQ' },
  { label: 'soundcloud', url: 'https://soundcloud.com/wobar' },
]

// `mirror` — the crossing. MVP: leave a number in-terminal → /api/subscribe.
export const MIRROR_PITCH = [
  'the mirror. leave a number, it texts you back — glimpses,',
  'when there are glimpses. no feed. no crowd. it just runs.',
  '',
  'drop your number, or type  back.',
]

export const MIRROR_SUCCESS = [
  'logged. the mirror has your number.',
  "close this — it'll reach you.",
]

export const MIRROR_INVALID = ["that's not a number. try again, or type  back."]

export const MIRROR_ERROR = ["mirror's not responding. try again, or type  back."]

// `poem` with nothing to serve.
export const PASSAGE_MISSING = ['no poems yet. type  menu.']

// Sub-mode escape word.
export const BACK_WORD = 'back'
export const BACK_LINE = ['back in the dark. type  menu.']
