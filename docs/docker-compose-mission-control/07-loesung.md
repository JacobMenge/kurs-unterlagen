---
title: "Lösung"
description: "Vollständige Schritt-für-Schritt-Lösung für Mission Control. Erst nach der eigenen Arbeit aufschlagen!"
---

# Lösung

!!! danger "Erst nach der eigenen Arbeit aufschlagen!"
    Diese Seite enthält die **vollständige Lösung**. Wenn ihr noch in der Gruppenarbeit seid: [Hilfekarten](05-hilfekarten.md) sind der bessere Ort.

Die Lösung baut die `compose.yaml` schrittweise auf – Mission für Mission – und zeigt am Ende die komplette Datei.

---

## Schritt 0 – In den App-Ordner wechseln

```bash
cd apps/docker-compose-mission-control
```

Prüfen, dass alle Bauteile da sind:

=== "macOS / Linux / Git Bash"
    ```bash
    ls
    # backend-fastapi  backend-node  db  frontend  .env.example  README.md
    ```

=== "Windows PowerShell"
    ```powershell
    Get-ChildItem
    ```

Falls noch keine `compose.yaml` existiert: leere Datei anlegen.

```bash
touch compose.yaml      # macOS/Linux/Git Bash
```

oder unter PowerShell:

```powershell
New-Item -ItemType File compose.yaml
```

---

## Schritt 1 – Datenbank-Service `db`

Erste Version der `compose.yaml`:

```yaml
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: aurora
      POSTGRES_PASSWORD: aurorapass
      POSTGRES_DB: auroradb
    volumes:
      - aurora-data:/var/lib/postgresql/data
      - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql:ro

volumes:
  aurora-data:
```

Starten:

```bash
docker compose up -d
```

Check:

```bash
docker compose ps
docker compose logs db | tail -20
docker compose exec db psql -U aurora -d auroradb -c "SELECT name, status FROM modules;"
```

Erwartetes Ergebnis: sechs Beispiel-Module aus dem `init.sql`.

---

## Schritt 2 – Backend-Service

Dazu nehmen:

```yaml
services:

  db:
    # ... wie oben

  backend:
    build: ./backend-node
    environment:
      PORT: 3000
      PGHOST: db
      PGPORT: 5432
      PGUSER: aurora
      PGPASSWORD: aurorapass
      PGDATABASE: auroradb
    depends_on:
      - db

volumes:
  aurora-data:
```

Image bauen + starten:

```bash
docker compose up -d --build
```

Logs prüfen, bis "Listening on port 3000" steht:

```bash
docker compose logs -f backend
```

(Mit `Ctrl+C` aus dem Live-Log raus.)

API-Test direkt im Backend-Container:

```bash
docker compose exec backend wget -qO- http://localhost:3000/api/health
```

oder aus einem Terminal **außerhalb** der Container heraus geht (noch) **nicht**, weil der Backend-Service bewusst keinen externen Port hat.

---

## Schritt 3 – Frontend-Service

```yaml
services:

  db:
    # ...

  backend:
    # ...

  frontend:
    build: ./frontend
    ports:
      - "8080:80"
    depends_on:
      - backend

volumes:
  aurora-data:
```

Image bauen + starten:

```bash
docker compose up -d --build
```

Im Browser: <http://localhost:8080>

Erwartet:

- Mission-Control-Header sichtbar
- Status-Indikator oben rechts grün, "Backend online · node-express"
- Sechs Module aus dem `init.sql` als Karten
- Modul anlegen, Status ändern, Modul entfernen funktioniert

---

## Schritt 4 – Adminer-Service

```yaml
services:

  db:
    # ...

  backend:
    # ...

  frontend:
    # ...

  adminer:
    image: adminer:latest
    ports:
      - "8081:8080"
    depends_on:
      - db

volumes:
  aurora-data:
```

Stack neu starten:

```bash
docker compose up -d
```

Adminer öffnen: <http://localhost:8081>

Login:

| Feld | Wert |
|---|---|
| System | PostgreSQL |
| Server | `db` |
| Benutzer | `aurora` |
| Passwort | `aurorapass` |
| Datenbank | `auroradb` |

In der Tabelle `modules` solltet ihr sechs Init-Module + alles, was ihr im Frontend angelegt habt, sehen.

