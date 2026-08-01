import fs from "node:fs"
import path from "node:path"
import { VAULT_ROOT, slugify, resolveNote, imagesByBasename } from "./vault-index.mjs"

const IGNORE_DIRS = new Set([
  "site",
  ".obsidian",
  ".smart-env",
  ".git",
  ".claude",
  "private",
  "templates",
  "node_modules",
])

function walk(dir, results) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (IGNORE_DIRS.has(entry.name)) continue
      walk(full, results)
    } else if (entry.name.endsWith(".canvas")) {
      results.push(path.relative(VAULT_ROOT, full))
    }
  }
}

export function listCanvases() {
  const files = []
  walk(VAULT_ROOT, files)
  return files.map((rel) => {
    const stem = path.basename(rel, ".canvas")
    return { rel, slug: slugify(stem), title: stem }
  })
}

// json-canvas-viewer consumes the raw JSON Canvas spec directly (including
// Obsidian's numbered "1".."6" color codes, which the library resolves
// itself) — so `canvas` here is passed through untouched. Separately we
// build:
//  - `attachments`: file-node path -> a real fetchable URL for the raw
//    markdown (the library does its own `fetch(url).then(r => r.text())` to
//    render the inline preview card — pointing it at the literal vault path
//    with no substitution 404s, and that 404 page's HTML was getting
//    embedded straight into the card as "content").
//  - `fileUrls`: node id -> site URL, so clicking a file card navigates to
//    the real note page instead of just previewing it inline.
//  - `images`: image basename (lowercase) -> a real fetchable `/vault-assets/`
//    URL. The library's built-in `parser` is plain `marked`, which has no
//    idea what Obsidian's `![[image.png]]` embed syntax means and renders it
//    as literal text — this map lets the client-side parser wrapper rewrite
//    those embeds into real `![alt](url)` markdown before handing off to
//    `marked`, the same resolution `remark-vault-links.mjs` does for regular
//    note pages.
export function loadCanvas(rel) {
  const raw = fs.readFileSync(path.join(VAULT_ROOT, rel), "utf8")
  const canvas = JSON.parse(raw)

  const attachments = {}
  const fileUrls = {}
  for (const n of canvas.nodes ?? []) {
    if (n.type !== "file") continue
    const stem = path.basename(n.file, path.extname(n.file))
    const entry = resolveNote(stem)
    if (!entry) continue
    fileUrls[n.id] = entry.url
    attachments[n.file] = `/vault-notes/${entry.rel.split(path.sep).map(encodeURIComponent).join("/")}`
  }

  const images = {}
  for (const [basename, imgRel] of imagesByBasename) {
    images[basename] = `/vault-assets/${imgRel.split(path.sep).map(encodeURIComponent).join("/")}`
  }

  return { canvas, attachments, fileUrls, images }
}
