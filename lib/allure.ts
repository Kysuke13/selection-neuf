import { SITE_NAME, SITE_URL } from "@/lib/site";

export const ALLURE_PATH = "/allure";
export const ALLURE_URL = `${SITE_URL}${ALLURE_PATH}`;

export const ALLURE_PAGE_TITLE =
  "Allure à Pontoise — appartements neufs | Sélection Neuf";

export const ALLURE_PAGE_DESCRIPTION =
  "Appartements neufs Allure à Pontoise (95), du studio au 4 pièces, dès 181 988 € en TVA réduite 5,5 %. Rue Henri Dunant, balcons, terrasses et jardins privatifs. Livraison 4e trimestre 2027. Recevez la brochure et les plans.";

export const ALLURE_PRICE_CHECKED_ON = "2026-09-30";

export const ALLURE_ADDRESS = {
  streetAddress: "Rue Henri Dunant",
  postalCode: "95300",
  addressLocality: "Pontoise",
  addressRegion: "Val-d’Oise",
  addressCountry: "FR",
} as const;

export const ALLURE_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Rue%20Henri%20Dunant%2095300%20Pontoise";

export const ALLURE_OFFICIAL_PROGRAM_URL =
  "https://www.cogedim.com/ile-de-france/val-doise-95/pontoise/allure-11708-1851014.html";

export const allureApartments = [
  {
    id: "Studio",
    pieces: "Studio",
    surfaceLabel: "31,54",
    surfaceValue: 31.54,
    priceLabel: "181 988",
    priceValue: 181988,
    priceTva20Label: "207 000",
  },
  {
    id: "T2",
    pieces: "2 pièces",
    surfaceLabel: "43,78",
    surfaceValue: 43.78,
    priceLabel: "225 067",
    priceValue: 225067,
    priceTva20Label: "256 000",
  },
  {
    id: "T4",
    pieces: "4 pièces",
    surfaceLabel: "80,49",
    surfaceValue: 80.49,
    priceLabel: "315 621",
    priceValue: 315621,
    priceTva20Label: "359 000",
  },
] as const;

export const allureEntryApartment = allureApartments[0];

export const allureTypologies = [
  { value: "Studio", label: "Studio évolutif" },
  { value: "T2", label: "2 pièces" },
  { value: "T4", label: "4 pièces" },
] as const;

export const allureFeatures = [
  "Balcons, terrasses & jardins privatifs",
  "Cascades de terrasses plein ciel",
  "Parking sécurisé en sous-sol",
  "Local à vélos",
  "Écoles & commerces à pied",
  "RER C à proximité",
] as const;

export const allureFeatureMarks = ["✧", "♧", "⌂", "↳", "◌", "↔"] as const;

export function buildAllureJsonLd() {
  const residenceId = `${ALLURE_URL}/#residence`;
  const agencyId = `${SITE_URL}/#agence`;
  const address = {
    "@type": "PostalAddress",
    ...ALLURE_ADDRESS,
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${ALLURE_URL}/#webpage`,
        url: ALLURE_URL,
        name: ALLURE_PAGE_TITLE,
        description: ALLURE_PAGE_DESCRIPTION,
        inLanguage: "fr-FR",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": residenceId },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${SITE_URL}/allure/hero.webp`,
          caption:
            "Perspective de la résidence Allure à Pontoise, façades blanches, cascades de terrasses et commerces en pied d’immeuble",
        },
        dateModified: ALLURE_PRICE_CHECKED_ON,
        breadcrumb: { "@id": `${ALLURE_URL}/#breadcrumb` },
        citation: ALLURE_OFFICIAL_PROGRAM_URL,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${ALLURE_URL}/#breadcrumb`,
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
            name: "Allure",
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
          name: "Pontoise",
          containedInPlace: {
            "@type": "AdministrativeArea",
            name: "Val-d’Oise",
          },
        },
      },
      {
        "@type": "ApartmentComplex",
        "@id": residenceId,
        name: "Allure",
        description:
          "Résidence neuve à Pontoise (95), rue Henri Dunant : du studio au 4 pièces, presque tous prolongés de balcons, terrasses ou jardins privatifs, avec cascades de terrasses plein ciel. Certifiée RE2020 et NF Habitat. Livraison prévisionnelle au 4e trimestre 2027.",
        url: residenceId,
        image: [
          `${SITE_URL}/allure/hero.webp`,
          `${SITE_URL}/allure/perspective-1.jpg`,
          `${SITE_URL}/allure/ambiance-1.jpg`,
        ],
        address,
        hasMap: ALLURE_MAPS_URL,
        containedInPlace: {
          "@type": "City",
          name: "Pontoise",
        },
        amenityFeature: allureFeatures.map((name) => ({
          "@type": "LocationFeatureSpecification",
          name,
          value: true,
        })),
      },
      ...allureApartments.map((apartment) => ({
        "@type": "RealEstateListing",
        "@id": `${ALLURE_URL}/#${apartment.id.toLowerCase()}`,
        name: `Allure — ${apartment.pieces}`,
        description: `${apartment.pieces} neuf à Allure, Pontoise. Surface à partir de ${apartment.surfaceLabel} m². Prix à partir de ${apartment.priceLabel} € en TVA réduite 5,5 % sous conditions. Sous réserve de disponibilité.`,
        url: `${ALLURE_URL}/#appartements`,
        datePosted: ALLURE_PRICE_CHECKED_ON,
        image: `${SITE_URL}/allure/ambiance-1.jpg`,
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
          url: `${ALLURE_URL}/#contact`,
          seller: { "@id": agencyId },
          priceSpecification: {
            "@type": "PriceSpecification",
            price: apartment.priceValue,
            priceCurrency: "EUR",
            valueAddedTaxIncluded: true,
            description:
              "Prix TTC en TVA réduite à 5,5 % sous conditions de ressources et de zone. Sous réserve de disponibilité.",
          },
        },
      })),
    ],
  };
}
