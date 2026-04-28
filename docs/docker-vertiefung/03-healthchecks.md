---
title: "HEALTHCHECK im Dockerfile"
description: "Wie Docker selbst prüft, ob dein Container nicht nur läuft, sondern auch wirklich bereit ist – ganz ohne Compose."
---

# Übung 3 – HEALTHCHECK im Dockerfile

!!! abstract "Was du in dieser Übung lernst"
    - Den Unterschied zwischen *„Container läuft"* und *„Container ist bereit"*
    - Wie du einen `HEALTHCHECK` direkt im Dockerfile definierst
    - Was die vier Status-Werte (`starting` / `healthy` / `unhealthy` / `none`) bedeuten
    - Wie du den Health-Status zur Laufzeit beobachten kannst (`docker ps`, `docker inspect`)

**Aufwand:** ca. 20 Minuten.

---

## Worum geht's

Wenn `docker ps` einen Container mit Status `Up 30 seconds` anzeigt, weißt du nur: der **Hauptprozess läuft**. Du weißt **nicht**: ob die App bereit ist, Anfragen zu beantworten.

Beispiel: Eine Java-App mit Spring Boot braucht oft 20–30 Sekunden zum Hochfahren. In dieser Zeit ist der Container `Up`, aber HTTP-Anfragen scheitern. Genauso bei Postgres während der Init-Phase.

Ein **Healthcheck** ist eine kleine Prüfung, die Docker **regelmäßig im Container** ausführt:

- klappt sie → Container ist `healthy`
- schlägt sie X-mal hintereinander fehl → Container ist `unhealthy`

Das ist nützlich für:

- **Debugging im Alltag:** `docker ps` zeigt sofort, welcher Container nicht antwortet.
- **Compose mit `depends_on: condition: service_healthy`** (kommt in der nächsten Einheit – dort startet die App erst, wenn die DB `healthy` ist).
- **Orchestrierungs­systeme** wie Swarm oder Kubernetes nehmen unhealthy Container automatisch aus dem Loadbalancer.

---

## Anleitung

### Schritt 1 – Projektordner anlegen

=== "macOS / Linux"
    ```bash
    mkdir -p ~/health-demo && cd ~/health-demo
    ```

=== "Windows PowerShell"
    ```powershell
    mkdir $HOME\health-demo
    cd $HOME\health-demo
    ```

=== "Windows CMD"
    ```cmd
    mkdir "%USERPROFILE%\health-demo"
    cd "%USERPROFILE%\health-demo"
    ```

### Schritt 2 – Dockerfile mit Healthcheck schreiben

Lege eine Datei namens `Dockerfile` (ohne Endung) an:

```dockerfile
FROM nginx:alpine

# Healthcheck: alle 5 Sekunden eine HTTP-Anfrage gegen den
# Container selbst. Wenn die nicht klappt, ist er unhealthy.
HEALTHCHECK --interval=5s --timeout=3s --start-period=2s --retries=3 \
  CMD wget --quiet --spider http://localhost/ || exit 1
```

| Parameter | Bedeutung |
|---|---|
| `--interval=5s` | alle 5 Sekunden prüfen |
| `--timeout=3s` | jede Prüfung darf maximal 3 Sek dauern, sonst Fehler |
| `--start-period=2s` | die ersten 2 Sek nach Start nicht zählen (Anlauf­zeit) |
| `--retries=3` | erst nach 3 Fehlversuchen in Folge wird der Container `unhealthy` |
| `CMD wget --spider` | das eigentliche Test-Kommando – Exit-Code 0 = healthy, anders = fail |

`wget --spider` lädt **nichts** herunter, prüft nur, ob die URL antwortet. Ist in Alpine standardmäßig dabei (busybox-wget). Bei Debian-basierten Images: `apt install -y curl`, dann `curl -fsS http://localhost/ || exit 1`.

### Schritt 3 – Image bauen

```bash
docker build -t health-demo:1.0 .
```

### Schritt 4 – Starten und Status beobachten

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

Status `(health: starting)` heißt: die `start-period` läuft noch.

**Nach 6–7 Sekunden** nochmal:

```bash
docker ps --filter name=health-demo --format "table {{.Names}}\t{{.Status}}"
```

Erwartet:

```text
NAMES         STATUS
health-demo   Up 7 seconds (healthy)
```

