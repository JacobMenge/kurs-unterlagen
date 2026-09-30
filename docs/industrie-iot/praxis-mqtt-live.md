---
title: "Praxis: MQTT live"
description: "Mit dem Kurs-Broker verbinden, eine echte Lampe per MQTT in der Teamfarbe schalten, Retain und Last Will ausprobieren und einen eigenen Sensor-Container funken lassen."
---

# Praxis: MQTT live

Am Montag lief euer Broker nur auf eurem Rechner. Heute funkt der ganze Kurs
über **einen gemeinsamen Broker** in der Cloud, verschlüsselt und nur mit
Anmeldung. Am anderen Ende hängt echte Hardware: eine Lampe beim Dozenten,
die in eurer Teamfarbe leuchtet, sobald ihr den richtigen Befehl schickt.

!!! abstract "Ziel"
    Am Ende könnt ihr:

    - euch mit Adresse, Port, TLS und Zugangsdaten mit einem entfernten Broker verbinden
    - einem Gerät per MQTT einen Befehl schicken und seine Rückmeldung lesen
    - Retained Messages und den Last Will erklären und selbst einsetzen

    Für die Schnellen gibt es eine Challenge: einen eigenen Sensor im
    Container, dessen Messwerte live auf der Anzeigetafel erscheinen.

!!! info "Zugangsdaten kommen im Chat"
    Adresse, Benutzername und Passwort des Kurs-Brokers bekommt ihr **im
    Chat**. Sie stehen absichtlich nicht auf dieser Seite. Gebt sie nicht
    außerhalb des Kurses weiter.

## Womit du hier arbeitest

| Baustein | Was er tut |
|---|---|
| **Kurs-Broker** | Ein MQTT-Broker in der Cloud (HiveMQ). Er nimmt nur verschlüsselte Verbindungen auf Port 8883 an und nur mit Anmeldung. |
| **Gateway** | Ein kleines Programm beim Dozenten. Es liest die Befehle an die Lampe, prüft sie und schaltet die Lampe über die Hue Bridge. |
| **Signalleuchte** | Zwei Farblampen, die immer gemeinsam in derselben Farbe leuchten. Sie hängen per Zigbee-Funk an der Hue Bridge und stehen im Bild der Kamera. Auf dieser Seite heißen sie einfach „die Lampe". |
| **Anzeigetafel** | Eine Webseite, die selbst MQTT spricht und alles unter `kurs/#` live zeigt: [Anzeigetafel öffnen](anzeigetafel.html). |

Ihr arbeitet mit denselben Werkzeugen wie am Montag: `mosquitto_sub` und
`mosquitto_pub` aus dem Image `eclipse-mosquitto:2`. Neu ist nur, wie ihr sie
startet: Diesmal läuft bei euch **kein eigener Broker**. `docker run --rm`
holt nur das Werkzeug aus dem Image, führt es einmal aus und räumt den
Container gleich wieder weg. Wer am Montag nicht dabei war: Docker lädt das
Image beim ersten Befehl automatisch herunter, das dauert ein paar Sekunden.

Für die Prüfung zählen Publish/Subscribe über einen Broker,
die Ports 1883 und 8883, QoS, Retain und Last Will. Im Beruf ist genau dieser
Aufbau aus Gerät, Gateway und Broker der Standard, in der Fabrik genauso wie
im Smart Home.

## Eure Teamfarbe

Euer Breakout-Raum ist euer Team. Die Teamfarbe steht in jedem eurer Topics:

| Breakout | Topic-Teil | Lampe bei `an` |
|---|---|---|
| Team Rot | `rot` | rot |
| Team Grün | `gruen` | grün |
| Team Blau | `blau` | blau |
| Team Lila | `lila` | lila |

In allen Beispielen auf dieser Seite steht `rot`. Ersetzt es durch eure
Teamfarbe, klein geschrieben und ohne Umlaut.

## Vorbereitung: den Zugang einmal ablegen (3 Minuten)

Damit ihr die Zugangsdaten nicht in jeden Befehl tippen müsst, legt ihr sie
in drei **Variablen** ab. Für die PowerShell stehen die drei Zeilen fertig im
Chat: kopieren, einfügen, fertig. Für CMD und macOS setzt ihr dieselben Werte
in die Vorlage unten ein. Fragt das Windows-Terminal beim Einfügen mehrerer
Zeilen nach, bestätigt ihr das Einfügen.

