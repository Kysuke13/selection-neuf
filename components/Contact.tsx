import { LeadForm } from "@/components/LeadForm";

const documents = [
  "La plaquette de la résidence",
  "Les plans des appartements",
  "Les prix et disponibilités à jour",
  "Un échange avec un conseiller",
];

export function Contact() {
  return (
    <section className="contact section" id="contact">
      <div className="contact-copy">
        <div className="eyebrow">VOTRE PROJET COMMENCE ICI</div>
        <h2>
          Et si votre prochaine
          <br />
          adresse était ici ?
        </h2>
        <p>Recevez le dossier de Duo Verde et échangez avec un conseiller sur votre projet.</p>
        <ul>
          {documents.map((item, index) => (
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
      <LeadForm />
    </section>
  );
}
