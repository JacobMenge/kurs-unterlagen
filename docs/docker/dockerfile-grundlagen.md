---
title: "Dockerfile – Grundlagen"
description: "Die wichtigsten Dockerfile-Instruktionen (FROM, WORKDIR, COPY, RUN, CMD) mit klaren Beispielen und einer soliden Erklärung."
---

# Dockerfile – Grundlagen

!!! abstract "Lernziel"
    Nach dieser Seite kannst du:

    - ein **einfaches Dockerfile** lesen und verstehen
    - die Instruktionen **FROM**, **WORKDIR**, **COPY**, **RUN**, **EXPOSE**, **CMD**, **ENV** einordnen
    - den **Unterschied zwischen RUN und CMD** erklären
    - erklären, was der **Build-Kontext** ist

---

## Warum das wichtig ist

Bisher haben wir fertige Images verwendet. Das reicht nur so weit, wie jemand anderes das Image gebaut hat, was wir brauchen. Sobald du **eigene Anwendungen** in Container stecken willst, brauchst du ein **Dockerfile** – das Rezept, nach dem ein Image gebaut wird.

---

## Was ist ein Dockerfile?

Ein **Dockerfile** ist eine Textdatei mit Anweisungen, wie ein Image gebaut werden soll. Der Dateiname ist exakt so: `Dockerfile` – ohne Endung. Docker liest diese Datei von oben nach unten und erzeugt Schritt für Schritt ein Image.

---

## Ein Minimal-Dockerfile

Schauen wir uns ein kurzes Beispiel an:

```dockerfile
FROM python:3.12-slim

WORKDIR /app
COPY app.py .

CMD ["python", "app.py"]
```

Vier Zeilen. Was passiert hier?

1. **`FROM python:3.12-slim`** – nimm das offizielle Python-3.12-Image (Slim-Variante, etwa 160 MB) als Basis.
2. **`WORKDIR /app`** – setze das Arbeitsverzeichnis im Image auf `/app`. Wenn der Ordner nicht existiert, wird er angelegt.
3. **`COPY app.py .`** – kopiere die Datei `app.py` vom Host (aus dem Build-Kontext) ins aktuelle Arbeitsverzeichnis des Images (also `/app`).
4. **`CMD ["python", "app.py"]`** – wenn aus diesem Image ein Container gestartet wird, führe diesen Befehl aus.

Das war’s. Dieses Dockerfile ergibt ein lauffähiges Image.

---

## Die wichtigsten Instruktionen

### `FROM` – die Basis

Jedes Dockerfile **muss** mit `FROM` anfangen. Es legt fest, auf welchem Image du aufbaust:

```dockerfile
FROM nginx:1.27-alpine
```

- Typische Basisimages: `ubuntu`, `debian`, `alpine`, `python`, `node`, `openjdk`, `golang`.
- Die **Alpine-Varianten** sind sehr klein (10–30 MB), dafür fehlen viele Tools und einige Pakete verhalten sich anders.
- Wenn du **wirklich bei Null** anfangen willst: `FROM scratch` – ein leeres Image ohne Dateisystem. Nur für sehr spezielle Fälle.

### `WORKDIR` – das Arbeitsverzeichnis

```dockerfile
WORKDIR /app
```

- Setzt das Arbeitsverzeichnis für alle nachfolgenden Instruktionen.
- Legt den Ordner automatisch an, wenn er fehlt.
- Kann mehrfach vorkommen. Jedes `WORKDIR` ist **relativ zum vorigen**, wenn kein absoluter Pfad angegeben ist.

Faustregel: das erste Mal absoluten Pfad, danach relativ.

### `COPY` – Dateien ins Image bringen

```dockerfile
COPY app.py .
COPY src/ ./src/
COPY requirements.txt .
```

- Erster Parameter: **Quelle im Build-Kontext** (also in dem Ordner, aus dem du `docker build` aufrufst).
- Zweiter Parameter: **Ziel im Image**.
- Der Ziel-Pfad ist relativ zu `WORKDIR`, wenn er mit `.` oder `./` anfängt.

