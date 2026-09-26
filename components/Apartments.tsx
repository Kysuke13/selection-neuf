import { PlanLink } from "@/components/PlanLink";
import { apartments } from "@/lib/site";

export function Apartments() {
  return (
    <section className="apartments section" id="appartements">
      <div className="section-heading">
        <div>
          <div className="eyebrow">LES APPARTEMENTS</div>
          <h2>À chacun son espace.</h2>
        </div>
        <p>
          Trois typologies pour votre projet.
          <br />
          Recevez les plans et les disponibilités.
        </p>
      </div>
      <div className="types">
        {apartments.map((apartment) => (
          <article className="type" key={apartment.id} id={apartment.id.toLowerCase()}>
            <div className="type-name">
              <span>{apartment.id}</span>
              <div>
                <h3>{apartment.pieces}</h3>
                <p>Appartement neuf</p>
              </div>
            </div>
            <div className="metric">
              <span>Surface à partir de</span>
              <strong>
                {apartment.surfaceLabel} <small>m²</small>
              </strong>
            </div>
            <div className="metric">
              <span>Prix à partir de</span>
              <strong>
                {apartment.priceLabel} €<sup>*</sup>
              </strong>
            </div>
            <PlanLink type={apartment.id}>
              Recevoir les plans <span>↗</span>
            </PlanLink>
          </article>
        ))}
      </div>
      <p className="footnote">
        Prix TTC avec TVA à 5,5 % sous conditions, offre déduite. Les prix et surfaces de départ
        sont indépendants : ils peuvent correspondre à des logements différents. Sous réserve de
        disponibilité.
      </p>
    </section>
  );
}
