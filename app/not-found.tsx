import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page introuvable",
  description: "Cette page n’existe pas. Retrouvez la résidence Duo Verde à Montpellier.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="section not-found" id="contenu">
      <p className="eyebrow">404</p>
      <h1>Cette page n’existe pas.</h1>
      <a className="button" href="/">
        Retour à Duo Verde <span>↗</span>
      </a>
    </main>
  );
}
