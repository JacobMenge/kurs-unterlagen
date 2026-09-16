// Mission Control: Backend (Node.js + Express)
// Übungs-App für Docker Compose. Der Code muss nicht im Detail
// verstanden werden. Fokus der Übung ist Compose, nicht JavaScript.
//
// Aufgaben des Backends:
//   1. Heartbeats der Stationsmodule entgegennehmen (POST /api/heartbeat)
//   2. Statuswechsel ins Logbuch schreiben (Tabelle logbuch in Postgres)
//   3. Der Bodenkontrolle den Stationszustand liefern (GET /api/station)

import express from "express";
import pg from "pg";

const { Pool } = pg;

const PORT = Number(process.env.PORT || 3000);
const APP_NAME = "Mission Control Backend (Node/Express)";

// Nach so vielen Millisekunden ohne Meldung gilt ein Modul als offline.
const OFFLINE_NACH_MS = 8000;

const pool = new Pool({
  host: process.env.PGHOST || "localhost",
  port: Number(process.env.PGPORT || 5432),
  user: process.env.PGUSER || "aurora",
  password: process.env.PGPASSWORD || "aurorapass",
  database: process.env.PGDATABASE || "auroradb",
});

const app = express();
app.use(express.json());

// Zuletzt gesehene Module: Name -> { zuletzt: ms, status: "online"|"offline" }
const module_ = new Map();

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function waitForDatabase(maxAttempts = 30) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await pool.query("SELECT 1");
      console.log("[backend] Datenbankverbindung steht.");
      return;
    } catch (err) {
      console.log(
        `[backend] Datenbank noch nicht bereit (Versuch ${attempt}/${maxAttempts}): ${err.message}`
      );
      await sleep(1000);
    }
  }
  throw new Error("Datenbankverbindung nach mehreren Versuchen fehlgeschlagen.");
}

async function ensureSchema() {
  // init.sql aus dem db/-Ordner legt die Tabelle eigentlich schon an.
  // Wir legen sie hier defensiv ein zweites Mal an, falls jemand die
  // Datenbank ohne Init-Skript startet.
  await pool.query(`
    CREATE TABLE IF NOT EXISTS logbuch (
      id        SERIAL       PRIMARY KEY,
      zeit      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
      modul     VARCHAR(100) NOT NULL,
      ereignis  VARCHAR(20)  NOT NULL
    );
  `);
}

async function logbuchEintrag(modul, ereignis) {
  try {
    await pool.query(
      "INSERT INTO logbuch (modul, ereignis) VALUES ($1, $2)",
      [modul, ereignis]
    );
    console.log(`[backend] Logbuch: ${modul} ${ereignis}`);
  } catch (err) {
    console.log(`[backend] Logbuch nicht erreichbar: ${err.message}`);
  }
}

// Wer 8 Sekunden schweigt, gilt als offline. Läuft alle 2 Sekunden.
setInterval(() => {
  const jetzt = Date.now();
  for (const [name, eintrag] of module_) {
    if (eintrag.status === "online" && jetzt - eintrag.zuletzt > OFFLINE_NACH_MS) {
      eintrag.status = "offline";
      logbuchEintrag(name, "offline");
    }
  }
}, 2000);

// ------------------- Routen -------------------

app.get("/api/health", async (_req, res) => {
  let dbStatus = "disconnected";
  try {
    await pool.query("SELECT 1");
    dbStatus = "connected";
  } catch (_) {
    dbStatus = "disconnected";
  }
  res.json({
    status: "ok",
    app: APP_NAME,
    implementation: "node-express",
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

// Ein Stationsmodul meldet sich: { "name": "Energie" }
app.post("/api/heartbeat", async (req, res) => {
  const { name } = req.body || {};
  if (!name || typeof name !== "string" || !name.trim() || name.length > 80) {
    return res.status(400).json({ error: "Feld name fehlt oder ist ungültig." });
  }
  const modul = name.trim();
  const bisher = module_.get(modul);
  module_.set(modul, { zuletzt: Date.now(), status: "online" });
  if (!bisher || bisher.status !== "online") {
    await logbuchEintrag(modul, "online");
  }
  res.json({ ok: true });
});

// Der Stationszustand für das Frontend der Bodenkontrolle.
app.get("/api/station", async (_req, res) => {
  let dbStatus = "disconnected";
  let logbuch = [];
  try {
    const result = await pool.query(
      "SELECT id, zeit, modul, ereignis FROM logbuch ORDER BY id DESC LIMIT 12"
    );
    logbuch = result.rows;
    dbStatus = "connected";
  } catch (_) {
    dbStatus = "disconnected";
  }
  const jetzt = Date.now();
  const moduleListe = [...module_.entries()].map(([name, eintrag]) => ({
    name,
    status: eintrag.status,
    sekundenSeitMeldung: Math.round((jetzt - eintrag.zuletzt) / 1000),
  }));
  moduleListe.sort((a, b) => a.name.localeCompare(b.name, "de"));
  res.json({
    app: APP_NAME,
    implementation: "node-express",
    database: dbStatus,
    module: moduleListe,
    logbuch,
  });
});

// ------------------- Start -------------------

async function start() {
  console.log(`[backend] Starte ${APP_NAME}`);
  console.log("[backend] Datenbank-Ziel:", {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
  });
  await waitForDatabase();
  await ensureSchema();
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[backend] Erreichbar auf Port ${PORT}`);
  });
}

process.on("SIGTERM", async () => {
  console.log("[backend] Stopp-Signal empfangen, schließe Verbindungen.");
  await pool.end();
  process.exit(0);
});

start().catch((err) => {
  console.error("[backend] Start fehlgeschlagen:", err.message);
  process.exit(1);
});
