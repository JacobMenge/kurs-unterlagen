---
title: "Übungen"
description: "Alle Praxisübungen der Kursunterlagen auf einen Blick – von Netzwerk-Diagnose über Docker und Kubernetes bis zu IT-Sicherheit und Testkonzepten, gruppiert nach Themenblock."
hide:
  - navigation
---

# Alle Übungen auf einen Blick

Diese Seite ist die Abkürzung in die Praxis: **jede Übung der Kursunterlagen, gruppiert nach Themenblock.** Die Theorie dazu ist in jeder Übung verlinkt – du kannst also direkt hier starten und bei Bedarf zurückblättern.

!!! tip "So sind die Übungen gebaut"
    Jede Übung nennt Zeitrahmen, Material und Ablauf, dazu **Hilfekarten** für den Fall, dass es klemmt – und **Lösungen zum Aufklappen**, die erst nach dem eigenen Versuch gedacht sind.

## Netzwerke

- **[Der Schichten-Check](netzwerke/praxis-schichten-check.md)** – mit echten Befehlen durch die Schichten des eigenen Rechners.
- **[Subnetz-Architekten](netzwerke/praxis-subnetting.md)** – aus einem /24 die Abteilungsnetze schneiden, nur mit Stift und Rezept.
- **[github.com – die Spurensuche](netzwerke/praxis-github-spurensuche.md)** – was zwischen Eintippen und Webseite wirklich passiert.
- **[Netzwerk-Werkstatt](netzwerke/praxis-netzwerk-werkstatt.md)** – gemischte Aufgaben zum Vertiefen und Nachrechnen.
- **[Netzwerk-Notruf](netzwerke/praxis-netzwerk-notruf.md)** – fünf Störungen, fünf Diagnosen: mit der Schicht-Checkliste zur Ursache.

## Virtualisierung

- **[Multipass: die erste eigene VM](virtualisierung/praxis-multipass.md)** – VM starten, hineinschauen, wieder aufräumen.
- **[Netz-Detektiv & Snapshot](virtualisierung/praxis-vm-experimente.md)** – das VM-Netz mit Netzwerk-Wissen entschlüsseln, dann kaputt machen und per Snapshot zurückspringen.
- **[Übungen zur Virtualisierung](virtualisierung/uebungen.md)** – Grundbegriffe, Hypervisor-Typen und Snapshots festigen.

## Docker & Compose

- **[Erste Schritte mit Docker](docker/erste-schritte.md)** – Container starten, stoppen, verstehen.
- **[Ein eigenes Image bauen](docker/praxis-eigenes-image.md)** – vom Dockerfile zum lauffähigen Container.
- **[Übungen: Docker-Einführung](docker/uebungen.md)** – Images, Container und Registry im Griff.
- **[Multi-Container-Praxis](docker-aufbau/praxis-multi-container.md)** – Volumes, Netze und Umgebungsvariablen zusammen einsetzen.
- **[Übungen: Docker-Aufbau](docker-aufbau/uebungen.md)** – Vertiefung zu Volumes, Netzen und Env.
- **[Docker-Vertiefung](docker-vertiefung/index.md)** – Debugging, Backups, Healthchecks, Restart-Policies, Image-Größen.
- **[Praxis-Event: Escape Room](docker-escape-room/index.md)** – Docker-Wissen unter Zeitdruck, im Team.
- **[Eine Webapp mit Compose](docker-compose/praxis-webapp.md)** – mehrere Container als ein Stack.
- **[Übungen: Docker Compose](docker-compose/uebungen.md)** – Compose-Dateien lesen, schreiben, reparieren.
- **[Praxis-Event: Mission Control](docker-compose-mission-control/index.md)** – ein kompletter Stack als Gruppenmission.
- **[Übungen: Docker für Profis](docker-profi/uebungen.md)** – Best Practices und Image-Optimierung.

## Infrastruktur & Architektur

- **[Übungsübersicht Infrastruktur](infrastruktur-planung/uebungen.md)** – der Einstieg in alle Planungsübungen.
- **[Anforderungen & Sollkonzept](infrastruktur-planung/uebungen-anforderungen.md)**, **[Architekturen](infrastruktur-planung/uebungen-architekturen.md)**, **[Ressourcen](infrastruktur-planung/uebungen-ressourcen.md)**, **[Speicherlösungen](infrastruktur-planung/uebungen-speicherloesungen.md)**, **[Lizenzmodelle](infrastruktur-planung/uebungen-lizenzmodelle.md)** – je Kapitel ein eigener Übungssatz.

## Betrieb & Monitoring

- **[Übungen: Verfügbarkeit rechnen](betrieb/uebungen-verfuegbarkeit.md)** – Ausfallzeiten, SPOF und Neunen im Griff.
- **[Notfallübung](betrieb/uebung-notfalluebung.md)** – Wiederanlauf und Notbetrieb durchspielen.
- **[Praxis: Monitoring](monitoring-praxis/index.md)** – Prometheus und Grafana im Container, bis zum echten Alert.

## Git & CI/CD

- **[Git: erste Schritte](git/praxis-erste-schritte.md)** – vom ersten Commit bis zur Historie.
- **[Branches & Merges](git/praxis-branches.md)**, **[Merge-Konflikt lösen](git/praxis-merge-konflikt.md)**, **[Von lokal zu GitHub](git/praxis-lokal-zu-github.md)**, **[Pull Requests](git/praxis-pull-request.md)**, **[Team-Workflow](git/praxis-team-workflow.md)** – der komplette Git-Praxispfad.
- **[Gruppen-Übung Git](git/gruppen-uebung.md)** und **[Übungen: Git](git/uebungen.md)** – gemeinsam und allein festigen.
- **[Die erste eigene Pipeline](ci-cd/praxis-erste-pipeline.md)** – GitHub Actions von Null.
- **[Übungen: CI/CD](ci-cd/uebungen.md)** – Pipelines lesen, erweitern, reparieren.

## Deployment & Kubernetes

- **[Rollout-Übung](orchestrierung/uebung-rollout.md)** – Rolling, Blue-Green und Canary im Vergleich.
- **[Kubernetes: Einstieg](kubernetes-praxis/index.md)** – vom Hello World bis zum eigenen Service, inklusive Cloud-Labs.
- **[Kubernetes: Aufbau](kubernetes-aufbau/index.md)** – Config, Secrets, Probes und Limits mit Labs.
- **[Kubernetes: Helm](kubernetes-helm/index.md)** – Charts bauen, Releases verwalten, drei Umgebungen.

## IT-Sicherheit & Qualität

- **[Übungen: Risikoanalyse](it-sicherheit/uebungen-risikoanalyse.md)** – Risiken finden, bewerten, behandeln.
- **[Eine Sicherheitsrichtlinie schreiben](it-sicherheit/uebung-sicherheitsrichtlinie.md)** – mit Peer-Review.
- **[Vorfallbearbeitung](it-sicherheit/uebung-vorfallbearbeitung.md)** – ein Sicherheitsvorfall nach Playbook.
- **[Testkonzept erstellen](testen-qualitaet/uebung-testkonzept.md)** und **[Übergabe & Training](testen-qualitaet/uebung-uebergabe.md)** – Qualität planbar machen.
