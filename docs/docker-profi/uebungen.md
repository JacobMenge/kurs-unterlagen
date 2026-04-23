---
title: "Übungen"
description: "Eigene Hands-on-Übungen zum Profi-Block – Dockerfile-Optimierung, Multi-Stage, Scanning. Vier Schwierigkeitsgrade."
---

# Übungen – Docker für Profis

Übungen zu **Dockerfile-Best-Practices** und **Image-Optimierung**. Das sind die Techniken, die dein Docker-Handwerk vom Nutzer zum Profi bringen.

!!! abstract "Die vier Stufen"
    - 🟢 **Einsteiger** – jeder Schritt bis ins Detail
    - 🟡 **Mittel** – weniger Hand-Holding
    - 🔴 **Fortgeschritten** – Hinweise statt Rezepte
    - 🏆 **Challenge** – Aufgabe ohne Anleitung, Musterlösung aufklappbar

## Voraussetzung für alle Übungen

- Docker läuft (`docker version` klappt).
- Idealerweise Blöcke 2 und 3 durchgearbeitet.
- Ein Editor.

---

## 🟢 Einsteiger

### Übung 5.1 – Image-Größe beobachten

!!! info "Was du lernst"
    - Größe eines Images prüfen
    - `docker history` lesen
    - Welche Layer wie viel kosten

#### Worum geht's – Kontext

Jedes Docker-Image ist aus **Schichten (Layern)** gebaut. Jede Instruktion im Dockerfile erzeugt einen Layer. Layer werden wiederverwendet (geteilt zwischen Images), aber große Layer blähen das Image auf. Als Profi willst du wissen, wo die Größe herkommt, um sie zu reduzieren.

#### Schritt 1 – Zwei Images ziehen

```bash
docker pull python:3.12
docker pull python:3.12-slim
```

Das erste ist das volle Python-Image (auf Debian-Basis), das zweite die schlanke Variante.

#### Schritt 2 – Größen vergleichen

```bash
docker images | head
```

Du siehst beide mit unterschiedlicher `SIZE`. Das volle Image ist meist ca. **1 GB**, das slim-Image **ca. 150 MB**.

**Takeaway:** Für reinen Python-Code reicht `-slim` meistens.

#### Schritt 3 – Layer-History anschauen

```bash
docker history python:3.12-slim
```

Du siehst pro Zeile:

- Einen Layer
- Was er gemacht hat (z.B. `ADD debian-base`, `apt-get install`, etc.)
- Wie groß er ist

Die größten Einträge zeigen dir, wo das meiste Gewicht steckt – meist im Basis-Linux.

#### Schritt 4 – Image entfernen, um Platz zu sparen

```bash
docker rmi python:3.12
docker rmi python:3.12-slim
```

!!! success "Geschafft!"
    Du weißt jetzt, wie du die Größe eines Images schnell einschätzt und wo die dicken Layer sind.

---

### Übung 5.2 – Ein ineffizientes Dockerfile verbessern

!!! info "Was du lernst"
    - Schlechte Reihenfolge erkennen (Cache bricht)
    - Layer zusammenfassen
    - Paket-Index aufräumen

#### Das schlechte Dockerfile

Lege einen Ordner `uebung-5-2` an. Erstelle darin:

**`requirements.txt`**:
```
flask==3.0.3
```

**`app.py`**:
```python
from flask import Flask
app = Flask(__name__)

@app.route("/")
def home():
    return "<h1>Hallo</h1>"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
```

**`Dockerfile` (absichtlich schlecht)**:
```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY . .
RUN apt-get update
RUN apt-get install -y curl
RUN pip install -r requirements.txt
CMD ["python", "app.py"]
```

Baue das:

```bash
docker build -t schlecht:1.0 .
```

Jetzt ändere `app.py` (z.B. eine Zeile), baue nochmal:

```bash
docker build -t schlecht:1.1 .
```

