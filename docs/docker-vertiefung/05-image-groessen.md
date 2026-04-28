---
title: "Image-Größen vergleichen"
description: "Dieselbe App, drei Basis-Images: node:22, node:22-slim, node:22-alpine. Welcher Unterschied steckt dahinter – und wann lohnt sich welche Variante?"
---

# Übung 5 – Image-Größen vergleichen

!!! abstract "Was du in dieser Übung lernst"
    - Wie stark sich die **Wahl des Basis-Images** auf die Image-Größe auswirkt
    - Warum `:slim` und `:alpine` deutlich kleiner sind – und was ihnen fehlt
    - Wie du **dieselbe App** mit drei verschiedenen Basis-Images baust und vergleichst
    - Warum „kleiner ist besser" für Produktion zwar oft stimmt, aber nicht immer

**Aufwand:** ca. 25 Minuten.

---

## Worum geht's

Wenn du `FROM node:22` schreibst, ziehst du ein Basis-Image, das von Debian-12 ausgeht und **die komplette Standard-Werkzeugkette** mitbringt: bash, apt, GCC, Build-Tools, Locales, Manpages. Das sind über **1 GB**, bevor deine eigene App auch nur ein einziges Byte beigetragen hat.

Es gibt zwei sinnvolle Wege, das Image kleiner zu kriegen:

- **`:slim`** – dieselbe Debian-Basis, aber **entschlackt**. Keine Manpages, keine Doku, keine Build-Tools. Funktioniert wie das normale Image, ist aber rund **3× kleiner**.
- **`:alpine`** – ein **anderes Linux**: Alpine Linux mit `musl` statt `glibc` und `apk` statt `apt`. Sehr klein (rund **5×** kleiner als das volle Image), aber: nicht alle Pakete sind sofort kompatibel, und manche Native-Module brauchen extra Build-Schritte.

In dieser Übung baust du dieselbe Mini-App **dreimal** und siehst die Größen direkt nebeneinander.

---

## Anleitung

### Schritt 1 – Projektordner anlegen

=== "macOS / Linux"
    ```bash
    mkdir -p ~/size-demo && cd ~/size-demo
    ```

=== "Windows PowerShell"
    ```powershell
    mkdir $HOME\size-demo
    cd $HOME\size-demo
    ```

=== "Windows CMD"
    ```cmd
    mkdir "%USERPROFILE%\size-demo"
    cd "%USERPROFILE%\size-demo"
    ```

### Schritt 2 – Mini-App schreiben

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

### Schritt 3 – Drei Dockerfiles für drei Basis-Images

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

Drei Dateien, identischer Inhalt – **nur die `FROM`-Zeile ist anders**.

### Schritt 4 – Drei Images bauen

```bash
docker build -f Dockerfile.full   -t size-demo:full   .
docker build -f Dockerfile.slim   -t size-demo:slim   .
docker build -f Dockerfile.alpine -t size-demo:alpine .
```

Beim ersten Mal werden alle drei Basis-Images aus Docker Hub gezogen – das dauert je nach Internet ein paar Minuten. **Wartezeit kannst du nutzen**, um die jeweilige Image-Description auf <https://hub.docker.com/_/node> nachzulesen.

### Schritt 5 – Größen vergleichen

```bash
docker images size-demo --format "table {{.Tag}}\t{{.Size}}"
```

Erwartet (Werte können je nach Architektur leicht abweichen, hier: Apple Silicon ARM64, April 2026):

```text
TAG       SIZE
alpine    228MB
slim      346MB
full      1.61GB
```

| Tag | Größe | Faktor zur Slim-Variante |
|---|--:|--:|
| `node:22` (full) | 1.61 GB | 4.7× |
| `node:22-slim` | 346 MB | 1× |
| `node:22-alpine` | 228 MB | 0.66× |

**Beobachtung:** Du bekommst denselben funktionalen Output – aber die Image-Größe schwankt um den **Faktor 7** zwischen full und alpine. Bei einer Cloud-Pipeline mit hunderten Image-Pulls pro Tag macht das einen großen Unterschied.

### Schritt 6 – Funktioniert auch jede Variante?

```bash
docker run -d --name s-full   -p 9001:3000 size-demo:full
docker run -d --name s-slim   -p 9002:3000 size-demo:slim
docker run -d --name s-alpine -p 9003:3000 size-demo:alpine
sleep 2
```

