---
title: "Training: Daten"
description: "Übungen 8 bis 10: warum Daten im Container verloren gehen, wie ein Volume sie rettet und wie ein Bind Mount einen Ordner deines Rechners in den Container holt."
---

# Daten

Drei Übungen zur wichtigsten Frage im Betrieb: Wo bleiben die Daten,
wenn der Container weg ist? Erst siehst du das Problem, dann die zwei
Lösungen, die Docker dafür anbietet.

---

## Übung 8: Der Wegwerf-Container

!!! info "Was du lernst"
    - dass Daten in einem Container mit ihm gelöscht werden
    - warum das so gewollt ist

### Worum es geht

Aus [Übung 5](02-images.md) weißt du: Jeder Container schreibt in seine
eigene Schreibschicht. Diese Schicht gehört zum Container und verschwindet
mit ihm.

### Schritt für Schritt

Container starten und eine Datei darin anlegen:

```bash
docker run -d --name wegwerf alpine sleep 600
```

```bash
docker exec wegwerf sh -c "echo wichtig > /notiz.txt"
```

```bash
docker exec wegwerf cat /notiz.txt
```

```text
wichtig
```

Die Datei ist da. Jetzt den Container löschen und einen neuen mit
demselben Namen starten:

```bash
docker rm -f wegwerf
```

```bash
docker run -d --name wegwerf alpine sleep 600
```

```bash
docker exec wegwerf cat /notiz.txt
```

```text
cat: can't open '/notiz.txt': No such file or directory
```

Die Notiz ist weg.

### Was dahinter steckt

- `sh -c "…"` startet im Container eine Shell, die den Text in den
  Anführungszeichen als Befehl ausführt. Das braucht es hier, weil das
  `>` (in Datei schreiben) **im Container** passieren soll und nicht in
  deiner PowerShell.
- Gleicher Name heißt nicht gleicher Container. Der neue `wegwerf` ist
  ein frischer Container aus dem unveränderten Image.
- Das ist Absicht und eine Stärke von Containern: Jeder Neustart liefert
  einen bekannten, sauberen Zustand. Probleme durch „irgendwann mal von
  Hand geändert" gibt es nicht. Daten, die bleiben sollen, gehören
  deshalb bewusst **außerhalb** des Containers.

??? question "Kontrollfrage: Überlebt die Notiz ein `docker stop wegwerf` mit anschließendem `docker start wegwerf`?"
    Ja. Stoppen und Starten löscht den Container nicht, seine
    Schreibschicht bleibt erhalten. Verloren geht sie erst mit
    `docker rm`. Probier es aus.

### Aufräumen

```bash
docker rm -f wegwerf
```

---

## Übung 9: Das Volume: Daten außerhalb des Containers

!!! info "Was du lernst"
    - ein benanntes Volume anlegen und benutzen
    - dass zwei Container dieselben Daten sehen können
    - dass ein Volume das Löschen des Containers übersteht

### Worum es geht

Ein **Volume** ist ein Speicherbereich, den Docker verwaltet und der
**unabhängig** von jedem Container existiert. Du hängst ihn an eine
Stelle im Container ein. Alles, was dort geschrieben wird, landet im
Volume statt in der Schreibschicht.

### Schritt für Schritt

Volume anlegen:

```bash
docker volume create uebungsdaten
```

Ein erster Container schreibt eine Datei ins Volume. `-v uebungsdaten:/daten`
hängt das Volume im Container unter dem Ordner `/daten` ein, `--rm`
löscht den Container sofort wieder, wenn er fertig ist:

```bash
docker run --rm -v uebungsdaten:/daten alpine sh -c "echo Hallo aus Container 1 > /daten/gruss.txt"
```

Der Container ist schon gelöscht. Ein **zweiter, ganz neuer** Container
liest die Datei:

```bash
docker run --rm -v uebungsdaten:/daten alpine cat /daten/gruss.txt
```

```text
Hallo aus Container 1
```

Das Volume selbst siehst du hier:

```bash
docker volume ls
```

### Was dahinter steckt

- `-v name:/pfad` liest man wie beim Port: **außen:innen**. Links das
  Volume, rechts der Ordner im Container, an dem es erscheint.
