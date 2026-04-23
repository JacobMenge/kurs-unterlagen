---
title: "Übungen"
description: "Eigene Hands-on-Übungen zum Compose-Block – vier Schwierigkeitsgrade."
---

# Übungen – Docker Compose

Übungen zum Vertiefen von Docker Compose. Jeder `up -d` zeigt dir, wie elegant Multi-Container-Stacks werden, wenn man sie deklariert statt scriptet.

!!! abstract "Die vier Stufen"
    - 🟢 **Einsteiger** – jeder Schritt bis ins Detail
    - 🟡 **Mittel** – weniger Hand-Holding
    - 🔴 **Fortgeschritten** – Hinweise statt Rezepte
    - 🏆 **Challenge** – Aufgabe ohne Anleitung, Musterlösung aufklappbar

## Voraussetzung für alle Übungen

- Docker und `docker compose` sind verfügbar:
    ```bash
    docker compose version
    ```
- Ein Editor für Textdateien.
- Idealerweise Block 3 (Aufbau) durchgearbeitet.

---

## 🟢 Einsteiger

### Übung 4.1 – Erste `compose.yaml` mit nginx

!!! info "Was du lernst"
    - Eine `compose.yaml`-Datei anlegen
    - `docker compose up` und `down`
    - Vergleich zu `docker run`

#### Worum geht's – Kontext

**Docker Compose** ist ein Werkzeug, mit dem du einen Stack von Containern **in einer Textdatei beschreibst** und mit **einem Befehl** startest oder stoppst. Statt fünf `docker run`-Befehle einzeln zu tippen, schreibst du sie einmal in `compose.yaml` und sagst `docker compose up -d`.

#### Schritt 1 – Projektordner

=== "macOS / Linux"
    ```bash
    mkdir -p ~/compose-uebung1
    cd ~/compose-uebung1
    ```

=== "Windows PowerShell"
    ```powershell
    mkdir $HOME\compose-uebung1
    cd $HOME\compose-uebung1
    ```

#### Schritt 2 – `compose.yaml` anlegen

Lege eine Datei `compose.yaml` mit diesem Inhalt an:

```yaml
services:
  web:
    image: nginx:alpine
    ports:
      - "8080:80"
```

Bedeutung Zeile für Zeile:

- `services:` – Container-Liste (Top-Level-Block)
- `web:` – Service-Name (beliebig wählbar); wird auch Container-Name und DNS-Name
- `image: nginx:alpine` – welches Image
- `ports: "8080:80"` – Port-Mapping wie bei `docker run -p`

**Wichtig:** YAML ist **pingelig** mit Einrückung. Nutze **2 Leerzeichen** pro Ebene. **Keine Tabs**.

#### Schritt 3 – Stack starten

```bash
docker compose up -d
```

Was passiert:

- Compose liest `compose.yaml`.
- Legt automatisch ein Netzwerk an (Name: Ordner_default).
- Zieht `nginx:alpine`, falls noch nicht lokal.
- Startet den Container `compose-uebung1-web-1`.

#### Schritt 4 – Prüfen

```bash
docker compose ps
```

Zeigt alle Services deines Stacks.

```bash
docker compose logs
```

Zeigt die gesammelten Logs.

Im Browser: <http://localhost:8080> → nginx-Willkommensseite.

#### Schritt 5 – Stack herunterfahren

```bash
docker compose down
```

Stoppt und entfernt alle Container des Stacks **und** das automatisch erzeugte Netzwerk.

!!! success "Geschafft!"
    Du hast einen Stack mit einer YAML-Datei beschrieben. Das ist **deklarative Konfiguration** in ihrer reinsten Form.

---

### Übung 4.2 – Mehrere Services in einer `compose.yaml`

!!! info "Was du lernst"
    - Mehrere Container gleichzeitig deklarieren
    - Service-Namen als Hostnamen

#### Aufgabe

Baue einen Stack mit **zwei** Services: `web` (nginx) und `proxy` (httpd). Unterschiedliche Host-Ports.

#### Schritte

1. Neuer Ordner `compose-uebung2`, rein.
2. `compose.yaml`:
    ```yaml
    services:
      web:
        image: nginx:alpine
        ports:
          - "8080:80"

      proxy:
        image: httpd:alpine
        ports:
          - "8081:80"
    ```
3. `docker compose up -d`
4. <http://localhost:8080> zeigt nginx, <http://localhost:8081> zeigt httpd.
5. Test, dass die Services sich **intern** sehen:
    ```bash
    docker compose exec web sh
    ```
    In der web-Shell:
    ```sh
    # Aus 'web'-Container 'proxy' anpingen:
    wget -q -O - http://proxy:80 | head -3
    exit
    ```
    Du siehst die httpd-Begrüßung – obwohl kein Port-Mapping zwischen den Services existiert. **Docker-DNS** macht's möglich.
6. `docker compose down`

---

## 🟡 Mittel

### Übung 4.3 – WordPress mit MySQL

!!! info "Was du lernst"
    - Ein echter Multi-Container-Stack (App + DB)
    - `depends_on`, `environment`, `volumes` kombinieren
    - Persistente Daten

