import type { NextApiRequest, NextApiResponse } from "next"
import { readParam, servePageMarkdown } from "@/lib/serve-page-markdown"
import { docsTree } from "../../../../../qino/trees/docs"

// `/docs/<slug>.md`, and `/docs/<slug>` when `Accept` lists Markdown first.
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const slug = readParam(req.query.slug)
  return servePageMarkdown(req, res, () => docsTree.getPageMarkdown(slug))
}
