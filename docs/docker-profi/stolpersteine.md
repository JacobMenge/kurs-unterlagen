---
title: "Stolpersteine Profi-Block"
description: "Typische Probleme beim Bauen schlanker, sicherer Images – Multi-Stage-Fallen, USER-Stolperer, Alpine-Überraschungen, Scanner-Rauschen."
---

# Stolpersteine Profi-Block

Diese Seite sammelt Probleme, die beim **professionellen Bauen** von Images auftreten: Multi-Stage-Builds, USER-Wechsel, Basis-Image-Wahl, Scanning.

!!! info "Weitere Stolpersteine"
    - Standard-Docker-Alltagsprobleme: [Docker-Stolpersteine](../docker/stolpersteine.md)
    - Probleme mit Volumes/ENV/Netzwerken: [Aufbau-Stolpersteine](../docker-aufbau/stolpersteine.md)
    - Compose-spezifisch: [Compose-Stolpersteine](../docker-compose/stolpersteine.md)

---

## Multi-Stage-Builds

??? danger "`COPY --from=build` findet die Datei nicht"
    **Symptom:**
    ```text
    failed to compute cache key: "/out/app" not found
    ```

    **Ursachen und Lösungen:**

    1. **Pfad in Stage 1 stimmt nicht**. Prüfe mit einem Zwischenbuild:
       ```bash
       docker build --target build -t tmp .
       docker run --rm tmp ls -la /out
       ```
    2. **Stage wurde nicht benannt:**
       ```dockerfile
       FROM golang:1.22 AS build    # das AS-name ist wichtig
       ```
    3. **Binary wurde nicht erzeugt** (Stage 1 hat einen Fehler, der ignoriert wurde). Logs der Build-Stage lesen.

??? warning "Finales Image ist doch nicht kleiner als erwartet"
    **Ursache:** Oft ist das Runtime-Basis-Image schon groß.

    **Beispiel:** Wenn du `FROM python:3.12` (statt `-slim` oder `-alpine`) als Runtime-Stage nimmst, hilft Multi-Stage weniger, weil schon die Basis 1 GB ist.

    **Check mit:** `docker history image-name` – du siehst Layer-für-Layer die Größen.

??? info "Mehrere Stages kombinieren"
    Du kannst beliebig viele Stages haben:
    ```dockerfile
    FROM node:20 AS frontend
    # ...

    FROM python:3.12-slim AS backend
    # ...

    FROM python:3.12-slim
    COPY --from=backend /app .
    COPY --from=frontend /dist ./static
    CMD ["python", "app.py"]
    ```

---

## USER und Permissions

??? danger "Container läuft nach `USER app` nicht mehr – „permission denied""
    **Ursache:** Dateien im Image gehören `root`, aber der unprivilegierte User `app` darf nicht drauf zugreifen.

    **Lösung:** Vor dem `USER`-Wechsel alle relevanten Pfade chown'en:
    ```dockerfile
    RUN useradd --create-home --shell /bin/bash app \
        && chown -R app:app /app

    USER app
    ```

    Oder beim `COPY` gleich mit:
    ```dockerfile
    COPY --chown=app:app . /app
    ```

??? warning "Ports unter 1024 gehen nicht mehr"
    **Ursache:** Als unprivilegierter User darfst du Ports < 1024 nicht direkt öffnen.

    **Lösungen:**
    - In der Anwendung auf einen höheren Port (z.B. 8080) hören.
    - Beim `docker run` den Host-Port frei wählen: `-p 80:8080`.
    - Bei nginx: die offizielle Variante nutzt `CAP_NET_BIND_SERVICE`, um weiterhin 80 zu binden.

??? warning "`npm install` funktioniert nicht mehr nach USER-Wechsel"
    **Ursache:** Globale Installationen brauchen oft Schreibrechte auf Verzeichnisse, die `app` nicht hat.

    **Lösung:** Alles mit `npm ci` machen, solange du noch root bist. **Erst dann** `USER app`.

    ```dockerfile
    WORKDIR /app
    COPY package*.json ./
    RUN npm ci                    # als root
    COPY --chown=app:app . .
    USER app                      # jetzt erst
    CMD ["node", "index.js"]
    ```

---

## Layer-Caching

??? warning "Jeder Build dauert Minuten – Cache hilft nicht"
    **Ursache:** Reihenfolge im Dockerfile ist nicht cache-freundlich. Ein oft geänderter Layer (dein App-Code) invalidiert alle darunter­liegenden.

    **Debug:**
    ```bash
    docker build --progress=plain -t test .
    ```
    Zeigt pro Schritt, ob er `CACHED` oder `not cached` ist.

    **Fix:** Teure Operationen (`pip install`, `npm ci`, `apt-get install`) **vor** dem Kopieren des Codes, der sich oft ändert:

    ```dockerfile
    # Teuer, selten geändert
    COPY requirements.txt .
    RUN pip install --no-cache-dir -r requirements.txt

    # Billig, oft geändert
    COPY . .
    ```

