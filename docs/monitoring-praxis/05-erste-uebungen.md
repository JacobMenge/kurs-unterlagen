---
title: "Erste Übungen"
description: "Erst prüfen, ob alles läuft, dann vier kleine, komplett angeleitete Übungen: Metriken lesen, PromQL, Counter vs. Rate und das erste Grafana-Panel."
---

# Erste Übungen

Bevor es in die Gruppe geht, wirst du hier in kleinen Schritten warm. Mach das **allein oder zu zweit** – jede Übung dauert nur ein paar Minuten und ist **komplett angeleitet**.

!!! info "Voraussetzung"
    Der Stack läuft (`docker compose up -d --build`, siehe [Beispiel-Anwendung starten](04-beispiel-anwendung.md)).

---

## Übung 0 – Läuft alles?

!!! info "Worum es geht"
    Zuerst stellen wir sicher, dass alle drei Dienste laufen und erreichbar sind. Erst dann lohnt sich der Rest.

#### Aufgabe

Prüfe die drei Dienste und öffne die drei Oberflächen.

??? tip "Schritt für Schritt"
    **Schritt 1:** Im Terminal prüfen, dass drei Dienste laufen:

    ```bash
    docker compose ps
    ```

    Erwartet: `station-api`, `prometheus`, `grafana` mit Status `Up`.

    **Schritt 2:** Die drei Oberflächen im Browser öffnen:

    - <http://localhost:8090> – die App zeigt eine kleine Statusseite
    - <http://localhost:8090/metrics> – rohe Messwerte (viele `aurora_…`-Zeilen)
    - <http://localhost:9090> – Prometheus
    - <http://localhost:3001> – Grafana (Login `admin` / `admin`)

    **Schritt 3:** In Prometheus oben auf **Status → Targets**. Stehen `prometheus` und `station-api` auf **`UP`**?

