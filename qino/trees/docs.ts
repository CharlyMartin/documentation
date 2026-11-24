import qino from "../"
import { markdownComponents } from "../markdown-components"
import { docSchema } from "../schemas"

export const docsTree = qino.defineTree({
  directory: "docs",
  extension: ".mdx",
  titleField: "title",
  schema: docSchema,
  pages: {
    index: "/docs",
    entry: "/docs/{slug}",
    title: "API Reference",
    markdownComponents,
  },
})
