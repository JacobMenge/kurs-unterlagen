"""Mission Control Backend, FastAPI-Variante.

Identische Endpunkte wie das Node-Backend. Wird in der Vertiefung
gegen das Node-Backend getauscht, um zu zeigen: gleiche Schnittstelle,
andere Implementierung. In der Compose-Datei ändert sich nur, woraus
der Service backend gebaut wird.
"""

from __future__ import annotations

import os
import threading
import time
from contextlib import asynccontextmanager

import psycopg
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

APP_NAME = "Mission Control Backend (FastAPI)"
PORT = int(os.environ.get("PORT", "3000"))

# Nach so vielen Sekunden ohne Meldung gilt ein Modul als offline.
OFFLINE_NACH_S = 8.0

PG_CONFIG = {
    "host": os.environ.get("PGHOST", "localhost"),
    "port": int(os.environ.get("PGPORT", "5432")),
    "user": os.environ.get("PGUSER", "aurora"),
    "password": os.environ.get("PGPASSWORD", "aurorapass"),
    "dbname": os.environ.get("PGDATABASE", "auroradb"),
}

# Zuletzt gesehene Module: Name -> {"zuletzt": Epochensekunden, "status": str}
module: dict[str, dict] = {}
schloss = threading.Lock()


def verbinden() -> psycopg.Connection:
    return psycopg.connect(**PG_CONFIG, connect_timeout=3)


def wait_for_database(max_attempts: int = 30) -> None:
    for attempt in range(1, max_attempts + 1):
        try:
            with verbinden() as conn:
                conn.execute("SELECT 1")
            print("[backend] Datenbankverbindung steht.", flush=True)
            return
        except Exception as err:  # noqa: BLE001
            print(
                f"[backend] Datenbank noch nicht bereit (Versuch {attempt}/{max_attempts}): {err}",
                flush=True,
            )
            time.sleep(1)
    raise RuntimeError("Datenbankverbindung nach mehreren Versuchen fehlgeschlagen.")


def ensure_schema() -> None:
    with verbinden() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS logbuch (
              id        SERIAL       PRIMARY KEY,
              zeit      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
              modul     VARCHAR(100) NOT NULL,
              ereignis  VARCHAR(20)  NOT NULL
            );
            """
        )


def logbuch_eintrag(modul_name: str, ereignis: str) -> None:
    try:
        with verbinden() as conn:
            conn.execute(
                "INSERT INTO logbuch (modul, ereignis) VALUES (%s, %s)",
                (modul_name, ereignis),
            )
        print(f"[backend] Logbuch: {modul_name} {ereignis}", flush=True)
    except Exception as err:  # noqa: BLE001
        print(f"[backend] Logbuch nicht erreichbar: {err}", flush=True)


def waechter() -> None:
    """Setzt Module ohne frische Meldung auf offline. Läuft alle 2 Sekunden."""
    while True:
        time.sleep(2)
        jetzt = time.time()
        abgemeldet = []
        with schloss:
            for name, eintrag in module.items():
                if eintrag["status"] == "online" and jetzt - eintrag["zuletzt"] > OFFLINE_NACH_S:
                    eintrag["status"] = "offline"
                    abgemeldet.append(name)
        for name in abgemeldet:
            logbuch_eintrag(name, "offline")


@asynccontextmanager
async def lifespan(_app: FastAPI):
    print(f"[backend] Starte {APP_NAME}", flush=True)
    print(
        "[backend] Datenbank-Ziel:",
        {k: PG_CONFIG[k] for k in ("host", "port", "dbname", "user")},
        flush=True,
    )
    wait_for_database()
    ensure_schema()
    threading.Thread(target=waechter, daemon=True).start()
    yield


app = FastAPI(title=APP_NAME, lifespan=lifespan)


class Heartbeat(BaseModel):
    name: str = Field(min_length=1, max_length=80)


@app.get("/api/health")
def health() -> dict:
    db_status = "disconnected"
    try:
        with verbinden() as conn:
            conn.execute("SELECT 1")
        db_status = "connected"
    except Exception:  # noqa: BLE001
        db_status = "disconnected"
    return {
        "status": "ok",
        "app": APP_NAME,
        "implementation": "fastapi",
        "database": db_status,
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S"),
    }


@app.post("/api/heartbeat")
def heartbeat(meldung: Heartbeat) -> dict:
    name = meldung.name.strip()
    if not name:
        raise HTTPException(status_code=400, detail="Feld name fehlt oder ist ungültig.")
    with schloss:
        bisher = module.get(name)
        module[name] = {"zuletzt": time.time(), "status": "online"}
    if bisher is None or bisher["status"] != "online":
        logbuch_eintrag(name, "online")
    return {"ok": True}


@app.get("/api/station")
def station() -> dict:
    db_status = "disconnected"
    logbuch: list[dict] = []
    try:
        with verbinden() as conn:
            zeilen = conn.execute(
                "SELECT id, zeit, modul, ereignis FROM logbuch ORDER BY id DESC LIMIT 12"
            ).fetchall()
        logbuch = [
            {"id": z[0], "zeit": z[1].isoformat(), "modul": z[2], "ereignis": z[3]}
            for z in zeilen
        ]
        db_status = "connected"
    except Exception:  # noqa: BLE001
        db_status = "disconnected"
    jetzt = time.time()
    with schloss:
        module_liste = [
            {
                "name": name,
                "status": eintrag["status"],
                "sekundenSeitMeldung": round(jetzt - eintrag["zuletzt"]),
            }
            for name, eintrag in module.items()
        ]
    module_liste.sort(key=lambda m: m["name"])
    return {
        "app": APP_NAME,
        "implementation": "fastapi",
        "database": db_status,
        "module": module_liste,
        "logbuch": logbuch,
    }
