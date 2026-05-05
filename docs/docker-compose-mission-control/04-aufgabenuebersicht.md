---
title: "Aufgabenübersicht"
description: "Die 7 Missionen für Mission Control – plus Bonus, Checkliste, Regeln."
---

# Mission Control – Aufgabenübersicht

## Ziel

Ihr arbeitet heute in Gruppen als kleines DevOps-Team. Eure Aufgabe ist es, das Mission-Control-Dashboard der Aurora Station mit **Docker Compose** wieder online zu bringen.

!!! warning "Heute nur Compose"
    Heute baut ihr ausschließlich mit Compose. **Keine** einzelnen `docker run`-Befehle für die Services. Wenn ihr in Versuchung kommt: das war der Escape Room. Heute geht es um die deklarative Variante.

---

## Wichtiger Hinweis

Das ist eine **Compose-Aufgabe**. Die Beispiel-App besteht aus Nginx, Node.js, Express, PostgreSQL und (als Bonus) FastAPI – aber **ihr müsst diese Technologien nicht im Detail verstehen**. Ihr müsst keinen Anwendungscode schreiben und kein SQL benutzen.

Konzentriert euch auf:

- Services in einer `compose.yaml` deklarieren
- `image:` vs. `build:`
- Externe Ports veröffentlichen vs. nur intern halten
- Service-Namen als Hostnames nutzen
- Volumes (benannt + Bind-Mount für Init-SQL)
- `.env`-Datei und `${VARIABLEN}` einsetzen
- `depends_on` mit `condition: service_healthy`
- Logs lesen und gezielt debuggen
- Einen Backend-Service austauschen (Bonus)

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
| **Driver** | Teilt den Bildschirm und tippt die `compose.yaml` |
| **Navigator** | Achtet auf Aufgabenstellung und Reihenfolge der Missionen |
| **Debugger** | Liest Logs, prüft `docker compose ps`, `config`, `exec` |
| **Dokumentator** | Notiert Befehle, Probleme und Lösungswege |

Bei kleineren Gruppen können Rollen kombiniert werden – aber **immer einer** als Dokumentator!

---

# Eure Missionen

## Mission 0 – Briefing & Projekt vorbereiten

Macht euch zuerst mit dem Projektordner vertraut. Der Code liegt im Repository unter:

