import type { NextApiRequest, NextApiResponse } from "next"
import { servePageMarkdown } from "@/lib/serve-page-markdown"
import { integrationsPage } from "../../../../../qino/items/pages"

// `/integrations.md`, and `/integrations` when `Accept` lists Markdown first. The
// page is the `integrations.mdx` overview; `/integrations/llms.txt` lists the section.
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return servePageMarkdown(req, res, () => integrationsPage.getPageMarkdown())
}
