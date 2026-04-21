---
title: "Cheatsheet – Docker Compose"
description: "Die wichtigsten Compose-Befehle und YAML-Schlüssel als Tabellen – zum schnellen Nachschlagen."
---

# Cheatsheet – Docker Compose

!!! info "Compose V2"
    Alle Befehle nutzen `docker compose` (mit Leerzeichen). Das ältere `docker-compose` (mit Bindestrich) ist Compose V1 und veraltet.

## Grundlagen

| Befehl | Bedeutung |
|--------|-----------|
| `docker compose version` | Compose-Version anzeigen |
| `docker compose config` | Die aufgelöste `compose.yaml` ausgeben (inkl. `.env`-Ersetzungen) |
| `docker compose ls` | Alle laufenden Compose-Projekte anzeigen |

## Stack starten und stoppen

| Befehl | Bedeutung |
|--------|-----------|
| `docker compose up` | Alle Services im Vordergrund starten |
| `docker compose up -d` | Im Hintergrund starten (detached) |
| `docker compose up -d --build` | Images neu bauen und starten |
| `docker compose up -d app` | Nur einen bestimmten Service starten |
| `docker compose stop` | Alle Services stoppen (Container bleiben) |
| `docker compose start` | Gestoppte Services wieder starten |
| `docker compose restart` | Alle Services neu starten |
| `docker compose restart app` | Nur einen Service neu starten |
| `docker compose down` | Stoppen und Container + Netzwerk entfernen |
| `docker compose down -v` | Zusätzlich Volumes entfernen (**Daten weg!**) |
| `docker compose down --rmi all` | Zusätzlich alle selbst gebauten Images entfernen |

## Status und Inspektion

| Befehl | Bedeutung |
|--------|-----------|
| `docker compose ps` | Status aller Services |
| `docker compose ps -a` | Auch gestoppte Container anzeigen |
| `docker compose top` | Prozesse in allen Containern |
| `docker compose images` | Images, die vom Stack genutzt werden |
| `docker compose port app 8000` | Welchen Host-Port ist Container-Port 8000 gemappt? |

## Logs

| Befehl | Bedeutung |
|--------|-----------|
| `docker compose logs` | Alle Logs aller Services, einmalig |
| `docker compose logs -f` | Live-Logs aller Services folgen |
| `docker compose logs app` | Nur Logs von Service `app` |
| `docker compose logs --tail 50 app` | Letzte 50 Zeilen von `app` |
| `docker compose logs --since 10m` | Nur die letzten 10 Minuten |

## In Container springen

| Befehl | Bedeutung |
|--------|-----------|
| `docker compose exec app bash` | Bash im laufenden `app`-Container öffnen |
| `docker compose exec app sh` | Shell (für Alpine & Co) |
| `docker compose exec db psql -U kurs` | Einen bestimmten Befehl ausführen |
| `docker compose run --rm app python script.py` | Wegwerf-Container aus Service-Definition |

Unterschied:

- **`exec`** nutzt einen **laufenden** Container.
- **`run`** startet einen **neuen** Container aus der Service-Definition.

## Build

| Befehl | Bedeutung |
|--------|-----------|
| `docker compose build` | Alle Services mit `build:` bauen |
| `docker compose build app` | Nur einen Service |
| `docker compose build --no-cache` | Build ohne Cache erzwingen |
| `docker compose build --pull` | Basis-Images immer neu ziehen |

## Scale (mehrere Instanzen)

| Befehl | Bedeutung |
|--------|-----------|
| `docker compose up -d --scale app=3` | Drei Instanzen des `app`-Service |

!!! warning "Scale braucht einen Load-Balancer"
    Ohne Load-Balancer davor (nginx, Traefik) ist Scale nur für Tests sinnvoll – jeder Request landet auf einer zufälligen Instanz.

## Volumes

| Befehl | Bedeutung |
|--------|-----------|
| `docker volume ls` | Alle Volumes im System |
| `docker compose ps -a` + `docker volume inspect <name>` | Einzelnes Volume genauer anschauen |
| `docker run --rm -v volname:/data alpine ls /data` | Volume-Inhalt einsehen |

## Netzwerke

| Befehl | Bedeutung |
|--------|-----------|
| `docker network ls` | Alle Netzwerke im System |
| `docker network inspect <projekt>_default` | Compose-Standard-Netzwerk anschauen |

