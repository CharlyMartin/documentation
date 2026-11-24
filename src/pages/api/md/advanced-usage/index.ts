import type { NextApiRequest, NextApiResponse } from "next"
import { servePageMarkdown } from "@/lib/serve-page-markdown"
import { advancedUsagePage } from "../../../../../qino/items/pages"

// `/advanced-usage.md`, and `/advanced-usage` when `Accept` lists Markdown first. The
// page is the `advanced-usage.mdx` overview; `/advanced-usage/llms.txt` lists the section.
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return servePageMarkdown(req, res, () => advancedUsagePage.getPageMarkdown())
}
