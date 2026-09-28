---
title: "Praxis: MQTT im eigenen Container"
description: "Einen eigenen MQTT-Broker mit Docker starten, Nachrichten veröffentlichen und abonnieren, Wildcards und Retained Messages ausprobieren und einen Sensor-Container funken lassen."
---

# Praxis: MQTT im eigenen Container

Im Mitschnitt habt ihr MQTT nur gelesen. Jetzt betreibt ihr die Poststelle
selbst: einen eigenen **Broker** in einem Docker-Container, dazu eure
eigenen Sender und Empfänger. Alles läuft auf eurem Rechner, niemand
sonst funkt dazwischen. Probiert ruhig herum, kaputtgehen kann nichts.

!!! abstract "Ziel"
    Am Ende könnt ihr:

    - einen MQTT-Broker mit einem einzigen `docker run` starten
    - Nachrichten veröffentlichen (publish) und abonnieren (subscribe)
    - mit den Platzhaltern `+` und `#` mehrere Topics auf einmal abonnieren
    - erklären, was eine Retained Message ist und wozu sie dient
    - einen zweiten Container als Sensor funken lassen, der den Broker über seinen Namen findet

!!! warning "Windows: bitte in der PowerShell arbeiten"
    Alle Befehle sind einzeilig und laufen so in der PowerShell, in CMD und
    unter macOS gleich. Ihr braucht **zwei Terminal-Fenster** nebeneinander:
    eins zum Mitlesen, eins zum Senden. Im Windows-Terminal öffnet
    `Strg+Umschalt+T` einen neuen Tab, noch übersichtlicher ist ein
    geteiltes Fenster mit `Alt+Umschalt+Plus`.

## Womit du hier arbeitest

**Mosquitto** ist ein weit verbreiteter MQTT-Broker, schlank genug für
einen Raspberry Pi und stabil genug für Industrieanlagen. Das Image
`eclipse-mosquitto` bringt neben dem Broker auch die zwei Werkzeuge mit, mit
denen ihr gleich arbeitet: **`mosquitto_pub`** veröffentlicht eine
Nachricht, **`mosquitto_sub`** abonniert und zeigt alles an, was
hereinkommt. Beide ruft ihr mit `docker exec` **im** Container auf, ihr
müsst also nichts installieren. Für die Prüfung zählt das Muster
Publish/Subscribe mit Broker und Topic, im Beruf begegnet euch genau dieser
Aufbau vom Sensor in der Halle bis zum Smart Home.

---

## Teil 1: Den Broker starten (3 Minuten)

Erst ein eigenes Netzwerk, damit sich später ein zweiter Container per
Namen melden kann (das kennt ihr aus dem Docker-Aufbau):

```bash
docker network create mqtt-netz
```

Dann der Broker:

```bash
docker run -d --name broker --network mqtt-netz -p 1883:1883 -p 9883:9883 eclipse-mosquitto:2 mosquitto -c /mosquitto-no-auth.conf
```

Kontrolle:

```bash
docker logs broker
```

Dort steht die Zeile `mosquitto version 2.1.2 running` (die Versionsnummer kann bei dir etwas anders sein). Der Broker läuft.

??? info "Was steckt in diesem Befehl?"
    - `-p 1883:1883` ist der Standard-Port für MQTT ohne Verschlüsselung.
    - `-p 9883:9883` öffnet ein kleines Web-Dashboard des Brokers (Teil 5).
    - `mosquitto -c /mosquitto-no-auth.conf` startet den Broker mit einer
      Konfiguration, die dem Image beiliegt: **ohne Anmeldung**. Seit
      Version 2 lässt Mosquitto ohne ausdrückliche Konfiguration niemanden
      von außen herein, sicher voreingestellt. Für die Übung auf dem
      eigenen Rechner schalten wir das bewusst ab. Im echten Netz wäre das
      ein Fehler, dazu mehr am Ende.

---

## Teil 2: Mitlesen und senden (8 Minuten)

**Fenster 1, der Empfänger.** Abonniert alles, was mit `halle1/` beginnt.
`-v` zeigt zu jeder Nachricht das Topic mit an:

```bash
docker exec -it broker mosquitto_sub -t "halle1/#" -v
```

