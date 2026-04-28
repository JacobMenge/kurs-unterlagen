---
title: "Restart-Policies und Crash-Recovery"
description: "Was passiert mit deinem Container, wenn er crasht? Mit der richtigen --restart-Policy steht er wieder auf – ohne dass du dabei sein musst."
---

# Übung 4 – Restart-Policies und Crash-Recovery

!!! abstract "Was du in dieser Übung lernst"
    - Was passiert mit einem Container, der crasht **ohne** Restart-Policy
    - Wie du Docker beibringst, einen Container automatisch wieder zu starten
    - Den feinen Unterschied zwischen `no`, `on-failure`, `always` und `unless-stopped`
    - Wie der `RestartCount` im `docker inspect` dir hilft, sich wiederholende Probleme zu erkennen

**Aufwand:** ca. 15–20 Minuten.

---

## Worum geht's

Container sind Prozesse. Prozesse können crashen – aus vielen Gründen: Out-of-Memory, kaputte Konfiguration, Datenbank-Verbindungs­abbruch, Bug in der App.

**Ohne Restart-Policy** bleibt ein gecrashter Container einfach im Status `Exited` liegen. Niemand startet ihn neu. In Produktion wäre das ein Ausfall.

Mit der **richtigen `--restart`-Policy** kümmert sich der Docker-Daemon darum, deinen Container nach einem Crash wieder zu starten. Vier Werte sind möglich:

| Policy | Was sie tut |
|---|---|
| `no` *(Default)* | gar nichts. Container crasht, Container bleibt unten. |
| `on-failure[:max]` | startet neu, **wenn der Container mit Exit-Code ≠ 0 endet**. Optional: Maximal-Anzahl. |
| `always` | startet **immer** neu – auch wenn der Container „sauber" beendet wurde. Auch nach Docker-Daemon-Neustart. |
| `unless-stopped` | wie `always`, aber: ein **`docker stop`** wird respektiert. Bei Daemon-Neustart **bleibt** der Container so, wie du ihn manuell hinterlassen hast. |

**Faustregel für die Praxis:** `unless-stopped` ist meistens die richtige Wahl. Sie startet bei echten Crashes neu, lässt sich aber kontrolliert per `docker stop` ausschalten.

---

## Anleitung

### Schritt 1 – Crash ohne Restart-Policy

Wir bauen einen Container, der absichtlich nach 2 Sekunden mit Fehler endet:

```bash
docker run -d --name crash-no alpine sh -c 'sleep 2; exit 1'
```

Sofort `docker ps` (wenn du schnell bist, siehst du ihn noch) und dann nach 4 Sekunden:

```bash
sleep 4
docker ps -a --filter name=crash-no
```

Erwartet:

```text
CONTAINER ID   IMAGE     COMMAND                  CREATED         STATUS                       PORTS     NAMES
…              alpine    "sh -c 'sleep 2; exi…"   4 seconds ago   Exited (1) 2 seconds ago               crash-no
```

Status `Exited (1)`. Der Container ist tot, niemand startet ihn neu.

```bash
docker rm crash-no
```

---

### Schritt 2 – Mit `--restart on-failure`

Jetzt mit Restart-Policy:

```bash
docker run -d --name crash-onfail --restart on-failure:5 alpine sh -c 'sleep 1; exit 1'
```

Der Container endet sofort mit Exit-Code 1 → Docker startet ihn neu → er endet wieder → Docker startet ihn nochmal usw. – maximal 5 Mal.

Nach 8 Sekunden:

```bash
sleep 8
docker inspect crash-onfail --format '{{.State.Status}} – RestartCount: {{.RestartCount}}'
```

Erwartet (Werte können je nach Timing leicht abweichen):

```text
restarting – RestartCount: 5
```

Oder kurz darauf:

```text
exited – RestartCount: 5
```

Nach dem fünften Crash gibt Docker auf. Aufräumen:

```bash
docker rm -f crash-onfail
```

??? info "Wozu der `:5`-Suffix?"
    Ohne Limit (`--restart on-failure`) versucht Docker **unendlich oft**, den Container neu zu starten. Bei einem dauerhaft kaputten Container heißt das: dauernd CPU-Lärm, volle Logs, im schlimmsten Fall ein Loop, der die Maschine warm hält. Mit `:N` setzt du eine Obergrenze.

---

### Schritt 3 – Mit `--restart unless-stopped`

Diesmal lassen wir den Container immer wieder crashen:

```bash
docker run -d --name crash-uns --restart unless-stopped alpine sh -c 'sleep 1; exit 1'
```