#### Worum geht's

**WordPress** ist das meistgenutzte CMS für Websites. Es braucht eine **Datenbank** (MySQL oder MariaDB). Genau so ein Setup ist ein klassischer Compose-Anwendungsfall.

#### Aufgabe

Baue einen Stack mit:

- `db`: MariaDB (leichtgewichtige MySQL-Alternative)
- `wordpress`: offizielles WordPress-Image, verbindet sich zu `db`
- Persistente Volumes für DB und Uploads
- WordPress auf Host-Port 8080

#### Rahmen

```yaml
services:
  db:
    image: mariadb:11
    restart: unless-stopped
    environment:
      MARIADB_DATABASE: wordpress
      MARIADB_USER: wp
      MARIADB_PASSWORD: wppass
      MARIADB_ROOT_PASSWORD: rootpass
    volumes:
      - db-data:/var/lib/mysql

  wordpress:
    image: wordpress:latest
    restart: unless-stopped
    depends_on:
      - db
    environment:
      WORDPRESS_DB_HOST: db:3306
      WORDPRESS_DB_USER: wp
      WORDPRESS_DB_PASSWORD: wppass
      WORDPRESS_DB_NAME: wordpress
    ports:
      - "8080:80"
    volumes:
      - wp-content:/var/www/html/wp-content

volumes:
  db-data:
  wp-content:
```

`docker compose up -d`, dann <http://localhost:8080> → WordPress-Setup-Seite.

#### Persistenz-Test

1. WordPress aufsetzen (Sprache, Titel, Admin-User).
2. Einen Beitrag schreiben und veröffentlichen.
3. `docker compose down` (ohne `-v`!).
4. `docker compose up -d`.
5. Der Beitrag ist noch da.

Wenn du **alle** Daten löschen willst: `docker compose down -v` (mit `-v`!).

---

### Übung 4.4 – `.env` mit Compose

!!! info "Was du lernst"
    - Variablen aus `.env` in `compose.yaml` nutzen
    - Secrets aus der YAML raushalten

#### Aufgabe

Baue den WordPress-Stack aus Übung 4.3 **um**:

- Alle Passwörter und Datenbank-Namen kommen aus einer `.env`-Datei.
- In `compose.yaml` stehen nur `${VARIABLE}`-Platzhalter.
- Die `.env` darf **keine Anführungszeichen** enthalten.
- Lege eine `.env.example` an (ohne Werte) und füge `.env` in eine `.gitignore` ein.

#### Erfolgs-Check

- `docker compose config` zeigt nach Variableinsatz die vollständige YAML.
- Ein `cat .env.example` zeigt die Variablen-Namen ohne Werte (das kannst du einchecken).

---

## 🔴 Fortgeschritten

### Übung 4.5 – Stack mit Healthcheck und depends_on-Condition

!!! info "Was du lernst"
    - `depends_on` mit `condition: service_healthy`
    - Healthcheck im Compose definieren

#### Szenario

Der `wordpress`-Container startet manchmal **bevor** die Datenbank bereit ist, und crasht dann beim ersten DB-Call. Die Lösung: ein **Healthcheck** für die DB, und `wordpress` wartet darauf.

#### Aufgabe

Erweitere den WordPress-Stack so, dass:

1. `db` einen Healthcheck hat, der `mariadb-admin ping -h localhost` ausführt, alle 5 Sekunden, bis zu 10 Retries.
2. `wordpress` mit `depends_on: db: condition: service_healthy` konfiguriert ist.

#### Hinweise

- Das Healthcheck-Format ist ein JSON-Array oder `CMD-SHELL`-String.
- `docker compose ps` zeigt den Health-Status einer Service.
- Achte darauf, dass `depends_on` in der detaillierteren Form (`condition:`) strukturiert werden muss.

#### Erfolgs-Check

```bash
docker compose up -d
docker compose ps
```
Du solltest sehen, dass `db` zuerst `(health: starting)` ist, dann `(healthy)` – und erst **danach** läuft `wordpress`.

---

## 🏆 Challenge

### Challenge 4 – Vollständiger Tech-Stack mit Monitoring

!!! abstract "Aufgabe"
    Baue einen Stack mit **vier** Services, der dir sowohl eine kleine Web-App als auch Monitoring zeigt:

    1. **`web`** – nginx, liefert eine simple HTML-Seite aus (per Bind Mount)
    2. **`redis`** – Cache auf Port 6379 (intern, nicht vom Host erreichbar), mit Volume für Persistenz
    3. **`adminer`** – für eine PostgreSQL
    4. **`db`** – PostgreSQL mit Volume

    Anforderungen:

    - Alle Services in einer `compose.yaml`.
    - Secrets (`POSTGRES_PASSWORD`, `REDIS_PASSWORD`) aus `.env`.
    - Volumes für `db` und `redis` – Daten überleben `down` (ohne `-v`).
    - `web` mountet einen lokalen `html/`-Ordner als Bind-Mount.
    - Adminer hört auf Port 8081, nginx auf 8080.
    - Postgres und Redis haben Healthchecks; Adminer wartet auf `db: condition: service_healthy`.
    - `docker compose up -d` startet alles, `docker compose down` stoppt sauber.

    Bonus: Schreib eine `README.md` für diesen Stack, die erklärt, wie man ihn startet und wozu er gut ist.