---

## Schritt 5 – Konfiguration in `.env`

`.env.example` kopieren:

=== "macOS / Linux / Git Bash"
    ```bash
    cp .env.example .env
    ```

=== "Windows PowerShell"
    ```powershell
    Copy-Item .env.example .env
    ```

=== "Windows CMD"
    ```cmd
    copy .env.example .env
    ```

Inhalt von `.env`:

```env
POSTGRES_USER=aurora
POSTGRES_PASSWORD=aurorapass
POSTGRES_DB=auroradb

FRONTEND_PORT=8080
ADMINER_PORT=8081
BACKEND_PORT=3000
```

`compose.yaml` so umbauen, dass die Werte aus `.env` kommen:

```yaml
services:

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - aurora-data:/var/lib/postgresql/data
      - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql:ro

  backend:
    build: ./backend-node
    environment:
      PORT: ${BACKEND_PORT}
      PGHOST: db
      PGPORT: 5432
      PGUSER: ${POSTGRES_USER}
      PGPASSWORD: ${POSTGRES_PASSWORD}
      PGDATABASE: ${POSTGRES_DB}
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "${FRONTEND_PORT}:80"
    depends_on:
      - backend

  adminer:
    image: adminer:latest
    ports:
      - "${ADMINER_PORT}:8080"
    depends_on:
      - db

volumes:
  aurora-data:
```

Vorher prüfen, ob alles aufgelöst wird:

```bash
docker compose config
```

Wenn dort sauber `aurora`, `8080`, `8081` etc. drin steht: Stack neu starten:

```bash
docker compose up -d
```

---

## Schritt 6 – Healthcheck + `condition: service_healthy`

Im DB-Service den Healthcheck ergänzen, im Backend `depends_on` umbauen:

```yaml
services:

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - aurora-data:/var/lib/postgresql/data
      - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER} -d $${POSTGRES_DB}"]
      interval: 5s
      timeout: 3s
      retries: 10
      start_period: 10s

  backend:
    build: ./backend-node
    environment:
      PORT: ${BACKEND_PORT}
      PGHOST: db
      PGPORT: 5432
      PGUSER: ${POSTGRES_USER}
      PGPASSWORD: ${POSTGRES_PASSWORD}
      PGDATABASE: ${POSTGRES_DB}
    depends_on:
      db:
        condition: service_healthy

  # frontend, adminer wie vorher
```

Wichtig: `$${POSTGRES_USER}` mit **doppeltem** Dollar – damit Compose die Variable **nicht** beim Parsen ersetzt, sondern erst die Bash im Container sie zur Laufzeit auflöst (zu dem Zeitpunkt ist `POSTGRES_USER` als ENV im Container gesetzt).

Stack komplett neu hochfahren:

```bash
docker compose down
docker compose up -d
```

Check:

```bash
docker compose ps
```

`db` zeigt `Up (healthy)`. Das Backend startet erst, nachdem `db` `healthy` meldet – also ohne "Database not ready"-Versuche.

---

## Schritt 7 – Persistenz testen

Im Frontend ein paar eigene Module anlegen, dann:

```bash
docker compose down
docker compose up -d
```

Browser neu laden – eure Module sind noch da. ✅

Jetzt der harte Test:

```bash
docker compose down -v
docker compose up -d
```

Eure Module sind weg, die sechs Init-Module sind wieder da. Das Volume wurde gelöscht und neu angelegt, das Init-SQL ist erneut gelaufen.

---

## Komplette `compose.yaml` (Endstand)

Hier die fertige `compose.yaml` zum Vergleichen:

```yaml
services:

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - aurora-data:/var/lib/postgresql/data
      - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER} -d $${POSTGRES_DB}"]
      interval: 5s
      timeout: 3s
      retries: 10
      start_period: 10s

  backend:
    build: ./backend-node
    environment:
      PORT: ${BACKEND_PORT}
      PGHOST: db
      PGPORT: 5432
      PGUSER: ${POSTGRES_USER}
      PGPASSWORD: ${POSTGRES_PASSWORD}
      PGDATABASE: ${POSTGRES_DB}
    depends_on:
      db:
        condition: service_healthy

  frontend:
    build: ./frontend
    ports:
      - "${FRONTEND_PORT}:80"
    depends_on:
      - backend

  adminer:
    image: adminer:latest
    ports:
      - "${ADMINER_PORT}:8080"
    depends_on:
      - db

volumes:
  aurora-data:
```

