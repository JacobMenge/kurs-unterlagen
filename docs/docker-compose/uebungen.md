---
title: "Übungen"
description: "Eigene Hands-on-Übungen zum Compose-Block, vier Schwierigkeitsgrade."
---

# Übungen: Docker Compose

Übungen zum Vertiefen von Docker Compose. Jeder `up -d` zeigt dir, wie elegant Multi-Container-Stacks werden, wenn man sie deklariert statt scriptet.

!!! abstract "Die vier Stufen"
    - 🟢 **Einsteiger**, jeder Schritt bis ins Detail
    - 🟡 **Mittel**, weniger Hand-Holding
    - 🔴 **Fortgeschritten**, Hinweise statt Rezepte
    - 🏆 **Challenge**, Aufgabe ohne Anleitung, Musterlösung aufklappbar


!!! note "Windows-Hinweis"
    Alle Docker-Befehle funktionieren unter macOS, Linux und Windows. Unter Windows nutzt du bitte die **PowerShell** (im Windows-Terminal). Einziger Unterschied bei mehrzeiligen Befehlen: Bash bricht Zeilen mit `\` um, PowerShell mit dem Backtick `` ` `` und CMD mit `^`. Du kannst jeden mehrzeiligen Befehl auch einfach in eine Zeile schreiben, dann ist er in jeder Shell gleich.

## Voraussetzung für alle Übungen

- Docker und `docker compose` sind verfügbar:
    ```bash
    docker compose version
    ```
- Ein Editor für Textdateien.
- Idealerweise den [Aufbau-Block](../docker-aufbau/index.md) durchgearbeitet.
- Keine anderen Stacks auf Port 8080. Laufen noch `kurs-compose` oder `staging` aus der Praxis, beendest du sie im jeweiligen Ordner mit `docker compose down`. `docker ps` zeigt, was noch läuft.

