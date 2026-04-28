---
title: "Start"
description: "Kursunterlagen zu Virtualisierung und Docker – frei verfügbares Lernmaterial von Jacob Menge."
hide:
  - navigation
---

# Kursunterlagen – Virtualisierung & Docker

Willkommen. Hier findest du die Nachlese zu meinem Kurs rund um **Virtualisierung** und **Docker**.
Jede Zeile Code, jede Erklärung und jede Analogie aus dem Unterricht kannst du hier in Ruhe nachlesen – egal, ob du während des Kurses etwas überhören hast, ob du zu Hause mitmachen willst, oder ob du später darauf zurückkommen möchtest.

!!! abstract "Was diese Seite ist – und was nicht"
    **Ist:** ein Nachschlagewerk. Jeder Befehl, den du im Unterricht siehst, steht hier mit Erklärung. Du kannst Schritt für Schritt mitlesen und alles zu Hause wiederholen.
    **Ist nicht:** ein Ersatz für den Kurs. Die Analogien, Diskussionen und Fragerunden leben vom Präsenzunterricht. Die Unterlagen sind der rote Faden dazu.

---

## Themenübersicht

<div class="grid cards" markdown>

-   :material-server-network:{ .lg .middle } __[Virtualisierung](virtualisierung/index.md)__

    ---

    Warum kapseln wir Systeme überhaupt? Was ist ein Hypervisor? Welche Werkzeuge gibt es? Und wie startest du deine erste Ubuntu-VM mit **Multipass**?

    [:octicons-arrow-right-24: Block 1 starten](virtualisierung/index.md)

-   :material-docker:{ .lg .middle } __[Docker – Einführung](docker/index.md)__

    ---

    Warum Container? Wie unterscheiden sie sich von VMs? Was ist ein Image, was ein Container? Und wie baust du deinen ersten eigenen Container?

    [:octicons-arrow-right-24: Block 2 starten](docker/index.md)

-   :material-layers-outline:{ .lg .middle } __[Docker – Aufbau](docker-aufbau/index.md)__

    ---

    Die drei Säulen realer Container-Anwendungen: **Volumes, Umgebungsvariablen, Netzwerke**. Abschluss mit Hands-on Postgres + Adminer.

    [:octicons-arrow-right-24: Block 3 starten](docker-aufbau/index.md)

-   :material-puzzle-outline:{ .lg .middle } __[Docker Escape Room](docker-escape-room/index.md)__

    ---

    **Praxis-Wiederholung in der Gruppe:** Multi-Container-Setup manuell aufbauen, **bevor** Compose kommt. Eine 90-Minuten-Challenge mit 10 Aufgaben + Bonus.

    [:octicons-arrow-right-24: Praxis-Block starten](docker-escape-room/index.md)

-   :material-file-code-outline:{ .lg .middle } __[Docker Compose](docker-compose/index.md)__

    ---

    Multi-Container-Stacks deklarativ: `compose.yaml`, Services, Volumes, Netzwerke, Healthchecks. Praxis mit Flask + Postgres + Adminer.

    [:octicons-arrow-right-24: Block 4 starten](docker-compose/index.md)

-   :material-rocket-launch-outline:{ .lg .middle } __[Docker für Profis](docker-profi/index.md)__

    ---

    Dockerfile-Best-Practices: Multi-Stage, USER, HEALTHCHECK. Image-Optimierung mit Alpine, Distroless, Trivy-Scanning.

    [:octicons-arrow-right-24: Block 5 starten](docker-profi/index.md)

-   :material-view-dashboard-outline:{ .lg .middle } __[Cheatsheets](cheatsheets/index.md)__

    ---

    Spickzettel mit den wichtigsten **Multipass-** und **Docker-Befehlen** in einer Tabelle – zum schnellen Nachschlagen während des Arbeitens.

    [:octicons-arrow-right-24: Zu den Spickzetteln](cheatsheets/index.md)

-   :material-book-open-variant:{ .lg .middle } __[Glossar](glossar.md)__

    ---

    Alle Begriffe, die im Kurs vorkommen, kompakt erklärt. Abkürzungen wie `VM`, `CLI` oder `SSH` werden auf jeder Seite automatisch mit dem Glossar verlinkt.

    [:octicons-arrow-right-24: Zum Glossar](glossar.md)

</div>

---

## Wie du diese Seite am besten nutzt

=== "Vor dem Kurs"
    Schau dir die beiden Überblicksseiten an:

    - [Virtualisierung – Überblick](virtualisierung/index.md)
    - [Docker – Überblick](docker/index.md)

    Du musst nichts vorbereiten. Ein grobes Bauchgefühl reicht – der Kurs holt dich ab.

=== "Während des Kurses"
    Habe die Seite offen. Wenn im Präsenzteil ein Befehl gezeigt wird und du kurz aussteigst, findest du genau diesen Befehl hier mit Erklärung wieder.

    Nutze die **Suche oben rechts** – sie durchsucht alle Seiten inkl. Befehle.

=== "Nach dem Kurs"
    Arbeite die Abschnitte in Ruhe nach. Die Reihenfolge ist didaktisch aufgebaut:

    1. **Warum** (Motivation)
    2. **Grundbegriffe** (Vokabular)
    3. **Werkzeuge** (Landschaft)
    4. **Praxis** (Hands-on)
    5. **Stolpersteine** (Debugging)
    6. **Merksätze** (Zusammenfassung)

=== "Wenn du steckst"
    Jeder Themenblock hat eine eigene **Stolpersteine-Seite** mit typischen Problemen und ihrer Lösung:

    - [Stolpersteine Virtualisierung](virtualisierung/stolpersteine.md)
    - [Stolpersteine Docker](docker/stolpersteine.md)

    Für die **Installation** gibt es eigene Seiten mit Schritt-für-Schritt-Anleitung für Windows 11, macOS und Linux inklusive Troubleshooting:

    - [Multipass – Einstieg & Installation](virtualisierung/multipass-einstieg.md)
    - [Docker installieren](docker/installation.md)

---

## Technischer Hinweis

Diese Seite ist mit [MkDocs](https://www.mkdocs.org/) und [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/) gebaut. Sie ist statisch, schnell und läuft auch im Flugzeug, wenn du sie einmal offline gespeichert hast. Der Quellcode liegt öffentlich auf [GitHub](https://github.com/JacobMenge/kurs-unterlagen).

Mehr über mich und andere Projekte findest du auf [jacob-decoded.de](https://jacob-decoded.de).

!!! note "Kurstage und Arbeitsstand"
    Jeder Block ist auf einen **3-Stunden-Kurstag** ausgelegt – mit Theorie­anteil, Praxis und Besprechung:

    - **Block 1** – Virtualisierung (Multipass)
    - **Block 2** – Docker-Einführung (erste Container, eigenes Image)
    - **Block 3** – Docker-Aufbau (Volumes, ENV, Netzwerke)
    - **Praxis-Block** – Docker Escape Room (Gruppen-Übung vor Compose)
    - **Block 4** – Docker Compose (nächste Einheit)
    - **Block 5** – Docker für Profis (Best Practices, Optimierung)

    Weitere Einheiten (Kubernetes, CI/CD, Monitoring) kommen später dazu.
