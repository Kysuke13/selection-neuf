import Image from "next/image";
import { LeadForm } from "@/components/LeadForm";
import { entryApartment } from "@/lib/site";

export function Hero() {
  return (
    <>
      <section className="hero" aria-label="Demande de documentation Duo Verde">
        <LeadForm />
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
          <div className="photo-vignettes">
            <div className="photo-vignettes-id">
              <h1 className="vignette vignette-name">Duo Verde</h1>
              <p className="vignette vignette-place">Montpellier · 34</p>
            </div>
            <p className="vignette vignette-price">
              <span>À partir de</span>
              <strong>
                {entryApartment.priceLabel} €<sup>*</sup>
                <del>{entryApartment.compareAtLabel} €</del>
              </strong>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