??? warning "`apt-get update` wird jedes Mal neu ausgeführt"
    **Ursache:** Wenn `apt-get update` und `apt-get install` in separaten `RUN`-Zeilen stehen, kann der Cache sie getrennt behandeln – was dazu führt, dass ein alter Index verwendet wird.

    **Fix:** In ein `RUN` zusammenfassen und gleich aufräumen:
    ```dockerfile
    RUN apt-get update \
        && apt-get install -y --no-install-recommends curl git \
        && rm -rf /var/lib/apt/lists/*
    ```

---

## Alpine-Fallen

??? danger "`pip install pandas` schlägt auf Alpine fehl"
    **Ursache:** Für Alpine (musl-libc) gibt es oft keine vorkompilierten Python-Wheels. Pip versucht, aus Source zu bauen, findet aber keine Build-Tools.

    **Lösungen:**

    1. **Auf `python:3.12-slim` umsteigen** (Debian-basiert, hat glibc – kompatibel mit allen Wheels). Nur 100 MB größer, erspart Stunden Debugging.
    2. **Build-Tools im Dockerfile installieren**:
       ```dockerfile
       RUN apk add --no-cache build-base libffi-dev postgresql-dev
       ```
       Bläht das Image auf. Lösung: Multi-Stage – Tools in Stage 1, schlank in Stage 2.
    3. Auf Wheels warten, die der Publisher manchmal nachliefert.

??? warning "DNS-Auflösung verhält sich in Alpine-Containern anders"
    **Ursache:** Alpine nutzt musl-libc, das DNS etwas anders auflöst als glibc – besonders bei `/etc/nsswitch.conf`-Semantik und Search-Domains.

    **Symptom:** Seltsame Netzwerk-Fehler, die auf Debian/Ubuntu nicht auftreten.

    **Lösung:** Für ernsthafte Produktions-Setups mit komplexem DNS → `debian:12-slim` statt Alpine.

??? info "Wann lohnt Alpine nicht?"
    Wenn du mehr als 30 Min pro Woche mit Alpine-Problemen kämpfst. Die Zeit ist teurer als 100 MB Image.

    **Alpine glänzt bei:**
    - Go-, Rust-Binaries (keine dynamischen Abhängigkeiten).
    - Schlanken Node-Apps ohne native Dependencies.
    - CI-Runner-Images mit wenigen Tools.

    **Alpine nervt bei:**
    - Python-Data-Science-Stacks.
    - Rails-Apps mit vielen Gems.
    - Anwendungen, die auf glibc-spezifisches Verhalten setzen.

---

## Distroless

??? danger "`docker exec -it container sh` geht nicht bei Distroless"
    **Ursache:** Distroless-Images haben **keine Shell**. Bewusst so.

    **Lösungen:**

    1. **Debug-Variante des Distroless-Images** nutzen:
       ```dockerfile
       FROM gcr.io/distroless/static-debian12:debug
       ```
       Enthält eine busybox-Shell. Nur zum Debuggen, nicht in Produktion lassen.
    2. **Ephemeral Debug-Container** (in Kubernetes): `kubectl debug` startet einen Sidecar mit Tools.
    3. **Logs zentralisieren**: Wenn du nicht in den Container rein kannst, müssen die Logs aussagekräftig sein.

??? warning "Distroless für Python scheitert an fehlenden System-Libs"
    **Ursache:** Distroless-Python-Images enthalten **nur Python**, nicht libpq, libssl etc.

    **Lösung:** Entweder `distroless/cc` als Basis nehmen (mit glibc) und System-Libs statisch linken. Oder für Python bei `python:3.12-slim` bleiben – meist der bessere Kompromiss.

---

## Vulnerability Scanning

??? warning "Trivy findet dutzende LOW/MEDIUM – wirkt überwältigend"
    **Realität:** Jedes Distro-Basis-Image hat einen Haufen CVEs. Viele davon betreffen Tools, die du nicht aufrufst – praktisch harmlos.

    **Strategie:**
    - Fokus auf **HIGH und CRITICAL mit verfügbarem Fix**: `trivy image --severity HIGH,CRITICAL --ignore-unfixed image:tag`.
    - Für den Rest: Issue-Tracking, aber keine Hektik.
    - **Base-Image-Updates regelmäßig einspielen** – löst viele CVEs automatisch.

