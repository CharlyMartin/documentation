import { readFile } from "node:fs/promises"
import { join } from "node:path"
import type { NextApiRequest, NextApiResponse } from "next"
import { servePageMarkdown } from "@/lib/serve-page-markdown"

// `/` when `Accept` lists Markdown first. `qino build` writes the homepage's
// Markdown, built from `src/content/llms.md`, to `public/index.md`.
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return servePageMarkdown(req, res, () =>
    readFile(join(process.cwd(), "public/index.md"), "utf8")
  )
}
