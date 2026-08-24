---
title: "Gruppenaufgabe"
description: "Die Gruppenarbeit: gemeinsam ein Monitoring-Dashboard bauen, einen Alarm einrichten und einen simulierten Störfall meistern. Schritt für Schritt."
---

# Gruppenaufgabe: Dashboard, Alarm und ein Störfall

Jetzt arbeitet ihr **in Gruppen (4–5 Personen)** zusammen. Der Stack läuft – euer Auftrag: ein **Dashboard** bauen, einen **Alarm** einrichten und einen **simulierten Störfall** meistern. Das ist genau der Ablauf, den ein Betriebs-Team auch für echte Systeme aufsetzt.

!!! info "Voraussetzung"
    Der Stack läuft (siehe [Beispiel-Anwendung starten](04-beispiel-anwendung.md)) und ihr habt die [ersten Übungen](05-erste-uebungen.md) gemacht. Jede:r sollte einmal ein Panel gebaut haben.

---

## Rollen verteilen

Bei 4–5 Personen lohnt sich klare Aufteilung. Wechselt die Rollen ruhig zwischendurch.

| Rolle | Aufgabe |
|---|---|
| **Driver** | teilt den Bildschirm und klickt in Grafana |
| **Navigator** | behält Aufgaben und Reihenfolge im Blick |
| **PromQL-Spezialist** | findet und prüft die Abfragen (testet in Prometheus) |
| **Störfall-Verantwortliche:r** | löst in Aufgabe 5 den Störfall aus und beschreibt, was passiert |
| **Dokumentator** | notiert Abfragen, Beobachtungen, offene Fragen |

---

## Zeitrahmen

```text
ca. 45–60 Minuten
```

Danach zeigt jede Gruppe kurz ihr Dashboard und den Alarm.

---

# Eure Aufgaben

