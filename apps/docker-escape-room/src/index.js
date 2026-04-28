import express from "express";
import pg from "pg";

const { Pool } = pg;

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT || 3000);
const APP_NAME = process.env.APP_NAME || "Container Quest API";

const dbConfig = {
  host: process.env.PGHOST || "localhost",
  port: Number(process.env.PGPORT || 5432),
  user: process.env.PGUSER || "quest",
  password: process.env.PGPASSWORD || "questpass",
  database: process.env.PGDATABASE || "questdb"
};

const pool = new Pool(dbConfig);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForDatabase(maxAttempts = 20) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await pool.query("SELECT 1");
      console.log("Database connection established.");
      return;
    } catch (error) {
      console.log(
        `Database not ready yet. Attempt ${attempt}/${maxAttempts}. Reason: ${error.message}`
      );
      await sleep(1000);
    }
  }

  throw new Error("Database connection failed after multiple attempts.");
}

async function initDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS entries (
      id SERIAL PRIMARY KEY,
      team VARCHAR(100) NOT NULL,
      category VARCHAR(100) NOT NULL,
      name VARCHAR(100) NOT NULL,
      score INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);
}

app.get("/", (req, res) => {
  res.json({
    app: APP_NAME,
    message: "Welcome to the Docker Escape Room.",
    dockerFocus: [
      "build an image",
      "run containers",
      "connect containers through a Docker network",
      "persist database data with a Docker volume",
      "configure containers with environment variables"
    ],
    endpoints: [
      "GET /health",
      "GET /db-check",
      "GET /api/entries",
      "POST /api/entries",
      "GET /api/scoreboard"
    ]
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    app: APP_NAME,
    timestamp: new Date().toISOString()
  });
});

app.get("/db-check", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS db_time");
    res.json({
      status: "ok",
      database: "connected",
      dbTime: result.rows[0].db_time,
      dbHost: dbConfig.host,
      dbName: dbConfig.database
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      database: "not connected",
      message: error.message,
      hint: "Check PGHOST, PGUSER, PGPASSWORD, PGDATABASE and Docker network."
    });
  }
});

app.get("/api/entries", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, team, category, name, score, created_at
      FROM entries
      ORDER BY id DESC;
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      error: "Could not load entries.",
      message: error.message
    });
  }
});

app.post("/api/entries", async (req, res) => {
  const { team, category, name, score } = req.body;

  if (!team || !category || !name) {
    return res.status(400).json({
      error: "Missing required fields.",
      requiredFields: ["team", "category", "name"],
      optionalFields: ["score"]
    });
  }

  const parsedScore = Number(score || 0);

  if (Number.isNaN(parsedScore)) {
    return res.status(400).json({
      error: "Score must be a number."
    });
  }

  try {
    const result = await pool.query(
      `
      INSERT INTO entries (team, category, name, score)
      VALUES ($1, $2, $3, $4)
      RETURNING id, team, category, name, score, created_at;
      `,
      [team, category, name, parsedScore]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      error: "Could not create entry.",
      message: error.message
    });
  }
});

app.get("/api/scoreboard", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        team,
        COUNT(*) AS entries,
        COALESCE(SUM(score), 0) AS total_score
      FROM entries
      GROUP BY team
      ORDER BY total_score DESC, entries DESC, team ASC;
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      error: "Could not load scoreboard.",
      message: error.message
    });
  }
});

async function start() {
  try {
    console.log("Starting Container Quest API...");
    console.log("Database config:", {
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      database: dbConfig.database
    });

    await waitForDatabase();
    await initDatabase();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`${APP_NAME} listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Startup failed:", error.message);
    process.exit(1);
  }
}

process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Closing database pool.");
  await pool.end();
  process.exit(0);
});

start();
