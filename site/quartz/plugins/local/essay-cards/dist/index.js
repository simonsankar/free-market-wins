// ../../../../node_modules/github-slugger/index.js
var own = Object.hasOwnProperty;

// ../../../../node_modules/@quartz-community/utils/dist/index.js
import { jsxs, jsx, Fragment } from "preact/jsx-runtime";
import { h } from "preact";
function simplifySlug(fp) {
  const res = stripSlashes(trimSuffix(fp, "index"), true);
  return res.length === 0 ? "/" : res;
}
function joinSegments(...args) {
  if (args.length === 0) {
    return "";
  }
  let joined = args.filter((segment) => segment !== "" && segment !== "/").map((segment) => stripSlashes(segment)).join("/");
  const first = args[0];
  const last = args[args.length - 1];
  if (first?.startsWith("/")) {
    joined = "/" + joined;
  }
  if (last?.endsWith("/")) {
    joined = joined + "/";
  }
  return joined;
}
function endsWith(s, suffix) {
  return s === suffix || s.endsWith("/" + suffix);
}
function trimSuffix(s, suffix) {
  if (endsWith(s, suffix)) {
    s = s.slice(0, -suffix.length);
  }
  return s;
}
function stripSlashes(s, onlyStripPrefix) {
  if (s.startsWith("/")) {
    s = s.substring(1);
  }
  if (!onlyStripPrefix && s.endsWith("/")) {
    s = s.slice(0, -1);
  }
  return s;
}
function isFolderPath(fplike) {
  return fplike.endsWith("/") || endsWith(fplike, "index") || endsWith(fplike, "index.md") || endsWith(fplike, "index.html");
}
function pathToRoot(slug2) {
  let rootPath = slug2.split("/").filter((x) => x !== "").slice(0, -1).map((_) => "..").join("/");
  if (rootPath.length === 0) {
    rootPath = ".";
  }
  return rootPath;
}
function resolveRelative(current, target) {
  const res = joinSegments(pathToRoot(current), simplifySlug(target));
  return res;
}
var U200D = String.fromCharCode(8205);

// ../../../components/Date.tsx
import { jsx as jsx2 } from "preact/jsx-runtime";
function getDate(data) {
  if (!data.defaultDateType) {
    throw new Error(
      `Field 'defaultDateType' was not set. Ensure the CreatedModifiedDate plugin is configured with a 'defaultDateType' option. See https://quartz.jzhao.xyz/plugins/CreatedModifiedDate for more details.`
    );
  }
  return data.dates?.[data.defaultDateType];
}
function formatDate(d, locale = "en-US") {
  return d.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit"
  });
}
function Date({ date, locale }) {
  return /* @__PURE__ */ jsx2("time", { datetime: date.toISOString(), children: formatDate(date, locale) });
}

// ../../../components/PageList.tsx
import { jsx as jsx3, jsxs as jsxs2 } from "preact/jsx-runtime";
function byDateAndAlphabetical() {
  return (f1, f2) => {
    if (f1.dates && f2.dates) {
      return getDate(f2).getTime() - getDate(f1).getTime();
    } else if (f1.dates && !f2.dates) {
      return -1;
    } else if (!f1.dates && f2.dates) {
      return 1;
    }
    const f1Title = f1.frontmatter?.title.toLowerCase() ?? "";
    const f2Title = f2.frontmatter?.title.toLowerCase() ?? "";
    return f1Title.localeCompare(f2Title);
  };
}
function byDateAndAlphabeticalFolderFirst() {
  return (f1, f2) => {
    const f1IsFolder = isFolderPath(f1.slug ?? "");
    const f2IsFolder = isFolderPath(f2.slug ?? "");
    if (f1IsFolder && !f2IsFolder) return -1;
    if (!f1IsFolder && f2IsFolder) return 1;
    if (f1.dates && f2.dates) {
      return getDate(f2).getTime() - getDate(f1).getTime();
    } else if (f1.dates && !f2.dates) {
      return -1;
    } else if (!f1.dates && f2.dates) {
      return 1;
    }
    const f1Title = f1.frontmatter?.title.toLowerCase() ?? "";
    const f2Title = f2.frontmatter?.title.toLowerCase() ?? "";
    return f1Title.localeCompare(f2Title);
  };
}
var PageList = ({ cfg, fileData, allFiles, limit, sort }) => {
  const sorter = sort ?? byDateAndAlphabeticalFolderFirst();
  let list = allFiles.sort(sorter);
  if (limit) {
    list = list.slice(0, limit);
  }
  return /* @__PURE__ */ jsx3("ul", { class: "section-ul", children: list.map((page) => {
    const title = page.frontmatter?.title;
    const tags = page.frontmatter?.tags ?? [];
    return /* @__PURE__ */ jsx3("li", { class: "section-li", children: /* @__PURE__ */ jsxs2("div", { class: "section", children: [
      /* @__PURE__ */ jsx3("p", { class: "meta", children: page.dates && /* @__PURE__ */ jsx3(Date, { date: getDate(page), locale: cfg.locale }) }),
      /* @__PURE__ */ jsx3("div", { class: "desc", children: /* @__PURE__ */ jsx3("h3", { children: /* @__PURE__ */ jsx3(
        "a",
        {
          href: resolveRelative(fileData.slug, page.slug),
          class: "internal internal-link",
          children: title
        }
      ) }) }),
      /* @__PURE__ */ jsx3("ul", { class: "tags", children: tags.map((tag) => /* @__PURE__ */ jsx3("li", { children: /* @__PURE__ */ jsx3(
        "a",
        {
          class: "internal tag-link",
          href: resolveRelative(fileData.slug, `tags/${tag}`),
          children: tag
        }
      ) })) })
    ] }) });
  }) });
};
PageList.css = `
.section h3 {
  margin: 0;
}

.section > .tags {
  margin: 0;
}
`;

