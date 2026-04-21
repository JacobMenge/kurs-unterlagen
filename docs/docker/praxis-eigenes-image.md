---
title: "Praxis: dein eigenes Image"
description: "Schritt-für-Schritt ein eigenes nginx-Image mit eigener HTML-Seite bauen, starten, Cache beobachten und sauber aufräumen."
---

# Praxis: dein eigenes Image bauen

!!! abstract "Ziel"
    Am Ende dieser Anleitung hast du:

    - ein **eigenes Docker-Image** gebaut, das eine selbstgeschriebene HTML-Seite ausliefert
    - den **Build-Prozess** mit Layer-Cache einmal gesehen
    - deinen eigenen Container im **Browser** aufgerufen
    - alles wieder **sauber entfernt**

## Voraussetzungen

- Docker läuft (`docker version` klappt). Wenn nicht → [Docker installieren](installation.md).
- Ein Terminal.
- Ein **Editor** für Texte (VSCode, Sublime, nano, vim, egal).
- Kleine Lust, HTML zu schreiben (oder kopieren).

??? info "Ich habe noch nie ein `Dockerfile` gesehen – was ist das?"
    Ein `Dockerfile` ist ein Text-Rezept, aus dem Docker ein Image baut. Eine ausführliche Erklärung findest du unter [Dockerfile – Grundlagen](dockerfile-grundlagen.md). Für diese Übung reicht es, das Beispiel unten zu kopieren und den Ablauf mitzumachen.

---

## Schritt 1 – Projekt­ordner anlegen

Wir arbeiten in einem frischen Ordner, damit der Build-Kontext klar ist:

=== "macOS / Linux / WSL"
    ```bash
    mkdir mein-bild
    cd mein-bild
    ```

=== "Windows PowerShell"
    ```powershell
    mkdir mein-bild
    cd mein-bild
    ```

=== "Windows CMD"
    ```cmd
    mkdir mein-bild
    cd mein-bild
    ```

!!! note "Windows-Hinweis"
    In dieser Anleitung verwenden wir **Unix-Shell-Syntax** (Bash). In Windows PowerShell funktionieren die meisten Befehle (`mkdir`, `cd`, `ls`) ähnlich, weil PowerShell Aliase dafür kennt. Bei komplexeren Konstrukten wie `$(pwd)` oder `docker ps -q | xargs …` zeigen wir die PowerShell-Variante zusätzlich.

---

## Schritt 2 – HTML-Seite erstellen

Lege eine Datei namens `index.html` an, z.B. mit `nano index.html` (oder deinem Lieblings-Editor):

```html
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <title>Mein erster Container</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      background: #0e1013;
      color: #7dff9a;
      display: grid;
      place-items: center;
      height: 100vh;
      margin: 0;
    }
    h1 { font-size: 3rem; }
    p  { opacity: 0.8; }
  </style>
</head>
<body>
  <div>
    <h1>Hallo aus dem Container!</h1>
    <p>Das hier liefert <strong>nginx</strong> aus einem Docker-Image aus.</p>
  </div>
</body>
</html>
```

Speichern und schließen.

---

## Schritt 3 – Dockerfile erstellen

Im **selben Ordner** legst du eine Datei namens `Dockerfile` an – **ohne Endung**, exakt so geschrieben:

```dockerfile
FROM nginx:alpine

COPY index.html /usr/share/nginx/html/index.html
```

Zwei Zeilen:

1. **`FROM nginx:alpine`** – nimm das offizielle nginx-Image in der Alpine-Variante. Alpine-Linux ist ein sehr kleines Linux, das ganze Image ist nur ca. 20 MB groß.
2. **`COPY index.html /usr/share/nginx/html/index.html`** – kopiere unsere HTML-Datei an den Pfad, unter dem nginx die Default-Seite ausliefert. Damit wird unsere Seite zur neuen Startseite.

