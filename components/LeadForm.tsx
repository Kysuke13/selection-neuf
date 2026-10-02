"use client";

import { useActionState, useEffect } from "react";
import { submitLead, type LeadState } from "@/app/actions";
import { useTypology } from "@/components/TypologyProvider";
import { trackLeadConversion } from "@/lib/gtag";
import { persistLandingUtm, UTM_KEYS } from "@/lib/utm";

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

  useEffect(() => {
    if (state?.ok) {
      trackLeadConversion();
    }
  }, [state?.ok]);

  return (
    <form
      id="contact"
      action={(formData) => {
        const utm = persistLandingUtm();
        for (const key of UTM_KEYS) {
          const value = utm[key];
          if (value) formData.set(key, value);
        }
        formAction(formData);
      }}
    >
      <input type="hidden" name="source" value={source} />
      <h3>Recevez votre dossier</h3>
      <p>Gratuit et sans engagement.</p>
      <div className="form-grid">
        <label>
          Prénom *
          <input name="prenom" autoComplete="given-name" required placeholder="Votre prénom" />
        </label>
        <label>
          Nom *
          <input name="nom" autoComplete="family-name" required placeholder="Votre nom" />
        </label>
      </div>
      <label>
        E-mail *
        <input name="email" type="email" autoComplete="email" required placeholder="vous@exemple.fr" />
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
        />
      </label>
      <div className="form-grid">
        <label>
          Votre projet
          <select name="projet" defaultValue="Habiter">
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
            onChange={(event) => selectTypology(event.target.value)}
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
        <input type="checkbox" required name="consent" defaultChecked />
        <span>
          J’accepte d’être contacté(e) par Sélection Neuf au sujet de ma demande
        </span>
      </label>
      <button className="button" type="submit" disabled={pending}>
        {pending ? "Envoi en cours…" : (<>Recevoir la plaquette et les plans <span>↗</span></>)}
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
