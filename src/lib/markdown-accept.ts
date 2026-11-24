/**
 * The `Accept` header match that `next.config.ts` rewrites on, after qino's
 * Next.js recipe:
 * https://www.qino.works/docs/guide/agent-ready-content/next-js
 *
 * Next.js runs it synchronously on every request to a matched path, so it must
 * match in linear time. Each piece of input can be read by one part of the
 * pattern only: whitespace before a parameter's `;` belongs to the previous
 * parameter's value, never to a separator as well, so a header that fails to
 * match can't make the engine backtrack through every way of splitting it.
 */

// A parameter's value, whose quoted strings can hold `,` and `;`.
const PARAM_VALUE = String.raw`(?:[^;,"]|"(?:[^"\\]|\\.)*")*`

// A range's parameters other than q. Only the first `;` takes leading
// whitespace: after it, the previous value has already read any.
const OTHER_PARAMS = String.raw`(?:\s*(?:;(?!\s*[qQ]\s*=)${PARAM_VALUE})+)?`

// RFC 9110's qvalue, above 0.
const QVALUE_ABOVE_0 = String.raw`(?:1(?:\.0{0,3})?|0\.(?!0{1,3}\s*(?:[;,]|$))\d{1,3})(?=\s*(?:[;,]|$))`

/**
 * An `Accept` header whose first range is Markdown, in lowercase, with a
 * well-formed q-value above 0 or none. A regex can't weigh q-values: where they
 * reorder the ranges, as in `text/markdown;q=0.5, text/html`, it disagrees with
 * `negotiateMarkdown`.
 */
export const LISTS_MARKDOWN_FIRST = String.raw`^text/(?:x-)?markdown${OTHER_PARAMS}(?:\s*;\s*[qQ]\s*=\s*${QVALUE_ABOVE_0}${OTHER_PARAMS})?\s*(?:,.*)?$`

/** A rewrite's `has` condition: the request's `Accept` lists Markdown first. */
export const markdownFirstAccept = [
  { type: "header" as const, key: "accept", value: LISTS_MARKDOWN_FIRST },
]
