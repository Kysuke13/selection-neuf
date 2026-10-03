const SESSION_KEY = "sn_visitor_sid";
const DWELL_KEY = "sn_visitor_dwell_ms";
const MAX_DURATION_SECONDS = 24 * 60 * 60;
const HEARTBEAT_MS = 15_000;

export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  let sid = sessionStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let pendingPayload: Record<string, unknown> | null = null;
let activeSessionId: string | null = null;
let dwellStarted = false;
let clockReady = false;
let accumulatedMs = 0;
let visibleSince: number | null = null;
let lastSentSeconds = -1;

function readStoredDwellMs(): number {
  try {
    const n = Number(sessionStorage.getItem(DWELL_KEY));
    return Number.isFinite(n) && n > 0 ? n : 0;
  } catch {
    return 0;
  }
}

function persistDwellMs(ms: number) {
  try {
    sessionStorage.setItem(DWELL_KEY, String(Math.max(0, Math.floor(ms))));
  } catch {
    // sessionStorage indisponible : le temps reste en mémoire jusqu'au prochain envoi
  }
}

function ensureClock() {
  if (clockReady || typeof window === "undefined") return;
  clockReady = true;
  accumulatedMs = readStoredDwellMs();
  if (document.visibilityState === "visible") {
    visibleSince = Date.now();
  }
}

function currentDurationMs(): number {
  ensureClock();
  const extra = visibleSince !== null ? Math.max(0, Date.now() - visibleSince) : 0;
  return accumulatedMs + extra;
}

function currentDurationSeconds(): number {
  return Math.min(MAX_DURATION_SECONDS, Math.floor(currentDurationMs() / 1000));
}

function pauseClock() {
  if (visibleSince === null) return;
  accumulatedMs += Math.max(0, Date.now() - visibleSince);
  visibleSince = null;
  persistDwellMs(accumulatedMs);
}

function resumeClock() {
  if (visibleSince !== null || typeof document === "undefined") return;
  if (document.visibilityState === "visible") {
    visibleSince = Date.now();
  }
}

function flush() {
  if (!pendingPayload) return;
  const payload = pendingPayload;
  pendingPayload = null;
  const seconds = currentDurationSeconds();
  payload.duree_secondes = seconds;
  lastSentSeconds = seconds;
  persistDwellMs(currentDurationMs());

  fetch("/api/visiteur", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {
    // silently ignore – best effort tracking
  });
}

function heartbeat() {
  if (!activeSessionId) return;
  const seconds = currentDurationSeconds();
  if (!pendingPayload && seconds === lastSentSeconds) return;

  if (!pendingPayload) {
    pendingPayload = { session_id: activeSessionId };
  }
  pendingPayload.session_id = activeSessionId;

  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
  flush();
}

const dwellGlobal = globalThis as typeof globalThis & { __snDwellStarted?: boolean };

/** Démarre le suivi du temps passé (onglet visible) pour la session courante. */
export function startPageDwellTracking(sessionId: string) {
  if (typeof window === "undefined" || !sessionId) return;
  ensureClock();
  activeSessionId = sessionId;
  if (dwellStarted || dwellGlobal.__snDwellStarted) return;
  dwellStarted = true;
  dwellGlobal.__snDwellStarted = true;

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      pauseClock();
      heartbeat();
    } else {
      resumeClock();
    }
  });

  window.addEventListener("pagehide", () => {
    pauseClock();
    heartbeat();
  });

  window.setInterval(heartbeat, HEARTBEAT_MS);
}

export function trackVisitorField(
  sessionId: string,
  name: string,
  value: string | boolean,
  meta?: Record<string, string | null>,
) {
  if (!sessionId) return;
  ensureClock();
  activeSessionId = sessionId;

  if (!pendingPayload) {
    pendingPayload = { session_id: sessionId };
  }
  pendingPayload.session_id = sessionId;
  pendingPayload[name] = value;

  if (meta) {
    for (const [k, v] of Object.entries(meta)) {
      if (v !== undefined) pendingPayload[k] = v;
    }
  }

  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(flush, 800);
}

export function flushVisitorTracking() {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
  flush();
}
