---
title: "Dockerfile-Best-Practices"
description: "Multi-Stage-Builds, USER, HEALTHCHECK, Layer-Optimierung, ENTRYPOINT und Signal-Handling – damit dein Image schlank, schnell und sicher ist."
---

# Dockerfile-Best-Practices

!!! abstract "Lernziel"
    Nach dieser Seite kannst du:

    - ein **Multi-Stage-Build-Dockerfile** schreiben und erklären, warum es so viel spart
    - mit **`USER`** deinen Container nicht mehr als root laufen lassen
    - **`HEALTHCHECK`** sinnvoll einbauen
    - **Layer-Caching** aktiv für kurze Build-Zeiten nutzen
    - den Unterschied zwischen **`CMD`** und **`ENTRYPOINT`** einordnen

---

## Warum das wichtig ist

Im [Einführungs-Block](../docker/dockerfile-grundlagen.md) hast du ein minimales Dockerfile geschrieben. Das reicht für Demos. Für echte Projekte gilt:

- **Images werden oft gebaut** – Build-Zeit ist ein Produktivitätsfaktor.
- **Images werden verteilt** – Größe und Sicherheit zählen.
- **Images laufen in Produktion** – Fehler wie „läuft als root mit allen Rechten" sind reale Angriffsflächen.

Diese Seite bringt dich auf ein Niveau, mit dem du **deinem eigenen Image im Ernstfall vertrauen** kannst.

---

## 1. Layer-Caching aktiv nutzen

### Die Regel

> **Lege in deinem Dockerfile selten geänderte Dinge nach oben, oft geänderte nach unten.**

Jede Instruktion erzeugt einen Layer. Ändert sich ein Layer, werden alle darunterliegenden **neu gebaut**. Layer darüber bleiben im Cache.

### Schlecht

```dockerfile
FROM python:3.12-slim
WORKDIR /app

COPY . .                              # <- kopiert ALLES, inklusive requirements.txt
RUN pip install -r requirements.txt    # <- wird bei jeder Code-Änderung neu ausgeführt
CMD ["python", "app.py"]
```

Jede Änderung an `app.py` invalidiert den `COPY`-Layer – und damit auch den `pip install`-Layer darunter. Dein Build dauert jedes Mal Minuten.

### Besser

```dockerfile
FROM python:3.12-slim
WORKDIR /app

COPY requirements.txt .                # <- seltener geändert, gecached
RUN pip install --no-cache-dir -r requirements.txt

COPY . .                               # <- oft geändert, aber Abhängigkeiten sind cached
CMD ["python", "app.py"]
```

Jetzt wird `pip install` nur neu ausgeführt, wenn sich `requirements.txt` **tatsächlich** ändert. Bei Code-Änderungen: Sekunden statt Minuten.

### Faustregel-Reihenfolge im Dockerfile

1. `FROM` (Basis-Image)
2. Paket-Manager-Cache, System-Pakete (`apt-get`, `apk`, `dnf`) – sehr selten geändert
3. Anwendungs-Abhängigkeiten (`requirements.txt`, `package.json` + `package-lock.json`) – selten geändert
4. Anwendungs-Code – oft geändert
5. `CMD` / `ENTRYPOINT` – ganz unten

---

## 2. `.dockerignore` schlank halten

Alles im Build-Kontext wird an den Docker-Daemon geschickt – auch wenn es das `COPY` nicht abholt. Große Kontext-Ordner machen Builds langsam.

**Beispiel-`.dockerignore`:**

```
.git/
.github/
node_modules/
__pycache__/
*.pyc
.venv/
venv/
.env
.env.*
*.log
*.md
.idea/
.vscode/
.DS_Store
coverage/
dist/
build/
```

Bonus: du verhinderst, dass Secrets (`.env`) oder unnötige Daten in das Image wandern.

---

## 3. Multi-Stage-Builds – kleine, sichere Images

Das ist **der größte einzelne Gewinn** für Image-Qualität.

### Das Problem mit Ein-Stufen-Builds

