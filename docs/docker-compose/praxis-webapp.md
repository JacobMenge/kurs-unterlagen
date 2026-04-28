---
title: "Praxis: Compose-WebApp"
description: "Den Multi-Container-Stack aus der manuellen Praxis komplett mit docker compose neu bauen – und sehen, wie viel einfacher das Leben wird."
---

# Praxis: WebApp mit Docker Compose

!!! abstract "Ziel"
    Am Ende dieser Anleitung hast du:

    - einen Stack mit **eigener Flask-App + Postgres + Adminer** mit **einer** `compose.yaml` gebaut
    - gelernt, wie `docker compose up`, `down`, `logs`, `ps`, `exec` im Alltag funktionieren
    - gesehen, wie **`depends_on` + `healthcheck`** den „DB noch nicht bereit"-Fehler eliminiert
    - ein Gefühl dafür, wie wenig Aufwand das Aufsetzen eines Stacks mit Compose ist

!!! info "Anknüpfung an Block 3"
    In [Block 3](../docker-aufbau/index.md) hast du mit `docker run` Postgres + Adminer zusammengeschraubt. Heute schreiben wir denselben Stack als `compose.yaml` und erweitern ihn um eine **eigene Flask-App**, die mit der Datenbank spricht.

## Voraussetzungen

- Docker und `docker compose` laufen (`docker compose version` klappt). Siehe [Installation](../docker/installation.md).
- Ein Editor.
- Ca. **45–60 Minuten** Zeit für die volle Praxis.
- Falls aus Block 3 noch Container laufen, einmal aufräumen:

    === "macOS / Linux"
        ```bash
        docker stop adminer db app 2>/dev/null
        docker rm   adminer db app 2>/dev/null
        docker network rm kurs-netz 2>/dev/null
        ```

    === "Windows PowerShell"
        ```powershell
        docker stop adminer db app 2>$null
        docker rm   adminer db app 2>$null
        docker network rm kurs-netz 2>$null
        ```

    === "Windows CMD"
        ```cmd
        docker stop adminer db app 2>nul
        docker rm adminer db app 2>nul
        docker network rm kurs-netz 2>nul
        ```

---

## Schritt 1 – Projekt­ordner

Wir starten mit einem frischen Ordner:

=== "macOS / Linux"
    ```bash
    mkdir kurs-compose
    cd kurs-compose
    ```

=== "Windows PowerShell"
    ```powershell
    mkdir kurs-compose
    cd kurs-compose
    ```

=== "Windows CMD"
    ```cmd
    mkdir kurs-compose
    cd kurs-compose
    ```

---

## Schritt 2 – Python-App und Dockerfile

Die beiden Dateien kennst du schon aus der manuellen Einheit. Erstelle sie wieder:

**`app.py`:**

```python
import os
from flask import Flask
import psycopg

app = Flask(__name__)
DATABASE_URL = os.environ["DATABASE_URL"]


def init_db():
    with psycopg.connect(DATABASE_URL) as conn:
        with conn.cursor() as cur:
            cur.execute("""
                CREATE TABLE IF NOT EXISTS zaehler (
                  id INT PRIMARY KEY,
                  wert INT
                );
            """)
            cur.execute("""
                INSERT INTO zaehler (id, wert) VALUES (1, 0)
                ON CONFLICT (id) DO NOTHING;
            """)
            conn.commit()


@app.route("/")
def index():
    with psycopg.connect(DATABASE_URL) as conn:
        with conn.cursor() as cur:
            cur.execute("UPDATE zaehler SET wert = wert + 1 WHERE id = 1 RETURNING wert;")
            (wert,) = cur.fetchone()
            conn.commit()
    return f"<h1>Hallo Kurs!</h1><p>Diese Seite wurde {wert} mal geöffnet.</p>"


if __name__ == "__main__":
    init_db()
    app.run(host="0.0.0.0", port=8000)
```

**`requirements.txt`:**

```text
flask==3.0.3
psycopg[binary]==3.2.1
```

**`Dockerfile`:**

```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .

EXPOSE 8000

CMD ["python", "app.py"]
```

---

## Schritt 3 – `.env` mit Secrets

Eine Datei `.env` im Projekt­ordner:

```
POSTGRES_USER=kurs
POSTGRES_PASSWORD=einGutesPasswort
POSTGRES_DB=kursdaten
```

!!! danger "Nicht in Git einchecken!"
    Lege jetzt gleich eine `.gitignore` an mit:

    ```
    .env
    ```

    Damit die Secrets nie ins Repo wandern. Siehe [Umgebungsvariablen → .env und Git](../docker-aufbau/umgebungsvariablen.md).

Zusätzlich eine `.env.example` (ohne echte Werte), die du einchecken kannst:

```
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
```

So sieht jeder, der das Projekt klont, welche Variablen er ausfüllen muss.

---

## Schritt 4 – Die `compose.yaml`

Jetzt der eigentliche Unterschied zu früher. Erstelle eine Datei namens `compose.yaml`:

```yaml
services:

  db:
    image: postgres:16
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres-daten:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 5s
      timeout: 3s
      retries: 10
      start_period: 10s

  app:
    build: .
    restart: unless-stopped
    environment:
      DATABASE_URL: postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}
    ports:
      - "8000:8000"
    depends_on:
      db:
        condition: service_healthy

volumes:
  postgres-daten:
```

Lass uns das durchgehen:

- **`services:`** hat zwei Einträge: `db` und `app`.
- Die `db` nutzt `postgres:16`, hat einen Healthcheck und ein benanntes Volume.
- Die `app` wird aus dem lokalen `Dockerfile` gebaut (`build: .`).
- Die `${...}`-Variablen kommen aus der `.env`, die Compose automatisch liest.
- `depends_on` mit `condition: service_healthy` sorgt dafür, dass die App **erst startet, wenn die DB gesund ist**.
- Das Top-Level-`volumes:` deklariert `postgres-daten`, damit Compose weiß, dass das Volume von ihm verwaltet werden soll.

---

## Schritt 5 – Stack starten

Ein einziger Befehl:

```bash
docker compose up -d
```

Das passiert jetzt:

1. Compose liest die `compose.yaml`.
2. Liest die `.env` und ersetzt `${POSTGRES_PASSWORD}` usw.
3. Legt ein Netzwerk `kurs-compose_default` an.
4. Legt das Volume `kurs-compose_postgres-daten` an (falls nicht schon vorhanden).
5. Baut das App-Image aus deinem Dockerfile.
6. Startet den `db`-Container.
7. Wartet, bis der Healthcheck grün ist.
8. Startet den `app`-Container.

Du siehst in der Ausgabe Zeile für Zeile, was passiert. Das Ganze dauert beim ersten Mal ca. 1 Minute (wegen `pip install` im Build). Beim zweiten Mal Sekunden.

---

## Schritt 6 – Prüfen, was läuft

```bash
docker compose ps
```

Ausgabe (gekürzt):

```text
NAME                   IMAGE                STATUS                     PORTS
kurs-compose-app-1     kurs-compose-app     Up 5 seconds               0.0.0.0:8000->8000/tcp
kurs-compose-db-1      postgres:16          Up 20 seconds (healthy)    5432/tcp
```

Beide laufen. Der Status `(healthy)` zeigt, dass der Healthcheck greift.

---

## Schritt 7 – Im Browser öffnen

<http://localhost:8000>

```
Hallo Kurs!
Diese Seite wurde 1 mal geöffnet.
```

Refresh: die Zahl geht hoch.

---

## Schritt 8 – Logs schauen

Alle Logs zusammen, farbig pro Service:

```bash
docker compose logs -f
```

`-f` bedeutet „follow", also live mitlesen. `Ctrl+C` beendet nur das Mitlesen, nicht die Container.

Nur die App:

```bash
docker compose logs -f app
```

Nur die DB, letzte 50 Zeilen:

```bash
docker compose logs --tail 50 db
```

---

## Schritt 9 – In einen Service springen

In die App:

```bash
docker compose exec app bash
```

Jetzt bist du in der App-Shell. `exit` bringt dich zurück.

In die Datenbank direkt mit `psql`:

```bash
docker compose exec db psql -U kurs -d kursdaten
```

In der `psql`-Shell:

```sql
SELECT * FROM zaehler;
\q
```

---

## Schritt 10 – Persistenz-Test (wie vorher, jetzt einfacher)

Wir werfen alles weg – aber **nur Container, nicht Volume**:

```bash
docker compose down
```

Check, dass alles weg ist:

```bash
docker compose ps        # leer
docker volume ls         # postgres-daten noch da
```

Jetzt wieder hoch:

```bash
docker compose up -d
```

Browser neu laden: der Zähler läuft beim alten Stand weiter. **Das Volume hat überlebt, Compose kennt es.**

---

## Schritt 11 – Änderungen am App-Code

Ändere eine Zeile in `app.py`, z.B. die Begrüßung:

```python
return f"<h1>Hallo Jacob!</h1><p>Diese Seite wurde {wert} mal geöffnet.</p>"
```

Dann:

```bash
docker compose up -d --build
```

`--build` erzwingt ein neues App-Image. Der DB-Container bleibt unangetastet (keine Änderung an seinem Eintrag), nur `app` wird neu gebaut und ersetzt.

Browser neu laden: die neue Begrüßung erscheint, der Zähler läuft weiter.

---

## Schritt 12 – Komplettes Aufräumen

Wenn du die Übung beendest und **alle Daten** wegräumen willst:

```bash
docker compose down -v
```

Das `-v` löscht auch die Volumes. Danach `docker compose up -d` würde mit einer frischen DB starten (Zähler bei 0).

Falls du das App-Image auch loswerden willst:

```bash
docker rmi kurs-compose-app
```

---

## Vergleich: manuell vs. Compose

Was war nötig?