??? success "Erwartung"
    Drei Dienste `Up`, alle Oberflächen erreichbar, beide Targets `UP`. Falls `station-api` auf `DOWN` steht: [Hilfekarte 2](07-hilfekarten.md#hilfekarte-2-ein-target-steht-auf-down). Läuft etwas gar nicht: [Hilfekarte 1](07-hilfekarten.md#hilfekarte-1-status-der-services-prufen).

!!! note "Kurz erklärt: das `up`-Signal"
    `up` ist eine Metrik, die **Prometheus selbst** für jedes Ziel setzt: `1`, wenn es das Ziel beim letzten Abruf erreicht hat, sonst `0`. Damit erkennst du einen Ausfall, ohne dass die App überhaupt etwas melden muss – das ist dein einfachster Alarm.

---

## Übung 1 – Metriken mit eigenen Augen sehen

!!! info "Was du lernst"
    Wie rohe Metriken aussehen und woran du die drei Typen erkennst.

#### Aufgabe

Öffne <http://localhost:8090/metrics> und finde drei bestimmte Werte.

??? tip "Schritt für Schritt"
    **Schritt 1:** Öffne <http://localhost:8090/metrics>. Du siehst viele Zeilen Text – das ist das **Prometheus-Format**, genau das holt sich Prometheus alle 5 Sekunden ab.

    **Schritt 2:** Suche die Zeile, die mit `aurora_oxygen_percent` beginnt (ohne `#`):

    ```text
    aurora_oxygen_percent 97.50
    ```

    **Schritt 3:** Direkt darüber erklären zwei `#`-Zeilen die Metrik:

    ```text
    # HELP aurora_oxygen_percent Sauerstoffgehalt der Station in Prozent.
    # TYPE aurora_oxygen_percent gauge
    ```

    `# TYPE` nennt den Typ – hier **gauge** (geht rauf und runter).

    **Schritt 4:** Lade die Seite zweimal mit ein paar Sekunden Abstand neu. Ändert sich der Wert leicht?

??? success "Erwartung"
    Du hast `aurora_oxygen_percent` (**gauge**), `aurora_http_requests_total` (**counter**) und `aurora_http_request_duration_seconds` (**histogram**) gefunden. Du weißt: jede Metrik hat Namen, Wert und Typ.

!!! note "Kurz erklärt: HELP und TYPE"
    Jede Metrik bringt im `/metrics`-Text zwei Kommentarzeilen mit: `# HELP` beschreibt sie in Worten, `# TYPE` nennt den Typ. Ein **Histogram** erkennst du daran, dass es gleich **mehrere** Zeilen erzeugt – mit `_bucket`, `_sum` und `_count`. Du musst dir das nicht merken; wichtig ist nur die Erkenntnis: Die Zahlen, die gleich in Prometheus und Grafana landen, kommen genau aus diesem Text.

---

## Übung 2 – Die erste PromQL-Abfrage

!!! info "Was du lernst"
    Wie du in Prometheus einen Wert abfragst und seinen Verlauf siehst.

#### Aufgabe

Frage in Prometheus den Sauerstoffwert ab und schau dir den Graphen an.

??? tip "Schritt für Schritt"
    **Schritt 1:** Öffne <http://localhost:9090>.

    **Schritt 2:** Tippe ins Abfragefeld:

    ```promql
    aurora_oxygen_percent
    ```

    und klick **Execute**. Unter **Table** erscheint der aktuelle Wert.

    **Schritt 3:** Klick auf den Reiter **Graph**. Jetzt siehst du den **Verlauf**. Warte ein paar Sekunden, die Linie wächst nach rechts.

    **Schritt 4:** Probiere eine Abfrage mit **Label**:

    ```promql
    aurora_modules_total{status="online"}
    ```

??? success "Erwartung"
    Du hast einen aktuellen Wert (Table) und einen Verlauf (Graph) gesehen und einmal nach einem Label gefiltert.

!!! note "Kurz erklärt: Table oder Graph?"
    **Table** zeigt den **aktuellen** Wert – eine Momentaufnahme. **Graph** zeigt den **Verlauf** über die Zeit. Mit dem Filter `{status="online"}` schränkst du auf die Zeitreihen mit genau diesem Label ein – so pickst du dir aus vielen Werten gezielt den heraus, der dich interessiert.

---

## Übung 3 – Counter verstehen: aus „immer mehr" wird „pro Sekunde"

!!! info "Was du lernst"
    Warum man einen Counter mit `rate()` ansieht, statt direkt.

#### Aufgabe

Erzeuge ein bisschen Last und beobachte die Anfrage-Rate.

??? tip "Schritt für Schritt"
    **Schritt 1:** Frag den Counter direkt ab:

    ```promql
    aurora_http_requests_total
    ```

    Im **Graph** steigen die Linien nur – typisch für einen Counter.

    **Schritt 2:** Erzeuge ein paar Anfragen, indem du diese Adresse **drei- bis viermal im Browser** öffnest (oder mit F5 neu lädst):

    <http://localhost:8090/api/load?ms=800>

    (Im Terminal alternativ – unter Windows `curl.exe "http://localhost:8090/api/load?ms=800"`, unter macOS/Linux `curl "…"`.)

    **Schritt 3:** Frag jetzt die **Rate** ab:

    ```promql
    rate(aurora_http_requests_total[1m])
    ```

    Im **Graph** siehst du **Anfragen pro Sekunde** – nach deinen Aufrufen geht die Linie hoch und danach wieder runter.

??? success "Erwartung"
    Du hast den Unterschied gesehen. Merksatz: **Counter immer mit `rate()` ansehen.**

!!! note "Kurz erklärt: was `rate()` wirklich tut"
    Ein Counter zählt seit dem Start immer weiter nach oben (und beginnt nach einem Neustart wieder bei 0). Die nackte Zahl sagt deshalb wenig. `rate(...[1m])` rechnet aus, **wie schnell** der Zähler im letzten Zeitfenster gestiegen ist – also „pro Sekunde". Das `[1m]` ist dieses Fenster: ein größeres glättet stärker, ein kleineres reagiert schneller.

---

## Übung 4 – Das erste Grafana-Panel

!!! info "Was du lernst"
    Die Grundbewegung in Grafana, die du in der Gruppenaufgabe immer wieder brauchst.

#### Aufgabe

Baue ein Gauge-Panel für den Sauerstoff.

??? tip "Schritt für Schritt"
    **Schritt 1:** Öffne <http://localhost:3001>, logge dich ein (`admin` / `admin`). Beim ersten Mal fragt Grafana nach einem neuen Passwort – für die Übung darfst du `admin` behalten oder „Skip" klicken.

    **Schritt 2:** Im **linken Menü** (das Kachel-Symbol) auf **Dashboards → New → New dashboard**, dann den großen Knopf **+ Add visualization**.

    **Schritt 3:** Es erscheint die Auswahl der Datenquelle – nimm **Prometheus** (die ist schon eingerichtet). Danach öffnet sich der **Panel-Editor**: links/unten das Abfragefeld, rechts die Optionen, oben die Vorschau.

    **Schritt 4:** Ins Abfragefeld:

    ```promql
    aurora_oxygen_percent
    ```

    **Schritt 5:** Oben rechts den Visualisierungstyp von „Time series" auf **Gauge** umstellen.

    **Schritt 6:** In der **rechten Spalte** des Editors: unter **Standard options** `Min` = `0` und `Max` = `100` setzen; unter **Thresholds** den vorgegebenen Wert auf `90` ändern und die Farbe auf Rot stellen.

    **Schritt 7:** Oben rechts **Apply**.

??? success "Erwartung"
    Ein Gauge zeigt den aktuellen Sauerstoffwert – grün über 90. Genau diese Grundbewegung (Datenquelle → Abfrage → Visualisierung → Optionen) wiederholst du gleich in der Gruppe.

!!! note "Kurz erklärt: die vier Bausteine eines Panels"
    Jedes Panel besteht aus denselben vier Teilen: einer **Datenquelle** (woher die Zahlen kommen – hier Prometheus), einer **Abfrage** (welche Zahl – die PromQL), einem **Visualisierungstyp** (wie es aussieht – Gauge, Time series, Stat) und ein paar **Optionen**. Der **Threshold** ist nur so eine Option: eine Farb-Regel, die das Gauge unter 90 rot färbt. Mehr steckt hinter dem „Alarm" auf dem Dashboard erst einmal nicht.

---

## Geschafft

Du kannst jetzt Metriken lesen, in Prometheus abfragen und ein Panel bauen. Damit bist du bereit für die [Gruppenaufgabe](06-gruppenaufgabe.md).
