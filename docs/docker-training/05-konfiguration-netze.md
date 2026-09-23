---
title: "Training: Konfiguration und Netze"
description: "Übungen 11 und 12: Container per Umgebungsvariable von außen konfigurieren und erleben, warum sich Container nur in einem eigenen Netzwerk über ihren Namen finden."
---

# Konfiguration und Netze

Zwei Übungen zu der Frage, wie Container eingestellt werden und wie sie
sich gegenseitig finden. Beides brauchst du, sobald mehr als ein
Container im Spiel ist.

---

## Übung 11: Umgebungsvariablen: Einstellungen von außen

!!! info "Was du lernst"
    - einem Container mit `-e` einen Wert mitgeben
    - dass dasselbe Image mit anderen Werten anders arbeitet
    - warum manche Images ohne bestimmte Variablen gar nicht starten

### Worum es geht

Ein Image ist fest gebaut. Damit du es trotzdem einstellen kannst (etwa
ein Passwort oder einen Namen), liest der Dienst beim Start
**Umgebungsvariablen**: Name-Wert-Paare, die du mit `-e NAME=Wert`
übergibst.

### Schritt für Schritt

`printenv NAME` gibt im Container den Wert einer Variablen aus. Erst mit
Variable:

```bash
docker run --rm -e GRUSS=Hallo alpine printenv GRUSS
```

```text
Hallo
```

Derselbe Befehl mit anderem Wert:

```bash
docker run --rm -e GRUSS=Moin alpine printenv GRUSS
```

```text
Moin
```

Und ohne `-e`: Die Ausgabe bleibt leer, die Variable gibt es nicht.

```bash
docker run --rm alpine printenv GRUSS
```

Alle Variablen eines Containers auf einmal siehst du so:

```bash
docker run --rm -e GRUSS=Hallo alpine env
```

Neben `GRUSS` stehen dort Variablen, die das Image selbst mitbringt,
etwa `PATH` und `HOSTNAME`.

Jetzt ein echter Dienst: PostgreSQL **ohne** die Variable, die es
zwingend braucht.

```bash
docker run --name pg-ohne postgres:16
```

```text
Error: Database is uninitialized and superuser password is not specified.
       You must specify POSTGRES_PASSWORD to a non-empty value for the
       superuser. For example, "-e POSTGRES_PASSWORD=password" on "docker run".
```

Der Container beendet sich sofort. Das Terminal kommt von allein zurück: Ohne
`-d` lief der Container im Vordergrund und ist schon fertig.

### Was dahinter steckt

- Umgebungsvariablen sind der Standardweg, Container von außen zu
  konfigurieren. Ein Image, viele Einstellungen: Dasselbe Postgres-Image
  läuft in Test und Produktion, nur mit anderen Werten.
- Welche Variablen ein Image versteht, steht in seiner Beschreibung auf
  Docker Hub. Die Namen sind fest (`POSTGRES_PASSWORD`, nicht
  `PASSWORT`), ein Tippfehler bedeutet: Die Variable wird schlicht
  ignoriert.
- Postgres bricht bewusst ab, statt ohne Passwort zu starten. Dieses
  Verhalten heißt **Fail fast**: Ein fehlerhaft konfigurierter Dienst
  soll sofort und laut scheitern, nicht still und unsicher laufen. Die
  Meldung sagt dir sogar, was fehlt. Genau deshalb ist `docker logs` bei
  einem Container, der sofort beendet ist, immer der erste Blick.

??? question "Kontrollfrage: Du startest Postgres mit `-e POSTGRES_PASWORD=geheim` (ein s fehlt). Was passiert?"
    Dieselbe Fehlermeldung wie ganz ohne Variable. Postgres kennt nur
    `POSTGRES_PASSWORD`, die falsch geschriebene Variable ist für das
    Image einfach irgendeine unbekannte Einstellung. Deshalb bei
    „fehlt"-Meldungen immer zuerst die Schreibweise prüfen.

### Aufräumen

```bash
docker rm -v pg-ohne
```

Das `-v` entfernt auch das namenlose Volume, das Postgres für seinen
Datenordner automatisch anlegt. Ohne `-v` bliebe es in `docker volume ls`
als lange Zeichenkette liegen.

---

## Übung 12: Namen statt IP-Adressen: das eigene Netzwerk

!!! info "Was du lernst"
    - ein eigenes Docker-Netzwerk anlegen
    - dass sich Container darin über ihren Namen erreichen
    - warum das im Standardnetz nicht klappt

### Worum es geht

Sobald zwei Container zusammenarbeiten (Webanwendung und Datenbank),
muss der eine den anderen finden. IP-Adressen von Containern ändern sich
aber, sobald ein Container neu erstellt wird. Die Lösung: ein **eigenes Netzwerk**, in dem
Docker jeden Container unter seinem **Namen** auffindbar macht.