!!! warning "Zwei Fenster, also zweimal die Variablen"
    Ihr braucht wieder **zwei Terminal-Fenster**: eins zum Mitlesen, eins
    zum Senden. Variablen gelten nur in dem Fenster, in dem ihr sie gesetzt
    habt. Führt den Block deshalb in **beiden** Fenstern aus. Im
    Windows-Terminal teilt `Alt+Umschalt+Plus` das Fenster.

=== "Windows PowerShell"

    ```powershell
    $BROKER = "adresse-aus-dem-chat"
    $BENUTZER = "benutzer-aus-dem-chat"
    $PASSWORT = "passwort-aus-dem-chat"
    ```

=== "Windows CMD"

    ```bat
    set BROKER=adresse-aus-dem-chat
    set BENUTZER=benutzer-aus-dem-chat
    set PASSWORT=passwort-aus-dem-chat
    ```

    In CMD ohne Anführungszeichen und ohne Leerzeichen um das `=`.

=== "macOS / Linux"

    ```bash
    BROKER="adresse-aus-dem-chat"
    BENUTZER="benutzer-aus-dem-chat"
    PASSWORT="passwort-aus-dem-chat"
    ```

Kurzer Test: `echo $BROKER` (in CMD `echo %BROKER%`) zeigt die Adresse.

---

## Station 0: Aufholen (nur bei Bedarf, 15 Minuten)

Wer am Montag mit [MQTT im eigenen Container](praxis-mqtt-container.md) nicht
fertig geworden ist, macht zuerst dort **Teil 1 bis 3**. Danach geht es hier
weiter. Alle anderen starten direkt mit Station 1.

---

## Station 1: Anmelden und mitlesen (15 Minuten)

### Erst ohne Anmeldung

Im **Fenster 1** probiert ihr zuerst, ob der Broker euch auch ohne
Zugangsdaten hereinlässt:

=== "Windows PowerShell"

    ```powershell
    docker run --rm eclipse-mosquitto:2 mosquitto_sub -h $BROKER -p 8883 --tls-use-os-certs -t "kurs/#" -v
    ```

=== "Windows CMD"

    ```bat
    docker run --rm eclipse-mosquitto:2 mosquitto_sub -h %BROKER% -p 8883 --tls-use-os-certs -t "kurs/#" -v
    ```

=== "macOS / Linux"

    ```bash
    docker run --rm eclipse-mosquitto:2 mosquitto_sub -h "$BROKER" -p 8883 --tls-use-os-certs -t "kurs/#" -v
    ```

```text
Connection error: Connection Refused: not authorised
```

Der Broker lässt euch nicht herein, danach seid ihr wieder an der Eingabe.
Genau diese Ablehnung fehlte eurem Broker vom Montag.

### Jetzt mit Anmeldung

Derselbe Befehl, diesmal mit Benutzer (`-u`) und Passwort (`-P`). Das `-it`
sorgt dafür, dass ihr das Mitlesen später mit `Strg+C` beenden könnt:

=== "Windows PowerShell"

    ```powershell
    docker run --rm -it eclipse-mosquitto:2 mosquitto_sub -h $BROKER -p 8883 --tls-use-os-certs -u $BENUTZER -P $PASSWORT -t "kurs/#" -v
    ```

=== "Windows CMD"

    ```bat
    docker run --rm -it eclipse-mosquitto:2 mosquitto_sub -h %BROKER% -p 8883 --tls-use-os-certs -u %BENUTZER% -P %PASSWORT% -t "kurs/#" -v
    ```

=== "macOS / Linux"

    ```bash
    docker run --rm -it eclipse-mosquitto:2 mosquitto_sub -h "$BROKER" -p 8883 --tls-use-os-certs -u "$BENUTZER" -P "$PASSWORT" -t "kurs/#" -v
    ```

Das Fenster wartet jetzt und zeigt jede Nachricht unter `kurs/`. Ein paar
Zeilen erscheinen sofort, obwohl gerade niemand sendet, zum Beispiel:

```text
kurs/lampe/online online
kurs/lampe/zustand {"team": "blau", "befehl": "an", "farbe": "#0000FF", "an": true, "zeit": "18:44:10"}
```

Das sind gespeicherte Nachrichten (retained), dazu mehr in Station 3. Lasst
das Fenster offen, es ist ab jetzt euer Monitor.