??? success "Musterlösung"

    ### Verzeichnisstruktur

    ```
    mein-stack/
    ├── compose.yaml
    ├── .env
    ├── .env.example
    ├── .gitignore
    ├── README.md
    └── html/
        └── index.html
    ```

    ### `.gitignore`

    ```
    .env
    ```

    ### `.env.example`

    ```
    POSTGRES_USER=
    POSTGRES_PASSWORD=
    POSTGRES_DB=
    REDIS_PASSWORD=
    ```

    ### `.env` (lokal, nicht eingecheckt)

    ```
    POSTGRES_USER=kurs
    POSTGRES_PASSWORD=einGutesPasswort
    POSTGRES_DB=testdaten
    REDIS_PASSWORD=einAnderesPasswort
    ```

    ### `html/index.html`

    ```html
    <!DOCTYPE html>
    <html lang="de">
    <head>
      <meta charset="UTF-8">
      <title>Mein Tech-Stack</title>
      <style>
        body { font-family: system-ui, sans-serif; background:#0e1013; color:#e2ece6; max-width:720px; margin:2rem auto; padding:1rem; }
        h1 { color:#7dff9a; }
        code { background:#161622; padding:.1rem .3rem; border-radius:3px; }
      </style>
    </head>
    <body>
      <h1>Mein Tech-Stack läuft</h1>
      <p>Dieser Stack besteht aus:</p>
      <ul>
        <li><code>web</code> – nginx (das hier)</li>
        <li><code>redis</code> – Cache</li>
        <li><code>db</code> – PostgreSQL</li>
        <li><code>adminer</code> – Datenbank-GUI</li>
      </ul>
    </body>
    </html>
    ```

    ### `compose.yaml`

    ```yaml
    services:
      web:
        image: nginx:alpine
        restart: unless-stopped
        ports:
          - "8080:80"
        volumes:
          - ./html:/usr/share/nginx/html:ro

      db:
        image: postgres:16
        restart: unless-stopped
        environment:
          POSTGRES_USER: ${POSTGRES_USER}
          POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
          POSTGRES_DB: ${POSTGRES_DB}
        volumes:
          - db-data:/var/lib/postgresql/data
        healthcheck:
          test: ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER} -d $${POSTGRES_DB}"]
          interval: 5s
          timeout: 3s
          retries: 10
          start_period: 10s

      adminer:
        image: adminer
        restart: unless-stopped
        ports:
          - "8081:8080"
        depends_on:
          db:
            condition: service_healthy

      redis:
        image: redis:7-alpine
        restart: unless-stopped
        command: redis-server --requirepass ${REDIS_PASSWORD} --save 60 1
        volumes:
          - redis-data:/data
        healthcheck:
          test: ["CMD", "redis-cli", "-a", "${REDIS_PASSWORD}", "ping"]
          interval: 5s
          timeout: 3s
          retries: 10

    volumes:
      db-data:
      redis-data:
    ```

    ### `README.md`

    ```markdown
    # Mein Tech-Stack

    Vier-Service-Stack mit Web, Cache, DB und DB-GUI.

    ## Start

    1. `.env.example` nach `.env` kopieren, Werte eintragen.
    2. `docker compose up -d`.
    3. <http://localhost:8080> – Web-Seite
    4. <http://localhost:8081> – Adminer (Login: Server `db`, Rest aus `.env`)

    ## Stoppen (Daten bleiben)

    `docker compose down`

    ## Alles wegwerfen (auch Volumes)

    `docker compose down -v`
    ```

    ### Starten und testen

    ```bash
    cp .env.example .env    # und Werte eintragen
    docker compose up -d
    docker compose ps       # alles "healthy" oder "running"?
    ```

    ### Redis testen

    ```bash
    docker compose exec redis redis-cli -a "$REDIS_PASSWORD"
    ```
    Im Redis-Prompt: `SET foo bar`, `GET foo`, `exit`.

    ### Postgres testen

    In Adminer einloggen (Server: `db`), Tabelle anlegen, Daten einfügen.

    ### Persistenz-Test

    `docker compose down`, `docker compose up -d` – alles noch da.

    ### Aufräumen

    `docker compose down -v` – Volumes gelöscht, Daten weg.

    **Was du gelernt hast:** vier Services, zwei Netzwerke (automatisch), zwei persistente Volumes, ein Bind Mount, Healthchecks, `.env`-basiertes Secrets-Management, Health-basierte Startreihenfolge. Das ist **Produktions-nahes Docker-Compose**.

---

## Weiter mit

- [Docker für Profis](../docker-profi/index.md) – Dockerfile-Best-Practices und Image-Optimierung
- [Stolpersteine Compose](stolpersteine.md)
