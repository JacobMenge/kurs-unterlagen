# monitoring-praxis – Praxis-App für den Monitoring-Block

Der **Monitoring-Stack mit Beispiel-App**: fertige Übungsumgebung für den
[Monitoring-Block](../../docs/monitoring-praxis/index.md). Hier liegt ein
**lauffähiger Monitoring-Stack** aus **Prometheus** und **Grafana**, der eine
kleine Beispiel-App überwacht. Der Fokus der Übung liegt **auf dem Monitoring**
(Metriken lesen, PromQL, Dashboards, Alarme) – nicht auf dem Schreiben von
Compose-Dateien. Das war der [Mission-Control-Block](../../docs/docker-compose-mission-control/index.md).

## Sofort starten

```bash
docker compose up -d --build
```

Es ist **keine** weitere Vorbereitung nötig – die Ports sind mit Standardwerten
hinterlegt. Danach erreichbar:

- Station-API + Metriken: <http://localhost:8090> bzw. <http://localhost:8090/metrics>
- Prometheus: <http://localhost:9090>
- Grafana: <http://localhost:3001> (Login `admin` / `admin`)

Optional lassen sich die Ports über eine `.env` ändern (siehe `.env.example`).

## Was liegt hier?

| Ordner / Datei | Zweck |
|---|---|
| `compose.yaml` | Der fertige Stack: `station-api`, `prometheus`, `grafana`. |
| `prometheus/prometheus.yml` | Scrape-Konfiguration (was Prometheus abfragt). |
| `station-api/` | Die überwachte App (Node, ohne Abhängigkeiten). Liefert Metriken unter `/metrics`. **Nicht ändern.** |
| `grafana/provisioning/` | Richtet die Prometheus-Datenquelle in Grafana automatisch ein. |
| `.env.example` | Optionale Port-Anpassungen. |

## Vorfall simulieren

Einfach im Browser öffnen (oder im Terminal mit `curl.exe` unter Windows, `curl` unter macOS/Linux):

- <http://localhost:8090/api/simulate/leak> – Sauerstoff fällt, Alarm
- <http://localhost:8090/api/simulate/repair> – erholt sich wieder
- <http://localhost:8090/api/load?ms=800> – erzeugt kurz CPU-Last

## Wofür ist das?

Reines Übungsobjekt. Die `station-api` misst erfundene Stationswerte
(Sauerstoff, Energielast, Hüllentemperatur) und echte (HTTP-Anfragen,
Antwortzeiten). Damit habt ihr etwas Realistisches zum Visualisieren und
Alarmieren – ohne echten Anwendungscode anzufassen.
