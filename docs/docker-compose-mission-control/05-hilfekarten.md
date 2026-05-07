---
title: "Hilfekarten"
description: "Abgestufte Hinweise für Mission Control – nutzt sie nur, wenn ihr feststeckt."
---

# Hilfekarten

!!! tip "Spielregel"
    Nutzt diese Hilfekarten **nur**, wenn ihr feststeckt. Erst selbst überlegen, in den Logs schauen, im Team diskutieren – **dann** aufklappen.

Jede Karte ist eine aufklappbare Box. Innen steht der Hinweis.

---

## Hilfekarte 1 – Status der Services prüfen

??? info "Aufklappen"
    Wenn etwas nicht läuft, ist die erste Frage immer: **Laufen die Services überhaupt – und in welchem Zustand?**

    ```bash
    docker compose ps
    ```

    Spalten:

    - `STATE`: `running`, `exited`, `restarting`
    - `STATUS`: u.a. `Up`, `Up (healthy)`, `Up (unhealthy)`, `Exited (1)`
    - `PORTS`: was nach außen veröffentlicht ist

    Wenn ein Service nicht läuft oder im Restart-Loop ist: **Logs anschauen** (Hilfekarte 2).

---

## Hilfekarte 2 – Logs gezielt lesen

??? info "Aufklappen"
    ```bash
    docker compose logs              # alle Services, alle Logs
    docker compose logs backend      # nur ein Service
    docker compose logs -f backend   # live folgen (Ctrl+C zum Beenden)
    docker compose logs --tail 50 backend
    ```

    **Frage an euch:** Was ist die **erste konkrete Fehlermeldung** im Log? Nicht der Stack-Trace darunter – die erste Zeile, die den Fehler beschreibt. Dort liegt fast immer die Ursache.

    Häufige Backend-Logs in dieser Übung:

    | Log-Zeile | Bedeutung |
    |---|---|
    | `Database not ready (attempt N/30)` | Backend wartet auf DB – meist nach ein paar Sekunden gut |
    | `Database connection established.` | DB ist erreichbar |
    | `Listening on port 3000` | API ist bereit |
    | `getaddrinfo ENOTFOUND db` | `PGHOST` zeigt ins Leere – Service-Name oder Netzwerk falsch |
    | `connect ECONNREFUSED 127.0.0.1:5432` | klassische `localhost`-Falle, siehe Hilfekarte 5 |

---

## Hilfekarte 3 – `docker compose config` als Diagnose

??? info "Aufklappen"
    ```bash
    docker compose config
    ```

    Compose zeigt euch die fertig **aufgelöste** YAML, mit eingesetzten `${VARIABLEN}`.

    Damit erkennt ihr:

    - **YAML-Syntaxfehler** (mit Zeilenangabe)
    - **`${VAR}`-Werte**, die nicht gesetzt sind (stehen als `${VAR}` da statt mit echtem Wert)
    - **falsch eingerückte Schlüssel** (manche landen unter dem falschen Service)

    !!! tip "Nur Variablen prüfen"
        Wenn ihr nur sehen wollt, ob die `.env` korrekt geladen wird:

        === "macOS / Linux / Git Bash"
            ```bash
            docker compose config | grep POSTGRES
            ```

        === "Windows PowerShell"
            ```powershell
            docker compose config | Select-String POSTGRES
            ```

        === "Windows CMD"
            ```cmd
            docker compose config | findstr POSTGRES
            ```

---

## Hilfekarte 4 – `${VARIABLE}` wird nicht ersetzt

??? info "Aufklappen"
    Symptom: in `docker compose config` steht buchstäblich `${POSTGRES_USER}` statt `aurora`. Oder Compose meldet beim Start `the variable POSTGRES_USER is not set`.

    **Wahrscheinlichste Ursachen:**

    1. **`.env` liegt nicht im selben Ordner wie `compose.yaml`**.
    2. **`.env` heißt anders** (z.B. `env`, `dev.env`, `.env.local`).
    3. **Variable ist in `.env` falsch geschrieben** (Tippfehler im Namen).
    4. **In der `compose.yaml` falsch geschrieben** (`${POSTGRES_USR}` statt `${POSTGRES_USER}`).

    **Diagnose:**

    === "macOS / Linux / Git Bash"
        ```bash
        docker compose config | grep -i postgres
        ```

    === "Windows PowerShell"
        ```powershell
        docker compose config | Select-String -Pattern postgres -CaseSensitive:$false
        ```

    === "Windows CMD"
        ```cmd
        docker compose config | findstr /i postgres
        ```

    Wenn dort weiterhin `${...}` steht: Compose hat nichts zum Einsetzen gefunden. Variable in `.env` setzen oder Pfad/Dateinamen korrigieren.

    !!! tip "Eigene Env-Datei explizit angeben"
        ```bash
        docker compose --env-file .env up -d
        ```

