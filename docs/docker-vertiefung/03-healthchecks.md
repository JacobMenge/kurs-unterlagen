---
title: "HEALTHCHECK im Dockerfile"
description: "Wie Docker selbst prüft, ob dein Container nicht nur läuft, sondern auch wirklich bereit ist. Ganz ohne Compose."
---

# Übung 3: HEALTHCHECK im Dockerfile

!!! abstract "Was du in dieser Übung lernst"
    - Den Unterschied zwischen *„Container läuft"* und *„Container ist bereit"*
    - Wie du einen `HEALTHCHECK` direkt im Dockerfile definierst
    - Was die Status-Werte `starting`, `healthy`, `unhealthy` und `none` bedeuten
    - Wie du den Health-Status zur Laufzeit beobachten kannst (`docker ps`, `docker inspect`)

**Aufwand:** ca. 20 Minuten.

**Voraussetzung:** Du kannst ein einfaches Dockerfile schreiben und bauen ([Dockerfile-Grundlagen](../docker/dockerfile-grundlagen.md)).

---

## Worum geht's

Wenn `docker ps` einen Container mit Status `Up 30 seconds` anzeigt, weißt du nur: der **Hauptprozess läuft**. Du weißt **nicht**, ob die App bereit ist, Anfragen zu beantworten.

Beispiel: Eine Java-App mit Spring Boot braucht oft 20–30 Sekunden zum Hochfahren. In dieser Zeit ist der Container `Up`, aber HTTP-Anfragen scheitern. Genauso bei Postgres während der Init-Phase.

Ein **Healthcheck** ist eine kleine Prüfung, die Docker **regelmäßig im Container** ausführt:

- klappt sie → Container ist `healthy`
- schlägt sie X-mal hintereinander fehl → Container ist `unhealthy`

Die vier Status-Werte:

| Status | Bedeutung |
|---|---|
| `starting` | Es gab noch keinen erfolgreichen Check und noch nicht genug Fehlschläge für `unhealthy`. |
| `healthy` | Der letzte Check war erfolgreich. |
| `unhealthy` | Die Checks sind so oft hintereinander fehlgeschlagen, wie `--retries` erlaubt. |
| `none` | Das Image hat keinen Healthcheck. `docker ps` zeigt dann keinen Zusatz in Klammern, nur der Filter `docker ps --filter health=none` findet solche Container. |

Das ist nützlich für:

- **Debugging im Alltag:** `docker ps` zeigt sofort, welcher Container nicht antwortet.
- **Compose mit `depends_on: condition: service_healthy`** (kommt im Compose-Block, dort startet die App erst, wenn die DB `healthy` ist).
- **Docker Swarm** ersetzt unhealthy Container automatisch. Kubernetes ignoriert den Docker-`HEALTHCHECK` dagegen und nutzt eigene Liveness- und Readiness-Probes.

!!! warning "Docker allein startet unhealthy Container nicht neu"
    Ein Container mit Status `unhealthy` läuft einfach weiter. Auch eine Restart-Policy ([Übung 4](04-restart-policies.md)) greift nur, wenn der Hauptprozess **endet**, nicht bei `unhealthy`. Der Status ist eine Information für dich, für Compose und für Orchestrierer.

---

## Anleitung

### Schritt 1: Projektordner anlegen

=== "macOS / Linux"
    ```bash
    mkdir -p ~/health-demo && cd ~/health-demo
    ```

=== "Windows PowerShell"
    ```powershell
    mkdir -Force $HOME\health-demo
    cd $HOME\health-demo
    ```

=== "Windows CMD"
    ```cmd
    mkdir "%USERPROFILE%\health-demo"
    cd "%USERPROFILE%\health-demo"
    ```

### Schritt 2: Dockerfile mit Healthcheck schreiben

Lege eine Datei namens `Dockerfile` (ohne Endung) an:

=== "macOS / Linux"
    ```bash
    nano Dockerfile
    ```

