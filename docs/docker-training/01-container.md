---
title: "Training: Container"
description: "Übungen 1 bis 3: der Lebenszyklus eines Containers, warum ein Container nur so lange lebt wie sein Hauptprozess und wie du in einen laufenden Container hineinschaust."
---

# Container

Drei Übungen zum wichtigsten Baustein: dem Container selbst. Du startest,
stoppst und löschst ihn und siehst, wann er von allein endet. Zum Schluss
schaust du ihm von innen zu.

---

## Übung 1: Ein Container von Anfang bis Ende

!!! info "Was du lernst"
    - die Zustände eines Containers: läuft, beendet, gelöscht
    - den Unterschied zwischen `docker ps` und `docker ps -a`
    - was `stop` und `rm` wirklich tun

### Worum es geht

Ein Container durchläuft ein festes Leben: Er wird **angelegt** und
**gestartet**, läuft, wird **angehalten** und irgendwann **gelöscht**.
Angehalten heißt nicht gelöscht. Ein gestoppter Container liegt weiter
auf deinem Rechner, bis du ihn ausdrücklich entfernst.

### Schritt für Schritt

Starte einen Container, der zehn Minuten lang nichts tut außer zu
warten. Das Programm `sleep` wartet einfach die angegebene Zahl an
Sekunden:

```bash
docker run -d --name schlaefer alpine sleep 600
```

`-d` startet ihn im Hintergrund, `--name` gibt ihm einen Namen, mit dem
du ihn ansprechen kannst. Die lange Zeichenkette in der Ausgabe ist seine
Container-ID.

```bash
docker ps
```

```text
CONTAINER ID   IMAGE    COMMAND       CREATED         STATUS         PORTS   NAMES
a10914fc68f0   alpine   "sleep 600"   3 seconds ago   Up 2 seconds           schlaefer
```

Jetzt anhalten. Das dauert **zehn Sekunden**, warum, steht weiter unten:

```bash
docker stop schlaefer
```

```bash
docker ps
```

Die Liste ist leer. Aber der Container ist nicht weg:

```bash
docker ps -a
```

```text
CONTAINER ID   IMAGE    COMMAND       CREATED          STATUS                       NAMES
a10914fc68f0   alpine   "sleep 600"   40 seconds ago   Exited (137) 5 seconds ago   schlaefer
```

Erst `rm` löscht ihn wirklich:

```bash
docker rm schlaefer
```

Jetzt taucht er auch in `docker ps -a` nicht mehr auf. Das Image `alpine`
bleibt davon unberührt, prüf es mit `docker images alpine`.

### Was dahinter steckt

- `docker ps` zeigt nur **laufende** Container, `docker ps -a` **alle**.
  Wer nur `docker ps` benutzt, übersieht gestoppte Container, die noch
  Namen belegen. Das ist die häufigste Ursache für den Fehler
  `The container name is already in use`.
- `docker stop` schickt dem Hauptprozess erst ein freundliches
  Stopp-Signal (SIGTERM), damit er sauber aufräumen kann. Reagiert er
  nicht, beendet Docker ihn nach **zehn Sekunden** hart (SIGKILL).
  `sleep` ist im Container Prozess Nummer 1 und bringt keine eigene
  Reaktion auf das Stopp-Signal mit. Für Prozess 1 verwirft Linux
  solche Signale, deshalb die Wartezeit.
- Der Exit-Code verrät, wie ein Container endete: `0` heißt „regulär
  fertig", `137` heißt „hart beendet" (128 plus Signal 9). Im Betrieb ist
  das ein erster Hinweis, ob ein Dienst sauber heruntergefahren ist.
- `docker rm -f schlaefer` erledigt `stop` und `rm` in einem Schritt.
  Praktisch zum Aufräumen, im Betrieb aber mit Bedacht: Der Prozess
  bekommt keine Gelegenheit, sauber zu beenden.

??? question "Kontrollfrage: Du tippst `docker run -d --name schlaefer alpine sleep 600` ein zweites Mal. Was passiert und warum?"
    Docker verweigert den Start mit
    `Conflict. The container name "/schlaefer" is already in use`, sofern
    der erste Container noch existiert, egal ob er läuft oder gestoppt
    ist. Ein Name ist eindeutig, solange der Container nicht gelöscht
    wurde. Lösung: `docker rm -f schlaefer`, dann neu starten.

