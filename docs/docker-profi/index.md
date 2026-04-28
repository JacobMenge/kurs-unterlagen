---
title: "Docker für Profis (Block 5)"
description: "Dockerfile-Best-Practices, Multi-Stage-Builds, Image-Optimierung und Security-Scanning. Für Produktionsreife."
---

# Docker für Profis (Block 5)

Du kannst jetzt Container starten, Persistenz nutzen, Multi-Container-Stacks mit Compose beschreiben. Die nächste Frage ist: **Wie sorgst du dafür, dass deine eigenen Images professionell gebaut sind?**

Dieser Block adressiert zwei Themen, die in Produktion zählen:

1. **Dockerfile-Best-Practices** – damit dein Image schlank, schnell gebaut und sicher ist.
2. **Image-Optimierung und Security-Scanning** – damit du Angriffsflächen aktiv klein hältst.

!!! abstract "Was du nach diesen 3 Stunden kannst"
    - ein Dockerfile mit **Multi-Stage-Build** schreiben, das Build-Tools und Runtime trennt
    - einen Container **als unprivilegierten User** betreiben
    - **Layer-Caching** aktiv für Build-Zeit-Optimierung nutzen
    - Basis-Images (Debian/Slim/Alpine/Distroless) bewusst auswählen
    - ein Image mit **Trivy** auf Sicherheitslücken scannen

---

## Zeitplan – 3 Stunden

!!! note "Für Präsenzkurs und Selbstlerner"
    Der Zeitplan ist für den **3-Stunden-Präsenzkurs** gedacht. Selbstlerner bearbeiten die Seiten in ihrem Tempo.

| Zeit | Was passiert | Seite |
|------|--------------|-------|
| **0:00 – 0:15** | Begrüßung, kurzer Rückblick Block 3/4 | — |
| **0:15 – 0:40** | Theorie: Layer-Caching, Multi-Stage, `USER`, `HEALTHCHECK`, `CMD` vs. `ENTRYPOINT` | [Best-Practices](dockerfile-best-practices.md) |
| **0:40 – 1:30** | Praxis 1: Bestehendes Dockerfile refactoren → Multi-Stage + USER + Cache-Order | [Best-Practices](dockerfile-best-practices.md) |
| **1:30 – 1:40** | Pause | — |
| **1:40 – 2:05** | Theorie: Basis-Images im Vergleich, Scanning, SBOMs | [Optimierung](image-optimierung.md) |
| **2:05 – 2:50** | Praxis 2: Image von 1 GB auf < 200 MB bringen + Trivy-Scan | [Optimierung](image-optimierung.md) |
| **2:50 – 3:00** | Abschluss-Diskussion, Ausblick (CI/CD, Orchestrierung) | — |

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
- Optional: `trivy` und `dive` vorab installiert (sonst im Kurs gemeinsam).

---

## Leitfrage

> **Wie machst du aus einem „funktioniert bei mir"-Image eines, das auch in Produktion kein Bauchweh verursacht?**

Dieser Block gibt dir die Werkzeuge dafür.
