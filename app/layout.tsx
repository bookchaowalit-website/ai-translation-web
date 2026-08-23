import type { Metadata } from "next";
import { Bricolage_Grotesque, Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const languageDisplay = Bricolage_Grotesque({ variable: "--font-language-display", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const languageThai = Noto_Sans_Thai({ variable: "--font-language-thai", subsets: ["latin", "thai"], weight: ["400", "500", "600", "700"] });
export const metadata: Metadata = { title: "Translation | Bookchaowalit", description: "A tiny dictionary-based EN/TH translation workbench.", authors: [{ name: "Bookchaowalit", url: "https://bookchaowalit.com" }], metadataBase: new URL("https://bookchaowalit.com"), robots: { index: true, follow: true } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en" className={`${languageDisplay.variable} ${languageThai.variable}`}><body className="antialiased"><span hidden aria-hidden="true" dangerouslySetInnerHTML={{ __html: "<!-- THESIS: bilingual language desk with facing source and target. OWN-WORLD: washi cream, indigo ink, vermilion direction marks, Thai-aware type. STORY: choose direction, write a phrase, read the bounded dictionary output. FIRST VIEWPORT: language rail above two facing text panes. FORM: candidate 6, bilingual customs-stamp desk; seed key d14d64c7. FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance -->" }} />{/* THESIS: Translation is a bilingual language desk: source and target are treated as facing text, not two generic form cards.
OWN-WORLD: washi cream, indigo ink, vermilion direction marks, Thai-aware typesetting, and a punched language rail.
STORY: A visitor chooses a direction, writes a phrase, reads the dictionary output, and understands the limits of the tiny local demo.
FIRST VIEWPORT: the EN ↔ TH language rail sits above two large facing text panes; the primary action is typing, with Swap direction as the explicit control.
FORM: candidate 6 of the grounded list, a bilingual customs-stamp desk; seed key d14d64c7.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance */}<Analytics /><SpeedInsights />{children}</body></html>; }
