---
title: "Hilfekarten"
description: "Abgestufte Hinweise – nutzt sie nur, wenn ihr feststeckt. Erst denken, dann klicken."
---

# Hilfekarten

!!! tip "Spielregel"
    Nutzt diese Hilfekarten **nur**, wenn ihr feststeckt. Erst selbst überlegen, in den Logs schauen, im Team diskutieren – **dann** aufklappen.

Jede Karte ist eine aufklappbare Box. Innen steht der Hinweis.

---

## Hilfekarte 1 – Containerstatus prüfen

??? info "Aufklappen"
    Wenn etwas nicht läuft, ist die erste Frage immer: **Läuft der Container überhaupt?**

    ```bash
    docker ps         # nur laufende
    docker ps -a      # auch beendete – wichtig, wenn ein Container gecrasht ist
    ```

    Wenn der Container in `docker ps -a` mit `Exited (1)` auftaucht, ist er gecrasht. Logs anschauen:
    ```bash
    docker logs <name>
    ```

---

## Hilfekarte 2 – Logs lesen

??? info "Aufklappen"
    ```bash
    docker logs quest-api
    docker logs quest-db
    docker logs quest-adminer
    ```

    Mit `-f` live folgen:
    ```bash
    docker logs -f quest-api
    ```

    **Frage an euch:** Was ist die **erste konkrete Fehlermeldung** im Log? Nicht der Stack-Trace darunter – die erste Zeile, die einen Fehler beschreibt. Dort liegt fast immer die Ursache.

---

## Hilfekarte 3 – Netzwerk prüfen

??? info "Aufklappen"
    ```bash
    docker network ls
    docker network inspect quest-net
    ```

    Im Output von `inspect` siehst du im JSON-Block `Containers` alle Container, die im Netzwerk hängen.

    **Frage:** Sind API **und** Datenbank im selben Netzwerk?

---

## Hilfekarte 4 – Die `localhost`-Falle

??? info "Aufklappen"
    Wenn die API im Container läuft, bedeutet `localhost` **nicht** euren Rechner und **nicht** automatisch die Datenbank.

    Aus Sicht des API-Containers ist `localhost` **der API-Container selbst**.

    Für die Verbindung zur Datenbank soll die API den **Containernamen** nutzen:

    ```text
    quest-db
    ```

    Deshalb muss `PGHOST` so aussehen:
    ```text
    PGHOST=quest-db
    ```

    **Nicht:** `PGHOST=localhost`. Das ist die häufigste Fehlerquelle.

---

## Hilfekarte 5 – Port-Mapping verstehen

??? info "Aufklappen"
    ```text
    -p 3000:3000
    ```

    Bedeutung:
    ```text
    localhost:3000 auf eurem Rechner  →  Port 3000 im Container
    ```

    Wenn der **linke** Port geändert wird:
    ```text
    -p 3001:3000
    ```

    Dann ist die App auf eurem Rechner erreichbar unter:
    ```text
    http://localhost:3001
    ```

    Im Container läuft sie weiterhin auf Port 3000. Wichtig: Diese Änderung erfordert auch, dass ihr im Browser den **neuen** Host-Port aufruft.

---

## Hilfekarte 6 – Alte Container entfernen

??? info "Aufklappen"
    Wenn ein Containername schon existiert (Fehler: `The container name "/quest-api" is already in use`):

    ```bash
    docker rm -f quest-api
    ```

    `-f` erzwingt auch das Stoppen, falls der Container noch läuft. Danach kann der Container neu erstellt werden.

---

## Hilfekarte 7 – Volume prüfen

??? info "Aufklappen"
    ```bash
    docker volume ls
    docker volume inspect quest-pg-data
    ```

    !!! danger "Achtung"
        Das Volume darf **nicht** gelöscht werden, wenn die Daten erhalten bleiben sollen. `docker volume rm quest-pg-data` löscht **alles**.

    Wenn ihr nur die Container neu starten wollt, ohne Daten zu verlieren: Volume **nicht** anfassen, nur den Container `rm` und mit `-v quest-pg-data:/var/lib/postgresql/data` neu starten.

---

## Hilfekarte 8 – API-Image neu bauen

??? info "Aufklappen"
    Wenn ihr am Code etwas geändert habt (oder das Image kaputt ist):

    ```bash
    cd apps/docker-escape-room
    docker build -t container-quest-api:1.0 .
    ```

    Danach den **alten** Container entfernen und neu starten:
    ```bash
    docker rm -f quest-api
    docker run --name quest-api ... container-quest-api:1.0
    ```

    Der Punkt am Ende von `docker build .` ist der Build-Kontext-Pfad – nicht vergessen!

---

## Hilfekarte 9 – API erreicht Datenbank nicht

??? info "Aufklappen"
    Typische Ursachen, in der Reihenfolge der Wahrscheinlichkeit:

    1. **`PGHOST` ist falsch gesetzt** (z.B. `localhost` statt `quest-db`).
    2. **API ist nicht im Netzwerk `quest-net`** (vergessen `--network quest-net` zu setzen).
    3. **DB läuft nicht / ist gecrasht** (`docker logs quest-db` checken).
    4. **DB-Container hat anderen Namen** als die API erwartet.

    Diagnose:
    ```bash
    docker logs quest-api
    docker inspect quest-api
    docker network inspect quest-net
    ```

    Im `network inspect` siehst du, welche Container im Netzwerk sind. Im `inspect quest-api` siehst du unter `Env` die gesetzten Variablen.

    Tipp zum Live-Test (in einer Shell des API-Containers):
    ```bash
    docker exec -it quest-api sh
    # darin:
    nslookup quest-db   # sollte die Container-IP zurückgeben
    ```

    Wenn `nslookup` nicht funktioniert (kommt nicht in jedem Image vor), zeigt `getent hosts quest-db` dasselbe Ergebnis.

---

## Hilfekarte 10 – Port ist bereits belegt

??? info "Aufklappen"
    Fehler: `port is already allocated` oder `bind: address already in use`.

    **Ursache:** auf eurem Rechner läuft schon ein Dienst auf dem Host-Port.

    **Mögliche Lösungen:**

    1. Anderen Host-Port wählen:
       ```bash
       docker run ... -p 3001:3000 ...
       ```
       Dann ist die API erreichbar unter `http://localhost:3001`.

    2. Den blockierenden Prozess finden:

        === "macOS / Linux"
            ```bash
            lsof -i :3000
            ```

        === "Windows PowerShell"
            ```powershell
            netstat -ano | Select-String ":3000"
            ```

    3. Häufigste Ursache: ein **alter Container** (von einer früheren Übung) hängt noch auf dem Port. `docker ps` checken, ggf. `docker rm -f <name>`.

---

## Bonus-Hilfekarte: Sauberes Reset

??? warning "Aufklappen – nur wenn ihr alles neu starten wollt"
    Achtung: Der folgende Befehl **löscht** Container, Netzwerk und Volume dieser Übung. Daten in `quest-pg-data` sind danach **weg**.

    ```bash
    docker rm -f quest-api quest-db quest-adminer
    docker volume rm quest-pg-data
    docker network rm quest-net
    ```

    Falls einzelne Ressourcen nicht existieren, erscheinen Fehlermeldungen. Die sind unkritisch.
