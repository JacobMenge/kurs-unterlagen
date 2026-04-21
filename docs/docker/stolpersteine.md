---
title: "Stolpersteine Docker"
description: "Docker-Probleme von Installation bis Laufzeit – Portkonflikte, Platform-Flags, Cache, WSL2, Apple Silicon und mehr. Alles mit aufklappbaren Detail-Lösungen."
---

# Stolpersteine Docker

Diese Seite ist eine **Fehler-Nachschlagekarte**. Such dein Symptom, klick die Box auf – darunter steht Ursache und Lösung.

!!! abstract "Aufbau jedes Eintrags"
    - **Problem** – was du siehst
    - **Ursache** – was dahinter steckt
    - **Lösung** – was du konkret tun kannst

!!! tip "Wo du genauer suchen kannst"
    - Installations­fragen → [Docker installieren](installation.md)
    - „Warum ist Docker Desktop auf Mac eigentlich eine VM?" → [Docker Desktop ist eine VM](docker-desktop-wahrheit.md)
    - Befehle zum Nachschlagen → [Cheatsheet Docker](../cheatsheets/docker.md)

---

## Docker startet nicht / Daemon nicht erreichbar

??? danger "`Cannot connect to the Docker daemon at unix:///var/run/docker.sock`"
    **Ursache:** Der Docker-Daemon läuft gerade nicht, oder dein User darf nicht auf den Socket zugreifen.

    **Lösung nach Betriebssystem:**

    === "macOS / Windows"
        **Docker Desktop starten.** Erkennbar am Wal-Icon in der Menü­leiste (macOS) oder im Tray (Windows).

        - Ist Docker Desktop offen, aber das Icon zeigt rot/gelb: kurz warten, der Daemon braucht 10–30 Sekunden zum Hochfahren.
        - Im Dashboard ganz unten: „Engine running" = grün = alles gut.

    === "Linux"
        ```bash
        sudo systemctl status docker
        ```

        Läuft der Dienst nicht:

        ```bash
        sudo systemctl start docker
        sudo systemctl enable docker   # beim Boot automatisch starten
        ```

        Läuft er, aber dein User kann nicht ran → `docker`-Gruppe prüfen:

        ```bash
        groups | grep docker
        ```

        Ist `docker` nicht dabei:

        ```bash
        sudo usermod -aG docker $USER
        newgrp docker    # oder ab- und anmelden
        ```

??? danger "Docker Desktop startet nicht – Wal-Symbol bleibt grau"
    **Ursache:** Irgendwas im Docker-Desktop-Kern ist hängen geblieben.

    **Lösung in Eskalations­stufen:**

    1. **Docker Desktop beenden und neu starten.** In der Menü­leiste Wal-Icon → Quit Docker Desktop, dann wieder öffnen.
    2. **Rechner neu starten.** Klingt banal, löst gefühlt 40 % aller Docker-Desktop-Probleme.
    3. **Docker Desktop → Troubleshoot → Clean / Purge data.** Löscht alle Container, Images, Volumes – ist also wie ein Reset der Docker-Datenbank. Radikal, aber zuverlässig.
    4. **Letzte Option:** Docker Desktop deinstallieren und neu installieren (siehe [Installation](installation.md)).

??? warning "Windows: WSL2-Fehlermeldung beim Start"
    **Typische Meldung:** „WSL 2 installation is incomplete" oder „The WSL 2 Linux kernel is now installed using a separate MSI update package."

    **Was ist das überhaupt?** Windows hat seinen eigenen Kernel (NT). WSL2 schiebt zusätzlich einen **echten Linux-Kernel** (von Microsoft gepflegt, ca. 100 MB) als Komponente auf dein System. Docker Desktop nutzt dann genau diese Linux-Umgebung, um Container laufen zu lassen.

    **Lösung:**

    1. Linux-Kernel-Update laden: <https://aka.ms/wsl2kernel>
    2. Installieren, Rechner neu starten.
    3. PowerShell als Admin:
       ```powershell
       wsl --set-default-version 2
       wsl --update
       ```
    4. Docker Desktop erneut starten.

    **Firmen-Proxy?** Das Kernel-Update kommt von Microsoft-Servern, nicht von Docker. Der Link `aka.ms/wsl2kernel` wird von manchen Filter-Proxys blockiert. IT bitten, `aka.ms` und `microsoft.com` zu whitelisten.

