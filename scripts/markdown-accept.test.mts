import assert from "node:assert/strict"
import { test } from "node:test"
import { LISTS_MARKDOWN_FIRST } from "../src/lib/markdown-accept"

const listsMarkdownFirst = new RegExp(LISTS_MARKDOWN_FIRST)

test("matches an Accept header that lists Markdown first", () => {
  for (const accept of [
    "text/markdown",
    "text/x-markdown",
    "text/markdown, text/html",
    "text/markdown;charset=utf-8",
    'text/markdown; variant="a;b,c", */*',
    "text/markdown;q=1",
    "text/markdown ; q = 0.5 ; charset=utf-8",
  ]) {
    assert.ok(listsMarkdownFirst.test(accept), accept)
  }
})

test("rejects HTML first, q=0 and malformed headers", () => {
  for (const accept of [
    "text/html",
    "text/html, text/markdown",
    "*/*",
    "text/markdown;q=0",
    "text/markdown;q=0.000",
    "text/markdown;q=2",
    'text/markdown; a="unterminated',
  ]) {
    assert.ok(!listsMarkdownFirst.test(accept), accept)
  }
})

// Next.js runs the match synchronously on each request, so a header that fails
// to match must not make the regex backtrack exponentially.
test("fails fast on long parameter lists", () => {
  for (const accept of [
    `text/markdown${"; a     ".repeat(5000)}"`,
    `text/markdown;q=1${"; a  ".repeat(5000)}"`,
    `text/markdown${";".repeat(5000)}"`,
  ]) {
    const start = performance.now()
    assert.ok(!listsMarkdownFirst.test(accept))
    assert.ok(performance.now() - start < 100, "took over 100ms")
  }
})
