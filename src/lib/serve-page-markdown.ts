import type { NextApiRequest, NextApiResponse } from "next"
import { type LoadPageMarkdown, negotiateMarkdown } from "@qino/cms"

/**
 * Answers a request that `next.config.ts` rewrote to an API route under
 * `/api/md`. The rewrite keeps the request's own URL, read as the page's
 * Markdown URL, so it always gets Markdown: the rewrite already matched
 * `Accept` with a regex.
 *
 * Pages Router API routes, rather than App Router route handlers, keep
 * `src/pages/404.tsx` as the site's HTML 404: an `app` folder would answer
 * unmatched routes with its own.
 */
export async function servePageMarkdown(
  req: NextApiRequest,
  res: NextApiResponse,
  load: LoadPageMarkdown
) {
  const url = new URL(
    req.url ?? "/",
    `${readProtocol(req)}://${req.headers.host ?? "localhost"}`
  )
  if (!url.pathname.endsWith(".md")) url.pathname += ".md"

  const headers = new Headers()
  for (const [key, value] of Object.entries(req.headers)) {
    if (typeof value == "string") headers.set(key, value)
    else if (value) headers.set(key, value.join(", "))
  }

  // Never `null`: a path ending in `.md` always wants Markdown.
  const response = await negotiateMarkdown(
    new Request(url, { method: req.method, headers }),
    load
  )
  if (!response) {
    res.status(500).end()
    return
  }

  res.status(response.status)
  response.headers.forEach((value, key) => res.setHeader(key, value))
  res.end(await response.text())
}

/**
 * The protocol the client used. Behind a proxy such as Vercel's, the
 * connection to Next is plain HTTP and `x-forwarded-proto` holds the original
 * one, so links on the request's origin, like the Markdown 404's link to
 * `/llms.txt`, keep `https`.
 */
function readProtocol(req: NextApiRequest) {
  const forwarded = req.headers["x-forwarded-proto"]
  const first = (Array.isArray(forwarded) ? forwarded[0] : forwarded)
    ?.split(",")[0]
    ?.trim()
  return first == "https" || first == "http" ? first : "http"
}

/** A route param that Next may hand over as a string or a list. */
export function readParam(value: string | Array<string> | undefined) {
  return Array.isArray(value) ? value.join("/") : (value ?? "")
}
