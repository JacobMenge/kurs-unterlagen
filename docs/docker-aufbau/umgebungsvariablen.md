---
title: "Umgebungsvariablen"
description: "Container konfigurieren ohne Rebuild: -e, --env-file, ENV im Dockerfile, .env-Dateien, Secrets-Abgrenzung."
---

# Umgebungsvariablen

!!! abstract "Lernziel"
    Nach dieser Seite kannst du:

    - erklären, **warum Umgebungsvariablen** die Standard-Konfigurations­sprache für Container sind
    - Variablen per `-e`, `--env-file` und im Dockerfile setzen – und weißt, wann welcher Weg sinnvoll ist
    - mit `.env`-Dateien arbeiten und ihre **Gefahren** (Git-Commit!) einschätzen
    - **Secrets** (Passwörter, Keys) von normalen Konfigurations­werten unterscheiden und wissen, warum dieser Unterschied wichtig ist

---

## Warum das wichtig ist

Dein Image sollte **unabhängig von der Umgebung** sein. Genau dasselbe Image soll auf deinem Laptop, dem Test-Server und der Produktion laufen – aber eben mit **unterschiedlichen Konfigurationen**:

- Datenbank-Hostname: `localhost` (Dev), `postgres.test.intern` (Test), `prod-db.eu-west-1.aws` (Produktion)
- API-Key: „Dev-Dummy", echter Test-Key, echter Produktions-Key
- Debug-Modus: an (Dev), aus (Produktion)
- Port: wechselnd

Würdest du für jeden dieser Werte das Image neu bauen, verlörst du den großen Docker-Vorteil: **ein Artefakt, beliebige Umgebungen**.

Die Lösung ist die **12-Factor-App-Regel Nr. 3**: **Konfiguration in Umgebungs­variablen.**

---

## Die drei Wege, ENV-Variablen zu setzen

### 1. `-e` beim `docker run`

```bash
docker run -d --name app \
  -e DATABASE_URL=postgres://db:5432/kurs \
  -e LOG_LEVEL=debug \
  -e FEATURE_FLAG_NEW_UI=true \
  meine-app
```

- Schnell, ideal für einzelne Werte.
- Wenn du viele Variablen hast, wird das lang.

### 2. `--env-file` mit einer Datei

Datei `app.env`:

```
DATABASE_URL=postgres://db:5432/kurs
LOG_LEVEL=debug
FEATURE_FLAG_NEW_UI=true
```

Run:

```bash
docker run -d --name app --env-file app.env meine-app
```

- Übersichtlicher bei vielen Werten.
- Kann in Git eingecheckt werden – aber **nur, wenn keine Secrets drin sind** (siehe unten).

### 3. `ENV` im Dockerfile

```dockerfile
FROM python:3.12-slim
ENV PYTHONUNBUFFERED=1 \
    LOG_LEVEL=info \
    APP_PORT=8000
COPY app.py /app/app.py
CMD ["python", "/app/app.py"]
```

- Ideal für **Werte, die als Default im Image stecken sollen**.
- Können beim `docker run` mit `-e` überschrieben werden.
- **Niemals Secrets** hier – sie landen im Image und sind für jeden sichtbar, der das Image lädt.

!!! tip "Faustregel"
    - **`ENV` im Dockerfile**: gute Default-Werte, die fast immer stimmen.
    - **`-e` oder `--env-file` beim Run**: spezifische Werte pro Umgebung.
    - **Überschreiben ist der Normalfall**: Dockerfile-ENV gibt den Default, Run-ENV gewinnt.

---

## `.env`-Dateien richtig nutzen

`.env` ist eine Datei mit `KEY=VALUE`-Zeilen, die Docker und Docker Compose automatisch lesen (bei Compose) oder die du explizit angibst (bei `--env-file`).

### Beispiel `.env`

```
# Datenbank
POSTGRES_USER=kurs
POSTGRES_PASSWORD=ichbinsehrgeheim
POSTGRES_DB=kursdaten

# App
APP_PORT=8000
LOG_LEVEL=debug
```

### Docker Compose liest `.env` automatisch

Wenn du mit Compose arbeitest, und in deinem Projekt­ordner eine `.env` liegt, wird sie vor dem Lesen der `compose.yaml` ausgewertet. Innerhalb der `compose.yaml` kannst du dann `${POSTGRES_PASSWORD}` schreiben, und dort wird der Wert aus der `.env` eingesetzt.

Mehr dazu in [Docker Compose – Grundlagen](../docker-compose/grundlagen.md).

### Der häufigste Fehler: `.env` in Git