- Das Volume lebt unabhängig von Containern. Es wird nur gelöscht, wenn
  du es ausdrücklich sagst (`docker volume rm`). Genau so bewahrt eine
  Datenbank im Container ihre Daten: Ihr Datenordner liegt auf einem
  Volume, wie im [Persistenz-Test mit Postgres](../docker-aufbau/praxis-multi-container.md#teil-3-daten-und-persistenz-erleben).
- Wo liegt das Volume physisch? In der Linux-VM von Docker Desktop, nicht
  in einem Ordner, den du im Explorer findest. Docker verwaltet es für
  dich. Wer Dateien direkt von seinem Rechner einbinden will, nimmt einen
  Bind Mount (nächste Übung).

??? question "Kontrollfrage: Was passiert, wenn du `docker volume rm uebungsdaten` ausführst, während ein Container es gerade benutzt?"
    Docker verweigert das mit `volume is in use`. Ein Volume lässt sich
    erst löschen, wenn kein Container mehr darauf zeigt, auch kein
    gestoppter. Das schützt vor versehentlichem Datenverlust.

### Aufräumen

```bash
docker volume rm uebungsdaten
```

---

## Übung 10: Der Bind Mount: ein Ordner deines Rechners im Container

!!! info "Was du lernst"
    - einen Ordner deines Rechners in einen Container einbinden
    - dass Änderungen sofort im Container sichtbar sind
    - wozu `:ro` (nur lesen) gut ist

### Worum es geht

Ein **Bind Mount** verbindet einen **Ordner deines Rechners** direkt mit
einem Ordner im Container. Beide sehen dieselben Dateien, live. So
lieferst du zum Beispiel eine eigene Webseite aus, ohne ein Image zu
bauen.

### Schritt für Schritt

Einen Übungsordner anlegen und hineinwechseln:

```bash
mkdir uebung-bindmount
```

```bash
cd uebung-bindmount
```

Eine kleine Webseite anlegen:

=== "Windows PowerShell"
    ```powershell
    Set-Content index.html "<h1>Hallo aus dem Bind Mount</h1>"
    ```

=== "Windows CMD"
    ```cmd
    echo ^<h1^>Hallo aus dem Bind Mount^</h1^>> index.html
    ```

=== "macOS / Linux"
    ```bash
    echo "<h1>Hallo aus dem Bind Mount</h1>" > index.html
    ```

Den Webserver starten und den aktuellen Ordner an die Stelle einbinden,
an der nginx seine Seiten sucht:

=== "Windows PowerShell"
    ```powershell
    docker run -d --name web-bind -p 8080:80 -v "${PWD}:/usr/share/nginx/html:ro" nginx:alpine
    ```

=== "Windows CMD"
    ```cmd
    docker run -d --name web-bind -p 8080:80 -v "%cd%:/usr/share/nginx/html:ro" nginx:alpine
    ```

=== "macOS / Linux"
    ```bash
    docker run -d --name web-bind -p 8080:80 -v "$(pwd):/usr/share/nginx/html:ro" nginx:alpine
    ```

Im Browser unter `http://localhost:8080` steht jetzt deine Überschrift.
Ändere die Datei, **ohne** den Container anzufassen:

=== "Windows PowerShell"
    ```powershell
    Set-Content index.html "<h1>Geaendert, ohne Neustart</h1>"
    ```

=== "Windows CMD"
    ```cmd
    echo ^<h1^>Geaendert, ohne Neustart^</h1^>> index.html
    ```

=== "macOS / Linux"
    ```bash
    echo "<h1>Geaendert, ohne Neustart</h1>" > index.html
    ```

Seite im Browser neu laden: Die Änderung ist sofort da.

Zum Schluss versuchst du, **aus dem Container heraus** eine Datei in den
eingebundenen Ordner zu schreiben:

```bash
docker exec web-bind sh -c "echo test > /usr/share/nginx/html/test.html"
```

```text
sh: can't create /usr/share/nginx/html/test.html: Read-only file system
```

### Was dahinter steckt

- Beim Bind Mount steht links ein **Pfad** statt eines Namens. Den
  aktuellen Ordner liefert dir die Shell: `${PWD}` in PowerShell, `%cd%`
  in CMD, `$(pwd)` unter macOS und Linux. Die Anführungszeichen schützen
  vor Leerzeichen im Pfad, etwa bei `C:\Users\Max Mustermann`.
- Der Container sieht deine Datei direkt, es gibt keine Kopie. Deshalb
  ist die Änderung ohne Neustart sichtbar. Das macht Bind Mounts ideal
  für Entwicklung und für Konfigurationsdateien.
- `:ro` steht für read-only. Der Container darf lesen, aber nichts
  verändern. Ein Webserver muss seine Seiten nur ausliefern, nie
  schreiben. Wird er angegriffen, kann er die Dateien auf deinem
  Rechner nicht manipulieren. Rechte so knapp wie möglich zu vergeben
  ist ein Grundprinzip der IT-Sicherheit.
- **Volume oder Bind Mount?** Für Daten, die ein Dienst selbst erzeugt
  (Datenbanken), das Volume: Docker verwaltet es und es ist unabhängig
  vom Dateisystem deines Rechners. Für Dateien, die **du** bereitstellst
  und bearbeitest (Webseiten, Konfiguration), den Bind Mount.

??? question "Kontrollfrage: Du löschst den Container `web-bind`. Was passiert mit deiner `index.html`?"
    Nichts. Die Datei gehört deinem Rechner, der Container hat sie nur
    eingebunden. Mit dem Container verschwindet nur die Verbindung, nicht
    der Ordner.

### Aufräumen

```bash
docker rm -f web-bind
```

```bash
cd ..
```

Den Ordner `uebung-bindmount` kannst du behalten oder im Explorer löschen.

---

## Selbst probieren

**Auftrag:** Zwei Container sollen sich **über ein Volume** eine Liste
teilen. Ein erster Container schreibt die Zeile `Eintrag von A` in eine
Datei `liste.txt`, ein zweiter ergänzt `Eintrag von B` in derselben
Datei, ein dritter gibt die ganze Liste aus.

**Geschafft, wenn:** der dritte Container beide Zeilen in der richtigen
Reihenfolge ausgibt.

??? tip "Hinweis"
    Aufbau wie in [Übung 9](#ubung-9-das-volume-daten-auerhalb-des-containers).
    `>` überschreibt eine Datei, `>>` hängt eine Zeile an. Mit `--rm`
    musst du die drei Container nicht einzeln löschen.

??? success "Lösung"
    ```bash
    docker volume create liste
    ```

    ```bash
    docker run --rm -v liste:/daten alpine sh -c "echo Eintrag von A > /daten/liste.txt"
    ```

    ```bash
    docker run --rm -v liste:/daten alpine sh -c "echo Eintrag von B >> /daten/liste.txt"
    ```

    ```bash
    docker run --rm -v liste:/daten alpine cat /daten/liste.txt
    ```

    ```text
    Eintrag von A
    Eintrag von B
    ```

    Aufräumen: `docker volume rm liste`
