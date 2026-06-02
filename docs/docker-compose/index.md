---
title: "Docker Compose (Block 4)"
description: "Der Compose-Block: 2 Stunden Theorie zu deklarativen Multi-Container-Stacks plus 45 Minuten Hands-on – die erste eigene compose.yaml mit Postgres und Adminer."
---

# Docker Compose (Block 4)

Im [Aufbau-Block](../docker-aufbau/index.md) hast du einen Postgres-Container mit Adminer **manuell** über mehrere `docker`-Befehle zusammengestellt. Das geht – ist aber fragil: eine falsche Reihenfolge, ein vergessenes Flag und nichts läuft.

**Docker Compose** löst genau das: du beschreibst deinen Stack **einmal** in einer `compose.yaml` und ein einziger Befehl startet oder stoppt alles.

!!! abstract "Was du nach diesen 3 Stunden kannst"
    - erklären, **warum Compose entstanden ist** und wie es sich von `docker run` unterscheidet
    - die `compose.yaml`-Syntax lesen und schreiben (`services`, `volumes`, `ports`, `environment`, `depends_on`, `healthcheck`)
    - eine **eigene `compose.yaml`** für Postgres + Adminer aufsetzen und starten
    - mit den wichtigsten Befehlen (`up`, `down`, `logs`, `ps`, `exec`) sicher umgehen

---

## Zeitplan – 3 Stunden (2h Theorie + 45 min Praxis)

!!! note "Für Präsenzkurs und Selbstlerner"
    Der folgende Zeitplan ist für den **3-Stunden-Präsenzkurs** gedacht – **2 Stunden Theorie**, dazwischen Pausen, dann **45 Minuten Hands-on**. Selbstlerner ignorieren die Zeiten und arbeiten die Inhalte in ihrem Tempo durch – der Aufbau funktioniert beides.

| Zeit | Was passiert | Seite |
|------|--------------|-------|
| **0:00 – 0:05** | Begrüßung, kurzer Rückblick auf Block 3 | — |
| **0:05 – 1:00** | **Theorie 1**: Einführung – das Problem mit `docker run`, imperativ vs. deklarativ, V1 vs. V2, die wichtigsten Befehle | [Einführung](einfuehrung.md) |
| **1:00 – 1:10** | Pause | — |
| **1:10 – 2:05** | **Theorie 2**: Grundlagen – `compose.yaml`-Syntax: `services`, `image`/`build`, `ports`, `environment`, `volumes`, `depends_on`, `healthcheck`, `.env`, `profiles` | [Grundlagen](grundlagen.md) |
| **2:05 – 2:15** | Pause + Übergang zur Praxis | — |
| **2:15 – 3:00** | **Praxis** (45 min): die erste eigene `compose.yaml` – Postgres + Adminer als deklarativer Stack | [Praxis](praxis-webapp.md) |

---

## Seiten in diesem Block

| Seite | Inhalt |
|-------|--------|
| [Einführung](einfuehrung.md) | Motivation, imperativ vs. deklarativ, V1 vs. V2, Befehls-Übersicht |
| [Grundlagen](grundlagen.md) | Komplette `compose.yaml`-Syntax Schritt für Schritt |
| [Praxis: erste compose.yaml](praxis-webapp.md) | 45-Minuten-Hands-on – Postgres + Adminer als simpler Compose-Stack |
| [Übungen](uebungen.md) | 🟢🟡🔴🏆 Vier Schwierigkeitsgrade zum Selbermachen (inkl. WordPress, Flask, Tech-Stack) |
| [Stolpersteine](stolpersteine.md) | Typische Compose-Probleme |
| [Merksätze](merksaetze.md) | Kompakte Zusammenfassung |

---

## Voraussetzung: Block 3 solide

Wenn du bei den drei Säulen (Volumes, ENV-Variablen, Netzwerke) noch unsicher bist, schau dir vor der Einheit den [Aufbau-Block](../docker-aufbau/index.md) nochmal an – besonders die Praxis. Compose **baut auf diesen Konzepten auf**, bringt aber die Konfiguration in eine saubere Textdatei.

---

## Leitfrage

> **Wie beschreibst du einen Container-Stack so, dass jeder aus deinem Team ihn mit einem einzigen Befehl hochfahren kann – und alle Teile sauber zusammenspielen?**

Am Ende dieser 3 Stunden hast du deine erste eigene `compose.yaml`, die genau das tut.
