import { Document, documentMetadata, documentViewport } from "@/components/layout/Document/Document";

/** Root layout for the Spanish site, served at /es/. */
export const metadata = documentMetadata("es");
export const viewport = documentViewport;

export default function SpanishLayout({ children }) {
  return <Document lang="es">{children}</Document>;
}
