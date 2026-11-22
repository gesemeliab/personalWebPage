import { Document, documentMetadata, documentViewport } from "@/components/layout/Document/Document";

/** Root layout for the English site, served at /. */
export const metadata = documentMetadata("en");
export const viewport = documentViewport;

export default function EnglishLayout({ children }) {
  return <Document lang="en">{children}</Document>;
}
