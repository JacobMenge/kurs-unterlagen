---
title: "Übungen"
description: "Eigene Hands-on-Übungen zum Aufbau-Block – Volumes, Env-Variablen, Netzwerke, vier Schwierigkeitsgrade."
---

# Übungen – Docker-Aufbau

Übungen zum Vertiefen von **Volumes, Umgebungsvariablen und Netzwerken**. Je höher das Level, desto weniger Anleitung.

!!! abstract "Die vier Stufen"
    - 🟢 **Einsteiger** – jeder Schritt bis ins Detail
    - 🟡 **Mittel** – weniger Hand-Holding
    - 🔴 **Fortgeschritten** – Hinweise statt Rezepte
    - 🏆 **Challenge** – Aufgabe ohne Anleitung, Musterlösung aufklappbar

## Voraussetzung für alle Übungen

- Docker läuft (`docker version` klappt).
- Aufräumen von alten Übungen der vorherigen Blöcke:

    === "macOS / Linux"
        ```bash
        docker ps -aq | xargs docker rm -f 2>/dev/null
        docker network ls --filter "name=kurs" -q | xargs docker network rm 2>/dev/null
        ```

    === "Windows PowerShell"
        ```powershell
        docker ps -aq | ForEach-Object { docker rm -f $_ }
        docker network ls --filter "name=kurs" -q | ForEach-Object { docker network rm $_ }
        ```

    **`|`** ist die [Pipe](../glossar.md#pipe) – die Ausgabe des ersten Befehls wird an den zweiten weitergereicht. **[xargs](../glossar.md#xargs)** macht aus jeder Zeile ein Argument für den folgenden Befehl; PowerShell nutzt stattdessen `ForEach-Object`.

---

## 🟢 Einsteiger

### Übung 3.1 – Redis mit persistentem Volume

!!! info "Was du lernst"
    - Volume anlegen und einen Container damit starten
    - Prüfen, dass Daten einen Container-Neustart überleben
    - Was Redis ist (im Vorbeigehen)

#### Worum geht's – Kontext

**Redis** ist ein sehr schneller In-Memory-Speicher, oft als Cache oder für einfache Key-Value-Daten genutzt. Normalerweise lebt Redis komplett im RAM – wenn der Container weg ist, sind die Daten weg. Wir zeigen Redis, wie er auf Disk speichert, und nutzen ein **Docker-Volume**, damit die Daten einen Neustart überleben.

**Volume** – noch mal kurz: von Docker verwalteter Speicher außerhalb des Containers. Lebt, solange du ihn nicht explizit löschst.

#### Schritt 1 – Volume anlegen

```bash
docker volume create redis-daten
```

Check:
```bash
docker volume ls
```
Du siehst `redis-daten` in der Liste.

#### Schritt 2 – Redis starten und Volume einhängen

```bash
docker run -d --name cache \
  -v redis-daten:/data \
  redis:7 redis-server --save 60 1
```

Erklärt:

- `-d --name cache` – im Hintergrund, Name `cache`.
- `-v redis-daten:/data` – Volume `redis-daten` in den Container an den Pfad `/data` einhängen. Redis speichert dort seine Snapshots.
- `redis:7` – offizielles Redis-Image, Version 7.
- `redis-server --save 60 1` – überschreibt das Standard-Command: „speichere alle 60 Sekunden einen Snapshot, wenn mindestens 1 Key geändert wurde".

#### Schritt 3 – Daten in Redis schreiben

Wir öffnen die Redis-CLI direkt im Container:

```bash
docker exec -it cache redis-cli
```

Im Redis-Prompt:
```text
127.0.0.1:6379> SET name "Jacob"
OK
127.0.0.1:6379> SET hobby "Kochen"
OK
127.0.0.1:6379> GET name
"Jacob"
127.0.0.1:6379> KEYS *
1) "name"
2) "hobby"
127.0.0.1:6379> SAVE
OK
127.0.0.1:6379> exit
```

`SAVE` schreibt sofort einen Snapshot ins Volume, damit wir nicht 60 Sekunden warten müssen.

#### Schritt 4 – Persistenz-Test

Container zerstören:
```bash
docker stop cache
docker rm cache
```

Neu starten mit **demselben Volume**:
```bash
docker run -d --name cache \
  -v redis-daten:/data \
  redis:7 redis-server --save 60 1
```

In Redis reinschauen:
```bash
docker exec -it cache redis-cli
```
```text
127.0.0.1:6379> GET name
"Jacob"
127.0.0.1:6379> KEYS *
1) "name"
2) "hobby"
```

**Der Container ist neu – aber die Daten sind da.** Das ist Volume-Persistenz.

#### Schritt 5 – Aufräumen

```bash
docker stop cache
docker rm cache
docker volume rm redis-daten
```

---

### Übung 3.2 – nginx mit Umgebungsvariable konfigurieren

!!! info "Was du lernst"
    - Eine Umgebungsvariable beim Start übergeben
    - Variable im laufenden Container prüfen

#### Worum geht's

Viele Container-Images sind über Umgebungsvariablen konfigurierbar. Wir demonstrieren das an einem einfachen Beispiel: einer Variable `WILLKOMMEN`, die im Container ankommt.

#### Schritte

1. Container starten mit Variable:
    ```bash
    docker run -d --name envtest \
      -e WILLKOMMEN="Hallo Kurs" \
      -e FAVORITE_COLOR="phosphor-grün" \
      nginx:alpine
    ```

2. Prüfen, was im Container ankam:
    ```bash
    docker exec envtest env
    ```
    Du siehst alle Env-Variablen des Containers, darunter `WILLKOMMEN=Hallo Kurs` und `FAVORITE_COLOR=phosphor-grün`.

3. Gezielt eine einzelne:
    ```bash
    docker exec envtest printenv WILLKOMMEN
    ```

4. Aufräumen:
    ```bash
    docker rm -f envtest
    ```

---

## 🟡 Mittel

### Übung 3.3 – Postgres + eigenes Netzwerk + Adminer als GUI

!!! info "Was du lernst"
    - Eigenes Netzwerk anlegen
    - Docker-DNS nutzen (Container per Name ansprechen)
    - Alle drei Säulen in einer Übung

#### Aufgabe

Bau einen Mini-Stack:

- **Postgres 16** mit persistentem Volume, User `kurs`, Passwort `geheim`, DB `kursdaten`
- **Adminer** als Web-GUI, verbindet sich zur Postgres über den Namen `db`
- Beide im Netzwerk `kurs-netz`
- Adminer erreichbar auf <http://localhost:8080>

#### Hinweise

- Erst Netzwerk anlegen, dann Container.
- Postgres braucht kein Port-Mapping – nur Adminer.
- Postgres-Container-Name wird zum DNS-Namen im Netzwerk.

??? info "Zielstruktur"
    ```
    Browser (Host) ──http:8080──> Adminer Container
                                     │
                                     └── DNS: "db" ──> Postgres Container
                                                          │
                                                          └── Volume postgres-daten
    ```

#### Erfolgs-Check

In Adminer einloggen:

- System: PostgreSQL
- Server: `db`
- Benutzer: `kurs`
- Passwort: `geheim`
- Datenbank: `kursdaten`

Tabelle anlegen, Daten einfügen. Dann: Container zerstören, neu starten, sehen dass Daten noch da sind.

#### Aufräumen

```bash
docker rm -f db adminer
docker network rm kurs-netz
docker volume rm postgres-daten
```

---

### Übung 3.4 – App liest Konfiguration aus `.env`-Datei

!!! info "Was du lernst"
    - `--env-file` beim `docker run`
    - Warum `.env` nicht in Git gehört

#### Aufgabe

Du hast einen PostgreSQL-Container, dessen komplette Konfiguration (User, Passwort, DB) aus einer `.env`-Datei kommt, **nicht** aus einzelnen `-e`-Flags.

#### Hinweise

- Syntax in `.env`:
    ```
    POSTGRES_USER=kurs
    POSTGRES_PASSWORD=einGutesPasswort
    POSTGRES_DB=testdaten
    ```
- Beim Start: `docker run --env-file .env postgres:16`
- **Wichtig:** keine Anführungszeichen in der `.env` – die werden wörtlich übernommen.
- Nach dem Start prüfen: `docker exec <container> env | grep POSTGRES`.

#### Bonus

Lege eine `.gitignore` an, die `.env` ausschließt. Das ist die Gewohnheit, die du dir angewöhnen solltest:
```
.env
.env.*
!.env.example
```

---

## 🔴 Fortgeschritten

### Übung 3.5 – Drei Services, zwei Netzwerke (Segmentierung)

!!! info "Was du lernst"
    - Netzwerk-Segmentierung
    - Welche Container miteinander sprechen **können**, und welche nicht

#### Szenario

Eine typische Web-Anwendung hat drei Schichten:

- **Frontend** – Webserver, den der Browser erreicht
- **Backend** – API-Server, der Anfragen bearbeitet
- **Datenbank** – wo die Daten liegen

Design-Prinzip: **Datenbank darf nur vom Backend erreicht werden, nicht vom Frontend.**

#### Aufgabe

Baue diese Struktur mit drei Containern:

- `frontend` (nginx) – öffentlich auf Host-Port 8080
- `backend` (nginx als Platzhalter) – nicht öffentlich
- `db` (postgres:16)

Und zwei Netzwerken:

- `netz-frontend` – enthält `frontend` und `backend`
- `netz-backend` – enthält `backend` und `db`

Prüfe per `docker exec`, dass:

- `frontend` kann `backend` erreichen ✅
- `frontend` kann `db` **nicht** erreichen ✖
- `backend` kann `db` erreichen ✅

#### Hinweise

- Ein Container kann in mehreren Netzwerken sein – genau das macht `backend`.
- Mit `docker exec frontend ping -c 2 backend` testest du.
- **Nicht jeder Container hat `ping` vorinstalliert.** Alternativen:
    - `docker exec frontend getent hosts backend` (DNS-Auflösung testen, meistens verfügbar)
    - `docker exec frontend wget -q -O- http://backend` (HTTP-Test, klappt bei nginx)
    - `ping` nachinstallieren:
        - In **Alpine-Images** (z.B. `nginx:alpine`): `docker exec frontend apk add --no-cache iputils-ping`
        - In **Debian/Ubuntu-Images**: `docker exec frontend apt-get update && apt-get install -y iputils-ping`
- Network-Create, dann `docker network connect`.

#### Aufräumen

Alle Container und beide Netzwerke entfernen.

---

## 🏆 Challenge

### Challenge 3 – Notizbuch-Stack mit echter Persistenz

!!! abstract "Aufgabe"
    Baue einen Stack, mit dem du **persönliche Notizen in einer Postgres-Datenbank** speichern und per Browser ansehen kannst.

    Anforderungen:

    1. Postgres-Container `notes-db` mit Volume `notes-data`, User `notes`, Passwort `geheim`, DB `notizbuch`.
    2. Adminer-Container `notes-ui` auf Host-Port 9090.
    3. Beide im Netzwerk `notes-netz`.
    4. In Adminer anmelden (alle Credentials aus Schritt 1).
    5. Eine Tabelle `notizen` anlegen mit den Spalten `id` (auto-increment), `titel` (Text), `inhalt` (Text), `erstellt_am` (Timestamp mit Default `NOW()`).
    6. Füge **mindestens drei** Notizen ein.
    7. Zerstöre beide Container (ohne `-v`!).
    8. Starte beide Container neu.
    9. Prüfe: die drei Notizen sind **noch da**.

    Am Ende räumst du alles auf – außer du willst das Notizbuch behalten.

??? success "Musterlösung"

    ### Netzwerk + Volume

    ```bash
    docker network create notes-netz
    docker volume create notes-data
    ```

    ### Postgres

    ```bash
    docker run -d \
      --name notes-db \
      --network notes-netz \
      -v notes-data:/var/lib/postgresql/data \
      -e POSTGRES_USER=notes \
      -e POSTGRES_PASSWORD=geheim \
      -e POSTGRES_DB=notizbuch \
      postgres:16
    ```

    ### Adminer

    ```bash
    docker run -d \
      --name notes-ui \
      --network notes-netz \
      -p 9090:8080 \
      adminer
    ```

    ### Im Browser anmelden

    <http://localhost:9090>

    - System: **PostgreSQL**
    - Server: **notes-db**
    - Benutzer: **notes**
    - Passwort: **geheim**
    - Datenbank: **notizbuch**

    ### Tabelle und Daten

    Im Adminer `SQL-Kommando` klicken und eingeben:

    ```sql
    CREATE TABLE notizen (
      id           SERIAL PRIMARY KEY,
      titel        TEXT NOT NULL,
      inhalt       TEXT NOT NULL,
      erstellt_am  TIMESTAMP DEFAULT NOW()
    );

    INSERT INTO notizen (titel, inhalt) VALUES
      ('Dockerkurs', 'Heute Volumes gelernt – geil.'),
      ('Einkaufsliste', 'Milch, Brot, Kaffee.'),
      ('Ideen', 'Mini-Blog in einem Container hosten.');
    ```

    „Ausführen" klicken.

    ### Persistenz-Test

    ```bash
    docker stop notes-ui notes-db
    docker rm notes-ui notes-db
    ```

    Volumes prüfen – `notes-data` ist noch da:

    === "macOS / Linux"
        ```bash
        docker volume ls | grep notes-data
        ```

    === "Windows PowerShell"
        ```powershell
        docker volume ls | Select-String "notes-data"
        ```

    === "Plattform-unabhängig"
        ```bash
        docker volume ls --filter "name=notes-data"
        ```

    Beide Container neu starten (dieselben Befehle wie oben).

    In Adminer wieder anmelden, `SELECT * FROM notizen;` ausführen – die drei Zeilen sind da.

    ### Aufräumen

    ```bash
    docker rm -f notes-ui notes-db
    docker volume rm notes-data
    docker network rm notes-netz
    ```

    **Was du hier gelernt hast:** Alle drei Säulen im Zusammenspiel, plus echten SQL-Workflow. Persistenz überlebt den Tod der Container – nur das Volume halten. Das ist das Muster, das überall skaliert.

---

## Weiter mit

- [Docker Compose](../docker-compose/index.md) – genau denselben Stack, aber mit `compose.yaml`
- [Stolpersteine Aufbau-Block](stolpersteine.md)
