// Editorial grouping for the Core Theory index page (/core-theory/).
//
// This is NOT metadata in the vault: it is a hand-curated "stack" that says
// which layer of the argument each core-theory note mainly belongs to. Each
// layer only stands because the one beneath it does (01 is the foundation).
// The vault markdown is never edited — notes are matched by the slug of their
// file name (the same slug the content collection uses as its `id`), so
// `slugify("Human action") === "human-action"`.
//
// Any note NOT listed here (e.g. a note added to the vault later) automatically
// lands in the "Also in the vault" fallback row on the page, so nothing is ever
// missing. To file it properly, add its title to a layer below.
//
// `key: true` entries get the emphasised ink chip with gold text.

import { slugify } from "./vault-index.mjs"

// Listed top -> bottom, i.e. 05 down to the 01 foundation.
const RAW_LAYERS = [
  {
    n: "05",
    title: "The State, Exposed",
    blurb: "What all of the above rules out.",
    tone: "ink",
    notes: [
      { name: "State", key: true },
      { name: "Socialism is impossible", key: true },
      "Taxation",
      "Democracy",
      "Socialism",
      "Central planning",
      "Parasitism",
      "Utilitarianism",
      "Polylogism",
      "Tragedy of the commons",
      "Anarcho-Capitalism",
    ],
  },
  {
    n: "04",
    title: "Money",
    blurb: "Sound money vs. the printer.",
    tone: "butter",
    notes: [
      { name: "Sound Money", key: true },
      "Money",
      "Coincidence of wants",
      "Gold",
      "Fiat Currency",
      "Inflation",
      "Cantillon Effect",
      "Fractional Reserve Banking",
    ],
  },
  {
    n: "03",
    title: "Economics",
    blurb: "Praxeology: logic of human action.",
    tone: "bone",
    notes: [
      { name: "economic calculation problem", key: true },
      "Austrian Economics",
      "Human action",
      "Subjective Value Theory",
      "Revealed Preference",
      "Scarcity",
      "Time",
      "price system",
      "Knowledge Problem (Information Throughput Problem)",
      "Markets",
      "Trade",
      "Production",
      "Skin in the game",
    ],
  },
  {
    n: "02",
    title: "Ethics & Law",
    blurb: "From argument to property rights.",
    tone: "gold",
    notes: [
      { name: "The Non-aggression Principle", key: true },
      { name: "Argumentation Ethics", key: true },
      "Ethics",
      "Life the standard for man",
      "Argumentation",
      "Self-ownership",
      "private property",
      "Ownership",
      "Homesteading (First-comer Ethic)",
      "Aggression",
      "Conflicts",
      "Law",
      "Jungle Law",
      "Mixed Law",
      "Contracts",
    ],
  },
  {
    n: "01",
    title: "Axioms",
    blurb: "The bedrock. Deny these and you've used them.",
    tone: "ink",
    notes: [
      { name: "Axiom of Action", key: true },
      "Existence",
      "Identity",
      "Consciousness",
      "Primacy of Existence",
      "Primacy of Consciousness",
      "Law of Non-Contradiction",
      "Axioms as Invulnerable",
      "Metaphysics",
      "Epistemology",
      "Philosophy",
    ],
  },
]

// slug -> { layer index, key }. Aesthetics is deliberately left out: it is the
// Objectivist "fifth branch", included in the vault for completeness and not a
// rung of this argument, so it shows in the fallback row.
const bySlug = new Map()
export const LAYERS = RAW_LAYERS.map((layer, index) => {
  for (const note of layer.notes) {
    const name = typeof note === "string" ? note : note.name
    bySlug.set(slugify(name), { index, key: typeof note !== "string" && note.key === true })
  }
  return { n: layer.n, title: layer.title, blurb: layer.blurb, tone: layer.tone }
})

// Returns { layer: LAYERS index | -1, key: boolean } for a collection entry id.
export function placeNote(id) {
  return bySlug.get(id) ?? { index: -1, key: false }
}

export const FALLBACK = {
  n: "+",
  title: "Also in the vault",
  blurb: "Notes that aren't a rung of the stack, or haven't been filed yet.",
}
