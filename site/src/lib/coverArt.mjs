// Procedural cover art for essay cards that don't have a manually-supplied
// `cover` frontmatter image. Deterministic per entry id (no Math.random) so
// a given essay always renders the same cover across builds, and colored
// exclusively with var(--secondary)/var(--tertiary)/var(--gray) so covers
// re-theme live with the site's light/dark toggle instead of being baked.

// Square — these render as a small left-side thumbnail on a list row now,
// not a wide card-top banner.
const W = 160
const H = 160

function hash32(str) {
  let h = 2166136261 >>> 0
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

// mulberry32 PRNG — small, deterministic, good enough for layout jitter.
function mulberry32(seed) {
  let a = seed
  return function () {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function accent(i) {
  return i % 2 === 0 ? "var(--secondary)" : "var(--tertiary)"
}

// Economics — concentric rings, like business-cycle/interest-rate curves.
function economicsPattern(rand) {
  const cx = W * (0.25 + rand() * 0.5)
  const cy = H * (0.3 + rand() * 0.5)
  const rings = 4 + Math.floor(rand() * 3)
  let out = ""
  for (let i = 0; i < rings; i++) {
    const r = 18 + i * (16 + rand() * 6)
    const opacity = Math.max(0.12, 0.55 - i * 0.08).toFixed(2)
    out += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}" fill="none" stroke="${accent(i)}" stroke-width="1.5" opacity="${opacity}" />`
  }
  return out
}

// Philosophy — angular fracture lines, like branching axioms.
function philosophyPattern(rand) {
  let out = ""
  const lines = 4 + Math.floor(rand() * 3)
  for (let i = 0; i < lines; i++) {
    let x = rand() * W * 0.3
    let y = rand() * H
    const points = [[x, y]]
    const segs = 3 + Math.floor(rand() * 3)
    for (let s = 0; s < segs; s++) {
      x += (rand() - 0.15) * W * 0.35
      y += (rand() - 0.5) * H * 0.7
      points.push([x, y])
    }
    const d = points.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ")
    out += `<polyline points="${d}" fill="none" stroke="${accent(i)}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="${(0.4 + rand() * 0.25).toFixed(2)}" />`
  }
  return out
}

// Dissects — blueprint grid + crosshair marks, technical-drawing feel.
function dissectsPattern(rand) {
  let out = ""
  const cols = 4
  const rows = 4
  const stepX = W / cols
  const stepY = H / rows
  for (let c = 0; c <= cols; c++) {
    out += `<line x1="${(c * stepX).toFixed(1)}" y1="0" x2="${(c * stepX).toFixed(1)}" y2="${H}" stroke="var(--gray)" stroke-width="0.5" opacity="0.16" />`
  }
  for (let r = 0; r <= rows; r++) {
    out += `<line x1="0" y1="${(r * stepY).toFixed(1)}" x2="${W}" y2="${(r * stepY).toFixed(1)}" stroke="var(--gray)" stroke-width="0.5" opacity="0.16" />`
  }
  const marks = 5 + Math.floor(rand() * 4)
  for (let i = 0; i < marks; i++) {
    const x = rand() * W
    const y = rand() * H
    const s = 5 + rand() * 5
    out += `<g stroke="${accent(i)}" stroke-width="1.5" opacity="${(0.55 + rand() * 0.3).toFixed(2)}"><line x1="${(x - s).toFixed(1)}" y1="${y.toFixed(1)}" x2="${(x + s).toFixed(1)}" y2="${y.toFixed(1)}" /><line x1="${x.toFixed(1)}" y1="${(y - s).toFixed(1)}" x2="${x.toFixed(1)}" y2="${(y + s).toFixed(1)}" /></g>`
  }
  return out
}

// Fiction — overlapping soft waves, narrative flow.
function fictionPattern(rand) {
  let out = ""
  const waves = 3
  for (let i = 0; i < waves; i++) {
    const baseY = H * (0.28 + i * 0.24) + rand() * 10
    const amp = 14 + rand() * 14
    const c1x = W * 0.25
    const c1y = baseY + (rand() - 0.5) * amp * 2
    const c2x = W * 0.75
    const c2y = baseY - (rand() - 0.5) * amp * 2
    out += `<path d="M0 ${baseY.toFixed(1)} C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${W} ${baseY.toFixed(1)}" fill="none" stroke="${accent(i)}" stroke-width="2" opacity="${(0.35 + rand() * 0.3).toFixed(2)}" stroke-linecap="round" />`
  }
  return out
}

// Fallback for any essay outside the four known top-level categories.
function scatterPattern(rand) {
  let out = ""
  const dots = 22
  for (let i = 0; i < dots; i++) {
    const x = rand() * W
    const y = rand() * H
    const r = 1.5 + rand() * 3
    out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${accent(i)}" opacity="${(0.3 + rand() * 0.4).toFixed(2)}" />`
  }
  return out
}

const PATTERNS = {
  economics: economicsPattern,
  philosophy: philosophyPattern,
  dissects: dissectsPattern,
  fiction: fictionPattern,
}

export function generateCover({ id, category }) {
  const seed = hash32(`${category ?? ""}:${id}`)
  const rand = mulberry32(seed)
  const patternFn = PATTERNS[(category ?? "").toLowerCase()] ?? scatterPattern

  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
    <rect width="${W}" height="${H}" fill="var(--lightgray)" />
    ${patternFn(rand)}
  </svg>`
}
