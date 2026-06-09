// Aurora Station – Telemetrie-API (Node.js, ohne externe Abhängigkeiten)
//
// Diese kleine App ist das ÜBUNGSOBJEKT für den Monitoring-Block. Sie tut so,
// als wäre sie die Bordelektronik der Aurora Station: sie misst laufend ein paar
// Werte (Sauerstoff, Energielast, Hüllentemperatur) und stellt sie unter
// /metrics im Prometheus-Format bereit. Ihr müsst diesen Code NICHT verstehen
// oder ändern – euer Fokus liegt auf Prometheus, Grafana und Compose.
//
// Bewusst ohne npm-Pakete geschrieben (nur Node-Standardbibliothek), damit der
// Container ohne Internet und ohne "npm install" sofort baut.

const http = require("http");

const PORT = Number(process.env.PORT || 8000);
const START_TIME = Date.now();

// ---------------------------------------------------------------------------
// Zustand der Station (wird laufend leicht verändert, damit Graphen leben)
// ---------------------------------------------------------------------------

const state = {
  oxygenPercent: 97.5, // Soll: ~96–99
  powerLoadPercent: 62, // Soll: ~40–75
  hullTempCelsius: 21.5, // Soll: ~19–24
  leakActive: false, // wird über /api/simulate/leak ausgelöst
};

// Module der Station (gleiche Idee wie im Mission-Control-Dashboard)
const modules = [
  { id: "LS-01", name: "Life Support", status: "online" },
  { id: "PG-02", name: "Power Grid", status: "online" },
  { id: "CA-03", name: "Comms Array", status: "maintenance" },
  { id: "RL-04", name: "Research Lab", status: "offline" },
  { id: "HY-05", name: "Hydroponics", status: "critical" },
  { id: "DB-06", name: "Docking Bay", status: "online" },
];

// ---------------------------------------------------------------------------
// Metriken
// ---------------------------------------------------------------------------

// Counter: HTTP-Anfragen, gelabelt nach Methode, Route und Status
const httpRequests = new Map(); // key: "method|route|status" -> count

// Histogram: Antwortzeiten in Sekunden
const HIST_BUCKETS = [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5];
const histCounts = new Array(HIST_BUCKETS.length).fill(0); // kumulativ befüllt
let histSum = 0;
let histTotal = 0;

function recordRequest(method, route, status, durationSeconds) {
  const key = `${method}|${route}|${status}`;
  httpRequests.set(key, (httpRequests.get(key) || 0) + 1);

  histTotal += 1;
  histSum += durationSeconds;
  for (let i = 0; i < HIST_BUCKETS.length; i++) {
    if (durationSeconds <= HIST_BUCKETS[i]) histCounts[i] += 1;
  }
}

function countModulesByStatus() {
  const counts = { online: 0, offline: 0, critical: 0, maintenance: 0 };
  for (const m of modules) {
    if (counts[m.status] === undefined) counts[m.status] = 0;
    counts[m.status] += 1;
  }
  return counts;
}

// ---------------------------------------------------------------------------
// Vitalwerte langsam "atmen" lassen (Random Walk), damit Dashboards leben
// ---------------------------------------------------------------------------

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function tick() {
  // kleine zufällige Schwankung um den Sollwert
  state.powerLoadPercent = clamp(
    state.powerLoadPercent + (Math.random() - 0.5) * 4,
    35,
    85
  );
  state.hullTempCelsius = clamp(
    state.hullTempCelsius + (Math.random() - 0.5) * 0.6,
    17,
    27
  );

  if (state.leakActive) {
    // Sauerstoff fällt – hier soll euer Alarm anschlagen
    state.oxygenPercent = clamp(state.oxygenPercent - 1.2, 70, 100);
  } else {
    // erholt sich Richtung Normalwert
    const drift = (98 - state.oxygenPercent) * 0.1;
    state.oxygenPercent = clamp(
      state.oxygenPercent + drift + (Math.random() - 0.5) * 0.4,
      70,
      100
    );
  }
}

setInterval(tick, 2000);

