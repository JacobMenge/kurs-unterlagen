---
title: "Übungen"
description: "Eigene Hands-on-Übungen zum Docker-Einführungs-Block – vier Schwierigkeitsgrade vom Einsteiger bis zur Challenge."
---

# Übungen – Docker-Einführung

Hier sind Übungen, die du selbst ausprobieren kannst, um Docker zu vertiefen. Arbeite dich von leicht nach schwer.

!!! abstract "Die vier Stufen"
    - 🟢 **Einsteiger** – jeder Schritt im Detail erklärt, inklusive Kontext (was ist der Dienst, was macht er)
    - 🟡 **Mittel** – du kennst die Befehle, kombinierst sie
    - 🔴 **Fortgeschritten** – Hinweise statt Rezepte
    - 🏆 **Challenge** – Aufgabe ohne Lösung. Lösung aufklappbar

## Voraussetzung für alle Übungen

- **Docker installiert und gestartet** – siehe [Docker installieren](installation.md).
- Im Terminal klappt:
    ```bash
    docker version
    ```
- **Apple Silicon (M-Macs):** die meisten Übungen nutzen Images mit ARM-Support, laufen also nativ. Falls ein Befehl mal „exec format error" meldet, probier `--platform linux/amd64`.

---

## 🟢 Einsteiger

### Übung 2.1 – hello-world und erster nginx

!!! info "Was du lernst"
    - Was passiert bei `docker run`
    - Der erste eigene Webserver in einem Container
    - Der Unterschied zwischen Image und Container

#### Worum geht's – ganz einfach erklärt

Ein **Container** ist wie eine winzige, abgeschlossene Kiste auf deinem Rechner, in der eine Anwendung läuft. Die Kiste bringt alles mit, was die Anwendung braucht – Bibliotheken, Konfiguration, Dateien. Du kannst sie starten, stoppen, löschen.

Ein **Image** ist die Vorlage für eine solche Kiste. `nginx` ist z.B. ein Image, das einen **Webserver** enthält – das ist ein Programm, das im Browser aufgerufen werden kann und dann Seiten ausliefert. `hello-world` ist ein winziges Image, das nur „Hallo" sagt und dann beendet wird – perfekt zum Testen.

#### Schritt 1 – hello-world

```bash
docker run hello-world
```

Was passiert Schritt für Schritt:

1. Docker schaut lokal: Ist das Image `hello-world` da? → Nein.
2. Docker lädt es aus **Docker Hub** herunter (das ist der Standard-Image-Speicher im Internet).
3. Docker erzeugt aus dem Image einen Container.
4. Der Container läuft, druckt den Text, beendet sich.

Du siehst eine Begrüßung mit der Zeile „Hello from Docker!".

#### Schritt 2 – Container-Zustand anschauen

Laufende Container anzeigen:
```bash
docker ps
```

Wahrscheinlich leer – hello-world ist ja schon beendet.

**Alle** Container (auch beendete):
```bash
docker ps -a
```

Da siehst du den `hello-world`-Container mit `Exited (0)` – das heißt, er hat sauber beendet.

#### Schritt 3 – nginx starten

Jetzt etwas Nützlicheres:

```bash
docker run -d --name meinweb -p 8080:80 nginx
```

Die Flags erklärt:

| Flag | Bedeutung |
|------|-----------|
| `-d` | „Detached" – im Hintergrund, nicht im Terminal |
| `--name meinweb` | Fester Name statt zufälliger |
| `-p 8080:80` | Port-Mapping: Host-Port 8080 → Container-Port 80 |
| `nginx` | Image-Name (holt `nginx:latest` von Docker Hub) |

**Port-Mapping:** Der nginx-Webserver in der Kiste hört auf Port 80. Docker leitet Port 8080 deines Rechners an Port 80 der Kiste weiter.

#### Schritt 4 – Im Browser öffnen

Öffne im Browser: <http://localhost:8080>

Du siehst die nginx-Standardseite: **„Welcome to nginx!"**.

!!! success "Erkläre dir selbst, was gerade passiert"
    Dein Browser hat eine Anfrage an deinen Rechner (Port 8080) geschickt. Docker hat die Anfrage an den Container weitergeleitet. Dort hat nginx die Anfrage beantwortet und eine HTML-Seite zurückgeschickt. Ende.

#### Schritt 5 – In den Container reinschauen

```bash
docker exec -it meinweb bash
```

| Flag | Bedeutung |
|------|-----------|
| `exec` | Führe einen Befehl in einem **laufenden** Container aus |
| `-it` | Interaktiv mit Terminal-Anbindung |
| `meinweb` | Container-Name |
| `bash` | Der Befehl: eine Shell öffnen |