!!! warning "Dateien unter Windows anlegen"
    Lege jede Datei direkt aus der PowerShell im Projektordner an, zum Beispiel `notepad compose.yaml` oder `notepad .env`. Notepad fragt, ob es die Datei anlegen soll: **Ja**. Nicht über den Explorer („Neu → Textdokument") und nicht mit `echo … > datei`: Der Explorer hängt ein verstecktes `.txt` an und `>` schreibt in Windows PowerShell UTF-16, das Compose nicht lesen kann.

---

## 🟢 Einsteiger

### Übung 1: Erste `compose.yaml` mit nginx

!!! info "Was du lernst"
    - Eine `compose.yaml`-Datei anlegen
    - `docker compose up` und `down`
    - Vergleich zu `docker run`

#### Worum geht's: Kontext

**Docker Compose** ist ein Werkzeug, mit dem du einen Stack von Containern **in einer Textdatei beschreibst** und mit **einem Befehl** startest oder stoppst. Statt fünf `docker run`-Befehle einzeln zu tippen, schreibst du sie einmal in `compose.yaml` und sagst `docker compose up -d`.

#### Schritt 1: Projektordner

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

=== "Windows CMD"
    ```cmd
    mkdir %USERPROFILE%\compose-uebung1
    cd /d %USERPROFILE%\compose-uebung1
    ```

#### Schritt 2: `compose.yaml` anlegen

Lege eine Datei `compose.yaml` mit diesem Inhalt an, unter Windows mit `notepad compose.yaml`, unter macOS/Linux zum Beispiel mit `nano compose.yaml`:

```yaml
services:
  web:
    image: nginx:alpine
    ports:
      - "8080:80"
```

Bedeutung Zeile für Zeile:

- `services:`, Container-Liste (Top-Level-Block)
- `web:`, Service-Name (beliebig wählbar), zugleich DNS-Name im Stack. Der Container selbst heißt `compose-uebung1-web-1`.
- `image: nginx:alpine`, welches Image
- `ports: "8080:80"`, Port-Mapping wie bei `docker run -p`

Alle Schlüssel im Detail erklärt die Seite [Grundlagen der compose.yaml](grundlagen.md).

**Wichtig:** YAML ist **pingelig** mit Einrückung. Nutze **2 Leerzeichen** pro Ebene. **Keine Tabs**.

#### Schritt 3: Stack starten

```bash
docker compose up -d
```

Was passiert:

- Compose liest `compose.yaml`.
- Legt automatisch ein Netzwerk an (Name: Ordner_default).
- Zieht `nginx:alpine`, falls noch nicht lokal.
- Startet den Container `compose-uebung1-web-1`.

#### Schritt 4: Prüfen

```bash
docker compose ps
```

Zeigt alle Services deines Stacks.

```bash
docker compose logs
```

Zeigt die gesammelten Logs.

Im Browser: <http://localhost:8080> → nginx-Willkommensseite.

#### Schritt 5: Stack herunterfahren

```bash
docker compose down
```

Stoppt und entfernt alle Container des Stacks **und** das automatisch erzeugte Netzwerk.

!!! success "Geschafft!"
    Du hast einen Stack mit einer YAML-Datei beschrieben. Das ist **deklarative Konfiguration** in ihrer reinsten Form.

---

### Übung 2: Mehrere Services in einer `compose.yaml`

!!! info "Was du lernst"
    - Mehrere Container gleichzeitig deklarieren
    - Service-Namen als Hostnamen

#### Aufgabe

Baue einen Stack mit **zwei** Services: `web` (nginx) und `proxy` (httpd). Unterschiedliche Host-Ports.

#### Schritte

1. Neuer Ordner `compose-uebung2`, rein. In PowerShell: `mkdir $HOME\compose-uebung2; cd $HOME\compose-uebung2`.
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
    # Aus dem 'web'-Container die Startseite von 'proxy' abrufen:
    wget -q -O - http://proxy:80 | head -3
    exit
    ```
    Du siehst die httpd-Begrüßung, obwohl kein Port-Mapping zwischen den Services existiert. **Docker-DNS** macht's möglich.
6. `docker compose down`

---

## 🟡 Mittel

### Übung 3: WordPress mit MariaDB

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

Leg dafür einen neuen Ordner `compose-uebung3` an. Was `depends_on` und `restart` bedeuten, erklären die Abschnitte [depends_on](grundlagen.md#depends_on-startreihenfolge) und [restart](grundlagen.md#restart-automatischer-neustart).

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

`docker compose up -d`, dann <http://localhost:8080> → WordPress-Setup-Seite. Beim allerersten Start richtet MariaDB die Datenbank ein. Zeigt WordPress „Fehler beim Aufbau einer Datenbankverbindung", wartest du eine halbe Minute und lädst neu.

#### Persistenz-Test

1. WordPress aufsetzen (Sprache, Titel, Admin-User).
2. Einen Beitrag schreiben und veröffentlichen.
3. `docker compose down` (ohne `-v`!).
4. `docker compose up -d`.
5. Der Beitrag ist noch da.

Wenn du **alle** Daten löschen willst: `docker compose down -v` (mit `-v`!).

Wegen `restart: unless-stopped` startet der Stack nach jedem Neustart von Docker Desktop von selbst wieder. Beende ihn deshalb am Ende mit `docker compose down`, sonst bleibt Port 8080 belegt.

---

### Übung 4: `.env` mit Compose

!!! info "Was du lernst"
    - Variablen aus `.env` in `compose.yaml` nutzen
    - Secrets aus der YAML raushalten

#### Aufgabe

Baue den WordPress-Stack aus Übung 3 **um**:

- Alle Passwörter und Datenbank-Namen kommen aus einer `.env`-Datei.
- In `compose.yaml` stehen nur `${VARIABLE}`-Platzhalter.
- Lass Anführungszeichen in der `.env` weg. Compose käme damit zurecht und entfernt sie, `docker run --env-file` übernimmt sie dagegen wörtlich.
- Lege eine `.env.example` an (ohne Werte) und füge `.env` in eine `.gitignore` ein.
- Lege alle drei Dateien mit `notepad .env`, `notepad .env.example` und `notepad .gitignore` an, nie mit `>` (siehe Warnung oben).
- Wie `${VARIABLE}` funktioniert, zeigt der Abschnitt [Variablen aus .env](grundlagen.md#variablen-aus-env).

!!! warning "Neue Passwörter brauchen ein frisches Volume"
    MariaDB liest `MARIADB_USER`, `MARIADB_PASSWORD` und die übrigen Variablen nur beim allerersten Start mit leerem Volume. Setzt du in der `.env` andere Werte als in Übung 3, meldet WordPress „Fehler beim Aufbau einer Datenbankverbindung". Führe deshalb vor dem Umbau einmal `docker compose down -v` aus, danach legt MariaDB die Zugänge mit den neuen Werten an.

#### Erfolgs-Check

- `docker compose config` zeigt nach Variableinsatz die vollständige YAML. Darin stehen auch die Passwörter im Klartext, die Ausgabe gehört also nicht in einen Chat oder ein Ticket.
- `Get-Content .env.example` (PowerShell) bzw. `cat .env.example` (macOS/Linux) zeigt die Variablen-Namen ohne Werte (das kannst du einchecken).

---

## 🔴 Fortgeschritten

### Übung 5: Stack mit Healthcheck und depends_on-Condition

!!! info "Was du lernst"
    - `depends_on` mit `condition: service_healthy`
    - Healthcheck im Compose definieren
    - Warum `$$` in Healthchecks nötig ist

#### Szenario

Der `wordpress`-Container startet **bevor** die Datenbank bereit ist. In den ersten Sekunden zeigt WordPress dann nur „Fehler beim Aufbau einer Datenbankverbindung". Die Lösung: ein **Healthcheck** für die DB und `wordpress` wartet darauf.

#### Aufgabe

Erweitere den WordPress-Stack aus Übung 3 so, dass:

1. `db` einen Healthcheck hat, der das offizielle `healthcheck.sh`-Skript des MariaDB-Images nutzt, alle 5 Sekunden, bis zu 10 Retries.
2. `wordpress` mit `depends_on: db: condition: service_healthy` konfiguriert ist.

#### Hinweise

- Das MariaDB-Image bringt ein **eingebautes** Healthcheck-Script mit: `healthcheck.sh --connect --innodb_initialized`. Das ist die vom Image vorgesehene Lösung, robuster als `mariadb-admin ping`, weil es keine Auth-Argumente braucht.
- `docker compose ps` zeigt den Health-Status eines Services.
- Achte darauf, dass `depends_on` in der detaillierteren Form (`condition:`) strukturiert werden muss.

#### Erfolgs-Check

```bash
docker compose up -d
docker compose ps
```
Schon `docker compose up -d` wartet sichtbar: Bei `db` erscheint erst `Waiting`, dann `Healthy`, erst **danach** startet `wordpress`. `docker compose ps` zeigt anschließend bei `db` den Status `(healthy)`.

??? success "Musterlösung"

    ### `compose.yaml`

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
        healthcheck:
          # healthcheck.sh ist im MariaDB-Image eingebaut
          test: ["CMD", "healthcheck.sh", "--connect", "--innodb_initialized"]
          interval: 5s
          timeout: 3s
          retries: 10
          start_period: 10s

      wordpress:
        image: wordpress:latest
        restart: unless-stopped
        depends_on:
          db:
            condition: service_healthy
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

    ### Starten und Status beobachten

    ```bash
    docker compose up -d
    ```

    Der Befehl kehrt nicht sofort zurück. In seiner Ausgabe siehst du nacheinander:

    1. `Container …-db-1  Waiting`: Compose wartet auf den Healthcheck.
    2. `Container …-db-1  Healthy`: jetzt darf wordpress starten.
    3. `Container …-wordpress-1  Started`

    Erst danach bekommst du die Eingabe zurück. Ein anschließendes `docker compose ps` zeigt bei `db` den Status `(healthy)`.

    ### Ohne Healthcheck-Bedingung (Vergleich)

    Wenn du nur `depends_on: [db]` schreibst (ohne `condition`), startet `wordpress` **sofort**, auch wenn `db` noch 10 Sekunden braucht, bis es Anfragen akzeptiert. Die App stirbt dann mit Verbindungsfehler, außer sie hat eingebaute Retry-Logik.

    ### `$$` in Healthchecks, wofür das gut ist

    Falls dein Healthcheck eine ENV-Variable nutzen will, die Compose ebenfalls verwenden darf, musst du `$$` schreiben:

    ```yaml
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER}"]
    ```

    **Warum?** Compose parst `${VAR}` bereits, bevor der Container startet. Mit `$${VAR}` schreibst du buchstäblich `${VAR}` in die Container-Config und die Shell im Container ersetzt das dann zur Laufzeit. Ohne `$$` würde Compose die Variable schon selbst einsetzen (oder leer lassen, falls nicht gesetzt).

---

## 🏆 Challenge

### Challenge: Vollständiger Tech-Stack

!!! abstract "Aufgabe"
    Baue einen Stack mit **vier** Services, der dir sowohl eine kleine Webseite als auch Datenbank-Werkzeuge zeigt:

    1. **`web`**, nginx, liefert eine simple HTML-Seite aus (per Bind Mount)
    2. **`redis`**, Cache auf Port 6379 (intern, nicht vom Host erreichbar), mit Volume für Persistenz
    3. **`adminer`**, für eine PostgreSQL
    4. **`db`**, PostgreSQL mit Volume

    Anforderungen:

    - Alle Services in einer `compose.yaml`.
    - Secrets (`POSTGRES_PASSWORD`, `REDIS_PASSWORD`) aus `.env`.
    - Volumes für `db` und `redis`. Daten überleben `down` (ohne `-v`).
    - `web` mountet einen lokalen `html/`-Ordner als Bind-Mount.
    - Adminer hört auf Port 8081, nginx auf 8080.
    - Postgres und Redis haben Healthchecks; Adminer wartet auf `db: condition: service_healthy`.
    - `docker compose up -d` startet alles, `docker compose down` stoppt sauber.

    Bonus: Schreib eine `README.md` für diesen Stack, die erklärt, wie man ihn startet und wozu er gut ist.

??? success "Musterlösung"

    !!! tip "Dateien erstellen. OS-agnostisch"
        Die folgenden Code-Blöcke zeigen jeweils den **Dateiinhalt**. Erstelle die Dateien mit einem Editor und speichere sie unter dem angegebenen Namen. Unter Windows rufst du im Ordner `mein-stack` in der PowerShell `notepad .env`, `notepad .env.example`, `notepad .gitignore` und `notepad README.md` auf, dann `mkdir html` und `notepad html\index.html`. Nicht über den Explorer oder „Speichern unter" gehen, sonst entsteht zum Beispiel `.env.txt`. Fehlt der Ordner `html`, legt Docker ihn leer an und nginx antwortet mit `403 Forbidden`.

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
        <li><code>web</code>: nginx (das hier)</li>
        <li><code>redis</code>: Cache</li>
        <li><code>db</code>: PostgreSQL</li>
        <li><code>adminer</code>: Datenbank-Oberfläche</li>
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
        environment:
          # REDISCLI_AUTH wird automatisch von redis-cli als Passwort genutzt
          REDISCLI_AUTH: ${REDIS_PASSWORD}
        command: redis-server --requirepass ${REDIS_PASSWORD} --save 60 1
        volumes:
          - redis-data:/data
        healthcheck:
          # redis-cli nimmt REDISCLI_AUTH automatisch, kein -a-Flag nötig
          test: ["CMD", "redis-cli", "ping"]
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
    3. <http://localhost:8080>: Web-Seite
    4. <http://localhost:8081>: Adminer (Login: Server `db`, Rest aus `.env`)

    ## Stoppen (Daten bleiben)

    `docker compose down`

    ## Alles wegwerfen (auch Volumes)

    `docker compose down -v`
    ```

    ### Starten und testen

    Erstmal die `.env.example` zu deiner echten `.env` kopieren und die Werte ausfüllen:

    === "macOS / Linux"
        ```bash
        cp .env.example .env
        ```

    === "Windows PowerShell"
        ```powershell
        Copy-Item .env.example .env
        ```

    === "Windows CMD"
        ```cmd
        copy .env.example .env
        ```

    Dann starten:

    ```bash
    docker compose up -d
    docker compose ps
    ```

    Alle Services sollten `healthy` oder `running` zeigen.

    ### Redis testen

    ```bash
    docker compose exec redis redis-cli
    ```

    `redis-cli` liest im Container automatisch die Env-Variable `REDISCLI_AUTH` und authentifiziert sich damit, du musst nicht `-a` + Passwort tippen. Im Redis-Prompt: `SET foo bar`, `GET foo`, `exit`.

    ### Postgres testen

    In Adminer einloggen (Server: `db`), Tabelle anlegen, Daten einfügen.

    ### Persistenz-Test

    `docker compose down`, `docker compose up -d`, alles noch da.

    ### Aufräumen

    `docker compose down -v`. Volumes gelöscht, Daten weg.

    **Was du gelernt hast:** vier Services, ein Netzwerk (automatisch), zwei persistente Volumes, ein Bind Mount, Healthchecks, `.env`-basiertes Secrets-Management, Health-basierte Startreihenfolge. Das ist **Produktions-nahes Docker-Compose**.

---

## Weiter mit

- [Docker für Profis](../docker-profi/index.md): Dockerfile-Best-Practices und Image-Optimierung
- [Stolpersteine Compose](stolpersteine.md)