!!! danger ".env gehört NICHT in Git!"
    Wenn in deiner `.env` **irgendein Secret** steht (Passwort, API-Key, Token), und du diese Datei in ein öffentliches Git-Repo pushst, ist das Secret **für alle Welt sichtbar**. Auch wenn du sie später löschst – Git behält die History.

    **Schutzmaßnahmen:**

    1. Direkt nach Projekt-Anlage in `.gitignore`:
       ```
       .env
       .env.*
       !.env.example
       ```
    2. Eine **`.env.example`** ohne echte Werte einchecken, damit andere wissen, welche Variablen sie brauchen:
       ```
       POSTGRES_USER=
       POSTGRES_PASSWORD=
       POSTGRES_DB=
       APP_PORT=
       ```
    3. Vor jedem `git push` kurz `git status` prüfen.

??? danger "Passiert: Secret ist schon in Git – was tun?"
    1. **Das Secret sofort rotieren** (neues Passwort/neuer API-Key generieren, altes deaktivieren).
    2. Im Repo das Secret **aus allen Branches entfernen** – idealerweise mit Tools wie `git-filter-repo` oder `BFG Repo-Cleaner`.
    3. Bei GitHub: Secret-Scanning-Alerts bearbeiten.

    Merke: in einem öffentlichen Repo gilt ein einmal geleaktes Secret als **kompromittiert**. Rotation ist die einzige saubere Lösung.

---

## Wie liest mein Container die Variablen?

Die Container-Anwendung liest Umgebungs­variablen wie jeder andere Prozess auch. Beispiele:

=== "Python"
    ```python
    import os
    db_url = os.environ.get("DATABASE_URL", "postgres://localhost/test")
    log_level = os.environ.get("LOG_LEVEL", "info")
    ```

=== "Node.js"
    ```javascript
    const dbUrl = process.env.DATABASE_URL || "postgres://localhost/test";
    const logLevel = process.env.LOG_LEVEL || "info";
    ```

=== "Shell"
    ```bash
    #!/bin/sh
    echo "Verbinde mit: ${DATABASE_URL:-postgres://localhost/test}"
    ```

=== "Go"
    ```go
    dbURL := os.Getenv("DATABASE_URL")
    if dbURL == "" {
        dbURL = "postgres://localhost/test"
    }
    ```

**Merke:** immer einen Default angeben – damit die App nicht crasht, wenn eine Variable vergessen wird.

---

## Prüfen, was im Container ankommt

Nach dem Start des Containers kannst du die ENV-Variablen einsehen:

```bash
docker exec app env
```

Gibt alle Variablen aus, die im Container gesetzt sind.

Oder gezielter:

```bash
docker exec app printenv DATABASE_URL
```

Praktisch, um zu prüfen, ob die Variable wirklich angekommen ist.

---

## Secrets – was ist der Unterschied?

Normale Konfigurations­werte:

- Datenbank-Host: `postgres`
- Port: `5432`
- Log-Level: `info`

Das sind **nicht-geheime Informationen**. Wer sie liest, kann damit nichts Schlimmes anstellen.

**Secrets** sind:

- Datenbank-Passwörter
- API-Keys (OpenAI, Stripe, AWS, …)
- OAuth-Client-Secrets
- Verschlüsselungs-Keys
- JWT-Signing-Keys

Werden diese Werte im **Image** hinterlegt, sind sie für **jeden** sichtbar, der das Image zieht. `docker image history` zeigt jede Dockerfile-Instruktion an. Ein API-Key in einer `ENV`-Zeile ist damit öffentlich.

### Richtige Handhabung von Secrets

!!! warning "Niemals in Image-Layern"
    **Keine Secrets** in:

    - `ENV` im Dockerfile
    - `LABEL` im Dockerfile
    - `COPY` einer Datei mit Secrets ins Image

!!! tip "Besser: erst zur Laufzeit reingeben"
    - `-e API_KEY=...` beim `docker run` – okay für Dev und kleine Setups.
    - `--env-file` mit einer Datei, die nicht in Git ist.
    - **Docker Secrets** (bei Docker Swarm) oder **Kubernetes Secrets** in Produktions-Orchestrierung.
    - **HashiCorp Vault**, **AWS Secrets Manager**, **1Password CLI** als Profi-Lösungen.

### Beispiel: API-Key richtig übergeben

Deine Anwendung braucht einen API-Key für ein externes Service.

**Falsch:**

```dockerfile
FROM python:3.12-slim
ENV OPENAI_API_KEY=sk-proj-...   # sichtbar für jeden, der das Image zieht!
COPY app.py /app/app.py
CMD ["python", "/app/app.py"]
```

**Richtig:** Kein Secret im Image, sondern beim Start mitgeben:

```dockerfile
FROM python:3.12-slim
# OPENAI_API_KEY wird zur Laufzeit gesetzt, nicht im Image
COPY app.py /app/app.py
CMD ["python", "/app/app.py"]
```

```bash
docker run -d \
  -e OPENAI_API_KEY=sk-proj-... \
  meine-app
```

Oder mit einer `.env`-Datei (die nicht in Git ist):

```bash
docker run -d --env-file .env meine-app
```

---

## Variablen-Vererbung und Reihenfolge

Was passiert, wenn derselbe Name an mehreren Stellen definiert ist? Docker hat eine klare Regel:

**„Später definiert → gewinnt."**

Reihenfolge:

1. **`ENV` im Dockerfile** (niedrigste Priorität – das sind Defaults).
2. **`-e`** beim `docker run` – überschreibt Dockerfile-ENV.
3. **`--env-file`** – Reihenfolge unter den Flags zählt, später gewinnt.
4. **Shell-Environment** (wenn du `-e VAR` ohne Wert schreibst) – übernimmt den Wert aus der aufrufenden Shell.

Beispiel:

```dockerfile
ENV LOG_LEVEL=info
```

```bash
docker run -e LOG_LEVEL=debug meine-app
```

→ Im Container gilt `LOG_LEVEL=debug`, weil `-e` nach dem Dockerfile kommt.

---

## Praktische Tipps

??? tip "Gemeinsame Variablen per Shell exportieren"
    Statt `-e` jedesmal zu tippen:

    ```bash
    export DATABASE_URL=postgres://db:5432/kurs
    docker run -e DATABASE_URL meine-app
    ```

    Das `-e DATABASE_URL` ohne Wert übernimmt den Wert aus der Shell.

??? tip "Mehrere Konfigurationen für Dev/Test/Prod"
    Lege dir Dateien an:

    ```text
    .env.dev
    .env.test
    .env.prod
    ```

    Und wähl je nach Umgebung:

    ```bash
    docker run --env-file .env.dev meine-app
    docker run --env-file .env.prod meine-app
    ```

    Compose macht das später noch eleganter mit `--env-file`-Flag oder mehreren `compose.override.yaml`-Dateien.

??? tip "Debug: welche Variablen sind im Container wirklich aktiv?"
    ```bash
    docker exec app env | sort
    ```

    Zeigt alles alphabetisch, leicht zu überprüfen. Besonders nützlich, wenn sich ein Wert nicht so verhält, wie du denkst.

??? warning "ENV-Variable in einem `RUN`-Schritt ausgewertet?"
    ```dockerfile
    ENV APP_VERSION=1.0
    RUN echo "Building Version ${APP_VERSION}"
    ```

    Ja, das funktioniert. Aber denk daran: der `RUN`-Schritt läuft **beim Build**, die Variable ist Teil des Image. Beim `docker run` mit `-e APP_VERSION=2.0` ist `/etc/app/version.txt` (falls dort vom Build geschrieben) immer noch `1.0`, denn der Build-Schritt ist schon gelaufen.

    Wenn du die Laufzeit-Version im Container willst, lies die Variable zur Laufzeit aus, nicht zur Build-Zeit.

---

## Stolpersteine

??? danger "Variable kommt nicht an – Wert ist leer"
    **Häufige Ursachen:**

    1. **Falsche Schreibweise** – ENV-Variablen sind case-sensitiv. `DATABASE_URL` ≠ `database_url`.
    2. **Anführungszeichen in `.env`** – `.env` nimmt Anführungszeichen **wörtlich**:
       ```
       POSTGRES_PASSWORD="geheim"   # Wert ist "geheim", mit Anführungszeichen!
       POSTGRES_PASSWORD=geheim     # Wert ist geheim, ohne Anführungszeichen
       ```
    3. **Leerzeichen um `=`** – `.env` erwartet `KEY=VALUE` ohne Leerzeichen:
       ```
       KEY = value   # FALSCH
       KEY=value     # RICHTIG
       ```

??? warning "`$`-Zeichen in Passwörtern werden „gefressen""
    In manchen Shells und in `compose.yaml` wird `$` als Variable interpretiert. Das kann zu kaputten Passwörtern führen.

    **Lösung** in `compose.yaml`: `$` verdoppeln:
    ```yaml
    environment:
      DB_PASSWORD: my$$secret$$pass
    ```

    In einer `.env`-Datei: `$` bleibt wörtlich.

    **Noch besser:** Passwörter ohne `$`, `` ` ``, `"` oder `'` wählen.

??? info "Variablen in Multi-Word-Werten"
    ```
    WELCOME_MESSAGE=Hallo Welt, alles gut
    ```

    Funktioniert so – kein Quoting nötig. Aber **keine Newlines**. Für mehrzeilige Werte (z.B. private Keys) nimmst du ein Volume, nicht eine ENV-Variable.

---

## Merksatz

!!! success "Merksatz"
    > **Konfiguration gehört in Umgebungs­variablen, nicht ins Image. Defaults im Dockerfile mit `ENV`, spezifische Werte beim Run mit `-e` oder `--env-file`. Secrets niemals ins Image – immer erst zur Laufzeit.**

---

## Weiterlesen

- [Docker-Netzwerke](docker-networks.md) – Container sprechen über Hostnamen, die oft aus ENV-Variablen kommen
- [Praxis: Postgres & Adminer](praxis-multi-container.md) – Volumes + ENV im Zusammenspiel
- [Docker Compose – Grundlagen](../docker-compose/grundlagen.md) – Compose liest `.env` automatisch
