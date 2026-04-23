---
title: "Docker Compose (Block 4)"
description: "Der Compose-Block: von Einzelbefehlen zu deklarativen Multi-Container-Stacks. In 3 Stunden vom ersten docker-compose up zur eigenen Compose-WebApp."
---

# Docker Compose (Block 4)

Im [Aufbau-Block](../docker-aufbau/index.md) hast du einen Postgres-Container mit Adminer **manuell** über mehrere `docker`-Befehle zusammengestellt. Das geht – ist aber fragil: eine falsche Reihenfolge, ein vergessenes Flag, und nichts läuft.

**Docker Compose** löst genau das: du beschreibst deinen Stack **einmal** in einer `compose.yaml`, und ein einziger Befehl startet oder stoppt alles.

!!! abstract "Was du nach diesen 3 Stunden kannst"
    - erklären, **warum Compose entstanden ist** und wie es sich von `docker run` unterscheidet
    - eine `compose.yaml` für einen Multi-Container-Stack **selbst schreiben**
    - Services, Volumes, Netzwerke und `depends_on` mit Healthchecks deklarieren
    - einen Stack mit einem eigenen App-Container (Dockerfile + Python + Postgres) **mit Compose bauen und starten**

---

## Zeitplan – 3 Stunden

!!! note "Für Präsenzkurs und Selbstlerner"
    Der folgende Zeitplan ist für den **3-Stunden-Präsenzkurs** gedacht. Selbstlerner ignorieren die Zeiten und arbeiten die Inhalte in ihrem Tempo durch – der Aufbau funktioniert beides.

| Zeit | Was passiert | Seite |
|------|--------------|-------|
| **0:00 – 0:15** | Begrüßung, Rückblick Block 3 (manuell Stress) | — |
| **0:15 – 0:40** | Theorie-Folien: imperativ vs. deklarativ, compose.yaml, services, volumes, networks | [Einführung](einfuehrung.md) · [Grundlagen](grundlagen.md) |
| **0:40 – 1:30** | Praxis 1: Postgres + Adminer als Compose-Stack nachbauen | [Praxis – Teil 1](praxis-webapp.md) |
| **1:30 – 1:40** | Pause | — |
| **1:40 – 2:20** | Praxis 2: Eigene Flask-App mit Dockerfile, per Compose integriert | [Praxis – Teil 2](praxis-webapp.md) |
| **2:20 – 2:45** | Praxis 3: `depends_on` + Healthcheck, `.env`, Profiles | [Praxis – Teil 3](praxis-webapp.md) |
| **2:45 – 3:00** | Probleme besprechen, Ausblick | [Stolpersteine](stolpersteine.md) · [Merksätze](merksaetze.md) |

---

## Seiten in diesem Block

| Seite | Inhalt |
|-------|--------|
| [Einführung](einfuehrung.md) | Motivation, imperativ vs. deklarativ, V1 vs. V2, Befehls-Übersicht |
| [Grundlagen](grundlagen.md) | Komplette `compose.yaml`-Syntax Schritt für Schritt |
| [Praxis: WebApp mit Compose](praxis-webapp.md) | Der Hands-on – Flask-App + Postgres + Adminer als Compose-Stack |
| [Übungen](uebungen.md) | 🟢🟡🔴🏆 Vier Schwierigkeitsgrade zum Selbermachen |
| [Stolpersteine](stolpersteine.md) | Typische Compose-Probleme |
| [Merksätze](merksaetze.md) | Kompakte Zusammenfassung |

---

## Voraussetzung: Block 3 solide

Wenn du bei den drei Säulen (Volumes, ENV-Variablen, Netzwerke) noch unsicher bist, schau dir vor der Einheit den [Aufbau-Block](../docker-aufbau/index.md) nochmal an – besonders die Praxis. Compose **baut auf diesen Konzepten auf**, bringt aber die Konfiguration in eine saubere Textdatei.

---

## Leitfrage

> **Wie beschreibst du einen Container-Stack so, dass jeder aus deinem Team ihn mit einem einzigen Befehl hochfahren kann – und alle Teile sauber zusammenspielen?**

Am Ende dieser 3 Stunden hast du deine erste eigene `compose.yaml`, die genau das tut.