Mehr muss das Dockerfile nicht. Kein `CMD` – denn das Basis-Image `nginx:alpine` hat bereits ein passendes `CMD` gesetzt, das nginx im Vordergrund startet. Das haben wir von der Basis geerbt.

---

## Schritt 4 – Kontrolle: was liegt im Ordner?

```bash
ls -la
```

Du solltest sehen:

```text
Dockerfile
index.html
```

Zwei Dateien – das reicht.

---

## Schritt 5 – Image bauen

```bash
docker build -t mein-bild:1.0 .
```

??? warning "Fehler: „failed to compute cache key: \"/index.html\" not found""
    Der Build findet deine `index.html` nicht.

    **Häufige Ursache:** Du bist nicht im richtigen Ordner. Prüfe:
    ```bash
    pwd        # bin ich in mein-bild?
    ls -la     # liegt Dockerfile UND index.html hier?
    ```
    Der Punkt am Ende von `docker build -t mein-bild:1.0 .` ist der **Build-Kontext** – also der Ordner, aus dem `COPY` Dateien nimmt.

??? warning "Build hängt beim Schritt „Pulling nginx:alpine""
    Image-Download ist langsam oder blockiert.

    **Lösung:** Etwas warten, evtl. den Pull manuell vorab machen:
    ```bash
    docker pull nginx:alpine
    docker build -t mein-bild:1.0 .
    ```
    Im Firmennetz mit Proxy: Docker Desktop → Settings → Resources → Proxies eintragen.

Was jeder Teil bedeutet:

| Teil | Bedeutung |
|------|-----------|
| `docker build` | baue ein Image |
| `-t mein-bild:1.0` | benenne das Image `mein-bild` mit Tag `1.0` |
| `.` | der Build-Kontext ist das **aktuelle Verzeichnis** (der Punkt!) |

Erwartete Ausgabe (gekürzt):

```text
[+] Building 2.3s (7/7) FINISHED
 => [internal] load build definition from Dockerfile
 => [internal] load .dockerignore
 => [internal] load metadata for docker.io/library/nginx:alpine
 => [1/2] FROM docker.io/library/nginx:alpine
 => [internal] load build context
 => [2/2] COPY index.html /usr/share/nginx/html/index.html
 => exporting to image
 => => naming to docker.io/library/mein-bild:1.0
```

**Das sollte schnell gehen** (< 10 Sekunden beim ersten Mal, wenn das Basis-Image bereits lokal ist – sonst plus Download).

### Kontrolle

```bash
docker images | grep mein-bild
```

Du siehst:

```text
mein-bild   1.0   abcd1234   5 seconds ago   22MB
```

22 MB für den **ganzen Container**, inklusive Alpine-Linux und nginx. Ziemlich schlank.

---

## Schritt 6 – Container starten

```bash
docker run -d --name mein-web -p 9000:80 mein-bild:1.0
```

Gleiches Muster wie bei den offiziellen Images, nur mit **unserem** Image-Namen und Port **9000** (damit es keine Konflikte mit den Übungen der vorigen Seite gibt).

Im Browser: <http://localhost:9000>

Du solltest deine eigene Seite sehen – „Hallo aus dem Container!" auf dunklem Grund mit Phosphor-Grün.

---

## Schritt 7 – Die HTML ändern und Cache beobachten

Öffne `index.html` nochmal. Ändere den Überschriften-Text:

```html
<h1>Hallo aus meinem zweiten Build!</h1>
```

Speichern. Nun bauen wir neu:

```bash
docker build -t mein-bild:1.1 .
```

Achte auf die Ausgabe: Du siehst, dass Docker beim **FROM**-Schritt sagt `CACHED`:

```text
 => CACHED [1/2] FROM docker.io/library/nginx:alpine
 => [internal] load build context
 => [2/2] COPY index.html /usr/share/nginx/html/index.html
```

