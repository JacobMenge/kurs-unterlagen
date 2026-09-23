---
title: "Docker-Vertiefung"
description: "Fünf zusätzliche Docker-Übungen zwischen Aufbau-Block und Escape Room, jede in 15 bis 25 Minuten machbar, alle ohne Compose."
---

# Docker-Vertiefung

Diese fünf Übungen vertiefen das, was du in der Docker-Einführung und im Aufbau-Block gelernt hast. Sie sind eine gute Vorbereitung auf den [Docker Escape Room](../docker-escape-room/index.md). Jede Übung ist **eigenständig**, du kannst sie in beliebiger Reihenfolge bearbeiten.

!!! info "Wann ist dieser Block sinnvoll?"
    - **Als Zugabe**, wenn du mit den Übungen im Aufbau-Block schnell fertig bist und mehr machen willst.
    - **Als Vorbereitung** auf den Escape Room und auf Docker Compose.
    - **Zum Nachschlagen**, um die einzelnen Themen in eigenem Tempo zu wiederholen.

!!! warning "Kein Docker Compose"
    Alle fünf Übungen funktionieren mit **reinen `docker`-Befehlen**. Compose kommt erst im Compose-Block. Dort wirst du sehen, wie viele dieser Patterns Compose dir abnimmt.

---

## Die fünf Übungen

<div class="grid cards" markdown>

-   :material-bug-outline:{ .lg .middle } __[1: `docker exec` als Debug-Werkzeug](01-exec-debugging.md)__

    ---

    Im laufenden Container arbeiten: ENV prüfen, Konfig lesen, Mini-Reparaturen vornehmen, Mini-Tests fahren.

    *15–20 Min · Schwierigkeit: 🟢 Einsteiger*

-   :material-content-save-outline:{ .lg .middle } __[2: Volume-Backup und Restore](02-volumes-backup.md)__

    ---

    Daten aus einem Postgres-Volume sichern und nach einem simulierten „Disaster" wieder zurückspielen.

    *20 Min · Schwierigkeit: 🟡 Mittel*

-   :material-heart-pulse:{ .lg .middle } __[3: HEALTHCHECK im Dockerfile](03-healthchecks.md)__

    ---

    Beibringen, dass `docker ps` ehrlich sagt, ob ein Container nicht nur läuft, sondern auch **bereit** ist.

    *20 Min · Schwierigkeit: 🟡 Mittel*

-   :material-restart:{ .lg .middle } __[4: Restart-Policies und Crash-Recovery](04-restart-policies.md)__

    ---

    Was passiert mit deinem Container, wenn er crasht? `--restart` macht den Unterschied zwischen Ausfall und Selbstheilung.

    *15–20 Min · Schwierigkeit: 🟢 Einsteiger*

-   :material-scale-balance:{ .lg .middle } __[5: Image-Größen vergleichen](05-image-groessen.md)__

    ---

    Dieselbe Mini-App in `node:22`, `node:22-slim` und `node:22-alpine` bauen und sehen, wie stark die Image-Größe davon abhängt.

    *25 Min · Schwierigkeit: 🟡 Mittel*

</div>

---

## Voraussetzungen

- Docker läuft (`docker version` klappt). Siehe [Docker installieren](../docker/installation.md).
- Du hast die Blöcke [Docker-Einführung](../docker/index.md) und [Docker-Aufbau](../docker-aufbau/index.md) bereits durchgearbeitet. Für Übung 3 und 5 brauchst du außerdem die [Dockerfile-Grundlagen](../docker/dockerfile-grundlagen.md).
- Ein Terminal (macOS Terminal/iTerm, Windows PowerShell, Linux Shell deiner Wahl). Wo sich die Befehle je Betriebssystem unterscheiden, stehen sie in Tabs. Unter Windows nimmst du den Tab „Windows PowerShell".

---

## Was du nach diesen fünf Übungen kannst

- **In** laufenden Containern arbeiten, nicht nur **mit** ihnen.
- **Daten** in Volumes mit einem reproduzierbaren Pattern sichern und wiederherstellen.
- **Healthchecks** schreiben, die echte Bereitschaft prüfen, nicht nur „läuft der Prozess".
- Container **automatisch wieder hochfahren** lassen, wenn sie crashen, mit der richtigen Policy.
- Den **Effekt der Basis-Image-Wahl** auf Größe, Sicherheit und Build-Zeit greifbar machen.

Das sind alles Patterns, die du im Compose-Block **wiedersehen** wirst, dort dann deklarativ in `compose.yaml` formuliert. Die zugrunde liegenden Konzepte beherrschst du dann schon.

---

## Was kommt danach

- [Docker Escape Room](../docker-escape-room/index.md): alles bisher Gelernte im Team anwenden
- [Docker Compose: Einführung](../docker-compose/einfuehrung.md): Container-Stacks deklarativ beschreiben
- [Docker für Profis](../docker-profi/index.md): Best Practices, Multi-Stage, Image-Optimierung, Vulnerability-Scanning
