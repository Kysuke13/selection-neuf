import { SITE_NAME, SITE_URL } from "@/lib/site";

export const CANOPEA_PATH = "/canopea";
export const CANOPEA_URL = `${SITE_URL}${CANOPEA_PATH}`;

export const CANOPEA_PAGE_TITLE =
  "Canopea à Montpellier — appartements neufs | Sélection Neuf";

export const CANOPEA_PAGE_DESCRIPTION =
  "Appartements neufs Canopea à Montpellier, du 2 au 5 pièces, dès 219 000 €. Quartier Nouveau Saint-Roch, rue Isabelle Eberhardt, en bordure du parc René Dumont. Livraison 2e trimestre 2028. Recevez la plaquette et les plans.";

export const CANOPEA_PRICE_CHECKED_ON = "2026-09-28";

export const CANOPEA_ADDRESS = {
  streetAddress: "Rue Isabelle Eberhardt",
  postalCode: "34000",
  addressLocality: "Montpellier",
  addressRegion: "Hérault",
  addressCountry: "FR",
} as const;

export const CANOPEA_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Rue%20Isabelle%20Eberhardt%2034000%20Montpellier";

export const CANOPEA_OFFICIAL_PROGRAM_URL =
  "https://www.icade-immobilier.com/programmes-immobiliers-neufs-montpellier/canopea,p32226";

export const canopeaApartments = [
  {
    id: "T2",
    pieces: "2 pièces",
    surfaceLabel: null,
    surfaceValue: null,
    priceLabel: "219 000",
    priceValue: 219000,
  },
  {
    id: "T3",
    pieces: "3 pièces",
    surfaceLabel: null,
    surfaceValue: null,
    priceLabel: null,
    priceValue: null,
  },
  {
    id: "T4",
    pieces: "4 pièces",
    surfaceLabel: null,
    surfaceValue: null,
    priceLabel: null,
    priceValue: null,
  },
  {
    id: "T5",
    pieces: "5 pièces",
    surfaceLabel: null,
    surfaceValue: null,
    priceLabel: null,
    priceValue: null,
  },
] as const;

export const canopeaEntryApartment = canopeaApartments[0];

export const canopeaTypologies = [
  { value: "T2", label: "T2 — 2 pièces" },
  { value: "T3", label: "T3 — 3 pièces" },
  { value: "T4", label: "T4 — 4 pièces" },
  { value: "T5", label: "T5 — 5 pièces" },
] as const;

export const canopeaFeatures = [
  "Terrasses spacieuses",
  "Jardin central",
  "Toitures végétalisées",
  "Bordure de parc arboré",
  "Gare et tramway à pied",
  "Architecture bois",
] as const;

export const canopeaFeatureMarks = ["✧", "♧", "⌂", "↳", "◌", "↔"] as const;

export function buildCanopeaJsonLd() {
  const residenceId = `${CANOPEA_URL}/#residence`;
  const agencyId = `${SITE_URL}/#agence`;
  const address = {
    "@type": "PostalAddress",
    ...CANOPEA_ADDRESS,
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${CANOPEA_URL}/#webpage`,
        url: CANOPEA_URL,
        name: CANOPEA_PAGE_TITLE,
        description: CANOPEA_PAGE_DESCRIPTION,
        inLanguage: "fr-FR",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": residenceId },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${SITE_URL}/canopea/vue-drone-parc_canopea.jpg`,
          caption:
            "Perspective aérienne de la résidence Canopea à Montpellier, deux bâtiments en bordure d’un parc arboré",
        },
        dateModified: CANOPEA_PRICE_CHECKED_ON,
        breadcrumb: { "@id": `${CANOPEA_URL}/#breadcrumb` },
        citation: CANOPEA_OFFICIAL_PROGRAM_URL,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${CANOPEA_URL}/#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Accueil",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Canopea",
            item: residenceId,
          },
        ],
      },
      {
        "@type": "RealEstateAgent",
        "@id": agencyId,
        name: SITE_NAME,
        url: SITE_URL,
        slogan: "L’immobilier neuf, bien choisi.",
        image: `${SITE_URL}/logo-selection-neuf.png`,
        areaServed: {
          "@type": "City",
          name: "Montpellier",
          containedInPlace: {
            "@type": "AdministrativeArea",
            name: "Hérault",
          },
        },
      },
      {
        "@type": "ApartmentComplex",
        "@id": residenceId,
        name: "Canopea",
        description:
          "Résidence neuve à Montpellier, quartier Nouveau Saint-Roch, rue Isabelle Eberhardt : deux bâtiments reliés par un jardin central, appartements du 2 au 5 pièces en bordure du parc René Dumont. Livraison prévisionnelle au 2e trimestre 2028.",
        url: residenceId,
        image: [
          `${SITE_URL}/canopea/vue-drone-parc_canopea.jpg`,
          `${SITE_URL}/canopea/pers-interieure_canopea.jpg`,
          `${SITE_URL}/canopea/pers-terrasse_canopea.jpg`,
        ],
        address,
        hasMap: CANOPEA_MAPS_URL,
        containedInPlace: {
          "@type": "City",
          name: "Montpellier",
        },
        amenityFeature: canopeaFeatures.map((name) => ({
          "@type": "LocationFeatureSpecification",
          name,
          value: true,
        })),
      },
      ...canopeaApartments
        .filter((apartment) => apartment.priceValue !== null)
        .map((apartment) => ({
          "@type": "RealEstateListing",
          "@id": `${CANOPEA_URL}/#${apartment.id.toLowerCase()}`,
          name: `Canopea — ${apartment.id} ${apartment.pieces}`,
          description: `Appartement neuf ${apartment.pieces} à Canopea, Montpellier. Prix à partir de ${apartment.priceLabel} €, TVA 20 %. Sous réserve de disponibilité.`,
          url: `${CANOPEA_URL}/#appartements`,
          datePosted: CANOPEA_PRICE_CHECKED_ON,
          image: `${SITE_URL}/canopea/pers-interieure_canopea.jpg`,
          address,
          about: { "@id": residenceId },
          provider: { "@id": agencyId },
          offers: {
            "@type": "Offer",
            price: apartment.priceValue,
            priceCurrency: "EUR",
            availability: "https://schema.org/LimitedAvailability",
            url: `${CANOPEA_URL}/#contact`,
            seller: { "@id": agencyId },
            priceSpecification: {
              "@type": "PriceSpecification",
              price: apartment.priceValue,
              priceCurrency: "EUR",
              valueAddedTaxIncluded: true,
              description:
                "Prix TTC en TVA 20 %. Sous réserve de disponibilité.",
            },
          },
        })),
    ],
  };
}
