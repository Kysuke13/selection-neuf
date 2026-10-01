"use server";

import { headers } from "next/headers";
import { getSupabaseClient } from "@/lib/supabase";

export type LeadState = { message: string; ok?: boolean } | null;

function readUtm(formData: FormData, key: string): string | null {
  const value = String(formData.get(key) ?? "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim()
    .slice(0, 200);
  return value || null;
}

export async function submitLead(_previous: LeadState, formData: FormData): Promise<LeadState> {
  const prenom = String(formData.get("prenom") ?? "").trim();
  const nom = String(formData.get("nom") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const telephone = String(formData.get("telephone") ?? "").trim();
  const projet = String(formData.get("projet") ?? "").trim() || null;
  const typologie = String(formData.get("typologie") ?? "").trim() || null;
  const source = String(formData.get("source") ?? "").trim() || "duo-verde-montpellier";
  const consent = formData.get("consent");

  if (!prenom || !nom || !email || telephone.length < 10 || !consent) {
    return { message: "Merci de renseigner tous les champs obligatoires.", ok: false };
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    return {
      message:
        "Configuration Supabase manquante. Vérifiez le fichier .env.local, puis réessayez.",
      ok: false,
    };
  }

  const headerList = await headers();
  const userAgent = headerList.get("user-agent");
  const pageUrl = headerList.get("referer");
  const utmSource = readUtm(formData, "utm_source");
  const utmCampaign = readUtm(formData, "utm_campaign");
  const utmAd = readUtm(formData, "utm_ad");

  const { error } = await supabase.from("leads").insert({
    prenom,
    nom,
    email,
    telephone,
    projet,
    typologie,
    source,
    consent: Boolean(consent),
    page_url: pageUrl,
    user_agent: userAgent,
    utm_source: utmSource,
    utm_campaign: utmCampaign,
    utm_ad: utmAd,
  });

  if (error) {
    console.error("Erreur d'enregistrement du lead Supabase:", error);
    return {
      message:
        "Une erreur est survenue lors de l'envoi. Merci de réessayer dans un instant.",
      ok: false,
    };
  }

  return {
    message:
      "Merci ! Votre demande a bien été enregistrée. Un conseiller Sélection Neuf vous recontactera rapidement.",
    ok: true,
  };
}
