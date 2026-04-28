---
title: "Aufgabenübersicht"
description: "Die 10 Aufgaben des Docker Escape Rooms – plus Bonus, Checkliste, Regeln."
---

# Docker Escape Room – Aufgabenübersicht

## Ziel

Ihr arbeitet heute in Gruppen als kleines DevOps-Team. Eure Aufgabe ist es, eine Mini-Plattform mit Docker zum Laufen zu bringen.

!!! warning "Heute kein Docker Compose"
    Ihr nutzt heute bewusst **kein** Docker Compose. Ihr startet alle Container manuell mit Docker-Befehlen.

    Damit wiederholt ihr alle Docker-Grundlagen: Images bauen, Container starten, Ports veröffentlichen, Container benennen, Umgebungs­variablen setzen, Netzwerke und Volumes verwenden, Logs lesen, Fehler analysieren.

---

## Wichtiger Hinweis

Das ist eine **Docker-Aufgabe**. Die Beispiel-App besteht zwar aus Node.js, Express und PostgreSQL – aber **ihr müsst diese Technologien nicht im Detail verstehen**. Ihr müsst keinen Code schreiben und kein SQL benutzen.

Konzentriert euch auf:

- Container starten
- Images bauen
- Ports verstehen
- Netzwerke nutzen
- Volumes verwenden
- Umgebungs­variablen setzen
- Logs lesen
- Fehler mit Docker-Befehlen finden

---

## Zeitrahmen

```text
90 Minuten Gruppenarbeit
```

Danach gehen wir die Aufgabe gemeinsam durch und besprechen Probleme, typische Fehler und nützliche Befehle.

---

## Gruppenrollen

Verteilt am Anfang die Rollen in eurer Gruppe:

| Rolle | Aufgabe |
|---|---|
| **Driver** | Teilt den Bildschirm und führt die Befehle aus |
| **Navigator** | Achtet auf Aufgabenstellung und Reihenfolge |
| **Debugger** | Prüft Logs, Netzwerke, Ports und Fehlermeldungen |
| **Dokumentator** | Notiert Befehle, Probleme und Lösungswege |

Bei kleineren Gruppen können Rollen kombiniert werden – aber **immer einer** als Dokumentator!

---

# Eure Aufgaben

## Aufgabe 1 – Projekt vorbereiten

Macht euch zuerst mit dem Projektordner vertraut. Der Code liegt unter:

```text
apps/docker-escape-room/
```

**Prüft:**

- Gibt es ein Dockerfile?
- Welche Laufzeit wird im Dockerfile verwendet?
- Welchen Port nutzt die App im Container?
- Welche Umgebungs­variablen braucht die App?
- Gibt es eine README-Datei?

**Docker-Fokus:** Projektstruktur erkennen, Dockerfile finden, Build-Kontext verstehen.

**Nicht Fokus:** JavaScript-Code verstehen, Express programmieren.

---

## Aufgabe 2 – Docker-Netzwerk erstellen

Erstellt ein eigenes Docker-Netzwerk für die Anwendung. Dieses Netzwerk soll später von **allen drei Containern** genutzt werden (API, DB, Adminer).

**Warum?**

> Container sollen sich untereinander über Container-Namen erreichen können. Das geht nur in einem **User-Defined-Bridge-Netzwerk** – das Default-Netzwerk hat kein DNS.

**Docker-Fokus:** eigenes Netzwerk erstellen, Netzwerke anzeigen, Netzwerk später für Container verwenden.

---

## Aufgabe 3 – Docker-Volume erstellen

Erstellt ein Docker-Volume für die Datenbank.

**Warum?**

> Die Datenbankdaten sollen erhalten bleiben, auch wenn der Datenbank-Container gelöscht oder neu erstellt wird. Ohne Volume sind alle Daten beim `docker rm` weg.

**Docker-Fokus:** Volume erstellen, später in Container einbinden, Persistenz verstehen.

---

## Aufgabe 4 – PostgreSQL-Datenbank starten

Startet einen PostgreSQL-Container.

Verwendet diese Werte:

