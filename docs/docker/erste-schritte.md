---
title: "Erste Schritte mit Docker"
description: "Die ersten Container mit hello-world, nginx und httpd – Schritt für Schritt, mit erwarteter Ausgabe und Erklärung jedes Flags."
---

# Erste Schritte mit Docker

!!! abstract "Ziel"
    Am Ende dieser Anleitung hast du:

    - **`docker run hello-world`** erfolgreich ausgeführt
    - einen **nginx-Container** im Hintergrund gestartet und im Browser gesehen
    - **Ports gemappt**, **Logs angeschaut**, den Container wieder **gestoppt**
    - denselben Ablauf mit einem **zweiten Webserver** (httpd) wiederholt

## Voraussetzungen

- **Docker Desktop** (auf Mac/Windows) oder **Docker Engine** (auf Linux) ist installiert. Wenn nicht → [Docker installieren](installation.md).
- Docker läuft: check mit `docker version`.
- **Internetverbindung**, damit die Images gezogen werden können.
- Ein Browser.

Check, dass Docker läuft:

```bash
docker version
```

Du solltest Block für Client und Server bekommen. Wenn nur der Client steht und der Server fehlt, läuft der Daemon nicht – siehe Box direkt darunter.

??? danger "`Cannot connect to the Docker daemon`"
    Der Daemon läuft nicht. Schnell-Fix nach OS:

    === "macOS"
        1. **Docker Desktop** öffnen (Spotlight `Cmd+Leertaste` → „Docker").
        2. Warten, bis das Wal-Icon in der Menüleiste **„Engine running"** zeigt.
        3. Im Terminal nochmal `docker version` ausführen.

    === "Windows"
        1. **Docker Desktop** über das Startmenü öffnen.
        2. Warten, bis das Wal-Icon im Tray grün ist und „Engine running" zeigt.
        3. **Neues** PowerShell-Fenster öffnen (das alte hat noch keinen aktiven PATH).
        4. `docker version` ausführen.

    === "Linux"
        ```bash
        sudo systemctl start docker
        sudo systemctl enable docker     # Autostart beim Boot
        groups | grep docker             # bist du in der docker-Gruppe?
        ```

        Wenn `docker` in der Gruppen-Ausgabe fehlt, hast du nach `sudo usermod -aG docker $USER` vermutlich vergessen, dich neu einzuloggen. Kurzfristig hilft `newgrp docker`.

    Ausführlich: [Stolpersteine → Docker startet nicht](stolpersteine.md).

---

## Schritt 1 – Hello World

```bash
docker run hello-world
```

Was siehst du (gekürzt):

```text
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
...
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.
...
```

**Was passiert Schritt für Schritt:**

1. Docker sucht lokal nach einem Image namens `hello-world:latest` – findet keines.
2. Docker holt es aus Docker Hub (Standard-Registry, siehe [Registry und Docker Hub](registry-und-dockerhub.md)).
3. Docker erzeugt einen Container aus dem Image.
4. Docker startet den Container. Der Container führt sein `CMD` aus (ein kleines Programm, das die Begrüßung druckt) und beendet sich sofort wieder.

Das ist ein komplett normaler Container-Lebenszyklus – nur sehr kurz.

### Wo ist der Container jetzt?

Aktive Container anzeigen:

```bash
docker ps
```

Erwartete Ausgabe:

```text
CONTAINER ID   IMAGE   COMMAND   CREATED   STATUS   PORTS   NAMES
```

Leer. Weil der hello-world-Container sich sofort beendet hat, zeigt `docker ps` ihn nicht mehr.

**Alle** Container (auch gestoppte):

```bash
docker ps -a
```

```text
CONTAINER ID   IMAGE         COMMAND    CREATED          STATUS                      PORTS   NAMES
abc123def      hello-world   "/hello"   30 seconds ago   Exited (0) 28 seconds ago           happy_bell
```

Dort siehst du ihn: Status `Exited (0)` (also normal beendet), NAME `happy_bell` (zufällig vergeben), Image `hello-world`.

### Den hello-world-Container entfernen

```bash
docker rm happy_bell
```

(Name anpassen an das, was `docker ps -a` bei dir zeigt.)

Alternativ über die Container-ID, wovon die ersten 4 Zeichen schon eindeutig genug sind:

```bash
docker rm abc1
```

---

## Schritt 2 – nginx im Hintergrund starten

Jetzt etwas Nützlicheres: ein Webserver.

```bash
docker run -d --name web -p 8080:80 nginx
```

Dieser Befehl hat viel zu sagen. Gehen wir ihn durch:

| Teil | Bedeutung |
|------|-----------|
| `docker run` | Starte einen Container aus einem Image |
| `-d` | **Detached**: im Hintergrund, nicht im Vordergrund |
| `--name web` | Gib dem Container den Namen `web` statt eines zufälligen |
| `-p 8080:80` | **Port-Mapping**: Host-Port `8080` → Container-Port `80` |
| `nginx` | Das Image. Kurz für `nginx:latest` |

Erwartete Ausgabe:

```text
abcd1234...  (eine Container-ID)
```

Nichts weiter – denn der Container läuft im Hintergrund.

### Kurz prüfen, dass er wirklich läuft

```bash
docker ps
```

Du solltest eine Zeile sehen mit:

```text
CONTAINER ID   IMAGE   ...   STATUS        PORTS                   NAMES
abcd1234       nginx   ...   Up 3 seconds  0.0.0.0:8080->80/tcp    web
```

- **Status `Up`** heißt: der Container läuft.
- **PORTS** zeigt: Host-Port 8080 leitet zu Container-Port 80 weiter.

Erscheint er nicht in `docker ps`, probier `docker ps -a` – dann siehst du, ob er abgestürzt ist, und kannst mit `docker logs web` den Grund lesen.

### Im Browser ansehen

Öffne: <http://localhost:8080>

Du solltest die nginx-Default-Seite sehen: „Welcome to nginx!"

??? warning "Browser zeigt „Diese Seite ist nicht erreichbar" oder lädt nichts"
    Vier häufige Ursachen – systematisch durchgehen:

    1. **Läuft der Container überhaupt?**
       ```bash
       docker ps
       ```
       Wenn nein → `docker ps -a` schauen, was passiert ist, dann `docker logs web`.

    2. **Ist das Port-Mapping aktiv?**
       In der `docker ps`-Zeile muss `0.0.0.0:8080->80/tcp` stehen. Fehlt das Mapping, wurde `-p` vergessen. Lösung: Container neu starten mit `-p 8080:80`.

    3. **Port-Mapping umgedreht?** (häufigster Fehler)
       Richtig: `-p HOST:CONTAINER` → `-p 8080:80`.
       Falsch: `-p 80:8080` (dann hört Docker auf Host-Port 80 und leitet auf Container-Port 8080 – aber nginx im Container hört intern auf Port 80, nicht 8080).

    4. **Anderer Prozess belegt den Host-Port bereits?**

        === "macOS / Linux"
            ```bash
            lsof -i :8080
            ```

        === "Windows PowerShell"
            ```powershell
            netstat -ano | findstr :8080
            ```

        Wenn etwas anderes den Port belegt: entweder den Blockierer beenden, oder einen anderen Host-Port nehmen:
        ```bash
        docker stop web && docker rm web
        docker run -d --name web -p 8081:80 nginx
        ```

    5. **Firewall des Hosts** blockiert den Zugriff. Testen direkt auf dem Host:

        === "macOS / Linux"
            ```bash
            curl -v http://localhost:8080
            ```

        === "Windows PowerShell"
            ```powershell
            Invoke-WebRequest -Uri http://localhost:8080 -UseBasicParsing
            ```

        Kommt hier eine Antwort, liegt das Problem nur im Browser oder Netzwerk – nicht bei Docker.

    Mehr in [Stolpersteine → Ports](stolpersteine.md).

??? info "Warum genau Port 8080 und nicht 80?"
    Auf dem Host sind die Ports unter 1024 (wie 80 und 443) **privilegierte Ports**, die nur mit Admin-Rechten oder `sudo` genutzt werden können. Ports ab 1024 kann jeder normale User frei nutzen. Deshalb ist 8080 der traditionelle „Ersatz-Port für HTTP im Entwickleralltag".

**Was ist gerade passiert:**

- Docker hat den `nginx`-Container gestartet.
- Der Container hört auf seinem internen Port **80**.
- Docker leitet alle Anfragen, die auf Host-Port **8080** kommen, an den Container-Port 80 weiter.
- Der Browser baut eine Verbindung zu `localhost:8080` auf, Docker reicht sie an den Container durch, nginx antwortet.

### Merksatz für Port-Mapping

!!! warning "Die Richtung ist wichtig!"
    **`-p HOST:CONTAINER`**

    **`-p 8080:80`** heißt: „Auf meinem Host-Port 8080, bitte zu Container-Port 80."
    **`-p 80:8080`** wäre umgekehrt.

    Verwechslung hier ist **Fehler Nr. 1** bei Einsteigern.

### Container-Status anschauen

```bash
docker ps
```

```text
CONTAINER ID   IMAGE   COMMAND                  CREATED          STATUS          PORTS                  NAMES
abcd1234       nginx   "/docker-entrypoint.…"   45 seconds ago   Up 44 seconds   0.0.0.0:8080->80/tcp   web
```

Du siehst: läuft, hört auf Port 8080→80, Name ist `web`.

### Logs anschauen

```bash
docker logs web
```

Du siehst die Zugriffs-Logs von nginx – jeder Browser-Refresh erzeugt eine neue Zeile:

```text
192.168.65.1 - - [21/Apr/2026:12:34:56 +0000] "GET / HTTP/1.1" 200 615 "-" "Mozilla/5.0..."
```

Mit `-f` kannst du live folgen (wie `tail -f`):

```bash
docker logs -f web
```

Abbrechen mit `Ctrl+C` – das beendet nur das Mitlesen, nicht den Container.

### In den Container schauen

Du kannst dir auch eine Shell im laufenden Container holen:

```bash
docker exec -it web bash
```

| Flag | Bedeutung |
|------|-----------|
| `exec` | Führe einen Befehl in einem **laufenden** Container aus |
| `-i` | interaktiv, also Stdin offen halten |
| `-t` | Terminal emulieren (TTY) |
| `web` | Name des Containers |
| `bash` | Der Befehl – hier eine Bash-Shell |

Innerhalb des Containers:

```bash
ls /usr/share/nginx/html
cat /usr/share/nginx/html/index.html
exit
```

Dein Terminal ist wieder auf dem Host.

### Container stoppen

```bash
docker stop web
```

Gibt zurück: `web`. Der Container ist nun im Status `Exited`.

```bash
docker ps        # leer
docker ps -a     # zeigt web als Exited
```

### Container entfernen

```bash
docker rm web
```

Der Container ist jetzt weg. Das **Image** `nginx` liegt weiterhin lokal, bereit für den nächsten Start:

```bash
docker images
```

---

## Schritt 3 – Ein zweiter Webserver: Apache httpd

Um zu zeigen, dass Docker **nicht „nur nginx"** kann, nehmen wir einen ganz anderen Webserver:

```bash
docker run -d --name web-alt -p 8081:80 httpd
```

Port-Mapping diesmal auf **8081**, damit sich nichts in die Quere kommt, falls nginx noch läuft.

Erwartete Ausgabe: eine Container-ID.

Im Browser: <http://localhost:8081>

Du siehst: „It works!" – die Default-Seite von Apache httpd.

**Was das zeigt:**

- Docker ist nicht für eine bestimmte Software „gemacht". Es ist ein **standardisiertes Format** zum Verpacken und Starten von Anwendungen.
- Der Befehl sieht **exakt gleich** aus wie bei nginx. Nur das Image-Name am Ende ist anders.

Aufräumen:

```bash
docker stop web-alt
docker rm web-alt
```

---

## Schritt 4 – Mehrere Container parallel

Starte nochmal beide parallel:

```bash
docker run -d --name web -p 8080:80 nginx
docker run -d --name web-alt -p 8081:80 httpd
```

Check:

```bash
docker ps
```

```text
CONTAINER ID   IMAGE    ...   PORTS                   NAMES
a1b2c3d4       nginx    ...   0.0.0.0:8080->80/tcp    web
e5f6g7h8       httpd    ...   0.0.0.0:8081->80/tcp    web-alt
```

Zwei Webserver, zwei Ports, ein Host. Du kannst beide im Browser gleichzeitig aufrufen.

---

## Schritt 5 – Aufräumen

!!! warning "Ohne Aufräumen sammeln sich Container und Images auf der Platte"

### Container stoppen

Einzeln:

```bash
docker stop web web-alt
```

Oder alle laufenden auf einmal:

=== "macOS / Linux / WSL"
    ```bash
    docker stop $(docker ps -q)
    ```

=== "Windows PowerShell"
    ```powershell
    docker stop @(docker ps -q)
    ```

=== "Windows CMD"
    ```cmd
    for /f "tokens=*" %i in ('docker ps -q') do docker stop %i
    ```

Das nimmt die IDs aller aktiven Container und reicht sie an `stop`.

### Container entfernen

```bash
docker rm web web-alt
```

Oder **alle gestoppten Container** auf einmal:

```bash
docker container prune
```

(Fragt nach Bestätigung.)

### Images entfernen (nur wenn du Platz brauchst)

```bash
docker rmi nginx httpd hello-world
```

Oder **alle ungenutzten Images**:

```bash
docker image prune -a
```

Das räumt aggressiv auf – nach dem Befehl musst du alles, was du später brauchst, neu pullen.

---

## Merksatz

!!! success "Merksatz"
    > **`docker run -d --name <name> -p <host>:<container> <image>` ist das Muster für 90 % aller ersten Versuche. Mit `ps`, `logs`, `stop`, `rm` hast du den ganzen Lebenszyklus im Griff.**

---

## Weiterlesen

- [Praxis: eigenes Image](praxis-eigenes-image.md) – als Nächstes: dein **eigenes** Image
- [Stolpersteine](stolpersteine.md)
- [Cheatsheet Docker](../cheatsheets/docker.md)