Das Fenster bleibt jetzt stehen und wartet. Genau so soll es sein.

**Fenster 2, der Sender.** Veröffentlicht eine Temperatur:

```bash
docker exec broker mosquitto_pub -t halle1/ofen/temperatur -m 228.5
```

In Fenster 1 erscheint sofort:

```text
halle1/ofen/temperatur 228.5
```

Sendet noch ein paar Nachrichten mit eigenen Topics und Werten, zum Beispiel:

```bash
docker exec broker mosquitto_pub -t halle1/ofen/status -m heizt
```

```bash
docker exec broker mosquitto_pub -t halle2/kuehlhaus/temperatur -m 4
```

**Frage 1:** Die Nachricht an `halle2/kuehlhaus/temperatur` taucht in Fenster 1
nicht auf. Warum nicht?

??? success "Lösung Frage 1"
    Fenster 1 hat nur `halle1/#` abonniert. Der Broker liefert eine
    Nachricht ausschließlich an die Abonnenten, deren Topic-Filter passt.
    Sender und Empfänger kennen sich dabei nicht: Der Sender weiß nicht,
    ob irgendwer zuhört, der Empfänger nicht, wer gesendet hat. Genau das
    macht MQTT so leicht erweiterbar.

Mit `Strg+C` beendet ihr das Mitlesen in Fenster 1.

---

## Teil 3: Die Platzhalter + und # (7 Minuten)

Topics sind wie Ordnerpfade aufgebaut, die Ebenen trennt ein `/`. Beim
Abonnieren gibt es zwei Platzhalter:

| Platzhalter | Bedeutung | Beispiel | passt auf |
|---|---|---|---|
| `#` | alles ab hier, beliebig viele Ebenen | `halle1/#` | `halle1/ofen/temperatur`, `halle1/uhr` |
| `+` | genau eine Ebene | `+/+/temperatur` | `halle1/ofen/temperatur`, `halle2/kuehlhaus/temperatur` |

Abonniert in Fenster 1 alle Temperaturen aus allen Hallen:

```bash
docker exec -it broker mosquitto_sub -t "+/+/temperatur" -v
```

Sendet aus Fenster 2 Temperaturen und andere Werte in verschiedene Hallen
und beobachtet, was ankommt und was nicht.

**Frage 2:** Welches Abo bräuchte eine Leitwarte, die **alle** Nachrichten
aller Hallen sehen will? Und welches ein Instandhalter, der nur den Ofen
in Halle 1 betreut?

??? success "Lösung Frage 2"
    Die Leitwarte abonniert `#`, also schlicht alles. Der Instandhalter
    nimmt `halle1/ofen/#` und bekommt Temperatur, Status und alles, was
    später unter dem Ofen dazukommt. Gute Topic-Namen sind deshalb eine
    Planungsaufgabe: Wer sie sauber nach Ort und Gerät ordnet, kann später
    gezielt abonnieren.

---

## Teil 4: Die Retained Message (5 Minuten)

Eine normale Nachricht bekommt nur, wer **in dem Moment** zuhört. Wer sich
später verbindet, hat sie verpasst. Mit `-r` (retain) merkt sich der
Broker die **letzte** Nachricht eines Topics und liefert sie jedem neuen
Abonnenten sofort aus.

Sendet einen Sollwert mit `-r`, **ohne** dass Fenster 1 gerade zuhört:

```bash
docker exec broker mosquitto_pub -t halle1/ofen/sollwert -m 230 -r
```

Abonniert erst danach:

```bash
docker exec -it broker mosquitto_sub -t halle1/ofen/sollwert -v
```

Der Wert `230` erscheint sofort, obwohl er vor dem Abonnieren gesendet
wurde.

**Frage 3:** Ein Display in der Halle startet nach einem Stromausfall neu.
Warum ist es für den aktuellen Sollwert wichtig, dass er als Retained
Message gesendet wurde?

??? success "Lösung Frage 3"
    Ohne Retain müsste das Display warten, bis irgendwer den Sollwert
    zufällig erneut sendet. Bis dahin zeigte es nichts oder Veraltetes.
    Mit Retain bekommt es beim Verbinden sofort den letzten gültigen Wert.
    Für Zustände (Sollwert, Status, Konfiguration) ist Retain deshalb
    üblich, für einzelne Ereignisse (ein Knopfdruck) nicht.

