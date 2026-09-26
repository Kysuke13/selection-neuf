"use server";

export type LeadState = { message: string } | null;

export async function submitLead(_previous: LeadState, formData: FormData): Promise<LeadState> {
  const prenom = String(formData.get("prenom") ?? "").trim();
  const nom = String(formData.get("nom") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const telephone = String(formData.get("telephone") ?? "").trim();
  const consent = formData.get("consent");

  if (!prenom || !nom || !email || telephone.length < 10 || !consent) {
    return { message: "Merci de renseigner tous les champs obligatoires." };
  }

  return {
    message:
      "Votre demande est prête. Ceci est une démonstration : aucune donnée n’a été envoyée. Sur la version en ligne, elle sera transmise à votre conseiller Sélection Neuf.",
  };
}