| Einstellung | Wert |
|---|---|
| Containername | `quest-db` |
| Netzwerk | `quest-net` |
| Datenbank | `questdb` |
| Benutzer | `quest` |
| Passwort | `questpass` |
| Volume | `quest-pg-data` |
| PostgreSQL-Datenpfad im Container | `/var/lib/postgresql/data` |
| Image-Empfehlung | `postgres:16-alpine` |

**Prüft anschließend:**

- Läuft der Container? (`docker ps`)
- Gibt es Fehlermeldungen in den Logs? (`docker logs quest-db`)
- Ist der Container im richtigen Netzwerk? (`docker network inspect quest-net`)

**Docker-Fokus:** Container starten, Container benennen, Umgebungs­variablen setzen, Volume mounten, mit Netzwerk verbinden.

**Nicht Fokus:** SQL schreiben, PostgreSQL administrieren.

---

## Aufgabe 5 – API-Image bauen

Baut aus der Beispiel-Anwendung ein eigenes Docker-Image:

```text
container-quest-api:1.0
```

**Achtet darauf:**

- Ihr müsst euch im richtigen Ordner befinden (`apps/docker-escape-room/`).
- Das Dockerfile muss gefunden werden.
- Der Build soll ohne Fehler durchlaufen.

**Prüft danach:**

- Ist das Image vorhanden? (`docker images`)
- Wurde es erfolgreich gebaut? (Zeile mit `Successfully tagged`)

**Docker-Fokus:** Build-Kontext, Dockerfile verwenden, Image taggen, Build-Ausgabe lesen.

**Nicht Fokus:** Node.js lokal installieren, npm-Probleme außerhalb des Containers lösen, App-Code ändern.

---

## Aufgabe 6 – API-Container starten

Startet nun den API-Container. Die API braucht mehrere Informationen, um die Datenbank zu erreichen:

| Information | Wert |
|---|---|
| Containername | `quest-api` |
| Netzwerk | `quest-net` |
| Host-Port | `3000` |
| Container-Port | `3000` |
| `PGHOST` | `quest-db` |
| `PGPORT` | `5432` |
| `PGDATABASE` | `questdb` |
| `PGUSER` | `quest` |
| `PGPASSWORD` | `questpass` |

!!! warning "Achtung: localhost-Falle"
    Überlegt **genau**, ob die API die Datenbank über `localhost` erreichen kann. (Spoiler: nein. Lies in Aufgabe 6 sorgfältig, was als `PGHOST` steht.)

**Prüft anschließend:**

- Läuft der API-Container?
- Sind die Logs fehlerfrei? (`docker logs -f quest-api`)
- Ist die API erreichbar?
- Kann die API die Datenbank erreichen?

**Docker-Fokus:** eigenes Image starten, Port-Mapping, Env-Variablen, Container-Netzwerk, Logs lesen.

---

## Aufgabe 7 – API testen

Testet die wichtigsten Endpunkte der API.

!!! info "Kurz: was sind GET und POST?"
    Eine API spricht **HTTP** – das gleiche Protokoll, mit dem dein Browser eine Webseite lädt. Es gibt verschiedene HTTP-Methoden:

    - **GET** = „Daten abrufen, ohne etwas zu verändern". Ein normaler Browser-Aufruf ist immer GET.
    - **POST** = „Daten senden, Server soll etwas anlegen oder verarbeiten". Wird typischerweise mit einem **JSON-Body** kombiniert: `{"team": "Alpha", ...}`.

    `GET /api/entries` heißt also: „Hol mir die Liste der Einträge". `POST /api/entries` heißt: „Hier sind neue Daten, leg einen Eintrag an."

**Endpunkte:**

```text
GET  http://localhost:3000/
GET  http://localhost:3000/health
GET  http://localhost:3000/db-check
GET  http://localhost:3000/api/entries
POST http://localhost:3000/api/entries
GET  http://localhost:3000/api/scoreboard
```

**Tools:**

=== "Browser"
    Einfach `http://localhost:3000/health` aufrufen → JSON-Antwort.

=== "macOS / Linux (curl)"
    ```bash
    curl http://localhost:3000/health
    curl http://localhost:3000/db-check
    ```

