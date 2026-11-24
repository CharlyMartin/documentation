import type { NextConfig } from "next"
import withBundleAnalyzer from "@next/bundle-analyzer"
import { markdownFirstAccept } from "./src/lib/markdown-accept"

// Agent-ready Markdown, after qino's Next.js recipe:
// https://www.qino.works/docs/guide/agent-ready-content/next-js

// Doc pages with Markdown, as `qino/items/pages.ts` declares them. A slug never
// holds a `.`, which keeps Markdown URLs out of the page patterns.
const TOP_LEVEL_PAGE = "/:page(get-started|faqs|ts|migrate-v7-to-v8)"
const SECTIONS = ["integrations", "advanced-usage"]
const DOC_PAGE = "/docs/:slug([^.]+)"

// The page's path, its Markdown URL, and the route handler that answers both.
// `markdownSource` matches the Markdown URL when its slug spans segments.
type MarkdownPage = {
  source: string
  markdownUrl: string
  markdownSource?: string
  handler: string
}
const markdownPages: Array<MarkdownPage> = [
  {
    source: TOP_LEVEL_PAGE,
    markdownUrl: "/:page.md",
    markdownSource: `${TOP_LEVEL_PAGE}.md`,
    handler: "/api/md/:page",
  },
  { source: "/docs", markdownUrl: "/docs.md", handler: "/api/md/docs" },
  {
    source: DOC_PAGE,
    markdownUrl: "/docs/:slug.md",
    markdownSource: "/docs/:slug+.md",
    handler: "/api/md/docs/:slug+",
  },
  ...SECTIONS.flatMap((section) => [
    {
      source: `/${section}`,
      markdownUrl: `/${section}.md`,
      handler: `/api/md/${section}`,
    },
    {
      source: `/${section}/:slug([^/.]+)`,
      markdownUrl: `/${section}/:slug.md`,
      handler: `/api/md/${section}/:slug`,
    },
  ]),
]

const nextConfig: NextConfig = {
  typescript: {
    /**
     * Type checks run separately via `pnpm typecheck:ci` in `.github/workflows/ci.yml`
     *
     * @see https://github.com/react-hook-form/documentation/pull/1107
     */
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  // The API routes under `/api/md` render on request and read content then.
  // `/api/md` also reads `public/index.md`, which `qino build` writes.
  outputFileTracingIncludes: {
    "/api/md": ["./public/index.md"],
    "/api/md/**": ["./src/content/**/*"],
  },
  async rewrites() {
    return {
      // `beforeFiles` runs before prerendered pages, which would answer first.
      beforeFiles: [
        { source: "/", has: markdownFirstAccept, destination: "/api/md" },
        ...markdownPages.flatMap(
          ({ source, markdownUrl, markdownSource, handler }) => [
            { source: markdownSource ?? markdownUrl, destination: handler },
            { source, has: markdownFirstAccept, destination: handler },
          ]
        ),
      ],
      // `fallback` runs after pages, public files and dynamic routes, so it
      // only matches paths nothing answers: Markdown requests for them get the
      // Markdown 404.
      fallback: [
        { source: "/:path(.+\\.md)", destination: "/api/md/missing" },
        {
          source: "/:path*",
          has: markdownFirstAccept,
          destination: "/api/md/missing",
        },
      ],
    }
  },
  async headers() {
    const pages: Array<{
      source: string
      markdownUrl: string
      links?: Array<string>
    }> = [
      {
        source: "/",
        markdownUrl: "/index.md",
        links: ['</llms.txt>; rel="describedby"'],
      },
      ...markdownPages,
    ]
    return pages.map(({ source, markdownUrl, links = [] }) => ({
      source,
      headers: [
        {
          key: "Link",
          value: [
            `<${markdownUrl}>; rel="alternate"; type="text/markdown"`,
            ...links,
          ].join(", "),
        },
        // The same URL answers HTML or Markdown, by `Accept`.
        { key: "Vary", value: "Accept" },
      ],
    }))
  },
  async redirects() {
    const legacySite =
      "https://react-hook-form-website-git-leagcy-hook-form.vercel.app"
    // Locale prefixes from the old Gatsby site (English had no prefix).
    const lang = ":lang(zh|jp|kr|es|pt|ru)"

    return [
      {
        source: "/:path(migrate-v5-to-v6|migrate-v6-to-v7)",
        destination: `${legacySite}/:path`,
        permanent: true,
      },
      {
        source: "/:version(v5|v6)/:path*",
        destination: `${legacySite}/:version/:path*`,
        permanent: true,
      },
      // The API reference moved from /api/* to /docs/*; keep old backlinks alive.
      { source: "/api", destination: "/docs", permanent: true },
      { source: "/api/:path*", destination: "/docs/:path*", permanent: true },
      { source: `/${lang}`, destination: "/", permanent: true },
      { source: `/${lang}/api`, destination: "/docs", permanent: true },
      {
        source: `/${lang}/api/:path*`,
        destination: "/docs/:path*",
        permanent: true,
      },
      { source: `/${lang}/:path*`, destination: "/:path*", permanent: true },
    ]
  },
}

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})

export default bundleAnalyzer(nextConfig)
