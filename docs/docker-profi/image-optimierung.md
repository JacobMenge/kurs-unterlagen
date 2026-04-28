---
title: "Image-Optimierung"
description: "Alpine, Slim, Distroless – Basis-Images im Vergleich. Image-Größe analysieren, Layer optimieren, Vulnerability-Scanning mit Trivy."
---

# Image-Optimierung

!!! abstract "Lernziel"
    Nach dieser Seite kannst du:

    - die Basis-Images **debian, debian-slim, alpine, distroless** einschätzen
    - die **Größe** eines Images analysieren (`docker history`, `docker images`, Tools wie **dive**)
    - dein Image auf Sicherheits­lücken **scannen** (Trivy)
    - Kompromisse zwischen **Größe, Kompatibilität und Debugbarkeit** bewusst machen

---

## Warum das wichtig ist

Image-Größe wirkt sich aus auf:

1. **Deployment-Geschwindigkeit**: Ein 500-MB-Image wird pro Pull fünfmal langsamer gezogen als ein 100-MB-Image.
2. **Registry-Kosten**: Bei bezahlten Registries wächst der Speicher­bedarf mit jedem Tag.
3. **Angriffs­fläche**: Weniger Pakete im Image = weniger potenzielle Sicherheits­lücken.
4. **Boot-Zeit**: Kleinere Images laden schneller, z.B. in Serverless-Umgebungen (AWS Lambda, Google Cloud Run).
5. **Scanner-Reports**: Ein schlanker Alpine-Container hat oft 20 gelistete CVEs, ein volles Debian 400. Auch wenn davon vielleicht nur 3 relevant sind – du liest eben 400 Zeilen Report.

---

## Basis-Images im Vergleich

### Debian (full)

```dockerfile
FROM python:3.12
```

- **Größe**: ca. 1 GB
- **Inhalt**: kompletter Debian-Userspace, viele CLI-Tools, Debug-Werkzeuge
- **Pro**: Alles drin, nichts fehlt, Debugging ist einfach
- **Contra**: Unnötig groß für Produktion

**Einsatz:** nur noch, wenn du ein spezielles Tool aus Debian brauchst, das in den schlankeren Varianten fehlt.

### Debian Slim

```dockerfile
FROM python:3.12-slim
```

- **Größe**: ca. 160 MB
- **Inhalt**: abgespeckter Debian-Kern, ohne Dokumentation und extras
- **Pro**: Guter Kompromiss zwischen Größe und Kompatibilität. Paket-Manager `apt-get` funktioniert.
- **Contra**: Einige Tools fehlen und müssen nachinstalliert werden (z.B. `curl`, `ping`, `vim`).

**Einsatz:** die Standard-Wahl für Produktions-Images mit Python/Node/JVM.

### Alpine

```dockerfile
FROM python:3.12-alpine
```

- **Größe**: ca. 60 MB
- **Inhalt**: sehr schlanker Linux-Userspace basierend auf musl-libc statt glibc
- **Pro**: Winzig. Paket-Manager `apk` funktioniert.
- **Contra**: **Der musl-Unterschied** kann zu Problemen führen:
    - Manche Python-Pakete mit C-Extensions (z.B. `numpy`, `pandas`, `pillow`) werden nicht als Alpine-Wheels vertrieben → müssen aus Source kompiliert werden → sehr lange Builds und oft fehlende Headers.
    - DNS-Resolver verhält sich anders als glibc → seltene, aber knifflige Netzwerk-Fehler.
    - Manche Sprachen haben kleinere Performance-Unterschiede.

**Einsatz:** Go, Rust, statisch gelinkte Binaries – ideal. Python/Ruby/Node – geht, aber oft stößt man auf Ecken.

### Distroless (Google)

```dockerfile
FROM gcr.io/distroless/static-debian12
```

- **Größe**: wenige MB
- **Inhalt**: **Keine Shell, kein Paket-Manager, kein `apt`, kein `sh`**. Nur die Runtime und Zertifikate.
- **Pro**: Kleinste mögliche Angriffs­fläche. Für Produktions-Container, die nichts außer ihrer Binary brauchen.
- **Contra**: Kein `docker exec ... sh` – Debugging ist fast unmöglich ohne weitere Tricks.

**Einsatz:** Go-Binaries, Java-Jar, kompilierte Rust-Binaries. Immer mit Multi-Stage-Build, wo die erste Stage das Bauen erledigt.

**Varianten:**

- `distroless/static` – nur Binaries, keine Runtime (für Go)
- `distroless/cc` – mit libc (für C/C++)
- `distroless/java` – OpenJDK Runtime
- `distroless/python3` – Python 3 Runtime
- `distroless/nodejs` – Node Runtime

### Vergleichstabelle