---

## Ports

??? danger "`port already in use` / `port is already allocated`"
    **Typische Meldung:**

    ```text
    docker: Error response from daemon: driver failed programming external
    connectivity on endpoint web (...): Bind for 0.0.0.0:8080 failed:
    port is already allocated.
    ```

    **Ursache:** Ein anderer Prozess (oder ein anderer Container) belegt schon den Host-Port, den du mappen willst.

    **Lösung Schritt für Schritt:**

    === "macOS / Linux"
        Finde, was den Port belegt:
        ```bash
        lsof -i :8080
        ```
        - Ist es ein Docker-Container: `docker ps` → `docker stop <name>`.
        - Ist es ein anderer Prozess: den Prozess finden und beenden, oder einen anderen Host-Port wählen.

    === "Windows"
        ```powershell
        netstat -ano | findstr :8080
        ```
        Die letzte Zahl ist die PID. Mit `tasklist /FI "PID eq <pid>"` findest du, welches Programm das ist.

    Oder einfach einen anderen Host-Port:
    ```bash
    docker run -d --name web -p 8081:80 nginx
    ```

??? danger "Port-Mapping falsch herum"
    **Symptom:** Du startest den Container, siehst keine Fehler, aber im Browser kommt nichts an. Logs sagen nichts Auffälliges.

    **Ursache:** Die Port-Richtung ist vertauscht. Die Syntax ist **`-p HOST:CONTAINER`**, nicht umgekehrt.

    **Falsches Beispiel:**
    ```bash
    docker run -p 80:8080 nginx
    ```
    Das mappt Host-Port 80 auf Container-Port 8080. Aber nginx hört intern auf Port 80, nicht 8080. Der Container bekommt also nie eine Anfrage.

    **Richtig:**
    ```bash
    docker run -d -p 8080:80 nginx
    ```

    !!! tip "Merksatz"
        **H**ost zuerst, **C**ontainer danach – alphabetisch stimmt das.

??? warning "Container läuft, Port freigegeben, aber im Browser nur weiße Seite"
    **Mögliche Ursachen:**

    1. **Anwendung hört im Container auf `127.0.0.1` statt auf `0.0.0.0`.** Von außen erreichst du dann die App nicht. Lösung: in der Anwendung auf `0.0.0.0` binden.
    2. **Firewall auf dem Host** blockiert den Zugriff. Testen: `curl http://localhost:8080` direkt auf dem Host – kommt eine Antwort? Ja → Problem liegt im Browser/Netz. Nein → Container oder Firewall.
    3. **Docker Desktop auf Mac:** Achtung, `host.docker.internal` ist der Host aus Container-Sicht, `localhost` im Container ist der Container selbst. Im Browser auf dem Host bleibst du bei `localhost:<port>`.

---

## Container startet, aber beendet sich sofort

??? warning "`docker run ubuntu` läuft kurz, dann ist der Container weg"
    **Symptom:** `docker ps` zeigt nichts, `docker ps -a` zeigt `Exited (0)`.

    **Ursache:** Ein Container lebt **nur so lange, wie sein Hauptprozess läuft**. Das Image `ubuntu` hat als Default-Command eine Shell. Ohne interaktives Terminal beendet sich diese Shell sofort.

    **Lösung – interaktiv mit TTY starten:**

    ```bash
    docker run -it --name shell ubuntu bash
    ```

    | Flag | Bedeutung |
    |------|-----------|
    | `-i` | interaktiv (stdin offen) |
    | `-t` | TTY (Terminal-Emulation) |
    | `bash` | der Befehl, den wir ausführen |

    Jetzt bist du in einer Ubuntu-Shell. `exit` beendet den Container sauber.