=== "Windows PowerShell"
    ```powershell
    Invoke-RestMethod http://localhost:3000/health
    Invoke-RestMethod http://localhost:3000/db-check
    ```

**Beispieldaten für POST:**

```json
{
  "team": "Team Alpha",
  "category": "monster",
  "name": "Dockerdrache",
  "score": 25
}
```

POST mit curl:
```bash
curl -X POST http://localhost:3000/api/entries \
  -H "Content-Type: application/json" \
  -d '{"team":"Team Alpha","category":"monster","name":"Dockerdrache","score":25}'
```

POST mit PowerShell:
```powershell
Invoke-RestMethod `
  -Uri http://localhost:3000/api/entries `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"team":"Team Alpha","category":"monster","name":"Dockerdrache","score":25}'
```

**Tests:**

| Test | Erwartung |
|---|---|
| Startseite | API antwortet grundsätzlich |
| Healthcheck | API meldet, dass sie läuft |
| Datenbankcheck | API meldet erfolgreiche DB-Verbindung |
| Einträge anzeigen | API liefert Liste zurück |
| Eintrag erstellen | API speichert neue Daten |
| Scoreboard | API wertet gespeicherte Daten aus |

---

## Aufgabe 8 – Adminer starten

Startet zusätzlich einen Adminer-Container.

| Einstellung | Wert |
|---|---|
| Containername | `quest-adminer` |
| Netzwerk | `quest-net` |
| Host-Port | `8080` |
| Container-Port | `8080` |
| Image | `adminer:latest` |

Adminer soll im Browser erreichbar sein unter `http://localhost:8080`.

**Login-Daten in Adminer:**

| Feld | Wert |
|---|---|
| System | PostgreSQL |
| Server | `quest-db` |
| Benutzer | `quest` |
| Passwort | `questpass` |
| Datenbank | `questdb` |

!!! warning "Auch hier: nicht `localhost` als Server eintragen"
    Adminer läuft **im Container**. Aus Sicht des Adminer-Containers ist `localhost` der Adminer-Container selbst – dort gibt's keine Datenbank.

    Adminer findet die DB über den Container-Namen `quest-db`, weil beide im Netzwerk `quest-net` hängen und Docker-DNS sie dort über den Namen erreichbar macht.

    Es ist genau dieselbe Falle wie bei der API in Aufgabe 6.

**Prüft danach:**

- Ist Adminer im Browser erreichbar?
- Könnt ihr euch mit der Datenbank verbinden?
- Seht ihr die Tabelle `entries`?
- Seht ihr die Einträge, die ihr per API angelegt habt?

---

## Aufgabe 9 – Persistenz prüfen

Prüft, ob eure Daten **wirklich** erhalten bleiben.

**Vorgehen:**

1. Erstellt mindestens einen Eintrag über die API.
2. Prüft den Eintrag über Adminer oder `GET /api/entries`.
3. **Stoppt** den DB-Container (`docker stop quest-db`).
4. **Entfernt** ihn (`docker rm quest-db`).
5. **Startet** ihn erneut – mit demselben Volume!
6. Auch den API-Container neu starten (siehe Erklärung unten).
7. Prüft, ob der Eintrag noch vorhanden ist.

??? info "Warum muss die API neu gestartet werden?"
    Die API hält **Datenbank­verbindungen in einem Pool** (Connection Pool). Wenn die DB hinter ihr verschwindet und neu startet, sind diese alten Verbindungen tot – die API würde Fehler werfen, bis sie neue Verbindungen aufbaut.

    Ein einfacher `docker restart quest-api` baut alle Verbindungen frisch auf. In Produktion gibt es elegantere Lösungen (Auto-Reconnect, Healthchecks), aber für die Übung ist Restart der einfachste und ehrlichste Weg.

**Ziel:**

> Ihr könnt erklären, warum das Volume wichtig ist – und was passiert, wenn man es weglässt.

---

## Aufgabe 10 – Debugging dokumentieren

Dokumentiert während der Aufgabe **mindestens ein** Problem, das bei euch aufgetreten ist.

**Beispiele für typische Probleme:**

