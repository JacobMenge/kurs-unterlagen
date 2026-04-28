---
title: "Compose – Grundlagen"
description: "Die compose.yaml-Syntax Schritt für Schritt: services, volumes, networks, depends_on, healthcheck, profiles. Mit Erklärung jedes Schlüssels."
---

# Compose – Grundlagen der `compose.yaml`

!!! abstract "Lernziel"
    Nach dieser Seite kannst du:

    - die Struktur einer `compose.yaml` in ihre Bausteine zerlegen
    - die wichtigsten Schlüssel unter `services:` lesen und schreiben (`image`, `build`, `ports`, `environment`, `volumes`, `depends_on`, `healthcheck`, `restart`, `networks`)
    - Top-Level-Blöcke `volumes:` und `networks:` einsetzen
    - `depends_on` mit `healthcheck` sinnvoll kombinieren
    - Variablen aus `.env` in `compose.yaml` einsetzen

---

## Die Anatomie einer `compose.yaml`

Eine vollständige `compose.yaml` hat in der Regel drei Top-Level-Blöcke:

```yaml
services:
  # hier kommen die Container rein
  ...

volumes:
  # hier werden benannte Volumes deklariert
  ...

networks:
  # hier werden eigene Netzwerke deklariert (optional)
  ...
```

Der wichtigste Block ist **`services:`**. Alles andere ist Zusatz.

!!! info "Wo ist das alte `version:`-Feld?"
    Bis Compose V1 stand ganz oben eine Zeile wie `version: "3.8"`. In **Compose V2** ist das Feld **obsolet** und wird ignoriert. Du kannst es weglassen. Wenn du alte Tutorials siehst, die mit `version:` anfangen: kein Drama, aber nicht nötig.

---

## `services:` – die Container deines Stacks

Jeder Eintrag unter `services:` wird zu einem Container. Beispiel:

```yaml
services:
  web:
    image: nginx:alpine
    ports:
      - "8080:80"
```

- `web` ist der **Service-Name**. Er ist gleichzeitig der **DNS-Name** im Compose-Netzwerk (andere Services erreichen ihn über `web`).
- `image: nginx:alpine` sagt, welches Image gezogen werden soll.
- `ports:` mapped Host zu Container.

### `image` vs. `build`

**Du nutzt `image:`**, wenn du ein **fertiges** Image von einer Registry nimmst:

```yaml
services:
  db:
    image: postgres:16
```

**Du nutzt `build:`**, wenn du ein **eigenes** Image aus einem Dockerfile baust:

```yaml
services:
  app:
    build: .
```

`build: .` bedeutet: „Bau aus dem Dockerfile im aktuellen Ordner."

Ausführlichere Variante:

```yaml
services:
  app:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
      args:
        PYTHON_VERSION: "3.12"
    image: meine-firma/app:1.0   # optional: gibt dem Build einen expliziten Namen
```

!!! tip "image + build kombinieren"
    Wenn du `build:` **und** `image:` setzt, baut Compose lokal und taggt das Ergebnis mit dem angegebenen Namen. Das ist praktisch, wenn du das gleiche Image später pushen willst.

### `ports` – Port-Mapping

Format: `"HOST:CONTAINER"`, immer **als String** geschrieben (wegen YAML-Eigenheiten bei Zahlen).

```yaml
ports:
  - "8080:80"       # Host 8080 → Container 80
  - "127.0.0.1:8081:80"  # nur auf Localhost binden, nicht nach außen
  - "3000-3002:3000-3002"  # Port-Bereich
```

!!! warning "Ports brauchst du nur für Zugriff von außen"
    Für Container-zu-Container-Kommunikation innerhalb des Stacks brauchst du **kein** `ports:`. Die Services erreichen sich über den Service-Namen auf allen Ports, die der Container intern hört.

    Beispiel: Wenn deine App über `db:5432` auf Postgres zugreift, brauchst du **keinen** `ports:`-Block am `db`-Service.

