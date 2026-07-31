import { defineCollection, z } from "astro:content"
import { glob } from "astro/loaders"
import { fileURLToPath } from "node:url"
import { slugify } from "../lib/vault-index.mjs"

const vaultRoot = fileURLToPath(new URL("../../../", import.meta.url))

// YAML auto-parses bare `date: 2023-09-13` frontmatter values into JS Date
// objects, not strings — normalize both shapes to an ISO date string.
const dateAsString = z.preprocess((val) => {
  if (val instanceof Date) return val.toISOString().slice(0, 10)
  return val
}, z.string())

const noteSchema = z.object({
  title: z.string(),
  date: dateAsString.optional(),
  description: z.string().optional(),
  unlisted: z.boolean().optional(),
  // Optional manual cover image for essay cards — when unset, EssayCard
  // falls back to a generated cover (src/lib/coverArt.mjs).
  cover: z.string().optional(),
})

// Keep ids in lockstep with vault-index.mjs's urlForRel() — both slugify the
// same way, so a collection entry's `id` always matches the URL the wikilink
// remark plugin resolved for the same file.
// `!site/**` matters beyond matching: the glob loader's dev-mode watcher
// walks the whole `base` tree, and without this exclusion it recurses into
// this very Astro project (site/node_modules, site/.astro's own cache
// files, site/dist) and tries to validate them as collection entries —
// crashing the dev server the moment `.astro/*.json` gets rewritten.
const essays = defineCollection({
  loader: glob({
    pattern: [
      "essays/**/*.md",
      "!essays/**/index.md",
      "!essays/dissects/3rd-world-woes/Ministry of Education.md",
      "!site/**",
    ],
    base: vaultRoot,
    generateId: ({ entry }) =>
      entry
        .replace(/\.md$/, "")
        .split("/")
        .slice(1)
        .map(slugify)
        .join("/"),
  }),
  schema: noteSchema,
})

const definitions = defineCollection({
  loader: glob({
    pattern: ["*.md", "!index.md", "!README.md", "!CLAUDE.md", "!Untitled.md", "!site/**"],
    base: vaultRoot,
    generateId: ({ entry }) => slugify(entry.replace(/\.md$/, "")),
  }),
  schema: noteSchema,
})

const zingers = defineCollection({
  loader: glob({
    pattern: ["zingers/*.md", "!site/**"],
    base: vaultRoot,
    generateId: ({ entry }) => slugify(entry.replace(/^zingers\//, "").replace(/\.md$/, "")),
  }),
  schema: noteSchema,
})

const home = defineCollection({
  loader: glob({
    pattern: ["index.md", "!site/**"],
    base: vaultRoot,
    generateId: () => "index",
  }),
  schema: noteSchema,
})

export const collections = { essays, definitions, zingers, home }
