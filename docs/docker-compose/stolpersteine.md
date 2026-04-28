---
title: "Stolpersteine Compose"
description: "Typische Probleme beim Arbeiten mit Docker Compose – YAML-Syntax, depends_on, Netzwerke zwischen Projekten, Healthchecks."
---

# Stolpersteine Compose

Diese Seite sammelt Compose-spezifische Probleme. Allgemeine Docker-Probleme (Container startet nicht, Platte voll, Apple-Silicon-Fallen) findest du im [Docker-Stolpersteine-Abschnitt](../docker/stolpersteine.md).

!!! info "Drei Säulen sind vorausgesetzt"
    Compose ist **keine Alternative** zu Volumes, ENV-Variablen und Netzwerken – es nutzt sie nur deklarativ. Wenn du Probleme dort hast, zuerst in die [Aufbau-Stolpersteine](../docker-aufbau/stolpersteine.md) schauen.

---

## YAML-Syntax und Parsing

??? danger "„validating compose.yaml: ...", kryptische YAML-Fehler"
    **Häufigste Ursachen:**

    1. **Tabs statt Leerzeichen**: YAML erlaubt nur Leerzeichen für Einrückung. Dein Editor sollte das konvertieren, wenn nicht – VSCode oder ein anderer Editor mit YAML-Support nehmen.
    2. **Falsche Einrückung**: alle Elemente auf gleicher Hierarchie-Ebene brauchen **gleiche Einrückung** (idealerweise 2 Leerzeichen).
    3. **Map vs. Liste vermischt**: `environment:` kann entweder als Map (`KEY: value`) oder als Liste (`- KEY=value`) geschrieben werden, nicht gemischt.

    **Debug-Hilfe:**
    ```bash
    docker compose config
    ```
    Zeigt die geparste YAML, Fehler mit Zeilenangabe.

??? warning "`${VAR}` erscheint wörtlich statt ersetzt"
    **Ursache:** `VAR` ist weder in einer `.env` noch in der Shell-Umgebung gesetzt.

    **Diagnose:**
    ```bash
    docker compose config | grep VAR
    ```
    Wenn dort noch `${VAR}` steht, hat Compose nichts zum Einsetzen gefunden.

    **Lösungen:**
    - `.env` im **gleichen Ordner** wie die `compose.yaml` anlegen.
    - Oder: explizit eine andere Datei angeben: `docker compose --env-file config/prod.env up -d`.
    - Oder: Variable in der Shell setzen und exportieren, bevor `docker compose` läuft.

??? warning "Ports müssen Strings sein"
    **Falsch:**
    ```yaml
    ports:
      - 8080:80    # Zahl-Notation, YAML interpretiert das falsch
    ```

    **Richtig:**
    ```yaml
    ports:
      - "8080:80"  # als String
    ```
    YAML interpretiert `8080:80` sonst als Sexagesimalzahl (Base 60), was zu seltsamen Port-Werten führt.

??? info "`$`-Zeichen in Passwörtern"
    In `compose.yaml` wird `$` als Variable gewertet. Literal-`$` schreibst du **verdoppelt**:
    ```yaml
    environment:
      DB_PASSWORD: my$$secret
    ```
    In der `.env`-Datei dagegen bleibt `$` wörtlich.

---

## depends_on und Startreihenfolge

??? danger "App startet zu früh – DB antwortet noch nicht"
    **Symptom:** App crasht mit „connection refused" beim Start, obwohl `depends_on: db` gesetzt ist.

    **Ursache:** `depends_on` **ohne** `condition` wartet nur, bis der Container **startet** – nicht bis der Dienst **bereit** ist. Postgres braucht bei frischem Volume 5–15 Sekunden, bis er Anfragen annimmt.

    **Lösung:** Healthcheck + `depends_on: condition: service_healthy`:

    ```yaml
    services:
      db:
        image: postgres:16
        environment:
          POSTGRES_PASSWORD: geheim
        healthcheck:
          test: ["CMD-SHELL", "pg_isready -U postgres"]
          interval: 5s
          timeout: 3s
          retries: 10
          start_period: 10s

      app:
        build: .
        depends_on:
          db:
            condition: service_healthy
    ```

    **Zusätzlich:** App sollte **selbst Retry-Logik** haben. In Produktion gehen DBs auch mal kurz offline – die App muss das aushalten.

