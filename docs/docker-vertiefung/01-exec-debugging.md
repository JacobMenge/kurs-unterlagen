---
title: "docker exec als Debug-Werkzeug"
description: "In laufenden Containern arbeiten: ENV prüfen, Konfig-Dateien lesen, Live-Änderungen testen, ohne den Container neu zu starten."
---

# Übung 1: `docker exec` als Debug-Werkzeug

!!! abstract "Was du in dieser Übung lernst"
    - Wie du **in einem laufenden Container** arbeitest, ohne ihn neu zu starten
    - Was du mit `docker exec` herausfindest, das `docker logs` dir nicht zeigt
    - Warum eine Shell im Container oft schneller ist als ein neuer Build
    - Den Unterschied zwischen `docker exec`, `docker run` und `docker attach`

**Aufwand:** ca. 15–20 Minuten.

---

## Worum geht's

Wenn ein Container läuft, möchtest du oft **nachschauen, was drin passiert**, ohne ihn zu zerstören:

- *Welche Umgebungsvariablen sind tatsächlich gesetzt?*
- *Wo liegt die Konfigdatei wirklich?*
- *Was steht in der Datei, die nginx ausliefert?*
- *Funktioniert die DNS-Auflösung im Container?*

`docker logs` zeigt dir nur, was der Container nach `stdout`/`stderr` schreibt. Für alles andere brauchst du `docker exec`. Das ist dein **Schweizer Taschenmesser**, sobald ein Container läuft.

!!! info "`exec`, `run` und `attach` im Vergleich"
    - `docker run` erzeugt einen **neuen** Container aus einem Image und startet ihn.
    - `docker exec` startet einen **zusätzlichen Prozess** in einem Container, der schon läuft. Beendest du diesen Prozess, läuft der Container weiter.
    - `docker attach` verbindet dein Terminal mit dem **Hauptprozess** des Containers. Drückst du dort Strg+C, beendest du im Zweifel den Hauptprozess und damit den ganzen Container. Zum Debuggen ist deshalb `exec` die bessere Wahl.

---

## Anleitung

### Schritt 1: Demo-Container starten

