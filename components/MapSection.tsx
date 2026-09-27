import Image from "next/image";
import { ADDRESS, MAPS_URL } from "@/lib/site";

export function MapSection() {
  return (
    <section className="map-section section" id="localisation">
      <div className="section-heading">
        <div>
          <div className="eyebrow">LOCALISATION</div>
          <h2>Retrouvez Duo Verde à Montpellier.</h2>
        </div>
        <p>
          {ADDRESS.streetAddress}
          <br />
          {ADDRESS.postalCode} {ADDRESS.addressLocality}
        </p>
      </div>
      <a
        className="map-image-link"
        href={MAPS_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Ouvrir la localisation de Duo Verde dans Google Maps"
      >
        <Image
          src="/assets/localisation.png"
          alt="Carte de Montpellier avec un repère indiquant la résidence Duo Verde au sud-ouest du centre-ville"
          width={966}
          height={432}
          unoptimized
          sizes="(max-width: 760px) 100vw, 1000px"
          style={{ width: "100%", height: "auto" }}
        />
      </a>
      <a className="text-link map-link" href={MAPS_URL} target="_blank" rel="noopener noreferrer">
        Ouvrir dans Google Maps <span>↗</span>
      </a>
    </section>
  );
}
