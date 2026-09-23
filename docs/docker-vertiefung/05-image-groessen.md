---
title: "Image-Größen vergleichen"
description: "Dieselbe App, drei Basis-Images: node:22, node:22-slim, node:22-alpine. Welcher Unterschied steckt dahinter und wann lohnt sich welche Variante?"
---

# Übung 5: Image-Größen vergleichen

!!! abstract "Was du in dieser Übung lernst"
    - Wie stark sich die **Wahl des Basis-Images** auf die Image-Größe auswirkt
    - Warum `:slim` und `:alpine` deutlich kleiner sind und was ihnen fehlt
    - Wie du **dieselbe App** mit drei verschiedenen Basis-Images baust und vergleichst
    - Warum „kleiner ist besser" für Produktion zwar oft stimmt, aber nicht immer

**Aufwand:** ca. 25 Minuten.

**Voraussetzung:** [Dockerfile-Grundlagen](../docker/dockerfile-grundlagen.md), vor allem `FROM`, `COPY` und das Layer-Caching.

---

## Worum geht's

Wenn du `FROM node:22` schreibst, ziehst du ein Basis-Image auf Debian-Basis, das **eine komplette Build-Werkzeugkette** mitbringt: bash, apt, gcc, make, git und viele Bibliotheken. Das sind über **1 GB**, bevor deine eigene App auch nur ein einziges Byte beigetragen hat.

Es gibt zwei sinnvolle Wege, das Image kleiner zu kriegen:

- **`:slim`**: dieselbe Debian-Basis, aber **entschlackt**. Keine Build-Tools, nur das Nötigste. Funktioniert wie das normale Image, ist aber um ein Vielfaches kleiner.
- **`:alpine`**: ein **anderes Linux**. Alpine Linux nutzt `musl` statt `glibc` und `apk` statt `apt`. Noch kleiner als slim, aber: nicht alle Pakete sind sofort kompatibel und manche Native-Module brauchen extra Build-Schritte.

In dieser Übung baust du dieselbe Mini-App **dreimal** und siehst die Größen direkt nebeneinander.

---

## Anleitung

### Schritt 1: Projektordner anlegen

=== "macOS / Linux"
    ```bash
    mkdir -p ~/size-demo && cd ~/size-demo
    ```

=== "Windows PowerShell"
    ```powershell
    mkdir -Force $HOME\size-demo
    cd $HOME\size-demo
    ```

=== "Windows CMD"
    ```cmd
    mkdir "%USERPROFILE%\size-demo"
    cd "%USERPROFILE%\size-demo"
    ```

