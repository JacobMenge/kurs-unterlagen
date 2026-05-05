# Mission Control – Aurora Station

Diese Beispiel-Anwendung gehört zum Praxis-Block **Docker Compose – Mission Control**
im Docker-Kurs. Sie ist bewusst minimal und dient nur als **Übungsobjekt für
Docker Compose**.

> Ihr müsst den Code **nicht ändern** und **nicht im Detail verstehen**.
> Fokus der Aufgabe ist Compose: services, .env, Volumes, depends_on, healthchecks.

## Inhalt

```text
docker-compose-mission-control/
├── frontend/          # statisches HTML/CSS/JS, läuft hinter Nginx
│   ├── index.html
│   ├── style.css
│   ├── app.js
│   ├── nginx.conf      # leitet /api/ an den Backend-Service weiter
│   └── Dockerfile
├── backend-node/       # Node.js/Express – Standard-Backend
│   ├── server.js
│   ├── package.json
│   └── Dockerfile
├── backend-fastapi/    # Bonus: FastAPI mit identischen Endpunkten
│   ├── main.py
│   ├── requirements.txt
│   └── Dockerfile
├── db/
│   └── init.sql        # legt die Tabelle modules an + Seed-Daten
├── .env.example
└── README.md
```

Eine `compose.yaml` ist bewusst **nicht** dabei – die schreibt ihr selbst
in der Übung.

## Architektur

```text
Browser ──:8080──► frontend (nginx) ──/api/*──► backend:3000 ──► db (postgres)
Browser ──:8081──► adminer ─────────────────────────────────────────► db
                                                                       │
                                                                       ▼
                                                              Volume: aurora-data
```

Wichtig:

- Frontend (Nginx) **proxypased** alle `/api/*`-Anfragen an den Backend-Service.
  Der Hostname `backend` ist der Service-Name aus eurer `compose.yaml`.
- Adminer und Backend erreichen die Datenbank über den Service-Namen `db`.
- Externe Ports (was ihr im Browser aufruft): `8080` (Frontend) und `8081` (Adminer).
- Backend und DB werden **nicht** nach außen veröffentlicht.

## API-Endpunkte

| Methode | Pfad                  | Zweck                              |
|---------|-----------------------|------------------------------------|
| GET     | `/api/health`         | Backend + DB-Status                |
| GET     | `/api/modules`        | Alle Module                        |
| POST    | `/api/modules`        | Neues Modul anlegen                |
| PATCH   | `/api/modules/:id`    | Status eines Moduls ändern         |
| DELETE  | `/api/modules/:id`    | Modul löschen                      |

Body für `POST`:

```json
{ "name": "Solar Array B", "status": "online" }
```

Erlaubte `status`-Werte: `online`, `offline`, `critical`, `maintenance`.

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

Die Postgres-Image liest:

| Variable             | Beispiel     |
|----------------------|--------------|
| `POSTGRES_USER`      | `aurora`     |
| `POSTGRES_PASSWORD`  | `aurorapass` |
| `POSTGRES_DB`        | `auroradb`   |

Tipp: nutzt eine `.env` (siehe `.env.example`).

## Lösung

Eine vollständige Schritt-für-Schritt-Lösung steht in den MkDocs-Unterlagen
(`docs/docker-compose-mission-control/07-loesung.md`). **Erst alleine versuchen.**
