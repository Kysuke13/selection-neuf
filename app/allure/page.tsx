import type { Metadata } from "next";
import Image from "next/image";
import { LeadForm } from "@/components/LeadForm";
import { PlanLink } from "@/components/PlanLink";
import { TypologyProvider } from "@/components/TypologyProvider";
import {
  ALLURE_ADDRESS,
  ALLURE_MAPS_URL,
  ALLURE_PAGE_DESCRIPTION,
  ALLURE_PAGE_TITLE,
  ALLURE_PATH,
  allureApartments,
  allureEntryApartment,
  allureFeatureMarks,
  allureFeatures,
  allureTypologies,
  buildAllureJsonLd,
} from "@/lib/allure";

export const metadata: Metadata = {
  title: ALLURE_PAGE_TITLE,
  description: ALLURE_PAGE_DESCRIPTION,
  keywords: [
    "Allure",
    "Allure Pontoise",
    "appartement neuf Pontoise",
    "Sélection Neuf",
    "rue Henri Dunant",
    "Cogedim Pontoise",
    "studio Pontoise",
    "T2 Pontoise",
    "4 pièces Pontoise",
    "Val-d’Oise 95",
  ],
  alternates: {
    canonical: ALLURE_PATH,
    languages: { "fr-FR": ALLURE_PATH },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: ALLURE_PATH,
    title: ALLURE_PAGE_TITLE,
    description: ALLURE_PAGE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: ALLURE_PAGE_TITLE,
    description: ALLURE_PAGE_DESCRIPTION,
  },
  other: {
    "geo.region": "FR-95",
    "geo.placename": "Pontoise",
  },
};

const documents = [
  "La brochure de la résidence",
  "Les plans des appartements",
  "Les prix et disponibilités à jour",
  "Un échange avec un conseiller",
];

function AllureJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(buildAllureJsonLd()).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export default function AllurePage() {
  return (
    <>
      <AllureJsonLd />
      <main id="contenu">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">NOTRE SÉLECTION À PONTOISE</div>
            <div className="status">
              <i aria-hidden="true" /> Travaux en cours <span>•</span>{" "}
              <time dateTime="2027-10">Livraison 4e trimestre 2027</time>
            </div>
            <h1>
              Allure
              <span>Des cascades de terrasses, la ville aux portes du Vexin.</span>
            </h1>
            <p className="hero-description">
              Votre appartement neuf, du studio au 4 pièces, <br />
              prolongé de balcons, terrasses ou jardins privatifs.
            </p>
            <p className="address">
              <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M10 1.4a6.2 6.2 0 0 0-6.2 6.2c0 4.55 6.2 10.9 6.2 10.9s6.2-6.35 6.2-10.9A6.2 6.2 0 0 0 10 1.4Zm0 3.7a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z"
                />
              </svg>
              Rue Henri Dunant, Pontoise (95)
            </p>
            <div className="hero-price">
              <span>À partir de</span>
              <div>
                {allureEntryApartment.priceLabel} €<sup>*</sup>
              </div>
              <small>TVA réduite 5,5 % sous conditions · Éligible PTZ, LMNP, LLI, Jeanbrun</small>
            </div>
            <a className="button" href="#contact">
              Recevoir la brochure et les plans <span>↗</span>
            </a>
            <p className="quiet">Sans engagement · Un conseiller à votre écoute</p>
          </div>
          <div className="hero-image">
            <Image
              src="/allure/hero.webp"
              alt="Perspective de la résidence Allure à Pontoise, façades blanches à cascades de terrasses végétalisées et commerces en pied d’immeuble"
              fill
              priority
              unoptimized
              sizes="(max-width: 760px) 100vw, 67vw"
            />
            <div className="offer">
              LABELS &amp; CERTIFICATIONS
              <strong>NF Habitat · RE2020</strong>
              <span>
                Livraison 4<sup>e</sup> trimestre 2027
              </span>
            </div>
            <div className="image-label">
              ALLURE <span>PONTOISE · 95</span>
            </div>
          </div>
        </section>

        <section className="facts" aria-label="L’essentiel d’Allure">
          <div>
            <span>01 / LES APPARTEMENTS</span>
            <strong>Du studio au 4 pièces</strong>
          </div>
          <div>
            <span>02 / LA LIVRAISON</span>
            <strong>
              4<sup>e</sup> trimestre 2027
            </strong>
          </div>
          <div>
            <span>03 / LE CADRE DE VIE</span>
            <strong>Terrasses & verdure</strong>
          </div>
          <div>
            <span>04 / LES LABELS</span>
            <strong>NF Habitat · RE2020</strong>
          </div>
        </section>

        <section className="residence section" id="residence">
          <div className="residence-image">
            <div className="residence-photo">
              <Image
                src="/allure/ambiance-1.jpg"
                alt="Perspective intérieure d’un appartement Allure, séjour lumineux ouvert sur la cuisine et la terrasse"
                fill
                unoptimized
                sizes="(max-width: 760px) 100vw, 46vw"
              />
            </div>
            <div className="image-note">Une ambiance intérieure de votre futur chez-vous.</div>
          </div>
          <div className="residence-copy">
            <div className="eyebrow">LA RÉSIDENCE</div>
            <h2>
              Des terrasses plein ciel.
              <br />
              Une placette arborée.
            </h2>
            <p>
              À quelques pas de la place de la Paix et de sa galerie commerçante, une architecture
              contemporaine signée Christian Marina, ponctuée d’érables et de charmes le long des
              bâtiments.
            </p>
            <p>
              Blanc et champagne pour les garde-corps, cascades de terrasses végétalisées, chaudière
              collective au gaz urbain : une résidence certifiée RE2020 et NF Habitat, entièrement
              close et sécurisée.
            </p>
            <div className="features">
              {allureFeatures.map((feature, index) => (
                <span key={feature}>
                  {allureFeatureMarks[index]} &nbsp; {feature}
                </span>
              ))}
            </div>
            <a className="text-link" href="#contact">
              Découvrir la résidence en détail <span>↗</span>
            </a>
          </div>
        </section>

        <TypologyProvider>
          <section className="apartments section" id="appartements">
            <div className="section-heading">
              <div>
                <div className="eyebrow">LES APPARTEMENTS</div>
                <h2>À chacun son espace.</h2>
              </div>
              <p>
                Du studio au 4 pièces, avec plans évolutifs.
                <br />
                Recevez les plans et les disponibilités.
              </p>
            </div>
            <div className="types">
              {allureApartments.map((apartment) => (
                <article className="type" key={apartment.id} id={apartment.id.toLowerCase()}>
                  <div className="type-name">
                    <span>{apartment.id}</span>
                    <div>
                      <h3>{apartment.pieces}</h3>
                      <p>Appartement neuf</p>
                    </div>
                  </div>
                  <div className="metric">
                    <span>Surface</span>
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
              Prix à partir de, en TVA réduite à 5,5 % sous conditions de ressources et de zone (soit
              respectivement {allureApartments[0].priceTva20Label} €,{" "}
              {allureApartments[1].priceTva20Label} € et {allureApartments[2].priceTva20Label} € en
              TVA 20 %). Prix indicatifs relevés sur le programme, sous réserve de disponibilité.
              Dispositifs LMNP, LLI, Jeanbrun et solution Cogedim Access selon éligibilité.
            </p>
          </section>

          <section className="location section" id="quartier">
            <div>
              <div className="eyebrow">PONTOISE · VAL-D’OISE</div>
              <h2>
                Les commerces au pied.
                <br />
                Le RER à côté.
              </h2>
              <p>
                {ALLURE_ADDRESS.streetAddress}
                <br />
                {ALLURE_ADDRESS.postalCode} {ALLURE_ADDRESS.addressLocality}
              </p>
              <a
                className="text-link"
                href={ALLURE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Situer la résidence <span>↗</span>
              </a>
            </div>
            <div className="location-points">
              <div>
                <strong>À pied</strong>
                <span>des écoles Eugène Ducher et des commerces</span>
              </div>
              <div>
                <strong>RER C</strong>
                <span>et gare de Pontoise à proximité</span>
              </div>
              <div>
                <strong>Nature</strong>
                <span>parc des Lavandières en voisin</span>
              </div>
            </div>
          </section>

          <section className="contact section" id="contact">
            <div className="contact-copy">
              <div className="eyebrow">VOTRE PROJET COMMENCE ICI</div>
              <h2>
                Et si votre prochaine
                <br />
                adresse était ici ?
              </h2>
              <p>Recevez le dossier d’Allure et échangez avec un conseiller sur votre projet.</p>
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
            <LeadForm typologies={allureTypologies} source="allure-pontoise" />
          </section>

          <section className="map-section section" id="localisation">
            <div className="section-heading">
              <div>
                <div className="eyebrow">LOCALISATION</div>
                <h2>Retrouvez Allure à Pontoise.</h2>
              </div>
              <p>
                {ALLURE_ADDRESS.streetAddress}
                <br />
                {ALLURE_ADDRESS.postalCode} {ALLURE_ADDRESS.addressLocality}
              </p>
            </div>
            <a
              className="map-image-link"
              href={ALLURE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ouvrir la localisation d’Allure dans Google Maps"
            >
              <Image
                src="/allure/perspective-1.jpg"
                alt="Perspective de la résidence Allure, rue Henri Dunant à Pontoise, façades et terrasses végétalisées"
                width={1024}
                height={576}
                unoptimized
                sizes="(max-width: 760px) 100vw, 1000px"
                style={{ width: "100%", height: "auto" }}
              />
            </a>
            <a
              className="text-link map-link"
              href={ALLURE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ouvrir dans Google Maps <span>↗</span>
            </a>
          </section>

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
                * Prix et informations relevés le 30/09/2026 sur le programme Allure (Cogedim), à
                partir de 181 988 € en TVA réduite 5,5 % sous conditions. Prix de départ indicatifs,
                susceptibles d’évolution et sous réserve de disponibilité.
              </p>
              <p>
                ** Livraison prévisionnelle au 4e trimestre 2027. Travaux en cours. Labels NF Habitat
                et RE2020. Dispositifs LMNP, LLI, Jeanbrun et solution Cogedim Access mentionnés par
                le promoteur, selon éligibilité.
              </p>
            </div>
          </footer>
        </TypologyProvider>
      </main>

      <div className="mobile-cta">
        <span>
          Dès <strong>{allureEntryApartment.priceLabel} €*</strong>
        </span>
        <a className="button small" href="#contact">
          Recevoir les plans ↗
        </a>
      </div>
    </>
  );
}