### Aufräumen

Nichts zu tun, der Container ist schon gelöscht. Falls nicht:
`docker rm -f schlaefer`.

---

## Übung 2: Ein Container lebt so lange wie sein Hauptprozess

!!! info "Was du lernst"
    - warum manche Container sofort wieder beendet sind
    - was der Hauptprozess eines Containers ist
    - wie Web- und Datenbank-Container dauerhaft laufen

### Worum es geht

Ein Container ist keine kleine VM, die einfach „an" ist. Er ist ein
**abgeschotteter Prozess**. Endet dieser Prozess, endet der Container.

### Schritt für Schritt

Starte einen Container, dessen einzige Aufgabe ein Satz ist:

```bash
docker run alpine echo Hallo aus dem Container
```

```text
Hallo aus dem Container
```

Und schon ist er fertig. Such ihn:

```bash
docker ps -a
```

Du findest ihn ganz oben mit einem zufälligen Namen (wie
`kind_goodall`) und dem Status `Exited (0)`. Er hat seine Aufgabe erledigt
und sich regulär beendet.

Zum Vergleich ein Container, dessen Hauptprozess nicht endet, ein
Webserver:

```bash
docker run -d --name dauerlaeufer nginx:alpine
```

```bash
docker ps
```

`dauerlaeufer` steht mit `Up` in der Liste und bleibt dort, bis du ihn
anhältst.

### Was dahinter steckt

- Jeder Container hat genau einen **Hauptprozess**: den Befehl, mit dem
  er startet. Bei `alpine echo …` ist das `echo`, bei `nginx:alpine` der
  Webserver `nginx`. Welcher Befehl das standardmäßig ist, legt das Image
  fest (im Dockerfile mit `CMD`, dazu mehr in
  [Übung 13](06-eigenes-image.md)).
- Alles, was du **hinter** den Image-Namen schreibst, ersetzt diesen
  Standardbefehl. `docker run alpine echo Hallo` startet also nicht die
  Alpine-Shell, sondern direkt `echo`.
- Dienste wie Webserver und Datenbanken laufen deshalb im Vordergrund und
  enden nie von allein. Ein Container, der „sofort wieder aus" ist, hat
  fast immer einen Hauptprozess, der fertig oder abgestürzt ist. Die
  Antwort steht dann in `docker logs`.

??? question "Kontrollfrage: Ein Kollege startet `docker run -d ubuntu` und wundert sich, dass `docker ps` nichts zeigt. Was ist los?"
    Der Standardbefehl des Ubuntu-Images ist eine Shell (`bash`). Im
    Hintergrund gestartet, ohne Eingabe, hat die Shell nichts zu tun und
    endet sofort, mit ihr der Container. Er steht mit `Exited (0)` in
    `docker ps -a`. Das ist kein Fehler, sondern das Prinzip: Ohne
    laufenden Hauptprozess kein laufender Container.

### Aufräumen

```bash
docker rm -f dauerlaeufer
```

Die beendeten Container mit Zufallsnamen löschst du über ihren Namen aus
`docker ps -a`, zum Beispiel `docker rm kind_goodall`.

---

## Übung 3: In einen laufenden Container hineinschauen

!!! info "Was du lernst"
    - mit `docker exec` Befehle im Container ausführen
    - mit `docker logs` die Ausgaben eines Containers lesen
    - warum im Container immer Linux steckt, auch auf Windows

### Worum es geht

Ein Container ist abgeschottet, aber nicht verschlossen. Du kannst jederzeit
**hineinschauen**: einzelne Befehle darin ausführen, eine Shell öffnen
oder lesen, was der Dienst protokolliert. Das sind die zwei wichtigsten
Werkzeuge bei der Fehlersuche.

### Schritt für Schritt

Starte einen Webserver, diesmal mit Port, damit du ihn im Browser
aufrufen kannst:

```bash
docker run -d --name web -p 8080:80 nginx:alpine
```

Öffne im Browser `http://localhost:8080`. Du siehst „Welcome to nginx!".

**Ein einzelner Befehl im Container:** Welches Betriebssystem steckt
eigentlich drin?

