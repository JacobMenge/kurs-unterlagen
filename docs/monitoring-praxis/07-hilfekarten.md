---
title: "Hilfekarten"
description: "Abgestufte Hinweise – nutzt sie nur, wenn ihr feststeckt."
---

# Hilfekarten

!!! tip "Spielregel"
    Nutzt diese Karten **nur**, wenn ihr feststeckt. Erst selbst überlegen, auf die Targets-Seite und in die Logs schauen, im Team diskutieren – **dann** aufklappen.

---

## Hilfekarte 1 – Status der Services prüfen

??? info "Aufklappen"
    Erste Frage immer: **Laufen die drei Dienste?**

    ```bash
    docker compose ps
    ```

    Erwartet: `station-api`, `prometheus`, `grafana` mit Status `Up`. Ein Dienst im Zustand `Restarting` oder `Exited` ist euer Problem – dann Logs lesen (Hilfekarte 3).

---

## Hilfekarte 2 – Ein Target steht auf DOWN

??? info "Aufklappen"
    In Prometheus unter **Status → Targets** steht ein Ziel auf `DOWN`. Klickt es an – Prometheus zeigt den Fehler.

    **Häufigste Ursachen:**

    1. Der Dienst `station-api` läuft nicht → `docker compose ps` prüfen.
    2. Der Stack ist gerade erst gestartet → ein paar Sekunden warten, Seite neu laden.

    **Selbst prüfen:** Öffne <http://localhost:8090/metrics> im Browser. Kommt dort Text? Dann ist die App in Ordnung und das Target wird gleich `UP`. Kommt nichts, ist `station-api` noch nicht bereit – `docker compose ps` und [Hilfekarte 1](#hilfekarte-1-status-der-services-prufen).

---

## Hilfekarte 3 – Logs gezielt lesen

??? info "Aufklappen"
    ```bash
    docker compose logs station-api
    docker compose logs prometheus
    docker compose logs -f grafana    # live folgen, Ctrl+C zum Beenden
    ```

    Häufige Zeilen:

    | Log-Zeile | Bedeutung |
    |---|---|
    | `[station-api] Telemetrie-API hört auf Port 8000` | App läuft |
    | `Server is ready to receive web requests` | Prometheus läuft |
    | `HTTP Server Listen` (Grafana) | Grafana ist bereit |

---

## Hilfekarte 4 – Grafana: Datenquelle fehlt oder „Bad Gateway"

??? info "Aufklappen"
    **Keine Datenquelle vorhanden?** Eigentlich richtet sich die automatisch ein. Prüfen: läuft `grafana` (`docker compose ps`)? Steht in `docker compose logs grafana` ein Provisioning-Fehler? Nach einer Korrektur: `docker compose restart grafana`.

    **„Bad Gateway" / „error reading Prometheus"?** Dann läuft `prometheus` nicht oder die Datenquellen-URL stimmt nicht. Sie muss `http://prometheus:9090` sein (Service-Name!) – unter **Connections → Data sources → Prometheus**.

---

## Hilfekarte 5 – Panel zeigt „No data"

??? info "Aufklappen"
    1. **Zeitfenster:** oben rechts in Grafana. Steht es auf „Last 6 hours", eure Daten sind aber zwei Minuten alt? Auf **Last 5 minutes** stellen, Auto-Refresh `5s`.
    2. **Abfrage testen:** dieselbe Abfrage erst in Prometheus (`9090`, Reiter Graph). Kommt dort etwas? Dann liegt es an Grafana (Zeitfenster). Kommt auch dort nichts, stimmt der Metrik-Name nicht.
    3. **Metrik-Name:** Tippfehler? Die Werte heißen `aurora_…`. In Prometheus schlägt das Suchfeld die Namen vor.

---

## Hilfekarte 6 – Port ist bereits belegt

??? info "Aufklappen"
    Symptom:

    ```text
    Bind for 0.0.0.0:3001 failed: port is already allocated
    ```

    **Ursache:** Auf dem Host läuft schon etwas auf dem Port (oft ein Container aus einer früheren Übung).

    **Lösung:** Legt eine Datei `.env` neben die `compose.yaml` (oder kopiert `.env.example`) und wählt andere Host-Ports:

    ```env
    STATION_PORT=8091
    PROMETHEUS_PORT=9091
    GRAFANA_PORT=3002
    ```

    Dann `docker compose up -d`. Den blockierenden Prozess findet ihr unter Windows mit `netstat -ano | findstr ":3001"`.

---

## Hilfekarte 7 – cAdvisor startet nicht (Bonus A, Windows/macOS)

??? warning "Aufklappen"
    cAdvisor ist für Linux gebaut und braucht Host-Mounts. Auf Docker Desktop klappt das meistens, aber nicht immer.

    1. Logs lesen: `docker compose logs cadvisor`.
    2. Sicherstellen, dass `privileged: true` und die Mounts gesetzt sind (siehe [Lösung](08-loesung.md#bonus-a-cadvisor)).
    3. Manche Docker-Desktop-Versionen mögen `/dev/disk/:/dev/disk:ro` nicht – **diese Zeile weglassen** und neu starten.

    !!! tip "cAdvisor ist nur Bonus"
        Wenn es partout nicht will: lasst den Dienst weg. Der komplette Pflichtteil (Metriken, Dashboard, Alarm) läuft auch ohne.

---

## Hilfekarte 8 – Sauberes Reset

??? warning "Aufklappen – nur wenn ihr alles neu starten wollt"
    Löscht Container, Netzwerk und **alle Volumes** dieses Projekts (Dashboards und Messreihen sind danach weg):

    ```bash
    docker compose down -v
    docker compose up -d --build
    ```

    Die Grafana-Datenquelle ist sofort wieder da (wird automatisch eingerichtet), eure Dashboards müsst ihr neu bauen.

---

## Weiter

- Zurück zur [Gruppenaufgabe](06-gruppenaufgabe.md)
- Erst nach ehrlichem eigenen Versuch: [Lösung](08-loesung.md)
