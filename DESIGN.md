# Design direction

Translation is a bilingual language desk: source and target face each other
across a marked rail, with the direction always visible before typing.

- Palette: washi cream, indigo ink, vermilion direction marks, and warm gray
  registration lines.
- Type: Bricolage Grotesque gives the Latin interface a distinct editorial
  voice; Noto Sans Thai keeps Thai source and output legible.
- Form: language rail, facing text panes, swap mark, and explicit vocabulary
  count instead of generic form cards.
- Content truth: this is a small dictionary lookup demo. Unknown words stay
  unchanged and no production NMT capability is implied.
- Responsive rule: the two panes stack with the direction mark between them;
  both labels and language direction remain visible.


---

## Storybook

Storybook 10 (`@storybook/nextjs-vite`) shows this design system with the app's real CSS, tokens and fonts.

```bash
npm run storybook        # http://localhost:6006
npm run build-storybook  # static build in storybook-static/ (CI: .github/workflows/storybook.yml)
```

- **Foundations/Tokens** reads every CSS custom property the app defines at runtime, so it never drifts from the code.
- **Design/DESIGN.md** renders this file.
- **Components/**, **Sections/** and **Pages/** show the UI with mock data only (no network, analytics off).
- Toolbar: locale, theme (light / dark, when the app has a dark theme), viewports 320 / 375 / 768 / 1440. The a11y panel runs axe (WCAG 2.2 AA).
- Rule: a new shared component or page section ships with a story in `stories/`.