```bash
docker exec web cat /etc/os-release
```

```text
NAME="Alpine Linux"
ID=alpine
...
```

Und wo liegt die Seite, die du gerade im Browser gesehen hast?

```bash
docker exec web ls /usr/share/nginx/html
```

```text
50x.html
index.html
```

**Eine Shell im Container:** `-it` verbindet dein Terminal mit dem
Container, `sh` ist die Shell von Alpine.

```bash
docker exec -it web sh
```

Die Eingabezeile ändert sich zu `/ #`. Du bist jetzt **im** Container.
Probier ein paar Linux-Befehle aus, zum Beispiel `ls /`, `ps` oder
`hostname`. Mit `exit` kommst du zurück in deine PowerShell.

**Die Logs:** Lade die Seite im Browser zwei-, dreimal neu, dann:

```bash
docker logs web
```

Ganz unten stehen deine Aufrufe, je Zeile einer (die IP-Adresse vorn sieht bei dir anders aus):

```text
192.168.65.1 - - [23/Sep/2026:14:17:03 +0000] "GET / HTTP/1.1" 200 896 "-" "Mozilla/5.0 ..." "-"
```

### Was dahinter steckt

- `docker exec` startet einen **zusätzlichen** Prozess im laufenden
  Container. Der Hauptprozess (hier `nginx`) läuft ungestört weiter. Mit
  `exit` beendest du nur deine Shell, nicht den Container.
- Im Container steckt immer Linux, auch wenn du auf Windows arbeitest.
  Docker Desktop betreibt dafür im Hintergrund eine kleine Linux-VM
  (siehe [Docker Desktop ist eine VM](../docker/docker-desktop-wahrheit.md)).
  Deshalb heißen die Befehle **im** Container `ls` und `cat`, auch wenn
  draußen PowerShell läuft.
- `docker logs` zeigt alles, was der Hauptprozess auf die Standardausgabe
  schreibt. Gut gebaute Images schreiben ihre Protokolle genau dorthin
  statt in Dateien. So liest du jeden Dienst mit demselben Befehl, ob
  Webserver, Datenbank oder eigene Anwendung. Mit `docker logs -f web`
  folgst du den Logs live, `Strg+C` beendet das Mitlesen.
- Jede Log-Zeile ist ein Beweis: Die Anfrage kam an, der Server
  antwortete mit Status `200` (erfolgreich). Das ist dieselbe Denkweise
  wie bei der Netzwerk-Diagnose: erst prüfen, ob etwas ankommt.

??? question "Kontrollfrage: Ein Container startet und ist nach einer Sekunde beendet. Mit welchem Befehl findest du am schnellsten heraus, warum?"
    Mit `docker logs <name>`. Die Logs bleiben auch bei einem beendeten
    Container erhalten, bis er gelöscht wird. Dort steht fast immer die
    Fehlermeldung des Hauptprozesses. `docker exec` hilft hier nicht:
    Es funktioniert nur bei laufenden Containern.

### Aufräumen

```bash
docker rm -f web
```

---

## Selbst probieren

**Auftrag:** Starte einen Container aus dem Image `httpd` (der Webserver
Apache, eine Alternative zu nginx) im Hintergrund mit dem Namen `apache`.
Finde dann **ohne Browser** heraus, in welchem Ordner Apache seine
Startseite ausliefert und wie der Inhalt dieser Startseite lautet.

**Geschafft, wenn:** du den Inhalt der Startseite im Terminal siehst.

??? tip "Hinweis"
    Der Ordner heißt bei Apache `htdocs` und liegt unter
    `/usr/local/apache2/`. Mit `docker exec` kannst du dort `ls` und `cat`
    ausführen. Wenn `httpd` bei dir noch nicht vorhanden ist, lädt Docker
    es beim ersten `docker run` automatisch herunter.

??? success "Lösung"
    ```bash
    docker run -d --name apache httpd
    ```

    ```bash
    docker exec apache ls /usr/local/apache2/htdocs
    ```

    ```bash
    docker exec apache cat /usr/local/apache2/htdocs/index.html
    ```

    ```text
    ...
    <title>It works! Apache httpd</title>
    ...
    <p>It works!</p>
    ...
    ```

    Aufräumen: `docker rm -f apache`
