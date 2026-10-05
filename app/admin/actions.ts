"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  ADMIN_COOKIE,
  createSessionToken,
  getAdminSupabaseClient,
  isAuthenticated,
  sessionCookieOptions,
  verifyCredentials,
} from "@/lib/admin";

export type LoginState = { error: string } | null;

export async function loginAction(
  _previous: LoginState,
  formData: FormData
): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!verifyCredentials(username, password)) {
    return { error: "Identifiant ou mot de passe incorrect." };
  }

  const store = await cookies();
  store.set(ADMIN_COOKIE, createSessionToken(), sessionCookieOptions);
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  const store = await cookies();
  store.delete({ name: ADMIN_COOKIE, path: "/admin" });
  redirect("/admin/login");
}

const VISITEUR_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type DeleteVisiteursResult =
  | { ok: true; deleted: number }
  | { ok: false; error: string };

export async function deleteVisiteursAction(ids: string[]): Promise<DeleteVisiteursResult> {
  if (!(await isAuthenticated())) {
    return { ok: false, error: "Session expirée. Reconnectez-vous." };
  }

  const unique = [...new Set(ids)].filter((id) => VISITEUR_ID.test(id));
  if (unique.length === 0) {
    return { ok: false, error: "Aucune ligne à supprimer." };
  }
  if (unique.length > 500) {
    return { ok: false, error: "Sélectionnez au plus 500 lignes à la fois." };
  }

  const supabase = getAdminSupabaseClient();
  if (!supabase) {
    return { ok: false, error: "Clé Supabase service manquante." };
  }

  const { error, count } = await supabase
    .from("visiteurs")
    .delete({ count: "exact" })
    .in("id", unique);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/admin/visiteurs");
  return { ok: true, deleted: count ?? unique.length };
}