### `environment` – ENV-Variablen

Zwei Schreibweisen sind erlaubt:

=== "Map-Form (lesbar, empfohlen)"
    ```yaml
    environment:
      POSTGRES_USER: kurs
      POSTGRES_PASSWORD: geheim
      POSTGRES_DB: kursdaten
    ```

=== "Listen-Form (kompakt)"
    ```yaml
    environment:
      - POSTGRES_USER=kurs
      - POSTGRES_PASSWORD=geheim
      - POSTGRES_DB=kursdaten
    ```

Beide funktionieren. Wählt einen Stil und bleibt konsistent.

### `env_file` – Variablen aus Datei laden

Statt jede Variable einzeln aufzulisten, kannst du auf eine Datei verweisen:

```yaml
services:
  app:
    image: meine-app
    env_file:
      - app.env
```

Format der `app.env`:

```
POSTGRES_USER=kurs
POSTGRES_PASSWORD=geheim
POSTGRES_DB=kursdaten
```

!!! danger "env_file und Git"
    Siehe [Umgebungsvariablen → .env und Git](../docker-aufbau/umgebungsvariablen.md). Wenn Secrets drinstehen: **nicht einchecken**, `.gitignore` eintragen.

### `volumes` pro Service

Genauso wie `-v` beim `docker run`:

```yaml
services:
  db:
    image: postgres:16
    volumes:
      - postgres-daten:/var/lib/postgresql/data   # Named Volume
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql:ro   # Bind Mount, read-only
      - /tmp/dbtemp:/tmp                          # Bind Mount mit absolutem Pfad

volumes:
  postgres-daten:
```

**Wichtig:** Benannte Volumes (die ohne `/` am Anfang) müssen auch im Top-Level-Block `volumes:` deklariert werden (siehe ganz unten).

### `depends_on` – Startreihenfolge

```yaml
services:
  db:
    image: postgres:16

  app:
    build: .
    depends_on:
      - db
```

`depends_on` sagt Compose: starte erst `db`, dann `app`.

!!! warning "depends_on wartet nur auf *Start*, nicht auf *Bereitschaft*"
    `depends_on: db` startet den DB-Container **bevor** den App-Container. Aber **nicht** wartet Compose darauf, dass Postgres **fertig initialisiert** ist und Queries annehmen kann.

    Für echtes „warte, bis DB bereit" brauchst du ein **Healthcheck** plus eine längere `depends_on`-Syntax (siehe gleich).

### `healthcheck` – Bereitschaft prüfen

```yaml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_USER: kurs
      POSTGRES_PASSWORD: geheim
      POSTGRES_DB: kursdaten
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER} -d $${POSTGRES_DB}"]
      interval: 5s
      timeout: 3s
      retries: 10
      start_period: 10s
```

!!! tip "Warum `$${...}` mit doppeltem `$`?"
    Compose interpretiert `$VAR` als YAML-Variable. Mit `$$` schreibst du **ein** `$`, das im Container angekommt – so kann Bash die Umgebungsvariable dort auflösen. `pg_isready` kennt sonst weder User noch Datenbank, prüft Default-Postgres, und der Check wäre unzuverlässig.

Was die Felder bedeuten:

| Feld | Bedeutung |
|------|-----------|
| `test` | Befehl, der ausgeführt wird. Liefert er 0 = gesund, nicht-0 = ungesund |
| `interval` | wie oft der Test läuft |
| `timeout` | wie lange auf eine Antwort gewartet wird |
| `retries` | wie viele Fehlschläge toleriert werden, bevor Status „unhealthy" |
| `start_period` | Grace-Period nach dem Start, in der Fehlschläge nicht zählen |

### `depends_on` mit Healthcheck

So wartet die App wirklich, bis die DB bereit ist:

