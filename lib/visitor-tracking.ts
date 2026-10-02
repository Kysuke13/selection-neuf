const SESSION_KEY = "sn_visitor_sid";

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

function flush() {
  if (!pendingPayload) return;
  const payload = pendingPayload;
  pendingPayload = null;

  fetch("/api/visiteur", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {
    // silently ignore – best effort tracking
  });
}

export function trackVisitorField(
  sessionId: string,
  name: string,
  value: string | boolean,
  meta?: Record<string, string | null>,
) {
  if (!sessionId) return;

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
