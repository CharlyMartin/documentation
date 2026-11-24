import qino from "../"
import { markdownComponents } from "../markdown-components"
import { docSchema } from "../schemas"

export const advancedUsagePage = qino.defineItem({
  file: "advanced-usage.mdx",
  schema: docSchema,
  page: { path: "/advanced-usage", markdownComponents },
})

export const faqsPage = qino.defineItem({
  file: "faqs.mdx",
  schema: docSchema,
  page: { path: "/faqs", markdownComponents },
})

export const getStartedPage = qino.defineItem({
  file: "get-started.mdx",
  schema: docSchema,
  page: { path: "/get-started", markdownComponents },
})

export const integrationsPage = qino.defineItem({
  file: "integrations.mdx",
  schema: docSchema,
  page: { path: "/integrations", markdownComponents },
})

export const migrateV7ToV8Page = qino.defineItem({
  file: "migrate-v7-to-v8.mdx",
  schema: docSchema,
  page: { path: "/migrate-v7-to-v8", markdownComponents },
})

export const tsPage = qino.defineItem({
  file: "ts.mdx",
  schema: docSchema,
  page: { path: "/ts", markdownComponents },
})
