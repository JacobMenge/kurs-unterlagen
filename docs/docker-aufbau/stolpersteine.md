---
title: "Stolpersteine Aufbau-Block"
description: "Typische Probleme rund um Volumes, Umgebungsvariablen, Netzwerke und den Multi-Container-Setup mit Postgres + Adminer."
---

# Stolpersteine Aufbau-Block

Diese Seite sammelt Probleme, die spezifisch für den Aufbau-Block sind – rund um Volumes, Umgebungsvariablen, Netzwerke und den heutigen Postgres+Adminer-Hands-on.

!!! info "Weitere Stolpersteine"
    - **Docker-Installation und Einstieg**: [Docker-Stolpersteine im Einführungs-Block](../docker/stolpersteine.md)
    - **Compose-spezifisches**: [Stolpersteine Compose](../docker-compose/stolpersteine.md) (nächster Kurstag)
    - **Image-Build-Probleme**: [Stolpersteine Profi-Block](../docker-profi/stolpersteine.md) (späterer Kurstag)

---

## Volumes & Persistenz

??? danger "Volume-Daten sind nach Container-Neustart weg"
    **Ursache 1:** Beim zweiten `docker run` wurde das Volume **nicht wieder gemountet**. Ohne `-v postgres-daten:/var/lib/postgresql/data` hat der neue Container keinen Zugriff auf die alten Daten.

    **Ursache 2:** Volume wurde aus Versehen mit `docker volume rm` oder `docker system prune --volumes` gelöscht.

    **Lösung:**
    - Check: `docker volume ls` – ist `postgres-daten` noch da?
    - Wenn ja, ist vermutlich einfach das `-v`-Flag beim Run vergessen worden. Container stoppen, mit `-v` neu starten.
    - Wenn nein, sind die Daten unwiederbringlich weg.

??? warning "„Volume is in use" beim `docker volume rm`"
    **Ursache:** Das Volume ist noch an einen Container gebunden (auch an einen gestoppten).

    **Lösung:**
    ```bash
    docker ps -a                      # find den Container
    docker rm <container-id>          # entfernen
    docker volume rm postgres-daten   # jetzt geht's
    ```

??? danger "„Permission denied" beim Schreiben ins Volume"
    **Ursache:** Der User im Container hat eine andere UID als der Volume-Eigentümer auf Host-Seite. Kommt besonders bei Bind Mounts vor.

    **Lösung (häufig):**

    === "macOS / Linux"
        ```bash
        docker run --rm -u $(id -u):$(id -g) -v $(pwd):/app meine-app
        ```

    === "Windows PowerShell"
        Auf Windows gibt es keine Unix-UID/GID am Host. Docker Desktop übersetzt Datei-Rechte automatisch. Wenn dein Container trotzdem unter einer bestimmten UID/GID laufen soll, leg einen User im Dockerfile an oder gib eine fixe Zahl mit:
        ```powershell
        docker run --rm -u 1000:1000 -v "${PWD}:/app" meine-app
        ```

    Oder im Dockerfile einen unprivilegierten User anlegen (wird im [Profi-Block](../docker-profi/dockerfile-best-practices.md) behandelt).

??? info "Wie sehe ich, wie viel Platz ein Volume belegt?"
    ```bash
    docker system df -v
    ```
    Zeigt Volumes mit Größe und referenzierenden Containern.

    Inhalt inspizieren (read-only, mit einem Wegwerf-Container):
    ```bash
    docker run --rm -v postgres-daten:/data alpine ls -la /data
    docker run --rm -v postgres-daten:/data alpine du -sh /data/*
    ```

---

## Umgebungsvariablen

??? danger "Postgres startet nicht – „database \"kursdaten\" does not exist""
    **Ursache:** Das `POSTGRES_DB=kursdaten` wird **nur beim allerersten Start** des Containers ausgewertet. Wenn das Volume schon von einer früheren Postgres-Installation belegt ist (mit anderer DB), wird die DB **nicht** automatisch angelegt.

    **Lösung:**
    - Mit dem vorhandenen DB-Namen arbeiten (siehe frühere Installation).
    - ODER: Volume leeren und neu starten:
      ```bash
      docker volume rm postgres-daten
      docker volume create postgres-daten
      docker run -d --name db ... postgres:16
      ```
      **Achtung:** damit sind frühere Daten weg.

??? warning "Variable wird nicht gesetzt, Wert ist leer"
    **Häufige Ursachen:**

    1. **Falsche Schreibweise** – ENV-Variablen sind case-sensitiv. `POSTGRES_USER` ≠ `postgres_user`.
    2. **Anführungszeichen** werden in `-e`- Werten wörtlich genommen:
       ```bash
       -e POSTGRES_PASSWORD="geheim"   # Wert ist "geheim", MIT Anführungszeichen
       -e POSTGRES_PASSWORD=geheim     # Wert ist geheim, ohne
       ```