Viele Anwendungen brauchen zum **Bauen** mehr Werkzeug als zum **Laufen**. Beispiele:

- **Go**: `go build` braucht den Go-Compiler und alle Dependencies. Die resultierende Binary braucht nichts davon.
- **Python mit C-Extensions**: Build braucht gcc, python-dev, Header-Dateien. Zur Laufzeit: nicht mehr.
- **Node.js**: Build-Tools wie webpack, TypeScript-Compiler, TS-Sources. Zur Laufzeit: nur das fertige Bundle.
- **Java**: JDK zum Kompilieren, nur JRE zum Laufen.

Einfaches Dockerfile: alles landet im finalen Image. Großes Image, große Angriffsfläche.

### Die Multi-Stage-Lösung

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build            # erzeugt /app/dist

# Stage 2: Runtime
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Der **zweite** `FROM`-Block beginnt ein neues Image – frisch, nur `nginx:alpine`. Der `COPY --from=build …` holt die Ergebnisse aus der ersten Stage.

**Das finale Image enthält nur nginx + die gebauten Dateien**, nicht Node, nicht npm, nicht die Sources. Oft Reduktion von mehreren Hundert MB auf wenige Dutzend MB.

### Go-Beispiel noch drastischer

```dockerfile
# Stage 1: Build
FROM golang:1.22 AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /out/app ./cmd/app

# Stage 2: Runtime (Distroless – nur die Binary, sonst nichts)
FROM gcr.io/distroless/static-debian12
COPY --from=build /out/app /app
USER nonroot
ENTRYPOINT ["/app"]
```

Finales Image: **wenige MB**, kein Shell, kein Paket-Manager, kaum Angriffsfläche. Distroless-Images sind ein eigenes Thema, siehe [Image-Optimierung](image-optimierung.md).

### Mehrere Stages vermischen

Du kannst beliebig viele Stages haben und z.B. auch zwischen ihnen Dateien kopieren:

```dockerfile
FROM node:20 AS frontend
# frontend build ...

FROM python:3.12-slim AS backend
# backend build ...

FROM python:3.12-slim
WORKDIR /app
COPY --from=backend /built-backend .
COPY --from=frontend /built-frontend ./static
CMD ["python", "main.py"]
```

---

## 4. `USER` – nicht mehr als root

### Das Problem

Standardmäßig läuft der erste Prozess im Container **als root** (UID 0). Das bedeutet:

- Wird der Container kompromittiert, ist der Angreifer sofort **root im Container**.
- Bei schlecht konfigurierten Volumes kann das in root auf dem **Host** eskalieren.
- Einige Sicherheits-Scanner bemängeln Container, die als root laufen.

### Die Lösung

Lege einen eigenen User an und wechsle dazu:

```dockerfile
FROM python:3.12-slim
WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# User anlegen
RUN useradd --create-home --shell /bin/bash app
RUN chown -R app:app /app

# Zu User wechseln
USER app

CMD ["python", "app.py"]
```

Oder kürzer (ohne Home-Verzeichnis):

```dockerfile
RUN adduser --disabled-password --gecos '' app
USER app
```

Viele offizielle Images haben schon einen unprivilegierten User. Bei nginx:

```dockerfile
# das offizielle nginx-Image hat einen 'nginx'-User
USER nginx
```

### Stolpersteine bei USER

??? warning "`USER` wirkt nur auf nachfolgende Instruktionen"
    ```dockerfile
    USER app
    RUN npm install   # läuft als app
    ```

    Wenn `npm install` root-Rechte braucht (z.B. für globale Installationen), muss das **vor** dem `USER app` passieren.

??? warning "Port-Bindung < 1024 geht nicht mehr"
    Als unprivilegierter User kannst du Ports unter 1024 (80, 443) **nicht** mehr direkt öffnen. Lösungen:

    - Die App im Container auf einen höheren Port hören lassen (z.B. 8080).
    - Beim Port-Mapping den Host-Port frei wählen (`-p 80:8080`).
    - Bei nginx: die offizielle Variante nutzt einen Trick (Capabilities), um weiterhin 80 zu binden.

