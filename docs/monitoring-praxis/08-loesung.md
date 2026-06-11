---
title: "Lösung"
description: "Vollständige Lösung: Panel-Abfragen, Alarm-Setup und die Bonus-Aufgaben. Erst nach der eigenen Arbeit aufschlagen!"
---

# Lösung

!!! danger "Erst nach der eigenen Arbeit aufschlagen!"
    Diese Seite enthält die **vollständige Lösung**. Wenn ihr noch in der Gruppenarbeit seid: [Hilfekarten](07-hilfekarten.md) sind der bessere Ort.

---

## Stack starten

```bash
cd apps/monitoring-praxis
docker compose up -d --build
docker compose ps
```

Drei Dienste `Up`. Erreichbar: <http://localhost:8090>, <http://localhost:9090>, <http://localhost:3001> (admin/admin).

---

## Die vier Pflicht-Panels

In Grafana: **Dashboards → New → New dashboard → + Add visualization → Prometheus**. Die Abfrage im Bereich **Query** unter **Code** eintippen, oben rechts den Visualisierungstyp wählen, **Apply**, am Ende Dashboard speichern.

| Panel | Abfrage | Typ | Optionen |
|---|---|---|---|
| Sauerstoff | `aurora_oxygen_percent` | Gauge | Min 0, Max 100; Thresholds: Base rot, 90 grün (= unter 90 rot) |
| Energielast | `aurora_power_load_percent` | Time series | – |
| Module gesamt | `sum(aurora_modules_total)` | Stat | – |
| Dienste erreichbar | `up` | Stat | – |

Kür:

| Panel | Abfrage | Typ |
|---|---|---|
| Anfragen/Sekunde | `rate(aurora_http_requests_total[1m])` | Time series |
| Module nach Status | `aurora_modules_total` | Time series / Bar gauge |

---

## Der Alarm

**Teil A – sichtbarer Alarm (geht immer).** Das Sauerstoff-Panel hat einen Threshold bei 90 – das Gauge wird automatisch **rot**, wenn der Wert darunterfällt. Das reicht für den Störfall.

**Teil B – echte Alarm-Regel (optional, etwas fortgeschritten).**

1. **Alerting → Alert rules → + New alert rule**.
2. Name „Sauerstoff niedrig".
3. **Query A** (Prometheus): `aurora_oxygen_percent`.
4. Den vorbereiteten **Threshold**-Ausdruck auf **IS BELOW `90`** stellen und als Alarmbedingung wählen (der Reduce „Last" bleibt davor).
5. **Evaluation behavior**: Ordner (z.B. „Monitoring") + Evaluation-Group mit `10s`, „pending period" `0`.
6. **Save rule and exit**. Den Status seht ihr unter **Alerting → Alert rules** (kein Contact Point nötig).

**Störfall auslösen und beobachten** – einfach im Browser öffnen:

- <http://localhost:8090/api/simulate/leak> → Wert fällt, Gauge wird rot, (falls Regel gebaut) Status **Firing**
- <http://localhost:8090/api/simulate/repair> → erholt sich, zurück auf **Normal**

Im Terminal alternativ `curl.exe "…"` (Windows) bzw. `curl "…"` (macOS/Linux).

Echter Ausfall (Variante): `docker compose stop station-api` → `up` fällt auf 0 → `docker compose start station-api`.

---

## Persistenz

```bash
docker compose down
docker compose up -d
```

Dashboard ist noch da (Volume `grafana-data`). Bei `docker compose down -v` wäre es weg, die Datenquelle käme aber sofort wieder (automatische Einrichtung).

---

## Die ausgelieferten Dateien (zum Nachschauen)

Diese Dateien schreibt ihr heute nicht selbst – sie liegen fertig im Projekt.

`compose.yaml`:

```yaml
services:

  station-api:
    build: ./station-api
    environment:
      PORT: 8000
    ports:
      - "${STATION_PORT:-8090}:8000"

  prometheus:
    image: prom/prometheus:v2.54.1
    volumes:
      - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - prometheus-data:/prometheus
    ports:
      - "${PROMETHEUS_PORT:-9090}:9090"

  grafana:
    image: grafana/grafana:11.2.0
    environment:
      GF_SECURITY_ADMIN_USER: ${GRAFANA_ADMIN_USER:-admin}
      GF_SECURITY_ADMIN_PASSWORD: ${GRAFANA_ADMIN_PASSWORD:-admin}
      GF_USERS_ALLOW_SIGN_UP: "false"
    volumes:
      - ./grafana/provisioning:/etc/grafana/provisioning:ro
      - grafana-data:/var/lib/grafana
    ports:
      - "${GRAFANA_PORT:-3001}:3000"
    depends_on:
      - prometheus

volumes:
  prometheus-data:
  grafana-data:
```

`prometheus/prometheus.yml`:

```yaml
global:
  scrape_interval: 5s
  evaluation_interval: 5s

scrape_configs:
  - job_name: prometheus
    static_configs:
      - targets: ["localhost:9090"]

  - job_name: station-api
    static_configs:
      - targets: ["station-api:8000"]
```

---

## Bonus A – cAdvisor

Ergänzt in der `compose.yaml` einen Dienst:

```yaml
  cadvisor:
    image: gcr.io/cadvisor/cadvisor:v0.49.1
    privileged: true
    devices:
      - /dev/kmsg
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:ro
      - /sys:/sys:ro
      - /var/lib/docker/:/var/lib/docker:ro
      - /dev/disk/:/dev/disk:ro
    ports:
      - "${CADVISOR_PORT:-8085}:8080"
```

Und in `prometheus/prometheus.yml` einen Scrape-Job:

```yaml
  - job_name: cadvisor
    static_configs:
      - targets: ["cadvisor:8080"]
```

Dann `docker compose up -d` und `docker compose restart prometheus`. Panel: `container_memory_usage_bytes`. Falls cAdvisor zickt: [Hilfekarte 7](07-hilfekarten.md#hilfekarte-7-cadvisor-startet-nicht-bonus-a-windowsmacos).

---

## Bonus B – node-exporter

```yaml
  node-exporter:
    image: prom/node-exporter:v1.8.2
    ports:
      - "${NODE_EXPORTER_PORT:-9100}:9100"
```

Scrape-Job:

```yaml
  - job_name: node-exporter
    static_configs:
      - targets: ["node-exporter:9100"]
```

Panel: `node_memory_MemAvailable_bytes` oder `rate(node_cpu_seconds_total{mode="idle"}[1m])`.

---

## Bonus C – PromQL

```promql
histogram_quantile(0.95, rate(aurora_http_request_duration_seconds_bucket[5m]))
rate(aurora_http_requests_total{status="200"}[1m])
sum(aurora_modules_total)
```

Vorher Last erzeugen: <http://localhost:8090/api/load?ms=800> im Browser öffnen (oder `curl.exe`/`curl`).

---

## Typische Fehler

| Symptom | Ursache & Lösung |
|---|---|
| Target `station-api` `DOWN` | Stack gerade gestartet → warten; sonst `docker compose ps` prüfen |
| Grafana: keine Datenquelle | `docker compose logs grafana` prüfen, dann `restart grafana` |
| Panel „No data" | Zeitfenster oben rechts auf „Last 5 minutes" |
| Port belegt | `.env` anlegen, Host-Ports ändern (Hilfekarte 6) |

---

## Aufräumen

```bash
docker compose down          # Container weg, Daten bleiben
docker compose down -v       # alles weg, inkl. Dashboards
```

---

## Weiter

- [Rückblick & Ausblick](09-rueckblick.md)
