# Translation — Product truth

> Inferred from the code and copy (no user interview). Checked against the portfolio card claims review
> (`portfolio-site-web/docs/audits/CARD-CLAIMS-REVIEW-2026-10.md`, row `translation`, evidence Live→Prototype) on
> 2026-10-23.

## What it is

A client-only demo of an English/Thai "language desk" over an 8-word hard-coded dictionary (hello, world, portfolio,
developer, project, thank, you, today).

## Who it is for

A portfolio visitor who wants to see a small bilingual UI with facing source and target panes.

## What works today

1. Pick EN → TH or TH → EN (each loads a sample phrase), or type your own text.
2. Each whitespace-separated word in the dictionary is replaced (case-insensitive for English, punctuation kept);
   unknown words and spacing stay unchanged. Input is capped at 5000 characters (textarea limit; the MCP route
   rejects longer text).
3. Swap flips the direction and moves the current translation into the source pane.
4. `/api/mcp` answers JSON-RPC with `translate` and `get_dictionary` over the same dictionary.
5. Front-end and server errors go to Sentry (errors only, personal data stripped) when `NEXT_PUBLIC_SENTRY_DSN` is set.

## What does not work (and must not be claimed)

- No translation API, machine translation, batch processing or translation memory (claims removed from the portfolio
  card in the 2026-10 review). Grammar and word order are not handled.
- No storage, account or sync; nothing survives a reload. No product analytics.

## Live URL and deploy state

- Live: https://translation.bookchaowalit.com (HTTP 200 on 2026-10-23).
- The Vercel project `bookchaowalit-translation-frontend` is deployed only by CLI (last production 2026-10-23 12:01
  +07, the CVE patch, commit 7c4902c) and its Git link names the old repository
  (`bookchaowalit/bookchaowalit-translation-frontend`), so a push to `main` does not deploy. The live site lags
  `main` (no Sentry, old template MCP route, no punctuation handling) until the owner reconnects Vercel Git to this
  repository (owner action D9). `NEXT_PUBLIC_SENTRY_DSN` is already set on the Vercel project (Sentry project
  `ai-translation-web`, org `personal-yu0`).

## Boundaries

- Browser-only apart from the stateless `/api/mcp` route.

## Known limits

- At 375x667 the intro, direction row, Swap and the source card push the translation card below the first screen even with the sample text (DESIGN.md says both panes fit); pre-existing layout, left for a later App-shell layout pass (Codex review 2026-11-20, ai-translation-web-b9a6ef8c52.md).
- The unknown-words live region updates on every keystroke, so a screen reader may announce the list repeatedly while typing (not debounced) (Codex review 2026-11-20, ai-translation-web-dd76516640.md).
