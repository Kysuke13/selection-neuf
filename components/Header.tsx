export function Header() {
  return (
    <header>
      <a className="brand" href="/" aria-label="Sélection Neuf — accueil">
        <svg className="brand-monogram" viewBox="0 0 56 64" aria-hidden="true">
          <path className="monogram-frame" d="M1 1h54v62H1z" />
          <path className="monogram-n" d="M14 47V17l28 30V17" />
          <path className="monogram-s" d="M39 18c-4-5-19-5-23 1-8 12 26 14 24 25-2 8-18 9-25 2" />
          <path className="monogram-accent" d="M23 63h10" />
        </svg>
        <span className="brand-wordmark">
          <span className="brand-selection">SÉLECTION</span>
          <span className="brand-neuf">NEUF</span>
        </span>
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