!!! tip "So baut ihr jedes Panel (einmal lesen, dann ist es immer gleich)"
    Jedes Panel entsteht in derselben Reihenfolge wie in [Übung 4](05-erste-uebungen.md): **Abfrage eingeben → Visualisierungstyp wählen → (Optionen setzen) → Apply**. Wo das jeweils sitzt:

    - **Abfrage:** unten im Bereich **Query**. Rechts auf **Code** umschalten (statt Builder) und die Abfrage ins Textfeld tippen.
    - **Visualisierungstyp:** Dropdown **oben rechts** (z.B. von „Time series" auf „Gauge" oder „Stat").
    - **Titel, Min/Max, Thresholds:** in der **rechten Optionsspalte** – der Titel ganz oben unter „Panel options", Min/Max und Thresholds weiter unten unter „Standard options" bzw. „Thresholds".
    - **Neues Panel:** das erste über **Dashboards → New → New dashboard → + Add visualization**, jedes weitere über **Add → Visualization** oben in der Leiste.
    - **Apply** (oben rechts) bringt euch zurück aufs Dashboard. Das **Disketten-Symbol** speichert das ganze Dashboard.

## Aufgabe 1 – Dashboard mit Sauerstoff-Panel

1. In Grafana (<http://localhost:3001>): **Dashboards → New → New dashboard → + Add visualization**, Datenquelle **Prometheus**.
2. Abfrage `aurora_oxygen_percent` (im **Query**-Bereich auf **Code** umschalten), Typ **Gauge**, `Min` 0 / `Max` 100. Bei **Thresholds** so einstellen, dass es **unter 90 rot** wird: **Base** auf Rot, zweite Zeile Wert `90` auf Grün. **Apply**.
3. Oben rechts **speichern** (Disketten-Symbol), Name z.B. „Monitoring – Gruppe X".

!!! tip "Ab jetzt nach jedem Panel speichern"
    Dann ist nichts weg, wenn der Browser zickt.

!!! note "Kurz erklärt: Gauge und Schwellwert"
    Ein **Gauge** ist wie ein Tacho: ein einzelner Wert auf einer Skala. `Min`/`Max` legen die Skala fest (hier 0–100 %). Der **Threshold** bei 90 ist eine Farb-Grenze – darüber grün, darunter rot. So seht ihr den Zustand auf einen Blick, ohne eine Zahl lesen zu müssen.

---

## Aufgabe 2 – Verläufe: Energielast und Antwortzeiten

1. **Add → Visualization.** Abfrage `aurora_power_load_percent`, Typ **Time series**, Titel „Energielast". Apply.
2. Noch ein Panel: `aurora_hull_temp_celsius`, **Time series**, Titel „Hüllentemperatur". Apply.
3. **Kür:** ein Panel mit `rate(aurora_http_requests_total[1m])` (Anfragen pro Sekunde). Erzeugt vorher etwas Last, indem ihr diese Adresse **ein paar Mal im Browser** öffnet (oder mit F5 neu ladet):

    <http://localhost:8090/api/load?ms=800>

!!! note "Kurz erklärt: warum hier Verlauf statt Tacho?"
    Energielast und Antwortzeiten sind als **Verlauf** (Time series) am aussagekräftigsten: Ein Tacho zeigt nur den Moment, der Verlauf zeigt den **Trend**. Steigt etwas langsam an, bevor es kritisch wird? Solche schleichenden Entwicklungen erkennt man erst über die Zeit.

---

## Aufgabe 3 – Überblick: Zustand auf einen Blick

1. **Add → Visualization.** Abfrage `sum(aurora_modules_total)`, Typ **Stat**, Titel „Module gesamt".
2. Noch ein Panel: `up`, Typ **Stat**, Titel „Dienste erreichbar". Das zeigt pro Ziel `1` (erreichbar) oder `0` (weg).
3. Dashboard speichern. Wichtige Panels (Sauerstoff, Erreichbarkeit) nach oben ziehen.

!!! note "Kurz erklärt: `sum()` und `up`"
    `sum(aurora_modules_total)` nimmt die einzelnen Werte je Status und zählt sie zu **einer** Zahl zusammen – ideal für eine Stat-Kachel. `up` liefert pro überwachtem Dienst eine `1` (erreichbar) oder `0` (weg). Als **Stat** dargestellt habt ihr zwei Kennzahlen, die ihr im Vorbeigehen ablesen könnt.

---

## Aufgabe 4 – Den Alarm einrichten

**Teil A – der sichtbare Alarm (geht immer).** Euer Sauerstoff-Panel aus Aufgabe 1 hat schon einen **Threshold bei 90**. Dadurch färbt sich das Gauge automatisch **rot**, sobald der Wert darunterfällt. Das ist euer sofort sichtbarer Alarm – mehr braucht ihr für den Störfall in Aufgabe 5 nicht.

**Teil B – die echte Alarm-Regel (optional, etwas fortgeschritten).** Eine Regel, die in den Status „Firing" geht:

1. Links im Menü **Alerting → Alert rules → + New alert rule**.
2. **Name**: z.B. „Sauerstoff niedrig".
3. **Query A** (Datenquelle Prometheus): `aurora_oxygen_percent`.
4. Im Bedingungsbereich sind ein **Reduce** (Funktion `Last`) und ein **Threshold** schon vorbereitet. Stellt den Threshold auf **IS BELOW `90`** und lasst ihn als Alarmbedingung gewählt.
5. **Evaluation behavior**: einen Ordner anlegen oder wählen (z.B. „Monitoring") und eine Evaluation-Group mit Intervall `10s`, „pending period" `0`.
6. Oben rechts **Save rule and exit**. Eine Benachrichtigung (Contact Point) ist nicht nötig – den Status seht ihr direkt in der Liste.

!!! info "Noch ist alles ruhig"
    Solange der Wert über 90 liegt, ist das Gauge grün und die Regel steht auf **Normal**. Das ändert sich in Aufgabe 5.

!!! note "Kurz erklärt: die Begriffe in der Alarm-Regel"
    Die Begriffe in Teil B klingen technisch, meinen aber etwas Einfaches:

    - **Query A** ist eure Abfrage – welche Zahl überwacht wird.
    - **Reduce (Last)** nimmt davon den **letzten** Wert. Eine Regel braucht einen einzelnen Wert, keinen ganzen Verlauf.
    - **Threshold – IS BELOW 90** ist die eigentliche Bedingung: schlägt an, sobald der Wert unter 90 liegt.
    - **Evaluation** legt fest, **wie oft** geprüft wird (alle 10s) und wie lange die Bedingung halten muss, bevor es Alarm gibt („pending period" 0 = sofort).

    Zusammen heißt das schlicht: „Sieh alle 10 Sekunden nach dem letzten Sauerstoffwert und schlag Alarm, sobald er unter 90 liegt."

---

## Aufgabe 5 – Der Störfall

Die/der **Störfall-Verantwortliche** löst einen simulierten Ausfall aus – so, wie man in einem echten Betrieb einen Notfall **probt**. Öffnet dazu einfach diese Adresse im Browser:

> **<http://localhost:8090/api/simulate/leak>**

Beobachtet **gemeinsam**:

- Auf <http://localhost:8090> fällt der Wert sichtbar.
- Im Grafana-Gauge sinkt er unter 90 und wird **rot**.
- Falls ihr Teil B gemacht habt: unter **Alerting → Alert rules** springt eure Regel auf **Firing**. 🚨

Dann die Lage beruhigen – wieder im Browser:

> **<http://localhost:8090/api/simulate/repair>**

Der Wert erholt sich, das Gauge wird wieder grün (und die Regel geht zurück auf **Normal**).

!!! note "Kurz erklärt: was beim Störfall passiert"
    Hinter der Adresse steckt nur ein Schalter in der Beispiel-App: er lässt den Sauerstoffwert sinken. Prometheus liest den fallenden Wert wie immer ab. Sobald er unter 90 rutscht, greift eure Threshold-Regel und färbt das Gauge rot. „Firing" heißt: die Alarm-Bedingung ist erfüllt und bleibt erfüllt. Bei einer echten Störung läuft es genauso – nur drückt dort kein Schalter den Wert nach unten, sondern ein echtes Problem.

!!! note "Lieber im Terminal?"
    Statt im Browser geht auch das Terminal. Unter **Windows** mit `curl.exe`, unter macOS/Linux mit `curl`:

    ```bash
    curl.exe http://localhost:8090/api/simulate/leak
    ```

!!! tip "Zweite Variante: echter Ausfall"
    Stoppt die App und schaut, wie `up` auf 0 fällt:

    ```bash
    docker compose stop station-api
    ```

    In Prometheus (**Status → Targets**) wird `station-api` **DOWN**, euer `up`-Panel zeigt 0. Danach wieder starten: `docker compose start station-api`.

**Notiert** (Dokumentator): Wie lange dauerte es vom Störfall bis zum roten Gauge? Was würdet ihr in einem echten Betrieb jetzt tun?

---

## Aufgabe 6 – Übersteht das Dashboard einen Neustart?

```bash
docker compose down
docker compose up -d
```

Grafana neu öffnen, einloggen: **Ist euer Dashboard noch da?** Es sollte – es liegt in einem Volume. (Bei `docker compose down -v` wäre es weg, die Datenquelle käme aber sofort wieder, weil sie automatisch eingerichtet wird.)

!!! note "Kurz erklärt: warum überlebt das Dashboard den Neustart?"
    Eure Dashboards liegen in einem **Volume** – einem Datenspeicher, der getrennt vom Container existiert. `docker compose down` entfernt nur die Container; das Volume bleibt stehen, also sind die Dashboards beim nächsten Start wieder da. Erst `down -v` löscht auch das Volume. Die Prometheus-Datenquelle dagegen kommt aus der Provisionierung und wird bei jedem Start automatisch neu angelegt.

---

# Bonus-Aufgaben

## Bonus A – Container-Vitalwerte mit cAdvisor

Bisher seht ihr nur die Werte, die die **App** selbst liefert. **cAdvisor** ist ein fertiger Exporter, der zusätzlich misst, wie viel **CPU und Speicher jeder Container** verbraucht – ganz ohne Änderung an der App. Damit seht ihr nicht nur „wie geht es dem Dienst", sondern auch „wie schwer arbeitet die Maschine darunter".

Service + Scrape-Job stehen in der [Lösung](08-loesung.md#bonus-a-cadvisor). Danach baut ihr ein Panel mit `container_memory_usage_bytes` (Time series).

## Bonus B – Host-Werte mit node-exporter

cAdvisor misst die **Container**. Der **node-exporter** misst die Ebene darunter: den **Host** selbst – CPU, Arbeitsspeicher, Festplatte, Netzwerk. Damit beantwortet ihr die Frage „liegt es an meinem Dienst oder an der Maschine?".

Service + Scrape-Job stehen in der [Lösung](08-loesung.md#bonus-b-node-exporter). Danach baut ihr ein Panel mit `node_memory_MemAvailable_bytes` (Time series) oder `rate(node_cpu_seconds_total{mode="idle"}[1m])`.

## Bonus C – PromQL-Challenges

Zwei etwas kniffligere Abfragen – baut daraus je ein Panel und überlegt, was sie aussagen:

- **95.-Perzentil der Antwortzeit:** `histogram_quantile(0.95, rate(aurora_http_request_duration_seconds_bucket[5m]))`
    – heißt: 95 % der Anfragen waren schneller als dieser Wert. Ein gutes Maß für die „gefühlte" Geschwindigkeit, weil einzelne Ausreißer es kaum verzerren.
- **Anfragen pro Sekunde, nur erfolgreiche (Status 200):** `rate(aurora_http_requests_total{status="200"}[1m])`
    – dieselbe Rate wie in Übung 3, hier aber mit einem Label-Filter auf den HTTP-Status.

Die Abfragen stehen auch in der [Lösung](08-loesung.md#bonus-c-promql).

## Bonus D – Drei Sätze fürs Protokoll

Was bringt euch dieses Monitoring konkret gegenüber „wir schauen ab und zu drauf"? Und welcher **eine** Alarm wäre für so eine Anwendung am wichtigsten?

---

## Wenn ihr nicht weiterkommt

→ [Hilfekarten](07-hilfekarten.md) · im Plenum fragen · erst nach ehrlichem Versuch die [Lösung](08-loesung.md).

---

# Was ihr am Ende zeigt

Jede Gruppe zeigt kurz (3–5 Minuten):

1. **Euer Dashboard** mit mindestens vier Panels (Sauerstoff, Energielast, Module gesamt, Dienste erreichbar).
2. **Der Alarm in Aktion** – Störfall auslösen, das Gauge wird rot (und falls gebaut: die Regel feuert), dann beruhigen.
3. **Eine Beobachtung** aus Aufgabe 5.

---

## Reflexionsfragen

1. Was ist der Unterschied zwischen „der Dienst **läuft**" und „der Dienst ist **gesund**"?
2. Warum **holt** Prometheus die Werte ab (Pull), statt dass die App sie irgendwohin schickt?
3. Warum schaut man einen **Counter** mit `rate(...)` an und nicht direkt?
4. Warum ist ein Alarm mit **sinnvoller Schwelle** besser als „warne bei jeder Änderung"?
5. Wo hilft euch Monitoring **konkret in der Systemintegration und Vernetzung** – wenn ihr vernetzte Systeme aufbaut und am Laufen halten müsst?

---

## Checkliste

| Kriterium | Erfüllt? |
|---|---|
| Eigenes Dashboard angelegt und gespeichert | ☐ |
| Sauerstoff als Gauge mit Threshold bei 90 (wird rot) | ☐ |
| Energielast und Hüllentemperatur als Time series | ☐ |
| `sum(aurora_modules_total)` und `up` als Stat | ☐ |
| Störfall ausgelöst, Gauge wird rot, danach beruhigt | ☐ |
| Echte Alarm-Regel gebaut (optional) | ☐ |
| Persistenz nach `down` + `up` geprüft | ☐ |
| Mindestens ein Bonus geschafft | ☐ |

---

## Weiter

- [Hilfekarten](07-hilfekarten.md) – wenn etwas hakt
- [Lösung](08-loesung.md) – erst nach eurem Versuch
- [Rückblick & Ausblick](09-rueckblick.md)
