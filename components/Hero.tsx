import Image from "next/image";
import { entryApartment } from "@/lib/site";

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-copy">
        <div className="eyebrow">NOTRE SÉLECTION À MONTPELLIER</div>
        <div className="status">
          <i aria-hidden="true" /> En travaux <span>•</span>{" "}
          <time dateTime="2027-10">Livraison dès fin 2027</time>
        </div>
        <h1>
          Duo Verde
          <span>La ville, côté nature.</span>
        </h1>
        <p className="hero-description">
          Votre appartement neuf, du 2 au 4 pièces, <br />
          au cœur d’un parc arboré de 5 000 m².
        </p>
        <p className="address">
          <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M10 1.4a6.2 6.2 0 0 0-6.2 6.2c0 4.55 6.2 10.9 6.2 10.9s6.2-6.35 6.2-10.9A6.2 6.2 0 0 0 10 1.4Zm0 3.7a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z"
            />
          </svg>
          Route de Lavérune, Montpellier
        </p>
        <div className="hero-price">
          <span>À partir de</span>
          <div>
            {entryApartment.priceLabel} €<sup>*</sup>{" "}
            <del>{entryApartment.compareAtLabel} €</del>
          </div>
          <small>TVA 5,5 % sous conditions · Offre déduite</small>
        </div>
        <a className="button" href="#contact">
          Recevoir la plaquette et les plans <span>↗</span>
        </a>
        <p className="quiet">Sans engagement · Un conseiller à votre écoute</p>
      </div>
      <div className="hero-image">
        <Image
          src="/assets/facade.webp"
          alt="Perspective de la résidence Duo Verde à Montpellier, façades et balcons végétalisés"
          fill
          priority
          unoptimized
          sizes="(max-width: 760px) 100vw, 67vw"
        />
        <div className="offer">
          OFFRE DU MOMENT
          <strong>Jusqu’à 12 000 € offerts*</strong>
          <span>
            Jusqu’au <time dateTime="2026-10-31">31 octobre 2026</time>
          </span>
        </div>
        <div className="image-label">
          DUO VERDE <span>MONTPELLIER · 34</span>
        </div>
      </div>
    </section>
  );
}