!!! tip "Dateien unter Windows anlegen"
    Lege jede Datei in dieser Übung erst leer an und öffne sie dann in Notepad, zum Beispiel:

    ```powershell
    New-Item -ItemType File index.js
    notepad index.js
    ```

    Sonst hängt Notepad beim Speichern `.txt` an (`index.js.txt`, `Dockerfile.full.txt`) und der Build findet die Datei nicht. Mehr dazu unter [Dockerfile anlegen](../docker/praxis-eigenes-image.md#schritt-3-dockerfile-erstellen).

### Schritt 2: Mini-App schreiben

Lege eine Datei `index.js` mit einem winzigen Webserver an (kein npm-Modul, nur Node-Standard):

```js
const http = require('http');
const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'ok', message: 'Hallo aus Node!' }));
}).listen(PORT, '0.0.0.0', () => {
  console.log('Listening on port ' + PORT);
});
```

Und eine minimale `package.json`:

```json
{
  "name": "size-demo",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {"start": "node index.js"}
}
```

### Schritt 3: Drei Dockerfiles für drei Basis-Images

`Dockerfile.full`:

```dockerfile
FROM node:22
WORKDIR /app
COPY package.json index.js ./
EXPOSE 3000
CMD ["npm", "start"]
```

`Dockerfile.slim`:

```dockerfile
FROM node:22-slim
WORKDIR /app
COPY package.json index.js ./
EXPOSE 3000
CMD ["npm", "start"]
```

`Dockerfile.alpine`:

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package.json index.js ./
EXPOSE 3000
CMD ["npm", "start"]
```

Drei Dateien, identischer Inhalt, **nur die `FROM`-Zeile ist anders**.

!!! note "`npm start` und `docker stop`"
    Mit `CMD ["npm", "start"]` ist npm der Hauptprozess und reicht das Stopp-Signal nicht zuverlässig an Node weiter. `docker stop` wartet dann bis zum Timeout. Für diese Übung ist das egal, weil wir mit `docker rm -f` aufräumen. Für echte Images ist `CMD ["node", "index.js"]` die bessere Wahl, siehe [Signal-Handling](../docker-profi/dockerfile-best-practices.md#7-signal-handling).

### Schritt 4: Drei Images bauen

```bash
docker build -f Dockerfile.full   -t size-demo:full   .
docker build -f Dockerfile.slim   -t size-demo:slim   .
docker build -f Dockerfile.alpine -t size-demo:alpine .
```

Beim ersten Mal werden alle drei Basis-Images aus Docker Hub gezogen. Das dauert je nach Internet ein paar Minuten. **Wartezeit kannst du nutzen**, um die jeweilige Image-Description auf <https://hub.docker.com/_/node> nachzulesen.

### Schritt 5: Größen vergleichen

```bash
docker images size-demo --format "table {{.Tag}}\t{{.Size}}"
```

Beispielausgabe, gemessen auf Apple Silicon (ARM64):

```text
TAG       SIZE
alpine    228MB
slim      346MB
full      1.61GB
```

!!! note "Deine Zahlen weichen ab"
    Die Größen hängen von der Architektur (Windows-PCs meist amd64, Apple Silicon arm64), vom aktuellen Stand der Basis-Images und von der Speicherart in Docker Desktop ab. Entscheidend ist das Verhältnis, nicht die genaue Zahl.

| Tag | Größe im Beispiel | Verhältnis zu slim |
|---|--:|--:|
| `node:22` (full) | 1.61 GB | 4.7× |
| `node:22-slim` | 346 MB | 1× |
| `node:22-alpine` | 228 MB | 0.66× |

**Beobachtung:** Du bekommst denselben funktionalen Output, aber die Image-Größe schwankt im Beispiel etwa um den **Faktor 7** zwischen full und alpine. Bei einer Cloud-Pipeline mit hunderten Image-Pulls pro Tag macht das einen großen Unterschied.

### Schritt 6: Funktioniert auch jede Variante?

```bash
docker run -d --name s-full   -p 9001:3000 size-demo:full
docker run -d --name s-slim   -p 9002:3000 size-demo:slim
docker run -d --name s-alpine -p 9003:3000 size-demo:alpine
```

Warte ein, zwei Sekunden, dann im Browser oder mit curl:

=== "macOS / Linux"
    ```bash
    curl http://localhost:9001/
    curl http://localhost:9002/
    curl http://localhost:9003/
    ```

=== "Windows PowerShell / CMD"
    `curl.exe` ist in Windows 10 und 11 enthalten. In PowerShell ist `curl` ohne `.exe` ein Alias für ein anderes Kommando, deshalb die Endung mitschreiben:
    ```powershell
    curl.exe http://localhost:9001/
    curl.exe http://localhost:9002/
    curl.exe http://localhost:9003/
    ```

Erwartet jeweils:

```json
{"status":"ok","message":"Hallo aus Node!"}
```

Funktional **identisch**. Die App weiß nicht, auf welchem Linux sie läuft. Sie muss es auch nicht wissen.

### Schritt 7: Aufräumen

```bash
docker rm -f s-full s-slim s-alpine
docker rmi size-demo:full size-demo:slim size-demo:alpine
```

Wenn du auch die Basis-Images loswerden willst (sparst dadurch ~2 GB):

```bash
docker rmi node:22 node:22-slim node:22-alpine
```

---

## Übung: Selber machen

!!! info "Aufgabe"
    Pack zur Mini-App eine **echte Abhängigkeit** dazu, die `npm install` aus `package.json` zieht, z.B. `express`. Vergleich, wie sich die Image-Größen jetzt entwickeln.

    **Vorgaben:**

    - In der `package.json` die Dependency `"express": "^4.21.0"` ergänzen.
    - In den drei Dockerfiles zuerst `package.json` kopieren, dann `RUN npm install --omit=dev` ausführen und erst danach `index.js` kopieren. `npm install` braucht die `package.json` im Image, sonst weiß es nicht, was es installieren soll.
    - Erneut alle drei Images bauen und Größen vergleichen.

    **Frage:** Wie groß ist der **Aufschlag** durch die `node_modules` jeweils? Bleibt die Reihenfolge alpine < slim < full erhalten?

??? success "Musterlösung"

    `package.json`:
    ```json
    {
      "name": "size-demo",
      "version": "1.0.0",
      "main": "index.js",
      "scripts": {"start": "node index.js"},
      "dependencies": {
        "express": "^4.21.0"
      }
    }
    ```

    Eines der drei Dockerfiles, jeweils ähnlich:
    ```dockerfile
    FROM node:22-alpine
    WORKDIR /app
    COPY package*.json ./
    RUN npm install --omit=dev
    COPY index.js ./
    EXPOSE 3000
    CMD ["npm", "start"]
    ```

    !!! tip "Reihenfolge im Dockerfile zählt"
        Beachte, dass `COPY package*.json ./` und `RUN npm install` **vor** `COPY index.js ./` stehen. So bleibt der `npm install`-Layer im Cache, solange sich `package.json` nicht ändert. Würdest du `COPY index.js .` als erstes machen, würde sich der Cache bei jeder Code-Änderung invalidieren und npm install liefe jedes Mal neu.

    **Was du beobachten solltest:** Alle drei Images werden nur um wenige MB größer. Da in allen drei Varianten dieselben `node_modules` landen, ist der Aufschlag ungefähr gleich groß. Die Reihenfolge alpine < slim < full bleibt erhalten. `npm install` legt zusätzlich einen Download-Cache im Image ab. Mit `RUN npm install --omit=dev && npm cache clean --force` wird der Layer etwas kleiner.

    Express ist klein. Bei größeren Apps (z.B. mit `puppeteer`, `sharp` oder native Module) verschiebt sich das Bild deutlicher, dann lohnt sich oft ein **Multi-Stage-Build** ([Profi-Block](../docker-profi/dockerfile-best-practices.md#3-multi-stage-builds-kleine-sichere-images)).

---

## Wichtige Hinweise

??? warning "`alpine` ist nicht immer die richtige Wahl"
    Alpine nutzt `musl` statt `glibc`. Manche Native-Module (z.B. ältere `bcrypt`-Versionen, einige Image-Libraries) liefern keine vorgebauten Binärpakete für `musl` und müssen aus C-Quellen gebaut werden. Das kann Build-Zeiten **verlängern** und braucht zusätzlich `apk add --no-cache python3 make g++` als Build-Stage.

    Faustregel:

    - **Alpine** für statische Server-Binaries (Go, Rust) oder schlanke Node/Python-Apps mit reinen JS/Python-Abhängigkeiten.
    - **Slim** als sicherer Default für die meisten Webanwendungen.
    - **Full (Default)** nur, wenn du wirklich Build-Tools im Image brauchst. Das ist **selten**.

??? info "Größe ≠ Sicherheit"
    Ein kleineres Image ist **tendenziell** sicherer (weniger Software = weniger Angriffsfläche), aber nicht automatisch. Was wirklich zählt: **welche Versionen** der Pakete drinstecken. Für ehrliche Aussagen darüber → [Trivy-Übung im Profi-Block](../docker-profi/uebungen.md#ubung-5-image-mit-trivy-scannen-und-lucken-fixen).

---

## Was du danach kannst

- Den Effekt der **Basis-Image-Wahl** auf die Image-Größe greifbar machen.
- Drei `FROM`-Varianten (`node:22`, `node:22-slim`, `node:22-alpine`) bewusst gegeneinander abwägen.
- Verstehen, dass „kleiner = besser" eine Faustregel ist, mit Ausnahmen.
- Eigene Apps in der Image-Größe schrittweise verkleinern, ohne Funktionalität zu verlieren.

---

## Weiter

- Mehr zu Image-Optimierung im [Profi-Block](../docker-profi/image-optimierung.md)
- Multi-Stage-Builds für noch deutlich kleinere Images: [Best Practices](../docker-profi/dockerfile-best-practices.md#3-multi-stage-builds-kleine-sichere-images)
- Zurück zur [Übersicht](index.md)