Du bist jetzt **in der Kiste**. Probiere:

```bash
ls /usr/share/nginx/html
cat /usr/share/nginx/html/index.html
exit
```

`exit` bringt dich zurück zum Host.

#### Schritt 6 – Logs anschauen

```bash
docker logs meinweb
```

Zeigt alles, was nginx seit dem Start auf Standardausgabe geschrieben hat – vor allem Zugriffs-Logs, wenn du im Browser was geklickt hast.

#### Schritt 7 – Stoppen und aufräumen

```bash
docker stop meinweb
docker rm meinweb
docker rm $(docker ps -aq)    # noch nicht gelöschten hello-world entfernen
```

=== "macOS / Linux"
    ```bash
    docker rm $(docker ps -aq)
    ```

=== "Windows PowerShell"
    ```powershell
    docker rm @(docker ps -aq)
    ```

!!! success "Geschafft!"
    Du hast zwei Container gestartet, einen davon sogar von außen (Browser) benutzt, einen von innen (Shell) angeschaut und alles sauber entfernt.

---

### Übung 2.2 – Eigene HTML-Seite im Container

!!! info "Was du lernst"
    - Bind Mount: eigene Dateien in einen Container „reinhängen"
    - Ohne eigenes Dockerfile trotzdem eigenen Inhalt ausliefern

#### Worum geht's

Du willst **nicht** die nginx-Standardseite zeigen, sondern deine eigene HTML-Seite. Die eleganteste Lösung: Du mountest deinen Ordner in den Container.

**Mount** bedeutet: „den Ordner von meinem Host in den Container einhängen, so als ob er dort hingehörte". Änderungen auf dem Host sind sofort im Container sichtbar.

#### Schritte

1. Neuen Ordner anlegen und hineinwechseln:

    === "macOS / Linux"
        ```bash
        mkdir -p ~/docker-uebung2
        cd ~/docker-uebung2
        ```

    === "Windows PowerShell"
        ```powershell
        mkdir $HOME\docker-uebung2
        cd $HOME\docker-uebung2
        ```

2. Eine HTML-Datei erzeugen:

    === "macOS / Linux"
        ```bash
        cat > index.html << 'EOF'
        <!DOCTYPE html>
        <html lang="de">
        <head><meta charset="UTF-8"><title>Meine Seite</title></head>
        <body><h1>Hallo aus meinem Container!</h1></body>
        </html>
        EOF
        ```

    === "Windows PowerShell"
        ```powershell
        @"
        <!DOCTYPE html>
        <html lang="de">
        <head><meta charset="UTF-8"><title>Meine Seite</title></head>
        <body><h1>Hallo aus meinem Container!</h1></body>
        </html>
        "@ | Set-Content index.html
        ```

