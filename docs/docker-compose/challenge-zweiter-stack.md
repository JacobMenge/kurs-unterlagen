---
title: "Challenge: der zweite Stack"
description: "Transferaufgabe ohne Anleitung: eine zweite, vollständig getrennte Umgebung mit Compose bauen und die Trennung beweisen."
---

# Challenge: der zweite Stack

Keine Anleitung, nur ein Auftrag. Alles, was ihr braucht, habt ihr in der
[Praxis-Übung](praxis-webapp.md) gerade selbst benutzt. So prüft ihr, ob
es wirklich sitzt.

Klemmt es, gibt es drei Hinweise zum Aufklappen: erst Richtung, dann
Werkzeug, ganz unten die komplette Musterlösung als Notausgang.

## Der Auftrag

In Firmen läuft neben der echten Umgebung fast immer eine zweite zum
Ausprobieren, oft heißt sie Staging. Baut genau das: **Neben eurem
Stack aus der Übung soll eine zweite, vollständig getrennte Umgebung
laufen.** Gleiche Bauteile (PostgreSQL und Adminer), aber eigene Daten,
eigener Port, gleichzeitig mit dem ersten Stack lauffähig.

!!! warning "Voraussetzung: der erste Stack läuft"
    Im Ordner `kurs-compose` aus der Praxis-Übung läuft der Stack und die
    Tabelle `teilnehmer` existiert. Habt ihr dort schon `docker compose down -v`
    ausgeführt, wechselt ihr in den Ordner, startet mit
    `docker compose up -d` neu und legt die Tabelle wie in
    [Schritt 6](praxis-webapp.md#schritt-6-eine-tabelle-anlegen) wieder an.
    Unter Windows arbeitet ihr wie in der Übung in der **PowerShell**.

**Geschafft, wenn:**

1. `docker ps` **vier** Container zeigt: beide Stacks laufen gleichzeitig.
2. Der Staging-Adminer unter `http://localhost:8082` erreichbar ist und
   dort **nur** die Staging-Datenbank zu sehen ist (legt zum Beweis eine
   Tabelle an, die es im ersten Stack nicht gibt).
3. Die Staging-Tabelle ein `docker compose down` plus `docker compose up -d`
   übersteht.
4. `docker compose down -v` im Staging nur die Staging-Daten löscht und
   der erste Stack samt Daten unberührt weiterläuft.

??? tip "Hinweis 1: Richtung"
    Compose trennt Stacks über den **Projektnamen** und der kommt aus dem
    **Ordnernamen**. Ein zweiter Ordner mit eigener `compose.yaml` ist
    die halbe Lösung. Nur bei den Ports gibt es keine Trennung: Der
    Host-Port `8080` ist schon vergeben, zweimal geht nicht.

??? tip "Hinweis 2: Werkzeug"
    Neuer Ordner `staging` neben `kurs-compose`, darin eine
    `compose.yaml` wie in der Übung, nur der Adminer-Port außen anders,
    zum Beispiel `"8082:8080"`. Die Namen von Services und Volume dürft
    ihr **gleich lassen**: Compose hängt den Projektnamen davor. Seht es
    euch nach dem Start mit `docker volume ls` an
    (`kurs-compose_postgres-daten` neben `staging_postgres-daten`).

??? success "Musterlösung"
    Ordner anlegen und hineinwechseln:

    === "macOS / Linux"
        ```bash
        mkdir -p ~/staging && cd ~/staging
        ```

    === "Windows PowerShell"
        ```powershell
        mkdir $HOME\staging; cd $HOME\staging
        ```

    === "Windows CMD"
        ```cmd
        mkdir %USERPROFILE%\staging
        cd /d %USERPROFILE%\staging
        ```

    Die `compose.yaml` legt ihr wie in
    [Schritt 2 der Übung](praxis-webapp.md#schritt-2-composeyaml-schreiben)
    an, unter Windows mit `notepad compose.yaml`. Der Inhalt ist der aus
    der Übung mit einem anderen Außen-Port beim Adminer:

    ```yaml
    services:

      db:
        image: postgres:16
        environment:
          POSTGRES_USER: kurs
          POSTGRES_PASSWORD: geheim
          POSTGRES_DB: kursdaten
        volumes:
          - postgres-daten:/var/lib/postgresql/data

      adminer:
        image: adminer
        ports:
          - "8082:8080"

    volumes:
      postgres-daten:
    ```

    Starten und prüfen:

    ```bash
    docker compose up -d
    ```

    ```bash
    docker ps
    ```

    Vier Container, zwei Projekte. Adminer auf `http://localhost:8082`
    (Server `db`, Benutzer `kurs`, Passwort `geheim`, Datenbank
    `kursdaten`), Tabelle anlegen, dann der Beweis:

    ```bash
    docker compose down
    ```

    ```bash
    docker compose up -d
    ```

    Tabelle noch da. Zum Schluss im Staging-Ordner `docker compose
    down -v`: Weg sind nur `staging_postgres-daten` und die
    Staging-Container, der erste Stack läuft weiter.

## Warum das funktioniert (nach dem Lösen lesen)

- **Projektname als Präfix:** Compose stellt den Ordnernamen vor alles,
  was es anlegt: Container, Netz und Volumes. Deshalb kollidieren
  gleiche Service- und Volumenamen aus zwei Ordnern nicht.
- **Servicenamen gelten nur im eigenen Projekt-Netz:** Beide Adminer
  erreichen ihre Datenbank unter dem Namen `db` und meinen trotzdem
  verschiedene Container.
- **Ports sind global:** Der Host hat jeden Port nur einmal, deshalb war
  `8082` nötig. Genau daran erkennt ihr von außen, welcher Stack
  antwortet.
