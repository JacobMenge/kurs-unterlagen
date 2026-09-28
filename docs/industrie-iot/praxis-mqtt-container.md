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
    - mit `#` alles unter einem Topic auf einmal abonnieren

    Wer schneller ist, findet am Ende Extras: Retained Messages, einen
    Sensor-Container und den Platzhalter `+`.

!!! warning "Windows: bitte in der PowerShell arbeiten"
    Alle Befehle sind einzeilig und laufen so in der PowerShell, in CMD und
    unter macOS gleich. Ihr braucht **zwei Terminal-Fenster** nebeneinander:
    eins zum Mitlesen, eins zum Senden. Im Windows-Terminal öffnet
    `Strg+Umschalt+T` einen neuen Tab, noch übersichtlicher ist ein
    geteiltes Fenster mit `Alt+Umschalt+Plus`.

## MQTT in 60 Sekunden

Stellt euch eine **Poststelle mit Fächern** vor. Wer etwas mitteilen will,
wirft einen Zettel in ein bestimmtes Fach. Wer sich für ein Fach
interessiert, lässt sich von der Poststelle eine Kopie jedes neuen Zettels
bringen. Absender und Empfänger müssen sich dafür nicht kennen, beide
kennen nur die Poststelle und das Fach.

Genau so arbeitet MQTT, mit diesen fünf Begriffen:

| Begriff | Bedeutung | Im Beispiel |
|---|---|---|
| **Broker** | die Poststelle: nimmt jede Nachricht an und verteilt sie weiter | der Container `broker` |
| **Topic** | das Fach: eine Adresse wie ein Ordnerpfad, Ebenen getrennt durch `/` | `halle1/ofen/temperatur` |
| **Publish** | eine Nachricht in ein Topic senden (veröffentlichen) | der Ofen meldet seine Temperatur |
| **Subscribe** | ein Topic abonnieren: ab jetzt jede neue Nachricht darin bekommen | die Leitwarte liest mit |
| **Nutzlast** (Payload) | der eigentliche Inhalt der Nachricht | `228.5` |

Der Unterschied zu dem, was ihr aus dem Web kennt: Bei HTTP fragt der
Browser einen Server und bekommt eine Antwort. Bei MQTT fragt niemand nach,
die Geräte **melden von sich aus**, sobald es etwas Neues gibt. Deshalb ist
MQTT so sparsam und passt zu Tausenden Sensoren, die jeweils nur kleine
Werte senden.

## Die zwei Werkzeuge und ihre Schalter

**`mosquitto_pub`** veröffentlicht eine Nachricht, **`mosquitto_sub`**
abonniert und zeigt alles an, was hereinkommt. Die Schalter, die ihr heute
braucht:

| Schalter | Bedeutung | Werkzeug |
|---|---|---|
| `-t` | das Topic (**t**opic) | beide |
| `-m` | die Nachricht, also die Nutzlast (**m**essage) | pub |
| `-r` | der Broker soll sich die Nachricht merken (**r**etain), siehe Extra 1 | pub |
| `-h` | an welchen Broker, per Name oder Adresse (**h**ost). Ohne `-h` ist es der eigene Container | beide |
| `-v` | beim Mitlesen auch das Topic anzeigen, nicht nur die Nutzlast (**v**erbose) | sub |

Ein Beispiel zum Lesen: `mosquitto_pub -t halle1/ofen/temperatur -m 228.5`
heißt „veröffentliche den Wert 228.5 im Topic halle1/ofen/temperatur".

## Womit du hier arbeitest

**Mosquitto** ist ein weit verbreiteter MQTT-Broker, schlank genug für
einen Raspberry Pi und stabil genug für Industrieanlagen. Das Image
`eclipse-mosquitto` bringt neben dem Broker auch die zwei Werkzeuge
`mosquitto_pub` und `mosquitto_sub` mit. Beide ruft ihr mit `docker exec`
**im** Container auf, ihr müsst also nichts installieren. Für die Prüfung zählt das Muster
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
    - `-p 9883:9883` öffnet ein kleines Web-Dashboard des Brokers (Extra 2).
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

## Teil 3: Alles auf einmal mitlesen mit # (7 Minuten)

Bisher habt ihr ein Topic genau abonniert. Mit dem Zeichen `#` am Ende
bekommt ihr **alles, was darunter liegt**, auf einmal. Beendet in
Fenster 1 das laufende Abo mit `Strg+C` und abonniert dann alles, was es
überhaupt gibt:

```bash
docker exec -it broker mosquitto_sub -t "#" -v
```

Sendet aus Fenster 2 an beliebige eigene Topics, zum Beispiel:

```bash
docker exec broker mosquitto_pub -t halle2/kuehlhaus/temperatur -m 4
```

Jetzt kommt alles in Fenster 1 an, auch die Nachricht aus Halle 2.

**Frage 2:** Welches Abo bräuchte ein Instandhalter, der nur den Ofen in
Halle 1 betreut, von dem aber alles?

??? success "Lösung Frage 2"
    `halle1/ofen/#`. Damit bekommt er Temperatur, Status und alles, was
    später unter dem Ofen dazukommt, aber nichts aus Halle 2. Deshalb lohnt
    es sich, Topics sauber nach Ort und Gerät zu benennen.

---

## Extras für Neugierige

Das Ziel der Übung habt ihr mit Teil 3 erreicht. Wer noch Zeit hat,
probiert hier weiter. Alles davon vertiefen wir beim nächsten Mal.

### Extra 1: Die Retained Message

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

**Extra-Frage:** Ein Display in der Halle startet nach einem Stromausfall neu.
Warum ist es für den aktuellen Sollwert wichtig, dass er als Retained
Message gesendet wurde?

??? success "Lösung Extra-Frage"
    Ohne Retain müsste das Display warten, bis irgendwer den Sollwert
    zufällig erneut sendet. Bis dahin zeigte es nichts oder Veraltetes.
    Mit Retain bekommt es beim Verbinden sofort den letzten gültigen Wert.
    Für Zustände (Sollwert, Status, Konfiguration) ist Retain deshalb
    üblich, für einzelne Ereignisse (ein Knopfdruck) nicht.

---

### Extra 2: Ein Sensor-Container funkt mit

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

**Extra-Frage:** Der Sensor-Container hat kein `-p`. Warum erreicht er den
Broker trotzdem?

??? success "Lösung zum Sensor"
    `-p` öffnet nur eine Tür von **außen**, von eurem Rechner in den
    Container. Der Sensor spricht aber **innerhalb** des Netzwerks
    `mqtt-netz` mit dem Broker, dort erreichen sich Container direkt über
    ihren Namen und den inneren Port 1883. Das ist dasselbe Muster wie die
    Datenbank ohne Port nach außen im Docker-Block.

### Extra 3: Der Platzhalter +

Das `+` steht für **genau eine** Ebene. `+/+/temperatur` bekommt alle
Temperaturen aus allen Hallen, aber keinen Status:

```bash
docker exec -it broker mosquitto_sub -t "+/+/temperatur" -v
```

---

## Zum Weiterdenken: der offene Broker

Euer Broker nimmt Nachrichten von **jedem** an, ohne Passwort. Alles
geht im Klartext über Port 1883. Genau das habt ihr im Paket-Detektiv
gesehen: Topic und Messwert standen lesbar im Mitschnitt.

**Frage 3:** Was müsste sich ändern, bevor so ein Broker in einer echten
Fabrik oder im Internet läuft?

??? success "Lösung Frage 3"
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
