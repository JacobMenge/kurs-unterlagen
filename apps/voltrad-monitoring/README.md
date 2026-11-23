# voltrad-monitoring

Übungsstack für die beiden Praxisseiten
[Monitoring für Voltrad](../../docs/betrieb/praxis-monitoring.md) und
[Alarmierung für Voltrad](../../docs/betrieb/praxis-alarmierung.md).

```bash
docker compose up -d
```

| Dienst | Aufgabe | Im Browser |
|---|---|---|
| `werk` | Simulator: sieben Systeme der Voltrad GmbH mit ihren Messwerten, Störungen auf Knopfdruck, Zeitraffer der Woche vor dem Angriff | <http://localhost:8090> |
| `prometheus` | fragt die Systeme alle 2 Sekunden ab, prüft die Alarmregeln | <http://localhost:9090> |
| `grafana` | Dashboards, ohne Anmeldung | <http://localhost:3000> |
| `alertmanager` | bringt Alarme zum Empfänger | <http://localhost:9093> |
| `empfaenger` | Diensthandy, Ticketsystem und das Postfach des früheren Administrators | <http://localhost:8091> |

In der Zielliste `prometheus/prometheus.yml` fehlt absichtlich MES-01, und
`alertmanager/alertmanager.yml` schickt absichtlich alles an das alte
Postfach. Beides reparieren die Teilnehmenden in den Übungen.

Die Teilnehmenden laden den Stack als ZIP von der Kursseite. Das ZIP entsteht
aus diesem Ordner:

```bash
cd apps/voltrad-monitoring
rm -f ../../docs/assets/dateien/voltrad-monitoring.zip
zip -r ../../docs/assets/dateien/voltrad-monitoring.zip . -x "README.md" -x ".*" -x "*/.*" -x "*__pycache__*"
```
