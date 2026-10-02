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
        <a className="header-phone" href="tel:+33766012647">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M7.2 3.8h2.4l1.3 3.2-1.7 1a11.2 11.2 0 0 0 5.8 5.8l1-1.7 3.2 1.3v2.4a1.6 1.6 0 0 1-1.6 1.6A13.6 13.6 0 0 1 5.6 5.4a1.6 1.6 0 0 1 1.6-1.6Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
          <span>07 66 01 26 47</span>
        </a>
      </nav>
      <a className="button small" href="#contact">
        <span className="button-label">Recevoir la brochure</span>
        <span className="button-label-short">Brochure</span>
        <span aria-hidden="true">↗</span>
      </a>
    </header>
  );
}