---

## Teil 5: Ein Sensor-Container funkt mit (für alle mit Restzeit)

Bisher habt ihr von Hand gesendet. Jetzt übernimmt ein eigener Container
die Rolle eines Sensors: Er schickt alle zwei Sekunden die Uhrzeit an den
Broker. Er läuft im selben Netzwerk und findet den Broker über dessen
**Namen** `broker`, genau wie das Backend bei Mission Control die
Datenbank über `db` fand.

```bash
docker run -d --name sensor --network mqtt-netz eclipse-mosquitto:2 sh -c "while true; do date +%T | mosquitto_pub -h broker -t halle1/uhr -l; sleep 2; done"
```

Lest in Fenster 1 mit:

```bash
docker exec -it broker mosquitto_sub -t "halle1/#" -v
```

```text
halle1/uhr 15:04:10
halle1/uhr 15:04:12
```

Öffnet zum Schluss das Dashboard des Brokers im Browser:
<http://localhost:9883>. Es zeigt, wie viele Clients verbunden sind und
wie viele Nachrichten der Broker schon angenommen und verteilt hat.
Startet ein weiteres Abo und schaut, wie sich die Zahlen ändern.

**Frage 4:** Der Sensor-Container hat kein `-p`. Warum erreicht er den
Broker trotzdem?

??? success "Lösung Frage 4"
    `-p` öffnet nur eine Tür von **außen**, von eurem Rechner in den
    Container. Der Sensor spricht aber **innerhalb** des Netzwerks
    `mqtt-netz` mit dem Broker, dort erreichen sich Container direkt über
    ihren Namen und den inneren Port 1883. Das ist dasselbe Muster wie die
    Datenbank ohne Port nach außen im Docker-Block.

---

## Zum Weiterdenken: der offene Broker

Euer Broker nimmt Nachrichten von **jedem** an, ohne Passwort. Alles
geht im Klartext über Port 1883. Genau das habt ihr im Paket-Detektiv
gesehen: Topic und Messwert standen lesbar im Mitschnitt.

**Frage 5:** Was müsste sich ändern, bevor so ein Broker in einer echten
Fabrik oder im Internet läuft?

??? success "Lösung Frage 5"
    - **Anmeldung:** Benutzername und Passwort (oder Zertifikate) statt
      `allow_anonymous true`.
    - **Verschlüsselung:** TLS, üblich auf Port **8883**, damit niemand
      mitlesen kann.
    - **Rechte je Topic:** Ein Sensor darf nur in sein eigenes Topic
      schreiben, eine Anzeige nur lesen (Access Control Lists).
    - **Netz-Trennung:** Der Broker gehört in ein eigenes Netzsegment und
      nicht offen ins Internet.

    Genau so ist der Kurs-Broker aufgebaut, mit dem ihr in der Übung
    [MQTT live](praxis-mqtt-live.md) echte Hardware ansteuert.

---

## Aufräumen

```bash
docker rm -f sensor broker
```

```bash
docker network rm mqtt-netz
```

Das Image `eclipse-mosquitto:2` bleibt liegen, ihr braucht es wieder.

---

## Bonus: alles als compose.yaml

Wer den Docker-Block noch präsent hat: Broker und Sensor lassen sich auch
als Stack beschreiben. Legt einen Ordner `mqtt-stack` an, darin mit
`notepad compose.yaml` (Windows) bzw. `nano compose.yaml` (macOS) diese
Datei:

```yaml
services:
  broker:
    image: eclipse-mosquitto:2
    command: mosquitto -c /mosquitto-no-auth.conf
    ports:
      - "1883:1883"
      - "9883:9883"

  sensor:
    image: eclipse-mosquitto:2
    command: sh -c "while true; do date +%T | mosquitto_pub -h broker -t halle1/uhr -l; sleep 2; done"
```

Starten mit `docker compose up -d`, mitlesen mit
`docker compose exec broker mosquitto_sub -t "halle1/#" -v`, beenden mit
`docker compose down`. Ein eigenes Netzwerk braucht ihr hier nicht, das
legt Compose automatisch an.
