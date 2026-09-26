export const SITE_NAME = "Sélection Neuf";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000")
).replace(/\/$/, "");

export const PAGE_TITLE =
  "Duo Verde à Montpellier — appartements neufs | Sélection Neuf";

export const PAGE_DESCRIPTION =
  "Appartements neufs Duo Verde à Montpellier, du T2 au T4, dès 186 538 €. Parc de 5 000 m², route de Lavérune. Livraison fin 2027. Recevez la plaquette et les plans.";

export const PRICE_CHECKED_ON = "2026-09-26";
export const OFFER_START = "2026-09-14";
export const OFFER_END = "2026-10-31";

export const ADDRESS = {
  streetAddress: "1810–1860, route de Lavérune",
  postalCode: "34090",
  addressLocality: "Montpellier",
  addressRegion: "Hérault",
  addressCountry: "FR",
} as const;

export const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=1810%20-1860%2C%20route%20de%20Lav%C3%A9rune%2034090%20Montpellier";

export const OFFICIAL_PROGRAM_URL =
  "https://www.kaufmanbroad.fr/achat-immobilier-neuf/occitanie/herault/montpellier/programme/35371";

export const apartments = [
  {
    id: "T2",
    pieces: "2 pièces",
    surfaceLabel: "37,13",
    surfaceValue: 37.13,
    priceLabel: "186 538",
    priceValue: 186538,
    compareAtLabel: "192 538",
  },
  {
    id: "T3",
    pieces: "3 pièces",
    surfaceLabel: "59,68",
    surfaceValue: 59.68,
    priceLabel: "283 763",
    priceValue: 283763,
    compareAtLabel: null,
  },
  {
    id: "T4",
    pieces: "4 pièces",
    surfaceLabel: "81,57",
    surfaceValue: 81.57,
    priceLabel: "364 283",
    priceValue: 364283,
    compareAtLabel: null,
  },
] as const;

export const entryApartment = apartments[0];

export const features = [
  "Balcons et terrasses",
  "Jardins partagés",
  "Résidence sécurisée",
  "Parking en sous-sol",
  "Espace vélos",
  "Transports à proximité",
] as const;

export const featureMarks = ["✧", "♧", "⌂", "↳", "◌", "↔"] as const;

export function buildJsonLd() {
  const residenceId = `${SITE_URL}/#residence`;
  const agencyId = `${SITE_URL}/#agence`;
  const address = {
    "@type": "PostalAddress",
    ...ADDRESS,
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: "L’immobilier neuf, bien choisi.",
        inLanguage: "fr-FR",
        publisher: { "@id": agencyId },
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/#webpage`,
        url: SITE_URL,
        name: PAGE_TITLE,
        description: PAGE_DESCRIPTION,
        inLanguage: "fr-FR",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": residenceId },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${SITE_URL}/assets/facade.webp`,
          caption: "Perspective de la résidence Duo Verde à Montpellier, façades et balcons végétalisés",
        },
        dateModified: PRICE_CHECKED_ON,
        breadcrumb: { "@id": `${SITE_URL}/#breadcrumb` },
        citation: OFFICIAL_PROGRAM_URL,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE_URL}/#breadcrumb`,
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
            name: "Duo Verde",
            item: `${SITE_URL}/#residence`,
          },
        ],
      },
      {
        "@type": "RealEstateAgent",
        "@id": agencyId,
        name: SITE_NAME,
        url: SITE_URL,
        slogan: "L’immobilier neuf, bien choisi.",
        image: `${SITE_URL}/logo-selection-neuf.svg`,
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
        name: "Duo Verde",
        description:
          "Résidence neuve à Montpellier, route de Lavérune : appartements du 2 au 4 pièces dans un parc arboré de 5 000 m². Livraison prévisionnelle dès le 4e trimestre 2027.",
        url: `${SITE_URL}/#residence`,
        image: [
          `${SITE_URL}/assets/facade.webp`,
          `${SITE_URL}/assets/residence.webp`,
        ],
        address,
        hasMap: MAPS_URL,
        containedInPlace: {
          "@type": "City",
          name: "Montpellier",
        },
        amenityFeature: features.map((name) => ({
          "@type": "LocationFeatureSpecification",
          name,
          value: true,
        })),
      },
      ...apartments.map((apartment) => ({
        "@type": "RealEstateListing",
        "@id": `${SITE_URL}/#${apartment.id.toLowerCase()}`,
        name: `Duo Verde — ${apartment.id} ${apartment.pieces}`,
        description: `Appartement neuf ${apartment.pieces} à Duo Verde, Montpellier. Surface à partir de ${apartment.surfaceLabel} m². Prix à partir de ${apartment.priceLabel} €, TVA 5,5 % sous conditions, offre déduite.`,
        url: `${SITE_URL}/#appartements`,
        datePosted: PRICE_CHECKED_ON,
        image: `${SITE_URL}/assets/facade.webp`,
        address,
        about: { "@id": residenceId },
        provider: { "@id": agencyId },
        floorSize: {
          "@type": "QuantitativeValue",
          value: apartment.surfaceValue,
          unitCode: "MTK",
          name: `À partir de ${apartment.surfaceLabel} m²`,
        },
        offers: {
          "@type": "Offer",
          price: apartment.priceValue,
          priceCurrency: "EUR",
          availability: "https://schema.org/LimitedAvailability",
          validFrom: OFFER_START,
          priceValidUntil: OFFER_END,
          url: `${SITE_URL}/#contact`,
          seller: { "@id": agencyId },
          priceSpecification: {
            "@type": "PriceSpecification",
            price: apartment.priceValue,
            priceCurrency: "EUR",
            valueAddedTaxIncluded: true,
            description:
              "Prix TTC avec TVA à 5,5 % sous conditions, offre déduite. Sous réserve de disponibilité.",
          },
        },
      })),
    ],
  };
}