Der erste Layer (Basis-Image) wird nicht neu geladen – er liegt schon lokal, und nichts hat sich daran geändert. Nur der `COPY`-Layer wird neu gebaut, weil wir die Datei geändert haben.

**Das ist Layer-Caching in Aktion.**

### Neuen Container mit Version 1.1 starten

Den alten stoppen und entfernen:

```bash
docker stop mein-web
docker rm mein-web
```

Neuen starten:

```bash
docker run -d --name mein-web -p 9000:80 mein-bild:1.1
```

Browser neu laden: der neue Text erscheint.

---

## Schritt 8 – Mehrere Varianten parallel

Starten wir zum Spaß beide Versionen auf unterschiedlichen Ports:

```bash
docker stop mein-web
docker rm mein-web

docker run -d --name v1 -p 9001:80 mein-bild:1.0
docker run -d --name v2 -p 9002:80 mein-bild:1.1
```

Browser:

- <http://localhost:9001> → alte Version
- <http://localhost:9002> → neue Version

Aus **einem** Dockerfile und zwei Builds laufen **zwei unabhängige Container** mit unterschiedlichem Inhalt. Genau das macht Docker so nützlich.

---

## Schritt 9 – Aufräumen

Container stoppen:

```bash
docker stop v1 v2
```

Container entfernen:

```bash
docker rm v1 v2
```

Eigenes Image entfernen:

```bash
docker rmi mein-bild:1.0 mein-bild:1.1
```

Kontrolle:

```bash
docker ps -a           # keine mein-web-Container mehr
docker images          # keine mein-bild-Einträge mehr
```

Falls du auch das nginx-Alpine-Basis­image loswerden willst (optional):

```bash
docker rmi nginx:alpine
```

---

## Typische Fehler an dieser Stelle

### „Dockerfile not found"

```text
ERROR: failed to solve: failed to read dockerfile: open ... no such file
```

Ursache: du bist nicht im richtigen Ordner. Check mit `pwd` und `ls -la`, ob deine `Dockerfile` wirklich da liegt, wo du gerade bist.

### „port is already allocated"

```text
Error response from daemon: driver failed programming external connectivity on endpoint
...: Bind for 0.0.0.0:9000 failed: port is already allocated
```

Ein anderer Container (oder ein anderes Programm) nutzt schon Port 9000. Entweder den Blockierer finden und stoppen, oder einfach einen anderen Port wählen, z.B. `-p 9001:80`.

### Änderungen erscheinen nicht im Browser

Ursache: du hast `index.html` geändert, aber **den alten Container** noch laufen. Der alte Container benutzt das **alte Image** mit der alten Datei. Neues Image bauen, alten Container entfernen, neuen starten – wie oben beschrieben.

Alternative ohne Rebuild: ein **Bind Mount** von deinem Host-Ordner in den Container. Das ist das Thema für den nächsten Kursblock, wenn wir Volumes durchgehen.

---

## Was du jetzt kannst

- Eigene Images aus einem Dockerfile bauen.
- Verstehst, was Build-Kontext und Layer-Cache sind.
- Deine eigenen Container starten, stoppen, entfernen.
- Mehrere Versionen des gleichen Images parallel laufen lassen.

Das ist schon sehr ordentlich fürs erste Mal. Alles, was ab hier kommt (Volumes, Netzwerke, Docker Compose, Multi-Stage-Builds), ist eine Erweiterung genau dieses Grundmusters.

---

## Merksatz

!!! success "Merksatz"
    > **`docker build -t <name>:<tag> .` → Image bauen. `docker run -d --name <n> -p <host>:<container> <name>:<tag>` → Container starten. Der Rest ist Variation.**

---

## Weiterlesen

- [Stolpersteine Docker](stolpersteine.md) – wenn etwas nicht geht
- [Merksätze – Docker](merksaetze.md)
- [Cheatsheet Docker](../cheatsheets/docker.md)