**Beobachtung:** Beim zweiten Build laufen `apt-get` und `pip install` erneut durch, weil der `COPY . .`-Layer alles invalidiert hat, was darunter liegt. **Das ist teuer.**

#### Das verbesserte Dockerfile

```dockerfile
FROM python:3.12-slim
WORKDIR /app

# 1) System-Pakete – selten geändert
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# 2) Abhängigkeiten vor Quellcode
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 3) Quellcode zuletzt
COPY . .

CMD ["python", "app.py"]
```

Baue:

```bash
docker build -t gut:1.0 .
```

Ändere `app.py` wieder, baue:

```bash
docker build -t gut:1.1 .
```

**Beobachtung:** Beim zweiten Build sind `apt-get`- und `pip install`-Schritte **gecached** – nur der `COPY . .`-Schritt läuft neu. Viel schneller.

#### Aufräumen

```bash
docker rmi schlecht:1.0 schlecht:1.1 gut:1.0 gut:1.1
```

---

## 🟡 Mittel

### Übung 5.3 – Multi-Stage-Build für Go

!!! info "Was du lernst"
    - Multi-Stage-Dockerfile
    - Kleines finales Image ohne Build-Tools

#### Worum geht's

Eine Go-Anwendung muss **gebaut** werden (braucht Go-Compiler). **Zur Laufzeit** braucht sie den Compiler nicht mehr – nur die Binary. Genau dafür ist Multi-Stage.

#### Kleine Go-App

**`main.go`**:
```go
package main

import (
    "fmt"
    "net/http"
)

func main() {
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprint(w, "Hallo aus Go!")
    })
    fmt.Println("Server läuft auf :8080")
    http.ListenAndServe(":8080", nil)
}
```

**`go.mod`**:
```
module hallo

go 1.24
```

#### Aufgabe

Schreibe ein `Dockerfile` mit **zwei** Stages:

1. **build**: `golang:1.24` → kompiliert `main.go` zu einer Binary.
2. **runtime**: `gcr.io/distroless/static-debian12` → nur die Binary.

Baue, starte, öffne im Browser. Vergleiche die Image-Größe mit einem Single-Stage-Build.

#### Hinweise

- `COPY --from=build /bin/server /server`
- `CGO_ENABLED=0 go build -o /bin/server` (static linken für Distroless)
- Port-Mapping nicht vergessen.

??? info "Gerüst zum Einstieg"
    ```dockerfile
    # ---- Stage 1: Build ----
    FROM golang:1.24 AS build
    WORKDIR /src
    COPY go.mod ./
    COPY main.go ./
    RUN CGO_ENABLED=0 go build -o /bin/server main.go

    # ---- Stage 2: Runtime ----
    FROM gcr.io/distroless/static-debian12
    COPY --from=build /bin/server /server
    EXPOSE 8080
    ENTRYPOINT ["/server"]
    ```

#### Erfolgs-Check

```bash
docker images | grep hallo
```

Du solltest ein Image unter **10 MB** sehen. Im Vergleich zu `golang:1.24` als Runtime (800+ MB) ein **enormer** Unterschied.

---

### Übung 5.4 – USER nicht-root in einem Python-Image

!!! info "Was du lernst"
    - Unprivilegierter User im Container
    - Chown-Reihenfolge beachten

#### Aufgabe

Nimm die Flask-App aus Übung 5.2 und ändere das Dockerfile so, dass der Container **nicht** als root läuft, sondern als neuer User `app`.

#### Anforderungen

- `RUN adduser --disabled-password --gecos '' app`
- `chown -R app:app /app` **bevor** `USER app`
- `USER app` am Ende des Dockerfiles (vor `CMD`)
- Container startet **und** liefert die Seite aus

#### Erfolgs-Check

```bash
docker exec -it <container> whoami
```
Antwort: `app` (nicht `root`).

---

## 🔴 Fortgeschritten

