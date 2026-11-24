import type { NextApiRequest, NextApiResponse } from "next"
import { readParam, servePageMarkdown } from "@/lib/serve-page-markdown"
import {
  faqsPage,
  getStartedPage,
  migrateV7ToV8Page,
  tsPage,
} from "../../../../qino/items/pages"

// Top-level doc pages, by path.
const PAGES = {
  faqs: faqsPage,
  "get-started": getStartedPage,
  "migrate-v7-to-v8": migrateV7ToV8Page,
  ts: tsPage,
}

// `/<page>.md`, and `/<page>` when `Accept` lists Markdown first.
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const page = readParam(req.query.page)
  const item = Object.hasOwn(PAGES, page)
    ? PAGES[page as keyof typeof PAGES]
    : undefined
  return servePageMarkdown(req, res, () => item?.getPageMarkdown() ?? null)
}
