---
title: "Die Missionen"
description: "Sieben Missionen mit Ziel und Erfolgskriterium: die Aurora Station aus einer selbst geschriebenen compose.yaml wieder online bringen."
---

# Die Missionen

Jede Mission nennt euch die Lage, den Auftrag und **woran ihr erkennt,
dass sie geschafft ist**. Den Weg baut ihr selbst. Klemmt es, klappt die
Funkhilfe auf: erst Stufe 1, dann 2, dann 3. Fünf Minuten ohne
Fortschritt heißt: nächste Stufe.

Zur Einordnung: **Nur drei Missionen bringen etwas Neues.** `build:` in
Mission 1, die `.env` in Mission 6 und der Healthcheck in Mission 7.
Alles dazwischen ist der Stoff von Montag und Mittwoch, nur als YAML
geschrieben.

!!! note "Startaufstellung"
    Ihr steht mit dem Terminal im Ordner
    `apps/docker-compose-mission-control` des heruntergeladenen
    Kurs-Repositorys ([Code holen](index.md#code-holen)). Schaut euch
    kurz um: `frontend/`, `backend-node/`, `modul/` und `db/` bringen
    fertige Dockerfiles mit. Legt dann eine **leere Datei `compose.yaml`**
    im App-Ordner an, direkt neben `README.md`: unter Windows mit
    `notepad compose.yaml` (Frage nach dem Anlegen mit **Ja**
    beantworten), unter macOS mit `nano compose.yaml` oder
    `code compose.yaml`. Nicht über den Explorer anlegen, sonst entsteht
    `compose.yaml.txt` und Compose meldet `no configuration file
    provided`. Mehr braucht der Start nicht.

---

## Mission 1: das Frontend

**Lage:** Die Bodenkontrolle ist blind. Kein Dashboard, keine Station.

**Auftrag:** Bringt das Frontend als ersten Service in die
`compose.yaml`. Es wird aus dem Ordner `frontend/` **gebaut** (nicht aus
einem fertigen Image geladen) und soll im Browser unter
`http://localhost:8080` erreichbar sein. Der Container lauscht innen auf
Port 80.

**Geschafft, wenn:** die Seite lädt, die Lampe Frontend grün ist und die
Station **komplett dunkel** dasteht. Die Lampe Backend zeigt „nicht
erreichbar", genau richtig: Es gibt ja noch keins.

**Ausrüstung:** Mittwoch Schritt 2 (die compose.yaml schreiben), Folie
„Das Zielbild".

!!! info "Warum leitet das Frontend /api/ weiter?"
    Der Nginx im Frontend-Container arbeitet als **Reverse Proxy**: Der
    Browser spricht nur mit ihm und alle `/api/`-Anfragen reicht er im
    Projekt-Netz an den Service `backend` weiter. So braucht genau ein
    Dienst eine Tür nach außen, das Backend bleibt von draußen
    unerreichbar. Nach diesem Muster ist praktisch jede Web-Anwendung in
    Produktion gebaut.

??? tip "Funkhilfe Stufe 1: Richtung"
    Am Mittwoch stand beim Service `image: adminer`. Heute liegt kein
    fertiges Image vor, sondern ein Ordner mit Dockerfile. Der
    Compose-Schlüssel dafür ist `build:` mit dem Pfad zum Ordner. Ports
    schreibt ihr wie immer als `"außen:innen"`.

??? tip "Funkhilfe Stufe 2: Werkzeug"
    Drei Schlüssel reichen: `services:`, darunter `frontend:` mit
    `build: ./frontend` und `ports:` mit `- "8080:80"`. Danach wie
    Mittwoch: `docker compose up -d` und mit `docker compose ps`
    nachsehen.

??? success "Funkhilfe Stufe 3: Notfallplan"
    ```yaml
    services:
      frontend:
        build: ./frontend
        ports:
          - "8080:80"
    ```

    ```bash
    docker compose up -d
    ```

    Beim ersten `up` baut Compose das Image, das dauert einen Moment.

---

## Mission 2: das Logbuch

**Lage:** Die Station wird gleich Meldungen funken. Ohne Datenbank geht
jede davon verloren.

**Auftrag:** Bringt PostgreSQL als Service `db` in den Stack, mit dem
Image von Montag (`postgres:16`), den drei bekannten
`POSTGRES_*`-Variablen (Werte: `aurora`, `aurorapass`, `auroradb`) und
**zwei** Volume-Einträgen: einem benannten Volume `aurora-data` für
`/var/lib/postgresql/data` und dem Init-Skript `./db/init.sql` nach
`/docker-entrypoint-initdb.d/init.sql`. Kein Port nach außen, die
Datenbank bleibt im Netz der Station.

**Geschafft, wenn:** `docker compose ps` den Service `db` als `Up` zeigt
und in `docker compose logs db` die Zeile
`database system is ready to accept connections` steht. Die Lampe
Datenbank bleibt vorerst grau, sie braucht das Backend als Melder.

**Ausrüstung:** Montag Teil 1 (Volume und Variablen), Mittwoch Schritt 2
(der db-Block mit seinen volumes).

!!! info "Warum bekommt die Datenbank keinen Port?"
    Erreichbar sein muss sie nur für Backend und Adminer, beide stehen
    mit ihr im Projekt-Netz. Jede zusätzliche Tür nach draußen
    wäre reine Angriffsfläche. Im Betrieb gilt dieselbe Regel: Nach
    außen öffnet nur, was Anfragen von Nutzern annehmen muss.

??? tip "Funkhilfe Stufe 1: Richtung"
    Das ist der Montags-Befehl mit `-v postgres-daten:/var/lib/postgresql/data`
    und den drei `-e`-Variablen, nur als YAML geschrieben. Neu ist allein
    der zweite Volume-Eintrag für das Init-Skript: links ein Pfad statt
    eines Namens, das kennt ihr als Bind Mount. Benannte Volumes brauchen
    zusätzlich die Liste `volumes:` ganz unten in der Datei.

??? tip "Funkhilfe Stufe 2: Werkzeug"
    Im Service: `image:`, `environment:` mit `POSTGRES_USER`,
    `POSTGRES_PASSWORD`, `POSTGRES_DB` und `volumes:` mit zwei
    Einträgen (`aurora-data:/var/lib/postgresql/data` und
    `./db/init.sql:/docker-entrypoint-initdb.d/init.sql`). Ganz unten in
    der Datei, auf oberster Ebene:

    ```yaml
    volumes:
      aurora-data:
    ```

??? success "Funkhilfe Stufe 3: Notfallplan"
    ```yaml
      db:
        image: postgres:16
        environment:
          POSTGRES_USER: aurora
          POSTGRES_PASSWORD: aurorapass
          POSTGRES_DB: auroradb
        volumes:
          - aurora-data:/var/lib/postgresql/data
          - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql
    ```

    Und ganz unten in der Datei (oberste Ebene, nicht eingerückt):

    ```yaml
    volumes:
      aurora-data:
    ```

    Das Init-Skript läuft nur beim allerersten Start eines frischen
    Volumes. Wer hier später etwas ändert: `docker compose down -v` und
    neu hoch.

---

## Mission 3: der Funkkontakt

**Lage:** Datenbank läuft, Dashboard läuft, aber niemand nimmt Meldungen
an. Es fehlt das Backend.

**Auftrag:** Bringt das Backend in den Stack, gebaut aus
`backend-node/`. Es findet die Datenbank über vier Umgebungsvariablen:
`PGHOST` (der Servicename der Datenbank), `PGUSER`, `PGPASSWORD`,
`PGDATABASE` (Werte wie in Mission 2). Kein Port nach außen: Das Frontend
leitet `/api/`-Anfragen intern weiter, dafür muss der Service exakt
`backend` heißen.

**Geschafft, wenn:** oben rechts „Bodenkontrolle verbunden" steht, die
Lampen Backend **und** Datenbank grün sind und im Logbuch-Panel der erste
Eintrag der Bodenkontrolle auftaucht.

**Ausrüstung:** Montag Teil 2 (zwei Container, ein Netz, Namen statt
IP-Adressen), Folie „Was ist eine Umgebungsvariable?".

!!! info "Namen statt IP-Adressen"
    Compose trägt jeden Service unter seinem Namen in das eingebaute
    DNS des Projekt-Netzes ein. `PGHOST: db` funktioniert deshalb
    unabhängig davon, welche IP-Adresse der Datenbank-Container gerade
    hat: Die darf sich mit jedem Neustart ändern, der Name bleibt.
    Feste Namen statt fester Adressen, so verdrahtet man Dienste im
    Betrieb.

??? tip "Funkhilfe Stufe 1: Richtung"
    Dieselbe Frage wie Montag bei Adminer: Woher kennt ein Container die
    Datenbank? Über den **Servicenamen** im gemeinsamen Netz. Der
    Servicename aus Mission 2 ist der Wert für `PGHOST`.

??? tip "Funkhilfe Stufe 2: Werkzeug"
    `build: ./backend-node`, dazu `environment:` mit `PGHOST: db`,
    `PGUSER: aurora`, `PGPASSWORD: aurorapass`, `PGDATABASE: auroradb`.
    Keine `ports:`. Danach `docker compose up -d` und kurz warten, das
    Backend versucht es beim Start mehrfach bei der Datenbank.

??? success "Funkhilfe Stufe 3: Notfallplan"
    ```yaml
      backend:
        build: ./backend-node
        environment:
          PGHOST: db
          PGUSER: aurora
          PGPASSWORD: aurorapass
          PGDATABASE: auroradb
    ```

    Wenn die Lampe nicht umspringt: `docker compose logs backend` lesen.
    Dort steht, ob und woran die Datenbankverbindung scheitert.

---

## Mission 4: das erste Modul

**Lage:** Die Bodenkontrolle sieht wieder, aber die Station schweigt.
Sechs Stellplätze, alle dunkel.

**Auftrag:** Bringt die **Lebenserhaltung** ans Netz. Jedes Stationsmodul
ist ein eigener Service aus demselben Image, gebaut aus `modul/`. Welches
Modul es ist, entscheidet allein die Umgebungsvariable `MODUL_NAME`, hier
mit dem Wert `Lebenserhaltung`.

**Geschafft, wenn:** der Stellplatz Lebenserhaltung leuchtet, der Zähler
„1 von 6 Modulen online" zeigt und das Logbuch den Eintrag
`Lebenserhaltung online` hat.

**Ausrüstung:** Folie „Ein Image, drei Umgebungen" von Montag, das ist
genau dieses Muster.

!!! info "Ein Image, viele Container: so wird skaliert"
    Sechs Services aus demselben Image, unterschieden nur durch eine
    Variable. Nach genau diesem Muster laufen im Betrieb mehrere
    Instanzen desselben Dienstes nebeneinander, etwa Worker hinter
    einer Warteschlange oder Replikate hinter einem Load Balancer. Das
    Image bleibt eines, die Konfiguration macht den Unterschied.

??? tip "Funkhilfe Stufe 1: Richtung"
    Ein Modul braucht nur zwei Dinge: woraus es gebaut wird und wie es
    heißt. Kein Port, kein Volume. Den Rest (wo es sich meldet) kennt das
    Image selbst: Der Standard zeigt auf `http://backend:3000`, deshalb
    war der Servicename `backend` in Mission 3 Pflicht.

??? tip "Funkhilfe Stufe 2: Werkzeug"
    Servicename frei wählbar (klein geschrieben, zum Beispiel
    `lebenserhaltung`), darin `build: ./modul` und `environment:` mit
    `MODUL_NAME: Lebenserhaltung`. Der Wert muss exakt so heißen wie der
    Stellplatz, sonst landet die Meldung unter „Weitere Signale".

??? success "Funkhilfe Stufe 3: Notfallplan"
    ```yaml
      lebenserhaltung:
        build: ./modul
        environment:
          MODUL_NAME: Lebenserhaltung
    ```

---

## Mission 5: Betriebsstärke

**Lage:** Ein Licht macht noch keine Station. Die Bodenkontrolle will
mindestens drei Module sehen.

**Auftrag:** Bringt **mindestens zwei weitere** Module eurer Wahl online.
Die Stellplätze heißen: `Energie`, `Kommunikation`, `Forschungslabor`,
`Hydroponik`, `Andockschleuse`. Gleiche Bauart wie Mission 4, es ändern
sich nur zwei Zeilen je Modul.

**Geschafft, wenn:** der Zähler mindestens „3 von 6 Modulen online" zeigt
und jedes neue Modul im Logbuch steht. Alle sechs sind die
[Vertiefung](#vertiefung).

??? tip "Funkhilfe Stufe 1: Richtung"
    Block von Mission 4 kopieren, Servicenamen und `MODUL_NAME` anpassen,
    fertig. Achtet beim Kopieren auf die Einrückung, zwei Leerzeichen je
    Ebene.

??? success "Funkhilfe Stufe 3: Notfallplan"
    ```yaml
      energie:
        build: ./modul
        environment:
          MODUL_NAME: Energie

      kommunikation:
        build: ./modul
        environment:
          MODUL_NAME: Kommunikation
    ```

---

## Mission 6: Konfiguration an eine Stelle

**Lage:** Zugangsdaten stehen dreimal verstreut in eurer Datei. Die
Bodenkontrolle will eine einzige Stelle für alle Werte.

**Auftrag:** Legt aus der Vorlage `.env.example` eine Datei `.env` an und
zieht die Werte dorthin um: die drei `POSTGRES_*`-Werte und die beiden
Ports (`FRONTEND_PORT`, `ADMINER_PORT`). In der `compose.yaml` stehen
danach nur noch Platzhalter wie `${POSTGRES_USER}`.

**Geschafft, wenn:** `docker compose config` die eingesetzten Werte
zeigt, `docker compose up -d` unverändert läuft und in der
`compose.yaml` kein Passwort mehr steht.

**Ausrüstung:** Folie „Die .env-Datei", Mittwoch-Grundlagen (Abschnitt
Variablen aus .env).

!!! info "Konfiguration gehört nicht in den Code"
    Dieselbe compose.yaml läuft mit einer anderen `.env` in
    Entwicklung, Test und Produktion, ohne dass sich am Stack eine
    Zeile ändert. Deshalb liegt im Repository nur die Vorlage
    `.env.example` und die echte `.env` bleibt auf dem jeweiligen
    System. Diese Trennung von Code und Konfiguration ist ein
    Grundprinzip beim Betrieb von Anwendungen.

??? tip "Funkhilfe Stufe 1: Richtung"
    Compose liest eine Datei namens `.env` im selben Ordner automatisch
    und setzt `${NAME}` durch den Wert daraus ein. Die Vorlage kopieren,
    dann in der `compose.yaml` Wert für Wert ersetzen. Der
    Frontend-Port wird zu `"${FRONTEND_PORT}:80"`.

??? tip "Funkhilfe Stufe 2: Werkzeug"
    === "macOS / Linux"
        ```bash
        cp .env.example .env
        ```

    === "Windows PowerShell"
        ```powershell
        Copy-Item .env.example .env
        ```

    === "Windows CMD"
        ```cmd
        copy .env.example .env
        ```

    Danach in der `compose.yaml`: `POSTGRES_USER: ${POSTGRES_USER}` und
    so weiter, Ports als `"${FRONTEND_PORT}:80"`. Kontrolle mit
    `docker compose config`.

??? success "Funkhilfe Stufe 3: Notfallplan"
    ```yaml
      db:
        image: postgres:16
        environment:
          POSTGRES_USER: ${POSTGRES_USER}
          POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
          POSTGRES_DB: ${POSTGRES_DB}
    ```

    Beim Backend genauso: `PGUSER: ${POSTGRES_USER}`,
    `PGPASSWORD: ${POSTGRES_PASSWORD}`, `PGDATABASE: ${POSTGRES_DB}`.
    Beim Frontend: `- "${FRONTEND_PORT}:80"`.

---

## Mission 7: die Betriebsabnahme

**Lage:** Die Station läuft. Jetzt macht die Bodenkontrolle die Abnahme:
sauberer Start, Blick in die Daten und der Beweis, dass nichts verloren
geht.

**Auftrag:** Drei Handgriffe:

1. Gebt der Datenbank einen **Healthcheck** (`pg_isready`) und lasst das
   Backend per `depends_on` mit Bedingung erst starten, wenn die
   Datenbank **healthy** ist.
2. Nehmt **Adminer** als weiteren Dienst dazu (Image `adminer:latest`,
   Port `${ADMINER_PORT}` auf 8080) und seht euch unter
   `http://localhost:8081` die Tabelle `logbuch` an (Server: `db`,
   Zugangsdaten aus eurer `.env`).
3. Der Beweis: `docker compose down`, dann `docker compose up -d`. Die
   alte Logbuch-Historie muss nach dem Neustart noch da sein.

**Geschafft, wenn:** `docker compose ps` bei `db` **(healthy)** zeigt,
Adminer die Logbuch-Zeilen listet und nach down und up die alten
Einträge weiter im Logbuch stehen.

**Ausrüstung:** Folie „Warten, bis die Datenbank bereit ist", Montag
Teil 2 (Adminer), Montag Teil 3 (der Härtetest als Beweis).

!!! info "Healthchecks im Betrieb"
    Heute steuert der Healthcheck nur die Startreihenfolge. Im Betrieb
    ist derselbe kleine Testbefehl die Grundlage für mehr: Ein
    Orchestrierer startet Container neu, die dauerhaft unhealthy sind,
    ein Load Balancer nimmt sie aus der Verteilung. „Gestartet" und
    „bereit" sind zwei verschiedene Zustände, das ist die Lektion.

??? tip "Funkhilfe Stufe 1: Richtung"
    Ein Healthcheck ist ein kleiner Test, den Docker regelmäßig im
    Container ausführt. Für Postgres ist das Werkzeug `pg_isready`. Beim
    Backend wird aus der einfachen `depends_on`-Liste die lange Form mit
    `condition: service_healthy`. Adminer ist der Montags-Container, nur
    als Service geschrieben.

??? tip "Funkhilfe Stufe 2: Werkzeug"
    Im Service `db` ein Block `healthcheck:` mit `test:`, `interval:`,
    `timeout:`, `retries:`. Als Test:
    `pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}`. Beim Backend:

    ```yaml
        depends_on:
          db:
            condition: service_healthy
    ```

??? success "Funkhilfe Stufe 3: Notfallplan"
    ```yaml
      db:
        image: postgres:16
        environment:
          POSTGRES_USER: ${POSTGRES_USER}
          POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
          POSTGRES_DB: ${POSTGRES_DB}
        volumes:
          - aurora-data:/var/lib/postgresql/data
          - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql
        healthcheck:
          test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
          interval: 5s
          timeout: 3s
          retries: 5

      adminer:
        image: adminer:latest
        ports:
          - "${ADMINER_PORT}:8080"
        depends_on:
          - db
    ```

    Die komplette Datei steht in der [Musterlösung](07-loesung.md).

---

## Vertiefung

Alles ab hier ist **freiwillig**: Wer Mission 7 geschafft hat, hat den
Abend geschafft. Für Gruppen mit Restzeit, in beliebiger Reihenfolge.

### Vertiefung 1: die volle Station

Bringt die restlichen Module online. Für die **Andockschleuse** hat die
Bodenkontrolle noch einen Block aus dem alten Deployment gefunden, nehmt
den als Ausgangspunkt:

```yaml
  andockschleuse:
    build: ./modul
    environment:
      MODUL_NAME: Andockschleuse
      BACKEND_ADRESSE: http://backend-api:3000
```

Er startet, aber der Stellplatz bleibt dunkel. Findet mit
`docker compose logs andockschleuse` heraus, woran es liegt. Dann repariert ihn.

**Geschafft, wenn:** „6 von 6 Modulen online" leuchtet.

??? success "Auflösung"
    Die Logs zeigen
    `Bodenkontrolle nicht erreichbar unter http://backend-api:3000 (ENOTFOUND)`.
    `ENOTFOUND` heißt: Diesen Hostnamen kennt das Netz nicht, es gibt
    keinen Service `backend-api`. Zeile auf `http://backend:3000`
    korrigieren oder ganz löschen (das ist der Standard), dann
    `docker compose up -d`.

### Vertiefung 2: der Live-Ausfall

Stoppt ein laufendes Modul, schaut auf Station und Logbuch, startet es
wieder:

```bash
docker compose stop energie
```

```bash
docker compose start energie
```

**Geschafft, wenn:** das Logbuch den offline- und den online-Eintrag
zeigt. So sieht Überwachung im Betrieb aus: Der Ausfall steht im
Protokoll, bevor jemand ihn meldet.

### Vertiefung 3: der Backend-Tausch

Im Ordner liegt ein zweites Backend (`backend-fastapi/`, Python statt
JavaScript) mit **identischer Schnittstelle**. Tauscht in der
`compose.yaml` nur die `build:`-Zeile des Backends und baut neu:

```bash
docker compose up -d --build backend
```

**Geschafft, wenn:** die Backend-Lampe „FastAPI" zeigt und alle Module
online bleiben. Merksatz dahinter: Wer die Schnittstelle hält, darf die
Implementierung tauschen.

---

Danach geht es in die [Demo-Runde](06-abgabe-und-reflexion.md).
