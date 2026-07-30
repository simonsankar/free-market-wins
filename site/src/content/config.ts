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
})

// Keep ids in lockstep with vault-index.mjs's urlForRel() — both slugify the
// same way, so a collection entry's `id` always matches the URL the wikilink
// remark plugin resolved for the same file.
const essays = defineCollection({
  loader: glob({
    pattern: [
      "essays/**/*.md",
      "!essays/**/index.md",
      "!essays/dissects/3rd-world-woes/Ministry of Education.md",
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
    pattern: ["*.md", "!index.md", "!README.md", "!CLAUDE.md", "!Untitled.md"],
    base: vaultRoot,
    generateId: ({ entry }) => slugify(entry.replace(/\.md$/, "")),
  }),
  schema: noteSchema,
})

const zingers = defineCollection({
  loader: glob({
    pattern: "zingers/*.md",
    base: vaultRoot,
    generateId: ({ entry }) => slugify(entry.replace(/^zingers\//, "").replace(/\.md$/, "")),
  }),
  schema: noteSchema,
})

const home = defineCollection({
  loader: glob({
    pattern: "index.md",
    base: vaultRoot,
    generateId: () => "index",
  }),
  schema: noteSchema,
})

export const collections = { essays, definitions, zingers, home }
