---
title: "Lösung"
description: "Vollständige Musterlösung mit OS-Tabs für Linux, macOS und Windows. Erst nach der eigenen Arbeit aufschlagen!"
---

# Lösung

!!! danger "Erst nach der eigenen Arbeit aufschlagen!"
    Diese Seite enthält die **vollständige Musterlösung**. Wenn ihr noch in der Gruppenarbeit seid: [Hilfekarten](05-hilfekarten.md) sind der bessere Ort.

Die Lösung ist plattformneutral: Wo sich die Befehle unterscheiden, gibt es **OS-Tabs** für macOS/Linux, Windows PowerShell und Windows CMD. Alle übrigen Befehle laufen in allen drei Terminals gleich.

---

## Sauberer Reset

!!! warning "Vorsicht: löscht Daten"
    Der folgende Befehl löscht Container, Netzwerk und Volume dieser Übung. Falls einzelne Ressourcen nicht existieren, erscheinen Fehlermeldungen. Die sind unkritisch.

```bash
docker rm -f quest-api quest-db quest-adminer
docker volume rm quest-pg-data
docker network rm quest-net
```

---

## Schritt 1: In den App-Ordner wechseln

Terminal im Ordner `kurs-unterlagen-main/apps/docker-escape-room` öffnen (ZIP-Weg siehe [Aufgabe 1](04-aufgabenuebersicht.md#aufgabe-1-projekt-vorbereiten)).

Kontrolle: `dir` (Windows) bzw. `ls` (macOS, Linux) zeigt `Dockerfile`, `package.json`, `README.md` und `src`.

---

## Schritt 2: Netzwerk erstellen

```bash
docker network create quest-net
```

Check:
```bash
docker network ls --filter name=quest-net
```

---

## Schritt 3: Volume erstellen

```bash
docker volume create quest-pg-data
```

Check:
```bash
docker volume ls --filter name=quest-pg-data
```

---

## Schritt 4: PostgreSQL starten

=== "macOS / Linux"
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

Logs prüfen, bis nach `PostgreSQL init process complete; ready for start up.` die Zeile `database system is ready to accept connections` erscheint (beim ersten Start steht sie zweimal im Log, erst die zweite zählt):
```bash
docker logs -f quest-db
```
(Mit `Ctrl+C` aus dem Live-Log raus.)

---

## Schritt 5: API-Image bauen

Im Ordner `apps/docker-escape-room`:

```bash
docker build -t container-quest-api:1.0 .
```

Check:
```bash
docker images container-quest-api
```

---

## Schritt 6: API starten

=== "macOS / Linux"
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

=== "Windows CMD (eine Zeile)"
    ```cmd
    docker run --name quest-api --network quest-net -p 3000:3000 -e PORT=3000 -e "APP_NAME=Container Quest API" -e PGHOST=quest-db -e PGPORT=5432 -e PGUSER=quest -e PGPASSWORD=questpass -e PGDATABASE=questdb -d container-quest-api:1.0
    ```

`PORT` und `APP_NAME` sind optional, die App hat dafür Standardwerte.

Logs prüfen:
```bash
docker logs -f quest-api
```
Erwartet: `Starting Container Quest API...`, eventuell ein paar Zeilen `Database not ready yet…`, dann `Database connection established.` und `Container Quest API listening on port 3000`.

---

## Schritt 7: Adminer starten

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

=== "Windows CMD (eine Zeile)"
    ```cmd
    docker run --name quest-adminer --network quest-net -p 8080:8080 -d adminer:latest
    ```

---

## Schritt 8: API testen

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
      -d '{"team":"Team Beispiel","category":"pizza","name":"Container Calzone","score":42}'

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
      -Body '{"team":"Team Beispiel","category":"pizza","name":"Container Calzone","score":42}'

    # Scoreboard prüfen
    Invoke-RestMethod http://localhost:3000/api/scoreboard
    ```

=== "Windows CMD (curl.exe)"
    ```cmd
    curl http://localhost:3000/health
    curl http://localhost:3000/db-check

    curl -X POST http://localhost:3000/api/entries -H "Content-Type: application/json" -d "{\"team\":\"Team Beispiel\",\"category\":\"pizza\",\"name\":\"Container Calzone\",\"score\":42}"

    curl http://localhost:3000/api/scoreboard
    ```

---

## Schritt 9: Adminer-Login

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

Zuerst einen Eintrag anlegen (siehe Schritt 8). Dann:

=== "macOS / Linux"
    ```bash
    # DB-Container zerstören
    docker stop quest-db
    docker rm quest-db

    # Neu starten, mit demselben Volume!
    docker run \
      --name quest-db \
      --network quest-net \
      -e POSTGRES_USER=quest \
      -e POSTGRES_PASSWORD=questpass \
      -e POSTGRES_DB=questdb \
      -v quest-pg-data:/var/lib/postgresql/data \
      -d postgres:16-alpine

    # API neu starten (sie ist beim Stoppen der DB abgestürzt)
    docker restart quest-api
    docker logs quest-api

    # Eintrag prüfen
    curl http://localhost:3000/api/entries
    ```

=== "Windows PowerShell"
    ```powershell
    # DB-Container zerstören
    docker stop quest-db
    docker rm quest-db

    # Neu starten, mit demselben Volume!
    docker run `
      --name quest-db `
      --network quest-net `
      -e POSTGRES_USER=quest `
      -e POSTGRES_PASSWORD=questpass `
      -e POSTGRES_DB=questdb `
      -v quest-pg-data:/var/lib/postgresql/data `
      -d postgres:16-alpine

    # API neu starten (sie ist beim Stoppen der DB abgestürzt)
    docker restart quest-api
    docker logs quest-api

    # Eintrag prüfen
    Invoke-RestMethod http://localhost:3000/api/entries
    ```

=== "Windows CMD"
    ```cmd
    docker stop quest-db
    docker rm quest-db
    docker run --name quest-db --network quest-net -e POSTGRES_USER=quest -e POSTGRES_PASSWORD=questpass -e POSTGRES_DB=questdb -v quest-pg-data:/var/lib/postgresql/data -d postgres:16-alpine
    docker restart quest-api
    docker logs quest-api
    curl http://localhost:3000/api/entries
    ```

Nach dem Stoppen der DB zeigt `docker ps -a` den Container `quest-api` mit Status `Exited (1)`: Die Beispiel-App fängt die gekappten Datenbankverbindungen nicht ab und stürzt ab. Deshalb `docker restart quest-api`, sobald `quest-db` wieder läuft. Erst abrufen, wenn `docker logs quest-api` die Zeile `listening on port 3000` zeigt.

Der Eintrag muss noch da sein. **Das ist der Beweis für Volume-Persistenz.**

---

## Typische Fehler und wie ihr sie löst

### Fehler 1: API nutzt `localhost` als `PGHOST`

**Symptom:** Das Log zeigt `host: 'localhost'` und danach Versuch um Versuch **ohne Grund** hinter `Reason:`:
```text
Database config: { host: 'localhost', port: 5432, user: 'quest', database: 'questdb' }
Database not ready yet. Attempt 1/20. Reason:
Database not ready yet. Attempt 2/20. Reason:
```
Der leere Grund entsteht, weil Node `localhost` gleichzeitig über IPv4 und IPv6 versucht und beide Versuche scheitern. Der entscheidende Hinweis steht in der Zeile `Database config`.

**Ursache:** `localhost` zeigt im API-Container auf den API-Container selbst und nicht auf die Datenbank.

**Lösung:** `docker rm -f quest-api`, dann den Container mit `-e PGHOST=quest-db` neu erstellen (Schritt 6). Ein `docker restart` übernimmt geänderte `-e`-Werte nicht, sie werden beim `docker run` festgelegt.

---

### Fehler 2: API und DB sind nicht im gleichen Netzwerk

**Symptom:** Im Log von `quest-api` steht ein Namensfehler wie `getaddrinfo ENOTFOUND quest-db`, nach etwa 20 Versuchen `Startup failed` und der Container steht auf `Exited (1)`. Wurde beim `docker run` ein Netz angegeben, das es nicht gibt, bleibt der Container als `Created` liegen.

**Diagnose:**
```bash
docker network inspect quest-net
```
Zeigt unter `Containers` nur einen oder keinen.

**Lösung:** Container ins Netz hängen und neu starten:
```bash
docker network connect quest-net quest-api
docker restart quest-api
```
Oder den Container mit `docker rm -f quest-api` löschen und mit `--network quest-net` neu erstellen.

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

**Lösung:** Beim DB-Start immer das Volume mounten, siehe Schritt 4.

---

### Fehler 5: Port ist belegt

**Symptom:**
```text
port is already allocated
```
Unter Windows auch: `ports are not available: exposing port TCP 0.0.0.0:3000`.

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

### Fehler 8: Postgres beendet sich sofort

**Symptom:** `docker ps -a` zeigt `quest-db` als `Exited`, im Log steht `Database is uninitialized and superuser password is not specified.`

**Lösung:** `docker rm quest-db`, dann mit `-e POSTGRES_PASSWORD=questpass` (und den übrigen Werten aus Schritt 4) neu starten.

---

### Fehler 9: Zugangsdaten falsch, obwohl die `-e`-Werte stimmen

**Symptom:** API oder Adminer melden `password authentication failed for user "quest"`, `role "quest" does not exist` oder `database "questdb" does not exist`. Im Log von `quest-db` steht `Skipping initialization`.

**Ursache:** Das Volume wurde bei einem früheren Versuch mit anderen Werten angelegt. `POSTGRES_USER`, `POSTGRES_PASSWORD` und `POSTGRES_DB` wirken nur beim ersten Start mit leerem Volume.

**Lösung** (Daten im Volume sind danach weg):
```bash
docker rm -f quest-db
docker volume rm quest-pg-data
docker volume create quest-pg-data
```
Dann Schritt 4 wiederholen und `docker restart quest-api`.

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

- [Übergang zu Compose](08-uebergang-zu-compose.md): Brücke zu Docker Compose
