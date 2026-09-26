import { ADDRESS, MAPS_URL } from "@/lib/site";

export function Location() {
  return (
    <section className="location section" id="quartier">
      <div>
        <div className="eyebrow">MONTPELLIER · ROUTE DE LAVÉRUNE</div>
        <h2>
          Le calme chez vous.
          <br />
          La ville tout autour.
        </h2>
        <p>
          {ADDRESS.streetAddress}
          <br />
          {ADDRESS.postalCode} {ADDRESS.addressLocality}
        </p>
        <a className="text-link" href={MAPS_URL} target="_blank" rel="noopener noreferrer">
          Situer la résidence <span>↗</span>
        </a>
      </div>
      <div className="location-points">
        <div>
          <strong>4 km</strong>
          <span>du centre historique</span>
        </div>
        <div>
          <strong>500 m</strong>
          <span>de la ligne 5 du tramway annoncée par le promoteur</span>
        </div>
        <div>
          <strong>Tout près</strong>
          <span>des commerces, écoles et transports</span>
        </div>
      </div>
    </section>
  );
}