??? warning "Volumes werden mit falschem Besitzer erstellt"
    Wenn du im Container mit `USER app` läufst und ein Volume mountest, gehört das Volume aus Sicht des Containers unter Umständen `root`. Dann kann deine App nicht schreiben.

    **Lösungen:**

    - Im Dockerfile das Zielverzeichnis **vor** `USER` chown'en.
    - Bei Compose: Volume mit expliziten Permissions initialisieren.
    - Im Zweifel beim ersten Start als root hochfahren, Verzeichnisse anlegen, dann per `USER` wechseln.

---

## 5. `HEALTHCHECK` – Container prüft sich selbst

Ein Healthcheck sagt Docker: „Mein Prozess läuft zwar, aber ist er auch **funktional**?"

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1
```

| Parameter | Bedeutung |
|-----------|-----------|
| `--interval` | wie oft der Check läuft |
| `--timeout` | wie lange auf eine Antwort gewartet wird |
| `--start-period` | Grace-Time nach dem Start |
| `--retries` | wie viele Fehler, bevor „unhealthy" |
| `CMD ...` | der eigentliche Check-Befehl |

### Welche Befehle eignen sich?

- **Web-App**: `curl -f http://localhost:PORT/health` – ein dediziertes Health-Endpoint, der schnelle OK/Fehler zurückliefert.
- **Datenbank**: Tool, das bereitschafts-kompatibel ist (`pg_isready` bei Postgres, `mysqladmin ping` bei MySQL).
- **Worker ohne HTTP**: eine kleine Prozess-Prüfung, z.B. `pgrep -f worker || exit 1`.

### `HEALTHCHECK` vs. Compose-Healthcheck

Du kannst den Healthcheck **im Dockerfile** oder **in der compose.yaml** definieren. Compose überschreibt den Dockerfile-Healthcheck, wenn beide gesetzt sind.

**Faustregel:**

- **Im Dockerfile**, wenn der Check zum Image gehört (z.B. jeder, der das Image nutzt, will genau diesen Check).
- **Im Compose**, wenn der Check projektspezifisch ist (z.B. unterschiedliche Timeouts für Dev und Prod).

---

## 6. `CMD` vs. `ENTRYPOINT`

Bisher haben wir nur `CMD` gesehen. Es gibt auch `ENTRYPOINT`. Der Unterschied wird oft missverstanden.

### Kurze Antwort

- **`CMD`** ist der Default-Befehl, der beim Start ausgeführt wird. Beim `docker run image argument` wird `argument` **das CMD ersetzt**.
- **`ENTRYPOINT`** ist der feste Befehl. Zusätzliche Argumente beim `docker run` werden **an ENTRYPOINT drangehängt**.

### Beispiel

```dockerfile
# Variante 1: nur CMD
CMD ["python", "app.py"]
```

```bash
docker run mein-image                  # führt: python app.py
docker run mein-image python -c "…"    # führt: python -c "…" (CMD überschrieben)
```

```dockerfile
# Variante 2: ENTRYPOINT
ENTRYPOINT ["python"]
CMD ["app.py"]
```

```bash
docker run mein-image                  # führt: python app.py
docker run mein-image script.py        # führt: python script.py
docker run mein-image -c "print('hi')" # führt: python -c "print('hi')"
```

Die zweite Variante macht dein Image zu einem **Wrapper um Python**.

### Wann welche Variante?

- **Reine Web-Apps / API-Server**: `CMD` reicht, ist einfacher.
- **Tools / CLI-Images** (dein Image IST ein Kommando, z.B. ein Linter): `ENTRYPOINT` + `CMD` als Default-Argumente.
- **Flexibilität beim Run**: `ENTRYPOINT` als Shell-Wrapper, der Argumente durchreicht und z.B. ENV-Variablen validiert.

### Exec-Form vs. Shell-Form

Immer die **JSON-Array-Form** nutzen:

```dockerfile
CMD ["python", "app.py"]       # EXEC-FORM (empfohlen)
CMD python app.py              # SHELL-FORM (veraltet, hat Nebenwirkungen)
```