Wir nehmen einen einfachen nginx, geben ihm eine Umgebungsvariable mit ([`-e` erklärt](../docker-aufbau/umgebungsvariablen.md#1-e-beim-docker-run)) und lassen ihn im Hintergrund laufen.

```bash
docker run -d --name debug-demo -e GREETING="Hallo aus Container" nginx:alpine
```

Erwartet: eine Container-ID. Mit `docker ps` siehst du `debug-demo` als `Up`.

### Schritt 2: ENV-Variablen im Container prüfen

```bash
docker exec debug-demo env
```

Du siehst alle Umgebungsvariablen, die im Container aktiv sind. Filtere nach deinem `GREETING`:

=== "macOS / Linux"
    ```bash
    docker exec debug-demo env | grep GREETING
    ```

=== "Windows PowerShell"
    ```powershell
    docker exec debug-demo env | Select-String "GREETING"
    ```

=== "Windows CMD"
    ```cmd
    docker exec debug-demo env | findstr GREETING
    ```

Erwartet:

```text
GREETING=Hallo aus Container
```

**Was du daraus lernst:** Wenn deine App glaubt, eine Variable sei nicht gesetzt, prüfe so: ist sie im Container überhaupt angekommen?

### Schritt 3: Welcher User läuft im Container?

```bash
docker exec debug-demo id
```

Erwartet: eine Zeile, die mit `uid=0(root) gid=0(root)` beginnt. `docker exec` läuft als root, weil das nginx-Image keinen `USER` setzt. Der nginx-Masterprozess läuft ebenfalls als root, die Worker-Prozesse als User `nginx`. Für eigene Produktionsimages lernst du im Profi-Block, wie du das änderst ([USER-Direktive](../docker-profi/dockerfile-best-practices.md#4-user-nicht-mehr-als-root)).

### Schritt 4: Konfig-Dateien finden und lesen

Wo liegen nginx' Konfig-Dateien?

```bash
docker exec debug-demo ls /etc/nginx/conf.d/
```

Erwartet: `default.conf`. Inhalt anschauen:

```bash
docker exec debug-demo head -10 /etc/nginx/conf.d/default.conf
```

Dort siehst du `listen 80;` und `root /usr/share/nginx/html;`, die typische nginx-Default-Config. `head` läuft hier im Container, deshalb klappt der Befehl auch unter Windows.

### Schritt 5: Eine interaktive Shell holen

Für mehr als ein, zwei Befehle ist eine richtige Shell bequemer:

```bash
docker exec -it debug-demo sh
```

| Flag | Bedeutung |
|------|-----------|
| `-i` | interaktiv, `stdin` bleibt offen |
| `-t` | TTY, also Terminal-Emulation, nötig für Prompts und Cursor |
| `sh` | die Shell, die wir starten (Alpine hat kein bash) |

Du landest mit dem Prompt `/ #`. Probiere:

```sh
hostname
whoami
ls /usr/share/nginx/html
exit
```

`exit` bringt dich zurück zum Host-Terminal. Der Container läuft weiter.

### Schritt 6: Eine Live-Änderung machen

`docker exec` ist auch nützlich für **temporäre Änderungen**, ohne ein neues Image zu bauen. Der Befehl ist auf allen Systemen gleich:

```bash
docker exec debug-demo sh -c "echo '<h1>Geaendert per docker exec</h1>' > /usr/share/nginx/html/index.html"
```

Außen stehen doppelte, innen einfache Anführungszeichen. So funktioniert der Befehl in bash, PowerShell und CMD gleichermaßen.

!!! warning "Wichtig: `sh -c "..."` umschließen"
    Würdest du nur

    ```bash
    docker exec debug-demo echo "Test" > /pfad/datei
    ```

    schreiben, wertet **deine Host-Shell** das `>` aus. Die Datei landet dann auf dem **Host**, nicht im Container. Mit `sh -c "..."` läuft die ganze Befehlszeile **im Container**.

Im Browser auf <http://localhost> aufrufen … oh, der Container hat aber kein `-p`-Mapping. Wir nutzen einen **zweiten Container**, um die Änderung zu testen:

```bash
docker run --rm --network container:debug-demo curlimages/curl:latest http://localhost/
```

Erwartet: deine geänderte HTML-Zeile in der Antwort.

??? info "Was bedeutet `--network container:debug-demo`?"
    Statt ein eigenes Netzwerk zu benutzen, **teilt** der Curl-Container den **Netzwerk-Stack** des `debug-demo`-Containers. `localhost` zeigt damit auf nginx im selben Network-Namespace. Praktisch für Mini-Tests, ohne ein eigenes Netzwerk anzulegen.

### Schritt 7: Aufräumen

```bash
docker rm -f debug-demo
```

---

## Übung: Selber machen

!!! info "Aufgabe"
    Starte einen Postgres-Container und nutze `docker exec`, um ohne Adminer und ohne Host-Tools nachzuweisen, dass die Datenbank funktioniert.

**Vorgaben:**

- Containername: `pg-debug`
- Image: `postgres:16-alpine`
- Passwort: `geheim`
- Datenbank: `kursdb`

**Was du herausfinden sollst, jeweils per `docker exec`:**

1. **Welche Postgres-Version** läuft im Container? (Tipp: `psql --version`)
2. **Welche Datenbanken** existieren? (Tipp: `psql -U postgres -c "\l"`)
3. **Welcher User** ist beim `psql`-Aufruf aktiv?
4. **Welche Umgebungsvariablen** sind im Container gesetzt, die mit `POSTGRES_` beginnen?

??? success "Musterlösung (erst selbst probieren!)"

    Container starten:

    ```bash
    docker run -d --name pg-debug -e POSTGRES_PASSWORD=geheim -e POSTGRES_DB=kursdb postgres:16-alpine
    ```

    Postgres braucht beim ersten Start einige Sekunden für die Einrichtung. Schau mit `docker logs pg-debug` nach, bis die Zeile `PostgreSQL init process complete; ready for start up.` erscheint. Vorher fehlt `kursdb` unter Umständen noch in der Liste.

    ```bash
    docker logs pg-debug
    ```

    1) Postgres-Version:

    ```bash
    docker exec pg-debug psql --version
    ```

    2) Datenbanken auflisten:

    ```bash
    docker exec pg-debug psql -U postgres -c "\l"
    ```

    3) Aktueller User in psql:

    ```bash
    docker exec pg-debug psql -U postgres -c "SELECT current_user;"
    ```

    4) Postgres-relevante ENVs:

    === "macOS / Linux"
        ```bash
        docker exec pg-debug env | grep POSTGRES
        ```

    === "Windows PowerShell"
        ```powershell
        docker exec pg-debug env | Select-String "POSTGRES"
        ```

    === "Windows CMD"
        ```cmd
        docker exec pg-debug env | findstr POSTGRES
        ```

    Aufräumen:

    ```bash
    docker rm -f pg-debug
    ```

---

## Bonus

??? tip "Bonus 1: Eine Datei aus dem Container holen und zurückschreiben"
    Du brauchst eine Konfig-Datei aus dem Container? `docker cp` kopiert vom Container auf den Host:

    ```bash
    docker run -d --name nginx-tmp nginx:alpine
    docker cp nginx-tmp:/etc/nginx/nginx.conf ./nginx.conf
    ```

    Der gleiche Befehl in die andere Richtung kopiert vom Host in den Container. Wir legen die eben geholte Datei als Kopie in `/tmp` ab und prüfen, ob sie angekommen ist:

    ```bash
    docker cp ./nginx.conf nginx-tmp:/tmp/nginx.conf
    docker exec nginx-tmp ls -l /tmp/nginx.conf
    ```

    Aufräumen:

    ```bash
    docker rm -f nginx-tmp
    ```

??? tip "Bonus 2: Mehrere Container untersuchen"
    `docker ps -q` liefert alle laufenden Container-IDs. Mit einer Schleife kannst du den gleichen Befehl auf allen ausführen:

    === "macOS / Linux"
        ```bash
        docker ps -q | xargs -I{} docker exec {} hostname
        ```

    === "Windows PowerShell"
        ```powershell
        docker ps -q | ForEach-Object { docker exec $_ hostname }
        ```

    === "Windows CMD"
        ```cmd
        for /f %i in ('docker ps -q') do docker exec %i hostname
        ```

    Du siehst pro Container den Hostnamen. Für eine schnelle Übersicht, wer wer ist.

---

## Was du danach kannst

- In **laufenden Containern** arbeiten, ohne sie neu zu starten.
- Den Unterschied zwischen *"Variable wurde an Docker übergeben"* und *"Variable ist im Container aktiv"* prüfen.
- Konfig-Dateien aus dem Container lesen oder ersetzen.
- Wegwerf-Container für Mini-Tests starten (`docker run --rm`).

---

## Weiter

- [Übung 2: Volume-Backup und Restore](02-volumes-backup.md)
- Zurück zur [Übersicht](index.md)
