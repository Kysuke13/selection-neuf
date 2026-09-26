import { OFFICIAL_PROGRAM_URL } from "@/lib/site";

export function Footer() {
  return (
    <footer>
      <div className="footer-top">
        <a className="footer-brand" href="/">
          sélection neuf.
        </a>
        <span>L’immobilier neuf, bien choisi.</span>
        <a href="#contact">Parlons de votre projet ↗</a>
      </div>
      <div className="legal">
        <p>
          * Prix et disponibilités relevés le 26/09/2026. Remises annoncées : 6 000 € pour les T2, 9
          000 € pour les T3 et 12 000 € pour les T4. Offre réservée aux 4 premiers réservataires
          entre le 14/09/2026 et le 31/10/2026, avec signature de l’acte notarié dans le délai
          contractuel, dans la limite du stock disponible. Non cumulable, hors prix maîtrisés,
          encadrés et BRS.
        </p>
        <p>
          ** TVA à 5,5 % soumise aux conditions d’éligibilité, notamment de ressources. Livraison
          prévisionnelle dès le 4e trimestre 2027. Actabilité immédiate annoncée. Dispositifs
          mentionnés par le promoteur : PTZ, TVA réduite, Jeanbrun, LMNP, Patrimonial et LLI, selon
          éligibilité.
        </p>
        <p>
          Visuels d’ambiance non contractuels © Kaufman &amp; Broad. Informations issues du{" "}
          <a href={OFFICIAL_PROGRAM_URL} target="_blank" rel="noopener noreferrer">
            programme officiel Duo Verde
          </a>. Maquette Sélection Neuf — formulaire de démonstration.
        </p>
      </div>
    </footer>
  );
}
