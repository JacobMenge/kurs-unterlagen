---
title: "Trainer-Lösung"
description: "Vollständige Lösung mit OS-Tabs für Linux, macOS und Windows. Erst nach der Gruppenarbeit aufschlagen!"
---

# Trainer-Lösung

!!! danger "Erst nach der Gruppenarbeit aufschlagen!"
    Diese Seite enthält die **vollständige Lösung**. Wenn ihr noch in der Gruppenarbeit seid: [Hilfekarten](05-hilfekarten.md) sind der bessere Ort.

Die Lösung ist plattformneutral mit **OS-Tabs** für Linux/macOS und Windows PowerShell.

---

## Sauberer Reset

!!! warning "Vorsicht – löscht Daten"
    Der folgende Befehl löscht Container, Netzwerk und Volume dieser Übung. Falls einzelne Ressourcen nicht existieren, erscheinen Fehlermeldungen – die sind unkritisch.

```bash
docker rm -f quest-api quest-db quest-adminer
docker volume rm quest-pg-data
docker network rm quest-net
```

---

## Schritt 1 – In den App-Ordner wechseln

```bash
cd apps/docker-escape-room
```

(Der Ordner liegt im Repository-Root, **nicht** unter `docs/`.)

---

## Schritt 2 – Netzwerk erstellen

```bash
docker network create quest-net
```

Check:
```bash
docker network ls | grep quest-net
```

---

## Schritt 3 – Volume erstellen

```bash
docker volume create quest-pg-data
```

Check:
```bash
docker volume ls | grep quest-pg-data
```

---

## Schritt 4 – PostgreSQL starten

=== "macOS / Linux / Git Bash"
    ```bash
    docker run \
      --name quest-db \
      --network quest-net \
      -e POSTGRES_USER=quest \
      -e POSTGRES_PASSWORD=questpass \
      -e POSTGRES_DB=questdb \
      -v quest-pg-data:/var/lib/postgresql/data \
      -d postgres:16-alpine
    ```

=== "Windows PowerShell"
    ```powershell
    docker run `
      --name quest-db `
      --network quest-net `
      -e POSTGRES_USER=quest `
      -e POSTGRES_PASSWORD=questpass `
      -e POSTGRES_DB=questdb `
      -v quest-pg-data:/var/lib/postgresql/data `
      -d postgres:16-alpine
    ```

=== "Windows CMD (eine Zeile)"
    ```cmd
    docker run --name quest-db --network quest-net -e POSTGRES_USER=quest -e POSTGRES_PASSWORD=questpass -e POSTGRES_DB=questdb -v quest-pg-data:/var/lib/postgresql/data -d postgres:16-alpine
    ```

Logs prüfen, bis „database system is ready to accept connections" erscheint:
```bash
docker logs -f quest-db
```
(Mit `Ctrl+C` aus dem Live-Log raus.)

---

## Schritt 5 – API-Image bauen

Im Ordner `apps/docker-escape-room`:

```bash
docker build -t container-quest-api:1.0 .
```

Check:
```bash
docker images container-quest-api
```

---

## Schritt 6 – API starten

=== "macOS / Linux / Git Bash"
    ```bash
    docker run \
      --name quest-api \
      --network quest-net \
      -p 3000:3000 \
      -e PORT=3000 \
      -e APP_NAME="Container Quest API" \
      -e PGHOST=quest-db \
      -e PGPORT=5432 \
      -e PGUSER=quest \
      -e PGPASSWORD=questpass \
      -e PGDATABASE=questdb \
      -d container-quest-api:1.0
    ```

=== "Windows PowerShell"
    ```powershell
    docker run `
      --name quest-api `
      --network quest-net `
      -p 3000:3000 `
      -e PORT=3000 `
      -e APP_NAME="Container Quest API" `
      -e PGHOST=quest-db `
      -e PGPORT=5432 `
      -e PGUSER=quest `
      -e PGPASSWORD=questpass `
      -e PGDATABASE=questdb `
      -d container-quest-api:1.0
    ```

Logs prüfen:
```bash
docker logs -f quest-api
```
Erwartet: erst „Database not ready yet…" für ein paar Sekunden, dann „Database connection established." und „Container Quest API listening on port 3000".

---

## Schritt 7 – Adminer starten

=== "macOS / Linux"
    ```bash
    docker run \
      --name quest-adminer \
      --network quest-net \
      -p 8080:8080 \
      -d adminer:latest
    ```

=== "Windows PowerShell"
    ```powershell
    docker run `
      --name quest-adminer `
      --network quest-net `
      -p 8080:8080 `
      -d adminer:latest
    ```

---

## Schritt 8 – API testen

=== "Browser"
    Öffne nacheinander:

    - <http://localhost:3000/>
    - <http://localhost:3000/health>
    - <http://localhost:3000/db-check>
    - <http://localhost:3000/api/entries>
    - <http://localhost:3000/api/scoreboard>

