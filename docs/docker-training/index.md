---
title: "Docker-Training: die Grundlagen in Ruhe"
description: "16 unabhängige Übungen zu den Kernkonzepten von Docker: Container, Images, Ports, Volumes, Umgebungsvariablen, Netzwerke, Dockerfile und Compose. Jede Übung mit Erklärung, Kontrollfrage und eigenem Aufräumen."
---

# Docker-Training: die Grundlagen in Ruhe

Dieses Übungsset ist zum Festigen da. Keine Geschichte, kein großer Stack,
keine Abhängigkeiten zwischen den Übungen: Jede Übung nimmt sich **ein
Konzept** vor, zeigt es dir an einem kleinen Beispiel und räumt am Ende
hinter sich auf. Du kannst also überall einsteigen und jederzeit
aufhören.

!!! abstract "So ist jede Übung aufgebaut"
    1. **Worum es geht:** das Konzept in wenigen Sätzen
    2. **Schritt für Schritt:** die Befehle mit der Ausgabe, die du sehen solltest
    3. **Was dahinter steckt:** die fachliche Erklärung, warum Docker sich so verhält
    4. **Kontrollfrage:** zum Aufklappen, damit du prüfen kannst, ob es sitzt
    5. **Aufräumen:** damit die nächste Übung sauber startet

    Am Ende jeder Seite steht eine kleine Aufgabe **„Selbst probieren"**
    ohne vorgegebene Befehle. Hinweis und Lösung sind aufklappbar.

## Voraussetzungen

!!! warning "Windows: bitte in der PowerShell arbeiten"
    Alle Befehle sind für die **PowerShell im Windows-Terminal**
    geschrieben. Wo sich PowerShell, CMD und macOS/Linux unterscheiden, gibt
    es Tabs mit der passenden Variante. Befehle **im Container** sind
    überall gleich, denn im Container steckt immer Linux.

- **Docker Desktop läuft.** Kontrolle: `docker version` zeigt einen Abschnitt
  `Server`. Kommt stattdessen ein Verbindungsfehler, ist Docker Desktop
  nicht gestartet, siehe [Stolpersteine](../docker/stolpersteine.md).
- **Die drei Images einmal vorab holen.** Die meisten kennst du schon, dann
  geht das in Sekunden:

    ```bash
    docker pull nginx:alpine
    ```

    ```bash
    docker pull alpine
    ```

    ```bash
    docker pull postgres:16
    ```

## Die Übungen

| Seite | Übungen | Das Konzept |
|---|---|---|
| [Container](01-container.md) | 1 bis 3 | Lebenszyklus, Hauptprozess, in den Container schauen |
| [Images](02-images.md) | 4 und 5 | Name, Tag und ID, ein Image für viele Container |
| [Ports](03-ports.md) | 6 und 7 | Port-Mapping, Port-Konflikte |
| [Daten](04-daten.md) | 8 bis 10 | Wegwerf-Container, Volume, Bind Mount |
| [Konfiguration und Netze](05-konfiguration-netze.md) | 11 und 12 | Umgebungsvariablen, Namen statt IP-Adressen |
| [Eigenes Image](06-eigenes-image.md) | 13 und 14 | Dockerfile, Versionen nebeneinander |
| [Compose](07-compose.md) | 15 und 16 | Vom Befehl zur Datei, Dienste finden sich per Name |

Eine Übung dauert etwa 10 bis 15 Minuten. Wer unsicher ist, fängt oben an.
Wer ein bestimmtes Konzept wiederholen will, springt direkt hin. Wie das
Training mit allen anderen Docker-Übungen zusammenhängt, zeigt der
[Docker-Lernpfad](../docker-uebungen.md).

## Spickzettel

| Befehl | Was er tut |
|---|---|
| `docker run -d --name web -p 8080:80 nginx:alpine` | Container im Hintergrund starten, mit Name und Port |
| `docker ps` | laufende Container anzeigen |
| `docker ps -a` | alle Container anzeigen, auch beendete |
| `docker logs web` | Ausgaben des Containers lesen |
| `docker exec -it web sh` | eine Shell im laufenden Container öffnen |
| `docker stop web` | Container anhalten |
| `docker rm web` | Container löschen (angehalten) |
| `docker rm -f web` | Container anhalten und löschen in einem Schritt |
| `docker images` | vorhandene Images anzeigen |
| `docker volume ls` | Volumes anzeigen |
| `docker network ls` | Netzwerke anzeigen |
| `docker build -t name:tag .` | Image aus dem Dockerfile im aktuellen Ordner bauen |

## Die häufigsten Stolpersteine

??? danger "`Conflict. The container name "/web" is already in use`"
    Ein Container mit diesem Namen existiert schon, oft noch von einer
    früheren Übung, auch wenn er gestoppt ist. `docker ps -a` zeigt ihn,
    `docker rm -f web` entfernt ihn. Danach den Befehl wiederholen.

??? danger "`Bind for 0.0.0.0:8080 failed: port is already allocated`"
    Auf dem Port 8080 deines Rechners läuft schon etwas, meist ein
    Container von vorher. `docker ps` zeigt in der Spalte `PORTS`, wer ihn
    belegt. Diesen Container entfernen oder einen anderen Port nehmen,
    zum Beispiel `-p 8090:80`. Der fehlgeschlagene Container bleibt als
    `Created` liegen und muss ebenfalls mit `docker rm` weg.

??? danger "`docker stop` braucht zehn Sekunden"
    Kein Fehler. Manche Programme wie `sleep` reagieren als Hauptprozess
    im Container nicht auf das freundliche Stopp-Signal. Docker wartet
    dann zehn Sekunden und beendet den Prozess hart. Mehr dazu in [Übung 1](01-container.md#ubung-1-ein-container-von-anfang-bis-ende).

??? danger "Die Datei heißt plötzlich `Dockerfile.txt`"
    Windows hängt beim Anlegen über den Explorer oder mit
    `notepad Dockerfile` (bei einer noch nicht vorhandenen Datei) `.txt` an. Lege Dateien ohne Endung
    deshalb mit den Befehlen aus [Übung 13](06-eigenes-image.md) an.