| Basis-Image | Größe | Shell? | `apt`/`apk`? | Ideal für |
|-------------|-------|--------|--------------|-----------|
| `python:3.12` | ~1 GB | ja | ja | Development, Debugging |
| `python:3.12-slim` | ~160 MB | ja | ja | Standard-Produktion |
| `python:3.12-alpine` | ~60 MB | ja | ja (`apk`) | Wenn Abhängigkeiten mitspielen |
| `gcr.io/distroless/python3` | ~50 MB | **nein** | **nein** | Maximum Security, stabiler Build |
| `golang:1.22` | ~800 MB | ja | ja | Build-Stage, nicht Runtime |
| `gcr.io/distroless/static-debian12` | ~2 MB | **nein** | **nein** | Go-Binary in Runtime |

---

## Größe analysieren

### `docker images`

```bash
docker images
```

Zeigt alle Images mit Größe:

```text
REPOSITORY         TAG          IMAGE ID       CREATED         SIZE
kurs-app           1.0          abc123         1 minute ago    180MB
kurs-app-alpine    1.0          def456         1 minute ago    75MB
```

### `docker history`

Layer für Layer analysieren:

```bash
docker history kurs-app:1.0
```

```text
IMAGE          CREATED         CREATED BY                                   SIZE
abc123         1 minute ago    CMD ["python" "app.py"]                      0B
<missing>      1 minute ago    COPY app.py . # buildkit                     1.2kB
<missing>      1 minute ago    RUN pip install -r requirements.txt          100MB
<missing>      1 minute ago    COPY requirements.txt . # buildkit           32B
<missing>      3 weeks ago     /bin/sh -c set -ex  && apt-get update ...    80MB
```

Du siehst sofort, welcher Layer wie schwer ist. Der `pip install`-Layer zieht 100 MB – hier lohnt sich Optimierung am meisten.

### `dive` – interaktiver Image-Explorer