Die Shell-Form führt tatsächlich `/bin/sh -c "python app.py"` aus. Das bedeutet:

- Signal-Handling (`docker stop` → SIGTERM) erreicht die Shell, nicht den Python-Prozess → Container braucht 10 Sekunden zum Beenden (Timeout).
- Extra-Shell-Prozess frisst Ressourcen.

**Immer Exec-Form.**

---

## 7. Signal-Handling

Wenn du `docker stop` machst, schickt Docker dem Hauptprozess des Containers **SIGTERM** und wartet 10 Sekunden. Reagiert der Prozess nicht, kommt **SIGKILL**.

Für sauberes Herunterfahren muss deine App SIGTERM verstehen:

- **Python**: Flask und Gunicorn handhaben das von Haus aus, wenn sie als PID 1 laufen.
- **Node.js**: `process.on("SIGTERM", …)` einfügen und Connections sauber schließen.
- **Go**: `signal.Notify(sigChan, syscall.SIGTERM)` – Standard-Muster.

Wenn dein Prozess **nicht** PID 1 ist (z.B. durch Shell-Form), bekommt er das Signal nicht:

```dockerfile
CMD python app.py              # SHELL-FORM: Shell ist PID 1, python nicht
```

→ `docker stop` → Shell bekommt SIGTERM, ignoriert es → 10s Warten → SIGKILL → Container braucht 10s zum Beenden.

Mit Exec-Form ist Python PID 1 und bekommt SIGTERM direkt.

### `--init` als Abhilfe

Wenn du einen Prozess hast, der wirklich Probleme mit PID 1 hat (Zombie-Kinder, kaputtes Signal-Handling), nimm `--init`:

```bash
docker run --init mein-image
```

oder in Compose:

```yaml
services:
  app:
    image: mein-image
    init: true
```

Docker startet einen winzigen Init-Prozess vor deinem Prozess, der Signale und Zombies aufräumt.

---

## 8. `LABEL` – Metadaten anbringen

Labels sind Key-Value-Paare, die Image-Informationen tragen:

```dockerfile
LABEL maintainer="jacob@jacob-decoded.de"
LABEL org.opencontainers.image.source="https://github.com/JacobMenge/kurs-unterlagen"
LABEL org.opencontainers.image.description="Demo-App für den Docker-Kurs"
LABEL org.opencontainers.image.licenses="MIT"
```

Zu sehen mit `docker image inspect`. Besonders nützlich in Registries, die Labels auswerten (GitHub Container Registry z.B. linkt automatisch zum Source-Repo über `org.opencontainers.image.source`).

---

## 9. Ein vollständiges Best-Practice-Dockerfile

Unsere Kurs-App, aufgeräumt:

```dockerfile
# ============================================================================
# Stage 1: Abhängigkeiten installieren
# ============================================================================
FROM python:3.12-slim AS deps
WORKDIR /app

# System-Abhängigkeiten nur, wenn nötig (z.B. für Postgres-Client)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# ============================================================================
# Stage 2: Runtime (schlank)
# ============================================================================
FROM python:3.12-slim

WORKDIR /app

# Runtime-Abhängigkeiten (nur libpq, nicht der Compiler)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 curl \
    && rm -rf /var/lib/apt/lists/* \
    && adduser --disabled-password --gecos '' app \
    && chown -R app:app /app

# Python-Pakete aus der vorigen Stage übernehmen
COPY --from=deps --chown=app:app /root/.local /home/app/.local
ENV PATH=/home/app/.local/bin:$PATH \
    PYTHONUNBUFFERED=1

# App-Code
COPY --chown=app:app app.py .

USER app

EXPOSE 8000

HEALTHCHECK --interval=10s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:8000/ || exit 1

CMD ["python", "app.py"]

LABEL maintainer="jacob@jacob-decoded.de" \
      org.opencontainers.image.source="https://github.com/JacobMenge/kurs-unterlagen"
```

Was drinsteckt:

