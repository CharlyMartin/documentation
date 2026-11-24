/**
 * Generates /sitemap.xml for crawlers from the docs qino reads, plus the
 * pages outside the content folder.
 *
 * Page Markdown, llms.txt and llms-full.txt for agents come from qino: see
 * `qino/index.ts` and the API routes under `src/pages/api/md`.
 */
import { writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { type Doc, getAllDocs } from "../src/lib/docs"

const SITE_URL = "https://react-hook-form.com"
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const PUBLIC_DIR = join(ROOT, "public")

// Mirrors the sidebar order in the site navigation.
const SIDEBAR_ORDER = [
  "getStartedLinks",
  "integrationLinks",
  "apiLinks",
  "tsLinks",
  "advancedLinks",
  "faqLinks",
  "migrateV7ToV8Links",
]

function sortDocs(docs: Array<Doc>) {
  return [...docs].sort(
    (a, b) =>
      SIDEBAR_ORDER.indexOf(a.sidebar) - SIDEBAR_ORDER.indexOf(b.sidebar) ||
      a.slug.localeCompare(b.slug)
  )
}

// Pages outside the content folder.
const STATIC_PATHS = [
  "/",
  "/get-started",
  "/docs",
  "/guides",
  "/ts",
  "/advanced-usage",
  "/faqs",
  "/integrations",
  "/migrate-v7-to-v8",
  "/dev-tools",
  "/form-builder",
  "/about-us",
  "/media",
  "/sponsors",
  "/resources",
  "/resources/3rd-party-bindings",
  "/resources/articles",
  "/resources/newsletters",
  "/resources/videos",
]

function renderSitemap(docs: Array<Doc>) {
  const paths = Array.from(
    new Set([...STATIC_PATHS, ...docs.map((doc) => doc.slug)])
  )

  const urls = paths
    .map(
      (path) => `  <url>
    <loc>${SITE_URL}${path}</loc>
  </url>`
    )
    .join("\n")

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`
}

async function main() {
  const docs = sortDocs(await getAllDocs())
  writeFileSync(join(PUBLIC_DIR, "sitemap.xml"), renderSitemap(docs))
  console.log(`Generated sitemap.xml with ${docs.length} docs`)
}

await main()
