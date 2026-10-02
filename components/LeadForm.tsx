"use client";

import { useActionState, useEffect, useRef, useCallback } from "react";
import { submitLead, type LeadState } from "@/app/actions";
import { useTypology } from "@/components/TypologyProvider";
import { trackLeadConversion } from "@/lib/gtag";
import { persistLandingUtm, UTM_KEYS } from "@/lib/utm";
import {
  getOrCreateSessionId,
  trackVisitorField,
  flushVisitorTracking,
} from "@/lib/visitor-tracking";

const initialState: LeadState = null;

type TypologyOption = { value: string; label: string };

const defaultTypologies: TypologyOption[] = [
  { value: "T2", label: "T2 — 2 pièces" },
  { value: "T3", label: "T3 — 3 pièces" },
  { value: "T4", label: "T4 — 4 pièces" },
];

export function LeadForm({
  typologies = defaultTypologies,
  source = "duo-verde-montpellier",
}: {
  typologies?: readonly TypologyOption[];
  source?: string;
}) {
  const [state, formAction, pending] = useActionState(submitLead, initialState);
  const { typology, selectTypology } = useTypology();
  const sessionIdRef = useRef("");

  useEffect(() => {
    sessionIdRef.current = getOrCreateSessionId();
    const utm = persistLandingUtm();
    const meta: Record<string, string | null> = {
      source,
      page_url: window.location.href,
    };
    for (const key of UTM_KEYS) {
      meta[key] = utm[key];
    }
    trackVisitorField(sessionIdRef.current, "source", source, meta);
  }, [source]);

  useEffect(() => {
    if (state?.ok) {
      trackLeadConversion();
    }
  }, [state?.ok]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, type } = e.target;
      const value =
        type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
      trackVisitorField(sessionIdRef.current, name, value);
    },
    [],
  );

  return (
    <form
      id="contact"
      action={(formData) => {
        flushVisitorTracking();
        const utm = persistLandingUtm();
        for (const key of UTM_KEYS) {
          const value = utm[key];
          if (value) formData.set(key, value);
        }
        formAction(formData);
      }}
    >
      <input type="hidden" name="source" value={source} />
      <h3>Recevoir le dossier complet</h3>
      <p>Recevez la brochure complète avec les prix et les plans</p>
      <div className="form-grid">
        <label>
          Prénom *
          <input name="prenom" autoComplete="given-name" required placeholder="Votre prénom" onChange={handleChange} />
        </label>
        <label>
          Nom *
          <input name="nom" autoComplete="family-name" required placeholder="Votre nom" onChange={handleChange} />
        </label>
      </div>
      <label>
        E-mail *
        <input name="email" type="email" autoComplete="email" required placeholder="vous@exemple.fr" onChange={handleChange} />
      </label>
      <label>
        Téléphone *
        <input
          name="telephone"
          type="tel"
          autoComplete="tel"
          required
          minLength={10}
          placeholder="06 00 00 00 00"
          onChange={handleChange}
        />
      </label>
      <div className="form-grid">
        <label>
          Votre projet
          <select name="projet" defaultValue="Habiter" onChange={handleChange}>
            <option>Habiter</option>
            <option>Investir</option>
            <option>Je réfléchis encore</option>
          </select>
        </label>
        <label>
          Votre appartement
          <select
            name="typologie"
            id="typologie"
            value={typology}
            onChange={(event) => {
              selectTypology(event.target.value);
              handleChange(event);
            }}
          >
            <option value="">À définir</option>
            {typologies.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="consent">
        <input type="checkbox" required name="consent" defaultChecked onChange={handleChange} />
        <span>
          J'accepte d'être contacté(e) par Sélection Neuf au sujet de ma demande
        </span>
      </label>
      <button className="button" type="submit" disabled={pending}>
        {pending ? "Envoi en cours…" : (<>Valider ma demande <span>↗</span></>)}
      </button>
      <p className="form-note">Vos données sont transmises à votre conseiller Sélection Neuf.</p>
      <p
        id="form-status"
        role="status"
        data-ok={state?.ok ? "true" : state ? "false" : undefined}
        hidden={!state?.message}
      >
        {state?.message}
      </p>
    </form>
  );
}
