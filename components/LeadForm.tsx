"use client";

import { useActionState } from "react";
import { submitLead, type LeadState } from "@/app/actions";
import { useTypology } from "@/components/TypologyProvider";

const initialState: LeadState = null;

export function LeadForm() {
  const [state, formAction, pending] = useActionState(submitLead, initialState);
  const { typology, selectTypology } = useTypology();

  return (
    <form id="lead-form" action={formAction}>
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
            <option value="T2">T2 — 2 pièces</option>
            <option value="T3">T3 — 3 pièces</option>
            <option value="T4">T4 — 4 pièces</option>
          </select>
        </label>
      </div>
      <label className="consent">
        <input type="checkbox" required name="consent" />
        <span>
          J’accepte d’être contacté(e) par Sélection Neuf au sujet de ma demande de documentation et
          de mon projet immobilier. *
        </span>
      </label>
      <button className="button" type="submit" disabled={pending}>
        Recevoir la plaquette et les plans <span>↗</span>
      </button>
      <p className="form-note">Maquette de démonstration : aucune donnée n’est envoyée.</p>
      <p id="form-status" role="status" hidden={!state?.message}>
        {state?.message}
      </p>
    </form>
  );
}