??? warning "Webserver-Container im Detached-Modus beendet sich trotzdem sofort"
    **Symptom:** `docker run -d nginx:alpine` – Container-ID kommt, aber kurz danach ist der Container weg.

    **Ursache:** Meist ein **Config-Fehler** im Container. Der nginx-Prozess crasht, das Haupt-Command endet, der Container beendet sich.

    **Lösung – Fehler sichtbar machen:**

    ```bash
    docker logs <container-id-oder-name>
    ```

    Dort siehst du die Fehler­meldung, warum nginx crasht. Typische Ursachen: fehlerhafte Konfig im `COPY`, fehlende Datei, falscher Pfad, fehlende Berechtigung.

??? warning "Wie behalte ich einen Container zum Debuggen am Leben?"
    **Szenario:** Dein Container crasht, du willst in die Umgebung schauen.

    **Lösung – den Container mit einer endlos laufenden Shell starten:**

    ```bash
    docker run -it --name debug dein-image sh
    ```

    Oder mit einem künstlichen Endlos-Kommando:

    ```bash
    docker run -d --name debug dein-image sleep infinity
    docker exec -it debug sh
    ```

    Damit kannst du in Ruhe in den Container schauen, ohne dass er sich beendet.

---

## Apple Silicon (M1/M2/M3/M4)

??? danger "`exec format error` beim Start"
    **Ursache:** Das Image gibt es nur in x86_64, dein Mac hat aber eine ARM-CPU. Emulation wurde nicht aktiviert.

    **Lösung in zwei Varianten:**

    === "Schnell (Emulation)"
        ```bash
        docker run --platform linux/amd64 <image>
        ```
        Der Container läuft dann über Rosetta 2 – funktioniert, aber langsamer.

    === "Sauber (ARM-Variante)"
        Prüfe, ob es eine ARM-Variante gibt:
        ```bash
        docker manifest inspect <image>
        ```
        Siehst du `arm64` in der Liste, zieh sie explizit:
        ```bash
        docker pull --platform linux/arm64 <image>
        ```
        Gibt es keine ARM-Variante → bei der Emulation bleiben oder ein anderes Image suchen.

??? warning "Container extrem langsam auf Apple Silicon"
    **Mögliche Ursachen:**

    1. **x86_64-Image emuliert.** Siehe Eintrag oben.
    2. **Rosetta-Integration nicht aktiviert.** Docker Desktop → Settings → General → „Use Rosetta for x86_64/amd64 emulation on Apple Silicon" anhaken.
    3. **VirtioFS-Performance bei Bind Mounts.** Docker Desktop → Settings → General → „Choose file sharing implementation" → VirtioFS wählen (ist mittlerweile Default, aber auf alten Installationen manchmal noch `gRPC FUSE`).
    4. **Zu wenig Ressourcen** für die Docker-Desktop-VM. Settings → Resources → RAM auf 4–6 GB, CPUs auf 4.

??? info "Welche Images haben ARM-Support?"
    Die meisten offiziellen Images (nginx, httpd, python, node, postgres, redis) haben ARM-Varianten. Docker Hub zeigt das in der Image-Übersicht an.

    Bei kleineren Community-Images fehlt ARM häufiger. Dann gilt: emulieren (langsamer) oder ein Alternative-Image wählen.

---

## Bauen und Cache

??? warning "`COPY`: „no such file or directory"
    **Symptom:**
    ```text
    ERROR: failed to solve: failed to compute cache key: "/app.py" not found
    ```

    **Ursache:** Die Datei liegt **nicht** im Build-Kontext, oder eine `.dockerignore` schließt sie aus.

    **Lösung Schritt für Schritt:**

    1. `ls -la` im Build-Ordner – liegt die Datei wirklich da?
    2. `cat .dockerignore` – wird die Datei dort gelistet?
    3. `docker build -t foo .` **muss aus dem Ordner aufgerufen werden, der die Datei UND das `Dockerfile` enthält**. Der Punkt am Ende ist der Build-Kontext.

