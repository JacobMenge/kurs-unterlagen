---
title: "Docker-Vertiefung"
description: "Fünf zusätzliche Docker-Übungen zwischen Escape Room und Compose – jede in 15–25 Minuten machbar, alle ohne Compose."
---

# Docker-Vertiefung

Diese fünf Übungen vertiefen das, was du in den Blöcken 2 und 3 gelernt und im **Docker Escape Room** geübt hast. Jede Übung ist **eigenständig** – du kannst sie in beliebiger Reihenfolge bearbeiten.

!!! info "Wann ist dieser Block sinnvoll?"
    - **Während des Kurses**, wenn du im Escape Room schnell fertig wirst und mehr machen willst.
    - **Zwischen den Kurstagen**, als Vorbereitung auf Docker Compose.
    - **Nach dem Kurs**, um die einzelnen Themen in eigenem Tempo nachzuschlagen.

!!! warning "Kein Docker Compose"
    Alle fünf Übungen funktionieren mit **reinen `docker`-Befehlen**. Compose kommt erst in der nächsten Einheit – und du wirst dort sehen, wie viele dieser Patterns Compose dir abnimmt.

---

## Die fünf Übungen

<div class="grid cards" markdown>

-   :material-bug-outline:{ .lg .middle } __[1 — `docker exec` als Debug-Werkzeug](01-exec-debugging.md)__

    ---

    Im laufenden Container arbeiten: ENV prüfen, Konfig lesen, Mini-Reparaturen vornehmen, Mini-Tests fahren.

    *15–20 Min · Schwierigkeit: 🟢 Einsteiger*

-   :material-content-save-outline:{ .lg .middle } __[2 — Volume-Backup und Restore](02-volumes-backup.md)__

    ---

    Daten aus einem Postgres-Volume sichern und nach einem simulierten „Disaster" wieder zurückspielen.

    *20 Min · Schwierigkeit: 🟡 Mittel*

-   :material-heart-pulse:{ .lg .middle } __[3 — HEALTHCHECK im Dockerfile](03-healthchecks.md)__

    ---

    Beibringen, dass `docker ps` ehrlich sagt, ob ein Container nicht nur läuft, sondern auch **bereit** ist.

    *20 Min · Schwierigkeit: 🟡 Mittel*

-   :material-restart:{ .lg .middle } __[4 — Restart-Policies und Crash-Recovery](04-restart-policies.md)__

    ---

    Was passiert mit deinem Container, wenn er crasht? `--restart` macht den Unterschied zwischen Ausfall und Selbstheilung.

    *15–20 Min · Schwierigkeit: 🟢 Einsteiger*

-   :material-scale-balance:{ .lg .middle } __[5 — Image-Größen vergleichen](05-image-groessen.md)__

    ---

    Dieselbe Mini-App in `node:22`, `node:22-slim` und `node:22-alpine` bauen und sehen, wie stark die Image-Größe davon abhängt.

    *25 Min · Schwierigkeit: 🟡 Mittel*

</div>

---

## Voraussetzungen

- Docker läuft (`docker version` klappt). Siehe [Docker installieren](../docker/installation.md).
- Du hast die Blöcke [Docker-Einführung](../docker/index.md) und [Docker-Aufbau](../docker-aufbau/index.md) bereits durchgearbeitet.
- Ein Terminal (macOS Terminal/iTerm, Windows PowerShell, Linux Shell deiner Wahl).

---

## Was du nach diesen fünf Übungen kannst

- **In** laufenden Containern arbeiten, nicht nur **mit** ihnen.
- **Daten** in Volumes mit einem reproduzierbaren Pattern sichern und wiederherstellen.
- **Healthchecks** schreiben, die echte Bereitschaft prüfen, nicht nur „läuft der Prozess".
- Container **automatisch wieder hochfahren** lassen, wenn sie crashen – mit der richtigen Policy.
- Den **Effekt der Basis-Image-Wahl** auf Größe, Sicherheit und Build-Zeit greifbar machen.

Das sind alles Patterns, die du im Compose-Block **wiedersehen** wirst – dort dann deklarativ in `compose.yaml` formuliert. Aber die zugrunde liegenden Konzepte beherrscht du dann schon.

---

## Was kommt danach

- [Docker Compose – Einführung](../docker-compose/einfuehrung.md) – nächste Einheit
- [Docker für Profis](../docker-profi/index.md) – Best Practices, Multi-Stage, Image-Optimierung, Vulnerability-Scanning
