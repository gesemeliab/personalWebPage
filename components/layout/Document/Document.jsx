import { DM_Sans, IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import { cx } from "@/lib/classNames";
import { getContent, homePath, LOCALES, SITE_URL } from "@/lib/content";
import "@/app/globals.css";

/*
  Fonts are self-hosted by next/font at build time: no render-blocking request
  to Google, no layout shift. Each one publishes a CSS variable that
  app/globals.css reads through the --font-* tokens.
*/
const sans = DM_Sans({ subsets: ["latin"], display: "swap", variable: "--font-sans" });

const display = Space_Grotesk({ subsets: ["latin"], display: "swap", variable: "--font-display" });

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-mono",
});

/**
 * Page metadata in one language, with links to every language version so
 * search engines show readers the right one.
 */
export function documentMetadata(lang) {
  const { site } = getContent(lang);
  return {
    metadataBase: new URL(SITE_URL),
    title: site.title,
    description: site.description,
    icons: { icon: "/favicon.svg" },
    alternates: {
      canonical: homePath(lang),
      languages: {
        ...Object.fromEntries(LOCALES.map((locale) => [locale, homePath(locale)])),
        "x-default": homePath("en"),
      },
    },
  };
}

export const documentViewport = {
  width: "device-width",
  initialScale: 1,
};

/** The <html> shell shared by every language's root layout. */
export function Document({ lang, children }) {
  return (
    <html lang={lang} className={cx(sans.variable, display.variable, mono.variable)}>
      <body>{children}</body>
    </html>
  );
}
