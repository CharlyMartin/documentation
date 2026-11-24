import type { NextApiRequest, NextApiResponse } from "next"
import { servePageMarkdown } from "@/lib/serve-page-markdown"

// Markdown requests for paths nothing answers, from the `fallback` rewrites.
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return servePageMarkdown(req, res, () => null)
}