// components/index.tsx
import { Fragment as Fragment2, jsx as jsx4, jsxs as jsxs3 } from "preact/jsx-runtime";
function isEssay(page) {
  const slug2 = page.slug ?? "";
  return slug2.startsWith("essays/") && // Check the authored frontmatter date, not the resolved `.dates` object —
  // created-modified-date falls back to git/filesystem timestamps, so it's
  // always populated even for pages (like the fiction story bible) with no
  // frontmatter `date:` of their own.
  typeof page.frontmatter?.date === "string" && page.frontmatter?.unlisted !== true;
}
function categoryOf(slug2) {
  const segment = slug2.split("/")[1] ?? "";
  return segment.charAt(0).toUpperCase() + segment.slice(1);
}
var EssayCards = (opts) => {
  const limit = opts?.limit ?? 9;
  const Component = ({ cfg, fileData, allFiles }) => {
    if (fileData.slug !== "index") {
      return null;
    }
    const essays = allFiles.filter(isEssay).sort(byDateAndAlphabetical());
    const featured = essays.slice(0, limit);
    const older = essays.slice(limit);
    if (featured.length === 0) {
      return null;
    }
    return /* @__PURE__ */ jsxs3(Fragment2, { children: [
      /* @__PURE__ */ jsx4("div", { class: "essay-cards", children: featured.map((page) => {
        const dek = typeof page.description === "string" ? page.description : void 0;
        return /* @__PURE__ */ jsxs3("a", { class: "essay-card internal", href: resolveRelative(fileData.slug, page.slug), children: [
          /* @__PURE__ */ jsxs3("div", { class: "essay-card-meta", children: [
            /* @__PURE__ */ jsx4("span", { class: "essay-card-badge", children: categoryOf(page.slug) }),
            page.dates && /* @__PURE__ */ jsx4(Date, { date: getDate(page), locale: cfg.locale })
          ] }),
          /* @__PURE__ */ jsx4("h3", { children: page.frontmatter?.title }),
          dek && /* @__PURE__ */ jsx4("p", { class: "essay-card-dek", children: dek })
        ] });
      }) }),
      older.length > 0 && /* @__PURE__ */ jsxs3("div", { class: "essay-list-older", children: [
        /* @__PURE__ */ jsx4("h4", { children: "More essays" }),
        /* @__PURE__ */ jsx4("ul", { children: older.map((page) => /* @__PURE__ */ jsxs3("li", { children: [
          /* @__PURE__ */ jsx4("a", { class: "internal", href: resolveRelative(fileData.slug, page.slug), children: page.frontmatter?.title }),
          /* @__PURE__ */ jsx4("span", { class: "essay-list-badge", children: categoryOf(page.slug) }),
          page.dates && /* @__PURE__ */ jsx4(Date, { date: getDate(page), locale: cfg.locale })
        ] })) })
      ] })
    ] });
  };
  Component.displayName = "EssayCards";
  return Component;
};
export {
  EssayCards
};
