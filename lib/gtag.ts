// Identifiant Google Ads (Google tag).
export const GADS_ID = "AW-18481078166";

// Label de l'action de conversion fourni par Google Ads.
// Format attendu : "AbCdEfGhIjKlMnOp" (la partie après le "/").
// Surchargée si besoin dans .env.local via NEXT_PUBLIC_GADS_CONVERSION_LABEL.
export const GADS_CONVERSION_LABEL =
  process.env.NEXT_PUBLIC_GADS_CONVERSION_LABEL ?? "Z-apCNH6xIsdEJa_u-xE";

// Valeur et devise associées à la conversion "Envoi de formulaire de lead".
export const GADS_CONVERSION_VALUE = 1.0;
export const GADS_CONVERSION_CURRENCY = "EUR";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

// Déclenche l'événement de conversion Google Ads lors de la réception d'un lead.
export function trackLeadConversion() {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  const sendTo = GADS_CONVERSION_LABEL ? `${GADS_ID}/${GADS_CONVERSION_LABEL}` : GADS_ID;

  window.gtag("event", "conversion", {
    send_to: sendTo,
    value: GADS_CONVERSION_VALUE,
    currency: GADS_CONVERSION_CURRENCY,
  });
}
