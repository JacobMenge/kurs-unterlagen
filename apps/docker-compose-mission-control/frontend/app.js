// Mission Control – Frontend
// Reine Browser-App. Pollt das Backend alle paar Sekunden, zeigt
// Status-Lampen für die anderen Services und benachrichtigt bei
// Status-Wechseln per Toast. Studierende müssen die Seite nicht
// neu laden – Änderungen am Stack werden automatisch sichtbar.

const API_BASE = "/api";
const STATUS_BASE = "/__status";
const POLL_INTERVAL_MS = 2000;
const STATUSES = ["online", "offline", "critical", "maintenance"];

const els = {
  grid: document.getElementById("module-grid"),
  empty: document.getElementById("empty-state"),
  count: document.getElementById("module-count"),
  form: document.getElementById("module-form"),
  formFeedback: document.getElementById("form-feedback"),
  heartbeat: document.getElementById("heartbeat"),
  heartbeatLabel: document.getElementById("heartbeat-label"),
  backendImpl: document.getElementById("backend-impl"),
  backendState: document.getElementById("backend-state"),
  dbState: document.getElementById("db-state"),
  adminerState: document.getElementById("adminer-state"),
  toasts: document.getElementById("toasts"),
  lampCards: {
    frontend: document.querySelector('.lamp-card[data-service="frontend"]'),
    backend: document.querySelector('.lamp-card[data-service="backend"]'),
    db: document.querySelector('.lamp-card[data-service="db"]'),
    adminer: document.querySelector('.lamp-card[data-service="adminer"]'),
  },
};

// Status-Memory, damit wir nur bei Wechseln Toasts feuern
const lastState = {
  backend: "unknown",
  db: "unknown",
  adminer: "unknown",
  implementation: null,
};

let modulesSignature = null;
let firstRun = true;

// ---------------- Utility ----------------

