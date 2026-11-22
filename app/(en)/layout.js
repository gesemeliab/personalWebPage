import { DM_Sans, IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import { cx } from "@/lib/classNames";
import { site } from "@/data/site";
import "./globals.css";

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

export const metadata = {
  title: site.title,
  description: site.description,
  icons: { icon: "/favicon.svg" },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={cx(sans.variable, display.variable, mono.variable)}>
      <body>{children}</body>
    </html>
  );
}
