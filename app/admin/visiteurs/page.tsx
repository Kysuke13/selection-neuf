import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  fetchVisiteurs,
  isAuthenticated,
  PROGRAMMES,
  programmeLabel,
  type Visiteur,
} from "@/lib/admin";
import { logoutAction } from "../actions";
import { RefreshButton } from "../RefreshButton";
import "../admin.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Visiteurs — Administration",
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

function parseUA(ua: string | null): string {
  if (!ua) return "—";
  if (/mobile|android|iphone|ipad/i.test(ua)) return "Mobile";
  if (/tablet/i.test(ua)) return "Tablette";
  return "Desktop";
}

function filledFieldsCount(v: Visiteur): number {
  const fields = [v.prenom, v.nom, v.email, v.telephone, v.projet, v.typologie];
  return fields.filter(Boolean).length;
}

export default async function VisiteursPage({
  searchParams,
}: {
  searchParams: Promise<{ programme?: string }>;
}) {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }

  const { programme } = await searchParams;

  const result = await fetchVisiteurs();

  if (!result.ok) {
    return (
      <div className="admin-root">
        <Topbar />
        <main className="admin-main">
          <div className="admin-header">
            <h1>Visiteurs</h1>
          </div>
          <div className="admin-error">
            Impossible de charger les visiteurs : {result.error}
          </div>
          <div className="admin-toolbar">
            <RefreshButton />
          </div>
        </main>
      </div>
    );
  }

  const allVisiteurs = result.visiteurs;
  const activeSource =
    programme && PROGRAMMES[programme] ? programme : undefined;
  const visiteurs = activeSource
    ? allVisiteurs.filter((v) => v.source === activeSource)
    : allVisiteurs;

  const countsBySource = new Map<string, number>();
  for (const v of allVisiteurs) {
    const key = v.source ?? "—";
    countsBySource.set(key, (countsBySource.get(key) ?? 0) + 1);
  }

  const now = Date.now();
  const last24h = allVisiteurs.filter(
    (v) => now - new Date(v.created_at).getTime() < 24 * 3600 * 1000
  ).length;
  const last7d = allVisiteurs.filter(
    (v) => now - new Date(v.created_at).getTime() < 7 * 24 * 3600 * 1000
  ).length;
  const withEmail = allVisiteurs.filter((v) => v.email).length;

  return (
    <div className="admin-root">
      <Topbar />
      <main className="admin-main">
        <div className="admin-header">
          <h1>Visiteurs</h1>
          <p>
            Sessions enregistrées sur les formulaires du site (saisies
            partielles et complètes).
          </p>
        </div>

        <div className="admin-stats">
          <div className="admin-stat">
            <div className="value">{allVisiteurs.length}</div>
            <div className="label">Total visiteurs</div>
          </div>
          <div className="admin-stat">
            <div className="value">{last24h}</div>
            <div className="label">Dernières 24 h</div>
          </div>
          <div className="admin-stat">
            <div className="value">{last7d}</div>
            <div className="label">7 derniers jours</div>
          </div>
          <div className="admin-stat">
            <div className="value">{withEmail}</div>
            <div className="label">Avec email</div>
          </div>
        </div>

        <div className="admin-filters">
          <a
            className="admin-filter"
            href="/admin/visiteurs"
            data-active={!activeSource}
          >
            Tous <span className="count">{allVisiteurs.length}</span>
          </a>
          {Object.entries(PROGRAMMES).map(([source, info]) => (
            <a
              key={source}
              className="admin-filter"
              href={`/admin/visiteurs?programme=${encodeURIComponent(source)}`}
              data-active={activeSource === source}
            >
              {info.label}
              <span className="count">{countsBySource.get(source) ?? 0}</span>
            </a>
          ))}
        </div>

        <div className="admin-toolbar">
          <div className="muted">
            {visiteurs.length} résultat{visiteurs.length > 1 ? "s" : ""}
            {activeSource
              ? ` · ${programmeLabel(activeSource).label}`
              : ""}
          </div>
          <div className="admin-toolbar-actions">
            <RefreshButton />
          </div>
        </div>

        {visiteurs.length === 0 ? (
          <div className="admin-table-wrap">
            <div className="admin-empty">Aucun visiteur pour le moment.</div>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Dernière activité</th>
                  <th>Programme</th>
                  <th>Prénom</th>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Téléphone</th>
                  <th>Projet</th>
                  <th>Typologie</th>
                  <th>Localisation</th>
                  <th>Champs remplis</th>
                  <th>Appareil</th>
                  <th>Origine</th>
                  <th>Campagne</th>
                </tr>
              </thead>
              <tbody>
                {visiteurs.map((v) => (
                  <VisiteurRow key={v.id} visiteur={v} />
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
          <a href="/admin" className="admin-nav-link">
            Leads
          </a>
          <a
            href="/admin/visiteurs"
            className="admin-nav-link"
            data-active="true"
          >
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

function VisiteurRow({ visiteur: v }: { visiteur: Visiteur }) {
  const prog = programmeLabel(v.source);
  const filled = filledFieldsCount(v);
  const total = 6;
  return (
    <tr>
      <td className="nowrap muted">{formatDate(v.updated_at)}</td>
      <td>
        {v.source ? (
          <span className="badge">
            {prog.label}
            {prog.ville ? <span className="ville">{prog.ville}</span> : null}
          </span>
        ) : (
          <span className="muted">—</span>
        )}
      </td>
      <td className="lead-name">{v.prenom ?? <span className="muted">—</span>}</td>
      <td className="lead-name">{v.nom ?? <span className="muted">—</span>}</td>
      <td>
        {v.email ? (
          <a href={`mailto:${v.email}`}>{v.email}</a>
        ) : (
          <span className="muted">—</span>
        )}
      </td>
      <td className="nowrap">
        {v.telephone ? (
          <a href={`tel:${v.telephone.replace(/\s+/g, "")}`}>{v.telephone}</a>
        ) : (
          <span className="muted">—</span>
        )}
      </td>
      <td>
        {v.projet ? (
          <span className="chip">{v.projet}</span>
        ) : (
          <span className="muted">—</span>
        )}
      </td>
      <td>
        {v.typologie ? (
          <span className="chip">{v.typologie}</span>
        ) : (
          <span className="muted">—</span>
        )}
      </td>
      <td className="nowrap">
        {v.geo_city || v.geo_region || v.geo_country ? (
          <span className="geo-loc">
            {[v.geo_city, v.geo_region].filter(Boolean).join(", ")}
            {v.geo_country ? (
              <span className="geo-country">{v.geo_country}</span>
            ) : null}
          </span>
        ) : (
          <span className="muted" title={v.ip ?? undefined}>{v.ip ?? "—"}</span>
        )}
      </td>
      <td>
        <span className={`chip ${filled === total ? "chip-complete" : filled > 0 ? "chip-partial" : ""}`}>
          {filled}/{total}
        </span>
      </td>
      <td>{parseUA(v.user_agent)}</td>
      <td>
        {v.utm_source ? (
          <span className="chip">{v.utm_source}</span>
        ) : (
          <span className="muted">—</span>
        )}
      </td>
      <td className="nowrap">{v.utm_campaign ?? <span className="muted">—</span>}</td>
    </tr>
  );
}
