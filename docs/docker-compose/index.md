---
title: "Docker Compose"
description: "Der Compose-Block: deklarative Multi-Container-Stacks verstehen – plus Hands-on: die erste eigene compose.yaml mit Postgres und Adminer."
---

# Docker Compose

Im [Aufbau-Block](../docker-aufbau/index.md) hast du einen Postgres-Container mit Adminer **manuell** über mehrere `docker`-Befehle zusammengestellt. Das geht – ist aber fragil: eine falsche Reihenfolge, ein vergessenes Flag und nichts läuft.

**Docker Compose** löst genau das: du beschreibst deinen Stack **einmal** in einer `compose.yaml` und ein einziger Befehl startet oder stoppt alles.

!!! abstract "Was du nach diesem Block kannst"
    - erklären, **warum Compose entstanden ist** und wie es sich von `docker run` unterscheidet
    - die `compose.yaml`-Syntax lesen und schreiben (`services`, `volumes`, `ports`, `environment`, `depends_on`, `healthcheck`)
    - eine **eigene `compose.yaml`** für Postgres + Adminer aufsetzen und starten
    - mit den wichtigsten Befehlen (`up`, `down`, `logs`, `ps`, `exec`) sicher umgehen

---

## Umfang und Ablauf

!!! note "Aufwand"
    Plane für den kompletten Block **rund 3 Stunden** ein – etwa zwei Drittel Theorie, ein Drittel Hands-on. Im Präsenzformat liegen dazwischen Pausen; wer allein lernt, arbeitet die Seiten im eigenen Tempo durch. Der Aufbau funktioniert für beides.

1. **[Einführung](einfuehrung.md)** – das Problem mit `docker run`, imperativ vs. deklarativ, V1 vs. V2, die wichtigsten Befehle
2. **[Grundlagen](grundlagen.md)** – die `compose.yaml`-Syntax: `services`, `image`/`build`, `ports`, `environment`, `volumes`, `depends_on`, `healthcheck`, `.env`, `profiles`
3. **[Praxis](praxis-webapp.md)** – die erste eigene `compose.yaml`: Postgres + Adminer als deklarativer Stack (ca. 45 Minuten)

---

## Seiten in diesem Block

| Seite | Inhalt |
|-------|--------|
| [Einführung](einfuehrung.md) | Motivation, imperativ vs. deklarativ, V1 vs. V2, Befehls-Übersicht |
| [Grundlagen](grundlagen.md) | Komplette `compose.yaml`-Syntax Schritt für Schritt |
| [Praxis: erste compose.yaml](praxis-webapp.md) | 45-Minuten-Hands-on – Postgres + Adminer als simpler Compose-Stack |
| [Übungen](uebungen.md) | 🟢🟡🔴🏆 Vier Schwierigkeitsgrade zum Selbermachen (inkl. WordPress, `.env`, Tech-Stack) |
| [Stolpersteine](stolpersteine.md) | Typische Compose-Probleme |
| [Merksätze](merksaetze.md) | Kompakte Zusammenfassung |

---

## Voraussetzung: der Aufbau-Block sitzt

Wenn du bei den drei Säulen (Volumes, ENV-Variablen, Netzwerke) noch unsicher bist, schau dir vorab den [Aufbau-Block](../docker-aufbau/index.md) nochmal an – besonders die Praxis. Compose **baut auf diesen Konzepten auf**, bringt aber die Konfiguration in eine saubere Textdatei.

---

## Leitfrage

> **Wie beschreibst du einen Container-Stack so, dass jeder aus deinem Team ihn mit einem einzigen Befehl hochfahren kann – und alle Teile sauber zusammenspielen?**

Am Ende dieses Blocks hast du deine erste eigene `compose.yaml`, die genau das tut.