### Übung 5.5 – Image mit Trivy scannen und Lücken fixen

!!! info "Was du lernst"
    - Trivy installieren
    - Image auf CVEs scannen
    - Lücken durch Basis-Update schließen

#### Voraussetzung

Trivy installieren:

=== "macOS (Brew)"
    ```bash
    brew install trivy
    ```

=== "Linux (Ubuntu/Debian)"
    ```bash
    sudo apt-get install -y wget gnupg
    wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | sudo apt-key add -
    echo "deb https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main" | sudo tee /etc/apt/sources.list.d/trivy.list
    sudo apt-get update
    sudo apt-get install -y trivy
    ```

=== "Windows"
    Siehe <https://aquasecurity.github.io/trivy/latest/getting-started/installation/> oder Trivy in einem Docker-Container laufen lassen:
    ```powershell
    docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image <image>
    ```

#### Aufgabe

Scanne ein absichtlich veraltetes Image und finde die Schwachstellen:

```bash
docker pull node:18
trivy image --severity HIGH,CRITICAL node:18
```

Du siehst eine Liste von CVEs.

Dann versuche die Fixes:

1. Aktualisiere auf eine neuere Version:
    ```bash
    trivy image --severity HIGH,CRITICAL node:22-slim
    ```
    Du siehst: deutlich weniger Lücken.

2. Noch schlanker: `node:22-alpine`
    ```bash
    trivy image --severity HIGH,CRITICAL node:22-alpine
    ```

#### Aufräumen

```bash
docker rmi node:18 node:22-slim node:22-alpine
```

#### Fazit

Ein Image-Update reduziert die Angriffsfläche oft um ein Vielfaches. Das ist einer der einfachsten Security-Gewinne im Docker-Alltag.

---

## 🏆 Challenge

### Challenge 5 – Produktions-fertiges Flask-Dockerfile

!!! abstract "Aufgabe"
    Nimm eine kleine Flask-App und baue ein **produktions­reifes** Image, das alle relevanten Best Practices vereint.

    **Die App (gegeben)**

    `app.py`:
    ```python
    from flask import Flask
    app = Flask(__name__)

    @app.route("/")
    def home():
        return "<h1>Challenge 5 – Produktions-Image</h1>"

    @app.route("/health")
    def health():
        return {"status": "ok"}, 200

    if __name__ == "__main__":
        app.run(host="0.0.0.0", port=8000)
    ```

    `requirements.txt`:
    ```
    flask==3.0.3
    ```

    **Dein Dockerfile muss erfüllen:**

    1. **Multi-Stage**: Build-Stage baut Deps, Runtime-Stage nimmt nur das Nötige.
    2. **`python:3.12-slim`** als Runtime-Basis (nicht das volle `python`).
    3. **Unprivilegierter User** `app` – nicht als root laufen.
    4. **Layer-Caching-freundliche Reihenfolge**: Deps vor Code.
    5. **`HEALTHCHECK`** im Dockerfile, der `/health` mit `curl` abfragt.
    6. **`EXPOSE 8000`** als Dokumentation.
    7. **`CMD`** in Exec-Form (JSON-Array), damit SIGTERM ankommt.
    8. **`LABEL org.opencontainers.image.source`** auf dein GitHub-Repo.
    9. **`.dockerignore`** mit `.git/`, `__pycache__/`, `.venv/`, `*.log`.

    **Erfolgs-Checks:**

    - `docker build -t challenge5:1.0 .` läuft durch.
    - `docker run -d --name c5 -p 8000:8000 challenge5:1.0` startet.
    - `curl http://localhost:8000/` liefert die HTML-Seite.
    - `curl http://localhost:8000/health` liefert `{"status":"ok"}`.
    - `docker exec c5 whoami` zeigt `app`.
    - `docker ps` zeigt nach 15 Sekunden `(healthy)`.
    - `docker images challenge5:1.0` zeigt Größe unter **200 MB**.

