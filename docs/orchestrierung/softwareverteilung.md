---
title: "Softwareverteilung & Deployment"
description: "Wie Software geplant und automatisiert auf viele Zielsysteme kommt: der Verteilungsprozess, Auswahlkriterien für Verteilungs- und Inventarisierungswerkzeuge sowie Deployment-Strategien wie Imaging und Installationsprogramme."
---

# Softwareverteilung & Deployment

<span class='badge badge-vertiefung'>Vertiefung</span> &nbsp; Software auf einem Rechner zu installieren kann jeder – die Kunst ist, sie **zuverlässig und automatisch** auf hunderte Geräte zu bringen.

!!! note "Status: Platzhalter <span class='badge badge-wip'>in Arbeit</span>"
    Diese Seite ist ein Platzhalter. Der Inhalt folgt – hier siehst du schon, **was behandelt wird** und **worauf es ankommt**.

## Das wird hier behandelt

- der **Softwareverteilungsprozess** als Kreislauf: **Analyse** des Bedarfs, **Planung** des Rollouts, **Einführung** auf die Zielsysteme und laufende **Pflege** (Updates, Patches, Rückbau)
- **Produkte zur automatischen Softwareverteilung und Inventarisierung** – Werkzeuge, die wissen, *was* wo installiert ist und Software *gesteuert* ausrollen
- **Auswahlkriterien** für solche Werkzeuge: unterstütztes **Betriebssystem**, **Sicherheit** (z. B. verschlüsselte Übertragung, Rechte), **Skalierbarkeit** (von zehn auf zehntausend Geräte), **Rückholbarkeit** (ein fehlerhaftes Paket wieder zurücknehmen) und **Verfügbarkeit** des Verteildienstes selbst
- **Deployment-Strategien**: **Imaging-Verfahren** (ein fertiges Systemabbild auf viele Geräte klonen) gegenüber **Installationsprogrammen** (paketweise, oft *silent* / unbeaufsichtigt installiert)

## Worauf es ankommt

Verteilung ist kein einmaliger Akt, sondern ein **Prozess** – und der entscheidende Punkt ist die **Rückholbarkeit**: Was passiert, wenn das ausgerollte Paket einen Fehler hat und schon auf 500 Geräten liegt? Ein gutes Verteilungswerkzeug lässt dich nicht nur sauber ausrollen, sondern auch kontrolliert **zurücknehmen**. Genauso wichtig ist die **Inventarisierung**: Du kannst nur verwalten, wovon du weißt, dass es existiert.

!!! tip "Verbindung zum nächsten Schritt"
    Während es hier um die Verteilung von **Software auf Geräte** geht, dreht sich die [Container-Orchestrierung](kubernetes-grundlagen.md) um die Verteilung von **Container-Workloads über einen Cluster** – dieselbe Grundidee, andere Ebene.