// ---------------------------------------------------------------------------
// Prometheus-Exposition (/metrics)
// ---------------------------------------------------------------------------

function renderMetrics() {
  const lines = [];
  const moduleCounts = countModulesByStatus();
  const uptime = (Date.now() - START_TIME) / 1000;

  lines.push("# HELP aurora_oxygen_percent Sauerstoffgehalt der Station in Prozent.");
  lines.push("# TYPE aurora_oxygen_percent gauge");
  lines.push(`aurora_oxygen_percent ${state.oxygenPercent.toFixed(2)}`);

  lines.push("# HELP aurora_power_load_percent Auslastung des Energienetzes in Prozent.");
  lines.push("# TYPE aurora_power_load_percent gauge");
  lines.push(`aurora_power_load_percent ${state.powerLoadPercent.toFixed(2)}`);

  lines.push("# HELP aurora_hull_temp_celsius Hüllentemperatur in Grad Celsius.");
  lines.push("# TYPE aurora_hull_temp_celsius gauge");
  lines.push(`aurora_hull_temp_celsius ${state.hullTempCelsius.toFixed(2)}`);

  lines.push("# HELP aurora_modules_total Anzahl Module je Status.");
  lines.push("# TYPE aurora_modules_total gauge");
  for (const [status, count] of Object.entries(moduleCounts)) {
    lines.push(`aurora_modules_total{status="${status}"} ${count}`);
  }

  lines.push("# HELP aurora_leak_active Ob gerade ein Sauerstoffleck simuliert wird (1=ja).");
  lines.push("# TYPE aurora_leak_active gauge");
  lines.push(`aurora_leak_active ${state.leakActive ? 1 : 0}`);

  lines.push("# HELP aurora_uptime_seconds Laufzeit der Telemetrie-API in Sekunden.");
  lines.push("# TYPE aurora_uptime_seconds counter");
  lines.push(`aurora_uptime_seconds ${uptime.toFixed(0)}`);

  lines.push("# HELP aurora_http_requests_total Anzahl HTTP-Anfragen an die Telemetrie-API.");
  lines.push("# TYPE aurora_http_requests_total counter");
  for (const [key, count] of httpRequests.entries()) {
    const [method, route, status] = key.split("|");
    lines.push(
      `aurora_http_requests_total{method="${method}",route="${route}",status="${status}"} ${count}`
    );
  }

  lines.push("# HELP aurora_http_request_duration_seconds Antwortzeiten der Telemetrie-API.");
  lines.push("# TYPE aurora_http_request_duration_seconds histogram");
  for (let i = 0; i < HIST_BUCKETS.length; i++) {
    lines.push(
      `aurora_http_request_duration_seconds_bucket{le="${HIST_BUCKETS[i]}"} ${histCounts[i]}`
    );
  }
  lines.push(`aurora_http_request_duration_seconds_bucket{le="+Inf"} ${histTotal}`);
  lines.push(`aurora_http_request_duration_seconds_sum ${histSum.toFixed(4)}`);
  lines.push(`aurora_http_request_duration_seconds_count ${histTotal}`);

  return lines.join("\n") + "\n";
}

// ---------------------------------------------------------------------------
// Kleine Status-Seite (damit ihr im Browser sofort etwas seht)
// ---------------------------------------------------------------------------

