"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteVisiteursAction } from "../actions";
import { RefreshButton } from "../RefreshButton";

export type VisiteurTableRow = {
  id: string;
  updatedAt: string;
  seconds: number | null;
  secondsLabel: string;
  durationLabel: string;
  programme: string;
  ville: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  projet: string;
  typologie: string;
  localisation: string;
  country: string;
  ip: string;
  filled: string;
  filledState: "complete" | "partial" | "empty";
  appareil: string;
  origine: string;
  campagne: string;
};

const FILTER_COLUMNS = [
  { key: "updatedAt", label: "Dernière activité" },
  { key: "secondsLabel", label: "Temps passé" },
  { key: "programme", label: "Programme" },
  { key: "prenom", label: "Prénom" },
  { key: "nom", label: "Nom" },
  { key: "email", label: "Email" },
  { key: "telephone", label: "Téléphone" },
  { key: "projet", label: "Projet" },
  { key: "typologie", label: "Typologie" },
  { key: "localisation", label: "Localisation" },
  { key: "ip", label: "IP" },
  { key: "filled", label: "Champs remplis" },
  { key: "appareil", label: "Appareil" },
  { key: "origine", label: "Origine" },
  { key: "campagne", label: "Campagne" },
] as const;

type FilterKey = (typeof FILTER_COLUMNS)[number]["key"];

const COLUMN_ORDER_KEY = "sn_admin_visiteur_columns";
const DEFAULT_ORDER: FilterKey[] = FILTER_COLUMNS.map((column) => column.key);

function readColumnOrder(): FilterKey[] {
  try {
    const raw = localStorage.getItem(COLUMN_ORDER_KEY);
    if (!raw) return [...DEFAULT_ORDER];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [...DEFAULT_ORDER];
    const known = new Set<string>(DEFAULT_ORDER);
    const next = parsed.filter((key): key is FilterKey => typeof key === "string" && known.has(key));
    for (const key of DEFAULT_ORDER) {
      if (!next.includes(key)) next.push(key);
    }
    return next;
  } catch {
    return [...DEFAULT_ORDER];
  }
}