```yaml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: geheim
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      retries: 10

  app:
    build: .
    depends_on:
      db:
        condition: service_healthy
```

Jetzt startet `app` erst, wenn `db` als „healthy" markiert ist.

### `restart` – automatischer Neustart

```yaml
services:
  app:
    image: meine-app
    restart: unless-stopped
```

Optionen:

- `no` (Default) – kein automatischer Neustart
- `always` – immer neu starten, auch wenn der Container ordentlich beendet wurde
- `on-failure` – nur bei Fehler-Exit
- `unless-stopped` – wie `always`, aber respektiert manuelles `docker stop`

Für Entwicklung meistens `no`, für kleine Self-Hosting-Setups `unless-stopped`.

### `command` – den Default-Befehl überschreiben

```yaml
services:
  db:
    image: postgres:16
    command: postgres -c log_statement=all
```

Überschreibt das `CMD` aus dem Image. Hier: Postgres startet mit zusätzlichem Logging.

### `networks` pro Service

Wenn du mehrere Netzwerke hast, kannst du pro Service wählen:

```yaml
services:
  app:
    image: meine-app
    networks:
      - frontend
      - backend

networks:
  frontend:
  backend:
```

Wenn du nichts angibst, landet der Service im **Default-Netzwerk** des Compose-Projekts (Compose legt automatisch eines an, Namen wie `projektname_default`).

---

## Top-Level-Blöcke

### `volumes:`

Benannte Volumes müssen hier deklariert werden:

```yaml
volumes:
  postgres-daten:
  uploads:
  cache:
```

Ohne weitere Konfiguration legt Compose das Volume mit Standard-Treiber an.

Wenn du ein **existierendes** Volume benutzen willst (nicht von Compose verwaltet):

```yaml
volumes:
  postgres-daten:
    external: true
```

### `networks:`

Eigene Netzwerke:

```yaml
networks:
  frontend:
  backend:
    driver: bridge
    ipam:
      config:
        - subnet: 10.20.0.0/16
```

Die meisten Stacks brauchen keine Netzwerk-Konfiguration – das Default-Netzwerk reicht.

---

## Variablen aus `.env`

Compose liest automatisch eine `.env` im gleichen Ordner wie die `compose.yaml`. Werte daraus kannst du in der YAML mit `${NAME}` einsetzen:

`.env`:

```
POSTGRES_PASSWORD=ichbinsehrgeheim
APP_PORT=8080
```

`compose.yaml`:

```yaml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}

  app:
    build: .
    ports:
      - "${APP_PORT}:8000"
    environment:
      DATABASE_URL: postgres://postgres:${POSTGRES_PASSWORD}@db:5432/postgres
```

!!! tip "Mit Default-Werten"
    ```yaml
    ports:
      - "${APP_PORT:-8080}:8000"
    ```

    Wenn `APP_PORT` nicht gesetzt ist, nimmt Compose `8080`.

!!! danger "Nochmal: .env in .gitignore"
    Wenn in der `.env` **Passwörter oder Keys** stehen: **nicht einchecken**. Eine `.env.example` mit leeren Werten als Vorlage ist der übliche Weg.

---

## Ein vollständiges, kommentiertes Beispiel

```yaml
# 1) Die Services – das sind die Container
services:

  # 1a) Die Datenbank
  db:
    image: postgres:16
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-kurs}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB:-kursdaten}
    volumes:
      - postgres-daten:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-kurs}"]
      interval: 5s
      retries: 10

  # 1b) Die App, aus dem lokalen Dockerfile gebaut
  app:
    build: .
    restart: unless-stopped
    environment:
      DATABASE_URL: postgres://${POSTGRES_USER:-kurs}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB:-kursdaten}
      LOG_LEVEL: ${LOG_LEVEL:-info}
    ports:
      - "${APP_PORT:-8000}:8000"
    depends_on:
      db:
        condition: service_healthy

# 2) Benannte Volumes (nur deklariert, damit Compose sie kennt)
volumes:
  postgres-daten:
```

