---
title: "Rückblick & Ausblick"
description: "Was ihr in diesem Block gelernt habt und wie es im Betrieb weitergeht."
---

# Rückblick & Ausblick

## Was ihr gelernt habt

Aus einem laufenden System ist ein **beobachtetes** System geworden. Ihr habt:

- die Werkzeuge **Prometheus** und **Grafana** eingerichtet,
- **Metriken gelesen** und die drei Typen unterschieden (Gauge, Counter, Histogram),
- in Prometheus mit **PromQL** abgefragt (`rate()`, Labels, `up`),
- in Grafana ein **Dashboard** gebaut,
- einen **Alarm** eingerichtet und einen Störfall ausgelöst und beobachtet.

Das ist genau das Muster aus echten Betrieben – nur dass dort statt einer Beispiel-App Server, Datenbanken und Anwendungen überwacht werden. Die Werkzeuge und Handgriffe sind dieselben.

---

## Die drei wichtigsten Merksätze

!!! quote "Mitnehmen"
    1. **„Läuft" ist nicht „gesund".** Ein Dienst kann laufen und trotzdem überlastet oder kurz vor dem Absturz sein. Erst Metriken zeigen das.
    2. **Prometheus holt, Grafana zeigt.** Der Sammler fragt aktiv ab und speichert, das Cockpit fragt den Sammler und visualisiert.
    3. **Ein guter Alarm ist selten.** Er warnt bei dem **einen** Zustand, auf den jemand reagieren muss. Zu viele Alarme sind so schädlich wie keine.

---

## Wie es weitergeht

Dieser Block ist die praktische Tür zum großen Thema **[Betrieb & Verfügbarkeit](../betrieb/index.md)**. Dort vertieft ihr:

- **[Monitoring & Betrieb](../betrieb/monitoring.md)** – Schwellwerte, Alarmierungsstrategien, systematisches Troubleshooting
- **[Betriebsdaten analysieren](../betrieb/betriebsdaten-analysieren.md)** – aus Messreihen Soll-Kennzahlen und Abweichungen ableiten
- **[Incident Response & BCM](../betrieb/incident-und-bcm.md)** – was passiert, wenn der Alarm wirklich feuert

Wer tiefer einsteigen will: Metriken sind nur eine der drei Säulen von Observability. Die anderen beiden sind **Logs** (zentral gesammelt) und **Traces** (der Weg einer Anfrage durch mehrere Dienste). Auf der Lernplattform findet ihr weiterführende Kurse zu Prometheus und Grafana.

---

## Leitfrage – nochmal

> **Mein System läuft – aber woher weiß ich, ob es gesund ist, wann es eng wird und wo es klemmt, bevor sich jemand beschwert?**

Die Antwort habt ihr gebaut: ein Dashboard, das die wichtigen Werte zeigt und ein Alarm, der euch ruft, bevor es jemand anderes tut.