Und die `.env`:

```env
POSTGRES_USER=aurora
POSTGRES_PASSWORD=aurorapass
POSTGRES_DB=auroradb

FRONTEND_PORT=8080
ADMINER_PORT=8081
BACKEND_PORT=3000
```

---

## Bonus A – Backend austauschen (Node → FastAPI)

**Variante 1 – einfach:** `compose.yaml` direkt anpassen.

```yaml
backend:
  build: ./backend-fastapi
  # alles andere bleibt gleich
```

Stack neu bauen:

```bash
docker compose up -d --build
```

Im Frontend nachschauen: oben rechts steht jetzt „Backend online · python-fastapi".

**Variante 2 – sauberer mit Override:** zweite Datei `compose.fastapi.yaml`:

```yaml
services:
  backend:
    build: ./backend-fastapi
```

Starten mit beiden Dateien (zweite überschreibt die erste):

```bash
docker compose -f compose.yaml -f compose.fastapi.yaml up -d --build
```

> Was lernt ihr daraus? **Die Schnittstelle bleibt gleich**, das Innenleben ist austauschbar. Frontend, DB und Adminer merken nichts vom Wechsel.

---

## Typische Fehler – und wie ihr sie löst

### Fehler 1: Backend findet DB nicht

**Symptom:** Backend-Logs:

```text
getaddrinfo ENOTFOUND db
```

**Ursache:** `PGHOST` ist falsch gesetzt – oder der Service heißt nicht `db`.

**Lösung:** in der `compose.yaml` den Service `db:` (genau so) und im Backend `PGHOST: db` setzen.

---

### Fehler 2: `${POSTGRES_USER}` wird wörtlich übernommen

**Symptom:** Postgres-Logs:

```text
role "${POSTGRES_USER}" does not exist
```

**Ursache:** `.env` liegt nicht im Compose-Ordner, oder die Variable ist falsch geschrieben.

**Diagnose:**

```bash
docker compose config | grep POSTGRES
```

Wenn dort weiterhin `${...}` steht, hat Compose nichts ersetzt.

---

### Fehler 3: Init-SQL hat nichts gemacht

**Symptom:** Frontend zeigt keine Module, `\dt` in psql ergibt keine Tabelle.

**Ursache:** das Skript wurde nie ausgeführt, weil das Volume schon existierte.

**Lösung:**

```bash
docker compose down -v
docker compose up -d
```

---

### Fehler 4: `db` bleibt dauerhaft `health: starting`

**Symptom:** `docker compose ps` zeigt `health: starting` und das Backend startet nie.

**Mögliche Ursachen:**

- `pg_isready` mit falschem User/DB. Pfad zur Diagnose:

    ```bash
    docker compose exec db pg_isready -U aurora -d auroradb
    ```

- `start_period` zu kurz. Auf 15–20 Sekunden hochsetzen.
- `$${VARIABLE}` im Healthcheck vergessen → Variable wird nicht im Container ausgewertet.

---

### Fehler 5: Port belegt

**Symptom:**

```text
Bind for 0.0.0.0:8080 failed: port is already allocated
```

**Lösung:** in `.env` `FRONTEND_PORT=8090` (oder einen anderen freien Port) setzen.

---

### Fehler 6: Backend baut, aber der Code-Stand ist alt

**Symptom:** Änderungen kommen nicht im Container an.

**Lösung:**

```bash
docker compose up -d --build
# oder hart:
docker compose build --no-cache backend
docker compose up -d
```

---

## Aufräumen am Ende

Wenn alle Gruppen fertig sind, Stack abbauen:

```bash
docker compose down
```

Wenn ihr **alles** loswerden wollt (inkl. der Daten):

```bash
docker compose down -v --rmi local
```

Das löscht Container, Netzwerk, benannte Volumes und die lokal gebauten Images dieses Projekts.

---

## Weiter

- [Rückblick & Ausblick](08-rueckblick.md) – wie habt ihr euch durch die drei Praxis-Blöcke entwickelt
