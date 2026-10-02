import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  fetchLeads,
  isAuthenticated,
  PROGRAMMES,
  programmeLabel,
  type Lead,
} from "@/lib/admin";
import { logoutAction } from "./actions";
import { RefreshButton } from "./RefreshButton";
import "./admin.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Leads — Administration",
  robots: { index: false, follow: false },
};

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Europe/Paris",
});

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : dateFormatter.format(date);
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ programme?: string }>;
}) {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }

  const { programme } = await searchParams;

  // On récupère tout pour calculer les compteurs par programme, puis on filtre.
  const result = await fetchLeads();

  if (!result.ok) {
    return (
      <div className="admin-root">
        <Topbar />
        <main className="admin-main">
          <div className="admin-header">
            <h1>Leads</h1>
          </div>
          <div className="admin-error">
            Impossible de charger les leads : {result.error}
          </div>
          <div className="admin-toolbar">
            <RefreshButton />
          </div>
        </main>
      </div>
    );
  }

  const allLeads = result.leads;
  const activeSource = programme && PROGRAMMES[programme] ? programme : undefined;
  const leads = activeSource
    ? allLeads.filter((lead) => lead.source === activeSource)
    : allLeads;

  const countsBySource = new Map<string, number>();
  for (const lead of allLeads) {
    const key = lead.source ?? "—";
    countsBySource.set(key, (countsBySource.get(key) ?? 0) + 1);
  }

  const now = Date.now();
  const last7 = allLeads.filter(
    (lead) => now - new Date(lead.created_at).getTime() < 7 * 24 * 3600 * 1000
  ).length;

  const exportHref = activeSource
    ? `/admin/export?programme=${encodeURIComponent(activeSource)}`
    : "/admin/export";

  return (
    <div className="admin-root">
      <Topbar />
      <main className="admin-main">
        <div className="admin-header">
          <h1>Leads reçus</h1>
          <p>Demandes de documentation déposées via les formulaires du site.</p>
        </div>

        <div className="admin-stats">
          <div className="admin-stat">
            <div className="value">{allLeads.length}</div>
            <div className="label">Total leads</div>
          </div>
          <div className="admin-stat">
            <div className="value">{last7}</div>
            <div className="label">7 derniers jours</div>
          </div>
          {Object.entries(PROGRAMMES).map(([source, info]) => (
            <div className="admin-stat" key={source}>
              <div className="value">{countsBySource.get(source) ?? 0}</div>
              <div className="label">{info.label}</div>
            </div>
          ))}
        </div>

        <div className="admin-filters">
          <a className="admin-filter" href="/admin" data-active={!activeSource}>
            Tous <span className="count">{allLeads.length}</span>
          </a>
          {Object.entries(PROGRAMMES).map(([source, info]) => (
            <a
              key={source}
              className="admin-filter"
              href={`/admin?programme=${encodeURIComponent(source)}`}
              data-active={activeSource === source}
            >
              {info.label}
              <span className="count">{countsBySource.get(source) ?? 0}</span>
            </a>
          ))}
        </div>

        <div className="admin-toolbar">
          <div className="muted">
            {leads.length} résultat{leads.length > 1 ? "s" : ""}
            {activeSource ? ` · ${programmeLabel(activeSource).label}` : ""}
          </div>
          <div className="admin-toolbar-actions">
            <RefreshButton />
            <a className="admin-export" href={exportHref}>
              Exporter en CSV
            </a>
          </div>
        </div>

        {leads.length === 0 ? (
          <div className="admin-table-wrap">
            <div className="admin-empty">Aucun lead pour le moment.</div>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Programme</th>
                  <th>Prénom</th>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Téléphone</th>
                  <th>Projet</th>
                  <th>Typologie</th>
                  <th>Consent.</th>
                  <th>Origine</th>
                  <th>Campagne</th>
                  <th>Annonce</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <LeadRow key={lead.id} lead={lead} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

function Topbar() {
  return (
    <header className="admin-topbar">
      <div className="admin-topbar-left">
        <div className="brand">
          sélection neuf <span>· admin</span>
        </div>
        <nav className="admin-nav">
          <a href="/admin" className="admin-nav-link" data-active="true">
            Leads
          </a>
          <a href="/admin/visiteurs" className="admin-nav-link">
            Visiteurs
          </a>
        </nav>
      </div>
      <form action={logoutAction}>
        <button className="admin-logout" type="submit">
          Se déconnecter
        </button>
      </form>
    </header>
  );
}

function LeadRow({ lead }: { lead: Lead }) {
  const prog = programmeLabel(lead.source);
  return (
    <tr>
      <td className="nowrap muted">{formatDate(lead.created_at)}</td>
      <td>
        <span className="badge">
          {prog.label}
          {prog.ville ? <span className="ville">{prog.ville}</span> : null}
        </span>
      </td>
      <td className="lead-name">{lead.prenom}</td>
      <td className="lead-name">{lead.nom}</td>
      <td>
        <a href={`mailto:${lead.email}`}>{lead.email}</a>
      </td>
      <td className="nowrap">
        <a href={`tel:${lead.telephone.replace(/\s+/g, "")}`}>{lead.telephone}</a>
      </td>
      <td>{lead.projet ? <span className="chip">{lead.projet}</span> : <span className="muted">—</span>}</td>
      <td>{lead.typologie ? <span className="chip">{lead.typologie}</span> : <span className="muted">—</span>}</td>
      <td>{lead.consent ? "Oui" : <span className="muted">Non</span>}</td>
      <td>{lead.utm_source ? <span className="chip">{lead.utm_source}</span> : <span className="muted">—</span>}</td>
      <td className="nowrap">{lead.utm_campaign ?? <span className="muted">—</span>}</td>
      <td className="nowrap">{lead.utm_ad ?? <span className="muted">—</span>}</td>
    </tr>
  );
}
