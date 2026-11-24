import type { NextApiRequest, NextApiResponse } from "next"
import { readParam, servePageMarkdown } from "@/lib/serve-page-markdown"
import { advancedUsageCollection } from "../../../../../qino/collections/advanced-usage"

// `/advanced-usage/<slug>.md`, and `/advanced-usage/<slug>` when `Accept` lists Markdown
// first.
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const slug = readParam(req.query.slug)
  return servePageMarkdown(req, res, () =>
    advancedUsageCollection.getPageMarkdown(slug)
  )
}