??? info "Ich will das Passwort nicht in der Shell-History sehen"
    Statt direkt zu tippen, kannst du die Variable in der Shell ohne History setzen und dann nur den Namen an Docker geben:

    === "macOS / Linux"
        ```bash
        read -s POSTGRES_PASSWORD          # Passwort eingeben, wird nicht geechot
        export POSTGRES_PASSWORD
        docker run -d --name db -e POSTGRES_PASSWORD ... postgres:16
        ```

    === "Windows PowerShell"
        ```powershell
        $secure = Read-Host "Passwort" -AsSecureString
        $env:POSTGRES_PASSWORD = [System.Net.NetworkCredential]::new("", $secure).Password
        docker run -d --name db -e POSTGRES_PASSWORD ... postgres:16
        ```

    Oder eine `.env`-Datei nutzen (siehe [Umgebungsvariablen](umgebungsvariablen.md)).

??? danger "Secret ist in Git gelandet"
    Siehe [Umgebungsvariablen → Secret ist in Git](umgebungsvariablen.md). Kurz:

    1. **Secret sofort rotieren** – neues Passwort / Key setzen, altes deaktivieren.
    2. Git-History bereinigen mit `git-filter-repo` oder BFG Repo-Cleaner.
    3. Ein in öffentlichem Repo geleaktes Secret gilt als **kompromittiert**. Rotation ist die einzige saubere Lösung.

---

## Netzwerke

??? danger "Adminer findet Postgres nicht"
    **Ursache (fast immer):** Beide Container sind nicht im selben User-Defined Netzwerk. Im Default-Bridge (ohne `--network`) gibt es **kein DNS** – der Name `db` wird nicht aufgelöst.

    **Diagnose:**
    ```bash
    docker network inspect kurs-netz
    ```
    Beide Container müssen unter „Containers" auftauchen.

    **Lösung:**
    ```bash
    docker network connect kurs-netz db
    docker network connect kurs-netz adminer
    ```
    Oder beide Container mit `--network kurs-netz` neu starten.

??? danger "Adminer: „could not translate host name \"db\""
    **Ursache:** DNS im Netzwerk funktioniert nicht. Typischerweise, weil einer der Container im Default-Bridge hängt statt im User-Defined-Netz.

    **Quick-Check:**
    ```bash
    docker exec adminer ping -c 3 db
    ```
    Geht das Ping durch? Wenn nein → beide Container müssen im selben User-Defined-Netzwerk sein.

??? warning "Port 8080 ist schon belegt"
    **Symptom:**
    ```text
    Bind for 0.0.0.0:8080 failed: port is already allocated
    ```

    **Diagnose:**

    === "macOS / Linux"
        ```bash
        lsof -i :8080
        ```

    === "Windows"
        ```powershell
        netstat -ano | findstr :8080
        ```

    **Lösungen:**
    - Anderer Host-Port: `-p 8081:8080`
    - Oder den Blockierer beenden.

??? warning "Netzwerk lässt sich nicht löschen"
    ```text
    Error response from daemon: error while removing network: network kurs-netz has active endpoints
    ```

    **Ursache:** Noch ein Container hängt dran.

    **Lösung:**
    ```bash
    docker network inspect kurs-netz  # welche Container?
    docker stop <names>
    docker rm <names>
    docker network rm kurs-netz
    ```

??? info "Zwei Container sollen auf denselben Ports hören"
    Mehrere Postgres-Instanzen auf Port 5432? Im selben Netzwerk geht das sauber – **intern** hat jeder Container seinen eigenen Port 5432. Problem entsteht nur, wenn beide per `-p 5432:5432` nach **außen** gemappt werden. Dann konflikt auf dem Host-Port.

    Lösung: nur einen Container per `-p` freigeben, oder unterschiedliche Host-Ports wählen:
    ```bash
    docker run -p 5432:5432 --name db1 postgres:16
    docker run -p 5433:5432 --name db2 postgres:16
    ```

??? info "`localhost` vom App-Container zum Host-Dienst"
    Wenn ein Container einen Dienst **auf dem Host** (nicht in einem anderen Container) erreichen will, ist `localhost` nicht der Host – sondern der Container selbst.

    **Docker Desktop auf macOS und Windows:**
    `host.docker.internal` funktioniert direkt. Docker Desktop richtet den DNS-Eintrag automatisch ein.
    ```bash
    docker run --rm alpine ping -c 2 host.docker.internal
    ```

    **Docker Engine auf Linux:**
    Kein automatisches `host.docker.internal` – du musst es explizit freischalten. Zwei Wege:

    1. **Per `--add-host`** beim `docker run`:
       ```bash
       docker run --add-host=host.docker.internal:host-gateway meine-app
       ```
    2. **In Compose**:
       ```yaml
       services:
         app:
           extra_hosts:
             - "host.docker.internal:host-gateway"
       ```

    **Achtung:** `host-gateway` funktioniert nur mit Docker ≥ 20.10 **und** einem Linux-Host mit passenden Netzwerk-Plugins (`netfilter`). Bei exotischen Setups (rootless Docker, Podman) klappt es manchmal nicht. Fallback: die tatsächliche Host-IP im Bridge-Netzwerk verwenden:
    ```bash
    docker network inspect bridge | grep Gateway
    # meist 172.17.0.1
    ```