Status nach 6 Sekunden:

```bash
sleep 6
docker inspect crash-uns --format 'Status: {{.State.Status}}, Restarts: {{.RestartCount}}'
```

Erwartet (RestartCount läuft hoch, weil `unless-stopped` keine Obergrenze hat):

```text
Status: running, Restarts: 4
```

Jetzt **explizit stoppen**:

```bash
docker stop crash-uns
sleep 2
docker inspect crash-uns --format 'Nach docker stop: {{.State.Status}}'
```

Erwartet:

```text
Nach docker stop: exited
```

Wichtig: der Container bleibt **gestoppt**, weil wir ihn manuell gestoppt haben. Selbst wenn du Docker Desktop neu startest, kommt er **nicht** automatisch zurück. Genau das macht `unless-stopped` aus.

Aufräumen:

```bash
docker rm -f crash-uns
```

---

### Schritt 4 – Vergleich: `always` vs. `unless-stopped`

Der einzige Unterschied: was passiert, wenn der **Docker-Daemon** neu startet (z.B. Rechner reboot)?

| Policy | Container war vorm Reboot `running` | Container war vorm Reboot **manuell gestoppt** |
|---|---|---|
| `always` | startet wieder ✓ | startet trotzdem wieder ✗ |
| `unless-stopped` | startet wieder ✓ | bleibt gestoppt ✓ |

Daher: für Produktions-Container ist **`unless-stopped`** in den meisten Fällen die richtige Wahl. Du behältst die Kontrolle, kannst aber gelassen rebooten.

---

## Übung – Selber machen

!!! info "Aufgabe"
    Schreibe einen Mini-Container, der einen **flaky** Service simuliert: er läuft 3 Sekunden, dann crasht er. Lass ihn mit `--restart unless-stopped` laufen und beobachte über zwei Minuten, wie der `RestartCount` immer weiter hochzählt.

    Bonus: Nutze `docker logs --tail 5` zwischendurch, um zu sehen, dass die Container-Instanzen unterschiedliche IDs / Logs haben.

??? success "Musterlösung"

    ```bash
    docker run -d --name flaky --restart unless-stopped alpine \
      sh -c 'echo "Starte $(date +%T)"; sleep 3; echo "Crash!"; exit 1'
    ```

    Eine Minute warten, dann:

    ```bash
    docker inspect flaky --format 'RestartCount: {{.RestartCount}}, Status: {{.State.Status}}'
    docker logs flaky --tail 5
    ```

    Erwartet: `RestartCount` ist 10–20 nach einer Minute (jede Iteration dauert ~4s). Logs zeigen mehrere `Starte HH:MM:SS`-Zeilen, weil Docker den Prozess immer wieder neu startet, aber **denselben** Container-Lifetime fortführt – die `docker logs` zeigen also **kumuliert** alle Starts seit der Container-Erzeugung.

    !!! note "Achtung mit dem Container nach der Übung"
        `flaky` läuft endlos weiter, solange Docker läuft. **Nicht vergessen:**
        ```bash
        docker rm -f flaky
        ```

---

## Bonus

??? tip "Bonus 1: Restart-Policy nachträglich ändern"
    Du kannst die Policy eines bestehenden Containers ändern:

    ```bash
    docker update --restart unless-stopped <container>
    ```

    Spart das `docker rm` + neuer `docker run` mit allen Flags.

??? tip "Bonus 2: Restart-Policy in Production-Setups"
    In **realen** Setups kombinierst du `--restart unless-stopped` mit:

    - **Healthchecks** ([Übung 3](03-healthchecks.md)) – damit `docker ps` ehrlich sagt, ob der Container **bereit** ist
    - **Log-Limits** (`--log-opt max-size=10m --log-opt max-file=3`) – damit endlose Restarts nicht die Disk vollschreiben
    - **Ressourcen-Limits** (`--memory 512m --cpus 0.5`) – damit ein wütender Container den Host nicht in die Knie zwingt

    Das ist alles Docker-CLI – du brauchst dafür **kein Compose**. Compose macht es dann nur **deklarativ und wiederholbar**.

---

## Was du danach kannst

- Eine `--restart`-Policy bewusst wählen, statt Default zu fahren.
- `RestartCount` im `docker inspect` lesen und als Indikator für „wieder­holt crashender Container" nutzen.
- Den Unterschied zwischen `always` und `unless-stopped` an einem konkreten Beispiel erklären.

---

## Weiter

- [Übung 5 – Image-Größen vergleichen](05-image-groessen.md)
- Zurück zur [Übersicht](index.md)