=== "macOS / Linux (curl)"
    ```bash
    curl http://localhost:3000/
    curl http://localhost:3000/health
    curl http://localhost:3000/db-check

    # Eintrag erstellen
    curl -X POST http://localhost:3000/api/entries \
      -H "Content-Type: application/json" \
      -d '{"team":"Trainerteam","category":"pizza","name":"Container Calzone","score":42}'

    # Scoreboard prüfen
    curl http://localhost:3000/api/scoreboard
    ```

=== "Windows PowerShell"
    ```powershell
    Invoke-RestMethod http://localhost:3000/
    Invoke-RestMethod http://localhost:3000/health
    Invoke-RestMethod http://localhost:3000/db-check

    # Eintrag erstellen
    Invoke-RestMethod `
      -Uri http://localhost:3000/api/entries `
      -Method POST `
      -ContentType "application/json" `
      -Body '{"team":"Trainerteam","category":"pizza","name":"Container Calzone","score":42}'

    # Scoreboard prüfen
    Invoke-RestMethod http://localhost:3000/api/scoreboard
    ```

---

## Schritt 9 – Adminer-Login

Öffnen: <http://localhost:8080>

Login:

| Feld | Wert |
|---|---|
| System | PostgreSQL |
| Server | `quest-db` |
| Benutzer | `quest` |
| Passwort | `questpass` |
| Datenbank | `questdb` |

Du solltest die Tabelle `entries` mit den Test-Einträgen sehen.

---

## Persistenz-Test

Daten werden via API angelegt → DB-Container zerstören → neu starten → Daten noch da.

```bash
# Eintrag anlegen (siehe Schritt 8)

# DB-Container zerstören
docker stop quest-db
docker rm quest-db

# Neu starten – mit demselben Volume!
docker run \
  --name quest-db \
  --network quest-net \
  -e POSTGRES_USER=quest \
  -e POSTGRES_PASSWORD=questpass \
  -e POSTGRES_DB=questdb \
  -v quest-pg-data:/var/lib/postgresql/data \
  -d postgres:16-alpine

# Auch API neu starten (sonst hat sie alte DB-Verbindungen im Pool)
docker restart quest-api

# Eintrag prüfen
curl http://localhost:3000/api/entries
```

Der Eintrag muss noch da sein. **Das ist der Beweis für Volume-Persistenz.**

---

## Typische Fehler (Trainer-Antworten)

### Fehler 1: API nutzt `localhost` als `PGHOST`

**Symptom:**
```text
connect ECONNREFUSED 127.0.0.1:5432
```

**Ursache:** `localhost` zeigt im API-Container auf den API-Container selbst – nicht auf die Datenbank.

**Lösung:** API-Container neu starten mit `-e PGHOST=quest-db`.

---

### Fehler 2: API und DB sind nicht im gleichen Netzwerk

**Diagnose:**
```bash
docker network inspect quest-net
```
Zeigt unter `Containers` nur einen oder keinen.

**Lösung:** Container neu starten mit `--network quest-net`.

---

### Fehler 3: Containername ist schon vergeben

**Symptom:**
```text
Conflict. The container name "/quest-api" is already in use by container ...
```

**Lösung:**
```bash
docker rm -f quest-api
```
Dann neu starten.

---

### Fehler 4: Daten verschwinden

**Ursache:** PostgreSQL wurde **ohne** `-v quest-pg-data:/var/lib/postgresql/data` gestartet, oder das Volume wurde gelöscht.

**Lösung:** Beim DB-Start immer das Volume mounten – siehe Schritt 4.

---

### Fehler 5: Port ist belegt

**Symptom:**
```text
port is already allocated
```

**Lösung:** Anderen Host-Port wählen, z.B. `-p 3001:3000`. Browser dann auf `http://localhost:3001`.

---

### Fehler 6: Image geändert, alter Container läuft noch

**Ursache:** Build erzeugt ein neues Image, aber der laufende Container nutzt das alte (er wurde ja schon vor dem Build gestartet).

**Lösung:**
```bash
docker rm -f quest-api
docker run ... container-quest-api:1.0   # neu, mit den richtigen Flags
```

---

### Fehler 7: DB ist noch nicht bereit, API gibt auf

Die Beispiel-App hat **eingebaute Retry-Logik** (`waitForDatabase`, max. 20 Versuche à 1 Sekunde). Wenn die DB länger braucht: einfach DB starten, **dann** API. Falls die API trotzdem aufgegeben hat:
```bash
docker restart quest-api
```

---

## Aufräumen am Ende

```bash
docker rm -f quest-api quest-db quest-adminer
docker volume rm quest-pg-data
docker network rm quest-net
docker rmi container-quest-api:1.0
```

---

## Weiter

- [Übergang zu Compose](08-uebergang-zu-compose.md) – Brücke zur nächsten Einheit
