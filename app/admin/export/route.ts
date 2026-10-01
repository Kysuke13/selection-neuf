import { NextResponse, type NextRequest } from "next/server";
import { fetchLeads, isAuthenticated, PROGRAMMES, programmeLabel } from "@/lib/admin";

export const dynamic = "force-dynamic";

function csvCell(value: unknown): string {
  const str = value === null || value === undefined ? "" : String(value);
  if (/[";\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const source = request.nextUrl.searchParams.get("programme") ?? undefined;
  const filterSource = source && PROGRAMMES[source] ? source : undefined;

  const result = await fetchLeads(filterSource);
  if (!result.ok) {
    return new NextResponse(`Erreur: ${result.error}`, { status: 500 });
  }

  const headers = [
    "Date",
    "Programme",
    "Ville",
    "Prénom",
    "Nom",
    "Email",
    "Téléphone",
    "Projet",
    "Typologie",
    "Consentement",
    "Page",
    "UTM source",
    "UTM campagne",
    "UTM annonce",
  ];

  const rows = result.leads.map((lead) => {
    const prog = programmeLabel(lead.source);
    return [
      lead.created_at,
      prog.label,
      prog.ville,
      lead.prenom,
      lead.nom,
      lead.email,
      lead.telephone,
      lead.projet ?? "",
      lead.typologie ?? "",
      lead.consent ? "Oui" : "Non",
      lead.page_url ?? "",
      lead.utm_source ?? "",
      lead.utm_campaign ?? "",
      lead.utm_ad ?? "",
    ]
      .map(csvCell)
      .join(";");
  });

  // BOM pour une ouverture correcte des accents dans Excel.
  const csv = "\uFEFF" + [headers.join(";"), ...rows].join("\r\n");
  const date = new Date().toISOString().slice(0, 10);
  const suffix = filterSource ? `-${filterSource}` : "";

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads${suffix}-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
