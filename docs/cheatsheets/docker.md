---
title: "Cheatsheet – Docker"
description: "Die wichtigsten Docker-Befehle als Tabellen – zum schnellen Nachschlagen."
---

# Cheatsheet – Docker

!!! info "Plattform-Hinweis zu den Code-Beispielen"
    Die meisten Beispiele in diesem Cheatsheet zeigen **macOS / Linux Bash**-Syntax. Für **Windows PowerShell** musst du an drei Stellen umschreiben:

    | macOS / Linux (Bash) | Windows PowerShell | Windows CMD |
    |----------------------|--------------------|-------------|
    | `$(docker ps -q)` | `@(docker ps -q)` oder Pipe an `ForEach-Object` | für-Schleife (`for /f`) |
    | `$(pwd)` | `${PWD}` | `%cd%` |
    | `export VAR=value` | `$env:VAR = "value"` | `set VAR=value` |
    | `&> log.txt` | `*> log.txt` | `> log.txt 2>&1` |

    Bei den **„Nützlichen Einzeilern"** weiter unten findest du die wichtigsten Varianten als anklickbare Tabs.

## Grundlagen

| Befehl | Bedeutung |
|--------|-----------|
| `docker version` | Client- und Daemon-Version anzeigen |
| `docker info` | System-Zusammenfassung (Anzahl Container, Images, Disk) |
| `docker help` | Hilfe auf oberster Ebene |
| `docker <befehl> --help` | Hilfe zu einzelnem Befehl |

## Images verwalten

| Befehl | Bedeutung |
|--------|-----------|
| `docker pull <image>` | Image aus Registry ziehen |
| `docker push <user>/<image>:<tag>` | Image in Registry schieben (erfordert `docker login`) |
| `docker images` | Alle lokalen Images auflisten |
| `docker rmi <image>` | Image löschen |
| `docker rmi $(docker images -q)` | Alle Images löschen (Vorsicht!) |
| `docker tag <image>:<alt> <image>:<neu>` | Weiteren Tag für ein Image setzen |
| `docker history <image>` | Layer-Historie des Images anzeigen |
| `docker inspect <image>` | Detailinfos zum Image (JSON) |

## Container starten

`docker run` ist das wichtigste Kommando. Muster:

```text
docker run [OPTIONS] <image> [COMMAND] [ARG...]
```

| Flag | Bedeutung |
|------|-----------|
| `-d` | **Detached** – im Hintergrund starten |
| `-it` | interaktiv + TTY, z.B. für eine Shell |
| `--name <name>` | festen Namen statt zufällig vergeben |
| `-p <host>:<container>` | Port-Mapping |
| `-v <host-pfad>:<container-pfad>` | Bind Mount (Host-Ordner in Container einhängen) |
| `-v <volume-name>:<container-pfad>` | Named Volume |
| `-e KEY=VALUE` | Umgebungs­variable setzen |
| `--rm` | Container nach Beenden automatisch löschen |
| `--restart unless-stopped` | automatischer Neustart, wenn Container abstürzt |
| `--platform linux/amd64` | Architektur erzwingen (Apple Silicon-Workaround) |
| `--network <name>` | Container an bestimmtes Netzwerk hängen |
| `-u <user>` | als anderer User laufen |

Beispiele:

```bash
docker run hello-world
docker run -it ubuntu bash
docker run -d --name web -p 8080:80 nginx
docker run -d --rm --name tmp -p 9000:80 nginx:alpine
docker run --platform linux/amd64 -it ubuntu bash
```

## Laufende Container

| Befehl | Bedeutung |
|--------|-----------|
| `docker ps` | Laufende Container anzeigen |
| `docker ps -a` | Alle Container (auch gestoppt) |
| `docker ps -q` | Nur Container-IDs |
| `docker logs <name>` | Logs eines Containers |
| `docker logs -f <name>` | Logs live mitlesen |
| `docker logs --tail 100 <name>` | nur letzte 100 Zeilen |
| `docker stats` | Live-Ressourcen­verbrauch aller Container |
| `docker top <name>` | Prozesse im Container |
| `docker inspect <name>` | Detailinfos (JSON) |

## In laufenden Containern arbeiten

| Befehl | Bedeutung |
|--------|-----------|
| `docker exec -it <name> bash` | Shell im Container öffnen |
| `docker exec -it <name> sh` | Shell (wenn keine bash da ist, z.B. Alpine) |
| `docker exec <name> <befehl>` | Einzelnen Befehl ausführen, kein Terminal |
| `docker cp <name>:/pfad ./lokal` | Datei aus Container auf Host kopieren |
| `docker cp ./lokal <name>:/pfad` | Datei vom Host in Container kopieren |

## Container stoppen und entfernen

| Befehl | Bedeutung |
|--------|-----------|
| `docker stop <name>` | Container sauber stoppen |
| `docker start <name>` | Gestoppten Container starten |
| `docker restart <name>` | Neu starten |
| `docker pause <name>` / `unpause <name>` | Pausieren / fortsetzen |
| `docker kill <name>` | Hart beenden (SIGKILL) |
| `docker rm <name>` | Gestoppten Container entfernen |
| `docker rm -f <name>` | Laufenden Container zwangs­löschen |
| `docker rm $(docker ps -aq)` | Alle Container löschen |

