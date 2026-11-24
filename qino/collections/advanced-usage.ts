import qino from "../"
import { docSchema } from "../schemas"

export const advancedUsageCollection = qino.defineCollection({
  directory: "advanced-usage",
  extension: ".mdx",
  schema: docSchema,
})
