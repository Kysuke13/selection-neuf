export const UTM_KEYS = ["utm_source", "utm_campaign", "utm_ad"] as const;

export type UtmKey = (typeof UTM_KEYS)[number];
export type UtmParams = Record<UtmKey, string | null>;

const STORAGE_KEY = "sn_utm";
const MAX_LENGTH = 200;

export function emptyUtm(): UtmParams {
  return { utm_source: null, utm_campaign: null, utm_ad: null };
}

function cleanUtmValue(value: string | null | undefined): string | null {
  if (!value) return null;
  const cleaned = value.replace(/[\u0000-\u001F\u007F]/g, "").trim().slice(0, MAX_LENGTH);
  return cleaned || null;
}

function readStoredUtm(): UtmParams {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyUtm();
    const parsed = JSON.parse(raw) as Partial<Record<UtmKey, unknown>>;
    const next = emptyUtm();
    for (const key of UTM_KEYS) {
      next[key] = cleanUtmValue(typeof parsed[key] === "string" ? parsed[key] : null);
    }
    return next;
  } catch {
    return emptyUtm();
  }
}

/**
 * Mémorise les paramètres Google Ads de l'URL de la session
 * (`utm_source`, `utm_campaign`, `utm_ad`) pour qu'ils suivent le visiteur
 * jusqu'à l'envoi du formulaire, même après un changement de page.
 */
export function persistLandingUtm(): UtmParams {
  if (typeof window === "undefined") return emptyUtm();

  const params = new URLSearchParams(window.location.search);
  const fromUrl = emptyUtm();
  let hasUrlValue = false;
  for (const key of UTM_KEYS) {
    const value = cleanUtmValue(params.get(key));
    if (value) {
      fromUrl[key] = value;
      hasUrlValue = true;
    }
  }

  const next = hasUrlValue ? fromUrl : readStoredUtm();
  if (hasUrlValue) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Navigation privée trop stricte : on renvoie quand même les valeurs
      // de l'URL courante pour l'envoi immédiat du formulaire.
    }
  }
  return next;
}
