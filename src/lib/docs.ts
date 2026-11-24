import { docsTree } from "../../qino/trees/docs"
import { advancedUsageCollection } from "../../qino/collections/advanced-usage"
import { integrationCollection } from "../../qino/collections/integrations"
import * as pages from "../../qino/items/pages"
import type { z } from "zod"
import type { docSchema } from "../../qino/schemas"

type Source = "docs" | "advanced-usage" | "integrations" | "page"

type Entry = z.infer<typeof docSchema> & { markdown: string }

export type Doc = Entry & {
  slug: string
  source: Source
  qinoSlug: string
}

export type Breadcrumb = { href: string; name: string }

function toDoc(
  // Strip qino's `_meta` from the doc.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  { _meta, ...entry }: Entry & { _meta: unknown },
  source: Source,
  qinoSlug: string,
  slug: string
) {
  return { ...entry, slug, source, qinoSlug }
}

export async function getAllDocs() {
  const [docs, advancedUsage, integrations, items] = await Promise.all([
    docsTree.getEntries(),
    advancedUsageCollection.getEntries(),
    integrationCollection.getEntries(),
    Promise.all(Object.values(pages).map((page) => page.getEntry())),
  ])

  return [
    ...items.map((entry) => {
      const qinoSlug = entry._meta.fileName.replace(/\.mdx$/, "")
      return toDoc(entry, "page", qinoSlug, `/${qinoSlug}`)
    }),
    ...advancedUsage.map((entry) =>
      toDoc(
        entry,
        "advanced-usage",
        entry._meta.slug,
        `/advanced-usage/${entry._meta.slug}`
      )
    ),
    ...integrations.map((entry) =>
      toDoc(
        entry,
        "integrations",
        entry._meta.slug,
        `/integrations/${entry._meta.slug}`
      )
    ),
    ...docs.map((entry) =>
      toDoc(entry, "docs", entry._meta.slug, `/docs/${entry._meta.slug}`)
    ),
  ]
}

/** The absolute URL of a doc's page Markdown. */
export function getMarkdownUrl(doc: Doc) {
  switch (doc.source) {
    case "docs":
      return docsTree.getMarkdownUrl(doc.qinoSlug)
    case "advanced-usage":
      return advancedUsageCollection.getMarkdownUrl(doc.qinoSlug)
    case "integrations":
      return integrationCollection.getMarkdownUrl(doc.qinoSlug)
    case "page": {
      // An item's slug is its file's basename.
      const page = Object.values(pages).find((item) =>
        item.getMarkdownUrl().endsWith(`/${doc.qinoSlug}.md`)
      )
      if (!page) throw new Error(`No item page for ${doc.slug}`)
      return page.getMarkdownUrl()
    }
  }
}

/** Ancestors of a doc, excluding the doc itself. */
export async function getBreadcrumbs(doc: Doc) {
  switch (doc.source) {
    case "docs": {
      const ancestors = await docsTree.getAncestorNodes(doc.qinoSlug)
      return [
        // `/docs` is a TSX page, not a content entry.
        { href: "/docs", name: "API" },
        ...ancestors.map((node) => ({
          href: `/docs/${node.slug}`,
          name: node.title,
        })),
      ]
    }
    case "advanced-usage": {
      const { title } = await pages.advancedUsagePage.getEntry()
      return [{ href: "/advanced-usage", name: title }]
    }
    case "integrations": {
      const { title } = await pages.integrationsPage.getEntry()
      return [{ href: "/integrations", name: title }]
    }
    case "page":
      return []
  }
}
