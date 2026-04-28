---
title: "Übergang zu Docker Compose"
description: "Was ihr im Escape Room manuell gemacht habt, automatisiert Compose. Brücke zur nächsten Einheit."
---

# Übergang zu Docker Compose

Heute habt ihr ein Multi-Container-System **manuell** gestartet. Dafür brauchtet ihr viele einzelne Schritte:

- Netzwerk erstellen
- Volume erstellen
- Datenbank starten (mit 5 Env-Variablen + Volume + Netzwerk)
- API-Image bauen
- API starten (mit 7 Env-Variablen + Port + Netzwerk)
- Adminer starten
- Logs prüfen, Fehler suchen, Container neu erstellen

Insgesamt: **rund 10 Befehle, dutzende Flags, viele Werte zum Merken**.

---

## Reflexion

Diskutiert kurz in der Gruppe oder im Plenum:

1. Welche Befehle mussten **alle Gruppen** fast gleich ausführen?
2. Welche **Werte** musste man sich merken (oder ständig nachschlagen)?
3. **Wo** sind Fehler passiert?
4. Was wäre praktisch, wenn man das Setup in **einer einzigen Datei** beschreiben könnte – die jede:r aus der Gruppe per `git clone` bekommt und sofort starten kann?

---

## Kernidee von Docker Compose

Genau dieses Problem löst Docker Compose:

> Ein Multi-Container-Setup wird **nicht mehr** über viele einzelne Befehle gestartet, sondern **deklarativ** in einer Datei beschrieben.

Statt 10 `docker`-Befehle gibt es eine `compose.yaml`. Statt jedes Mal alle Flags zu tippen, schreibst du einmal:

```yaml
services:
  db:
    image: postgres:16-alpine
    environment: ...
    volumes: ...
  api:
    build: .
    ports:
      - "3000:3000"
    environment: ...
    depends_on:
      - db
```

Dann reicht **ein einziger Befehl**:

```bash
docker compose up -d
```

Und alles läuft. Genauso schnell wieder weg:

```bash
docker compose down
```

---

## Was Compose euch konkret abnimmt

Aus Sicht der heutigen Aufgabe:

| Bisher manuell | Mit Compose |
|---|---|
| `docker network create quest-net` | automatisch (Default-Netzwerk pro Compose-Projekt) |
| `docker volume create quest-pg-data` | automatisch, wenn in YAML deklariert |
| `docker run --name quest-db --network … -e … -v … -d postgres:16-alpine` | unter `services: db:` in YAML |
| `docker run --name quest-api --network … -p … -e … -d container-quest-api:1.0` | unter `services: api:` in YAML |
| `docker run --name quest-adminer --network … -p … -d adminer` | unter `services: adminer:` in YAML |
| Alle drei manuell starten und in der richtigen Reihenfolge | `docker compose up -d` startet alles |
| Alle drei manuell stoppen + entfernen | `docker compose down` |

**Reihenfolge** mit `depends_on` + `condition: service_healthy` – Compose startet die DB zuerst und wartet, bis sie bereit ist, bevor die API startet.

---

## Wichtig

In dieser Einheit **schreibt ihr noch keine Compose-Datei**. Das ist die nächste Einheit.

Aber wenn ihr es erlebt habt, wie viele Schritte ihr heute gebraucht habt, dann ist Compose nicht „noch ein Tool, das ich lernen muss" – sondern **die Erleichterung, die ihr euch sehnlich gewünscht habt**.

---

## Merksatz

> **Docker Compose ist nicht „ein anderes Docker". Docker Compose ist eine bequemere Art, mehrere Docker-Container gemeinsam zu definieren, zu starten und zu verwalten.**

---

## Weiter

In der nächsten Einheit:

- [Docker Compose – Einführung](../docker-compose/einfuehrung.md)
- [Compose – Grundlagen](../docker-compose/grundlagen.md)
- [Praxis: Compose-WebApp](../docker-compose/praxis-webapp.md)

Ihr werdet **denselben Stack** wie heute – Postgres + API + Adminer – mit Compose neu aufbauen. Und ihr werdet sehen, wie wenig Tipparbeit das ist, wenn man das einmal einmal in einer Datei beschrieben hat.