??? note "`COPY` vs. `ADD` – wann braucht man `ADD`?"
    Beide Instruktionen kopieren Dateien ins Image. Der Unterschied:

    | Instruktion | Was sie zusätzlich kann |
    |-------------|-------------------------|
    | `COPY app.py .` | nichts Besonderes – nur kopieren |
    | `ADD archive.tar.gz .` | entpackt das Tar-Archiv automatisch |
    | `ADD https://example.com/file.txt .` | lädt direkt von einer URL |

    **Best Practice: nimm `COPY`**, es sei denn du brauchst explizit eine der `ADD`-Sonderfähigkeiten. `COPY` macht sichtbar, was passiert – `ADD` versteckt Tar-/Download-Logik. Für URLs ist es sowieso robuster, `RUN curl -fsSL https://…` zu schreiben, weil du Fehler behandeln kannst.

### `RUN` – beim Build ausführen

```dockerfile
RUN apt-get update && apt-get install -y curl
RUN pip install --no-cache-dir -r requirements.txt
```

- `RUN` führt den angegebenen Befehl **während des Builds** aus und **friert das Ergebnis als neuen Layer ein**.
- Typische Einsätze: Pakete installieren, Abhängigkeiten ziehen, Code kompilieren.
- Alles, was `RUN` verändert, ist danach **Teil des Images**.

!!! tip "Layer-Optimierung"
    Jedes `RUN` erzeugt einen eigenen Layer. Viele kurze `RUN`-Zeilen werden oft in **einen einzigen Befehl** mit `&&` zusammengefasst, um Layer zu sparen. Das macht Images kleiner.

    **Schlecht** – drei Layer, Paket-Index bleibt oft liegen:
    ```dockerfile
    RUN apt-get update
    RUN apt-get install -y curl
    RUN apt-get install -y git
    ```

    **Besser** – ein Layer, Cache aufgeräumt:
    ```dockerfile
    RUN apt-get update \
        && apt-get install -y --no-install-recommends curl git \
        && rm -rf /var/lib/apt/lists/*
    ```

### `CMD` – Default-Befehl beim Start

```dockerfile
CMD ["python", "app.py"]
```

- `CMD` sagt: „Wenn dieses Image zu einem Container wird, führe **diesen Befehl** aus."
- `CMD` läuft **nicht während des Builds**, sondern **beim Start eines Containers**.
- **Wichtigster Unterschied zu `RUN`**: `RUN` → Bauzeit, `CMD` → Laufzeit.

**Formen von CMD:**

- `CMD ["python", "app.py"]` – Exec-Form (empfohlen, JSON-Array)
- `CMD python app.py` – Shell-Form (läuft in einer `/bin/sh -c`-Shell)

Die Exec-Form ist die bessere Wahl, weil sie sauber mit Signalen umgeht (z.B. `Ctrl+C`, `docker stop`).

Ein Dockerfile darf nur **eine `CMD`-Zeile** haben. Wenn du mehrere schreibst, zählt nur die letzte.

### `EXPOSE` – dokumentieren, welcher Port offen ist

```dockerfile
EXPOSE 80
```

- `EXPOSE` ist **reine Dokumentation**. Es öffnet **keinen Port**.
- Es signalisiert Entwicklern und Orchestrierungs-Tools: „Dieses Image hört auf Port 80."
- Die eigentliche Freigabe machst du beim Start mit `-p` (siehe nächste Seiten).

### `ENV` – Umgebungsvariablen

```dockerfile
ENV APP_PORT=8080
ENV PYTHONUNBUFFERED=1
```

- Setzt Umgebungsvariablen, die **im Image und im laufenden Container** verfügbar sind.
- Typisch für Konfigurationsflags, Spracheinstellungen, Laufzeit-Parameter.
- Man kann sie beim Start mit `docker run -e KEY=value` überschreiben.

---

## Ein vollständigeres Beispiel

Eine simple Python-Anwendung mit Abhängigkeiten:

