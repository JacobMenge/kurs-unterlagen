---
title: "Monitoring mit Prometheus & Grafana"
description: "Monitoring von Grund auf: warum man Systeme überwacht, die Werkzeuge Prometheus und Grafana, Installation für Windows/macOS/Linux, erste Übungen und eine Gruppenaufgabe an einer kleinen Beispiel-Anwendung."
---

# Monitoring mit Prometheus & Grafana

In diesem Block lernst du **Monitoring** – also wie man einem laufenden System ansieht, ob es **gesund** ist und wie man **gewarnt** wird, bevor etwas kaputtgeht. Das ist Alltag im Betrieb: Webshops, Datenbanken, Server und Schnittstellen werden genau so überwacht.

Du brauchst kein Vorwissen. Wir gehen Schritt für Schritt vor: erst ein **kurzer Theorieteil**, dann die **Installation** der Werkzeuge, dann **erste Übungen** zum Prüfen, ob alles läuft – und am Ende eine **Gruppenaufgabe**.

!!! info "Womit wir üben"
    Damit wir etwas Greifbares zum Überwachen haben, gibt es eine **kleine Beispiel-Anwendung**. Sie liefert Messwerte wie ein echter Dienst (Anfragen, Antwortzeiten, Erreichbarkeit). Damit es anschaulich ist, ist sie als **Telemetrie einer kleinen Raumstation** gestaltet (Sauerstoff, Energielast). Das ist nur das **Beispiel-Thema** – die Technik dahinter ist exakt die, die man auf echten Servern und Anwendungen einsetzt.

---

## Was du in diesem Block lernst

- **warum** Monitoring im Betrieb unverzichtbar ist
- die Werkzeuge **Prometheus** (sammelt Messwerte) und **Grafana** (zeigt sie und alarmiert)
- was eine **Metrik** ist und welche Typen es gibt
- wie man Werte mit **PromQL** abfragt und ein **Dashboard** baut
- wie man einen **Alarm** einrichtet und auslöst

---

## So ist dieser Block aufgebaut

```mermaid
flowchart LR
  T["Theorie<br/>(kurz)"] --> I["Installation<br/>(Win/Mac/Linux)"]
  I --> E["Erste Übungen<br/>(läuft alles?)"]
  E --> G["Gruppenaufgabe"]
```

| Seite | Inhalt | Art |
|-------|--------|-----|
| [Warum Monitoring?](01-warum-monitoring.md) | Warum man überwacht, was es im Beruf bringt | Theorie |
| [Grundlagen](02-grundlagen.md) | Prometheus, Grafana, Metrik-Typen, PromQL | Theorie |
| [Installation](03-installation.md) | Docker einrichten – Schritt für Schritt für Windows, macOS und Linux | Einrichtung |
| [Beispiel-Anwendung starten](04-beispiel-anwendung.md) | Das Projekt holen und den Stack starten | Praxis |
| [Erste Übungen](05-erste-uebungen.md) | Prüfen, ob alles läuft; Metriken, PromQL und erstes Panel | Praxis |
| [Gruppenaufgabe](06-gruppenaufgabe.md) | Gemeinsam ein Dashboard bauen und einen Alarm auslösen | Praxis |
| [Hilfekarten](07-hilfekarten.md) | Abgestufte Hinweise, wenn etwas hakt | Referenz |
| [Lösung](08-loesung.md) | Vollständige Lösung – erst nach eurer Arbeit! | Referenz |
| [Rückblick & Ausblick](09-rueckblick.md) | Was ihr mitnehmt und wie es weitergeht | Referenz |

---

## Voraussetzungen

- Ein Rechner mit **Windows, macOS oder Linux**, auf dem du Programme installieren darfst.
- Internet, um die Werkzeuge zu laden.
- Alles Weitere – vor allem Docker – richtest du auf der Seite [Installation](03-installation.md) ein.

---

## Leitfrage

> **Mein System läuft – aber woher weiß ich, ob es gesund ist, wann es eng wird und wo es klemmt, bevor sich jemand beschwert?**

Wer das mit einem Blick aufs Dashboard beantworten kann, denkt wie jemand, der für einen stabilen Betrieb verantwortlich ist.