## Eigenes Image bauen

| Befehl | Bedeutung |
|--------|-----------|
| `docker build -t <name>:<tag> .` | Aus `Dockerfile` im aktuellen Ordner bauen |
| `docker build -t <name>:<tag> -f <pfad>/Dockerfile .` | Alternatives Dockerfile |
| `docker build --no-cache -t <name> .` | Build ohne Cache erzwingen |
| `docker build --platform linux/amd64 -t <name> .` | Zielarchitektur angeben |

## Registry

| Befehl | Bedeutung |
|--------|-----------|
| `docker login` | Bei Docker Hub anmelden |
| `docker login ghcr.io` | Bei GitHub Container Registry anmelden |
| `docker logout` | Abmelden |
| `docker search <begriff>` | Auf Docker Hub suchen |

## Volumes & Mounts

| Befehl | Bedeutung |
|--------|-----------|
| `docker volume create <name>` | Named Volume anlegen |
| `docker volume ls` | Volumes auflisten |
| `docker volume inspect <name>` | Detailinfos zu Volume |
| `docker volume rm <name>` | Volume löschen |
| `-v <name>:/pfad` | Named Volume beim run einbinden |
| `-v <hostpfad>:/app` | Bind Mount – Hostpfad in Container einhängen |

Bind Mount des **aktuellen Ordners** je Shell:

=== "macOS / Linux"
    ```bash
    -v $(pwd):/app
    ```

=== "Windows PowerShell"
    ```powershell
    -v "${PWD}:/app"
    ```

=== "Windows CMD"
    ```cmd
    -v "%cd%:/app"
    ```

!!! note "Volumes vertiefen wir im nächsten Kursblock."
    Für den heutigen Einstieg reicht es, den Begriff zu kennen.

## Netzwerke

| Befehl | Bedeutung |
|--------|-----------|
| `docker network ls` | Netzwerke auflisten |
| `docker network create <name>` | Eigenes Netzwerk anlegen |
| `docker network rm <name>` | Netzwerk löschen |
| `docker network connect <net> <container>` | Container an Netzwerk hängen |

## Aufräumen

| Befehl | Bedeutung |
|--------|-----------|
| `docker container prune` | Alle gestoppten Container weg |
| `docker image prune` | Dangling Images weg |
| `docker image prune -a` | Alle unbenutzten Images weg |
| `docker volume prune` | Verwaiste Volumes weg |
| `docker network prune` | Ungenutzte Netzwerke weg |
| `docker system prune` | Alles Obige auf einmal (mit Bestätigung) |
| `docker system prune -a --volumes` | Aggressivste Variante – alles weg |
| `docker system df` | Wie viel belegt Docker aktuell? |

## Nützliche Einzeiler

### Alle laufenden Container stoppen

=== "macOS / Linux"
    ```bash
    docker stop $(docker ps -q)
    ```

=== "Windows PowerShell"
    ```powershell
    docker ps -q | ForEach-Object { docker stop $_ }
    ```

=== "Windows CMD"
    ```cmd
    for /f %i in ('docker ps -q') do docker stop %i
    ```

### Alle Container (auch gestoppte) entfernen

=== "macOS / Linux"
    ```bash
    docker rm $(docker ps -aq)
    ```

=== "Windows PowerShell"
    ```powershell
    docker ps -aq | ForEach-Object { docker rm $_ }
    ```

=== "Windows CMD"
    ```cmd
    for /f %i in ('docker ps -aq') do docker rm %i
    ```

### Shell im neuesten Container

=== "macOS / Linux"
    ```bash
    docker exec -it $(docker ps -q | head -1) bash
    ```

=== "Windows PowerShell"
    ```powershell
    docker exec -it (docker ps -q | Select-Object -First 1) bash
    ```

### Schnell mal ein Wegwerf-Container mit Ubuntu

```bash
docker run --rm -it ubuntu bash
```

(plattform-unabhängig)

### Alle Logs eines Containers in eine Datei

=== "macOS / Linux"
    ```bash
    docker logs <name> &> container.log
    ```

=== "Windows PowerShell"
    ```powershell
    docker logs <name> *> container.log
    ```

=== "Windows CMD"
    ```cmd
    docker logs <name> > container.log 2>&1
    ```

---

## Minimal-Workflow aus dem heutigen Kurs

```bash
# 1) Offiziellen Container starten
docker run -d --name web -p 8080:80 nginx

# 2) Prüfen, ob er läuft
docker ps

# 3) In den Container schauen
docker logs web
docker exec -it web bash

# 4) Stoppen und entfernen
docker stop web
docker rm web

# 5) Eigenes Image bauen (mit Dockerfile im Ordner)
docker build -t mein-bild:1.0 .

# 6) Starten
docker run -d --name mein-web -p 9000:80 mein-bild:1.0

# 7) Aufräumen
docker stop mein-web && docker rm mein-web
docker rmi mein-bild:1.0
```

Für ausführliche Erklärung: [Erste Schritte](../docker/erste-schritte.md) und [Praxis: eigenes Image](../docker/praxis-eigenes-image.md).
