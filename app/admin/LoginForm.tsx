"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = null;

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="admin-login-card">
      <div className="brand">
        sélection neuf<span>.</span>
      </div>
      <p className="sub">Espace d&apos;administration</p>

      {state?.error ? <div className="login-error">{state.error}</div> : null}

      <label htmlFor="username">Identifiant</label>
      <input
        id="username"
        name="username"
        autoComplete="username"
        autoCapitalize="none"
        required
        autoFocus
      />

      <label htmlFor="password">Mot de passe</label>
      <input id="password" name="password" type="password" autoComplete="current-password" required />

      <button type="submit" disabled={pending}>
        {pending ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