function fold(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function cellText(row: VisiteurTableRow, key: FilterKey): string {
  if (key === "programme") return `${row.programme} ${row.ville}`;
  if (key === "localisation") return `${row.localisation} ${row.country}`;
  if (key === "secondsLabel") return `${row.secondsLabel} ${row.durationLabel}`;
  return row[key];
}

export function VisiteursTable({ rows }: { rows: VisiteurTableRow[] }) {
  const router = useRouter();
  const [filters, setFilters] = useState<Partial<Record<FilterKey, string>>>({});
  const [columnOrder, setColumnOrder] = useState<FilterKey[]>(DEFAULT_ORDER);
  const [overKey, setOverKey] = useState<FilterKey | null>(null);
  const dragKeyRef = useRef<FilterKey | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const selectAllRef = useRef<HTMLInputElement>(null);

  const visible = useMemo(() => {
    const active = FILTER_COLUMNS.flatMap((column) => {
      const value = filters[column.key]?.trim();
      return value ? [[column.key, fold(value)] as const] : [];
    });
    if (active.length === 0) return rows;
    return rows.filter((row) =>
      active.every(([key, query]) => fold(cellText(row, key)).includes(query)),
    );
  }, [filters, rows]);

  const visibleIds = visible.map((row) => row.id);
  const selectedVisible = visibleIds.filter((id) => selected.has(id));
  const allVisibleSelected = visibleIds.length > 0 && selectedVisible.length === visibleIds.length;
  const someVisibleSelected = selectedVisible.length > 0 && !allVisibleSelected;

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someVisibleSelected;
    }
  }, [someVisibleSelected]);

  useEffect(() => {
    setColumnOrder(readColumnOrder());
  }, []);

  const columns = columnOrder.map(
    (key) => FILTER_COLUMNS.find((column) => column.key === key) ?? FILTER_COLUMNS[0],
  );

  function moveColumn(from: FilterKey, to: FilterKey) {
    if (from === to) return;
    setColumnOrder((current) => {
      const next = [...current];
      const fromIndex = next.indexOf(from);
      const toIndex = next.indexOf(to);
      if (fromIndex < 0 || toIndex < 0) return current;
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      localStorage.setItem(COLUMN_ORDER_KEY, JSON.stringify(next));
      return next;
    });
  }

  function toggleAll(checked: boolean) {
    setSelected((current) => {
      const next = new Set(current);
      for (const id of visibleIds) {
        if (checked) next.add(id);
        else next.delete(id);
      }
      return next;
    });
  }

  function toggleOne(id: string, checked: boolean) {
    setSelected((current) => {
      const next = new Set(current);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function removeSelected() {
    const ids = [...selected];
    if (ids.length === 0 || pending) return;
    const label = ids.length > 1 ? `${ids.length} visiteurs` : "ce visiteur";
    if (!window.confirm(`Supprimer ${label} ? Cette action est définitive.`)) return;

    setError(null);
    startTransition(async () => {
      const result = await deleteVisiteursAction(ids);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSelected(new Set());
      router.refresh();
    });
  }

  return (
    <>
      <div className="admin-toolbar">
        <div className="muted">
          {visible.length} résultat{visible.length > 1 ? "s" : ""}
          {visible.length !== rows.length ? ` sur ${rows.length}` : ""}
          {selected.size > 0 ? ` · ${selected.size} sélectionné${selected.size > 1 ? "s" : ""}` : ""}
        </div>
        <div className="admin-toolbar-actions">
          <button
            type="button"
            className="admin-delete"
            disabled={selected.size === 0 || pending}
            onClick={removeSelected}
          >
            {pending ? "Suppression…" : "Supprimer"}
          </button>
          <RefreshButton />
        </div>
      </div>

      {error ? <div className="admin-error admin-table-error">{error}</div> : null}

      {rows.length === 0 ? (
        <div className="admin-table-wrap">
          <div className="admin-empty">Aucun visiteur pour le moment.</div>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="admin-check-col">
                  <input
                    ref={selectAllRef}
                    type="checkbox"
                    checked={allVisibleSelected}
                    aria-label="Sélectionner les lignes affichées"
                    onChange={(event) => toggleAll(event.target.checked)}
                  />
                </th>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="admin-col-handle"
                    data-drop={overKey === column.key && dragKeyRef.current !== column.key}
                    onDragOver={(event) => {
                      event.preventDefault();
                      event.dataTransfer.dropEffect = "move";
                      if (overKey !== column.key) setOverKey(column.key);
                    }}
                    onDrop={(event) => {
                      event.preventDefault();
                      const from = (event.dataTransfer.getData("text/plain") || dragKeyRef.current) as FilterKey;
                      if (from) moveColumn(from, column.key);
                      dragKeyRef.current = null;
                      setOverKey(null);
                    }}
                  >
                    <span
                      className="admin-col-grip"
                      draggable
                      role="button"
                      tabIndex={0}
                      title="Glisser pour déplacer la colonne"
                      aria-label={`Déplacer la colonne ${column.label}`}
                      onDragStart={(event) => {
                        dragKeyRef.current = column.key;
                        event.dataTransfer.effectAllowed = "move";
                        event.dataTransfer.setData("text/plain", column.key);
                        event.currentTarget.closest("th")?.setAttribute("data-dragging", "true");
                      }}
                      onDragEnd={(event) => {
                        dragKeyRef.current = null;
                        event.currentTarget.closest("th")?.removeAttribute("data-dragging");
                        setOverKey(null);
                      }}
                    >
                      {column.label}
                    </span>
                  </th>
                ))}
              </tr>
              <tr className="admin-filter-row">
                <th />
                {columns.map((column) => (
                  <th
                    key={column.key}
                    data-drop={overKey === column.key && dragKeyRef.current !== column.key}
                    onDragOver={(event) => {
                      event.preventDefault();
                      if (dragKeyRef.current && overKey !== column.key) setOverKey(column.key);
                    }}
                    onDrop={(event) => {
                      event.preventDefault();
                      const from = (event.dataTransfer.getData("text/plain") || dragKeyRef.current) as FilterKey;
                      if (from) moveColumn(from, column.key);
                      dragKeyRef.current = null;
                      setOverKey(null);
                    }}
                  >
                    <input
                      className="admin-col-filter"
                      value={filters[column.key] ?? ""}
                      aria-label={`Filtrer ${column.label}`}
                      placeholder="Filtrer"
                      onChange={(event) =>
                        setFilters((current) => ({
                          ...current,
                          [column.key]: event.target.value,
                        }))
                      }
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr>
                  <td className="admin-empty" colSpan={FILTER_COLUMNS.length + 1}>
                    Aucun visiteur ne correspond aux filtres.
                  </td>
                </tr>
              ) : (
                visible.map((row) => (
                  <tr key={row.id} data-selected={selected.has(row.id)}>
                    <td className="admin-check-col">
                      <input
                        type="checkbox"
                        checked={selected.has(row.id)}
                        aria-label={`Sélectionner ${row.prenom || row.email || row.ip || "cette ligne"}`}
                        onChange={(event) => toggleOne(row.id, event.target.checked)}
                      />
                    </td>
                    {columns.map((column) => (
                      <VisiteurCell key={column.key} row={row} column={column.key} />
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function VisiteurCell({ row, column }: { row: VisiteurTableRow; column: FilterKey }) {
  switch (column) {
    case "updatedAt":
      return <td className="nowrap muted">{row.updatedAt}</td>;
    case "secondsLabel":
      return (
        <td className="nowrap">
          <span className="duration-seconds">{row.secondsLabel}</span>
          {row.seconds != null && row.seconds >= 60 ? (
            <span className="duration-hint">{row.durationLabel}</span>
          ) : null}
        </td>
      );
    case "programme":
      return (
        <td>
          {row.programme !== "—" ? (
            <span className="badge">
              {row.programme}
              {row.ville ? <span className="ville">{row.ville}</span> : null}
            </span>
          ) : (
            <span className="muted">—</span>
          )}
        </td>
      );
    case "prenom":
      return <td className="lead-name">{row.prenom || <span className="muted">—</span>}</td>;
    case "nom":
      return <td className="lead-name">{row.nom || <span className="muted">—</span>}</td>;
    case "email":
      return (
        <td>
          {row.email ? <a href={`mailto:${row.email}`}>{row.email}</a> : <span className="muted">—</span>}
        </td>
      );
    case "telephone":
      return (
        <td className="nowrap">
          {row.telephone ? (
            <a href={`tel:${row.telephone.replace(/\s+/g, "")}`}>{row.telephone}</a>
          ) : (
            <span className="muted">—</span>
          )}
        </td>
      );
    case "projet":
      return <td>{row.projet ? <span className="chip">{row.projet}</span> : <span className="muted">—</span>}</td>;
    case "typologie":
      return (
        <td>{row.typologie ? <span className="chip">{row.typologie}</span> : <span className="muted">—</span>}</td>
      );
    case "localisation":
      return (
        <td className="nowrap">
          {row.localisation || row.country ? (
            <span className="geo-loc">
              {row.localisation}
              {row.country ? <span className="geo-country">{row.country}</span> : null}
            </span>
          ) : (
            <span className="muted">—</span>
          )}
        </td>
      );
    case "ip":
      return <td className="nowrap muted">{row.ip || "—"}</td>;
    case "filled":
      return (
        <td>
          <span className={`chip ${row.filledState === "empty" ? "" : `chip-${row.filledState}`}`}>
            {row.filled}
          </span>
        </td>
      );
    case "appareil":
      return <td>{row.appareil}</td>;
    case "origine":
      return <td>{row.origine ? <span className="chip">{row.origine}</span> : <span className="muted">—</span>}</td>;
    case "campagne":
      return <td className="nowrap">{row.campagne || <span className="muted">—</span>}</td>;
  }
}