### Schritt für Schritt

Erst der Gegenbeweis: ein Webserver im Standardnetz. Ein zweiter
Container versucht, ihn per Name anzupingen:

```bash
docker run -d --name web-standard nginx:alpine
```

```bash
docker run --rm alpine ping -c 2 web-standard
```

```text
ping: bad address 'web-standard'
```

Der Name ist unbekannt. Jetzt mit eigenem Netzwerk:

```bash
docker network create uebungsnetz
```

```bash
docker run -d --name web --network uebungsnetz nginx:alpine
```

```bash
docker run --rm --network uebungsnetz alpine ping -c 2 web
```

```text
PING web (172.18.0.2): 56 data bytes
64 bytes from 172.18.0.2: seq=0 ttl=64 time=0.066 ms
64 bytes from 172.18.0.2: seq=1 ttl=64 time=0.187 ms
```

Der Name `web` wird zu einer IP-Adresse aufgelöst. Mehr als ein Ping:
Hol dir die Webseite von `web` direkt aus einem anderen Container.
`wget` ist in Alpine eingebaut, `-qO-` gibt die Seite im Terminal aus:

```bash
docker run --rm --network uebungsnetz alpine wget -qO- web
```

Du siehst den HTML-Code von „Welcome to nginx!", abgerufen **ohne**
Port-Mapping, direkt von Container zu Container.

### Was dahinter steckt

- Jedes selbst angelegte Docker-Netzwerk hat einen eingebauten
  **DNS-Server**. Er kennt die Namen aller Container im Netz und löst sie
  in ihre aktuelle IP-Adresse auf. Das ist dasselbe Prinzip wie DNS im
  Internet, nur im Kleinen.
- Das Standardnetz (`bridge`), in dem Container ohne `--network` landen,
  hat diese Namensauflösung aus historischen Gründen nicht. Darum der
  Fehler `bad address`.
- Der `wget`-Aufruf klappt ohne `-p`: Innerhalb eines Docker-Netzes
  erreichen sich Container direkt auf ihren inneren Ports. `-p` braucht
  es nur für die Tür nach draußen zu deinem Browser. Eine Datenbank
  bekommt deshalb in der Regel **kein** `-p`: Die Anwendung erreicht sie
  im Netz, von außen bleibt sie unerreichbar.
- Compose legt dieses eigene Netzwerk automatisch an. Deshalb findet das
  Backend dort die Datenbank einfach über den Servicenamen `db`
  (siehe [Übung 16](07-compose.md)).

??? question "Kontrollfrage: Warum schreibt man in eine Konfiguration `db` als Adresse und nicht `172.18.0.2`?"
    Weil die IP-Adresse eines Containers nicht fest ist. Wird der
    Container neu erstellt, kann er eine andere Adresse bekommen. Der
    Name bleibt gleich und der DNS-Server des Netzwerks löst ihn immer
    auf die aktuelle Adresse auf. Feste Namen statt fester Adressen ist
    im Betrieb die Regel.

### Aufräumen

```bash
docker rm -f web web-standard
```

```bash
docker network rm uebungsnetz
```

---

## Selbst probieren

**Auftrag:** Starte PostgreSQL und Adminer so, dass du dich in Adminer
im Browser an der Datenbank anmelden kannst. Die Datenbank soll **keinen**
Port nach außen bekommen, Adminer schon (Adminer lauscht innen auf
Port 8080).

**Geschafft, wenn:** der Login in Adminer klappt (System PostgreSQL,
Server ist der Name deines Datenbank-Containers) und du die Datenbank
`postgres` siehst.

??? tip "Hinweis"
    Du brauchst drei Befehle: ein Netzwerk anlegen, Postgres mit
    `--network` und `-e POSTGRES_PASSWORD=…` starten, Adminer mit
    `--network` und `-p 8080:8080` starten. In Adminer: Benutzer
    `postgres`, dein Passwort, als Server den Containernamen.

??? success "Lösung"
    ```bash
    docker network create dbnetz
    ```

    ```bash
    docker run -d --name db --network dbnetz -e POSTGRES_PASSWORD=geheim postgres:16
    ```

    ```bash
    docker run -d --name adminer --network dbnetz -p 8080:8080 adminer
    ```

    Im Browser `http://localhost:8080`, System **PostgreSQL**, Server
    `db`, Benutzer `postgres`, Passwort `geheim`, Datenbank leer lassen
    oder `postgres`.

    Aufräumen:

    ```bash
    docker rm -f -v db adminer
    ```

    ```bash
    docker network rm dbnetz
    ```
