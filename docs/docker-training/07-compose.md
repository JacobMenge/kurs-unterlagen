---
title: "Training: Compose"
description: "Übungen 15 und 16: einen docker-run-Befehl in eine compose.yaml übersetzen und erleben, dass sich Dienste in Compose automatisch über ihren Namen finden."
---

# Compose

Zwei kleine Übungen zu Docker Compose, bewusst mit nur ein und zwei
Diensten. Du siehst, dass eine `compose.yaml` nichts anderes ist als die
`docker run`-Befehle der letzten Übungen, aufgeschrieben in einer Datei.

---

## Übung 15: Vom Befehl zur Datei

!!! info "Was du lernst"
    - einen `docker run`-Befehl Zeile für Zeile in YAML übersetzen
    - einen Stack mit `up` starten und mit `down` entfernen
    - woher die Container ihre Namen bekommen

### Worum es geht

In [Übung 10](04-daten.md) hast du einen Webserver mit diesem Befehl
gestartet (hier in der PowerShell-Schreibweise):

```powershell
docker run -d --name web-bind -p 8080:80 -v "${PWD}:/usr/share/nginx/html:ro" nginx:alpine
```

Genau diesen Container beschreibst du jetzt in einer Datei. Jede Option
des Befehls findet sich darin wieder.

### Schritt für Schritt

Einen Übungsordner anlegen und hineinwechseln:

```bash
mkdir uebung-compose
```

```bash
cd uebung-compose
```

Eine Webseite anlegen:

=== "Windows PowerShell"
    ```powershell
    Set-Content index.html "<h1>Hallo aus Compose</h1>"
    ```

=== "Windows CMD"
    ```cmd
    echo ^<h1^>Hallo aus Compose^</h1^>> index.html
    ```

=== "macOS / Linux"
    ```bash
    echo "<h1>Hallo aus Compose</h1>" > index.html
    ```

Die Datei `compose.yaml` anlegen und im Editor öffnen:

=== "Windows PowerShell"
    ```powershell
    notepad compose.yaml
    ```
    Notepad fragt, ob es die Datei anlegen soll: **Ja**. Mit VS Code geht
    auch `code compose.yaml`. Nicht über den Explorer anlegen, sonst
    entsteht `compose.yaml.txt`.

=== "macOS / Linux"
    ```bash
    nano compose.yaml
    ```
    Oder ein Editor deiner Wahl, zum Beispiel `code compose.yaml`.

Der Inhalt, **mit Leerzeichen eingerückt, niemals mit Tabs**:

```yaml
services:
  web:
    image: nginx:alpine
    ports:
      - "8080:80"
    volumes:
      - ./index.html:/usr/share/nginx/html/index.html:ro
```

Speichern, dann starten:

```bash
docker compose up -d
```

```bash
docker compose ps
```

```text
NAME                   IMAGE          COMMAND                  SERVICE   CREATED         STATUS        PORTS
uebung-compose-web-1   nginx:alpine   "/docker-entrypoint.…"   web       2 seconds ago   Up 1 second   0.0.0.0:8080->80/tcp
```

Im Browser unter `http://localhost:8080` steht „Hallo aus Compose".
Alles wieder abbauen:

```bash
docker compose down
```

### Was dahinter steckt

So übersetzt sich der Befehl in die Datei:

| `docker run` | `compose.yaml` |
|---|---|
| `nginx:alpine` | `image: nginx:alpine` |
| `-p 8080:80` | unter `ports:` die Zeile `- "8080:80"` |
| `-v "${PWD}:/usr/share/nginx/html:ro"` | unter `volumes:` die Zeile mit dem Pfad |
| `--name web-bind` | entfällt: Compose bildet den Namen selbst aus Ordner und Service (`uebung-compose-web-1`) |
| `-d` | steckt im Befehl `docker compose up -d` |

- Den Pfad schreibst du in der Datei **relativ**: `./index.html` heißt
  „neben der compose.yaml". Das funktioniert auf Windows, macOS und
  Linux gleich, die Unterschiede zwischen `${PWD}`, `%cd%` und `$(pwd)`
  fallen weg. Eingebunden wird hier bewusst nur die **eine Datei** statt
  des ganzen Ordners, sonst läge auch die compose.yaml im Webordner und
  wäre im Browser abrufbar.
- Der Containername `uebung-compose-web-1` setzt sich zusammen aus dem
  **Projektnamen** (dem Ordnernamen), dem **Servicenamen** und einer
  laufenden Nummer.
- `docker compose down` entfernt Container **und** das Netzwerk des
  Projekts. Volumes und deine Dateien bleiben.
- Der große Vorteil: Die Datei ist dokumentiert, versionierbar und bei
  jedem gleich. Niemand muss sich lange Befehle merken oder abtippen.

??? question "Kontrollfrage: Du stellst in der compose.yaml den Außen-Port auf 8090 um und tippst `docker compose up -d`. Was macht Compose?"
    Compose vergleicht Datei und laufenden Zustand, erkennt die Änderung
    und ersetzt den Container `web` durch einen neuen mit Port 8090. Ein
    `down` vorher ist nicht nötig. Die Seite ist danach nur noch unter
    `http://localhost:8090` erreichbar.

### Aufräumen

