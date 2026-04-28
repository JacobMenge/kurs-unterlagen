# Container Quest API

Diese kleine Anwendung ist Teil des **Docker Escape Rooms** – einer Praxis-Übung für den Docker-Kurs.

Die App ist bewusst minimal und dient nur als **Testobjekt für Docker**. Sie ist eine **Blackbox** für die Teilnehmenden: niemand muss am Code etwas ändern oder verstehen, wie Express, Node.js oder PostgreSQL intern arbeiten.

## Wichtig für Teilnehmende

Ihr müsst:

- den Code **nicht** ändern
- **nicht** im Detail verstehen, wie Express oder PostgreSQL funktionieren
- **kein** SQL schreiben
- **keine** App entwickeln

Für die Aufgabe ist nur wichtig:

- Die API läuft in einem eigenen Container.
- Die Datenbank läuft in einem anderen Container.
- Die API braucht **Umgebungsvariablen**, um die Datenbank zu finden.
- API und Datenbank müssen im **gleichen Docker-Netzwerk** sein.
- Die Datenbank braucht ein **Docker-Volume**, damit Daten erhalten bleiben.

## Endpunkte

| Methode | Pfad | Zweck |
|---|---|---|
| GET | `/` | Übersicht |
| GET | `/health` | Prüft, ob die API läuft |
| GET | `/db-check` | Prüft die Datenbankverbindung |
| GET | `/api/entries` | Zeigt gespeicherte Einträge |
| POST | `/api/entries` | Erstellt einen Eintrag |
| GET | `/api/scoreboard` | Zeigt Punkte pro Team |

## Wichtige Umgebungsvariablen

| Variable | Beispiel | Bedeutung |
|---|---|---|
| `PORT` | `3000` | Port der API im Container |
| `PGHOST` | `quest-db` | Hostname der Datenbank aus Sicht der API |
| `PGPORT` | `5432` | PostgreSQL-Port |
| `PGUSER` | `quest` | Datenbankbenutzer |
| `PGPASSWORD` | `questpass` | Datenbankpasswort |
| `PGDATABASE` | `questdb` | Datenbankname |
| `APP_NAME` | `Container Quest API` | Anzeigename der API |

## Image bauen

```bash
docker build -t container-quest-api:1.0 .
```

## Lösung

Eine vollständige Lösung steht **nicht** hier – sondern in der Trainer-Lösung der MkDocs-Unterlagen (`docs/docker-escape-room/07-trainer-loesung.md`). Erst alleine versuchen!