```dockerfile
# 1) Basis-Image
FROM python:3.12-slim

# 2) Metadaten (optional, aber nett)
LABEL maintainer="jacob@jacob-decoded.de"

# 3) Arbeitsverzeichnis
WORKDIR /app

# 4) Abhängigkeiten zuerst (für besseres Caching)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 5) Anwendungs-Code
COPY app.py .

# 6) Umgebungsvariable setzen
ENV PYTHONUNBUFFERED=1

# 7) Port dokumentieren
EXPOSE 8000

# 8) Start-Befehl
CMD ["python", "app.py"]
```

**Warum `requirements.txt` vor `app.py` kopieren?**

Docker cached jeden Layer. Wenn du deine `app.py` änderst, aber `requirements.txt` gleich bleibt, wird der (teure) `pip install`-Layer aus dem Cache genommen – der Build dauert Sekunden statt Minuten. Ändert sich dagegen `requirements.txt`, muss `pip install` neu laufen, aber das ist dann auch korrekt.

!!! tip "Reihenfolge = Cache-Strategie"
    Lege selten geänderte Dinge (Abhängigkeiten) **vor** oft geänderte Dinge (Quellcode). Das spart dir täglich viele Minuten.

---

## Der Build-Kontext

Wenn du `docker build -t mein-bild .` aufrufst, ist der Punkt am Ende **nicht** dekorativ. Er ist das wichtigste Argument: **der Build-Kontext**.

Der Build-Kontext ist der **Ordner**, der komplett an den Docker-Daemon geschickt wird. Alles, was du in `COPY` referenzierst, muss **innerhalb** dieses Ordners liegen.

### `.dockerignore`

Ähnlich wie `.gitignore` kann eine `.dockerignore`-Datei Dateien ausschließen, die **nicht** in den Build-Kontext sollen. Beispiel:

```
.git/
node_modules/
*.log
__pycache__/
.env
```

Das macht Builds schneller und verhindert, dass versehentlich **Secrets** ins Image geraten.

---

## Der Bauvorgang Schritt für Schritt

Wenn du im Verzeichnis mit einem Dockerfile stehst:

```bash
docker build -t mein-bild:1.0 .
```

was passiert:

1. Docker verpackt den Inhalt des Kontext-Ordners und schickt ihn zum Daemon.
2. Der Daemon liest das Dockerfile Zeile für Zeile.
3. Für jede Instruktion wird ein **neuer Layer** erzeugt (oder aus dem Cache gezogen, wenn nichts sich geändert hat).
4. Am Ende steht ein Image mit dem Tag `mein-bild:1.0`.

Du kannst das Ergebnis kontrollieren:

```bash
docker images | grep mein-bild
```

Und starten:

```bash
docker run -p 8000:8000 mein-bild:1.0
```

---

## Was wir in diesem Kurs bewusst weglassen

Das Dockerfile-Universum ist groß. Für den Einstieg reicht das, was oben steht. Was wir **bewusst auslassen** (und sich für eine Vertiefung eignen):

- **`ENTRYPOINT`** – verwandt mit `CMD`, aber mit anderem Verhalten. Für Anfänger oft verwirrend.
- **Multi-Stage-Builds** – Images kleiner machen, indem Build-Tools und Laufzeit-Umgebung getrennt werden.
- **`ARG`** – Build-Zeit-Variablen.
- **`HEALTHCHECK`** – automatische Gesundheitsprüfung.
- **`USER`** – als unprivilegierter Benutzer laufen (sinnvoll für Produktion).

Alles Themen für den nächsten Kursblock. Für heute: `FROM`, `WORKDIR`, `COPY`, `RUN`, `CMD`, `EXPOSE`, `ENV` reichen, um ernsthaft anzufangen.

---

## Merksatz

!!! success "Merksatz"
    > **`RUN` läuft beim Bauen des Images, `CMD` beim Start des Containers. Alles, was du im Container haben willst, muss per `COPY` vom Host ins Image gekommen sein.**

---

## Weiterlesen

- [Erste Schritte](erste-schritte.md) – wir starten jetzt wirklich Container
- [Praxis: eigenes Image](praxis-eigenes-image.md) – Dockerfile live anwenden
