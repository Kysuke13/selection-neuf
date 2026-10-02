"use client";

import { useRef, useCallback, useEffect, useActionState } from "react";
import { submitLead, type LeadState } from "@/app/actions";
import { trackLeadConversion } from "@/lib/gtag";
import { persistLandingUtm, UTM_KEYS } from "@/lib/utm";

const initialState: LeadState = null;

export function BrochureModal({
  open,
  onClose,
  source = "duo-verde-montpellier",
}: {
  open: boolean;
  onClose: () => void;
  source?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [state, formAction, pending] = useActionState(submitLead, initialState);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    else if (!open && el.open) el.close();
  }, [open]);

  useEffect(() => {
    if (state?.ok) trackLeadConversion();
  }, [state?.ok]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDialogElement>) => {
      if (e.target === dialogRef.current) onClose();
    },
    [onClose],
  );

  return (
    <dialog
      ref={dialogRef}
      className="brochure-modal"
      onClose={onClose}
      onClick={handleBackdropClick}
    >
      <div className="brochure-modal-inner">
        <button
          className="brochure-modal-close"
          type="button"
          onClick={onClose}
          aria-label="Fermer"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <h3 className="brochure-modal-title">Télécharger la brochure</h3>
        <p className="brochure-modal-desc">
          Recevez votre brochure gratuitement par email en quelques instants.
          Besoin de conseils personnalisés&nbsp;? Laissez-nous votre numéro pour
          qu'un conseiller vous accompagne dans votre projet.
        </p>

        <form
          className="brochure-modal-form"
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

          <div className="bm-grid">
            <label>
              Nom&nbsp;*
              <input name="nom" autoComplete="family-name" required placeholder="Votre nom" />
            </label>
            <label>
              Prénom&nbsp;*
              <input name="prenom" autoComplete="given-name" required placeholder="Votre prénom" />
            </label>
          </div>

          <div className="bm-grid">
            <label>
              E-mail&nbsp;*
              <input name="email" type="email" autoComplete="email" required placeholder="vous@exemple.fr" />
            </label>
            <label>
              Numéro de téléphone
              <input name="telephone" type="tel" autoComplete="tel" required minLength={10} placeholder="06 12 34 56 78" />
            </label>
          </div>

          <div className="bm-grid">
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
              <select name="typologie">
                <option value="">À définir</option>
                <option value="T2">T2 — 2 pièces</option>
                <option value="T3">T3 — 3 pièces</option>
                <option value="T4">T4 — 4 pièces</option>
              </select>
            </label>
          </div>

          <label className="consent">
            <input type="checkbox" required name="consent" defaultChecked />
            <span>
              J'accepte d'être contacté(e) par Sélection Neuf au sujet de ma demande
            </span>
          </label>

          <button className="button" type="submit" disabled={pending}>
            {pending ? (
              "Envoi en cours…"
            ) : (
              <>
                Recevoir la brochure <span aria-hidden="true">↗</span>
              </>
            )}
          </button>

          <p
            role="status"
            className="bm-status"
            data-ok={state?.ok ? "true" : state ? "false" : undefined}
            hidden={!state?.message}
          >
            {state?.message}
          </p>
        </form>
      </div>
    </dialog>
  );
}
