import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";

const FIELD_KEYS = [
  "prenom",
  "nom",
  "email",
  "telephone",
  "projet",
  "typologie",
  "consent",
  "source",
  "page_url",
  "utm_source",
  "utm_campaign",
  "utm_ad",
] as const;

function sanitize(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const cleaned = value.replace(/[\u0000-\u001F\u007F]/g, "").trim().slice(0, 500);
  return cleaned || null;
}

const MAX_DURATION_SECONDS = 24 * 60 * 60;

function sanitizeDuration(value: unknown): number | null {
  const n = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
  if (!Number.isFinite(n)) return null;
  return Math.min(MAX_DURATION_SECONDS, Math.max(0, Math.floor(n)));
}

function isMissingDurationColumn(error: { code?: string; message?: string }): boolean {
  if (!/duree_secondes/.test(error.message ?? "")) return false;
  return error.code === "PGRST204" || error.code === "42703";
}

function getClientIp(request: NextRequest): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const real = request.headers.get("x-real-ip");
  if (real) return real.trim();
  return null;
}

type GeoResult = {
  geo_country: string | null;
  geo_region: string | null;
  geo_city: string | null;
  geo_lat: number | null;
  geo_lon: number | null;
};

async function geolocateIp(ip: string): Promise<GeoResult | null> {
  if (!ip || /^(127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|::1|localhost)/.test(ip)) {
    return null;
  }
  try {
    const res = await fetch(
      `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,country,regionName,city,lat,lon`,
      { signal: AbortSignal.timeout(3000) },
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (data.status !== "success") return null;
    return {
      geo_country: data.country ?? null,
      geo_region: data.regionName ?? null,
      geo_city: data.city ?? null,
      geo_lat: typeof data.lat === "number" ? data.lat : null,
      geo_lon: typeof data.lon === "number" ? data.lon : null,
    };
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "config" }, { status: 500 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const sessionId = sanitize(body.session_id);
  if (!sessionId) {
    return NextResponse.json({ error: "missing_session_id" }, { status: 400 });
  }

  const ip = getClientIp(request);
  const userAgent = request.headers.get("user-agent");

  const fields: Record<string, string | boolean | null> = {};
  for (const key of FIELD_KEYS) {
    if (key in body) {
      if (key === "consent") {
        fields[key] = Boolean(body[key]);
      } else {
        fields[key] = sanitize(body[key]);
      }
    }
  }

  const duration = sanitizeDuration(body.duree_secondes);

  let durationSupported = true;
  const lookup = await supabase
    .from("visiteurs")
    .select("id, geo_country, duree_secondes")
    .eq("session_id", sessionId)
    .maybeSingle();

  let existing: {
    id: string;
    geo_country: string | null;
    duree_secondes?: number | null;
  } | null = lookup.data;
  if (lookup.error && isMissingDurationColumn(lookup.error)) {
    durationSupported = false;
    const fallback = await supabase
      .from("visiteurs")
      .select("id, geo_country")
      .eq("session_id", sessionId)
      .maybeSingle();
    if (fallback.error) {
      console.error("Erreur lecture visiteur:", fallback.error);
      return NextResponse.json({ error: "read_failed" }, { status: 500 });
    }
    existing = fallback.data;
  } else if (lookup.error) {
    console.error("Erreur lecture visiteur:", lookup.error);
    return NextResponse.json({ error: "read_failed" }, { status: 500 });
  }

  if (existing) {
    const previousDuration =
      typeof existing.duree_secondes === "number" ? existing.duree_secondes : 0;
    const update: Record<string, unknown> = {
      ...fields,
      ip,
      user_agent: userAgent,
      updated_at: new Date().toISOString(),
    };

    if (durationSupported && duration !== null) {
      update.duree_secondes = Math.max(previousDuration, duration);
    }

    if (!existing.geo_country && ip) {
      const geo = await geolocateIp(ip);
      if (geo) Object.assign(update, geo);
    }

    const { error } = await supabase
      .from("visiteurs")
      .update(update)
      .eq("session_id", sessionId);

    if (error) {
      console.error("Erreur update visiteur:", error);
      return NextResponse.json({ error: "update_failed" }, { status: 500 });
    }
  } else {
    const geo = ip ? await geolocateIp(ip) : null;

    const { error } = await supabase.from("visiteurs").insert({
      session_id: sessionId,
      ip,
      user_agent: userAgent,
      ...(durationSupported ? { duree_secondes: duration ?? 0 } : {}),
      ...fields,
      ...(geo ?? {}),
    });

    if (error) {
      console.error("Erreur insert visiteur:", error);
      return NextResponse.json({ error: "insert_failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