- **Multi-Stage**: Compiler und `.a`-Header nur in Stage 1, Runtime hat nur `libpq5` und die fertigen Pakete.
- **Layer-Caching**: Abhängigkeiten zuerst, Code danach.
- **Unprivilegierter User**: `app`, nicht root.
- **`HEALTHCHECK`**: sagt Docker, ob der Container antwortet.
- **Exec-Form bei `CMD`**: sauberes Signal-Handling.
- **Labels**: Metadaten für Mensch und Maschine.

Das Image ist damit **deutlich** kleiner und sicherer als die Minimal-Variante.

---

## 10. Checkliste für Produktions-Images

!!! tip "Vor dem ersten Push"
    - [ ] **Multi-Stage-Build**, wenn es Build-Tools gibt, die zur Laufzeit nicht nötig sind
    - [ ] **`USER` gesetzt** (nicht root)
    - [ ] **`.dockerignore`** vorhanden, keine Secrets im Kontext
    - [ ] **Keine Secrets im Image** (keine `ENV API_KEY=`, keine `.env`-Dateien)
    - [ ] **Schlankes Basis-Image** (`-slim` oder `-alpine` wo sinnvoll)
    - [ ] **`HEALTHCHECK`** eingebaut
    - [ ] **Exec-Form** bei `CMD`/`ENTRYPOINT`
    - [ ] **Fixierte Versionen** im `FROM` (kein `:latest`)
    - [ ] **Pakete mit `--no-install-recommends` und anschließendem `rm -rf /var/lib/apt/lists/*`** aufgeräumt
    - [ ] **Labels** für Traceability
    - [ ] **Signature/Scan** in CI, wenn möglich (Trivy, Grype)

---

## Stolpersteine

??? warning "Image wird plötzlich RIESIG groß"
    Oft passiert das, wenn:

    1. Du `apt-get install` ausführst ohne `rm -rf /var/lib/apt/lists/*` danach.
    2. Du große Dateien kopierst, die nicht in die `.dockerignore` aufgenommen wurden (`.git/`, `node_modules/` in einem Python-Projekt).
    3. Du `pip install` mit Cache lässt – immer `--no-cache-dir`.

    Analyse:
    ```bash
    docker history mein-image
    ```
    Zeigt pro Layer die Größe. Die dicksten Layer siehst du sofort.

??? warning "Ich sehe `apt-get update` in einem Layer – bei jedem Build"
    Wenn `apt-get update` in einem **eigenen** `RUN` steht und der nächste `RUN` die Installation macht, kann der Cache das `update` verbannen, aber nicht das `install` – dann installiert dein Image alte Paket-Versionen.

    **Richtig:**
    ```dockerfile
    RUN apt-get update && apt-get install -y --no-install-recommends \
        curl git \
        && rm -rf /var/lib/apt/lists/*
    ```

    Alles in **einem** `RUN`, damit der Cache einheitlich invalidiert wird.

??? warning "`.env` landet im Image, obwohl ich `.dockerignore` habe"
    Prüfe die `.dockerignore`:
    ```
    .env
    .env.*
    ```

    Dann **den Build-Kontext neu aufbauen**:
    ```bash
    docker build --no-cache -t mein-image .
    ```

??? info "Wie prüfe ich, ob mein Image Secrets enthält?"
    ```bash
    docker history mein-image --no-trunc
    docker image inspect mein-image
    ```

    Schau die Befehle und Labels durch, ob Secrets als Klartext drinstehen. Für systematisches Scanning: **Trivy** oder **Grype** (siehe [Image-Optimierung](image-optimierung.md)).

---

## Merksatz

!!! success "Merksatz"
    > **Multi-Stage für kleine Images. `USER` für weniger Angriffsfläche. Layer-Caching für schnelle Builds. `HEALTHCHECK`, damit Docker weiß, ob's läuft. Exec-Form bei CMD, damit Signale ankommen.**

---

## Weiterlesen

- [Image-Optimierung](image-optimierung.md) – noch kleiner und sicherer (Alpine, Distroless, Scanning)
- [Stolpersteine](stolpersteine.md)