---

## Hilfekarte 5 – Die `localhost`-Falle (zwischen Services)

??? info "Aufklappen"
    Wenn das Backend im Container läuft, bedeutet `localhost` **nicht** euren Rechner und **nicht** automatisch die Datenbank.

    Aus Sicht des Backend-Containers ist `localhost` **der Backend-Container selbst**.

    Für die Verbindung zur Datenbank soll das Backend den **Service-Namen** der DB nutzen:

    ```text
    PGHOST=db
    ```

    Auch in der `nginx.conf` des Frontends steht aus dem gleichen Grund:

    ```nginx
    proxy_pass http://backend:3000/api/;
    ```

    Und in Adminer steht im Server-Feld **`db`**, nicht `localhost`.

    **Faustregel:** Wenn zwei Container miteinander reden, ist `localhost` fast immer falsch. Service-Name nehmen.

---

## Hilfekarte 6 – Healthcheck schlägt fehl

??? info "Aufklappen"
    Symptom: `db` zeigt in `docker compose ps` dauerhaft `health: starting` oder `unhealthy`. Backend bleibt deshalb im `created`-Zustand und startet nicht.

    **Diagnose:**

    1. Healthcheck **manuell** ausprobieren:

        ```bash
        docker compose exec db pg_isready -U aurora -d auroradb
        ```

        Liefert `accepting connections`?

    2. Häufige Ursachen:

        - Falscher User: `pg_isready` ohne `-U` prüft den Default-User `postgres`. Wenn ihr `POSTGRES_USER=aurora` gesetzt habt, müsst ihr im Healthcheck `pg_isready -U aurora` schreiben.
        - `start_period` zu kurz: Bei frischem Volume kann die Initialisierung 10–20 Sekunden dauern.
        - Variable nicht im Container vorhanden: `$${POSTGRES_USER}` (mit doppeltem Dollar) ist Pflicht, damit nicht **Compose** die Variable beim Parsen ersetzt, sondern erst die Shell **im Container**.

    !!! tip "Healthcheck mit Defaults"
        Wenn ihr es ganz sicher haben wollt, könnt ihr die Werte direkt eintragen:

        ```yaml
        healthcheck:
          test: ["CMD-SHELL", "pg_isready -U aurora -d auroradb"]
          interval: 5s
          timeout: 3s
          retries: 10
          start_period: 10s
        ```

---

## Hilfekarte 7 – Build greift nicht / alte Version läuft

??? info "Aufklappen"
    Wenn ihr im Backend-Code (oder Dockerfile, oder `package.json`) etwas ändert und es kommt nicht im Container an: Compose hat nicht neu gebaut.

    **Lösungen, in der Reihenfolge:**

    ```bash
    docker compose up -d --build           # neu bauen + restarten
    docker compose build --no-cache backend # ohne Cache, harter Reset
    docker compose up -d
    ```

    Bei wirklich hartnäckigen Fällen das Image entfernen und neu pullen:

    ```bash
    docker compose down
    docker image rm <imagename>
    docker compose up -d --build
    ```

---

## Hilfekarte 8 – „password authentication failed for user …" (DB-Volume-Falle)

??? danger "Aufklappen – häufigste Ursache nach Mission 5"
    Symptom: das Backend protokolliert in einer Endlos-Schleife:

    ```text
    [backend] Database not ready (attempt N/30): password authentication failed for user "aurora"
    ...
    [backend] Startup failed: Database connection failed after multiple attempts.
    ```

    **Was passiert:**

    > Das offizielle `postgres`-Image liest `POSTGRES_USER`, `POSTGRES_PASSWORD` und `POSTGRES_DB` **nur beim allerersten Start eines frischen Volumes** ein. Beim zweiten Start ignoriert es diese Variablen komplett – die DB läuft mit User/Passwort, die beim allerersten Mal gesetzt wurden.

    **Typischer Auslöser:**

    - Ihr habt in Mission 1–4 hartkodierte Werte in der `compose.yaml` gehabt.
    - In Mission 5 habt ihr auf `.env` umgestellt, dabei aber einen Tippfehler im Variablen-Namen oder einen anderen Wert gewählt.
    - Oder: die `.env` lag nicht im richtigen Ordner → Compose hat eine leere Variable eingesetzt → Postgres-Image hat das Default-Passwort genommen → Backend kennt das nicht.

    Das alte Volume hat noch das alte Passwort, das Backend schickt das neue. **Zack: Auth-Loop.**

    **Lösung – Volume zurücksetzen:**

    ```bash
    docker compose down -v
    docker compose up -d --build
    ```

    Das `-v` löscht das benannte Volume, beim nächsten Start initialisiert sich Postgres frisch mit dem aktuellen `POSTGRES_PASSWORD` aus eurer `.env`. Init-SQL läuft auch wieder, ihr habt die sechs Beispiel-Module zurück.

    !!! danger "Achtung – `-v` löscht Daten"
        `docker compose down -v` löscht **alle** benannten Volumes dieses Compose-Projekts. Selbst angelegte Module sind danach weg.

    **Vorbeugung:**

    1. Vor `up` immer `docker compose config` aufrufen – stehen `POSTGRES_USER` und `POSTGRES_PASSWORD` sauber aufgelöst da?
    2. `.env` muss im **selben Ordner** wie die `compose.yaml` liegen.
    3. Wenn ihr `POSTGRES_PASSWORD` ändert, müsst ihr immer auch das Volume neu anlegen.

