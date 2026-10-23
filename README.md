# Translation

A tiny EN/TH language desk: type a phrase and each word found in an 8-word built-in dictionary is swapped for its
English or Thai pair. Unknown words stay as they are. Dictionary lookup only: no translation API, no model.

Live: https://translation.bookchaowalit.com (deployed by Vercel CLI; it can lag `main`, see `PRODUCT.md`).

## What it does not do

- No machine translation, translation API, batch processing or translation memory. No account. Nothing is saved.

## Run

```bash
npm ci
npm run dev
```

## Checks

```bash
npm test           # Vitest: dictionary lookup, MCP route, home page render, Sentry scrubbing
npm run lint
npm run typecheck
npm run build
```

CI (`.github/workflows/ci.yml`) runs the shared Node workflow (with a line-coverage gate) and the shared security
scan on every push and PR to `main`.

## Code map

- `lib/translation.ts`: the 8-entry `EN_TO_TH` dictionary, its reverse map and `translate()` (word by word, keeps
  spacing and punctuation, own keys only). Used by the page and the MCP route.
- `app/api/mcp/route.ts`: stateless JSON-RPC endpoint with `translate` and `get_dictionary` over that dictionary.
- `lib/sentry.ts` + `instrumentation*.ts`: error reporting to Sentry, errors only, personal data stripped; off when
  `NEXT_PUBLIC_SENTRY_DSN` is unset.
- `app/more-projects/page.tsx`: shared portfolio link page (copied per repository, not a package).