function renderStatusPage() {
  const o2 = state.oxygenPercent.toFixed(1);
  const pw = state.powerLoadPercent.toFixed(0);
  const temp = state.hullTempCelsius.toFixed(1);
  const o2Color = state.oxygenPercent < 90 ? "#ff5252" : "#27e0a0";
  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8" />
<meta http-equiv="refresh" content="3" />
<title>Aurora Station – Telemetrie</title>
<style>
  body { font-family: system-ui, sans-serif; background:#0b1020; color:#e8eefc; margin:0; padding:2rem; }
  h1 { font-weight:600; }
  .grid { display:flex; gap:1rem; flex-wrap:wrap; margin-top:1.5rem; }
  .card { background:#141b33; border:1px solid #233; border-radius:12px; padding:1.25rem 1.5rem; min-width:180px; }
  .v { font-size:2.4rem; font-weight:700; }
  .l { opacity:.7; font-size:.9rem; text-transform:uppercase; letter-spacing:.05em; }
  code { background:#1d2746; padding:.15rem .4rem; border-radius:6px; }
  a { color:#7aa2ff; }
</style>
</head>
<body>
  <h1>🛰️ Aurora Station &middot; Telemetrie-API</h1>
  <p>Diese Werte ändern sich alle paar Sekunden. Prometheus liest sie unter <a href="/metrics"><code>/metrics</code></a> aus.</p>
  <div class="grid">
    <div class="card"><div class="l">Sauerstoff</div><div class="v" style="color:${o2Color}">${o2}%</div></div>
    <div class="card"><div class="l">Energielast</div><div class="v">${pw}%</div></div>
    <div class="card"><div class="l">Hüllentemp.</div><div class="v">${temp}°C</div></div>
    <div class="card"><div class="l">Leck aktiv</div><div class="v">${state.leakActive ? "JA ⚠️" : "nein"}</div></div>
  </div>
  <p style="margin-top:2rem;opacity:.7">
    Endpunkte: <code>/metrics</code> &middot; <code>/api/health</code> &middot; <code>/api/modules</code> &middot;
    <code>/api/simulate/leak</code> &middot; <code>/api/simulate/repair</code> &middot; <code>/api/load</code>
  </p>
</body>
</html>
`;
}

// ---------------------------------------------------------------------------
// Routing
// ---------------------------------------------------------------------------

function normalizeRoute(pathname) {
  const known = [
    "/",
    "/metrics",
    "/api/health",
    "/api/modules",
    "/api/simulate/leak",
    "/api/simulate/repair",
    "/api/load",
  ];
  return known.includes(pathname) ? pathname : "other";
}

// erzeugt CPU-Last für ein paar Hundert Millisekunden (für cAdvisor-Demos)
function burnCpu(ms) {
  const end = Date.now() + ms;
  let x = 0;
  while (Date.now() < end) {
    x += Math.sqrt(Math.random() * 1e6);
  }
  return x;
}

const server = http.createServer((req, res) => {
  const start = process.hrtime.bigint();
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;
  const route = normalizeRoute(pathname);

  function finish(status, body, contentType) {
    res.writeHead(status, { "Content-Type": contentType });
    res.end(body);
    const durationSeconds = Number(process.hrtime.bigint() - start) / 1e9;
    recordRequest(req.method, route, String(status), durationSeconds);
  }

  if (pathname === "/metrics") {
    return finish(200, renderMetrics(), "text/plain; version=0.0.4; charset=utf-8");
  }

  if (pathname === "/") {
    return finish(200, renderStatusPage(), "text/html; charset=utf-8");
  }

  if (pathname === "/api/health") {
    return finish(200, JSON.stringify({ status: "ok", station: "aurora" }), "application/json");
  }

  if (pathname === "/api/modules") {
    return finish(200, JSON.stringify(modules), "application/json");
  }

  if (pathname === "/api/simulate/leak") {
    state.leakActive = true;
    return finish(
      200,
      JSON.stringify({ leak: true, message: "Sauerstoffleck simuliert – O2 fällt jetzt." }),
      "application/json"
    );
  }

  if (pathname === "/api/simulate/repair") {
    state.leakActive = false;
    return finish(
      200,
      JSON.stringify({ leak: false, message: "Leck abgedichtet – O2 erholt sich." }),
      "application/json"
    );
  }

  if (pathname === "/api/load") {
    const ms = clamp(Number(url.searchParams.get("ms") || 400), 50, 3000);
    burnCpu(ms);
    return finish(200, JSON.stringify({ burnedMs: ms }), "application/json");
  }

  return finish(404, JSON.stringify({ error: "not found" }), "application/json");
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`[station-api] Telemetrie-API hört auf Port ${PORT}`);
  console.log(`[station-api] Metriken unter http://localhost:${PORT}/metrics`);
});

process.on("SIGTERM", () => {
  console.log("[station-api] SIGTERM – fahre herunter.");
  server.close(() => process.exit(0));
});