Der Stack ist mit `docker compose down` schon entfernt. Bleib im Ordner
`uebung-compose` für die nächste Übung oder wechsle mit `cd ..` zurück.

---

## Übung 16: Dienste finden sich über ihren Namen

!!! info "Was du lernst"
    - zwei Dienste in einer compose.yaml
    - dass Compose automatisch ein gemeinsames Netz anlegt
    - einen Befehl in einem Dienst mit `docker compose exec` ausführen

### Worum es geht

In [Übung 12](05-konfiguration-netze.md) hast du ein Netzwerk von Hand
angelegt, damit sich Container per Name finden. Compose erledigt das
**automatisch**: Alle Dienste einer Datei landen in einem gemeinsamen
Netz und sind dort unter ihrem Servicenamen erreichbar.

### Schritt für Schritt

Im Ordner `uebung-compose` (oder einem neuen Ordner) die `compose.yaml`
öffnen und den Inhalt ersetzen:

```yaml
services:
  web:
    image: nginx:alpine
    ports:
      - "8080:80"

  werkzeug:
    image: alpine
    command: sleep 3600
```

Der zweite Dienst `werkzeug` tut nichts außer zu warten. Er ist nur da,
damit du aus ihm heraus den Webserver ansprechen kannst.

```bash
docker compose up -d
```

Jetzt fragst du **aus dem Dienst `werkzeug` heraus** die Webseite von
`web` ab:

```bash
docker compose exec werkzeug wget -qO- web
```

Du siehst den HTML-Code von „Welcome to nginx!". Schau dir das Netz an,
das Compose dafür angelegt hat:

```bash
docker network ls
```

In der Liste steht `uebung-compose_default`. Abbauen:

```bash
docker compose down
```

Das dauert rund zehn Sekunden, der Grund steht gleich unten.

### Was dahinter steckt

- Compose legt für jedes Projekt ein Netzwerk `<ordnername>_default` an
  und hängt alle Dienste hinein. Es ist ein eigenes Netzwerk wie in
  Übung 12, mit eingebautem DNS. Darum kennt `werkzeug` den Namen `web`.
- `command:` ersetzt den Standardbefehl des Images, genau wie der Teil
  hinter dem Image-Namen bei `docker run` ([Übung 2](01-container.md)).
  Ohne `sleep 3600` wäre `werkzeug` sofort wieder beendet.
- `docker compose exec werkzeug …` ist das Gegenstück zu `docker exec`.
  Du sprichst den Dienst über seinen Servicenamen an, den Containernamen
  musst du nicht kennen.
- Die zehn Sekunden bei `down` kennst du aus
  [Übung 1](01-container.md): `sleep` reagiert als Prozess Nummer 1 im
  Container nicht auf das freundliche Stopp-Signal, Docker wartet und
  beendet den Prozess dann hart.
- Genau dieses Muster trägt jeden echten Stack: Eine Anwendung erreicht
  ihre Datenbank über den Namen `db`, ohne dass die Datenbank einen Port
  nach außen braucht.

??? question "Kontrollfrage: Was müsstest du in der compose.yaml ergänzen, damit `werkzeug` auch vom Browser aus erreichbar wäre?"
    Nichts Sinnvolles, denn `werkzeug` bietet keinen Dienst an, der auf
    einem Port lauscht. `ports:` öffnet nur eine Tür zu einem Programm,
    das dahinter wartet. Das ist die Unterscheidung aus Übung 6: `-p`
    macht einen Dienst erreichbar, erschafft aber keinen.

### Aufräumen

Der Stack ist mit `down` entfernt. Zurück aus dem Ordner:

```bash
cd ..
```

---

## Selbst probieren

**Auftrag:** Übersetze die Selbstprobier-Aufgabe von der Seite
[Konfiguration und Netze](05-konfiguration-netze.md) in eine
`compose.yaml`: PostgreSQL ohne Port nach außen und Adminer auf Port
8080. Ein eigenes Netzwerk legst du diesmal **nicht** an.

**Geschafft, wenn:** `docker compose up -d` beide Dienste startet und der
Login in Adminer klappt.

??? tip "Hinweis"
    Zwei Services, `db` mit `image:` und `environment:`
    (`POSTGRES_PASSWORD`), `adminer` mit `image:` und `ports:`. Das Netz
    legt Compose selbst an. In Adminer ist der Server der
    **Servicename** `db`.

??? success "Lösung"
    ```yaml
    services:
      db:
        image: postgres:16
        environment:
          POSTGRES_PASSWORD: geheim

      adminer:
        image: adminer
        ports:
          - "8080:8080"
    ```

    ```bash
    docker compose up -d
    ```

    Im Browser `http://localhost:8080`, System **PostgreSQL**, Server
    `db`, Benutzer `postgres`, Passwort `geheim`.

    Aufräumen: `docker compose down -v`

    Das `-v` räumt hier auch ein Volume ohne Namen weg: Das Postgres-Image
    legt für seinen Datenordner automatisch eines an, wenn du keins
    angibst. Nach einem neuen `up` würde es nicht wieder eingebunden, die
    Daten wären also trotzdem verloren. Wie ein benanntes Volume in die
    Datei kommt, zeigt die [Compose-Einheit](../docker-compose/praxis-webapp.md).
