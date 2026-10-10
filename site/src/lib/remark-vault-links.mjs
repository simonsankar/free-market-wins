import { visit } from "unist-util-visit"
import path from "node:path"
import { VAULT_ROOT, resolveNote, imagesByBasename } from "./vault-index.mjs"

// Matches [[Target]], [[Target|Alias]], [[Target#Heading]], [[#Heading]]
// (a section of the same note), and the embed form ![[Target]]
const WIKILINK_RE = /(!?)\[\[([^\]|#]*)(?:#([^\]|]+))?(?:\|([^\]]+))?\]\]/g

// Same rule Astro uses to give headings their ids (github-slugger): lowercase,
// strip punctuation, spaces to hyphens. Repeated headings get "-1" suffixes
// there that this doesn't reproduce, so link to unique headings.
function headingSlug(heading) {
  return heading
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}\p{Pc}\- ]/gu, "")
    .replace(/ /g, "-")
}

function splitTextNode(node) {
  const value = node.value
  WIKILINK_RE.lastIndex = 0
  if (!WIKILINK_RE.test(value)) return null
  WIKILINK_RE.lastIndex = 0

  const parts = []
  let lastIndex = 0
  let match
  while ((match = WIKILINK_RE.exec(value))) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", value: value.slice(lastIndex, match.index) })
    }
    const [, bang, target, heading, alias] = match
    parts.push({ bang: bang === "!", target: target.trim(), heading: heading?.trim(), alias: alias?.trim() })
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < value.length) {
    parts.push({ type: "text", value: value.slice(lastIndex) })
  }
  return parts
}

export function remarkVaultLinks() {
  return (tree, file) => {
    visit(tree, "image", (node) => {
      const basename = path.basename(node.url).toLowerCase()
      const rel = imagesByBasename.get(basename)
      if (rel) {
        node.url = `/vault-assets/${rel.split(path.sep).join("/")}`
      }
    })

    visit(tree, "text", (node, index, parent) => {
      if (!parent || index === null) return
      const parts = splitTextNode(node)
      if (!parts) return

      const newNodes = parts.map((part) => {
        if (part.type === "text") return { type: "text", value: part.value }

        const anchor = part.heading ? `#${headingSlug(part.heading)}` : ""
        const label = part.alias ?? (part.heading ? (part.target ? `${part.target} › ${part.heading}` : part.heading) : part.target)

        // [[#Heading]] — a section of the note being rendered.
        if (!part.target && part.heading) {
          return {
            type: "link",
            url: anchor,
            data: { hProperties: { class: "internal" } },
            children: [{ type: "text", value: label }],
          }
        }

        if (part.bang) {
          const rel = imagesByBasename.get(part.target.toLowerCase())
          if (rel) {
            return {
              type: "image",
              url: `/vault-assets/${rel.split(path.sep).join("/")}`,
              alt: part.alias ?? part.target,
            }
          }
          // Not an image we know about — fall through to a plain link below.
        }

        const targetEntry = resolveNote(part.target)
        if (targetEntry) {
          return {
            type: "link",
            url: targetEntry.url + anchor,
            data: {
              hProperties: {
                class: "internal",
                "data-preview-title": targetEntry.title,
                "data-preview-kind": { "core-theory": "Core Theory", essays: "Essay", zingers: "Zinger" }[targetEntry.collection] ?? "",
                "data-preview-excerpt": targetEntry.excerpt,
              },
            },
            children: [{ type: "text", value: label }],
          }
        }

        console.warn(`[vault-links] broken wikilink "[[${part.target}]]" in ${file.path}`)
        return {
          type: "html",
          value: `<span class="broken-link" title="No note found for &quot;${part.target}&quot;">${
            label
          }</span>`,
        }
      })

      parent.children.splice(index, 1, ...newNodes)
      return index + newNodes.length
    })
  }
}

export { VAULT_ROOT }
