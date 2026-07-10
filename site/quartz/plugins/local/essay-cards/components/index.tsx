import { resolveRelative } from "../../../../util/path"
import { QuartzPluginData } from "../../../../plugins/vfile"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../../../../components/types"
import { Date as DateComponent, getDate } from "../../../../components/Date"
import { byDateAndAlphabetical } from "../../../../components/PageList"

type Options = {
  limit?: number
}

function isEssay(page: QuartzPluginData): boolean {
  const slug = page.slug ?? ""
  return (
    slug.startsWith("essays/") &&
    // Check the authored frontmatter date, not the resolved `.dates` object —
    // created-modified-date falls back to git/filesystem timestamps, so it's
    // always populated even for pages (like the fiction story bible) with no
    // frontmatter `date:` of their own.
    typeof page.frontmatter?.date === "string" &&
    page.frontmatter?.unlisted !== true
  )
}

function categoryOf(slug: string): string {
  const segment = slug.split("/")[1] ?? ""
  return segment.charAt(0).toUpperCase() + segment.slice(1)
}

export const EssayCards: QuartzComponentConstructor<Options> = (opts?: Options) => {
  const limit = opts?.limit ?? 9

  const Component: QuartzComponent = ({ cfg, fileData, allFiles }: QuartzComponentProps) => {
    if (fileData.slug !== "index") {
      return null
    }

    const essays = allFiles.filter(isEssay).sort(byDateAndAlphabetical())
    const featured = essays.slice(0, limit)
    const older = essays.slice(limit)

    if (featured.length === 0) {
      return null
    }

    return (
      <>
        <div class="essay-cards">
          {featured.map((page) => {
            const dek = typeof page.description === "string" ? page.description : undefined
            return (
              <a class="essay-card internal" href={resolveRelative(fileData.slug!, page.slug!)}>
                <div class="essay-card-meta">
                  <span class="essay-card-badge">{categoryOf(page.slug!)}</span>
                  {page.dates && <DateComponent date={getDate(page)!} locale={cfg.locale} />}
                </div>
                <h3>{page.frontmatter?.title}</h3>
                {dek && <p class="essay-card-dek">{dek}</p>}
              </a>
            )
          })}
        </div>
        {older.length > 0 && (
          <div class="essay-list-older">
            <h4>More essays</h4>
            <ul>
              {older.map((page) => (
                <li>
                  <a class="internal" href={resolveRelative(fileData.slug!, page.slug!)}>
                    {page.frontmatter?.title}
                  </a>
                  <span class="essay-list-badge">{categoryOf(page.slug!)}</span>
                  {page.dates && <DateComponent date={getDate(page)!} locale={cfg.locale} />}
                </li>
              ))}
            </ul>
          </div>
        )}
      </>
    )
  }

  Component.displayName = "EssayCards"
  return Component
}
