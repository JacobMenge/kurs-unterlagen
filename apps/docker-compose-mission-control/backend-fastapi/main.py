"""Mission Control Backend – FastAPI-Variante.

Identische Endpunkte wie das Node-Backend. Wird in der Bonus-Mission
gegen das Node-Backend ausgetauscht, um zu zeigen: gleiche Schnittstelle,
unterschiedliche Implementierung – Compose-Datei muss nur den Service
'backend' anders bauen.
"""

from __future__ import annotations

import os
import time
from typing import Literal

import psycopg
from fastapi import FastAPI, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel, Field

APP_NAME = "Mission Control Backend (FastAPI)"
PORT = int(os.environ.get("PORT", "3000"))

PG_CONFIG = {
    "host": os.environ.get("PGHOST", "localhost"),
    "port": int(os.environ.get("PGPORT", "5432")),
    "user": os.environ.get("PGUSER", "aurora"),
    "password": os.environ.get("PGPASSWORD", "aurorapass"),
    "dbname": os.environ.get("PGDATABASE", "auroradb"),
}

VALID_STATUSES = ("online", "offline", "critical", "maintenance")
StatusLiteral = Literal["online", "offline", "critical", "maintenance"]

app = FastAPI(title=APP_NAME)


def get_conn():
    """Neue Verbindung pro Request – simpel, ausreichend für die Übung."""
    return psycopg.connect(**PG_CONFIG)


def wait_for_database(max_attempts: int = 30) -> None:
    for attempt in range(1, max_attempts + 1):
        try:
            with psycopg.connect(**PG_CONFIG) as conn:
                with conn.cursor() as cur:
                    cur.execute("SELECT 1")
            print("[backend] Database connection established.", flush=True)
            return
        except Exception as exc:  # noqa: BLE001
            print(
                f"[backend] Database not ready "
                f"(attempt {attempt}/{max_attempts}): {exc}",
                flush=True,
            )
            time.sleep(1)
    raise RuntimeError("Database connection failed after multiple attempts.")


def ensure_schema() -> None:
    with psycopg.connect(**PG_CONFIG) as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS modules (
                  id          SERIAL PRIMARY KEY,
                  name        VARCHAR(100) NOT NULL,
                  status      VARCHAR(20)  NOT NULL DEFAULT 'offline',
                  created_at  TIMESTAMP    NOT NULL DEFAULT NOW()
                );
                """
            )
            conn.commit()


# ------------------- Models -------------------


class ModuleCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    status: StatusLiteral = "offline"


class ModuleUpdate(BaseModel):
    status: StatusLiteral


# ------------------- Routes -------------------


@app.get("/api/health")
def health() -> dict:
    db_state = "disconnected"
    try:
        with psycopg.connect(**PG_CONFIG) as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT 1")
        db_state = "connected"
    except Exception:  # noqa: BLE001
        db_state = "disconnected"
    return {
        "status": "ok",
        "app": APP_NAME,
        "implementation": "python-fastapi",
        "database": db_state,
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }


@app.get("/api/modules")
def list_modules() -> list[dict]:
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT id, name, status, created_at "
                "FROM modules ORDER BY id ASC"
            )
            rows = cur.fetchall()
    return [
        {
            "id": r[0],
            "name": r[1],
            "status": r[2],
            "created_at": r[3].isoformat() if r[3] else None,
        }
        for r in rows
    ]


@app.post("/api/modules", status_code=201)
def create_module(payload: ModuleCreate) -> dict:
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO modules (name, status)
                VALUES (%s, %s)
                RETURNING id, name, status, created_at
                """,
                (payload.name.strip(), payload.status),
            )
            row = cur.fetchone()
            conn.commit()
    return {
        "id": row[0],
        "name": row[1],
        "status": row[2],
        "created_at": row[3].isoformat() if row[3] else None,
    }


@app.patch("/api/modules/{module_id}")
def update_module(module_id: int, payload: ModuleUpdate) -> dict:
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                UPDATE modules SET status = %s WHERE id = %s
                RETURNING id, name, status, created_at
                """,
                (payload.status, module_id),
            )
            row = cur.fetchone()
            conn.commit()
    if row is None:
        raise HTTPException(status_code=404, detail="Module not found.")
    return {
        "id": row[0],
        "name": row[1],
        "status": row[2],
        "created_at": row[3].isoformat() if row[3] else None,
    }


@app.delete("/api/modules/{module_id}", status_code=204)
def delete_module(module_id: int) -> Response:
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM modules WHERE id = %s", (module_id,))
            deleted = cur.rowcount
            conn.commit()
    if deleted == 0:
        raise HTTPException(status_code=404, detail="Module not found.")
    return Response(status_code=204)


# ------------------- Boot -------------------


@app.on_event("startup")
def on_startup() -> None:
    print(f"[backend] Starting {APP_NAME}", flush=True)
    print(
        "[backend] DB target:",
        {
            "host": PG_CONFIG["host"],
            "port": PG_CONFIG["port"],
            "database": PG_CONFIG["dbname"],
            "user": PG_CONFIG["user"],
        },
        flush=True,
    )
    wait_for_database()
    ensure_schema()
    print(f"[backend] Listening on port {PORT}", flush=True)
