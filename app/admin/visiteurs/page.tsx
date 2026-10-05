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
import { VisiteursTable, type VisiteurTableRow } from "./VisiteursTable";
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

function formatDuration(seconds: number | null | undefined): string {
  if (seconds == null || seconds <= 0) return "";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h} h ${String(m).padStart(2, "0")} min`;
  if (m > 0) return `${m} min ${String(s).padStart(2, "0")} s`;
  return `${s} s`;
}

function formatSeconds(seconds: number | null | undefined): string {
  if (seconds == null) return "—";
  return `${seconds.toLocaleString("fr-FR")} s`;
}

function averageDuration(rows: Visiteur[]): number | null {
  const values = rows
    .map((v) => v.duree_secondes)
    .filter((n): n is number => typeof n === "number" && n > 0);
  if (values.length === 0) return null;
  return Math.round(values.reduce((sum, n) => sum + n, 0) / values.length);
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
  const avgDuration = averageDuration(activeSource ? visiteurs : allVisiteurs);

  return (
    <div className="admin-root">
      <Topbar />
      <main className="admin-main">
        <div className="admin-header">
          <h1>Visiteurs</h1>
          <p>
            Sessions enregistrées sur les formulaires du site (saisies
            partielles et complètes), avec le temps passé sur la page tant
            que l&apos;onglet reste visible.
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
          <div className="admin-stat">
            <div className="value compact">{formatDuration(avgDuration) || "—"}</div>
            <div className="label">Temps moyen</div>
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

        <VisiteursTable rows={visiteurs.map((v) => toTableRow(v))} />
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

function toTableRow(v: Visiteur): VisiteurTableRow {
  const prog = programmeLabel(v.source);
  const filled = filledFieldsCount(v);
  const total = 6;
  return {
    id: v.id,
    updatedAt: formatDate(v.updated_at),
    seconds: v.duree_secondes,
    secondsLabel: formatSeconds(v.duree_secondes),
    durationLabel: formatDuration(v.duree_secondes),
    programme: v.source ? prog.label : "—",
    ville: prog.ville,
    prenom: v.prenom ?? "",
    nom: v.nom ?? "",
    email: v.email ?? "",
    telephone: v.telephone ?? "",
    projet: v.projet ?? "",
    typologie: v.typologie ?? "",
    localisation: [v.geo_city, v.geo_region].filter(Boolean).join(", "),
    country: v.geo_country ?? "",
    ip: v.ip ?? "",
    filled: `${filled}/${total}`,
    filledState: filled === total ? "complete" : filled > 0 ? "partial" : "empty",
    appareil: parseUA(v.user_agent),
    origine: v.utm_source ?? "",
    campagne: v.utm_campaign ?? "",
  };
}