| Schalter | Bedeutung |
|---|---|
| `-h` | die Adresse des Kurs-Brokers |
| `-p 8883` | der Port für MQTT mit TLS, am Montag war es 1883 |
| `--tls-use-os-certs` | verschlüsselt die Verbindung und prüft das Zertifikat des Brokers mit den Stammzertifikaten, die im Container mitgeliefert werden |
| `-u` und `-P` | Benutzername und Passwort |

### Das erste Hallo

Im **Fenster 2** sendet ihr einen Gruß:

=== "Windows PowerShell"

    ```powershell
    docker run --rm eclipse-mosquitto:2 mosquitto_pub -h $BROKER -p 8883 --tls-use-os-certs -u $BENUTZER -P $PASSWORT -t kurs/rot/hallo -m "Hallo von Team Rot"
    ```

=== "Windows CMD"

    ```bat
    docker run --rm eclipse-mosquitto:2 mosquitto_pub -h %BROKER% -p 8883 --tls-use-os-certs -u %BENUTZER% -P %PASSWORT% -t kurs/rot/hallo -m "Hallo von Team Rot"
    ```

=== "macOS / Linux"

    ```bash
    docker run --rm eclipse-mosquitto:2 mosquitto_pub -h "$BROKER" -p 8883 --tls-use-os-certs -u "$BENUTZER" -P "$PASSWORT" -t kurs/rot/hallo -m "Hallo von Team Rot"
    ```

Im Fenster 1 erscheint:

```text
kurs/rot/hallo Hallo von Team Rot
```

Die Grüße der anderen Teams laufen dort ebenfalls ein. Öffnet zusätzlich die
[Anzeigetafel](anzeigetafel.html) im Browser und tragt dort Host, Benutzer und
Passwort ein, also dieselben Werte wie in euren Variablen. Der Port 8884 steht
schon drin: Browser sprechen MQTT über WebSocket, dafür hat der Broker einen
eigenen Port. Sucht euren Gruß im Verlauf.

**Frage 1:** Am Montag konnte man die MQTT-Nachricht des Ofens in Wireshark
im Klartext lesen. Was würde jemand sehen, der heute euren Verkehr zum
Kurs-Broker mitschneidet?

??? success "Lösung Station 1"
    Nur verschlüsselte Daten. Mit `--tls-use-os-certs` läuft die Verbindung
    über TLS. Wireshark zeigt dann TLS-Pakete an Port 8883, aber weder Topic
    noch Nutzlast noch Passwort. Dazu kommt die Anmeldung: Ohne Benutzer und
    Passwort lässt der Broker niemanden herein, das habt ihr beim ersten
    Versuch gesehen.

---

## Station 2: Die Signalleuchte (20 Minuten)

Die Lampe hört auf das Topic eurer Teamfarbe, zum Beispiel
`kurs/rot/lampe`. Die Nachricht selbst ist der Befehl:

| Befehl | Was die Lampe tut |
|---|---|
| `an` | leuchtet in eurer Teamfarbe, so sehen alle, wer gerade dran ist |
| `blinken` | atmet 15 Sekunden lang in eurer Teamfarbe |
| `aus` | geht aus, bis ein Team sie wieder einschaltet |
| `#FF8800` | Bonus: eine eigene Farbe als Hex-Code, wie in CSS |

1. Im **Fenster 2** schaltet ihr die Lampe ein:

    === "Windows PowerShell"

        ```powershell
        docker run --rm eclipse-mosquitto:2 mosquitto_pub -h $BROKER -p 8883 --tls-use-os-certs -u $BENUTZER -P $PASSWORT -t kurs/rot/lampe -m an
        ```

    === "Windows CMD"

        ```bat
        docker run --rm eclipse-mosquitto:2 mosquitto_pub -h %BROKER% -p 8883 --tls-use-os-certs -u %BENUTZER% -P %PASSWORT% -t kurs/rot/lampe -m an
        ```

    === "macOS / Linux"

        ```bash
        docker run --rm eclipse-mosquitto:2 mosquitto_pub -h "$BROKER" -p 8883 --tls-use-os-certs -u "$BENUTZER" -P "$PASSWORT" -t kurs/rot/lampe -m an
        ```

2. Im **Fenster 1** seht ihr euren Befehl und gleich danach die
   **Rückmeldung** des Gateways:

    ```text
    kurs/rot/lampe an
    kurs/lampe/zustand {"team": "rot", "befehl": "an", "farbe": "#FF0000", "an": true, "zeit": "19:12:03"}
    ```

    Auch die Anzeigetafel zeigt die Lampe jetzt in eurer Farbe. Die Kamera
    seht ihr im Breakout nicht, die Rückmeldung ist euer Beweis. Steht dort
    ein anderes Team, war es kurz nach euch dran: Das Gateway schaltet
    höchstens alle zwei Sekunden, der neueste Befehl gewinnt.