Mit dieser YAML:

```bash
echo "POSTGRES_PASSWORD=geheim" > .env
docker compose up -d
```

Läuft ein produktionsähnlicher Stack. Alles, was in der vorigen Einheit manuell war, ist hier deklarativ.

---

## Profile – verschiedene Varianten desselben Stacks

Mit `profiles:` kannst du Services an- und abschalten, ohne die YAML zu ändern:

```yaml
services:
  app:
    build: .

  db:
    image: postgres:16

  adminer:
    image: adminer
    ports:
      - "8081:8080"
    profiles:
      - debug
```

`docker compose up -d` startet nur `app` und `db`.
`docker compose --profile debug up -d` startet zusätzlich `adminer`.

Praktisch, um **optionale Dienste** (Debug-Tools, Test-Seeds) sauber von Default zu trennen.

---

## `docker compose config` – YAML prüfen

```bash
docker compose config
```

Zeigt die komplett aufgelöste YAML nach Einsetzen von `.env`-Variablen und Defaults. Super zum Debuggen:

- Sind die Variablen richtig eingesetzt?
- Erkennt Compose deine Struktur?
- Syntax-Fehler werden hier sofort sichtbar.

---

## Stolpersteine

??? warning "YAML-Einrückung geht schief"
    YAML ist super allergisch gegen gemischte Tabs und Leerzeichen. Immer **2 Leerzeichen** pro Ebene, keine Tabs.

    **Ein Editor mit YAML-Support** (VSCode, IntelliJ, Vim mit Plugins) zeigt Einrückungsfehler sofort.

??? warning "„networks of services differ" nach Änderung"
    Wenn du die `compose.yaml` im laufenden Betrieb änderst und `docker compose up -d` machst, sagt Compose manchmal: „kann den Service nicht aktualisieren, Netzwerk unterscheidet sich".

    **Lösung:**
    ```bash
    docker compose down
    docker compose up -d
    ```

    Einmal sauber abbauen, dann neu starten.

??? warning "Compose findet `.env` nicht"
    Die Datei muss **im selben Ordner wie die `compose.yaml`** liegen. Nicht im Unter-Ordner, nicht im Home. Oder explizit angeben:

    ```bash
    docker compose --env-file config/production.env up -d
    ```

??? info "Mehrere Compose-Dateien layern"
    ```bash
    docker compose -f compose.yaml -f compose.dev.yaml up -d
    ```

    Die zweite Datei überschreibt/erweitert Werte aus der ersten. Typische Nutzung:

    - `compose.yaml` für die Basis-Definition
    - `compose.dev.yaml` für Entwicklung (Live-Mounts, Debug-Ports)
    - `compose.prod.yaml` für Produktion (Restart-Policies, Secrets, Scaling)

??? info "`docker compose watch` – Autoreload bei Code-Änderungen"
    Seit Compose v2.22 gibt es einen eingebauten „Watch"-Modus:

    ```yaml
    services:
      app:
        build: .
        develop:
          watch:
            - action: sync
              path: ./src
              target: /app/src
            - action: rebuild
              path: requirements.txt
    ```

    Dann:

    ```bash
    docker compose watch
    ```

    Compose überwacht Dateien und synct oder baut automatisch. Super für iterative Entwicklung – aber fortgeschritten.

---

## Merksatz

!!! success "Merksatz"
    > **`services:` definiert Container, `volumes:` und `networks:` sind Top-Level-Deklarationen. `depends_on` ohne `healthcheck` wartet nur auf den Start, nicht auf die Bereitschaft.**

---

## Weiterlesen

- [Praxis: Compose-WebApp](praxis-webapp.md) – jetzt bauen wir den Stack aus der manuellen Praxis mit Compose
- [Cheatsheet Docker Compose](../cheatsheets/compose.md)
