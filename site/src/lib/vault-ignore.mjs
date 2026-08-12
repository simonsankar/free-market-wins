// Markdown files that live in the vault root but aren't notes — they're neither
// linkable nor publishable, so they're kept out of the content collections
// (see src/content/config.ts), out of the wikilink index (vault-index.mjs), and
// out of the public raw-markdown copy (scripts/copy-assets.mjs).
// Own module so the copy script can share it without importing vault-index.mjs,
// whose top-level index build reads the whole vault.
export const IGNORE_MD_BASENAMES = new Set(["README.md", "CLAUDE.md", "Untitled.md"])
