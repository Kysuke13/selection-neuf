import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const ADMIN_COOKIE = "sn_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 12; // 12 heures

function getCredentials() {
  return {
    username: process.env.ADMIN_USERNAME ?? "admin",
    password: process.env.ADMIN_PASSWORD ?? "",
  };
}

function getSessionSecret() {
  return (
    process.env.ADMIN_SESSION_SECRET ??
    process.env.ADMIN_PASSWORD ??
    "selection-neuf-admin-fallback-secret"
  );
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/** Vérifie un couple identifiant / mot de passe. */
export function verifyCredentials(username: string, password: string): boolean {
  const creds = getCredentials();
  if (!creds.password) return false;
  return safeEqual(username, creds.username) && safeEqual(password, creds.password);
}

/** Construit un jeton de session signé (HMAC) valable SESSION_MAX_AGE. */
export function createSessionToken(): string {
  const payload = JSON.stringify({
    u: getCredentials().username,
    exp: Date.now() + SESSION_MAX_AGE * 1000,
  });
  const body = Buffer.from(payload).toString("base64url");
  const sig = createHmac("sha256", getSessionSecret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

function isValidToken(token: string | undefined): boolean {
  if (!token) return false;
  const [body, sig] = token.split(".");
  if (!body || !sig) return false;
  const expected = createHmac("sha256", getSessionSecret()).update(body).digest("base64url");
  if (!safeEqual(sig, expected)) return false;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    return typeof payload.exp === "number" && payload.exp > Date.now();
  } catch {
    return false;
  }
}

/** Indique si la requête courante dispose d'une session admin valide. */
export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return isValidToken(store.get(ADMIN_COOKIE)?.value);
}

export const sessionCookieOptions = {
  httpOnly: true as const,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/admin",
  maxAge: SESSION_MAX_AGE,
};

/** Client Supabase à privilèges service (lecture complète des leads). */
export function getAdminSupabaseClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export type Lead = {
  id: string;
  created_at: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  projet: string | null;
  typologie: string | null;
  consent: boolean;
  source: string | null;
  page_url: string | null;
  user_agent: string | null;
  utm_source: string | null;
  utm_campaign: string | null;
  utm_ad: string | null;
};

/** Libellés lisibles des programmes, indexés sur la colonne `source`. */
export const PROGRAMMES: Record<string, { label: string; ville: string }> = {
  "duo-verde-montpellier": { label: "Duo Verde", ville: "Montpellier" },
  "allure-pontoise": { label: "Allure", ville: "Pontoise" },
  "canopea-montpellier": { label: "Canopea", ville: "Montpellier" },
};

export function programmeLabel(source: string | null): { label: string; ville: string } {
  if (source && PROGRAMMES[source]) return PROGRAMMES[source];
  return { label: source ?? "—", ville: "" };
}

export type FetchLeadsResult =
  | { ok: true; leads: Lead[] }
  | { ok: false; error: string };

/** Récupère les leads (plus récents d'abord), filtrables par programme. */
export async function fetchLeads(source?: string): Promise<FetchLeadsResult> {
  const supabase = getAdminSupabaseClient();
  if (!supabase) {
    return {
      ok: false,
      error:
        "Clé Supabase service (SUPABASE_SECRET_KEY) manquante. Renseignez-la dans .env.local pour consulter les leads.",
    };
  }

  let query = supabase
    .from("leads")
    .select(
      "id, created_at, prenom, nom, email, telephone, projet, typologie, consent, source, page_url, user_agent, utm_source, utm_campaign, utm_ad"
    )
    .order("created_at", { ascending: false });

  if (source) query = query.eq("source", source);

  const { data, error } = await query;
  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true, leads: (data ?? []) as Lead[] };
}
