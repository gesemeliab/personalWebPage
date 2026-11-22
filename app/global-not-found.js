import Link from "next/link";
import { Document } from "@/components/layout/Document/Document";

/**
 * The 404 page for any unmatched URL. With one root layout per language there
 * is no single layout to compose it from, so it renders its own document.
 */
export const metadata = {
  title: "404 · Page not found / Página no encontrada",
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <Document lang="en">
      <main style={{ minHeight: "100vh", display: "grid", placeContent: "center", gap: 16, padding: 24, textAlign: "center" }}>
        <p className="mono">404</p>
        <h1 style={{ fontSize: "2rem" }}>Page not found · Página no encontrada</h1>
        <p>
          <Link href="/">Go to the home page</Link>
          {" · "}
          <Link href="/es/">Ir a la página principal</Link>
        </p>
      </main>
    </Document>
  );
}
