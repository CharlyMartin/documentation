import qino from "../"
import { markdownComponents } from "../markdown-components"
import { docSchema } from "../schemas"

export const advancedUsageCollection = qino.defineCollection({
  directory: "advanced-usage",
  extension: ".mdx",
  schema: docSchema,
  pages: {
    index: "/advanced-usage",
    entry: "/advanced-usage/{slug}",
    title: "Advanced",
    markdownComponents,
  },
})