??? warning "Healthcheck-Test schlägt endlos fehl"
    **Symptom:** `docker compose ps` zeigt den Service dauerhaft als `starting` oder `unhealthy`.

    **Checks:**

    1. **Befehl manuell ausprobieren:**
       ```bash
       docker compose exec db pg_isready -U kurs -d kursdaten
       ```
       Liefert das `accepting connections`? Wenn nein: der Befehl selbst passt nicht.
    2. **Falscher User**: `pg_isready -U postgres` prüft den Default-User. Wenn du einen anderen angelegt hast (`POSTGRES_USER=kurs`), musst du den nutzen.
    3. **`start_period` zu kurz**: Bei frischem Postgres-Volume kann die Initialisierung länger dauern. 15–30 Sekunden sind oft realistisch.

---

## Service-Kommunikation

??? danger "App findet DB nicht – „could not translate host name""
    **Fast immer:** Compose hat beide Services **in unterschiedliche Netzwerke** gelegt, oder du hast ein Custom-Netzwerk definiert, in dem einer fehlt.

    **Diagnose:**
    ```bash
    docker network ls
    # Suche nach <projektname>_default
    docker network inspect <projektname>_default
    ```

    **Der einfachste Fix:** Keine `networks:`-Blöcke angeben – Compose legt automatisch ein Default-Netzwerk an, in dem **alle Services** sind.

    **Wenn du Custom-Netzwerke brauchst:** Sicherstellen, dass beide Services explizit auflisten:
    ```yaml
    services:
      app:
        networks:
          - backend
      db:
        networks:
          - backend

    networks:
      backend:
    ```

??? info "Service-Name vs. Container-Name"
    Compose benennt die Container intern als `<projekt>-<service>-<nummer>`, z.B. `kurs-compose-db-1`. Aber:

    - **Im Netzwerk** ist der Service erreichbar unter dem **Service-Namen** (`db`), nicht dem Container-Namen.
    - `docker compose exec db bash` nutzt ebenfalls den Service-Namen.
    - Nur `docker ps` zeigt die vollen Container-Namen.

??? warning "Zwei Compose-Projekte sollen miteinander reden"
    **Szenario:** Projekt A hat die DB, Projekt B die App. Sie sollen über Docker-Netzwerk kommunizieren.

    **Lösung:** Gemeinsames externes Netzwerk.

    Erst außerhalb anlegen:
    ```bash
    docker network create shared-net
    ```

    In beiden `compose.yaml`:
    ```yaml
    networks:
      shared:
        external: true
        name: shared-net
    ```

    Und bei allen Services, die dranhängen sollen:
    ```yaml
    services:
      db:
        networks:
          - shared
    ```

---

## Volumes und Daten

??? danger "`docker compose down -v` hat alle Daten gelöscht"
    **Ursache:** Das `-v` entfernt benannte Volumes. Bewusste Entscheidung von Compose, aber schmerzhaft.

    **Zum Vorbeugen:**
    - Zum **Stoppen** immer nur `docker compose down` (ohne `-v`).
    - Volumes gezielt löschen, wenn du das wirklich willst.

    **Zum Retten danach:**
    - Existiert noch ein Backup? → Einspielen.
    - Sonst: die Daten sind weg.

??? warning "Volume wird anders benannt als gedacht"
    Compose packt dem Volume-Namen einen **Projekt-Präfix** davor. Aus `volumes: postgres-daten` wird je nach Projektordner `kurs-compose_postgres-daten`.

    **Check:**
    ```bash
    docker volume ls
    ```

    **Verhalten fixieren – Projektname als Umgebungsvariable:**

    === "macOS / Linux"
        ```bash
        export COMPOSE_PROJECT_NAME=kurs
        ```

    === "Windows PowerShell"
        ```powershell
        $env:COMPOSE_PROJECT_NAME = "kurs"
        ```

    === "Windows CMD"
        ```cmd
        set COMPOSE_PROJECT_NAME=kurs
        ```

    Oder per Flag direkt am Aufruf: `docker compose -p kurs up -d`.