→ **[github.com/JacobMenge/kurs-unterlagen/tree/main/apps/docker-compose-mission-control](https://github.com/JacobMenge/kurs-unterlagen/tree/main/apps/docker-compose-mission-control)**

Wenn ihr das Repo schon lokal geklont habt, findet ihr den Ordner direkt unter `apps/docker-compose-mission-control/` im Projektverzeichnis. Andernfalls vorher klonen:

```bash
git clone https://github.com/JacobMenge/kurs-unterlagen.git
cd kurs-unterlagen/apps/docker-compose-mission-control
```

**Prüft:**

- Welche Unterordner gibt es?
- Wo sind die **Dockerfiles**?
- Wo liegt das **Init-Skript** für die Datenbank?
- Welche Datei ist die **Vorlage** für die `.env`?
- Welche **API-Endpunkte** stellt das Backend laut `README.md` bereit?

Legt jetzt eine **leere Datei** `compose.yaml` in `apps/docker-compose-mission-control/` an. Am einfachsten direkt im Editor (VS Code, Notepad++ …) anlegen und speichern. Per Terminal geht es auch:

=== "macOS / Linux / Git Bash"
    ```bash
    cd apps/docker-compose-mission-control
    touch compose.yaml
    ```

=== "Windows PowerShell"
    ```powershell
    cd apps/docker-compose-mission-control
    New-Item -ItemType File compose.yaml
    ```

=== "Windows CMD"
    ```cmd
    cd apps\docker-compose-mission-control
    type nul > compose.yaml
    ```

Dort baut ihr Mission für Mission auf.

**Compose-Fokus:** Projektstruktur erkennen, Build-Kontexte verstehen, Init-Strategie der DB erkennen.

---

## Mission 1 – Frontend zuerst: das Kontrollzentrum hochfahren

Wir fangen **mit dem Frontend** an. Das ist die UI eures Mission-Control-Dashboards. Sie funktioniert auch **ganz ohne** Backend und Datenbank – sie zeigt einfach, dass die anderen Services noch fehlen.

> **Warum frontend zuerst?** Weil ihr so von der ersten Minute an einen sichtbaren Erfolg habt – und weil ihr dann live mitverfolgt, wie nach und nach jede Lampe grün wird, sobald ihr in den nächsten Missionen weitere Services hinzufügt. Kein einziges Browser-Refresh nötig: das Frontend pollt alle 2 Sekunden selbständig.

**Anforderungen:**

| Einstellung | Wert |
|---|---|
| Service-Name | `frontend` |
| Build-Kontext | `./frontend` |
| Externer Port | `8080:80` |

Das Nginx im Frontend ist bereits so konfiguriert, dass es alle `/api/*`-Anfragen an `http://backend:3000/api/*` weitergibt (siehe `frontend/nginx.conf`). Das funktioniert dann automatisch, sobald der Service `backend` in eurer `compose.yaml` existiert.

**Startet den Stack:**

```bash
docker compose up -d --build
```

**Prüft anschließend:**

- `docker compose ps` zeigt `frontend` als `Up`?
- Im Browser: <http://localhost:8080>
- Seht ihr das Mission-Control-Dashboard mit dem Sternenhimmel?
- Wie viele der vier Lampen leuchten grün?

!!! tip "Erwartung am Ende von Mission 1"
    - 🟢 Frontend (das seht ihr ja, also läuft es)
    - 🔴 Backend (gibt es noch nicht – Lampe ist rot)
    - 🔴 Datenbank (das Backend könnte sie zwar erreichen, aber das Backend gibt's noch nicht)
    - 🔴 Adminer (gibt es noch nicht)

    Oben rechts steht „warte auf backend …". Das ist **gewollt** – im Laufe der Aufgabe werden alle Lampen grün.

**Compose-Fokus:** allererster Service, `build:`, `ports:` mit Port-Mapping. Kein `depends_on` – das Frontend läuft autark.

---

## Mission 2 – Datenbank starten

Fügt den Service **`db`** hinzu.

**Anforderungen:**

| Einstellung | Wert |
|---|---|
| Service-Name | `db` |
| Image | `postgres:16-alpine` |
| `POSTGRES_USER` | `aurora` |
| `POSTGRES_PASSWORD` | `aurorapass` |
| `POSTGRES_DB` | `auroradb` |
| Volume | `aurora-data` → `/var/lib/postgresql/data` |
| Init-SQL (Bind-Mount, **read-only**) | `./db/init.sql` → `/docker-entrypoint-initdb.d/init.sql` |
| Externer Port | **kein** (DB nur intern) |

Vergesst nicht, das Volume `aurora-data` auch im Top-Level-Block `volumes:` zu deklarieren.

**Startet den Stack neu:**

```bash
docker compose up -d
```

**Prüft anschließend:**

- `docker compose ps` zeigt `db` als `Up`?
- `docker compose logs db` enthält die Zeile **„database system is ready to accept connections"**?
- Sind die sechs Beispiel-Module aus `init.sql` schon in der Tabelle? Test:

    ```bash
    docker compose exec db psql -U aurora -d auroradb -c "SELECT name, status FROM modules"
    ```

    Erwartet: eine Tabelle mit sechs Zeilen (Life Support, Power Grid, …).

!!! tip "Im Frontend ändert sich noch nichts"
    Die DB-Lampe bleibt rot, obwohl die DB läuft. Das ist okay: das Frontend kann die DB nur **über das Backend** prüfen – und das Backend kommt erst in Mission 3. Die DB-Lampe wird also gleichzeitig mit der Backend-Lampe grün.

**Compose-Fokus:** zweiter Service, `image:`, `environment:`, `volumes:` (benannt + Bind-Mount), Top-Level-`volumes:`-Block.

---

## Mission 3 – Backend dranhängen und mit der DB verbinden

Fügt den Service **`backend`** hinzu. Das ist der Moment, in dem zwei Lampen gleichzeitig grün werden.

**Anforderungen:**

| Einstellung | Wert |
|---|---|
| Service-Name | `backend` |
| Build-Kontext | `./backend-node` |
| `PORT` | `3000` |
| `PGHOST` | `db` |
| `PGPORT` | `5432` |
| `PGUSER` | `aurora` |
| `PGPASSWORD` | `aurorapass` |
| `PGDATABASE` | `auroradb` |
| Externer Port | **kein** |
| `depends_on` | `db` |

!!! warning "Erinnerung: keine `localhost`-Falle"
    `PGHOST` ist **nicht** `localhost`. Aus Sicht des Backend-Containers wäre `localhost` der Backend-Container selbst. Schreibt den **Service-Namen** der Datenbank rein – also `db`.

Stack neu starten und Image bauen:

```bash
docker compose up -d --build
```

**Schaut jetzt im Frontend zu:**

- Innerhalb von 2–3 Sekunden poppen oben rechts Toasts auf:
    - **„Backend ist online (node-express)."**
    - **„Datenbank ist verbunden."**
- Die Backend- und DB-Lampen werden grün.
- Die sechs Beispielmodule erscheinen automatisch im Modul-Grid.

**Prüft zusätzlich:**

- `docker compose ps` zeigt `backend` als `Up`?
- `docker compose logs backend` zeigt „Database connection established." und „Listening on port 3000"?
- Funktioniert „Modul anlegen"?
- Funktioniert „Status ändern" (Dropdown auf einer Karte)?
- Funktioniert „Entfernen"?

Falls das Backend zunächst nicht startet: das ist normal beim ersten Start, weil die DB-Initialisierung etwas dauert. Die Retry-Logik im Backend fängt das ab. **Wenn nach 30 Sekunden immer noch nichts geht:** Logs lesen, in den Hilfekarten 1–4 nachschauen.

**Compose-Fokus:** `build:` mit eigenem Dockerfile, Service-Namen als DNS-Hostname, einfaches `depends_on`.

---

## Mission 4 – Adminer dranhängen und Daten kontrollieren

Fügt den vierten Service **`adminer`** hinzu.

**Anforderungen:**

| Einstellung | Wert |
|---|---|
| Service-Name | `adminer` |
| Image | `adminer:latest` |
| Externer Port | `8081:8080` |

Stack neu starten:

```bash
docker compose up -d
```

**Im Frontend:** binnen Sekunden ploppt der Toast **„Adminer ist online (Port 8081)."** auf, die Adminer-Lampe wird grün. Damit sind alle vier Lampen oben grün.

**Adminer öffnen:** <http://localhost:8081>

**Login-Daten:**

| Feld | Wert |
|---|---|
| System | PostgreSQL |
| Server | `db` |
| Benutzer | `aurora` |
| Passwort | `aurorapass` |
| Datenbank | `auroradb` |

!!! warning "Server = `db`, nicht `localhost`"
    Adminer läuft im Container. `localhost` wäre der Adminer-Container selbst – dort gibt's keine Datenbank. Adminer findet die DB über den Service-Namen `db`.

**Prüft danach:**

- Tabelle `modules` ist sichtbar
- Anlagen, die ihr im Frontend gemacht habt, tauchen hier auf
- Beim Status-Ändern im Frontend ändert sich auch der Wert in Adminer (nach „Reload" der Tabelle)

---

## Mission 5 – Konfiguration in eine `.env` auslagern

Aktuell stehen Username, Passwort und DB-Name **hart kodiert** in eurer `compose.yaml`. Das ist okay zum Lernen, aber im echten Leben gehören sie in eine `.env`-Datei.

**Vorgehen:**

1. Kopiert `.env.example` nach `.env` (im selben Ordner wie eure `compose.yaml`).
2. Ersetzt in der `compose.yaml` die hart kodierten Werte durch `${VARIABLE}`-Platzhalter:

    - `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` (im DB-Service)
    - `PGUSER`, `PGPASSWORD`, `PGDATABASE` (im Backend-Service)
    - Optional auch der Frontend-Port

3. Prüft mit:

    ```bash
    docker compose config
    ```

    Stehen die Werte korrekt aufgelöst da? Wenn ja: weiter.

4. Stack neu starten:

    ```bash
    docker compose up -d
    ```

!!! tip "Profi-Tipp: zwei Quellen für die DB-Variablen"
    Das DB-Image braucht `POSTGRES_*`. Das Backend-Image braucht `PG*`. **Beide** Servies können sich aus den **gleichen** `.env`-Variablen bedienen – ihr müsst sie nur in der jeweiligen `environment:`-Sektion entsprechend abbilden:

    ```yaml
    db:
      environment:
        POSTGRES_USER: ${POSTGRES_USER}

    backend:
      environment:
        PGUSER: ${POSTGRES_USER}
    ```

**Compose-Fokus:** Trennung von Konfiguration und Definition, `${VAR}`-Substitution, `docker compose config` als Diagnose.

---

## Mission 6 – Healthcheck + `condition: service_healthy`

Im Moment startet das Backend so früh, dass es manchmal kurz auf "DB nicht bereit" läuft. Das fängt die Retry-Logik im Backend ab – aber sauberer ist es, Compose **selbst** warten zu lassen.

**Aufgabe:**

1. Fügt im DB-Service einen `healthcheck:` ein, der `pg_isready` benutzt:

    ```yaml
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER} -d $${POSTGRES_DB}"]
      interval: 5s
      timeout: 3s
      retries: 10
      start_period: 10s
    ```

    !!! tip "Warum `$${VAR}`?"
        Der **doppelte** `$$` schützt die Variable vor Compose. Compose würde `${POSTGRES_USER}` sonst beim Parsen der YAML ersetzen – das wollen wir hier nicht. Wir wollen, dass der String **so** in den Container geht und Bash dort die Container-eigene `$POSTGRES_USER`-Variable einsetzt.

2. Im `backend`-Service: ändert `depends_on` von der Liste auf das Map-Format mit `condition: service_healthy`:

    ```yaml
    depends_on:
      db:
        condition: service_healthy
    ```

3. Stack komplett neu hochfahren:

    ```bash
    docker compose down
    docker compose up -d
    ```

**Prüft:**

- `docker compose ps` zeigt `db` mit Status **`healthy`**?
- Das Backend startet **erst nach** dem `healthy`-Status der DB?
- Im Backend-Log gibt es **keine** „Database not ready"-Versuche mehr?

**Compose-Fokus:** Healthchecks, sauberes Warten, Map- vs. Listen-Form von `depends_on`.

---

## Mission 7 – Persistenz und sauberes Aufräumen

Der finale Test: bleiben eure Daten beim Restart erhalten?

**Vorgehen:**

1. Legt im Frontend ein paar **eigene Module** an, mit erkennbaren Namen (z.B. „Solar Array B", „Crew Quarters C").
2. **Stoppt den Stack:**

    ```bash
    docker compose down
    ```

    Das beendet alle Container und entfernt das Compose-Netzwerk – aber **nicht** das benannte Volume.

3. **Startet den Stack neu:**

    ```bash
    docker compose up -d
    ```

4. Im Frontend zuschauen: kurze rote Lampen, dann gehen sie wieder grün. **Sind eure eigenen Module noch da?** Sie sollten es sein – die Daten leben im Volume `aurora-data`, das von `down` nicht angefasst wird.

5. Jetzt der harte Test:

    !!! danger "Alles weg – Volume-Test"
        ```bash
        docker compose down -v
        docker compose up -d
        ```

        Beim ersten Mal werden die Daten **gelöscht** (durch `-v`), beim zweiten Mal startet eine frische DB. Eure eigenen Module sind weg, dafür sind die sechs Init-Module wieder da.

**Compose-Fokus:** `down` vs. `down -v`, Persistenz, Init-SQL-Verhalten.

---

# Bonus-Missionen

Wenn ihr früher fertig seid:

## Bonus A – Backend austauschen (Node → FastAPI)

Im Repo liegt ein zweites Backend mit identischer API:

```text
backend-fastapi/
├── main.py
├── requirements.txt
└── Dockerfile
```

**Aufgabe:**

- Tauscht in eurer `compose.yaml` den `build:`-Pfad des Backend-Services von `./backend-node` auf `./backend-fastapi`.
- Stack neu starten:

    ```bash
    docker compose up -d --build
    ```

    !!! info "Erster FastAPI-Build dauert länger"
        Das FastAPI-Image installiert beim ersten Build seine Python-Pakete (FastAPI, uvicorn, psycopg). Rechnet mit **1–3 Minuten** Build-Zeit beim allerersten Mal.

- Lasst das Frontend offen und schaut zu, was passiert:
    - Während des Rebuilds wird die Backend-Lampe **kurz rot**, ein Toast meldet **„Backend nicht mehr erreichbar."**
    - Sobald der neue Container läuft: Toast **„Backend gewechselt: node-express → python-fastapi"**.
    - Backend-Lampe ist wieder grün, im Status-Panel steht jetzt `python-fastapi` statt `node-express`.

> Ergebnis: das Frontend hat sich **nicht** geändert, die Datenbank auch nicht (gleiche Tabelle, gleiche Module). Das Backend ist eine andere Sprache, eine andere Library, ein anderes Image – aber die Schnittstelle bleibt gleich. Das ist die Stärke von Container-basierten Systemen.

**Zurück zu Node:** einfach den `build:`-Pfad wieder auf `./backend-node` setzen, `docker compose up -d --build` – Lampen blinken wieder kurz, dann zeigt das Frontend wieder `node-express`.

**Profi-Variante** (optional):

Statt direkt in der `compose.yaml` zu ändern, legt eine zweite Datei `compose.fastapi.yaml` an, die nur den Backend-Block überschreibt:

```yaml
services:
  backend:
    build: ./backend-fastapi
```

Und startet mit:

```bash
docker compose -f compose.yaml -f compose.fastapi.yaml up -d --build
```

So habt ihr ein "Override" und müsst die Hauptdatei nicht anfassen.

---

## Bonus B – Stack untersuchen mit Compose-Befehlen

Findet heraus:

- Welche IP-Adressen haben eure Services im Compose-Netzwerk?
    - `docker compose exec backend getent hosts db`
- Wie heißt das benannte Volume **wirklich**?
    - `docker volume ls`  (sucht nach Einträgen mit `aurora-data`)
- Welche Umgebungsvariablen sind im Backend-Container gesetzt?
    - `docker compose exec backend env`
- Was zeigt `docker compose top` an?
- Welche Netzwerke hat Compose angelegt?
    - `docker network ls`

---

## Bonus C – Mini-Erklärung für die Schichtleitung

Schreibt in **drei Sätzen** auf:

> Was hätte uns 90 Minuten Compose im Vergleich zu rein manuellem `docker run` *konkret* gebracht – und welche Stellen wären ohne `.env` und Healthcheck noch fragil gewesen?

---

## Wenn ihr nicht weiterkommt

→ [Hilfekarten](05-hilfekarten.md) (9 abgestufte Hinweise)

→ Im Plenum nachfragen oder die [Lösung](07-loesung.md) konsultieren – aber bitte erst nach ehrlichem eigenen Versuch.

---

# Was ihr am Ende präsentieren sollt

Jede Gruppe zeigt am Ende kurz:

1. **Laufende Services** (`docker compose ps` zeigt alle vier mit Status `Up` und `db` als `healthy`)
2. **Volume** (`docker volume ls` zeigt das `aurora-data`-Volume)
3. **Frontend** im Browser, mit den Init-Modulen + mindestens einem selbst angelegten
4. **Adminer-Login** und Tabelle `modules`
5. **Persistenz-Test** kurz beschreiben (`down` → `up` → Daten noch da)
6. **Bonus** A oder C, falls geschafft

---

# Regeln

## ✅ Erlaubt

- Compose-Dokumentation
- bisherige Kursunterlagen, insbesondere [Compose-Block](../docker-compose/index.md)
- eigene Notizen, das [Cheatsheet](../cheatsheets/compose.md)
- Terminal, Browser
- Zusammenarbeit in der Gruppe
- **Google und KI-Tools** (ChatGPT, Claude, …) – aber nur für **einzelne Fragen, an denen ihr feststeckt**. Nicht „löst mir die ganze Aufgabe": dann lernt ihr nichts.

## ❌ Nicht erlaubt

- die `compose.yaml` aus der Lösungsseite kopieren, bevor ihr selbst dran wart
- alle Services in einem einzigen Container vermischen
- den Anwendungscode der App ändern (ihr braucht ihn nicht zu ändern)

---

# Hilfreiche Compose-Befehle

```bash
docker compose up -d
docker compose up -d --build
docker compose down
docker compose down -v
docker compose ps
docker compose logs -f
docker compose logs -f backend
docker compose config
docker compose exec db psql -U aurora -d auroradb
docker compose exec backend env
docker compose restart backend
```

---

# Checkliste

| Kriterium | Erfüllt? |
|---|---|
| `compose.yaml` selbst geschrieben (nicht kopiert) | ☐ |
| Service `db` läuft mit Volume + Init-SQL | ☐ |
| Service `backend` läuft und erreicht die DB | ☐ |
| Service `frontend` läuft und proxypased `/api/*` | ☐ |
| Service `adminer` läuft auf Port 8081 | ☐ |
| Konfiguration in `.env` ausgelagert | ☐ |
| Healthcheck + `condition: service_healthy` aktiv | ☐ |
| `db` ist in `docker compose ps` als `healthy` markiert | ☐ |
| Persistenz nach `down` + `up` getestet | ☐ |
| Mindestens ein Bonus geschafft | ☐ |

---

## Weiter

- [Hilfekarten](05-hilfekarten.md) – wenn etwas hakt
- [Abgabe & Reflexion](06-abgabe-und-reflexion.md) – worüber wir am Ende sprechen