[Dive](https://github.com/wagoodman/dive) ist ein Tool, das pro Layer das **Dateisystem** zeigt. Du siehst, welche Dateien durch welchen Layer hinzugekommen sind und wie groß jede einzelne ist.

Installation:

=== "macOS (Homebrew)"
    ```bash
    brew install dive
    ```

=== "Linux (Ubuntu/Debian)"
    ```bash
    DIVE_VERSION=$(curl -sL "https://api.github.com/repos/wagoodman/dive/releases/latest" | grep '"tag_name":' | sed -E 's/.*"v([^"]+)".*/\1/')
    curl -OL "https://github.com/wagoodman/dive/releases/download/v${DIVE_VERSION}/dive_${DIVE_VERSION}_linux_amd64.deb"
    sudo apt install -y "./dive_${DIVE_VERSION}_linux_amd64.deb"
    ```

=== "Linux (RPM)"
    ```bash
    DIVE_VERSION=$(curl -sL "https://api.github.com/repos/wagoodman/dive/releases/latest" | grep '"tag_name":' | sed -E 's/.*"v([^"]+)".*/\1/')
    curl -OL "https://github.com/wagoodman/dive/releases/download/v${DIVE_VERSION}/dive_${DIVE_VERSION}_linux_amd64.rpm"
    sudo rpm -i "dive_${DIVE_VERSION}_linux_amd64.rpm"
    ```

=== "Windows (Scoop)"
    ```powershell
    scoop install dive
    ```

=== "Cross-Platform (Docker)"
    Ohne Installation, direkt mit Docker:
    ```bash
    docker run --rm -it \
      -v /var/run/docker.sock:/var/run/docker.sock \
      wagoodman/dive:latest <image>
    ```

Nutzung:

```bash
dive kurs-app:1.0
```

Dann navigierst du interaktiv durch deine Layer. Für echte Optimierung unverzichtbar.

---

## Klassische Optimierungen

### 1. Multi-Stage-Build nutzen

Siehe [Dockerfile-Best-Practices → Multi-Stage](dockerfile-best-practices.md). Oft der größte Hebel.

### 2. Build-Cache nicht mit ins Image

```dockerfile
# schlecht
RUN pip install -r requirements.txt                # cacht ~/.cache/pip im Image

# besser
RUN pip install --no-cache-dir -r requirements.txt # kein Cache

# alternativ
RUN pip install -r requirements.txt && \
    rm -rf /root/.cache
```

Gleiches Muster bei `npm`:

```dockerfile
RUN npm ci && npm cache clean --force
```

### 3. `apt-get`-Cache aufräumen

```dockerfile
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        curl git \
    && rm -rf /var/lib/apt/lists/*
```

Der `rm`-Teil räumt den Paket-Index (20–100 MB) weg.

### 4. `--no-install-recommends`

Bei Debian/Ubuntu werden ohne diese Option die **empfohlenen** Zusatzpakete mit­installiert. Die braucht man fast nie, und sie blähen das Image auf.

### 5. Dateien nicht kopieren, die man nicht braucht

Gute `.dockerignore`, wie in [Dockerfile-Best-Practices → Abschnitt 2](dockerfile-best-practices.md#2-dockerignore-schlank-halten) beschrieben.

### 6. Layer zusammenfassen, wo sinnvoll

```dockerfile
# schlecht: drei Layer, einer davon ist der Cache, der nicht aufgeräumt wird
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y git

# besser: ein Layer, Cache weg
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl git && \
    rm -rf /var/lib/apt/lists/*
```

---

## Sicherheit: Vulnerability-Scanning

Jedes Image erbt Sicherheits­lücken seines Basis-Image plus der Pakete, die du installierst. Ein regelmäßiger Scan hilft, Lücken früh zu entdecken.

### Trivy – der Standard

[Trivy](https://github.com/aquasecurity/trivy) ist das meistgenutzte Open-Source-Scan-Tool. Cross-Platform, schnell, vernünftige False-Positive-Rate.

Installation:

=== "macOS (Homebrew)"
    ```bash
    brew install trivy
    ```

=== "Linux (Ubuntu/Debian)"
    ```bash
    sudo apt-get install -y wget gnupg
    wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | sudo gpg --dearmor -o /usr/share/keyrings/trivy.gpg
    echo "deb [signed-by=/usr/share/keyrings/trivy.gpg] https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main" | sudo tee /etc/apt/sources.list.d/trivy.list
    sudo apt-get update
    sudo apt-get install -y trivy
    ```

=== "Windows (Scoop)"
    ```powershell
    scoop install trivy
    ```

=== "Cross-Platform (Docker)"
    Ohne Installation, direkt mit Docker:
    ```bash
    docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
      aquasec/trivy:latest image <image>
    ```

Image scannen:

```bash
trivy image kurs-app:1.0
```

Ausgabe (gekürzt):

```text
Total: 12 (UNKNOWN: 0, LOW: 5, MEDIUM: 4, HIGH: 2, CRITICAL: 1)

┌─────────────────┬────────────────┬──────────┬──────────────────┐
│ Library         │ Vulnerability  │ Severity │ Fixed Version    │
├─────────────────┼────────────────┼──────────┼──────────────────┤
│ libssl1.1       │ CVE-2024-xxxxx │ CRITICAL │ 1.1.1w-0+deb11u2 │
│ python3         │ CVE-2024-yyyyy │ HIGH     │ 3.12.1           │
└─────────────────┴────────────────┴──────────┴──────────────────┘
```

### Auf wichtige Vulnerabilities fokussieren

```bash
trivy image --severity HIGH,CRITICAL kurs-app:1.0
```

Gibt nur HIGH und CRITICAL zurück – das ist normalerweise das, was du priorisiert beheben willst.

### In CI/CD einbauen

In deinem GitHub-Actions-Workflow:

```yaml
- name: Trivy scan
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: 'ghcr.io/deine-user/deine-app:${{ github.sha }}'
    severity: 'HIGH,CRITICAL'
    exit-code: '1'
```

Schlägt der Scan Hochrisiko-CVEs, bricht der Build ab. Du musst erst patchen, bevor das Image deployed wird.

### Grype als Alternative

[Grype](https://github.com/anchore/grype) von Anchore ist eine gute Alternative zu Trivy, mit anderer Datenbank und manchmal abweichenden Ergebnissen. Im Zweifel **beide** laufen lassen.

---

## SBOM – Software Bill of Materials

Ein **SBOM** ist eine Liste aller Komponenten in deinem Image – vergleichbar mit den Zutaten­angaben auf einer Lebensmittel­verpackung.

Warum wichtig:

- Bei einer neuen CVE kannst du schnell prüfen, welche Images betroffen sind.
- Compliance-Anforderungen (NIS-2, Executive Order 14028 in den USA) erzwingen SBOMs für einige Branchen.

Erzeugen mit Syft (von Anchore):

```bash
syft kurs-app:1.0 -o spdx-json > sbom.json
```

Oder direkt in Docker selbst:

```bash
docker buildx build --sbom=true -t kurs-app:1.0 .
```

SBOMs sind ein wachsendes Thema. Für den heutigen Kursrahmen reicht es zu wissen, was das ist.

---

## Ein Beispiel: von 1 GB auf 80 MB

Ausgangspunkt:

```dockerfile
FROM python:3.12
COPY . /app
WORKDIR /app
RUN pip install -r requirements.txt
CMD ["python", "app.py"]
```

→ Image-Größe: **ca. 1 GB**.

### Schritt 1: Slim-Basis

```dockerfile
FROM python:3.12-slim
COPY . /app
WORKDIR /app
RUN pip install -r requirements.txt
CMD ["python", "app.py"]
```

→ ca. **260 MB**. Schon deutlich besser.

### Schritt 2: `--no-cache-dir` und `.dockerignore`

`.dockerignore`:
```
.git/
.venv/
node_modules/
__pycache__/
```

Dockerfile:
```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["python", "app.py"]
```

→ ca. **180 MB**.

### Schritt 3: Multi-Stage mit Slim

```dockerfile
FROM python:3.12-slim AS deps
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

FROM python:3.12-slim
WORKDIR /app
COPY --from=deps /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH
COPY . .
CMD ["python", "app.py"]
```

→ ca. **155 MB** (spart Build-Artefakte).

### Schritt 4: Alpine (wenn Abhängigkeiten mitspielen)

```dockerfile
FROM python:3.12-alpine AS deps
WORKDIR /app
COPY requirements.txt .
RUN apk add --no-cache build-base libffi-dev \
 && pip install --no-cache-dir --user -r requirements.txt

FROM python:3.12-alpine
WORKDIR /app
COPY --from=deps /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH
COPY . .
CMD ["python", "app.py"]
```

→ ca. **80 MB**.

**Faktor 12 kleiner** als das Ausgangsimage.

---

## Stolpersteine

??? warning "Alpine: Python-Pakete mit C-Extensions schlagen fehl"
    **Symptom:** `pip install pandas` unter Alpine läuft Minuten, scheitert mit seltsamen Compiler-Fehlern.

    **Ursache:** Auf PyPI gibt es vor-kompilierte Wheels nur für glibc, nicht für musl (Alpine). Pip baut dann aus Source, was Build-Tools und Entwicklungs-Header braucht, die im Alpine-Image fehlen.

    **Lösungsansätze:**

    1. Auf `python:3.12-slim` zurückwechseln. Ja, 100 MB größer, aber Builds laufen durch.
    2. Im Dockerfile die Build-Tools installieren:
       ```dockerfile
       RUN apk add --no-cache build-base libffi-dev postgresql-dev
       ```
       Das bläht das Image auf. Lösung: Multi-Stage – Build-Tools in Stage 1, Runtime in Stage 2.
    3. Alternative Basis-Images wie `python:3.12-slim-bookworm` mit speziell kleinen Ergänzungen.

??? warning "Distroless: ich kann nicht `exec` in den Container"
    **Symptom:** `docker exec -it app sh` scheitert mit „OCI runtime exec failed … no such file or directory".

    **Ursache:** Distroless-Images haben **keine Shell**. Das ist Absicht – aber auch das Debugging-Hindernis.

    **Lösungsansätze:**

    1. **Debug-Variante**: Google bietet neben `gcr.io/distroless/static-debian12` auch `:debug` an, mit einer minimalen busybox-Shell drin:
       ```dockerfile
       FROM gcr.io/distroless/static-debian12:debug
       ```
       Nur für Debugging, nicht für Produktion.
    2. **Ephemeral Debug Container** (Kubernetes-Feature): ein temporärer Sidecar mit Tools, der in denselben Namespace kommt wie dein Container.
    3. **Logs zentralisieren**: wenn du nicht in den Container kommst, müssen die Logs sprechen.

??? warning "Trivy meldet viele LOW/MEDIUM – überwältigend"
    **Realität:** Jedes Distro-Basis-Image hat dutzende CVEs, viele davon ohne praktische Auswirkung (betreffen Tools, die du nicht aufrufst).

    **Strategie:**

    - Fokus auf **HIGH und CRITICAL** mit existierendem Fix (`--severity HIGH,CRITICAL`).
    - Für den Rest: Tracking (z.B. in einem Issue-Tracker), aber nicht jede auflösen.
    - Base-Image-Updates regelmäßig einspielen – dann lösen sich viele CVEs automatisch.

??? info "Wann lohnt Alpine nicht?"
    Wenn du mehr als 30 Minuten pro Woche mit Alpine-spezifischen Problemen verbringst: Alpine lohnt sich nicht. Zeit ist teurer als 100 MB mehr pro Image.

    Alpine glänzt bei:

    - Einfachen Go- oder Rust-Binaries.
    - Einfachen Node-Apps ohne native Dependencies.
    - CI-Images, die nur ein paar Tools brauchen.

    Alpine nervt bei:

    - Python-Data-Science-Stacks.
    - Ruby on Rails mit vielen Gems.
    - Anwendungen, die auf glibc-spezifisches Verhalten setzen.

---

## Merksatz

!!! success "Merksatz"
    > **`-slim` ist die Standard-Wahl für Python/Node. `-alpine` lohnt nur, wenn deine Abhängigkeiten mitspielen. Distroless ist für kompilierte Sprachen die eleganteste Lösung. Und: immer scannen (Trivy/Grype), bevor du in Produktion gehst.**

---

## Weiterlesen

- [Stolpersteine](stolpersteine.md)
- [Merksätze](merksaetze.md)
