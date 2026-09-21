---
title: "Musterlösung"
description: "Die komplette compose.yaml für Mission Control mit Erklärung je Block, dazu die Auflösungen der Vertiefungen."
---

# Musterlösung

Der Notausgang während der Übung und die Nachlese danach. Wer hier
landet, ohne die Funkhilfe-Stufen probiert zu haben, bringt sich um den
besten Teil des Abends.

## Die komplette compose.yaml

Stand nach Mission 7, mit allen sechs Modulen (Vertiefung 1):

```yaml
services:
  frontend:
    build: ./frontend
    ports:
      - "${FRONTEND_PORT}:80"
    depends_on:
      - backend

  backend:
    build: ./backend-node
    environment:
      PGHOST: db
      PGUSER: ${POSTGRES_USER}
      PGPASSWORD: ${POSTGRES_PASSWORD}
      PGDATABASE: ${POSTGRES_DB}
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - aurora-data:/var/lib/postgresql/data
      - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 5s
      timeout: 3s
      retries: 5

  adminer:
    image: adminer:latest
    ports:
      - "${ADMINER_PORT}:8080"
    depends_on:
      - db

  lebenserhaltung:
    build: ./modul
    environment:
      MODUL_NAME: Lebenserhaltung

  energie:
    build: ./modul
    environment:
      MODUL_NAME: Energie

  kommunikation:
    build: ./modul
    environment:
      MODUL_NAME: Kommunikation

  forschungslabor:
    build: ./modul
    environment:
      MODUL_NAME: Forschungslabor

  hydroponik:
    build: ./modul
    environment:
      MODUL_NAME: Hydroponik

  andockschleuse:
    build: ./modul
    environment:
      MODUL_NAME: Andockschleuse

volumes:
  aurora-data:
```

Dazu die `.env` (aus `.env.example` kopiert):

```env
POSTGRES_USER=aurora
POSTGRES_PASSWORD=aurorapass
POSTGRES_DB=auroradb
FRONTEND_PORT=8080
ADMINER_PORT=8081
```

Start und Kontrolle:

```bash
docker compose up -d
```

```bash
docker compose ps
```

## Warum die Datei so aussieht

- **frontend** wird gebaut (`build:`) statt geladen und ist die einzige
  Tür nach draußen neben Adminer. `depends_on: - backend` sorgt nur für
  die Startreihenfolge, warten im Sinn von „bereit" kann allein ein
  Healthcheck.
- **backend** hat bewusst keine `ports:`. Erreichbar ist es trotzdem,
  über den Servicenamen `backend` im Projekt-Netz. Genau dorthin leitet
  das Frontend `/api/`-Anfragen und dorthin funken die Module.
- **db** trägt zwei Volume-Einträge: das benannte Volume für die Daten
  (überlebt `down`) und den Bind Mount für das Init-Skript (läuft nur
  beim ersten Start eines frischen Volumes). Der Healthcheck macht aus
  „Container gestartet" ein „Datenbank bereit", erst damit ist
  `condition: service_healthy` beim Backend möglich.
- **Die sechs Module** sind sechsmal dasselbe Image mit anderem
  `MODUL_NAME`. Ein Bauplan, sechs Umgebungen: der Kern der
  Umgebungsvariablen-Lektion von Montag.
- **`${...}`-Platzhalter** kommen aus der `.env` daneben. Eine Stelle
  für alle Werte, kein Passwort in der Compose-Datei.

## Auflösungen der Vertiefungen

**Vertiefung 1, die volle Station mit der Störung:** `docker compose logs andockschleuse`
zeigt
`Bodenkontrolle nicht erreichbar unter http://backend-api:3000 (ENOTFOUND)`.
Es gibt keinen Service `backend-api`, der Hostname ist im Projekt-Netz
unbekannt. `BACKEND_ADRESSE` auf `http://backend:3000` korrigieren oder
die Zeile löschen, der Standard im Image passt.

**Vertiefung 2, der Live-Ausfall:** Nach `docker compose stop energie`
bleibt die letzte Meldung aus, nach acht Sekunden setzt das Backend das
Modul auf offline und schreibt den Logbuch-Eintrag. `start` bringt den
online-Eintrag. Das Muster heißt Heartbeat-Überwachung.

**Vertiefung 3, der Backend-Tausch:** In der `compose.yaml` wird aus
`build: ./backend-node` die Zeile `build: ./backend-fastapi`, dann
`docker compose up -d --build backend`. Die Schnittstelle (`/api/...`)
ist identisch, deshalb merken Frontend und Module nichts. Nur die
Backend-Karte zeigt die neue Implementierung.
