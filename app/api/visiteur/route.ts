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

function getClientIp(request: NextRequest): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const real = request.headers.get("x-real-ip");
  if (real) return real.trim();
  return null;
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

  const { data: existing } = await supabase
    .from("visiteurs")
    .select("id")
    .eq("session_id", sessionId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("visiteurs")
      .update({ ...fields, ip, user_agent: userAgent, updated_at: new Date().toISOString() })
      .eq("session_id", sessionId);

    if (error) {
      console.error("Erreur update visiteur:", error);
      return NextResponse.json({ error: "update_failed" }, { status: 500 });
    }
  } else {
    const { error } = await supabase.from("visiteurs").insert({
      session_id: sessionId,
      ip,
      user_agent: userAgent,
      ...fields,
    });

    if (error) {
      console.error("Erreur insert visiteur:", error);
      return NextResponse.json({ error: "insert_failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