Im Browser oder mit curl/`Invoke-RestMethod`:

=== "macOS / Linux"
    ```bash
    curl http://localhost:9001/
    curl http://localhost:9002/
    curl http://localhost:9003/
    ```

=== "Windows PowerShell"
    ```powershell
    Invoke-RestMethod http://localhost:9001/
    Invoke-RestMethod http://localhost:9002/
    Invoke-RestMethod http://localhost:9003/
    ```

Erwartet jeweils:

```json
{"status":"ok","message":"Hallo aus Node!"}
```

Funktional **identisch**. Die App weiß nicht, auf welchem Linux sie läuft – und sie muss es auch nicht wissen.

### Schritt 7 – Aufräumen

```bash
docker rm -f s-full s-slim s-alpine
docker rmi size-demo:full size-demo:slim size-demo:alpine
```

Wenn du auch die Basis-Images loswerden willst (sparst dadurch ~2 GB):

```bash
docker rmi node:22 node:22-slim node:22-alpine
```

---

## Übung – Selber machen

!!! info "Aufgabe"
    Pack zur Mini-App eine **echte Abhängigkeit** dazu, die `npm install` aus `package.json` zieht – z.B. `express`. Vergleich, wie sich die Image-Größen jetzt entwickeln.

    **Vorgaben:**

    - In der `package.json` die Dependency `"express": "^4.21.0"` ergänzen.
    - In den drei Dockerfiles vor `COPY` ein `RUN npm install --omit=dev` einbauen.
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
        Beachte, dass `COPY package*.json ./` und `RUN npm install` **vor** `COPY index.js ./` stehen. So bleibt der `npm install`-Layer im Cache, solange sich `package.json` nicht ändert. Würdest du `COPY index.js .` als erstes machen, würde sich der Cache bei jeder Code-Änderung invalidieren – und npm install läuft jedes Mal neu.

    **Beobachtetes Ergebnis (April 2026, Apple Silicon):**

    ```text
    TAG       SIZE
    alpine    229MB    (+1 MB vs. ohne express)
    slim      349MB    (+3 MB)
    full      1.62GB   (+10 MB)
    ```

    Express ist klein. Bei größeren Apps (z.B. mit `puppeteer`, `sharp` oder native Module) verschiebt sich das Bild deutlicher – dann lohnt sich oft ein **Multi-Stage-Build** ([Profi-Block](../docker-profi/dockerfile-best-practices.md)).

---

## Wichtige Hinweise

??? warning "`alpine` ist nicht immer die richtige Wahl"
    Alpine nutzt `musl` statt `glibc`. Manche Native-Module (z.B. ältere `bcrypt`-Versionen, einige Image-Libraries) liefern keine fertigen Wheels für `musl` und müssen aus C-Quellen gebaut werden. Das kann Build-Zeiten **verlängern** und braucht zusätzlich `apk add --no-cache python3 make g++` als Build-Stage.

    Faustregel:

    - **Alpine** für statische Server-Binaries (Go, Rust) oder schlanke Node/Python-Apps mit reinen JS/Python-Abhängigkeiten.
    - **Slim** als sicherer Default für die meisten Webanwendungen.
    - **Full (Default)** nur, wenn du wirklich Build-Tools im Image brauchst – das ist **selten**.

??? info "Größe ≠ Sicherheit"
    Ein kleineres Image ist **tendenziell** sicherer (weniger Software = weniger Angriffsfläche), aber nicht automatisch. Was wirklich zählt: **welche Versionen** der Pakete drinstecken. Für ehrliche Aussagen darüber → [Trivy-Übung im Profi-Block](../docker-profi/uebungen.md).

---

## Was du danach kannst

- Den Effekt der **Basis-Image-Wahl** auf die Image-Größe greifbar machen.
- Drei `FROM`-Varianten (`node:22`, `node:22-slim`, `node:22-alpine`) bewusst gegeneinander abwägen.
- Verstehen, dass „kleiner = besser" eine Faustregel ist – mit Ausnahmen.
- Eigene Apps in der Image-Größe schrittweise verkleinern, ohne Funktionalität zu verlieren.

---

## Weiter

- Mehr zu Image-Optimierung im [Profi-Block](../docker-profi/image-optimierung.md)
- Multi-Stage-Builds für noch deutlich kleinere Images: [Best Practices](../docker-profi/dockerfile-best-practices.md)
- Zurück zur [Übersicht](index.md)
