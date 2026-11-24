import qino from "../"
import { markdownComponents } from "../markdown-components"
import { docSchema } from "../schemas"

export const integrationCollection = qino.defineCollection({
  directory: "integrations",
  extension: ".mdx",
  schema: docSchema,
  pages: {
    index: "/integrations",
    entry: "/integrations/{slug}",
    title: "Integrations",
    markdownComponents,
  },
})
