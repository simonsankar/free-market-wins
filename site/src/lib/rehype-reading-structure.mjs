// Gives long-form prose a visible structure the CSS can hang off ("Rail"
// layout, Paper file → "Article Readability" page):
//
//   - `## 2. Title`          → the number goes in its own `.h2-num` span
//   - `### Camp: claim`      → `.h3-kicker` (Camp) + `.h3-title` (claim)
//   - each h3 and everything after it, up to the next h2/h3/hr or closer, is
//     wrapped in `<section class="sub">` so the rail can tie the paragraphs
//     to their heading
//   - a paragraph opening with *Bottoms out at:* gets `.closer`, and ends the
//     subsection before it
//
// Astro collects headings (TOC text + slug) AFTER user rehype plugins, by
// concatenating every text node inside the heading. So no heading text is
// added or removed here — only regrouped into spans — and the separators
// (". ", ": ") stay in the DOM inside a visually hidden `.h-sep`. TOC labels
// and anchor slugs come out identical to the unstructured markdown.

const el = (tagName, className, children) => ({
  type: "element",
  tagName,
  properties: { className },
  children,
})
const text = (value) => ({ type: "text", value })
const textOf = (node) =>
  node.type === "text" ? node.value : (node.children ?? []).map(textOf).join("")
const isTag = (node, tag) => node.type === "element" && node.tagName === tag

function numberH2(h2) {
  const first = h2.children[0]
  const m = first?.type === "text" ? /^(\d{1,2})(\.\s+)/.exec(first.value) : null
  if (!m) return
  first.value = first.value.slice(m[0].length)
  h2.children.unshift(el("span", ["h2-num"], [text(m[1])]), el("span", ["h-sep"], [text(m[2])]))
}

// Only short prefixes become kickers ("Neighbours", "Exhibit Five",
// "2008-2020"); a heading that merely contains a colon, or ends on one
// ("Phase 1 Complete When:"), is left alone.
function splitH3(h3) {
  const first = h3.children[0]
  if (first?.type !== "text") return
  const i = first.value.indexOf(": ")
  if (i <= 0) return
  const kicker = first.value.slice(0, i).trim()
  if (kicker.length > 32 || kicker.split(/\s+/).length > 4) return
  const rest = [text(first.value.slice(i + 2)), ...h3.children.slice(1)]
  if (!rest.map(textOf).join("").trim()) return
  h3.children = [
    el("span", ["h3-kicker"], [text(first.value.slice(0, i))]),
    el("span", ["h-sep"], [text(": ")]),
    el("span", ["h3-title"], rest),
  ]
}

function isCloser(node) {
  if (!isTag(node, "p")) return false
  const first = node.children.find((c) => !(c.type === "text" && !c.value.trim()))
  return Boolean(first && isTag(first, "em") && /^bottoms out at/i.test(textOf(first).trim()))
}

export function rehypeReadingStructure() {
  return (tree) => {
    const out = []
    let section = null
    for (const node of tree.children) {
      if (node.type === "element") {
        if (isTag(node, "h2")) numberH2(node)
        if (isCloser(node)) {
          const cls = node.properties.className ?? []
          node.properties.className = [...cls, "closer"]
        }
        if (["h1", "h2", "hr"].includes(node.tagName) || isCloser(node)) section = null
        if (isTag(node, "h3")) {
          splitH3(node)
          section = el("section", ["sub"], [])
          out.push(section)
        }
      }
      ;(section ? section.children : out).push(node)
    }
    tree.children = out
  }
}