| Schritt | Manuell | Compose |
|---------|---------|---------|
| Netzwerk anlegen | `docker network create kurs-netz` | automatisch |
| DB starten | `docker run -d --name db --network … -v … -e … postgres:16` | in `compose.yaml` deklariert |
| App bauen | `docker build -t kurs-app:1.0 .` | `build: .` |
| App starten | `docker run -d --name app --network … -e … -p … kurs-app:1.0` | in `compose.yaml` deklariert |
| Starten gesamt | 3 Befehle + Ausharren | 1 Befehl |
| Zustand prüfen | `docker ps`, manuell filtern | `docker compose ps` |
| Alles aufräumen | jeweils `stop` + `rm` + `network rm` | `docker compose down` |
| Setup für Team weitergeben | Shell-Skript oder lange README | `compose.yaml` einchecken |

Der Unterschied ist nicht nur **weniger Befehle**. Er ist **eine andere Art zu denken**:

- Beim manuellen Ansatz denkst du **in Schritten**.
- Mit Compose denkst du **in Zuständen**.

Das ist ein fundamentaler Unterschied – und er überträgt sich in die Tools, die später kommen (Kubernetes, Terraform, Ansible). Compose ist deine sanfte Einführung in **Infrastructure as Code**.

---

## Stolpersteine, die hier leicht passieren

??? danger "`build: .` – aber kein Dockerfile im Ordner"
    ```text
    failed to solve: failed to read dockerfile: open Dockerfile: no such file or directory
    ```

    Du bist im falschen Ordner oder hast dein Dockerfile anders benannt.

    Check: `ls -la | grep -i docker`.

    Liegt das Dockerfile nicht da, wohin Compose guckt, dann einfach den Pfad präzisieren:
    ```yaml
    services:
      app:
        build:
          context: ./backend
          dockerfile: Dockerfile.app
    ```

??? warning "`.env` wird nicht gelesen"
    **Check:**
    ```bash
    docker compose config | grep POSTGRES_PASSWORD
    ```
    Erscheint dort der Wert? Wenn nicht:

    1. Heißt die Datei genau `.env`? (Nicht `env.txt`, nicht `.env.local`.)
    2. Ist sie im **selben Ordner** wie die `compose.yaml`?
    3. Sind Leerzeichen oder Anführungszeichen im Wert? Dann greift YAML-Parsing manchmal seltsam.

??? warning "„is healthy"-Check wartet ewig"
    **Symptom:** `docker compose ps` zeigt die DB dauerhaft als `starting` oder `unhealthy`.

    **Mögliche Ursachen:**

    1. **Healthcheck-Befehl falsch**: Check direkt im Container: `docker compose exec db pg_isready -U kurs -d kursdaten`. Kommt „accepting connections"?
    2. **DB braucht länger beim ersten Start** (Initial-Setup). `start_period` großzügiger setzen (z.B. 30s).
    3. **Healthcheck nutzt falschen User**: wenn die DB noch nicht ready ist, muss der Check auf dem OS-Level funktionieren, nicht als Postgres-User.

??? info "Service neu starten ohne alles neu bauen"
    ```bash
    docker compose restart app
    ```

    Nur den App-Service rebooten, DB bleibt unangetastet.

??? info "Nur ein Service neu starten **mit** Rebuild"
    ```bash
    docker compose up -d --build app
    ```

??? info "Scale – mehrere Instanzen eines Services starten"
    ```bash
    docker compose up -d --scale app=3
    ```

    Startet 3 App-Container. Für das zu funktionieren brauchst du einen Load-Balancer davor (nginx oder Traefik) – das ist ein fortgeschrittenes Thema.

---

## Bonus: Adminer als Debug-Tool (mit Profile)

Hänge in deine `compose.yaml` ans Ende:

```yaml
  adminer:
    image: adminer
    ports:
      - "8081:8080"
    profiles:
      - debug
```

Normaler Start lässt den aus:

```bash
docker compose up -d
```

Mit Debug-Profile:

```bash
docker compose --profile debug up -d
```

Dann öffne <http://localhost:8081>. Logge dich ein:

- **System:** PostgreSQL
- **Server:** `db`
- **Benutzer:** `kurs`
- **Passwort:** (dein Passwort)
- **Datenbank:** `kursdaten`

Du siehst die Tabelle `zaehler`. So gehen Debug-Tools, ohne dass sie immer mitlaufen müssen.

---

## Merksatz

!!! success "Merksatz"
    > **Ein Stack, der in der manuellen Einheit Dutzende Flags brauchte, steht jetzt in einer YAML-Datei. `docker compose up -d` startet ihn, `docker compose down` baut ihn ab. Persistente Daten überleben, Konfiguration kommt aus `.env`, der Rest ist deklarativ.**

---

## Weiterlesen

- [Dockerfile-Best-Practices](../docker-profi/dockerfile-best-practices.md) – jetzt, wo du das Gesamtbild hast: Images richtig bauen
- [Image-Optimierung](../docker-profi/image-optimierung.md) – kleiner und sicherer
- [Cheatsheet Compose](../cheatsheets/compose.md)
