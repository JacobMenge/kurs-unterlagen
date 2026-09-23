---
title: "Training: Eigenes Image"
description: "Übungen 13 und 14: ein eigenes Image mit einem Dockerfile aus zwei Zeilen bauen und zwei Versionen davon nebeneinander betreiben."
---

# Eigenes Image

Zwei Übungen zum Dockerfile. Du baust ein Image, in dem deine eigene
Webseite fest hinterlegt ist. Danach erlebst du, wie Versionen eines
Images nebeneinander existieren.

---

## Übung 13: Ein Image aus zwei Zeilen

!!! info "Was du lernst"
    - ein Dockerfile anlegen und verstehen
    - mit `docker build` ein eigenes Image bauen
    - den Unterschied zum Bind Mount aus Übung 10

### Worum es geht

Ein **Dockerfile** ist das Rezept für ein Image: Jede Zeile ist eine
Anweisung. Du startest von einem vorhandenen Image und ergänzt, was du
brauchst. Hier: nginx plus deine eigene Startseite.

### Schritt für Schritt

Einen Übungsordner anlegen und hineinwechseln:

```bash
mkdir uebung-image
```

```bash
cd uebung-image
```

Die Webseite anlegen:

=== "Windows PowerShell"
    ```powershell
    Set-Content index.html "<h1>Mein erstes eigenes Image</h1>"
    ```

=== "Windows CMD"
    ```cmd
    echo ^<h1^>Mein erstes eigenes Image^</h1^>> index.html
    ```

=== "macOS / Linux"
    ```bash
    echo "<h1>Mein erstes eigenes Image</h1>" > index.html
    ```

Das Dockerfile anlegen, zwei Zeilen. Die Datei heißt exakt `Dockerfile`,
**ohne** Endung:

=== "Windows PowerShell"
    ```powershell
    Set-Content Dockerfile "FROM nginx:alpine"
    ```

    ```powershell
    Add-Content Dockerfile "COPY index.html /usr/share/nginx/html/index.html"
    ```

=== "Windows CMD"
    ```cmd
    echo FROM nginx:alpine> Dockerfile
    ```

    ```cmd
    echo COPY index.html /usr/share/nginx/html/index.html>> Dockerfile
    ```

=== "macOS / Linux"
    ```bash
    echo "FROM nginx:alpine" > Dockerfile
    ```

    ```bash
    echo "COPY index.html /usr/share/nginx/html/index.html" >> Dockerfile
    ```

!!! warning "Nicht mit Notepad oder dem Explorer anlegen"
    Beide hängen an eine Datei ohne Endung unsichtbar `.txt` an. Aus
    `Dockerfile` wird `Dockerfile.txt` und `docker build` findet nichts.
    Die Befehle oben umgehen das. Kontrolle: `dir` (CMD) oder `ls`
    (PowerShell, macOS, Linux) muss `Dockerfile` ohne Endung zeigen.

So sieht dein Dockerfile aus:

```dockerfile
FROM nginx:alpine
COPY index.html /usr/share/nginx/html/index.html
```

Bauen. `-t` gibt dem Image Namen und Tag. Der **Punkt am Ende** steht
für den aktuellen Ordner: Dort sucht Docker das Dockerfile und von dort
holt `COPY` die Dateien:

```bash
docker build -t meinweb:1.0 .
```

Die Ausgabe zeigt die Bauschritte `[1/2] FROM …` und `[2/2] COPY …`,
gegen Ende steht `naming to docker.io/library/meinweb:1.0`. Starten wie
jedes andere Image:

```bash
docker run -d --name meinweb -p 8080:80 meinweb:1.0
```

Unter `http://localhost:8080` steht deine Überschrift.

### Was dahinter steckt

- `FROM` legt das **Basis-Image** fest. Du fängst nie bei null an,
  sondern baust auf einem fertigen nginx auf.
- `COPY` kopiert eine Datei **beim Bauen** aus deinem Ordner ins Image.
  Pfad links: auf deinem Rechner, Pfad rechts: im Image.
- Der Punkt bei `docker build` ist der **Build-Kontext**: der Ordner, aus
  dem `COPY` Dateien holen darf. Liegt die `index.html` woanders, kann
  das Dockerfile sie nicht sehen.
- **Unterschied zum Bind Mount:** Beim Bind Mount ([Übung 10](04-daten.md))
  schaut der Container live in deinen Ordner. Hier ist die Seite **fest
  im Image hinterlegt**. Ändert sich die Datei auf deinem Rechner,
  merkt der laufende Container nichts. Dafür läuft das Image auf jedem
  Rechner gleich, ganz ohne deinen Ordner. So werden Anwendungen
  ausgeliefert.

??? question "Kontrollfrage: Du änderst die `index.html` und lädst den Browser neu. Siehst du die Änderung?"
    Nein. Das Image enthält eine Kopie der Datei vom Zeitpunkt des
    Bauens. Damit die Änderung ankommt, musst du neu bauen und einen
    neuen Container starten. Genau das machst du in der nächsten Übung.

### Aufräumen

Diesmal nur den Container, das Image brauchst du in Übung 14:

```bash
docker rm -f meinweb
```

Bleib im Ordner `uebung-image`.

---

## Übung 14: Zwei Versionen nebeneinander

!!! info "Was du lernst"
    - eine neue Version eines Images bauen
    - alte und neue Version parallel betreiben
    - warum Versionen im Betrieb Rückfälle einfach machen

### Worum es geht

Ein gebautes Image ändert sich nie mehr. Eine neue Version ist ein
**neues Image** mit neuem Tag. Die alte Version bleibt und steht bei
Bedarf sofort wieder bereit.