async function fetchJson(path, options = {}) {
  const res = await fetch(API_BASE + path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  let body = null;
  try {
    body = await res.json();
  } catch (_) {}
  if (!res.ok) {
    const message = (body && (body.message || body.error || body.detail)) || res.statusText || "Fehler";
    throw new Error(`${res.status} – ${message}`);
  }
  return body;
}

async function pingStatus(path) {
  try {
    const res = await fetch(STATUS_BASE + path, { cache: "no-store" });
    return res.ok ? "ok" : "error";
  } catch (_) {
    return "error";
  }
}

function setLamp(service, state, stateText) {
  const card = els.lampCards[service];
  if (card) card.dataset.state = state;
  if (service === "backend" && els.backendState) els.backendState.textContent = stateText;
  if (service === "db" && els.dbState) els.dbState.textContent = stateText;
  if (service === "adminer" && els.adminerState) els.adminerState.textContent = stateText;
}

function setHeartbeat(state, label) {
  els.heartbeat.dataset.state = state;
  els.heartbeatLabel.textContent = label;
}

function setFeedback(kind, text) {
  els.formFeedback.className = "feedback " + kind;
  els.formFeedback.textContent = text;
}

// ---------------- Toasts ----------------

function toast(kind, message, ttl = 4500) {
  const el = document.createElement("div");
  el.className = "toast toast-" + kind;
  el.textContent = message;
  els.toasts.appendChild(el);
  setTimeout(() => {
    el.classList.add("fading");
    setTimeout(() => el.remove(), 400);
  }, ttl);
}

// ---------------- Module-Rendering ----------------

function moduleSignature(modules) {
  // Kompakte Darstellung der Liste, um Vergleiche zu machen ohne Re-Render
  return modules
    .map((m) => `${m.id}:${m.name}:${m.status}`)
    .join("|");
}

function renderModules(modules) {
  const sig = moduleSignature(modules);
  if (sig === modulesSignature) return;
  modulesSignature = sig;

  els.grid.innerHTML = "";
  els.count.textContent = modules.length;
  if (modules.length === 0) {
    els.empty.classList.remove("hidden");
    return;
  }
  els.empty.classList.add("hidden");
  for (const mod of modules) {
    els.grid.appendChild(renderCard(mod));
  }
}

function renderCard(mod) {
  const card = document.createElement("article");
  card.className = "module-card";

  const name = document.createElement("div");
  name.className = "name";
  name.textContent = mod.name;

  const status = document.createElement("span");
  status.className = "status-badge status-" + mod.status;
  status.textContent = mod.status;

  const meta = document.createElement("div");
  meta.className = "meta";
  meta.textContent = `ID #${mod.id} · seit ${formatDate(mod.created_at)}`;

  const actions = document.createElement("div");
  actions.className = "module-actions";

  const select = document.createElement("select");
  for (const s of STATUSES) {
    const opt = document.createElement("option");
    opt.value = s;
    opt.textContent = s;
    if (s === mod.status) opt.selected = true;
    select.appendChild(opt);
  }
  select.addEventListener("change", () => updateStatus(mod.id, select.value));

  const del = document.createElement("button");
  del.type = "button";
  del.textContent = "Entfernen";
  del.classList.add("danger");
  del.addEventListener("click", () => deleteModule(mod.id, mod.name));

  actions.appendChild(select);
  actions.appendChild(del);

  card.appendChild(name);
  card.appendChild(status);
  card.appendChild(meta);
  card.appendChild(actions);
  return card;
}

function formatDate(value) {
  if (!value) return "–";
  try {
    return new Date(value).toLocaleString("de-DE", {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch (_) {
    return value;
  }
}

// ---------------- Aktionen ----------------

async function createModule(payload) {
  setFeedback("", "");
  try {
    const created = await fetchJson("/modules", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    setFeedback("ok", `Modul „${created.name}" angelegt.`);
    els.form.reset();
    await refreshModules();
  } catch (err) {
    setFeedback("err", "Fehler: " + err.message);
  }
}

async function updateStatus(id, newStatus) {
  try {
    await fetchJson(`/modules/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: newStatus }),
    });
    await refreshModules();
  } catch (err) {
    setFeedback("err", "Status-Update fehlgeschlagen: " + err.message);
  }
}

async function deleteModule(id, name) {
  if (!confirm(`Modul „${name}" wirklich entfernen?`)) return;
  try {
    await fetchJson(`/modules/${id}`, { method: "DELETE" });
    await refreshModules();
  } catch (err) {
    setFeedback("err", "Löschen fehlgeschlagen: " + err.message);
  }
}

async function refreshModules() {
  try {
    const modules = await fetchJson("/modules");
    renderModules(modules);
  } catch (err) {
    // Backend offline – Liste leeren wir nicht, damit Stand sichtbar bleibt
    els.count.textContent = "–";
  }
}

// ---------------- Polling ----------------

async function pollOnce() {
  // 1. Backend + DB-Status aus /api/health holen
  let healthOk = false;
  let dbConnected = false;
  let implementation = null;
  try {
    const health = await fetchJson("/health");
    healthOk = true;
    dbConnected = health.database === "connected";
    implementation = health.implementation || "?";
  } catch (_) {
    healthOk = false;
  }

  // 2. Adminer-Status separat über nginx-Status-Route
  const adminerStatus = await pingStatus("/adminer");
  const adminerOk = adminerStatus === "ok";

  // 3. UI aktualisieren
  setLamp("backend", healthOk ? "ok" : "error", healthOk ? "online" : "nicht erreichbar");
  setLamp("db", healthOk ? (dbConnected ? "ok" : "warn") : "error",
    healthOk ? (dbConnected ? "verbunden" : "nicht verbunden") : "unbekannt");
  setLamp("adminer", adminerOk ? "ok" : "error", adminerOk ? "online" : "nicht erreichbar");

  if (healthOk) {
    els.backendImpl.textContent = implementation;
    setHeartbeat("ok", "live · alle 2s");
  } else {
    els.backendImpl.textContent = "–";
    setHeartbeat("warn", "warte auf backend …");
  }

  // 4. Toast-Benachrichtigungen bei Status-Wechseln
  if (!firstRun) {
    if (healthOk && lastState.backend !== "ok") {
      toast("ok", `Backend ist online (${implementation}).`);
    } else if (!healthOk && lastState.backend === "ok") {
      toast("err", "Backend nicht mehr erreichbar.");
    }

    if (lastState.implementation && implementation && implementation !== lastState.implementation) {
      toast("info", `Backend gewechselt: ${lastState.implementation} → ${implementation}`);
    }

    const dbNow = healthOk ? (dbConnected ? "ok" : "warn") : "error";
    if (dbNow === "ok" && lastState.db !== "ok") {
      toast("ok", "Datenbank ist verbunden.");
    } else if (dbNow !== "ok" && lastState.db === "ok") {
      toast("warn", "Datenbank-Verbindung verloren.");
    }

    if (adminerOk && lastState.adminer !== "ok") {
      toast("ok", "Adminer ist online (Port 8081).");
    } else if (!adminerOk && lastState.adminer === "ok") {
      toast("warn", "Adminer nicht mehr erreichbar.");
    }
  }

  lastState.backend = healthOk ? "ok" : "error";
  lastState.db = healthOk ? (dbConnected ? "ok" : "warn") : "error";
  lastState.adminer = adminerOk ? "ok" : "error";
  if (implementation) lastState.implementation = implementation;
  firstRun = false;

  // 5. Module-Liste aktualisieren, wenn Backend antwortet
  if (healthOk) {
    await refreshModules();
  }
}

// ---------------- Init ----------------

els.form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(els.form);
  createModule({
    name: data.get("name"),
    status: data.get("status"),
  });
});

// Erste Iteration sofort, dann im Intervall
pollOnce();
setInterval(pollOnce, POLL_INTERVAL_MS);
