// Copies every non-markdown vault asset (images) into public/vault-assets/
// so <img> tags emitted by the wikilink remark plugin resolve at build time.
// Also copies raw .md files into public/vault-notes/ — the json-canvas-viewer
// library fetches a note's raw markdown itself (to render an inline preview
// card) rather than accepting content directly, so it needs a real URL.
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const SITE_ROOT = fileURLToPath(new URL("..", import.meta.url))
const VAULT_ROOT = path.resolve(SITE_ROOT, "..")
const ASSETS_DEST = path.join(SITE_ROOT, "public", "vault-assets")
const NOTES_DEST = path.join(SITE_ROOT, "public", "vault-notes")

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
const IMAGE_EXTS = new Set(["png", "jpg", "jpeg", "gif", "svg", "webp"])

fs.rmSync(ASSETS_DEST, { recursive: true, force: true })
fs.rmSync(NOTES_DEST, { recursive: true, force: true })

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (IGNORE_DIRS.has(entry.name)) continue
      walk(full)
    } else {
      const ext = path.extname(entry.name).slice(1).toLowerCase()
      const rel = path.relative(VAULT_ROOT, full)
      if (IMAGE_EXTS.has(ext)) {
        const destPath = path.join(ASSETS_DEST, rel)
        fs.mkdirSync(path.dirname(destPath), { recursive: true })
        fs.copyFileSync(full, destPath)
      } else if (ext === "md") {
        const destPath = path.join(NOTES_DEST, rel)
        fs.mkdirSync(path.dirname(destPath), { recursive: true })
        fs.copyFileSync(full, destPath)
      }
    }
  }
}

walk(VAULT_ROOT)
console.log(`[copy-assets] copied vault images into ${path.relative(SITE_ROOT, ASSETS_DEST)}/`)
console.log(`[copy-assets] copied vault notes into ${path.relative(SITE_ROOT, NOTES_DEST)}/`)