3. Holt den letzten Befehl mit der Pfeiltaste nach oben, ersetzt `an` durch
   `blinken` und danach durch `aus`.

4. Jetzt absichtlich falsch: Schickt `-m rot`. Das Gateway antwortet mit
   einem **Hinweis**:

    ```text
    kurs/lampe/hinweis Team rot: "rot" verstehe ich nicht. Erlaubt sind an, aus, blinken oder eine Farbe wie #FF8800.
    ```

5. **Bonus:** eine eigene Farbe. Setzt den Hex-Code in Anführungszeichen,
   sonst halten PowerShell und bash das `#` für den Beginn eines Kommentars:
   `-m "#00C8FF"`.

Jede Person im Team schaltet die Lampe mindestens einmal selbst.

**Frage 2:** Das Gateway nimmt höchstens alle zwei Sekunden einen Befehl an.
Kommen mehrere, gewinnt der neueste. Warum baut man so eine Bremse ein?

??? success "Lösung Station 2"
    Ein Gerät, das Befehle von vielen annimmt, muss sich schützen. Ohne
    Bremse könnte ein einziges Skript die Lampe hundertmal pro Sekunde
    schalten und die Hue Bridge überlasten, die nur eine begrenzte Zahl
    Befehle pro Sekunde verarbeitet. In der Fabrik gilt das erst recht: Eine
    Anlage reagiert nicht auf alles, nur weil es im Topic steht. Prüfen,
    bremsen und erst dann ausführen ist die Aufgabe jedes Gateways. Den
    Hinweis bei `rot` habt ihr dem Prüfen zu verdanken.

---

## Station 3: Retain und Last Will (20 Minuten)

### Teil A: Euer Status am Schwarzen Brett

Meldet euren Fortschritt so, dass er auf der Anzeigetafel stehen bleibt. Der
Schalter `-r` macht die Nachricht zur **Retained Message**:

=== "Windows PowerShell"

    ```powershell
    docker run --rm eclipse-mosquitto:2 mosquitto_pub -h $BROKER -p 8883 --tls-use-os-certs -u $BENUTZER -P $PASSWORT -t kurs/rot/status -m "Station 2 geschafft" -r
    ```

=== "Windows CMD"

    ```bat
    docker run --rm eclipse-mosquitto:2 mosquitto_pub -h %BROKER% -p 8883 --tls-use-os-certs -u %BENUTZER% -P %PASSWORT% -t kurs/rot/status -m "Station 2 geschafft" -r
    ```

=== "macOS / Linux"

    ```bash
    docker run --rm eclipse-mosquitto:2 mosquitto_pub -h "$BROKER" -p 8883 --tls-use-os-certs -u "$BENUTZER" -P "$PASSWORT" -t kurs/rot/status -m "Station 2 geschafft" -r
    ```

1. Auf der Anzeigetafel steht der Status jetzt in eurer Teamkachel.
2. Ladet die Anzeigetafel neu (++f5++) und verbindet euch wieder. Ohne
   Häkchen bei „merken" fragt sie das Passwort neu ab. Der Status ist sofort
   wieder da, obwohl ihr nichts erneut gesendet habt.
3. Beendet im Fenster 1 das Mitlesen mit ++ctrl+c++ und startet es neu, die
   Pfeiltaste nach oben holt den Befehl zurück. Auch hier kommt euer Status
   sofort, zusammen mit den anderen gespeicherten Nachrichten.
4. Zum Vergleich: Euer Hallo aus Station 1 hatte kein `-r`. Es taucht beim
   Neustart nicht mehr auf.

### Teil B: Das Testament

Jetzt hinterlegt ihr beim Broker ein Testament. Dazu startet ihr einen
Client, der im Hintergrund verbunden bleibt und auf eure Lampen-Befehle
hört. Er bekommt einen festen Namen, damit ihr ihn gleich gezielt beenden
könnt:

=== "Windows PowerShell"

    ```powershell
    docker run -d --rm --name rot-funk eclipse-mosquitto:2 mosquitto_sub -h $BROKER -p 8883 --tls-use-os-certs -u $BENUTZER -P $PASSWORT -t kurs/rot/lampe -k 10 --will-topic kurs/rot/online --will-payload offline --will-retain
    ```