??? info "Ein CVE ist gelistet, aber ich nutze das Paket gar nicht"
    Typisch. Das Paket ist installiert (weil Basis-Image), wird aber von deiner App nicht aufgerufen.

    **Optionen:**
    - Ignorieren (mit Kommentar, warum).
    - Alternative Basis wählen, die das Paket nicht hat (Distroless).
    - Paket manuell deinstallieren – bei Debian/Alpine möglich, oft schmerzhaft.

??? info "Trivy vs. Grype – welchen nehmen?"
    Beide sind gut. Sie nutzen **unterschiedliche Vulnerability-Datenbanken** und finden manchmal unterschiedliche Dinge.

    **Für ernsthafte Produktion:** beide laufen lassen, Ergebnisse vergleichen.
    **Für den Alltag:** Trivy ist bei vielen die erste Wahl.

---

## Signal-Handling

??? warning "`docker stop` dauert 10 Sekunden, dann wird hart gekillt"
    **Ursache:** Deine Anwendung läuft in Shell-Form:
    ```dockerfile
    CMD python app.py             # SHELL-FORM
    ```
    Das startet `/bin/sh -c "python app.py"`. Die Shell ist PID 1, nicht Python. Signale gehen an die Shell, die sie ignoriert. Nach 10s `SIGKILL`.

    **Lösung:** Exec-Form:
    ```dockerfile
    CMD ["python", "app.py"]      # EXEC-FORM
    ```
    Jetzt ist Python PID 1 und bekommt Signale direkt.

??? info "Zombie-Kinder in meiner Anwendung"
    Wenn deine App selbst Kind-Prozesse startet (z.B. `subprocess.Popen`) und nicht korrekt aufräumt, sammeln sich Zombies.

    **Quick-Fix:**
    ```bash
    docker run --init mein-image
    ```
    Oder in Compose:
    ```yaml
    services:
      app:
        image: mein-image
        init: true
    ```
    Docker startet einen winzigen `init`-Prozess (tini) als PID 1, der Signale und Zombies sauber handhabt.

---

## Image-Größe analysieren

??? info "Welcher Layer frisst den Platz?"
    ```bash
    docker history --no-trunc mein-image | sort -k3 -h -r | head
    ```
    Sortiert nach Größe, die dicksten Layer oben.

??? info "Dive installieren und nutzen"
    Installation:

    === "macOS (Brew)"
        ```bash
        brew install dive
        ```

    === "Linux (Ubuntu/Debian)"
        ```bash
        DIVE_VERSION=$(curl -sL "https://api.github.com/repos/wagoodman/dive/releases/latest" | grep '"tag_name":' | sed -E 's/.*"v([^"]+)".*/\1/')
        curl -OL "https://github.com/wagoodman/dive/releases/download/v${DIVE_VERSION}/dive_${DIVE_VERSION}_linux_amd64.deb"
        sudo apt install -y "./dive_${DIVE_VERSION}_linux_amd64.deb"
        ```

    === "Windows (Scoop)"
        ```powershell
        scoop install dive
        ```

    === "Cross-Platform (Docker)"
        ```bash
        docker run --rm -it -v /var/run/docker.sock:/var/run/docker.sock wagoodman/dive:latest mein-image
        ```

    Aufruf:
    ```bash
    dive mein-image
    ```

    Im UI siehst du pro Layer das komplette Dateisystem. Cursor-Tasten + Enter für Details. Super nützlich bei mysteriösen Größen.

??? info "Image im Bytes-Detail vergleichen"
    ```bash
    docker image ls --format "table {{.Repository}}:{{.Tag}}\t{{.Size}}" | sort -k2 -h
    ```

---

## Best-Practice-Checkliste vor Produktion

!!! tip "Vor jedem Push in die Produktions-Registry"
    - [ ] **Multi-Stage-Build** falls Build-Tools im Spiel sind
    - [ ] **`USER`** gesetzt (nicht root)
    - [ ] **`.dockerignore`** vorhanden, keine Secrets im Kontext
    - [ ] **Keine Secrets im Image** (kein `ENV API_KEY`, keine `.env` kopiert)
    - [ ] **Schlankes Basis-Image** (`-slim` oder `-alpine` oder Distroless)
    - [ ] **`HEALTHCHECK`** eingebaut
    - [ ] **Exec-Form** bei `CMD`/`ENTRYPOINT`
    - [ ] **Fixierte Version** im `FROM` (kein `:latest`)
    - [ ] **Apt-/Pip-Cache** aufgeräumt
    - [ ] **Labels** für Traceability (mind. `org.opencontainers.image.source`)
    - [ ] **Trivy-Scan** in CI, blockiert HIGH/CRITICAL mit Fix
