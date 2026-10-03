import type { Metadata } from "next";
import Image from "next/image";
import { Contact } from "@/components/Contact";
import { LeadForm } from "@/components/LeadForm";
import { MobileCta } from "@/components/MobileCta";
import { ModalCta } from "@/components/ModalCta";
import { PlanLink } from "@/components/PlanLink";
import { TypologyProvider } from "@/components/TypologyProvider";
import {
  buildCanopeaJsonLd,
  CANOPEA_ADDRESS,
  CANOPEA_MAPS_URL,
  CANOPEA_PAGE_DESCRIPTION,
  CANOPEA_PAGE_TITLE,
  CANOPEA_PATH,
  canopeaApartments,
  canopeaEntryApartment,
  canopeaFeatureMarks,
  canopeaFeatures,
  canopeaTypologies,
} from "@/lib/canopea";

export const metadata: Metadata = {
  title: CANOPEA_PAGE_TITLE,
  description: CANOPEA_PAGE_DESCRIPTION,
  keywords: [
    "Canopea",
    "Canopea Montpellier",
    "appartement neuf Montpellier",
    "Sélection Neuf",
    "Nouveau Saint-Roch",
    "rue Isabelle Eberhardt",
    "T2 Montpellier",
    "T4 Montpellier",
    "T5 Montpellier",
  ],
  alternates: {
    canonical: CANOPEA_PATH,
    languages: { "fr-FR": CANOPEA_PATH },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: CANOPEA_PATH,
    title: CANOPEA_PAGE_TITLE,
    description: CANOPEA_PAGE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: CANOPEA_PAGE_TITLE,
    description: CANOPEA_PAGE_DESCRIPTION,
  },
};

function CanopeaJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(buildCanopeaJsonLd()).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export default function CanopeaPage() {
  return (
    <>
      <CanopeaJsonLd />
      <main id="contenu">
        <TypologyProvider>
        <section className="hero" aria-label="Demande de documentation Canopea">
          <LeadForm typologies={canopeaTypologies} source="canopea-montpellier" />
          <div className="hero-image">
            <Image
              src="/canopea/vue-drone-parc_canopea.jpg"
              alt="Perspective aérienne de la résidence Canopea à Montpellier, deux bâtiments en bordure d’un parc arboré et du tramway"
              fill
              priority
              unoptimized
              sizes="(max-width: 760px) 100vw, 67vw"
            />
            <div className="offer">
              LABELS &amp; CERTIFICATIONS
              <strong>NF Habitat · RE2020</strong>
              <span>
                Livraison 2<sup>e</sup> trimestre 2028
              </span>
            </div>
            <div className="photo-vignettes">
              <div className="photo-vignettes-id">
                <h1 className="vignette vignette-name">Canopea</h1>
                <p className="vignette vignette-place">Montpellier · 34</p>
              </div>
              <p className="vignette vignette-price">
                <span>À partir de</span>
                <strong>
                  {canopeaEntryApartment.priceLabel} €<sup>*</sup>
                </strong>
              </p>
            </div>
          </div>
        </section>

        <section className="facts" aria-label="L’essentiel de Canopea">
          <div>
            <span>01 / LES APPARTEMENTS</span>
            <strong>Du 2 au 5 pièces</strong>
          </div>
          <div>
            <span>02 / LA LIVRAISON</span>
            <strong>
              2<sup>e</sup> trimestre 2028
            </strong>
          </div>
          <div>
            <span>03 / LE CADRE DE VIE</span>
            <strong>En bordure de parc</strong>
          </div>
          <div>
            <span>04 / LES AVANTAGES</span>
            <strong className="facts-points">
              NF Habitat · RE2020
              <br />
              Éligible PTZ
              <br />
              Jeanbrun
            </strong>
          </div>
        </section>

        <section className="residence section" id="residence">
          <div className="residence-image">
            <div className="residence-photo">
              <Image
                src="/canopea/pers-interieure_canopea.jpg"
                alt="Perspective intérieure d’un appartement Canopea, séjour lumineux ouvert sur la terrasse"
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
              Deux bâtiments.
              <br />
              Un jardin central.
            </h2>
            <p>
              Dans le quartier Nouveau Saint-Roch, à quelques pas de la gare Saint-Roch et du
              tramway, une architecture contemporaine en bordure d’un parc arboré.
            </p>
            <p>
              Deux bâtiments élégants reliés par un jardin central, des toitures végétalisées et des
              appartements prolongés de belles terrasses.
            </p>
            <div className="features">
              {canopeaFeatures.map((feature, index) => (
                <span key={feature}>
                  {canopeaFeatureMarks[index]} &nbsp; {feature}
                </span>
              ))}
            </div>
            <ModalCta className="text-link">
              Découvrir la résidence en détail <span>↗</span>
            </ModalCta>
          </div>
        </section>

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
              {canopeaApartments.map((apartment) => (
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
                      {apartment.surfaceLabel ? (
                        <>
                          {apartment.surfaceLabel} <small>m²</small>
                        </>
                      ) : (
                        <>Sur demande</>
                      )}
                    </strong>
                  </div>
                  <div className="metric">
                    <span>Prix{apartment.priceLabel ? " à partir de" : ""}</span>
                    <strong>
                      {apartment.priceLabel ? (
                        <>
                          {apartment.priceLabel} €<sup>*</sup>
                        </>
                      ) : (
                        <>Sur demande</>
                      )}
                    </strong>
                  </div>
                  <PlanLink type={apartment.id}>
                    Recevoir les plans <span>↗</span>
                  </PlanLink>
                </article>
              ))}
            </div>
            <p className="footnote">
              Prix TTC en TVA 20 %. Prix de départ indicatif relevé sur le programme, sous réserve de
              disponibilité. Dispositifs PTZ, BRS et Jeanbrun mentionnés par le promoteur, selon
              éligibilité.
            </p>
          </section>

          <section className="location section" id="quartier">
            <div>
              <div className="eyebrow">MONTPELLIER · NOUVEAU SAINT-ROCH</div>
              <h2>
                Le parc au pied.
                <br />
                La gare à côté.
              </h2>
              <p>
                {CANOPEA_ADDRESS.streetAddress}
                <br />
                {CANOPEA_ADDRESS.postalCode} {CANOPEA_ADDRESS.addressLocality}
              </p>
              <a
                className="text-link"
                href={CANOPEA_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Situer la résidence <span>↗</span>
              </a>
            </div>
            <div className="location-points">
              <div>
                <strong>À pied</strong>
                <span>de la gare Saint-Roch et du tramway</span>
              </div>
              <div>
                <strong>Bordure</strong>
                <span>immédiate du parc René Dumont</span>
              </div>
              <div>
                <strong>Centre-ville</strong>
                <span>à quelques minutes seulement</span>
              </div>
            </div>
          </section>

          <Contact program="Canopea" />

          <section className="map-section section" id="localisation">
            <div className="section-heading">
              <div>
                <div className="eyebrow">LOCALISATION</div>
                <h2>Retrouvez Canopea à Montpellier.</h2>
              </div>
              <p>
                {CANOPEA_ADDRESS.streetAddress}
                <br />
                {CANOPEA_ADDRESS.postalCode} {CANOPEA_ADDRESS.addressLocality}
              </p>
            </div>
            <a
              className="map-image-link"
              href={CANOPEA_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ouvrir la localisation de Canopea dans Google Maps"
            >
              <Image
                src="/canopea/plan-masse_canopea.jpg"
                alt="Plan masse de Canopea, deux bâtiments rue Isabelle Eberhardt en bordure du parc René Dumont à Montpellier"
                width={1024}
                height={683}
                unoptimized
                sizes="(max-width: 760px) 100vw, 1000px"
                style={{ width: "100%", height: "auto" }}
              />
            </a>
            <a
              className="text-link map-link"
              href={CANOPEA_MAPS_URL}
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
              <ModalCta>Parlons de votre projet ↗</ModalCta>
            </div>
            <div className="legal">
              <p>
                * Prix et informations relevés le 28/09/2026 sur le programme Canopea (Icade), à
                partir de 219 000 € en TVA 20 %. Prix de départ indicatif, susceptible d’évolution et
                sous réserve de disponibilité.
              </p>
              <p>
                ** Livraison prévisionnelle au 2e trimestre 2028. Travaux en cours. Labels NF Habitat
                et RE2020. Dispositifs PTZ, BRS et Jeanbrun mentionnés par le promoteur, selon
                éligibilité.
              </p>
            </div>
          </footer>
        </TypologyProvider>
      </main>

      <MobileCta priceLabel={canopeaEntryApartment.priceLabel} />
    </>
  );
}