=== "Windows CMD"

    ```bat
    docker run -d --rm --name rot-funk eclipse-mosquitto:2 mosquitto_sub -h %BROKER% -p 8883 --tls-use-os-certs -u %BENUTZER% -P %PASSWORT% -t kurs/rot/lampe -k 10 --will-topic kurs/rot/online --will-payload offline --will-retain
    ```

=== "macOS / Linux"

    ```bash
    docker run -d --rm --name rot-funk eclipse-mosquitto:2 mosquitto_sub -h "$BROKER" -p 8883 --tls-use-os-certs -u "$BENUTZER" -P "$PASSWORT" -t kurs/rot/lampe -k 10 --will-topic kurs/rot/online --will-payload offline --will-retain
    ```

Docker antwortet nur mit einer langen Container-ID. Das ist richtig so: Der
Client läuft jetzt im Hintergrund und bleibt verbunden.

| Schalter | Bedeutung |
|---|---|
| `-d --rm --name rot-funk` | läuft im Hintergrund unter einem festen Namen und räumt sich am Ende selbst weg |
| `-k 10` | Keepalive: spätestens alle 10 Sekunden ein Lebenszeichen an den Broker |
| `--will-topic kurs/rot/online` | das Topic für das Testament |
| `--will-payload offline` | der Text des Testaments |
| `--will-retain` | das Testament bleibt als Retained Message am Brett hängen |

Meldet euer Team danach selbst als online, wieder mit `-r`:

=== "Windows PowerShell"

    ```powershell
    docker run --rm eclipse-mosquitto:2 mosquitto_pub -h $BROKER -p 8883 --tls-use-os-certs -u $BENUTZER -P $PASSWORT -t kurs/rot/online -m online -r
    ```

=== "Windows CMD"

    ```bat
    docker run --rm eclipse-mosquitto:2 mosquitto_pub -h %BROKER% -p 8883 --tls-use-os-certs -u %BENUTZER% -P %PASSWORT% -t kurs/rot/online -m online -r
    ```

=== "macOS / Linux"

    ```bash
    docker run --rm eclipse-mosquitto:2 mosquitto_pub -h "$BROKER" -p 8883 --tls-use-os-certs -u "$BENUTZER" -P "$PASSWORT" -t kurs/rot/online -m online -r
    ```

Die Anzeigetafel zeigt euer Team jetzt als online. Und nun der Ernstfall: Ihr
beendet den Client hart, so als fiele der Strom aus.

```text
docker kill rot-funk
```

Kurz danach meldet die Anzeigetafel euer Team als offline. Im Fenster 1
erscheint:

```text
kurs/rot/online offline
```

Diese Nachricht habt nicht ihr geschickt, sondern der Broker: Er hat euer
Testament veröffentlicht.

Zum Vergleich noch einmal mit ordentlichem Ende: Startet `rot-funk` wie
oben, meldet euch wieder online und beendet den Client diesmal mit

```text
docker stop rot-funk
```

Beobachtet Fenster 1 und die Anzeigetafel eine halbe Minute lang.

**Frage 3:** Nach `docker kill` stand euer Team auf offline, nach
`docker stop` bleibt es online. Warum? Und was sollte ein Gerät deshalb tun,
bevor es sich ordentlich abmeldet?

??? success "Lösung Station 3"
    `docker kill` beendet den Client sofort, die Verbindung reißt ohne
    Abmeldung ab. Genau für diesen Fall hat der Broker das Testament und
    veröffentlicht es. `docker stop` gibt dem Client Zeit, sich ordentlich
    abzumelden (MQTT-Paket DISCONNECT). Nach einer ordentlichen Abmeldung
    verwirft der Broker das Testament, es gab ja keinen Ausfall. Ein sauberes
    Gerät meldet deshalb vor dem Abmelden selbst `offline` mit `-r`, sonst
    zeigt die Tafel einen veralteten Stand. Holt das jetzt nach: Sendet
    `offline` mit `-r` an `kurs/rot/online`.

    Zu Teil A: Retained Messages sind für Zustände gedacht, die jeder
    Neuankömmling sofort kennen soll, etwa ob ein Gerät online ist oder
    welche Farbe die Lampe gerade hat.

---

## Challenge: Ein eigener Sensor im Container

