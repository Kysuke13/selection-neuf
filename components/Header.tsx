"use client";

import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <header>
      <a className="brand" href="/" aria-label="Sélection Neuf — accueil">
        <img
          className="brand-logo"
          src="/logo-selection-neuf.png"
          alt=""
          width={1628}
          height={402}
        />
      </a>
      <nav aria-label="Navigation principale">
        <a href="#residence">La résidence</a>
        <a href="#appartements">Les appartements</a>
        <a href="#quartier">Le quartier</a>
      </nav>
      <a className="button small" href="#contact">
        Recevoir la brochure <span>↗</span>
      </a>
    </header>
  );
}
