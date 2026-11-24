import type { PageMarkdownComponent, PageMarkdownPropValue } from "@qino/cms"

/**
 * Turns the site's MDX components into plain Markdown in page Markdown, the
 * `.md` URLs, `llms-full.txt` and the Accept-negotiated answers.
 */

const ADMONITION_LABELS: Record<string, string> = {
  important: "Important",
  info: "Info",
  note: "Note",
  warning: "Warning",
  danger: "Danger",
  tip: "Tip",
}

const escapeHtml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

const asString = (value: PageMarkdownPropValue | undefined) =>
  typeof value == "string" ? value : undefined

const quote = (markdown: string) =>
  markdown
    .split("\n")
    .map((line) => (line ? `> ${line}` : ">"))
    .join("\n")

// `{ value: 'number', message: 'string' }` -> `{ value: number, message: string }`
function formatObject(value: PageMarkdownPropValue | undefined) {
  if (!value || typeof value != "object" || Array.isArray(value)) return null
  const pairs = Object.entries(value).map(([key, type]) => `${key}: ${type}`)
  return `{ ${pairs.join(", ")} }`
}

// A code block's `sandbox="…"` playground, as a link: Markdown renderers
// don't show a fence's attributes.
function sandboxLink(fenceLine: string) {
  const url = fenceLine.match(/\ssandbox="([^"]+)"/)?.[1]
  if (!url) return null
  const name = url.includes("expo") ? "Expo Snack" : "CodeSandbox"
  return `[Open in ${name}](${url})`
}

// Labels each code block in a tab group with its tab's name, and links its
// playground.
function labelTabs(children: string, labels: Array<string>) {
  let fence: string | null = null
  let index = 0
  const lines = []
  for (const line of children.split("\n")) {
    const open = line.match(/^\s*(`{3,}|~{3,})/)
    if (fence) {
      if (line.trim() == fence) fence = null
    } else if (open) {
      fence = open[1]
      const label = labels[index++]
      if (label) lines.push(`**${label}**`, "")
      const link = sandboxLink(line)
      if (link) lines.push(link, "")
    }
    lines.push(line)
  }
  return lines.join("\n")
}

const TypeText: PageMarkdownComponent = ({ props, children }) => {
  const text = children.trim()
  // Keep links and code spans as they are.
  const plain =
    text.includes("](") || text.includes("<") || text.startsWith("`")
  const type = plain ? text : `\`${text}\``
  // `pre` types follow a name with no space, as in `maxLength`<TypeText pre>:
  // without one, the two code spans would run together.
  return props.pre ? ` ${type}` : type
}

const Admonition: PageMarkdownComponent = ({ props, children }) => {
  const type = asString(props.type) ?? "note"
  const label = ADMONITION_LABELS[type] ?? type
  const title = asString(props.title)
  const heading = `**${title ? `${label}: ${title}` : label}**`
  return quote(`${heading}\n\n${children.trim()}`)
}

const TabGroup: PageMarkdownComponent = ({ props, children }) => {
  const labels = Array.isArray(props.buttonLabels)
    ? props.buttonLabels.filter((label) => typeof label == "string")
    : []
  return labelTabs(children.trim(), labels)
}

const CodeArea: PageMarkdownComponent = ({ props }) => {
  const code = asString(props.rawData)
  if (code == undefined) return null
  // HTML rather than a fence, as some sit in table cells.
  return `<pre><code>${escapeHtml(code).split("\n").join("<br/>")}</code></pre>`
}

const NextStep: PageMarkdownComponent = ({ props, children }) => {
  const title = asString(props.title)
  const href = asString(props.href)
  if (!title || !href) return null
  const summary = children.trim().replace(/\s*\n\s*/g, " ")
  return `- [${title}](${href})${summary ? `\n  ${summary}` : ""}`
}

export const markdownComponents = {
  TypeText,
  Since: ({ props }) => {
    const version = asString(props.version)
    return version ? `_(since v${version})_` : ""
  },
  Admonition,
  TabGroup,
  CodeArea,
  PrettyObject: ({ props }) => formatObject(props.value),
  Troubleshoot: ({ children }) => children.trim(),
  Why: ({ children }) => `**Why it happens:**\n\n${children.trim()}`,
  Fix: ({ children }) => `**Fix:**\n\n${children.trim()}`,
  NextSteps: ({ children }) => children.trim(),
  NextStep,
  YouTube: ({ props }) => {
    const id = asString(props.youTubeId)
    return id ? `[Watch on YouTube](https://www.youtube.com/watch?v=${id})` : ""
  },
  CodeSandbox: ({ props }) => {
    const url = asString(props.url)
    return url ? `[CodeSandbox](${url})` : ""
  },
  Popup: ({ props }) => {
    const message = asString(props.message)
    return message ? `(${message})` : ""
  },
  // Inserted by `rehypeTipsSections`, never written in content.
  Tips: ({ children }) => children.trim(),
  // Client-side redirects for old anchors: nothing to read.
  LegacyAnchorRedirect: () => "",
} satisfies Record<string, PageMarkdownComponent>
