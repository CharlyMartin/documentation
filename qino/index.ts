import { initQino } from "@qino/cms"

export default initQino({
  contentFolder: "src/content",
  mediaFolder: "public",
  // The production origin, as `SITE_URL` in `src/components/seo.tsx`.
  siteUrl: "https://react-hook-form.com",
  cli: {
    check: { localAssetReferences: false },
    build: { llmsTxt: { sections: true } },
  },
})