!!! note "Einstieg ohne Übung 13"
    Falls du hier einsteigst: Leg zuerst den Ordner, die `index.html` und
    das Dockerfile wie in [Übung 13](#ubung-13-ein-image-aus-zwei-zeilen)
    an und baue einmal `meinweb:1.0`.

### Schritt für Schritt

Die Webseite ändern:

=== "Windows PowerShell"
    ```powershell
    Set-Content index.html "<h1>Version 2</h1>"
    ```

=== "Windows CMD"
    ```cmd
    echo ^<h1^>Version 2^</h1^>> index.html
    ```

=== "macOS / Linux"
    ```bash
    echo "<h1>Version 2</h1>" > index.html
    ```

Neu bauen, diesmal mit dem Tag `2.0`:

```bash
docker build -t meinweb:2.0 .
```

Beide Versionen gleichzeitig starten, auf verschiedenen Ports:

```bash
docker run -d --name version1 -p 8081:80 meinweb:1.0
```

```bash
docker run -d --name version2 -p 8082:80 meinweb:2.0
```

`http://localhost:8081` zeigt „Mein erstes eigenes Image",
`http://localhost:8082` zeigt „Version 2". Beide Images liegen
nebeneinander:

```bash
docker images meinweb
```

```text
REPOSITORY   TAG   IMAGE ID       CREATED          SIZE
meinweb      2.0   ...            10 seconds ago   91.8MB
meinweb      1.0   ...            5 minutes ago    91.8MB
```

### Was dahinter steckt

- Images sind **unveränderlich**. Neu bauen überschreibt nichts, es
  entsteht ein weiteres Image. Darum laufen beide Versionen friedlich
  nebeneinander.
- Im Betrieb ist das die Grundlage für sichere Updates: Die neue Version
  geht live, die alte bleibt als Image liegen. Macht Version 2 Probleme,
  ist der Rückweg ein einziger Befehl mit dem alten Tag. Das nennt man
  **Rollback**.
- Docker merkt sich jeden Bauschritt im **Build-Cache**. In der Ausgabe
  steht deshalb `CACHED [1/2] FROM docker.io/library/nginx:alpine`: Das
  Basis-Image liegt schon auf deinem Rechner und wird nicht neu geladen.
  Neu ausgeführt wird nur `[2/2] COPY`, weil sich die Datei geändert hat.
  Baust du ein zweites Mal **ohne** Änderung, steht auch beim
  `COPY`-Schritt `CACHED` und der Build ist in einer Sekunde fertig.
- Die angezeigte Größe von 91,8 MB je Version täuscht: Beide teilen sich
  die Schichten von `nginx:alpine`. Neu gespeichert wird nur die kleine
  Schicht mit deiner `index.html`.

??? question "Kontrollfrage: Version 2 läuft als `meinweb` auf Port 8080 und hat einen Fehler. Wie kommst du in einer Minute zurück zu Version 1?"
    Den Container der fehlerhaften Version entfernen und das alte Image
    starten: `docker rm -f meinweb`, dann
    `docker run -d --name meinweb -p 8080:80 meinweb:1.0`. Nichts muss
    neu gebaut werden, denn `meinweb:1.0` liegt unverändert bereit.

### Aufräumen

```bash
docker rm -f version1 version2
```

```bash
docker rmi meinweb:1.0 meinweb:2.0
```

```bash
cd ..
```

---

## Selbst probieren

**Auftrag:** Baue ein Image `gruss:1.0` auf Basis von `alpine`, das beim
Start ohne weitere Angaben den Satz `Hallo aus meinem Image` ausgibt und
sich dann beendet. Dafür brauchst du eine dritte Dockerfile-Anweisung:
`CMD` legt den Startbefehl fest.

**Geschafft, wenn:** `docker run --rm gruss:1.0` den Satz ausgibt.

??? tip "Hinweis"
    Neuer Ordner, darin ein Dockerfile mit zwei Zeilen: `FROM alpine` und
    `CMD ["echo", "Hallo aus meinem Image"]`. Die eckigen Klammern sind
    die übliche Schreibweise: Programm und Argumente als Liste. In
    PowerShell setzt du die Zeile in **einfache** Anführungszeichen,
    weil sie selbst doppelte enthält.

??? success "Lösung"
    ```bash
    mkdir uebung-gruss
    ```

    ```bash
    cd uebung-gruss
    ```

    === "Windows PowerShell"
        ```powershell
        Set-Content Dockerfile "FROM alpine"
        ```

        ```powershell
        Add-Content Dockerfile 'CMD ["echo", "Hallo aus meinem Image"]'
        ```

    === "Windows CMD"
        ```cmd
        echo FROM alpine> Dockerfile
        ```

        ```cmd
        echo CMD ["echo", "Hallo aus meinem Image"]>> Dockerfile
        ```

    === "macOS / Linux"
        ```bash
        echo "FROM alpine" > Dockerfile
        ```

        ```bash
        echo 'CMD ["echo", "Hallo aus meinem Image"]' >> Dockerfile
        ```

    ```bash
    docker build -t gruss:1.0 .
    ```

    ```bash
    docker run --rm gruss:1.0
    ```

    ```text
    Hallo aus meinem Image
    ```

    Das ist [Übung 2](01-container.md) von der anderen Seite: `CMD` legt
    den Hauptprozess fest. Er ist fertig, sobald der Satz ausgegeben ist.
    Damit endet auch der Container.

    Aufräumen: `docker rmi gruss:1.0`, dann `cd ..`