Bisher habt ihr von Hand gesendet. Echte Sensoren melden von selbst, im
festen Takt. Genau so ein Gerät baut ihr jetzt: einen Container, der alle
fünf Sekunden die Temperatur eures Backofens meldet. Der Ofen heizt beim
Start von 180 °C auf und pendelt sich um 228 °C ein.

1. [ofen-sensor.zip herunterladen](dateien/ofen-sensor.zip) und entpacken.
   Unter Windows: Rechtsklick, **Alle extrahieren**. Im Ordner `ofen-sensor`
   liegen zwei Dateien: das `Dockerfile` und das Skript `sensor.sh`.
2. Öffnet `sensor.sh` und lest es einmal durch, unter Windows mit Rechtsklick,
   **Öffnen mit**, **Editor**. Es ist kurz: eine Schleife, die rechnet, sendet
   und wartet.
3. Wechselt im Fenster 2 in den Ordner und baut das Image:

    === "Windows PowerShell"

        ```powershell
        cd $HOME\Downloads\ofen-sensor
        docker build -t ofen-sensor .
        ```

    === "Windows CMD"

        ```bat
        cd %USERPROFILE%\Downloads\ofen-sensor
        docker build -t ofen-sensor .
        ```

    === "macOS / Linux"

        ```bash
        cd ~/Downloads/ofen-sensor
        docker build -t ofen-sensor .
        ```

4. Startet den Sensor. Die Zugangsdaten gebt ihr als Umgebungsvariablen mit,
   so wie am Montag bei Compose:

    === "Windows PowerShell"

        ```powershell
        docker run -d --name ofen-sensor -e TEAM=rot -e MQTT_HOST=$BROKER -e MQTT_USER=$BENUTZER -e MQTT_PASS=$PASSWORT ofen-sensor
        ```

    === "Windows CMD"

        ```bat
        docker run -d --name ofen-sensor -e TEAM=rot -e MQTT_HOST=%BROKER% -e MQTT_USER=%BENUTZER% -e MQTT_PASS=%PASSWORT% ofen-sensor
        ```

    === "macOS / Linux"

        ```bash
        docker run -d --name ofen-sensor -e TEAM=rot -e MQTT_HOST="$BROKER" -e MQTT_USER="$BENUTZER" -e MQTT_PASS="$PASSWORT" ofen-sensor
        ```

5. Schaut dem Sensor bei der Arbeit zu. ++ctrl+c++ beendet nur die Anzeige,
   der Sensor läuft weiter:

    ```text
    docker logs -f ofen-sensor
    ```

6. Auf der Anzeigetafel erscheint die Temperatur in eurer Teamkachel, samt
   Verlaufslinie. Starten mehrere aus einem Team einen Sensor, mischen sich
   die Werte in der Kachel. Das ist kein Fehler: Alle senden ins selbe Topic,
   und das Topic sagt nichts über den Absender.

**Weiter für Neugierige:** Startet den Sensor mit `-e INTERVALL=2` neu
(vorher `docker rm -fv ofen-sensor`). Oder ändert in `sensor.sh` die
Starttemperatur, baut neu und startet wieder.

**Frage 4:** Euer Sensor kennt weder die Anzeigetafel noch die anderen Teams.
Wie kommen seine Werte trotzdem dorthin?

??? success "Lösung Challenge"
    Über den Broker. Der Sensor veröffentlicht nur in sein Topic
    `kurs/rot/ofen/temperatur`. Die Anzeigetafel hat `kurs/#` abonniert und
    bekommt deshalb jede Nachricht darunter, auch von Geräten, die es beim
    Start der Tafel noch gar nicht gab. Genau diese Entkopplung macht MQTT
    für das IoT so praktisch: Neue Geräte kommen dazu, ohne dass jemand die
    Empfänger umbaut.

---

## Notieren für die Auswertung

- Woran habt ihr ohne Kamera erkannt, dass eure Lampe geschaltet hat?
- Eure Antwort auf Frage 3 in einem Satz.
- Alle Teams nutzen denselben Zugang. Was könnte Team Blau deshalb tun, was
  es eigentlich nicht dürfte?

## Aufräumen

```text
docker rm -fv rot-funk ofen-sensor
docker rmi ofen-sensor
```

Meldungen wie `No such container` sind hier kein Problem, dann war der
Container schon weg. Die Variablen verschwinden mit dem Fenster.

## Wenn es klemmt

Erst die [Stolpersteine](stolpersteine.md#mqtt-live) prüfen, dann um Hilfe
bitten.