---

## YAML-Snippets – die häufigsten Bausteine

### Minimaler Service

```yaml
services:
  app:
    image: nginx:alpine
    ports:
      - "8080:80"
```

### Service aus lokalem Dockerfile

```yaml
services:
  app:
    build: .
    ports:
      - "8000:8000"
```

### Mit ausführlichem Build

```yaml
services:
  app:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
      args:
        PYTHON_VERSION: "3.12"
```

### Umgebungsvariablen

```yaml
services:
  app:
    image: meine-app
    environment:
      LOG_LEVEL: debug
      DATABASE_URL: postgres://user:pass@db:5432/mydb
```

Oder aus Datei:

```yaml
services:
  app:
    env_file:
      - app.env
```

### Volume (benannt)

```yaml
services:
  db:
    image: postgres:16
    volumes:
      - postgres-daten:/var/lib/postgresql/data

volumes:
  postgres-daten:
```

### Bind Mount (Host-Pfad)

```yaml
services:
  web:
    image: nginx:alpine
    volumes:
      - ./html:/usr/share/nginx/html:ro
```

### Netzwerke

```yaml
services:
  web:
    image: nginx:alpine
    networks:
      - frontend
  api:
    image: meine-api
    networks:
      - frontend
      - backend
  db:
    image: postgres:16
    networks:
      - backend

networks:
  frontend:
  backend:
```

### `depends_on` mit Healthcheck

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

### Restart-Policy

```yaml
services:
  app:
    image: meine-app
    restart: unless-stopped
```

Optionen: `no` (Default), `always`, `on-failure`, `unless-stopped`.

### Ressourcen-Limits

```yaml
services:
  app:
    image: meine-app
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.1'
          memory: 128M
```

### Profile (optionale Services)

```yaml
services:
  app:
    image: meine-app

  adminer:
    image: adminer
    ports:
      - "8081:8080"
    profiles:
      - debug
```

Start:

```bash
docker compose up -d                        # ohne adminer
docker compose --profile debug up -d        # mit adminer
```

### Variablen aus `.env`

`.env`:

```
POSTGRES_PASSWORD=geheim
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
      - "${APP_PORT:-8000}:8000"
```

!!! danger ".env in .gitignore!"
    Niemals mit Secrets in Git einchecken.

### Mehrere Compose-Dateien layern

`compose.yaml` (Basis):

```yaml
services:
  app:
    image: meine-app
```

`compose.dev.yaml` (Override für Entwicklung):

```yaml
services:
  app:
    build: .            # lokal bauen statt Image ziehen
    volumes:
      - .:/app          # Live-Mount
    environment:
      DEBUG: "true"
```

Nutzung:

```bash
docker compose -f compose.yaml -f compose.dev.yaml up -d
```

---

## Minimal-Workflow

```bash
# Im Projekt-Ordner mit compose.yaml:

docker compose up -d              # starten
docker compose logs -f            # schauen, ob alles ok
docker compose ps                 # Status
docker compose exec app bash      # rein in Container
# ... arbeiten ...
docker compose down               # aufräumen (Volumes bleiben)
```

Nach einer Änderung an der `compose.yaml` oder am Dockerfile:

```bash
docker compose up -d --build      # neu bauen und neu starten
```

Komplett-Reset (Achtung, Daten weg):

```bash
docker compose down -v --rmi all
```

---

## Troubleshooting-Kurzformeln

| Problem | Zuerst probieren |
|---------|------------------|
| Service startet nicht | `docker compose logs service-name` |
| YAML-Fehler | `docker compose config` |
| Änderung greift nicht | `docker compose up -d --build` |
| Alles ist durcheinander | `docker compose down && docker compose up -d` |
| Container reden nicht miteinander | `docker compose exec app ping db` |
| „is unhealthy" | `docker compose exec db <test-cmd>` manuell |
| Image extrem groß | `docker history image-name` |

---

Für ausführlichere Erklärungen:

- [Docker Compose – Einführung](../docker-compose/einfuehrung.md)
- [Compose – Grundlagen](../docker-compose/grundlagen.md)
- [Stolpersteine im Compose-Block](../docker-compose/stolpersteine.md)