---

## Hilfekarte 9 – Init-SQL hat nicht ausgeführt

??? info "Aufklappen"
    Symptom: ihr seht im Frontend keine Module, oder `docker compose exec db psql -U aurora -d auroradb -c "\dt"` zeigt **keine Tabelle `modules`**.

    **Wichtigster Punkt zuerst:**

    > Das Postgres-Image führt Skripte unter `/docker-entrypoint-initdb.d/` **nur aus, wenn das Datenverzeichnis leer ist**, also nur beim allerersten Start eines frischen Volumes.

    Wenn ihr erst ohne Init-SQL gestartet habt und dann das Bind-Mount nachgezogen habt, hat Postgres das Skript nie gesehen.

    **Lösung – Volume neu anlegen:**

    ```bash
    docker compose down -v
    docker compose up -d
    ```

    !!! danger "Achtung"
        `down -v` löscht **alle** benannten Volumes des Compose-Projekts. Wenn ihr selbst angelegte Module behalten wollt, vorher exportieren oder den Schritt überlegen.

    Andere Ursachen:

    - Bind-Mount-Pfad falsch geschrieben (z.B. `./db/init.sql` vs. `db/init.sql` – beide gehen, aber **muss zur Datei passen**).
    - Datei steht **read-write** statt `:ro` – das ist nicht falsch, aber sicherer ist `:ro`.

---

## Hilfekarte 10 – Port ist bereits belegt

??? info "Aufklappen"
    Symptom: `docker compose up -d` bricht ab mit:

    ```text
    Bind for 0.0.0.0:8080 failed: port is already allocated
    ```

    **Ursache:** auf eurem Rechner läuft schon ein Dienst auf dem Host-Port – oft ein Container aus einer früheren Übung (Adminer aus dem Escape Room z.B.) oder ein anderes Programm.

    **Mögliche Lösungen:**

    1. **Anderen Host-Port wählen** (am einfachsten):

        Im `.env`:
        ```env
        FRONTEND_PORT=8090
        ADMINER_PORT=8091
        ```
        oder direkt in der `compose.yaml`:
        ```yaml
        ports:
          - "8090:80"
        ```

    2. **Den blockierenden Prozess finden:**

        === "macOS / Linux"
            ```bash
            lsof -i :8080
            ```

        === "Windows PowerShell"
            ```powershell
            netstat -ano | Select-String ":8080"
            ```

    3. **Häufigste Ursache:** alte Container von früheren Übungen (`quest-adminer` auf 8080 z.B.). `docker ps` checken, alten Container `docker rm -f`.

---

## Bonus-Hilfekarte: Sauberes Reset

??? warning "Aufklappen – nur wenn ihr alles neu starten wollt"
    Achtung: Der folgende Befehl löscht Container, Netzwerk und **alle benannten Volumes** des Compose-Projekts. Daten in `aurora-data` sind danach **weg**.

    ```bash
    docker compose down -v
    ```

    Falls ihr auch das gebaute Image loswerden wollt:

    ```bash
    docker compose down -v --rmi local
    ```

    Danach mit `docker compose up -d --build` wieder hochfahren.

    Noch radikaler – euch interessieren wirklich nur Mission-Control-Container und nichts anderes auf eurem Rechner:

    ```bash
    docker compose ps -a
    docker compose rm -fsv
    docker volume rm <projektname>_aurora-data
    ```

---

## Weiter

- Wenn ihr alle Missionen + mindestens einen Bonus geschafft habt: [Abgabe & Reflexion](06-abgabe-und-reflexion.md)
- Erst nach ehrlichem eigenen Versuch: [Lösung](07-loesung.md)