=== "Windows PowerShell"
    Erst die leere Datei anlegen, dann in Notepad öffnen. Sonst speichert Notepad sie als `Dockerfile.txt` (siehe [Dockerfile anlegen](../docker/praxis-eigenes-image.md#schritt-3-dockerfile-erstellen)):
    ```powershell
    New-Item -ItemType File Dockerfile
    notepad Dockerfile
    ```

Inhalt:

```dockerfile
FROM nginx:alpine

# Healthcheck: alle 5 Sekunden eine HTTP-Anfrage gegen den
# Container selbst. Wenn die nicht klappt, ist er unhealthy.
HEALTHCHECK --interval=5s --timeout=3s --start-period=2s --retries=3 \
  CMD wget --quiet --spider http://localhost/ || exit 1
```

Der `\` am Zeilenende gehört hier zum Dockerfile und funktioniert auf allen Systemen. Mehr zu `HEALTHCHECK` im Profi-Block: [Container prüft sich selbst](../docker-profi/dockerfile-best-practices.md#5-healthcheck-container-pruft-sich-selbst).

| Parameter | Bedeutung |
|---|---|
| `--interval=5s` | alle 5 Sekunden prüfen, der erste Check läuft ebenfalls erst nach 5 Sekunden |
| `--timeout=3s` | jede Prüfung darf maximal 3 Sek dauern, sonst gilt sie als fehlgeschlagen |
| `--start-period=2s` | Anlaufzeit: Fehlschläge in den ersten 2 Sek zählen nicht gegen `retries`. Ein Erfolg in dieser Zeit macht den Container sofort `healthy`. |
| `--retries=3` | erst nach 3 Fehlversuchen in Folge wird der Container `unhealthy` |
| `CMD wget --spider` | das eigentliche Test-Kommando: Exit-Code 0 = healthy, alles andere = Fehlschlag |

`wget --spider` lädt **nichts** herunter, prüft nur, ob die URL antwortet. Das ist in Alpine standardmäßig dabei (busybox-wget). Fehlt in einem Debian-basierten Image ein passendes Werkzeug, installierst du es im Dockerfile mit `RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*` und prüfst dann mit `curl -fsS http://localhost/ || exit 1`.

### Schritt 3: Image bauen

```bash
docker build -t health-demo:1.0 .
```

### Schritt 4: Starten und Status beobachten

```bash
docker run -d --name health-demo -p 9090:80 health-demo:1.0
```

**Sofort danach** prüfen:

```bash
docker ps --filter name=health-demo --format "table {{.Names}}\t{{.Status}}"
```

Erwartet:

```text
NAMES         STATUS
health-demo   Up Less than a second (health: starting)
```

Status `(health: starting)` heißt: Es gab noch keinen erfolgreichen Check. Der erste Check läuft erst nach `--interval`, also nach etwa 5 Sekunden.

**Nach einigen Sekunden** nochmal:

```bash
docker ps --filter name=health-demo --format "table {{.Names}}\t{{.Status}}"
```

Erwartet:

```text
NAMES         STATUS
health-demo   Up 7 seconds (healthy)
```

Container läuft, Health-Check klappt → **healthy**.

### Schritt 5: Health-Historie inspizieren

Docker speichert die letzten Health-Check-Ergebnisse:

```bash
docker inspect health-demo --format "{{json .State.Health}}"
```

Mit `python3 -m json.tool` oder `jq` (macOS/Linux) bzw. `ConvertFrom-Json` (PowerShell) bekommst du einen schöneren Überblick:

=== "macOS / Linux"
    ```bash
    docker inspect health-demo --format "{{json .State.Health}}" | python3 -m json.tool
    ```

=== "Windows PowerShell"
    ```powershell
    docker inspect health-demo --format "{{json .State.Health}}" | ConvertFrom-Json | ConvertTo-Json -Depth 10
    ```

Du siehst `Status: "healthy"`, `FailingStreak: 0` und die letzten Log-Einträge mit `ExitCode` und Output.

### Schritt 6: Aufräumen

```bash
docker rm -f health-demo
docker rmi health-demo:1.0
```

---

## Übung: Selber machen

!!! info "Aufgabe"
    Bau ein zweites Image, dessen Healthcheck **garantiert fehlschlägt** und beobachte, wie Docker den Container nach mehreren Fehlversuchen auf `unhealthy` setzt.

**Vorgaben:**

- Image-Tag: `health-bad:1.0`
- Healthcheck testet einen Pfad, den nginx **nicht** ausliefert (z.B. `/gibts-nicht`)
- Bewusst kurze Werte: `--interval=3s --timeout=2s --start-period=1s --retries=2`
- Beobachte: nach wie vielen Sekunden flippt der Status auf `unhealthy`?

??? success "Musterlösung"

    Datei `Dockerfile.bad` anlegen (unter Windows: `New-Item -ItemType File Dockerfile.bad`, dann `notepad Dockerfile.bad`):
    ```dockerfile
    FROM nginx:alpine
    HEALTHCHECK --interval=3s --timeout=2s --start-period=1s --retries=2 \
      CMD wget --quiet --spider http://localhost/gibts-nicht || exit 1
    ```

    Bauen und starten:
    ```bash
    docker build -f Dockerfile.bad -t health-bad:1.0 .
    docker run -d --name health-bad -p 9091:80 health-bad:1.0
    ```

    Gut 10 Sekunden warten (`sleep 12` in macOS/Linux und PowerShell, `timeout /t 12` in CMD), dann:
    ```bash
    docker ps --filter name=health-bad --format "table {{.Names}}\t{{.Status}}"
    ```

    Erwartet:
    ```text
    NAMES        STATUS
    health-bad   Up 12 seconds (unhealthy)
    ```

    Aufräumen:
    ```bash
    docker rm -f health-bad
    docker rmi health-bad:1.0
    ```

    **Rechnung:** Der erste Check läuft nach `interval` (3 s), der zweite nach etwa 6 s. Nach `retries` = 2 Fehlschlägen in Folge ist der Container `unhealthy`. Rechnerisch wären das etwa 6 Sekunden, gemessen waren es 7 bis 10 Sekunden, weil jeder Check selbst etwas Zeit braucht und Docker den Takt erst nach dem vorigen Check startet. Die `start-period` von 1 s spielt hier keine Rolle.

---

## Was du danach kannst

- Einen `HEALTHCHECK` **direkt im Dockerfile** schreiben.
- Die vier Parameter `interval`, `timeout`, `start-period`, `retries` sinnvoll wählen.
- Den Health-Status im `docker ps`-Output ablesen.
- Mit `docker inspect ... .State.Health` die letzten Check-Resultate sehen, inklusive Output.

---

## Wichtige Hinweise

??? info "Healthcheck beim Start überschreiben"
    Du kannst einem Container beim `docker run` einen anderen Healthcheck geben (oder ihn deaktivieren), ohne das Image neu zu bauen:

    Eigener Check beim Start:

    ```bash
    docker run -d --name hc-eigen --health-cmd "wget -q --spider http://localhost/ || exit 1" --health-interval 10s nginx:alpine
    ```

    Oder ganz deaktivieren:

    ```bash
    docker run -d --name hc-aus --no-healthcheck nginx:alpine
    ```

    Aufräumen:

    ```bash
    docker rm -f hc-eigen hc-aus
    ```

    Das ist nützlich, wenn ein Image einen schlechten Default-Healthcheck mitbringt und du den Container temporär anders konfigurieren willst.

??? warning "Healthcheck darf nicht teuer sein"
    Der Healthcheck läuft **alle X Sekunden, für immer**. Wenn er aufwendige Datenbankqueries macht oder externe APIs anfragt, kostet das messbar Ressourcen. Faustregel: ein Healthcheck sollte unter **1 Sekunde** laufen und nur **lokale** Ressourcen nutzen.

---

## Weiter

- [Übung 4: Restart-Policies und Crash-Recovery](04-restart-policies.md)
- Zurück zur [Übersicht](index.md)
