// Mission Control – Frontend
// Reine Browser-App, ruft das Backend immer relativ über /api/* auf.
// Das Routing übernimmt Nginx (siehe nginx.conf): /api/ -> backend:3000/

const API_BASE = "/api";

const STATUSES = ["online", "offline", "critical", "maintenance"];

const els = {
  grid: document.getElementById("module-grid"),
  empty: document.getElementById("empty-state"),
  count: document.getElementById("module-count"),
  reload: document.getElementById("reload-btn"),
  form: document.getElementById("module-form"),
  formFeedback: document.getElementById("form-feedback"),
  statusIndicator: document.getElementById("status-indicator"),
  statusText: document.getElementById("status-text"),
  diagHealth: document.getElementById("diag-health"),
  diagDb: document.getElementById("diag-db"),
  diagImpl: document.getElementById("diag-impl"),
};

async function fetchJson(path, options = {}) {
  const res = await fetch(API_BASE + path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  let body = null;
  try {
    body = await res.json();
  } catch (_) {
    /* not json */
  }
  if (!res.ok) {
    const message = (body && body.message) || res.statusText || "Fehler";
    throw new Error(`${res.status} – ${message}`);
  }
  return body;
}

function setStatus(kind, text) {
  els.statusIndicator.className = "indicator " + kind;
  els.statusText.textContent = text;
}

function setFeedback(kind, text) {
  els.formFeedback.className = "feedback " + kind;
  els.formFeedback.textContent = text;
}

function renderModules(modules) {
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

async function loadModules() {
  try {
    const modules = await fetchJson("/modules");
    renderModules(modules);
  } catch (err) {
    els.grid.innerHTML = "";
    els.empty.classList.remove("hidden");
    els.empty.textContent =
      "Konnte Module nicht laden: " + err.message;
    els.count.textContent = "–";
  }
}

async function loadHealth() {
  try {
    const data = await fetchJson("/health");
    setStatus("ok", `Backend online · ${data.implementation || "?"}`);
    els.diagHealth.textContent = "ja (" + (data.status || "?") + ")";
    els.diagDb.textContent = data.database === "connected" ? "ja" : "nein";
    els.diagImpl.textContent = data.implementation || "unbekannt";
  } catch (err) {
    setStatus("crit", "Backend nicht erreichbar (" + err.message + ")");
    els.diagHealth.textContent = "nein – " + err.message;
    els.diagDb.textContent = "unbekannt";
    els.diagImpl.textContent = "unbekannt";
  }
}

async function createModule(payload) {
  setFeedback("", "");
  try {
    const created = await fetchJson("/modules", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    setFeedback("ok", `Modul „${created.name}" angelegt.`);
    els.form.reset();
    await loadModules();
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
    await loadModules();
  } catch (err) {
    setFeedback("err", "Status-Update fehlgeschlagen: " + err.message);
  }
}

async function deleteModule(id, name) {
  if (!confirm(`Modul „${name}" wirklich entfernen?`)) return;
  try {
    await fetchJson(`/modules/${id}`, { method: "DELETE" });
    await loadModules();
  } catch (err) {
    setFeedback("err", "Löschen fehlgeschlagen: " + err.message);
  }
}

els.reload.addEventListener("click", () => {
  setStatus("unknown", "Aktualisiere …");
  loadHealth().then(loadModules);
});

els.form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(els.form);
  createModule({
    name: data.get("name"),
    status: data.get("status"),
  });
});

(async function init() {
  await loadHealth();
  await loadModules();
})();
