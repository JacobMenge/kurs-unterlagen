---
title: "Docker für Profis"
description: "Dockerfile-Best-Practices, Multi-Stage-Builds, Image-Optimierung und Security-Scanning. Für Produktionsreife."
---

# Docker für Profis

Du kannst jetzt Container starten, Persistenz nutzen, Multi-Container-Stacks mit Compose beschreiben. Die nächste Frage ist: **Wie sorgst du dafür, dass deine eigenen Images professionell gebaut sind?**

Dieser Block adressiert zwei Themen, die in Produktion zählen:

1. **Dockerfile-Best-Practices** – damit dein Image schlank, schnell gebaut und sicher ist.
2. **Image-Optimierung und Security-Scanning** – damit du Angriffsflächen aktiv klein hältst.

!!! abstract "Was du nach diesem Block kannst"
    - ein Dockerfile mit **Multi-Stage-Build** schreiben, das Build-Tools und Runtime trennt
    - einen Container **als unprivilegierten User** betreiben
    - **Layer-Caching** aktiv für Build-Zeit-Optimierung nutzen
    - Basis-Images (Debian/Slim/Alpine/Distroless) bewusst auswählen
    - ein Image mit **Trivy** auf Sicherheitslücken scannen

---

## Umfang und Ablauf

!!! note "Aufwand"
    Plane für den kompletten Block **rund 3 Stunden** ein – etwa zur Hälfte Theorie, zur Hälfte Praxis am eigenen Dockerfile. Wer allein lernt, bearbeitet die Seiten im eigenen Tempo.

1. **[Dockerfile-Best-Practices](dockerfile-best-practices.md)** – Theorie: Layer-Caching, Multi-Stage, `USER`, `HEALTHCHECK`, `CMD` vs. `ENTRYPOINT`; danach Praxis: ein bestehendes Dockerfile auf Multi-Stage + `USER` + saubere Cache-Reihenfolge umbauen
2. **[Image-Optimierung](image-optimierung.md)** – Theorie: Basis-Images im Vergleich, Scanning, SBOMs; danach Praxis: ein Image von rund 1 GB auf unter 200 MB bringen und mit Trivy scannen

---

## Seiten in diesem Block

| Seite | Inhalt |
|-------|--------|
| [Dockerfile-Best-Practices](dockerfile-best-practices.md) | Multi-Stage, USER, HEALTHCHECK, Layer-Caching, CMD vs. ENTRYPOINT, Signal-Handling, Labels |
| [Image-Optimierung](image-optimierung.md) | Basis-Image-Vergleich, Größen-Analyse mit `docker history` und `dive`, Trivy, SBOMs |
| [Übungen](uebungen.md) | 🟢🟡🔴🏆 Vier Schwierigkeitsgrade zum Selbermachen |
| [Stolpersteine](stolpersteine.md) | Typische Probleme beim Profi-Bauen |
| [Merksätze](merksaetze.md) | Kompakte Zusammenfassung |

---

## Voraussetzungen

- [Docker-Einführung](../docker/index.md) solide verstanden (eigenes Image bauen, `docker run`).
- [Docker-Aufbau](../docker-aufbau/index.md) und [Compose](../docker-compose/index.md) idealerweise durchgearbeitet.
- Docker installiert und aktuell.
- Optional: `trivy` und `dive` vorab installiert – die Installation ist auf der Seite [Image-Optimierung](image-optimierung.md) aber auch Schritt für Schritt beschrieben.

---

## Leitfrage

> **Wie machst du aus einem „funktioniert bei mir"-Image eines, das auch in Produktion kein Bauchweh verursacht?**

Dieser Block gibt dir die Werkzeuge dafür.
