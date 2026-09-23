---
title: "Docker-Recap"
description: "Die Befehle, die du für den Docker Escape Room brauchst, alle auf einer Seite."
---

# Docker-Recap

Diese Befehle solltest du für die Aufgabe kennen. Nichts davon ist neu, ihr habt das alles in der Docker-Einführung und im Aufbau-Block gesehen.

!!! tip "Diese Seite ist deine Referenz während der Aufgabe"
    Lass sie offen, während du arbeitest. Du musst dir nichts merken, schauen ist erlaubt.

---

## Container anzeigen

```bash
docker ps         # nur laufende Container
docker ps -a      # auch beendete
```

## Images anzeigen

```bash
docker images
```

## Image bauen

```bash
docker build -t mein-image:1.0 .
```

Der Punkt am Ende ist der **Build-Kontext**: der Ordner, der an Docker geschickt wird. Mehr dazu: [Eigenes Image](../docker-training/06-eigenes-image.md).

## Container starten

```bash
docker run --name mein-container -d mein-image:1.0
```

| Flag | Bedeutung |
|---|---|
| `--name` | fester Name statt zufällig |
| `-d` | im Hintergrund (detached) |
| `-p HOST:CONTAINER` | Port-Mapping (siehe unten) |
| `-e KEY=VALUE` | Umgebungsvariable |
| `-v VOLUME:PFAD` | Volume mounten |
| `--network NETZ` | Container ans Netzwerk hängen |

## Port veröffentlichen

```bash
docker run --name web -p 3000:3000 -d mein-image:1.0
```

Merke:

```text
-p HOST_PORT : CONTAINER_PORT
```

Beispiel `-p 3000:3000` heißt: „Port 3000 auf eurem Rechner zeigt auf Port 3000 im Container."

Und `-p 3001:3000` heißt: „Port 3001 auf eurem Rechner zeigt auf Port 3000 im Container."

Mehr dazu: [Ports](../docker-training/03-ports.md).

## Logs ansehen

```bash
docker logs mein-container          # alles
docker logs -f mein-container       # live folgen (Ctrl+C zum Beenden)
docker logs --tail 50 mein-container
```

## Container stoppen und löschen

```bash
docker stop mein-container
docker rm   mein-container
```

Oder direkt erzwingen (auch wenn er noch läuft):

```bash
docker rm -f mein-container
```

## Netzwerk erstellen, anzeigen, untersuchen

```bash
docker network create mein-netzwerk
docker network ls
docker network inspect mein-netzwerk
```

Mehr dazu: [Docker-Netzwerke](../docker-aufbau/docker-networks.md).

## Volume erstellen, anzeigen, untersuchen

```bash
docker volume create mein-volume
docker volume ls
docker volume inspect mein-volume
```

Mehr dazu: [Volumes](../docker-aufbau/volumes.md).

## In einen laufenden Container wechseln

```bash
docker exec -it mein-container sh
```

`-it` = interaktiv mit Terminal. `sh` ist auf Alpine-Containern Standard, in größeren Images klappt auch `bash`.

## Container untersuchen

```bash
docker inspect mein-container
```

Liefert sehr viel JSON, aber dort steht alles: Netzwerke, IPs, Volumes, Env-Variablen, Mounts.

---

## Wichtige Denkfrage

Wenn zwei Container miteinander sprechen sollen:

> **Reicht `localhost`?**

**Antwort: meistens nein.**

Aus Sicht eines Containers zeigt `localhost` auf den **Container selbst**. Wenn die API also versucht, die Datenbank über `localhost:5432` zu erreichen, sucht sie die Datenbank **im API-Container** und nicht im DB-Container. Dort gibt's keine Datenbank → Fehler.

**Lösung:** Container im gemeinsamen Docker-Netzwerk → den anderen Container über seinen **Namen** ansprechen.

Beispiel: API spricht Datenbank über `quest-db:5432` an, weil die Datenbank im selben Netzwerk den Containernamen als Hostnamen bekommt.

---

## Cheatsheet zur Aufgabe

Speziell für diese Aufgabe brauchst du folgende Patterns:

### Netzwerk anlegen
```bash
docker network create quest-net
```

### Volume anlegen
```bash
docker volume create quest-pg-data
```

### Container an Netzwerk + Volume hängen
```bash
docker run --name <name> --network quest-net -v <volume>:<pfad-im-container> -d <image>
```

Die spitzen Klammern sind Platzhalter. Ersetzt sie samt Klammern durch eure Werte, sonst meldet PowerShell einen Fehler.

### Umgebungsvariablen setzen
```bash
docker run -e PGHOST=quest-db -e PGUSER=quest -d <image>
```

Mehr dazu: [Umgebungsvariablen](../docker-aufbau/umgebungsvariablen.md).

### Postgres konfigurieren

Das offizielle Postgres-Image liest beim **ersten** Start mit leerem Volume drei Umgebungsvariablen: `POSTGRES_USER` (Benutzer), `POSTGRES_PASSWORD` (Passwort) und `POSTGRES_DB` (Datenbankname). Ohne `POSTGRES_PASSWORD` beendet sich der Container sofort. Enthält das Volume schon Daten, ignoriert Postgres diese Variablen. Vorbild ist die [Praxis Postgres & Adminer](../docker-aufbau/praxis-multi-container.md#teil-1-postgres-mit-volume-und-env).

### Port veröffentlichen
```bash
docker run -p 3000:3000 -d <image>
```

Diese Bausteine kombinierst du in den Aufgaben.

---

## Weiter

- [Szenario](03-szenario.md): die Story und die Architektur
- [Aufgabenübersicht](04-aufgabenuebersicht.md): die 10 Aufgaben + Bonus
