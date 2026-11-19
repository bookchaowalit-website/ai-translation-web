# Translation — Design

Since 2026-11-19 the demo uses the shared **App shell** (see `APP-SHELL.md`; `app/app-shell.css` and
`components/app-shell.tsx` are copied byte for byte from productivity-ideas-web). It replaced the earlier
"bilingual customs-stamp desk" look, whose vermilion 10px labels (3.05:1), grey nav and placeholders under
4.5:1, 9–10px letter-spaced labels, 34–40px direction and Swap buttons that wrapped on phones, 70px phone
headline and silent pass-through of unknown words failed the design floor (review 2026-11-11).

- Direction is a 44px segmented control (EN → TH / TH → EN, no wrapping) with a plain **Swap direction and text**.
- Two cards (side by side from 900px): source with a character count, translation (read-only). Both panes sit in
  the first viewport at 375px and 1440px.
- Words the dictionary does not know are named under the source ("Not in the dictionary, left unchanged: …").
- **Words it knows** lists the whole 8-word vocabulary as 44px chips; tapping one adds it to the source.
- Geist for Latin text with Noto Sans Thai next in the stack (both via `next/font`), and `lang` set on each pane.
- Honesty: a grey pill says "Dictionary lookup · no AI model, no API"; nothing is saved or sent.

Floor: text ≥ 12px, controls ≥ 44px, 4.5:1 text contrast in light and dark, 3px focus ring, forced-colors
support, no horizontal scroll at 320px. `/more-projects` redirects (308) to https://bookchaowalit.com/ and the
footer links there. Canonical domain, robots.txt and sitemap.xml: https://translation.bookchaowalit.com.
