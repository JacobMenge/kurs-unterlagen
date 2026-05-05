---
title: "Compose-Recap"
description: "Die Compose-YAML-Bausteine, die ihr für Mission Control braucht – alle auf einer Seite."
---

# Compose-Recap

Diese Bausteine solltet ihr für die Aufgabe kennen. Nichts davon ist neu – ihr habt das alles im [Compose-Block](../docker-compose/index.md) gesehen. Lasst diese Seite während der Übung offen – ihr müsst nichts auswendig wissen.

!!! tip "Diese Seite ist eure Referenz während der Aufgabe"
    Schauen ist erlaubt. Auswendiglernen ist nicht der Lerninhalt.

---

## Grundgerüst einer `compose.yaml`

```yaml
services:
  # hier kommen eure Container rein
  ...

volumes:
  # benannte Volumes deklarieren
  ...
```

Der wichtigste Block ist **`services:`**. Alles andere ist Zusatz.

---

## Ein Service mit fertigem Image

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
```

| Schlüssel | Bedeutung |
|---|---|
| `image:` | fertiges Image aus Docker Hub |
| `environment:` | Umgebungsvariablen für den Container |
| `volumes:` | benanntes Volume in einen Pfad im Container mounten |

---

## Ein Service mit eigenem Build

```yaml
services:
  backend:
    build: ./backend-node
    environment:
      PGHOST: db
```

`build:` zeigt auf einen Ordner mit Dockerfile. Compose baut das Image lokal beim ersten `up` (oder bei `up --build`).

---

## Ports veröffentlichen

```yaml
ports:
  - "8080:80"
```

Format: `"HOST_PORT:CONTAINER_PORT"`. Beide Seiten als **String** schreiben (Anführungszeichen) – sonst interpretiert YAML das als Zahl, was bei Ports zu Fehlern führt.

> **Wichtig:** Services, die nur intern angesprochen werden (z.B. `backend`, `db` in unserem Fall), brauchen **kein** `ports:`. Sie sind im Compose-Netzwerk trotzdem erreichbar.

---

## Volumes – benannte vs. Bind-Mount

**Benanntes Volume** (von Compose verwaltet, persistent):

```yaml
services:
  db:
    volumes:
      - aurora-data:/var/lib/postgresql/data

volumes:
  aurora-data:
```

**Bind-Mount** (Datei oder Ordner aus eurem Projekt in den Container):

```yaml
services:
  db:
    volumes:
      - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
```

Das `ro` am Ende bedeutet "read-only" – der Container kann lesen, aber nicht ändern. Für Konfig- und Init-Dateien ist das Standard.

---

## `.env` und `${VARIABLEN}`

Eine Datei `.env` neben der `compose.yaml`:

```env
POSTGRES_USER=aurora
POSTGRES_PASSWORD=aurorapass
POSTGRES_DB=auroradb
FRONTEND_PORT=8080
```

In der `compose.yaml`:

```yaml
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}

  frontend:
    build: ./frontend
    ports:
      - "${FRONTEND_PORT}:80"
```

Compose ersetzt `${VAR}` automatisch beim Start. Wenn eine Variable fehlt, bleibt der Platzhalter stehen → unbedingt vorher mit `docker compose config` prüfen.

!!! warning "Achtung: zwei Sorten Umgebungsvariablen"
    - **Variablen für Compose** (in `${...}` substituiert) – kommen aus `.env` oder eurer Shell.
    - **Variablen für den Container** – stehen unter `environment:` und werden beim Container-Start als ENV gesetzt.

    Eine Variable kann beides sein: in `.env` definiert, in der `compose.yaml` über `${VAR}` an `environment:` durchgereicht.

---

## `depends_on` – Reihenfolge erzwingen

**Einfache Variante** (wartet nur, bis der Container *startet*):

```yaml
services:
  backend:
    depends_on:
      - db
```

**Mit Healthcheck** (wartet, bis der Service tatsächlich *bereit* ist):

```yaml
services:
  db:
    image: postgres:16-alpine
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U aurora -d auroradb"]
      interval: 5s
      timeout: 3s
      retries: 10

  backend:
    depends_on:
      db:
        condition: service_healthy
```

Ohne Healthcheck startet der Backend-Container, sobald die DB-Image-Prozess da ist – aber **bevor** Postgres Anfragen annimmt. Mit Healthcheck wartet Compose auf "ready".

---

## Bind-Mount für Init-Skripte (Postgres-Spezial)

Das offizielle `postgres`-Image führt Skripte im Verzeichnis `/docker-entrypoint-initdb.d/` automatisch aus – aber **nur beim allerersten Start** (frisches Volume).

```yaml
services:
  db:
    image: postgres:16-alpine
    volumes:
      - aurora-data:/var/lib/postgresql/data
      - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
```

Damit habt ihr beim ersten Start Beispielmodule in der DB. Wenn ihr das Init-SQL ändern wollt: Volume neu anlegen (siehe Hilfekarten).

---

## Wichtige Compose-Befehle

```bash
docker compose up -d              # Stack starten (detached)
docker compose up -d --build      # gleichzeitig Images neu bauen
docker compose ps                 # Status der Services
docker compose logs -f            # Live-Logs aller Services
docker compose logs -f backend    # nur ein Service
docker compose exec db psql -U aurora auroradb   # in Container reinspringen
docker compose down               # Stack abbauen (Volume bleibt)
docker compose down -v            # Stack + benannte Volumes löschen
docker compose config             # geparste, aufgelöste YAML anzeigen
```

---

## Wichtige Denkfrage

> **Wie spricht ein Service mit einem anderen?**

**Antwort:** über den **Service-Namen** als Hostnamen.

- Backend → DB: `PGHOST=db`
- Adminer → DB: Server-Feld = `db`
- Nginx → Backend: `proxy_pass http://backend:3000/api/`

**Niemals `localhost`**. Aus Sicht eines Containers ist `localhost` der Container selbst.

---

## Weiter

- [Szenario](03-szenario.md) – die Story und die Architektur
- [Aufgabenübersicht](04-aufgabenuebersicht.md) – die Missionen