3. Container mit Bind Mount starten:

    === "macOS / Linux"
        ```bash
        docker run -d --name meineseite \
          -v "$(pwd):/usr/share/nginx/html:ro" \
          -p 8080:80 \
          nginx
        ```

    === "Windows PowerShell"
        ```powershell
        docker run -d --name meineseite `
          -v "${PWD}:/usr/share/nginx/html:ro" `
          -p 8080:80 `
          nginx
        ```

    - `-v "<hostpfad>:/usr/share/nginx/html:ro"` – bindet deinen aktuellen Ordner in den Container ein, genau dort, wo nginx seine HTML-Dateien sucht. `:ro` = read-only.

4. Browser: <http://localhost:8080>. Du siehst **deine eigene** Seite.

5. **Live-Edit:** Ändere `index.html` in deinem Editor, speichere, lade den Browser neu – die Änderung ist sofort da. Das ist der Bind-Mount-Charme.

6. Aufräumen:
    ```bash
    docker stop meineseite
    docker rm meineseite
    ```

---

## 🟡 Mittel

### Übung 2.3 – Zwei Webserver gleichzeitig

!!! info "Was du lernst"
    - Mehrere Container parallel auf unterschiedlichen Ports
    - Verstehen, dass Container sich **gegenseitig nicht sehen** im Default-Bridge

#### Aufgabe

Starte **zwei** Container parallel:

- **nginx** auf Host-Port 8080
- **Apache httpd** auf Host-Port 8081

Öffne beide im Browser und vergleiche die Default-Seiten.

#### Hinweise

- Apache-Image heißt `httpd` (nicht `apache`).
- Achte auf unterschiedliche Container-Namen und unterschiedliche Host-Ports.
- Der Container-Port ist bei beiden 80.

??? tip "Wenn du nicht weiterkommst"
    ```bash
    docker run -d --name nginx -p 8080:80 nginx
    docker run -d --name httpd -p 8081:80 httpd
    docker ps
    ```
    Dann im Browser: <http://localhost:8080> und <http://localhost:8081>.

#### Aufräumen

```bash
docker stop nginx httpd
docker rm nginx httpd
```

---

### Übung 2.4 – Dein erstes eigenes Image bauen

!!! info "Was du lernst"
    - Ein `Dockerfile` schreiben
    - `docker build` ausführen
    - Layer-Caching beobachten

#### Aufgabe

Baue ein Image, das einen **personalisierten** nginx-Server startet – deine HTML-Seite ist dabei **im Image**, nicht als Mount. Dadurch kannst du das Image weitergeben.

#### Schritte (Rahmen)

1. Ordner `mein-nginx` anlegen.
2. Darin `index.html` mit eigenem Inhalt.
3. Darin ein `Dockerfile`:
    ```dockerfile
    FROM nginx:alpine
    COPY index.html /usr/share/nginx/html/index.html
    ```
4. Bauen:
    ```bash
    docker build -t mein-nginx:1.0 .
    ```
5. Starten:
    ```bash
    docker run -d --name test -p 8080:80 mein-nginx:1.0
    ```
6. Browser prüfen. Alles gut? → aufräumen.

#### Bonus

Ändere die `index.html`, baue neu, starte neu. Was passiert beim zweiten Build mit Cache?

---

## 🔴 Fortgeschritten

### Übung 2.5 – Ein nginx-Container liefert mehrere Seiten aus

!!! info "Was du lernst"
    - Dateisystem-Struktur innerhalb eines Web-Verzeichnisses
    - Browser-Routing auf Datei-Ebene

#### Aufgabe

Baue ein Image oder mounte einen Ordner, sodass **drei** Seiten aufrufbar sind:

- `/` → `index.html` (Startseite)
- `/about.html` → Info-Seite
- `/kontakt.html` → Kontakt-Seite

Die Seiten sollen sich **gegenseitig verlinken**.

#### Hinweise

- nginx liefert standardmäßig alle Dateien aus `/usr/share/nginx/html/` aus.
- Wenn der Browser `/about.html` anfragt, sucht nginx nach `/usr/share/nginx/html/about.html`.
- Keine komplizierte Konfiguration nötig.

#### Aufräumen

Alles stoppen, entfernen, das Image-Tag ebenfalls mit `docker rmi <name>`.

---

## 🏆 Challenge

### Challenge 2 – Dein Visitenkarten-Container

!!! abstract "Aufgabe"
    Erstelle ein eigenes Image namens `visitenkarte:1.0`, das einen nginx-Webserver mit folgendem Inhalt enthält:

    - `/` – eine Startseite mit deinem Namen, Ort, Hobbies und Links zu den Unterseiten
    - `/cv.html` – ein Mini-Lebenslauf (3 Stationen reichen)
    - `/projekte.html` – eine Liste von 2–3 erdachten Projekten mit Beschreibung
    - `/kontakt.html` – Kontakt-Infos (darfst du erfinden)

    Bonus-Anforderungen:

    1. Die Seiten haben einheitliches **CSS** (gleiches Look-and-Feel).
    2. Jede Unterseite hat einen Link „Zurück zur Startseite".
    3. Das Image basiert auf `nginx:alpine` (kleiner als `nginx:latest`).
    4. Du startest den Container auf Port **9000** mit dem Namen `meine-visitenkarte`.
    5. Du **räumst am Ende sauber auf** (Container stoppen + entfernen + Image entfernen).

??? success "Musterlösung"

    ### Schritt 1 – Projektordner anlegen

    === "macOS / Linux"
        ```bash
        mkdir -p ~/visitenkarte
        cd ~/visitenkarte
        ```

    === "Windows PowerShell"
        ```powershell
        mkdir $HOME\visitenkarte
        cd $HOME\visitenkarte
        ```

    !!! tip "Wie du die HTML-Dateien erzeugst"
        Die nachfolgenden Code-Blöcke zeigen den **Dateiinhalt**. So legst du sie an:

        **macOS / Linux**: mit einem Editor (VSCode, nano, vim) oder per `cat > dateiname.html << 'EOF'` / Inhalt / `EOF`.

        **Windows**: Dateien mit einem Editor (VSCode, Notepad, Notepad++) erstellen und den Inhalt aus den Code-Blöcken hineinkopieren. `cat > ... << 'EOF'` funktioniert in PowerShell **nicht** – nutze die Editor-Variante. Alternativ in PowerShell:
        ```powershell
        @"
        <Dateiinhalt hier>
        "@ | Set-Content dateiname.html
        ```

    ### Schritt 2 – Gemeinsames CSS

    Erzeuge eine Datei `style.css`:

    ```css
    body {
      font-family: system-ui, sans-serif;
      background: #0e1013;
      color: #e2ece6;
      max-width: 720px;
      margin: 2rem auto;
      padding: 1rem;
      line-height: 1.6;
    }
    h1 { color: #7dff9a; }
    a { color: #7dff9a; }
    nav a { margin-right: 1rem; }
    hr { border-color: #1f4a2b; }
    ```

    ### Schritt 3 – Startseite `index.html`

    ```html
    <!DOCTYPE html>
    <html lang="de">
    <head>
      <meta charset="UTF-8">
      <title>Visitenkarte – Jacob</title>
      <link rel="stylesheet" href="style.css">
    </head>
    <body>
      <h1>Jacob Menge</h1>
      <p>IT-Dozent · DevOps-Engineer · jacob-decoded.de</p>
      <p>Ort: München</p>
      <p>Hobbies: Coden, Kochen, Laufen</p>
      <nav>
        <a href="cv.html">Lebenslauf</a>
        <a href="projekte.html">Projekte</a>
        <a href="kontakt.html">Kontakt</a>
      </nav>
    </body>
    </html>
    ```

    ### Schritt 4 – `cv.html`

    ```html
    <!DOCTYPE html>
    <html lang="de">
    <head>
      <meta charset="UTF-8">
      <title>Lebenslauf</title>
      <link rel="stylesheet" href="style.css">
    </head>
    <body>
      <h1>Lebenslauf</h1>
      <ul>
        <li>2026 – heute: Selbstständig, Kurse und Consulting</li>
        <li>2023 – 2026: Cloud Engineer bei Firma X</li>
        <li>2020 – 2023: Junior Dev bei Firma Y</li>
      </ul>
      <p><a href="index.html">Zurück zur Startseite</a></p>
    </body>
    </html>
    ```

    ### Schritt 5 – `projekte.html`

    ```html
    <!DOCTYPE html>
    <html lang="de">
    <head>
      <meta charset="UTF-8">
      <title>Projekte</title>
      <link rel="stylesheet" href="style.css">
    </head>
    <body>
      <h1>Projekte</h1>
      <h2>Kursplattform</h2>
      <p>MkDocs-basierte Dokumentations-Site mit Auto-Deploy.</p>
      <h2>Monitoring-Stack</h2>
      <p>Prometheus + Grafana in Docker Compose.</p>
      <p><a href="index.html">Zurück zur Startseite</a></p>
    </body>
    </html>
    ```

    ### Schritt 6 – `kontakt.html`

    ```html
    <!DOCTYPE html>
    <html lang="de">
    <head>
      <meta charset="UTF-8">
      <title>Kontakt</title>
      <link rel="stylesheet" href="style.css">
    </head>
    <body>
      <h1>Kontakt</h1>
      <p>Web: <a href="https://jacob-decoded.de">jacob-decoded.de</a></p>
      <p>E-Mail: beispiel@jacob-decoded.de</p>
      <p><a href="index.html">Zurück zur Startseite</a></p>
    </body>
    </html>
    ```

    ### Schritt 7 – `Dockerfile`

    ```dockerfile
    FROM nginx:alpine
    COPY index.html cv.html projekte.html kontakt.html style.css /usr/share/nginx/html/
    ```

    ### Schritt 8 – Bauen und starten

    ```bash
    docker build -t visitenkarte:1.0 .
    docker run -d --name meine-visitenkarte -p 9000:80 visitenkarte:1.0
    ```

    ### Schritt 9 – Im Browser testen

    <http://localhost:9000> – Startseite mit Links zu allen Unterseiten.

    ### Schritt 10 – Aufräumen

    ```bash
    docker stop meine-visitenkarte
    docker rm meine-visitenkarte
    docker rmi visitenkarte:1.0
    ```

    **Lernpunkt:** Du hast gerade dein erstes eigenes Image gebaut, das echten, nutzbaren Inhalt ausliefert. Du könntest dieses Image in eine Registry pushen und jemand anderes könnte es mit einem einzigen `docker run` starten.

---

## Weiter mit

- [Docker-Aufbau](../docker-aufbau/index.md) – Volumes, ENV, Netzwerke, mit eigenen Übungen
- [Stolpersteine Docker](stolpersteine.md) – wenn was schiefläuft