- Container startet nicht
- Containername ist schon vergeben
- API erreicht Datenbank nicht
- Port ist bereits belegt
- Daten verschwinden
- falsches Netzwerk
- falsche Umgebungs­variable
- Image wurde geändert, Container nicht neu erstellt

**Notiert:**

| Frage | Antwort |
|---|---|
| Was war das Problem? | |
| Welche Fehlermeldung gab es? | |
| Welcher Docker-Befehl hat bei der Analyse geholfen? | |
| Was war die Ursache? | |
| Wie habt ihr es gelöst? | |

---

# Was ihr am Ende präsentieren sollt

Jede Gruppe zeigt am Ende kurz:

1. **Laufende Container** (`docker ps` zeigt alle drei)
2. **Docker-Netzwerk** (`docker network inspect quest-net` zeigt alle drei drinnen)
3. **Docker-Volume** (`docker volume ls` zeigt `quest-pg-data`)
4. **API-Test** (mind. `/health`, `/db-check`, `/api/entries`)
5. **Adminer-Login** und Tabelleninhalt im Browser
6. **Reflexion** – siehe [Abgabe & Reflexion](06-abgabe-und-reflexion.md)

---

# Regeln

## ✅ Erlaubt

- Docker-Dokumentation
- bisherige Kursunterlagen
- eigene Notizen
- Terminal, Browser, Postman, curl
- Zusammenarbeit in der Gruppe

## ❌ Nicht erlaubt

```text
docker compose
docker-compose
compose.yaml
docker-compose.yml
```

Heute manuell. **Compose ist nächste Einheit.**

---

# Hilfreiche Docker-Befehle

```bash
docker ps
docker ps -a
docker images
docker build
docker run
docker logs
docker exec
docker inspect
docker stop
docker rm
docker network ls
docker network inspect
docker volume ls
docker volume inspect
```

Die konkreten Befehle für diese Aufgabe müsst ihr selbst zusammensetzen. Falls ihr feststeckt: → [Hilfekarten](05-hilfekarten.md).

---

# Checkliste

| Kriterium | Erfüllt? |
|---|---|
| Eigenes Docker-Netzwerk erstellt | ☐ |
| Docker-Volume für PostgreSQL erstellt | ☐ |
| PostgreSQL-Container läuft | ☐ |
| PostgreSQL nutzt das Volume | ☐ |
| API-Image wurde gebaut | ☐ |
| API-Container läuft | ☐ |
| API ist über Browser/Tool erreichbar | ☐ |
| API kann die Datenbank erreichen (`/db-check` ok) | ☐ |
| Daten können über die API gespeichert werden | ☐ |
| Adminer läuft und verbindet sich mit DB | ☐ |
| Gespeicherte Daten in Adminer sichtbar | ☐ |
| Daten bleiben nach Neustart erhalten | ☐ |
| Mindestens ein Fehler wurde dokumentiert | ☐ |
| Gruppe kann erklären, warum Compose später hilft | ☐ |

---

# Bonusaufgaben

Wenn ihr früher fertig seid:

## Bonus 1 – Anderer Host-Port

Startet die API so, dass sie auf eurem Rechner über einen **anderen Port** erreichbar ist (z.B. `8080:3000`). Erklärt danach den Unterschied zwischen Host-Port und Container-Port.

## Bonus 2 – Container untersuchen

Findet heraus mit `docker inspect` und `docker network inspect quest-net`:

- Welche IP-Adresse hat die API im Docker-Netzwerk?
- Welche IP-Adresse hat die Datenbank?
- Welche Umgebungs­variablen wurden im API-Container gesetzt?
- Welche Mounts nutzt der Datenbank-Container?

## Bonus 3 – Mehrere Einträge + Scoreboard

Erstellt mehrere Einträge für **euer Team** und seht euch das Scoreboard an: `GET /api/scoreboard`. Welches Team führt?

## Bonus 4 – Mini-Erklärung für Compose

Schreibt in **drei Sätzen** auf:

> Warum wäre diese Aufgabe mit Docker Compose einfacher?

Aber: Keine Compose-Datei schreiben.

---

## Wenn ihr nicht weiterkommt

→ [Hilfekarten](05-hilfekarten.md) (10 abgestufte Hinweise)

→ Trainer:in fragen
