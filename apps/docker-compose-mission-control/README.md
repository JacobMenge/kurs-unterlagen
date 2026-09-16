# Mission Control – Aurora Station

Diese Beispiel-Anwendung gehört zum Praxis-Block **Docker Praxis: Mission
Control** im Docker-Kurs. Sie ist bewusst minimal und dient nur als
**Übungsobjekt für Docker Compose**.

> Ihr müsst den Code **nicht ändern** und **nicht im Detail verstehen**.
> Fokus der Aufgabe ist Compose: services, build, .env, Volumes,
> depends_on, healthchecks.

## Inhalt

```text
docker-compose-mission-control/
├── frontend/           # Bodenkontrolle: Stationsansicht + Logbuch (Nginx)
│   ├── index.html
│   ├── style.css
│   ├── app.js
│   ├── nginx.conf      # leitet /api/ an den Backend-Service weiter
│   └── Dockerfile
├── backend-node/       # Node.js/Express, das Standard-Backend
│   ├── server.js
│   ├── package.json
│   └── Dockerfile
├── backend-fastapi/    # Vertiefung: FastAPI mit identischen Endpunkten
│   ├── main.py
│   ├── requirements.txt
│   └── Dockerfile
├── modul/              # EIN Image für ALLE Stationsmodule
│   ├── modul.js        # meldet sich alle 3 Sekunden beim Backend
│   └── Dockerfile
├── db/
│   └── init.sql        # legt die Tabelle logbuch an
├── .env.example
└── README.md
```

Eine `compose.yaml` ist bewusst **nicht** dabei. Die schreibt ihr selbst
in der Übung.

## Architektur

```text
Browser ──:8080──► frontend (nginx) ──/api/*──► backend:3000 ──► db (postgres)
Browser ──:8081──► adminer ─────────────────────────────────────► db
                                                                   │
lebenserhaltung ─┐                                                 ▼
energie ─────────┤                                        Volume: aurora-data
kommunikation ───┼─── POST /api/heartbeat ──► backend
forschungslabor ─┤        (alle 3 Sekunden)
hydroponik ──────┤
andockschleuse ──┘
```

Wichtig:

- Das Frontend (Nginx) leitet alle `/api/*`-Anfragen an den Backend-Service
  weiter. Der Hostname `backend` ist der Service-Name aus eurer `compose.yaml`.
- Jedes Stationsmodul ist ein eigener Container **aus demselben Image**
  (`modul/`). Welches Modul es ist, entscheidet die Umgebungsvariable
  `MODUL_NAME`. Die Station kennt sechs Stellplätze: Lebenserhaltung,
  Energie, Kommunikation, Forschungslabor, Hydroponik, Andockschleuse.
- Bleibt die Meldung eines Moduls 8 Sekunden aus, gilt es als offline.
  Jeden Wechsel (online/offline) schreibt das Backend in die Tabelle
  `logbuch` der Datenbank.
- Adminer und Backend erreichen die Datenbank über den Service-Namen `db`.
- Externe Ports (was ihr im Browser aufruft): `8080` (Frontend) und
  `8081` (Adminer). Backend, Datenbank und Module werden **nicht** nach
  außen veröffentlicht.

## API-Endpunkte

| Methode | Pfad             | Zweck                                    |
|---------|------------------|------------------------------------------|
| GET     | `/api/health`    | Backend- und DB-Status                    |
| POST    | `/api/heartbeat` | Meldung eines Stationsmoduls              |
| GET     | `/api/station`   | Stationszustand: Module + Logbuch         |

Body für `POST /api/heartbeat`:

```json
{ "name": "Energie" }
```

## Umgebungsvariablen

Das Backend liest:

| Variable     | Beispiel    | Zweck                         |
|--------------|-------------|-------------------------------|
| `PORT`       | `3000`      | Port im Container             |
| `PGHOST`     | `db`        | Hostname der DB (Service-Name)|
| `PGPORT`     | `5432`      | Port der DB                   |
| `PGUSER`     | `aurora`    | DB-Benutzer                   |
| `PGPASSWORD` | `aurorapass`| DB-Passwort                   |
| `PGDATABASE` | `auroradb`  | DB-Name                       |

Ein Stationsmodul liest:

| Variable          | Beispiel              | Zweck                            |
|-------------------|-----------------------|----------------------------------|
| `MODUL_NAME`      | `Energie`             | Name des Moduls (Pflicht)        |
| `BACKEND_ADRESSE` | `http://backend:3000` | Ziel der Meldungen (das ist der Standard) |

Das Postgres-Image liest:

| Variable             | Beispiel     |
|----------------------|--------------|
| `POSTGRES_USER`      | `aurora`     |
| `POSTGRES_PASSWORD`  | `aurorapass` |
| `POSTGRES_DB`        | `auroradb`   |

Tipp: nutzt eine `.env` (siehe `.env.example`).

## Musterlösung

Die vollständige Musterlösung steht in den Kursunterlagen im Bereich
Mission Control. **Erst die Funkhilfe der Missionen nutzen, dann die
Musterlösung.**