??? warning "Änderungen im `Dockerfile` zeigen keine Wirkung"
    **Ursache:** Docker-Build-Cache findet, dass sich „effektiv" nichts geändert hat, und nimmt alte Layer aus dem Cache.

    **Lösung – Cache-Ignorieren erzwingen:**

    ```bash
    docker build --no-cache -t mein-bild .
    ```

    Dauert länger, aber garantiert frisch.

    **Prävention:** Reihenfolge im Dockerfile so bauen, dass **selten geänderte Dinge** (Abhängigkeiten) **vor** **oft geänderten Dingen** (dein Code) stehen:

    ```dockerfile
    COPY requirements.txt .      # selten geändert – Layer wird gecached
    RUN pip install -r requirements.txt
    COPY app.py .                # oft geändert – nur dieser Layer wird neu gebaut
    ```

??? warning "Alter Container nutzt neues Image nicht"
    **Symptom:** Du baust neu, aber der Container zeigt altes Verhalten.

    **Ursache:** Der laufende Container basiert auf dem **alten** Image, das noch mit dem alten Namen verknüpft war. Neues Image unter gleichem Namen ersetzt nicht magisch laufende Container.

    **Lösung:**

    ```bash
    docker stop mein-web && docker rm mein-web
    docker build -t mein-bild .
    docker run -d --name mein-web -p 9000:80 mein-bild
    ```

??? info "Dangling Images aufräumen"
    **Symptom:** `docker images` zeigt viele Einträge mit `<none>:<none>`.

    **Ursache:** Ältere Image-Versionen, die nach einem Rebuild verwaist sind – ihr Tag wurde auf die neue Version umgebogen. Sie belegen weiter Platz.

    **Lösung:**

    ```bash
    docker image prune
    ```

    Räumt genau diese `<none>`-Einträge weg, ohne noch gebrauchte Images zu löschen.

---

## Platte voll / Aufräumen

??? danger "`no space left on device`"
    **Symptom:**
    ```text
    docker: Error response from daemon: ... no space left on device.
    ```

    **Ursache:** Docker hat die Platte vollgeschrieben – Images, gestoppte Container, ungenutzte Volumes und Netzwerke summieren sich.

    **Lösung – Eskalations­stufen:**

    === "Stufe 1 – milde"
        ```bash
        docker system df              # was belegt wie viel?
        docker container prune        # alle gestoppten Container weg
        docker image prune            # dangling Images weg
        ```

    === "Stufe 2 – mittel"
        ```bash
        docker image prune -a         # auch alle unbenutzten Images
        docker volume prune           # verwaiste Volumes
        docker network prune          # ungenutzte Netzwerke
        ```

    === "Stufe 3 – aggressiv"
        ```bash
        docker system prune -a --volumes
        ```

        Fragt nach Bestätigung, löscht dann alles, was nicht aktiv genutzt wird.

        !!! warning "Achtung: auch Datenbank-Volumes"
            Mit `--volumes` gehen auch persistente Volumes weg. Wenn du da Datenbank-Daten drin hast, **sind die weg**.

??? warning "Docker Desktop-VM selbst ist zu groß (macOS)"
    **Symptom:** Die Docker-Desktop-VM-Datei auf dem Mac wird extrem groß.

    **Pfad der VM:** `~/Library/Containers/com.docker.docker/Data/vms/0/data/Docker.raw`

    **Lösung:**

    1. `docker system prune -a --volumes` innerhalb von Docker.
    2. Docker Desktop → Troubleshoot → „Clean / Purge data".
    3. Radikal: In Docker Desktop die „Disk image location" verschieben oder die Datei löschen und Docker Desktop neu initialisieren.

---

## Permissions