??? warning "Bind-Mount-Performance schlechter als erwartet (macOS)"
    **Symptom:** Dein Projekt mit `node_modules` oder einem großen `vendor`-Ordner läuft im Container fünfmal langsamer als „nativ".

    **Ursache:** Docker Desktop auf macOS muss Dateizugriffe aus der internen Linux-VM zu macOS übersetzen. Bei vielen kleinen Dateien spürbar.

    **Lösungen:**

    1. **VirtioFS sicherstellen** (Docker Desktop → Settings → General → File sharing implementation). Inzwischen Default, aber alte Installationen haben manchmal noch gRPC FUSE.
    2. **Nur das Nötigste mounten** – nicht `$HOME`, nicht den ganzen Projektstand samt `node_modules`.
    3. **Ausgewählte Ordner als Named Volume** statt Bind Mount behandeln:
       ```yaml
       volumes:
         - .:/app
         - /app/node_modules   # anonymes Volume verdeckt den Bind-Mount
       ```
       `node_modules` lebt dann in einem Volume (schnell), dein Code kommt über Bind Mount rein (langsam, aber klein).
    4. **Für wirklich große Setups:** Projekt-Verzeichnis komplett als Volume kopieren, Bind Mount nur für aktive Entwicklung zuschalten.

    Auf **Linux** ist das nicht relevant – Bind Mounts sind dort direkt am Host-Dateisystem, ohne Übersetzungs­schicht.

---

## Postgres-spezifisch

??? danger "Postgres-Container crasht sofort: „PANIC: database files are incompatible with server""
    **Ursache:** Das Volume enthält Daten einer **anderen Postgres-Major-Version** (z.B. Postgres 15), aber du startest mit Postgres 16. Inkompatibel.

    **Lösungen:**
    - **Zurück zur alten Version:** `postgres:15` statt `:16` nehmen, dann Upgrade-Pfad offiziell durchgehen.
    - **Neu anfangen (Daten weg):**
      ```bash
      docker volume rm postgres-daten
      docker volume create postgres-daten
      ```

??? warning "Postgres gibt „FATAL: password authentication failed""
    **Ursachen:**
    1. Passwort im `-e POSTGRES_PASSWORD=...` stimmt nicht mit dem überein, das in Adminer eingegeben wurde.
    2. Das Volume ist von einer **früheren** Installation, die ein anderes Passwort gespeichert hat. `POSTGRES_PASSWORD` greift nur beim allerersten Start.

    **Lösung:**
    - Check das Passwort, das du wirklich mit `-e` gesetzt hast.
    - Oder Volume zurücksetzen (siehe oben – Daten weg!).

---

## Allgemein

??? info "Mein Laptop läuft heiß nach der Praxis"
    Postgres und Adminer laufen und verbrauchen Ressourcen. Nach dem Kurs:
    ```bash
    docker stop adminer db
    docker rm adminer db
    ```
    Oder radikaler – alle laufenden Container auf einmal stoppen:

    === "macOS / Linux"
        ```bash
        docker ps -q | xargs docker stop
        ```

    === "Windows PowerShell"
        ```powershell
        docker ps -q | ForEach-Object { docker stop $_ }
        ```

    === "Windows CMD"
        ```cmd
        for /f "tokens=*" %i in ('docker ps -q') do docker stop %i
        ```

??? info "Ich will alle Docker-Reste aus diesem Kurs loswerden"
    ```bash
    docker stop adminer db 2>/dev/null
    docker rm adminer db 2>/dev/null
    docker network rm kurs-netz 2>/dev/null
    docker volume rm postgres-daten 2>/dev/null
    ```

    Um auch die gezogenen Images loszuwerden:
    ```bash
    docker rmi postgres:16 adminer
    ```

??? info "Wenn alles auseinander­bricht – Reset-Knopf"
    ```bash
    docker system prune -a --volumes
    ```
    Entfernt **alle** gestoppten Container, ungenutzten Images, Netzwerke und **Volumes**. Vorsicht mit dem `--volumes` – falls du Daten anderswo drin hast.

---

## Präventive Gewohnheiten

!!! tip "Damit du selten hierher zurück musst"
    - **Volumes immer explizit benennen**, nie anonym (`-v /var/lib/...`).
    - **Container vor Änderungen stoppen und entfernen**, statt hoffen, dass sie sich anpassen.
    - **Beim ersten Fehler Logs lesen**: `docker logs <container>` erzählt meist die ganze Geschichte.
    - **Netzwerk immer mit-denken**: Wenn zwei Container kommunizieren sollen, müssen sie ins **gleiche User-Defined-Netz**.
    - **Postgres-Majorversion nicht mittendrin wechseln** – entweder von Anfang an festlegen oder formales Upgrade durchführen.