??? success "Musterlösung"

    ### Projektstruktur

    ```
    challenge5/
    ├── Dockerfile
    ├── .dockerignore
    ├── app.py
    └── requirements.txt
    ```

    ### `.dockerignore`

    ```
    .git/
    .github/
    __pycache__/
    *.pyc
    .venv/
    venv/
    .env
    *.log
    .DS_Store
    ```

    ### `Dockerfile`

    ```dockerfile
    # ============================================================
    # Stage 1: Dependencies installieren
    # ============================================================
    FROM python:3.12-slim AS build

    WORKDIR /app
    COPY requirements.txt .
    RUN pip install --no-cache-dir --user -r requirements.txt

    # ============================================================
    # Stage 2: Runtime – schlank, unprivilegiert, mit Healthcheck
    # ============================================================
    FROM python:3.12-slim

    # curl wird fuer Healthcheck gebraucht
    RUN apt-get update \
        && apt-get install -y --no-install-recommends curl \
        && rm -rf /var/lib/apt/lists/* \
        && adduser --disabled-password --gecos '' app \
        && mkdir -p /app \
        && chown -R app:app /app

    # Python-Pakete aus Build-Stage uebernehmen
    COPY --from=build --chown=app:app /root/.local /home/app/.local
    ENV PATH=/home/app/.local/bin:$PATH \
        PYTHONUNBUFFERED=1

    WORKDIR /app
    COPY --chown=app:app app.py .

    USER app

    EXPOSE 8000

    HEALTHCHECK --interval=10s --timeout=3s --start-period=10s --retries=3 \
      CMD curl -fsS http://localhost:8000/health || exit 1

    CMD ["python", "app.py"]

    LABEL org.opencontainers.image.source="https://github.com/JacobMenge/kurs-unterlagen" \
          org.opencontainers.image.description="Challenge 5 – Produktions-Image-Muster"
    ```

    ### Bauen und testen

    ```bash
    docker build -t challenge5:1.0 .
    docker run -d --name c5 -p 8000:8000 challenge5:1.0

    # Seite testen
    curl -s http://localhost:8000/
    curl -s http://localhost:8000/health

    # User-Check
    docker exec c5 whoami        # muss 'app' zeigen

    # Healthcheck
    docker ps                    # Status nach 15s: (healthy)

    # Groesse
    docker images challenge5:1.0
    ```

    **Was das Dockerfile technisch richtig macht:**

    - **Multi-Stage**: Build-Artefakte werden rübergereicht, Compiler bleibt in Stage 1.
    - **`--no-install-recommends`** + `rm -rf /var/lib/apt/lists/*`: kein Apt-Müll im Image.
    - **User `app` mit `chown`** in einem einzigen RUN-Block: keine verwaisten Dateien mit Root-Besitz.
    - **`pip install --user`** → alles in `~/.local`, einfacher zu kopieren.
    - **`PYTHONUNBUFFERED=1`**: Python-Logs erscheinen sofort in Docker Logs.
    - **`HEALTHCHECK` mit `curl`**: Docker weiß, wann die App bereit ist.
    - **Exec-Form `CMD`**: SIGTERM kommt beim Python-Prozess an, kein 10-Sekunden-Timeout.
    - **`LABEL`**: Registry kann auf Source-Repo verlinken.

    ### Aufräumen

    ```bash
    docker stop c5
    docker rm c5
    docker rmi challenge5:1.0
    ```

    **Bonus-Schritt (optional):** Trivy-Scan laufen lassen:
    ```bash
    trivy image --severity HIGH,CRITICAL challenge5:1.0
    ```
    Du solltest wenige bis keine HIGH/CRITICAL-Funde haben.

---

## Weiter mit

- [Merksätze](merksaetze.md) – Zusammenfassung der Profi-Techniken
- [Stolpersteine Profi-Block](stolpersteine.md)
