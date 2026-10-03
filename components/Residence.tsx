import Image from "next/image";
import { ModalCta } from "@/components/ModalCta";
import { featureMarks, features } from "@/lib/site";

export function Residence() {
  return (
    <section className="residence section" id="residence">
      <div className="residence-image">
        <div className="residence-photo">
          <Image
            src="/assets/residence.webp"
            alt="Seconde perspective architecturale du programme Duo Verde"
            fill
            unoptimized
            sizes="(max-width: 760px) 100vw, 46vw"
          />
        </div>
        <div className="image-note">Une autre perspective sur votre futur chez-vous.</div>
      </div>
      <div className="residence-copy">
        <div className="eyebrow">LA RÉSIDENCE</div>
        <h2>
          Une adresse urbaine.
          <br />
          Un esprit jardin.
        </h2>
        <p>
          À 4 km du centre historique, une résidence aux lignes aériennes, entourée d’un parc arboré
          et de jardins potagers.
        </p>
        <p>
          Balcons et terrasses prolongent les appartements. Commerces, écoles et transports
          accompagnent le quotidien.
        </p>
        <div className="features">
          {features.map((feature, index) => (
            <span key={feature}>
              {featureMarks[index]} &nbsp; {feature}
            </span>
          ))}
        </div>
        <ModalCta className="text-link">
          Découvrir la résidence en détail <span>↗</span>
        </ModalCta>
      </div>
    </section>
  );
}