Container läuft, Health-Check klappt → **healthy**.

### Schritt 5 – Health-Historie inspizieren

Docker speichert die letzten Health-Check-Ergebnisse:

```bash
docker inspect health-demo --format '{{json .State.Health}}'
```

Mit `python3 -m json.tool` (oder einem JSON-Viewer im Browser) bekommst du einen schöneren Überblick:

=== "macOS / Linux"
    ```bash
    docker inspect health-demo --format '{{json .State.Health}}' | python3 -m json.tool
    ```

=== "Windows PowerShell"
    ```powershell
    docker inspect health-demo --format '{{json .State.Health}}' | ConvertFrom-Json | ConvertTo-Json -Depth 10
    ```

Du siehst `Status: "healthy"`, `FailingStreak: 0`, und die letzten Log-Einträge mit `ExitCode` und Output.

### Schritt 6 – Aufräumen

```bash
docker rm -f health-demo
docker rmi health-demo:1.0
```

---

## Übung – Selber machen

!!! info "Aufgabe"
    Bau ein zweites Image, dessen Healthcheck **garantiert fehlschlägt**, und beobachte, wie Docker den Container nach mehreren Fehlversuchen auf `unhealthy` setzt.

**Vorgaben:**

- Image-Tag: `health-bad:1.0`
- Healthcheck testet einen Pfad, den nginx **nicht** ausliefert (z.B. `/gibts-nicht`)
- Bewusst kurze Werte: `--interval=3s --timeout=2s --start-period=1s --retries=2`
- Beobachte: nach wie vielen Sekunden flippt der Status auf `unhealthy`?

??? success "Musterlösung"

    `Dockerfile.bad`:
    ```dockerfile
    FROM nginx:alpine
    HEALTHCHECK --interval=3s --timeout=2s --start-period=1s --retries=2 \
      CMD wget --quiet --spider http://localhost/gibts-nicht || exit 1
    ```

    Bauen, starten, beobachten:
    ```bash
    docker build -f Dockerfile.bad -t health-bad:1.0 .
    docker run -d --name health-bad -p 9091:80 health-bad:1.0
    sleep 12
    docker ps --filter name=health-bad --format "table {{.Names}}\t{{.Status}}"
    ```

    Erwartet nach ca. 10 Sekunden:
    ```text
    NAMES        STATUS
    health-bad   Up 12 seconds (unhealthy)
    ```

    Aufräumen:
    ```bash
    docker rm -f health-bad
    docker rmi health-bad:1.0
    ```

    **Rechnung:** `start-period 1s + (interval 3s * retries 2) ≈ 7s`. Realistisch nach 7–12 Sekunden flippt der Status auf `unhealthy`.

---

## Was du danach kannst

- Einen `HEALTHCHECK` **direkt im Dockerfile** schreiben.
- Die vier Parameter `interval`, `timeout`, `start-period`, `retries` sinnvoll wählen.
- Den Health-Status im `docker ps`-Output ablesen.
- Mit `docker inspect ... .State.Health` die letzten Check-Resultate sehen, inklusive Output.

---

## Wichtige Hinweise

??? info "Healthcheck im laufenden Container überschreiben"
    Du kannst einem Container beim `docker run` einen anderen Healthcheck geben (oder ihn deaktivieren), ohne das Image zu rebauen:

    ```bash
    # Eigenen Check beim Start
    docker run -d --name x \
      --health-cmd='curl -fsS http://localhost/health' \
      --health-interval=10s \
      nginx:alpine

    # Oder ganz deaktivieren
    docker run -d --name y --no-healthcheck nginx:alpine
    ```

    Das ist nützlich, wenn ein Image einen schlechten Default-Healthcheck mitbringt und du den Container temporär anders konfigurieren willst.

??? warning "Healthcheck darf nicht teuer sein"
    Der Healthcheck läuft **alle X Sekunden, für immer**. Wenn er aufwendige Datenbank­queries macht oder externe APIs anfragt, kostet das messbar Ressourcen. Faustregel: ein Healthcheck sollte unter **1 Sekunde** laufen und nur **lokale** Ressourcen nutzen.

---

## Weiter

- [Übung 4 – Restart-Policies und Crash-Recovery](04-restart-policies.md)
- Zurück zur [Übersicht](index.md)