??? danger "Linux: `docker: permission denied while trying to connect`"
    **Ursache:** Dein User ist nicht in der `docker`-Gruppe.

    **Lösung:**
    ```bash
    sudo usermod -aG docker $USER
    newgrp docker
    # oder: ab- und wieder anmelden
    ```

    **Was macht `newgrp docker` genau?** Es eröffnet eine neue Shell, in der die frisch hinzugefügte Gruppe aktiv ist. Nur in **dieser** Shell – andere Terminals brauchen einen Neu-Login.

    **Sauberster Weg:** einmal komplett ausloggen und wieder einloggen. Danach aktiv in allen Terminals.

    **Check, ob es geklappt hat:**
    ```bash
    id -Gn        # listet deine Gruppen
    # oder:
    groups
    ```
    Unter den Gruppen sollte `docker` erscheinen.

    !!! warning "Sicherheits­hinweis"
        Mitglieder der `docker`-Gruppe können mit einem Container den ganzen Host mounten und damit effektiv Root werden. Für Entwickler­rechner okay, in Multi-User-Systemen eine Entscheidung, die dokumentiert werden sollte. Alternative: **Rootless Docker** (siehe <https://docs.docker.com/engine/security/rootless/>) oder **Podman** (läuft ohne Daemon und ohne `docker`-Gruppe).

??? danger "Linux (Fedora/RHEL/Rocky/Alma): `permission denied` beim Bind Mount"
    **Symptom:** Dein Container crasht beim Start oder kann Dateien aus dem Mount nicht lesen – obwohl die Datei-Permissions offensichtlich passen.

    **Ursache:** **SELinux** ist aktiv und blockiert den Zugriff des Containers auf Host-Pfade.

    **Diagnose:**
    ```bash
    getenforce    # Enforcing / Permissive / Disabled
    ```
    Wenn `Enforcing` und du hast einen Bind Mount: fast immer SELinux.

    **Lösung:** Mount-Pfad mit `:z` (geteilter Zugriff) oder `:Z` (privat) markieren:
    ```bash
    docker run -v $(pwd)/data:/app/data:z meine-app
    ```

    Bei Compose:
    ```yaml
    volumes:
      - ./data:/app/data:z
    ```

    SELinux-Regeln permanent ändern (wenn du es besser verstehst):
    ```bash
    sudo chcon -Rt svirt_sandbox_file_t ./data
    ```

??? info "Welche cgroups-Version nutzt mein System?"
    Ab **Fedora 31+**, **Ubuntu 21.10+**, **Debian 11+** ist **cgroups v2** Default. Docker ab Version 20.10 funktioniert auf beiden Varianten, aber manche Docker-Flags (besonders Ressourcen-Limits) verhalten sich leicht anders.

    **Version prüfen:**
    ```bash
    stat -fc %T /sys/fs/cgroup/
    # "cgroup2fs" = cgroups v2
    # "tmpfs"     = cgroups v1
    ```

    **Zurück auf v1 wechseln** (nur falls nötig, z.B. für ältere Docker-Versionen oder Kubernetes-Tools):
    - **GRUB** anpassen in `/etc/default/grub`:
      ```
      GRUB_CMDLINE_LINUX="... systemd.unified_cgroup_hierarchy=0"
      ```
    - Danach: `sudo update-grub && sudo reboot`

??? info "Ubuntu/Debian: AppArmor – meist unauffällig, selten ein Problem"
    **AppArmor** ist auf Ubuntu und Debian aktiv und begrenzt, was ein Prozess tun darf. Docker bringt sein eigenes AppArmor-Profil mit – im Regelfall transparent.

    **Wenn doch mal**: `dmesg | grep apparmor` zeigt, ob AppArmor etwas blockiert hat.

    Für einen einzelnen Container den Profil-Check deaktivieren (nur zum Debuggen!):
    ```bash
    docker run --security-opt apparmor=unconfined meine-app
    ```

    **Nicht in Produktion**: AppArmor ist dein Sicherheits­netz.

??? warning "Volume-Mount: „permission denied" innerhalb des Containers"
    **Ursache:** Der User im Container hat nicht die Rechte für den gemounteten Host-Pfad. Oft ist der Container-User `root` und der Host-Pfad gehört einem normalen User.

    **Lösung Varianten:**

    1. Mit `-u $(id -u):$(id -g)` den Container als deinen Host-User starten:
       ```bash
       docker run --rm -u $(id -u):$(id -g) -v $(pwd):/app my-image
       ```
    2. Im Dockerfile einen unprivilegierten User anlegen und mit `USER` wechseln.
    3. Pfad-Besitzer oder -Rechte anpassen (schnelle Lösung, aber nicht immer sauber):
       ```bash
       chmod -R 777 ./verzeichnis   # nur als letzter Ausweg
       ```

---

## Netzwerk

??? warning "Container hat kein Internet"
    **Symptom:** Im Container geht `ping google.com` nicht, `apt update` hängt.

    **Ursachen und Lösungen:**

    1. **DNS-Problem** – oft bei Firmennetzen mit speziellen DNS-Servern:
       ```bash
       docker run --dns 8.8.8.8 <image>
       ```
    2. **Proxy** – Docker Desktop → Settings → Resources → Proxies eintragen.
    3. **VPN auf dem Host** zerschießt das Docker-Netzwerk:
       - VPN kurz trennen und testen.
       - Falls das hilft: VPN-Software updaten oder Routen-Konfig prüfen.
    4. **Kaputtes Docker-Netzwerk** – Aufräumen und Docker-Desktop neu starten:
       ```bash
       docker network prune
       ```

??? info "Mehrere Container untereinander verbinden"
    **Kurzfassung:** In einem gemeinsamen Netzwerk starten.

    ```bash
    docker network create mein-netz
    docker run -d --name db --network mein-netz postgres
    docker run -d --name web --network mein-netz -p 8080:80 meine-app
    ```

    Innerhalb von `mein-netz` können sich die Container mit ihren Namen ansprechen (`db`, `web`). Das ist der manuelle Weg – `docker compose` macht das später komfortabler.

---

## Logs

??? info "Logs nur die letzten Zeilen zeigen"
    ```bash
    docker logs --tail 100 <name>
    docker logs -f --tail 100 <name>     # live mitlesen
    docker logs --since 10m <name>       # nur die letzten 10 Minuten
    ```

??? warning "Container-Logs werden riesig und belegen Platte"
    **Ursache:** Docker schreibt per Default alle `stdout`/`stderr` eines Containers in eine JSON-Datei, ohne Limit.

    **Lösung je Container:**

    ```bash
    docker run -d \
      --log-opt max-size=10m \
      --log-opt max-file=3 \
      nginx
    ```

    Begrenzt auf 3 Dateien à 10 MB.

    **Lösung daemon­weit (Linux):** `/etc/docker/daemon.json`:

    ```json
    {
      "log-driver": "json-file",
      "log-opts": {
        "max-size": "10m",
        "max-file": "3"
      }
    }
    ```

    Danach Docker-Daemon neu starten.

---

## Wenn nichts hilft

??? info "Systematisches Vorgehen, wenn Docker „irgendwie kaputt" ist"
    1. **Docker Desktop neu starten** (Mac/Win) oder `sudo systemctl restart docker` (Linux).
    2. **Host-Rechner neu starten.** Überraschend oft heilend.
    3. **Docker-Desktop: Troubleshoot → Reset to factory defaults.** Radikal, aber funktioniert, wenn die lokale Docker-Konfig zerschossen ist.
    4. **Daemon-Logs prüfen:**
        - macOS: `~/Library/Containers/com.docker.docker/Data/log/vm/dockerd.log`
        - Linux: `journalctl -u docker --since "1 hour ago"`
        - Windows: Docker Desktop → Troubleshoot → View logs
    5. **Community:**
        - Docker Forums: <https://forums.docker.com>
        - Docker GitHub Issues: <https://github.com/docker/for-mac/issues> bzw. `/for-win`
        - Stack Overflow mit Tag `docker`

!!! tip "Bevor du aufgibst"
    Kopiere die **exakte Fehlermeldung** in eine Suche. Docker-Fehler sind meistens schon von anderen gemeldet und beantwortet worden.

---

## Prävention – Gute Gewohnheiten

!!! tip "Damit du selten hierher zurückmusst"
    - **Aktuelle Docker-Desktop-Version** verwenden. Viele Bugs sind in den neuesten Releases schon behoben.
    - **Regelmäßig aufräumen**, z.B. einmal im Monat `docker system prune -a`.
    - **Explizite Image-Versionen** in Produktion, `:latest` nur für Experimente.
    - **Ressourcen im Blick behalten** – `docker stats` zeigt live, wer wie viel verbraucht.
    - **Vernünftige Container-Namen** (`--name frontend`, nicht zufällig), dann findest du dich in `docker ps` wieder.
    - **Ein Einwurf-Container (`--rm`) ist dein Freund:**
       ```bash
       docker run --rm -it ubuntu bash
       ```
       Nach dem Beenden verschwindet der Container von selbst, kein Aufräumen nötig.
