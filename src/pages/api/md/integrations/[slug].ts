import type { NextApiRequest, NextApiResponse } from "next"
import { readParam, servePageMarkdown } from "@/lib/serve-page-markdown"
import { integrationCollection } from "../../../../../qino/collections/integrations"

// `/integrations/<slug>.md`, and `/integrations/<slug>` when `Accept` lists Markdown
// first.
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const slug = readParam(req.query.slug)
  return servePageMarkdown(req, res, () =>
    integrationCollection.getPageMarkdown(slug)
  )
}
