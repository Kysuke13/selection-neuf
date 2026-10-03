import { ModalCta } from "@/components/ModalCta";

function dossierDe(program: string) {
  return /^[aeiouyàâäéèêëîïôöùûüh]/i.test(program) ? `d’${program}` : `de ${program}`;
}

const documents = [
  "La plaquette de la résidence",
  "Les plans des appartements",
  "Les prix et disponibilités à jour",
  "Un échange avec un conseiller",
];

export function Contact({
  program = "Duo Verde",
  items = documents,
  cta = "Télécharger la brochure",
}: {
  program?: string;
  items?: readonly string[];
  cta?: string;
}) {
  return (
    <section className="contact section">
      <div className="contact-copy">
        <div className="eyebrow">VOTRE PROJET COMMENCE ICI</div>
        <h2>
          Et si votre prochaine
          <br />
          adresse était ici ?
        </h2>
        <p>Recevez le dossier {dossierDe(program)} et échangez avec un conseiller sur votre projet.</p>
        <ul>
          {items.map((item, index) => (
            <li key={item}>
              <span>{String(index + 1).padStart(2, "0")}</span> {item}
            </li>
          ))}
        </ul>
        <div className="contact-signature">
          sélection neuf
          <span>Des lieux de vie. Votre projet.</span>
        </div>
      </div>
      <div className="contact-card">
        <h3>Recevoir le dossier complet</h3>
        <p>Recevez la brochure complète avec les prix et les plans</p>
        <ModalCta className="button">
          {cta} <span>↗</span>
        </ModalCta>
      </div>
    </section>
  );
}