??? info "External Volume – vorhandenes Volume ohne Projekt-Präfix nutzen"
    ```yaml
    volumes:
      meine-daten:
        external: true
        name: meine-bestehenden-daten
    ```

---

## Build und Images

??? warning "Änderungen am Dockerfile greifen nicht"
    **Ursache:** Compose baut nur, wenn es explizit gesagt bekommt oder eine Änderung detektiert.

    **Lösung:**
    ```bash
    docker compose up -d --build
    ```

    Bei hartnäckigen Caching-Problemen:
    ```bash
    docker compose build --no-cache app
    docker compose up -d
    ```

??? warning "Compose zieht Image aus Registry statt lokal zu bauen"
    **Ursache:** In `compose.yaml` steht `image:` **ohne** `build:`, und lokal gibt es kein Image mit diesem Namen.

    **Lösung:** `build:` hinzufügen. Wenn beides da ist, baut Compose lokal und taggt das Ergebnis mit dem angegebenen Image-Namen.

    ```yaml
    services:
      app:
        build: .
        image: meine-firma/app:1.0
    ```

---

## Compose-CLI

??? danger "„no configuration file provided"
    **Ursache:** Du bist nicht im Ordner mit der `compose.yaml`.

    **Lösung:**
    - `ls -la | grep -i compose` – ist die Datei da?
    - Oder explizit: `docker compose -f ../anderer/ordner/compose.yaml up -d`.

??? warning "`docker-compose` vs. `docker compose`"
    **Alt:** `docker-compose` mit Bindestrich (Python, Compose V1) – **veraltet**, keine Updates mehr.

    **Neu:** `docker compose` mit Leerzeichen (Go, Compose V2) – **aktueller Standard**.

    Wenn nur das alte installiert ist:

    === "macOS / Windows (Docker Desktop)"
        Docker Desktop bringt seit 2022 das Compose-V2-Plugin schon mit. Falls bei dir trotzdem nur `docker-compose` (mit Bindestrich) klappt: Docker Desktop auf die aktuelle Version aktualisieren (Wal-Icon → Check for Updates).

    === "Linux (Ubuntu/Debian)"
        ```bash
        sudo apt-get update
        sudo apt-get install -y docker-compose-plugin
        ```

    === "Linux (Fedora/RHEL/Rocky/Alma)"
        ```bash
        sudo dnf install -y docker-compose-plugin
        ```

    === "Linux (Arch)"
        ```bash
        sudo pacman -S docker-compose
        ```

??? info "Mehrere Compose-Dateien layern"
    ```bash
    docker compose -f compose.yaml -f compose.dev.yaml up -d
    ```

    Spätere Dateien überschreiben frühere. Klassische Verwendung:

    - `compose.yaml` – Basis
    - `compose.dev.yaml` – lokale Entwicklung (Live-Mounts, Debug-Ports)
    - `compose.prod.yaml` – Produktion (Restart-Policies, keine Debug-Tools)

---

## Wenn nichts hilft

??? info "Systematisches Debugging"
    1. **YAML validieren:** `docker compose config`
    2. **Einzelnen Service-Log:** `docker compose logs service-name`
    3. **In Container reinspringen:** `docker compose exec service-name sh`
    4. **Netzwerk-Test von Service zu Service:**
       ```bash
       docker compose exec app ping db
       docker compose exec app nslookup db
       ```
    5. **Hart resetten:**
       ```bash
       docker compose down
       docker compose build --no-cache
       docker compose up -d
       ```
    6. **Alles komplett neu**:
       ```bash
       docker compose down -v --rmi all
       docker compose up -d --build
       ```

!!! tip "Vorbeugend"
    - Explizite Versionen in `image:`, kein `:latest`.
    - Healthchecks überall, wo Services aufeinander warten müssen.
    - `.env` konsequent in `.gitignore`.
    - `docker compose config` vor dem ersten `up` auf Syntax prüfen.
