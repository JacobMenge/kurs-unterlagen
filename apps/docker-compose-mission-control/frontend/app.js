// Mission Control – Frontend der Bodenkontrolle
// Reine Browser-App. Pollt das Backend alle zwei Sekunden, färbt die
// Status-Lampen, schaltet die Stationsmodule an und aus und zeigt das
// Logbuch aus der Datenbank. Niemand muss die Seite neu laden,
// Änderungen am Stack werden von selbst sichtbar.

const POLL_INTERVAL_MS = 2000;

// Die sechs festen Stellplätze der Station (data-slot im SVG).
const SLOTS = [
  "lebenserhaltung",
  "energie",
  "kommunikation",
  "forschungslabor",
  "hydroponik",
  "andockschleuse",
];

const els = {
  heartbeat: document.getElementById("heartbeat"),
  heartbeatLabel: document.getElementById("heartbeat-label"),
  backendImpl: document.getElementById("backend-impl"),
  backendState: document.getElementById("backend-state"),
  dbState: document.getElementById("db-state"),
  adminerState: document.getElementById("adminer-state"),
  zaehler: document.getElementById("modul-zaehler"),
  signaleBlock: document.getElementById("signale-block"),
  signale: document.getElementById("signale"),
  logbuch: document.getElementById("logbuch"),
  logbuchLeer: document.getElementById("logbuch-leer"),
  toasts: document.getElementById("toasts"),
  lampCards: {
    backend: document.querySelector('.lamp-card[data-service="backend"]'),
    db: document.querySelector('.lamp-card[data-service="db"]'),
    adminer: document.querySelector('.lamp-card[data-service="adminer"]'),
  },
  slots: Object.fromEntries(
    SLOTS.map((s) => [s, document.querySelector(`.slot[data-slot="${s}"]`)])
  ),
};

// Letzter bekannter Zustand, damit Toasts nur bei Wechseln erscheinen.
const zuletzt = {
  backend: "unknown",
  db: "unknown",
  adminer: "unknown",
  module: new Map(),
};

// ---------------- Anzeige-Helfer ----------------

function toast(text, art = "info") {
  const el = document.createElement("div");
  el.className = `toast toast-${art}`;
  el.textContent = text;
  els.toasts.appendChild(el);
  setTimeout(() => {
    el.classList.add("fading");
    setTimeout(() => el.remove(), 400);
  }, 4200);
}

function lampe(name, zustand, text) {
  const card = els.lampCards[name];
  if (!card) return;
  card.dataset.state = zustand;
  const stateEl = card.querySelector(".lamp-state");
  if (stateEl) stateEl.textContent = text;
}

function meldeWechsel(name, neu, texte) {
  if (zuletzt[name] !== "unknown" && zuletzt[name] !== neu) {
    toast(texte[neu] || `${name}: ${neu}`, neu === "ok" ? "ok" : "warn");
  }
  zuletzt[name] = neu;
}

function zeitAnzeige(iso) {
  try {
    return new Date(iso).toLocaleTimeString("de-DE");
  } catch (_) {
    return iso;
  }
}

// ---------------- Station ----------------

function stationAktualisieren(moduleListe) {
  const bekannt = new Map();
  for (const m of moduleListe) {
    bekannt.set(m.name.trim().toLowerCase(), m);
  }

  let online = 0;
  for (const slot of SLOTS) {
    const m = bekannt.get(slot);
    const an = Boolean(m && m.status === "online");
    els.slots[slot].classList.toggle("an", an);
    if (an) online++;
    bekannt.delete(slot);
  }
  els.zaehler.textContent = `${online} von ${SLOTS.length} Modulen online`;

  // Unbekannte Namen (zum Beispiel Tippfehler) tauchen hier auf,
  // statt still zu verschwinden. Das hilft bei der Fehlersuche.
  const fremde = [...bekannt.values()];
  els.signaleBlock.classList.toggle("hidden", fremde.length === 0);
  els.signale.replaceChildren(
    ...fremde.map((m) => {
      const chip = document.createElement("span");
      chip.className = `signal-chip ${m.status === "online" ? "an" : "aus"}`;
      chip.textContent = `${m.name} (${m.status})`;
      return chip;
    })
  );

  // Toasts bei Modulwechseln
  for (const m of moduleListe) {
    const alt = zuletzt.module.get(m.name);
    if (alt && alt !== m.status) {
      toast(
        `Modul ${m.name}: ${m.status}`,
        m.status === "online" ? "ok" : "warn"
      );
    }
    zuletzt.module.set(m.name, m.status);
  }
}

function stationLeeren() {
  for (const slot of SLOTS) els.slots[slot].classList.remove("an");
  els.zaehler.textContent = `0 von ${SLOTS.length} Modulen online`;
}

function logbuchAktualisieren(eintraege) {
  const hatEintraege = Array.isArray(eintraege) && eintraege.length > 0;
  els.logbuchLeer.classList.toggle("hidden", hatEintraege);
  if (!hatEintraege) {
    els.logbuch.replaceChildren();
    return;
  }
  els.logbuch.replaceChildren(
    ...eintraege.map((e) => {
      const li = document.createElement("li");
      const zeit = document.createElement("span");
      zeit.className = "log-zeit";
      zeit.textContent = zeitAnzeige(e.zeit);
      const modul = document.createElement("span");
      modul.className = "log-modul";
      modul.textContent = e.modul;
      const ereignis = document.createElement("span");
      ereignis.className = `log-ereignis log-${e.ereignis}`;
      ereignis.textContent = e.ereignis;
      li.append(zeit, modul, ereignis);
      return li;
    })
  );
}

// ---------------- Polling ----------------

async function stationAbfragen() {
  try {
    const res = await fetch("/api/station", { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const daten = await res.json();

    els.heartbeat.dataset.state = "ok";
    els.heartbeatLabel.textContent = "Bodenkontrolle verbunden";
    els.backendImpl.textContent =
      daten.implementation === "fastapi" ? "FastAPI" : "Node/Express";
    lampe("backend", "ok", "online");
    meldeWechsel("backend", "ok", { ok: "Backend ist wieder da." });

    const dbOk = daten.database === "connected";
    lampe("db", dbOk ? "ok" : "error", dbOk ? "verbunden" : "getrennt");
    meldeWechsel("db", dbOk ? "ok" : "error", {
      ok: "Datenbank verbunden. Das Logbuch läuft.",
      error: "Datenbank getrennt.",
    });

    stationAktualisieren(daten.module || []);
    logbuchAktualisieren(daten.logbuch || []);
  } catch (_) {
    els.heartbeat.dataset.state = "error";
    els.heartbeatLabel.textContent = "Backend nicht erreichbar";
    lampe("backend", "error", "nicht erreichbar");
    lampe("db", "unknown", "unbekannt");
    meldeWechsel("backend", "error", { error: "Backend nicht erreichbar." });
    stationLeeren();
  }
}

async function adminerAbfragen() {
  try {
    const res = await fetch("/__status/adminer", { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    lampe("adminer", "ok", "online");
    meldeWechsel("adminer", "ok", { ok: "Adminer ist online." });
  } catch (_) {
    lampe("adminer", "unknown", "nicht erreichbar");
    zuletzt.adminer = "unknown";
  }
}

function tick() {
  stationAbfragen();
  adminerAbfragen();
}

tick();
setInterval(tick, POLL_INTERVAL_MS);
