// Mission Control – Backend (Node.js + Express)
// Übungs-App für Docker Compose. Der Code muss nicht im Detail
// verstanden werden – Fokus der Übung ist Compose, nicht JavaScript.

import express from "express";
import pg from "pg";

const { Pool } = pg;

const PORT = Number(process.env.PORT || 3000);
const APP_NAME = "Mission Control Backend (Node/Express)";

const VALID_STATUSES = new Set([
  "online",
  "offline",
  "critical",
  "maintenance",
]);

const pool = new Pool({
  host: process.env.PGHOST || "localhost",
  port: Number(process.env.PGPORT || 5432),
  user: process.env.PGUSER || "aurora",
  password: process.env.PGPASSWORD || "aurorapass",
  database: process.env.PGDATABASE || "auroradb",
});

const app = express();
app.use(express.json());

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function waitForDatabase(maxAttempts = 30) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await pool.query("SELECT 1");
      console.log("[backend] Database connection established.");
      return;
    } catch (err) {
      console.log(
        `[backend] Database not ready (attempt ${attempt}/${maxAttempts}): ${err.message}`
      );
      await sleep(1000);
    }
  }
  throw new Error("Database connection failed after multiple attempts.");
}

async function ensureSchema() {
  // init.sql aus dem db/-Ordner legt die Tabelle eigentlich schon an.
  // Wir legen sie hier defensiv ein zweites Mal an, falls jemand die
  // Datenbank ohne Init-Skript startet.
  await pool.query(`
    CREATE TABLE IF NOT EXISTS modules (
      id          SERIAL PRIMARY KEY,
      name        VARCHAR(100) NOT NULL,
      status      VARCHAR(20)  NOT NULL DEFAULT 'offline',
      created_at  TIMESTAMP    NOT NULL DEFAULT NOW()
    );
  `);
}

// ------------------- Routes -------------------

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

app.get("/api/modules", async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, status, created_at FROM modules ORDER BY id ASC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({
      error: "Could not load modules.",
      message: err.message,
    });
  }
});

app.post("/api/modules", async (req, res) => {
  const { name, status } = req.body || {};

  if (!name || typeof name !== "string" || !name.trim()) {
    return res.status(400).json({
      error: "Missing or invalid field: name",
    });
  }
  const finalStatus = status || "offline";
  if (!VALID_STATUSES.has(finalStatus)) {
    return res.status(400).json({
      error: "Invalid status.",
      validValues: [...VALID_STATUSES],
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO modules (name, status)
       VALUES ($1, $2)
       RETURNING id, name, status, created_at`,
      [name.trim(), finalStatus]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({
      error: "Could not create module.",
      message: err.message,
    });
  }
});

app.patch("/api/modules/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body || {};
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "Invalid id." });
  }
  if (!VALID_STATUSES.has(status)) {
    return res.status(400).json({
      error: "Invalid status.",
      validValues: [...VALID_STATUSES],
    });
  }

  try {
    const result = await pool.query(
      `UPDATE modules SET status = $1 WHERE id = $2
       RETURNING id, name, status, created_at`,
      [status, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Module not found." });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({
      error: "Could not update module.",
      message: err.message,
    });
  }
});

app.delete("/api/modules/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "Invalid id." });
  }
  try {
    const result = await pool.query("DELETE FROM modules WHERE id = $1", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Module not found." });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({
      error: "Could not delete module.",
      message: err.message,
    });
  }
});

// ------------------- Boot -------------------

async function start() {
  console.log(`[backend] Starting ${APP_NAME}`);
  console.log("[backend] DB target:", {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
  });
  await waitForDatabase();
  await ensureSchema();
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[backend] Listening on port ${PORT}`);
  });
}

process.on("SIGTERM", async () => {
  console.log("[backend] SIGTERM received, closing pool.");
  await pool.end();
  process.exit(0);
});

start().catch((err) => {
  console.error("[backend] Startup failed:", err.message);
  process.exit(1);
});
