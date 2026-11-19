import type { Metadata } from "next";
import { Geist, Noto_Sans_Thai } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

// The font variables sit on <html>: the App shell tokens live on :root and read them from there.
// Geist has no Thai glyphs, so Noto Sans Thai follows it in the stack (see globals.css).
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const notoThai = Noto_Sans_Thai({ variable: "--font-noto-thai", subsets: ["thai"], weight: ["400", "600"] });

const title = "Translation | Bookchaowalit";
const description = "A tiny dictionary-based English and Thai translation demo that says which words it does not know.";

export const metadata: Metadata = {
  title,
  description,
  authors: [{ name: "Bookchaowalit", url: "https://bookchaowalit.com" }],
  creator: "Bookchaowalit",
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  openGraph: { type: "website", title, description, siteName: "Bookchaowalit" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${notoThai.variable}`}>
      <body>{children}</body>
    </html>
  );
}
