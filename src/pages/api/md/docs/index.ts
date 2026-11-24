import type { NextApiRequest, NextApiResponse } from "next"
import { servePageMarkdown } from "@/lib/serve-page-markdown"
import { docsTree } from "../../../../../qino/trees/docs"

// `/docs.md`, and `/docs` when `Accept` lists Markdown first.
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return servePageMarkdown(req, res, () => docsTree.getPageMarkdown())
}
