---
title: "Projekt: Smart Home zu Hause"
description: "Freiwilliges Projekt: ein kleines, lokales und sicheres Smart Home mit eigenem MQTT-Broker. Drei günstige Gerätewege zur Auswahl, dazu Rechte je Gerät am Broker."
---

# Projekt: Smart Home zu Hause

Im Kurs habt ihr über einen Broker eine echte Lampe geschaltet. Denselben
Aufbau setzt ihr hier bei euch zu Hause auf: **einen eigenen Broker**,
**günstige Geräte, die MQTT sprechen** und **Rechte je Gerät**, damit nicht
jedes Gerät alles darf. Alles läuft lokal im Heimnetz, ohne Hersteller-Cloud.

Das Projekt ist **freiwillig**. Ihr könnt sofort ohne jedes Gerät anfangen
und später eines der drei vorgeschlagenen Geräte dazukaufen.

!!! abstract "Ziel"
    Am Ende habt ihr:

    - einen eigenen MQTT-Broker mit Benutzern und Passwörtern, gestartet mit Docker Compose
    - ein erstes Gerät, das ihr per MQTT schaltet: virtuell oder echt
    - für jedes Gerät einen eigenen Zugang, der nur seine eigenen Topics benutzen darf

## So läuft das Projekt

| Teil | Inhalt | Für wen | Zeit |
|---|---|---|---|
| 1 | Der eigene Broker mit Passwort | alle | 15 Min. |
| 2 | Üben ohne Gerät: die virtuelle Lampe | alle | 10 Min. |
| 3 | Ein echtes Gerät: drei Wege zur Auswahl | wer ein Gerät hat oder kaufen will | 30 Min. |
| 4 | Sicher betreiben: Rechte je Gerät | alle | 20 Min. |
| 5 | Weiter mit Home Assistant | wer mehr will | offen |

Wer schon eine **Philips Hue Bridge** hat, findet am Ende der Seite einen
eigenen Abschnitt dazu.

## Womit du hier arbeitest

| Baustein | Was er tut |
|---|---|
| **Broker** | Mosquitto im Container, wie im Kurs. Nur mit Anmeldung, die Daten bleiben über Neustarts erhalten. |
| **Virtuelle Lampe** | Ein kurzes Shell-Skript in einem Container. Es versteht Befehle wie `rot` oder `aus` und meldet seinen Zustand zurück wie ein echtes Gerät. |
| **Euer Gerät** | Eine WLAN-Steckdose, ein Shelly oder Zigbee-Geräte. Alle drei sprechen MQTT und kommen ohne Cloud aus. |
| **Docker Compose** | Startet alles gemeinsam aus einer Datei, so wie im Compose-Abend. |

---

## Teil 1: Der eigene Broker mit Passwort (15 Minuten)

1. [smart-home.zip herunterladen](dateien/smart-home.zip) und entpacken.
   Unter Windows: Rechtsklick, **Alle extrahieren**. Im Ordner `smart-home`
   liegen `compose.yaml` und `.env`, der Ordner `config` mit der
   Broker-Konfiguration, `lampe` mit der virtuellen Lampe und `befehle` mit
   fertigen Befehlsdateien.
2. Öffnet ein Terminal und wechselt in den Ordner:

    === "Windows PowerShell"

        ```powershell
        cd $HOME\Downloads\smart-home
        ```

    === "Windows CMD"

        ```bat
        cd %USERPROFILE%\Downloads\smart-home
        ```

    === "macOS / Linux"

        ```bash
        cd ~/Downloads/smart-home
        ```

3. Legt euren eigenen Benutzer an. Denkt euch ein Passwort nur aus Buchstaben
   und Ziffern aus. Setzt es statt `DeinPasswort` ein:

    ```text
    docker compose run --rm broker mosquitto_passwd -c -b /mosquitto/config/passwd zuhause DeinPasswort
    ```

    ```text
    Adding password for user zuhause
    ```

    Der Befehl startet kurz einen Broker-Container, aber nur das Werkzeug
    `mosquitto_passwd`. Es schreibt die Datei `config/passwd`, das Passwort
    steht darin nicht im Klartext, sondern als Hash. Das `-c` legt die Datei
    **neu** an. Bei jedem weiteren Benutzer lasst ihr es weg, sonst sind die
    alten Benutzer gelöscht.

4. Tragt dasselbe Passwort in die Datei `.env` ein, in die Zeile
   `MQTT_PASS=`. Damit meldet sich die virtuelle Lampe beim Broker an.

    === "Windows"

        ```powershell
        notepad .env
        ```

    === "macOS"

        ```bash
        open -e .env
        ```

5. Startet den Stapel und schaut ins Log der Lampe:

    ```text
    docker compose up -d --build
    docker compose logs lampe
    ```

    ```text
    lampe-1  | Lampen-Gateway startet als Simulation: Broker broker, keine Hue Bridge eingetragen
    ```

---

## Teil 2: Üben ohne Gerät, die virtuelle Lampe (10 Minuten)

Ihr braucht wieder **zwei Terminal-Fenster**, beide im Ordner `smart-home`.

1. Im **Fenster 1** lest ihr alles mit:

    ```text
    docker compose exec broker mosquitto_sub -u zuhause -P DeinPasswort -t "#" -v
    ```

2. Im **Fenster 2** schickt ihr der Lampe einen Befehl:

    ```text
    docker compose exec broker mosquitto_pub -u zuhause -P DeinPasswort -t zuhause/lampe/set -m rot
    ```

    ```text
    zuhause/lampe/set rot
    zuhause/lampe/zustand rot
    ```

    Befehl und Rückmeldung in getrennten Topics, genau wie im Kurs. Die Lampe
    versteht `an`, `aus`, `warm`, `blinken`, `rot`, `gruen`, `blau`, `gelb`
    und `lila`. Was sie getan hätte, steht in `docker compose logs lampe`.

3. Startet den Broker neu (`docker compose restart broker`) und das Mitlesen
   ebenfalls. `zuhause/lampe/zustand` ist sofort wieder da: Der Zustand ist
   gespeichert (retained). Der Broker hebt ihn dank `persistence true`
   auch über den Neustart hinweg auf.

---

## Teil 3: Ein echtes Gerät, drei Wege

Alle drei Wege haben gemeinsam: Die Geräte sprechen MQTT ohne Umweg über eine
Hersteller-Cloud. Außerdem bekommen sie von euch einen eigenen Zugang zum Broker.
Sucht euch einen Weg aus.

| | A: WLAN-Steckdose mit Tasmota | B: Shelly | C: Zigbee mit Zigbee2MQTT |
|---|---|---|---|
| **Kosten zum Start** | rund 10 bis 20 € je Steckdose | rund 20 bis 30 € je Gerät | Funk-Adapter rund 25 bis 50 €, Geräte oft ab 10 € |
| **Aufwand** | gering | gering | mittel |
| **Gut für** | Lampen und Geräte an der Steckdose | Steckdosen, Lampen, Sensoren mit schöner Weboberfläche | viele günstige Geräte: Lampen, Taster, Temperatur- und Fenstersensoren mit Batterie |
| **Spricht MQTT** | ab Werk, wenn Tasmota vorinstalliert ist | ab Werk | über das Programm Zigbee2MQTT |
| **Darauf achten** | Nur Geräte mit vorinstalliertem Tasmota kaufen, dann ist kein Umspielen nötig | Zwischenstecker kann jede Person einstecken, Einbau-Relais gehören in die Hand einer Elektrofachkraft | Unter Windows erreicht Docker USB-Sticks nur über Umwege, deshalb einen Netzwerk-Adapter oder einen Raspberry Pi nehmen |

Die Preise sind grobe Richtwerte, Stand Herbst 2026.

!!! info "Die Schritte stammen aus den offiziellen Anleitungen"
    Teil 1, 2 und 4 sind mit genau diesen Dateien getestet. Für die Geräte
    aus Teil 3 stammen Topics und Befehle aus den Anleitungen der Hersteller,
    die bei jedem Weg verlinkt sind. Menüs heißen je nach Firmware-Version
    manchmal etwas anders. Im Zweifel gilt die Anleitung des Herstellers.

**Für alle drei Wege gilt:**

- Die **Adresse eures Brokers** ist die IP-Adresse eures Rechners im
  Heimnetz, der Port ist 1883. Unter Windows zeigt `ipconfig` sie als
  **IPv4-Adresse** an, unter macOS `ipconfig getifaddr en0`. Fragt die
  Windows-Firewall beim ersten Zugriff nach, ob Docker Desktop im privaten
  Netzwerk erreichbar sein darf, erlaubt es.
- **Jedes Gerät bekommt einen eigenen Benutzer**, ohne `-c`. Danach den
  Broker neu starten, damit er den neuen Benutzer kennt:

    ```text
    docker compose run --rm broker mosquitto_passwd -b /mosquitto/config/passwd steckdose1 GeraetePasswort
    docker compose restart broker
    ```

### Weg A: WLAN-Steckdose mit Tasmota

Tasmota ist freie Software für WLAN-Geräte. Es gibt Zwischenstecker, auf denen
sie ab Werk installiert ist. Sucht beim Kauf nach „Tasmota vorinstalliert".

1. Steckdose einstecken. Ab Werk öffnet sie ein eigenes WLAN, dessen Name mit
   `tasmota-` beginnt. Verbindet euch damit, öffnet `http://192.168.4.1` und
   tragt euer WLAN ein.
2. Die neue Adresse der Steckdose zeigt euch der Router. Öffnet sie im Browser.
3. Unter **Configuration**, **Configure Other** den Haken **MQTT Enable**
   setzen und ein **Web Admin Password** vergeben.
4. Unter **Configuration**, **Configure MQTT** eintragen: Host = IP eures
   Rechners, Port 1883, User `steckdose1`, das Passwort von oben und als
   Topic `steckdose1`. Speichern, die Steckdose startet neu.
5. Testen. Im Fenster 1 meldet sich die Steckdose mit
   `tele/steckdose1/LWT Online`, im Fenster 2 schaltet ihr sie:

    ```text
    docker compose exec broker mosquitto_pub -u zuhause -P DeinPasswort -t cmnd/steckdose1/POWER -m ON
    ```

    Die Rückmeldung kommt auf `stat/steckdose1/POWER`. Statt `ON` gehen auch
    `OFF` und `TOGGLE`.

Anleitung des Herstellers: [Tasmota und MQTT](https://tasmota.github.io/docs/MQTT/)

### Weg B: Shelly

Shelly-Geräte sprechen MQTT ab Werk und haben eine eigene Weboberfläche.
Für den Anfang eignet sich ein Zwischenstecker.

1. Shelly einstecken. Ab Werk öffnet er ein eigenes WLAN mit seinem
   Gerätenamen. Verbindet euch damit, öffnet `http://192.168.33.1` und
   tragt euer WLAN ein.
2. Über die neue Adresse aus dem Router die Weboberfläche öffnen. In den
   Einstellungen **MQTT** einschalten und eintragen: Server = IP eures
   Rechners mit `:1883`, Benutzer `shelly-flur`, Passwort, als Präfix
   `shelly-flur`. Den Statusversand über MQTT ebenfalls einschalten.
3. In den Einstellungen die **Cloud ausschalten** und ein **Passwort für die
   Weboberfläche** vergeben.
4. Testen. Im Fenster 1 erscheint der Status auf `shelly-flur/status/switch:0`.
   Geschaltet wird ein Shelly mit einem kurzen JSON-Befehl. Der liegt fertig
   im Ordner `befehle`:

    ```text
    docker compose exec broker mosquitto_pub -u zuhause -P DeinPasswort -t shelly-flur/rpc -f /befehle/shelly-an.json
    ```

    Mit `shelly-aus.json` wieder aus. Der Shelly antwortet auf `zuhause/rpc`.

Anleitung des Herstellers: [Shelly und MQTT](https://shelly-api-docs.shelly.cloud/gen2/ComponentsAndServices/Mqtt)

??? info "Warum eine Datei statt `-m`?"
    Der Befehl ist JSON mit vielen Anführungszeichen. PowerShell und CMD gehen
    mit Anführungszeichen in Argumenten unterschiedlich um. Mit `-f` liest
    `mosquitto_pub` den Befehl aus einer Datei, das funktioniert in jeder
    Shell gleich.

### Weg C: Zigbee mit Zigbee2MQTT

Zigbee ist ein sparsamer Funk für Lampen, Taster und Sensoren mit Batterie.
Ein Funk-Adapter empfängt ihn, das freie Programm **Zigbee2MQTT** übersetzt
in MQTT. Dafür gibt es sehr viele günstige Geräte von verschiedenen Marken.

1. **Den Adapter wählen.** Unter Windows und macOS am einfachsten ein
   **Netzwerk-Adapter**, der per LAN-Kabel am Router hängt, zum Beispiel ein
   SLZB-06. Ein USB-Stick funktioniert gut auf einem Raspberry Pi mit Linux.
2. **Einen Benutzer `zigbee2mqtt` anlegen**, wie oben beschrieben.
3. **Zigbee2MQTT starten.** Der Dienst steht schon in der `compose.yaml` und
   startet nur, wenn ihr das Profil `zigbee` nennt:

    ```text
    docker compose --profile zigbee up -d
    ```

4. Im Browser `http://localhost:8080` öffnen. Beim ersten Start fragt
   Zigbee2MQTT nach den Einstellungen: MQTT-Server `mqtt://broker:1883`,
   Benutzer `zigbee2mqtt` mit Passwort und die Adresse des Adapters. Bei
   einem Netzwerk-Adapter ist das `tcp://` plus seine IP und den Port 6638.
5. In der Oberfläche das Anlernen erlauben und das Gerät in den
   Kopplungsmodus bringen (steht in der Anleitung des Geräts). Gebt ihm einen
   Namen, zum Beispiel `flurlampe`.
6. Testen:

    ```text
    docker compose exec broker mosquitto_pub -u zuhause -P DeinPasswort -t zigbee2mqtt/flurlampe/set/state -m ON
    ```

    Der Zustand kommt auf `zigbee2mqtt/flurlampe`.

Anleitungen: [Zigbee2MQTT, erste Schritte](https://www.zigbee2mqtt.io/guide/getting-started/)
und [Befehle und Topics](https://www.zigbee2mqtt.io/guide/usage/mqtt_topics_and_messages.html)

---

## Teil 4: Sicher betreiben (20 Minuten)

Bisher meldet sich die virtuelle Lampe mit eurem eigenen Zugang an und dürfte
damit alles. Jetzt bekommt sie einen eigenen Zugang mit genau den Rechten, die
sie braucht. Das ist die **ACL** aus dem Kurs, diesmal zum Selbermachen.

1. **Einen Benutzer für die Lampe anlegen**, ohne `-c`:

    ```text
    docker compose run --rm broker mosquitto_passwd -b /mosquitto/config/passwd lampe LampenPasswort
    ```

2. **Die Rechteliste ansehen.** Öffnet `config/acl` im Editor. Dort steht
   schon, was die Lampe darf:

    ```text
    user lampe
    topic read zuhause/lampe/set
    topic write zuhause/lampe/zustand
    ```

    Darunter stehen auskommentierte Beispiele für Tasmota, Shelly und
    Zigbee2MQTT. Entfernt das `#` vor den Zeilen der Geräte, die ihr nutzt.

3. **Die Rechteliste einschalten.** In `config/mosquitto.conf` das `#` vor
   `acl_file /mosquitto/config/acl` entfernen.

4. **Die Lampe auf ihren Zugang umstellen.** In der `.env`
   `MQTT_USER=lampe` und `MQTT_PASS=LampenPasswort` eintragen. Dann:

    ```text
    docker compose restart broker
    docker compose up -d
    ```

5. **Prüfen, dass alles noch geht:** Schickt wie in Teil 2 einen Befehl an
   die Lampe. Befehl und Rückmeldung kommen wie vorher.

6. **Prüfen, was die Lampe nicht mehr darf:** Lasst sie in ein fremdes Topic
   schreiben:

    ```text
    docker compose exec broker mosquitto_pub -u lampe -P LampenPasswort -t zuhause/tuer -m auf
    ```

    Im Fenster 1 kommt **nichts** an. Der Broker verwirft die Nachricht ohne
    Fehlermeldung, so ist MQTT gebaut. Genau so verhindert eine echte Halle,
    dass ein Gerät fremde Befehle verschickt.

**Was sonst noch dazugehört:**

| Maßnahme | Warum |
|---|---|
| Jedes Gerät mit eigenem Benutzer und eigenen Rechten | Ein gekapertes Gerät kann dann nur seine eigenen Topics benutzen. |
| Hersteller-Cloud abschalten, wo es geht | Eure Geräte funktionieren ohne Internet. Niemand außer euch steuert sie. |
| Passwörter für die Weboberflächen der Geräte | Sonst kann jede Person im WLAN die Geräte umkonfigurieren. |
| Updates einspielen | Tasmota, Shelly und Zigbee2MQTT schließen Lücken regelmäßig. |
| **Keine Portfreigabe im Router** | Der Broker läuft ohne TLS und gehört nur ins Heimnetz. Für den Zugriff von unterwegs ist ein VPN der richtige Weg, viele Router haben WireGuard eingebaut. |
| Eigenes Netz für Geräte, wenn der Router es kann | Ein einfaches Gastnetz trennt die Geräte zwar ab, dann erreichen sie aber auch euren Broker nicht mehr. Sauber geht das mit einem eigenen Netz für Geräte und einer Firewall-Regel nur für Port 1883. Das können viele Heimrouter nicht, dann bleiben die Geräte im Heimnetz. |

---

## Teil 5: Weiter mit Home Assistant

Wer viele Geräte verschiedener Marken hat oder eine App mit Automationen will,
landet früher oder später bei **Home Assistant**. Das ist eine freie
Smart-Home-Zentrale mit Anbindungen für fast alle Hersteller. Sie läuft
ebenfalls im Container und kann euren Broker mitbenutzen. Einen eigenen
Benutzer mit passenden Rechten bekommt sie wie jedes andere Gerät.

[Home Assistant installieren](https://www.home-assistant.io/installation/)
und [MQTT in Home Assistant](https://www.home-assistant.io/integrations/mqtt/)

---

## Sonderfall: Ihr habt schon eine Hue Bridge

??? info "Die virtuelle Lampe wird zur echten Hue-Lampe"
    Die virtuelle Lampe kann auch eine echte Lampe an einer Hue Bridge
    schalten. Auch andere Zigbee-Lampen funktionieren, die in der Hue-App
    eingebunden sind.

    1. **Adresse der Bridge:** In der Hue-App unter **Einstellungen**,
       **Bridges** auf das Info-Symbol der Bridge tippen. Die IP-Adresse in
       der `.env` bei `HUE_IP=` eintragen.
    2. **Schlüssel holen:** Befehl starten und innerhalb von 30 Sekunden den
       runden Knopf auf der Bridge drücken. Die ausgegebene Zeile
       `HUE_KEY=…` in die `.env` übernehmen.

        ```text
        docker compose run --rm lampe koppeln
        ```

    3. **Lampennummer finden** und bei `HUE_LAMPE=` eintragen:

        ```text
        docker compose run --rm lampe lampen
        ```

        ```text
        Lampe 18: Arbeitszimmer links
        Lampe 23: Extended color light Rechts
        ```

    4. **Neu starten** mit `docker compose up -d`. Die Befehle aus Teil 2
       schalten jetzt die echte Lampe. Im Log steht die Antwort der Bridge:

        ```text
        09:41:57  gruen, Antwort der Bridge: [{"success":{"/lights/23/state/on":true}},...]
        ```

    Hat die Lampe in Teil 4 schon ihren eigenen Zugang, bleibt der
    unverändert. Die Bridge wird per HTTP angesprochen, nicht über MQTT.

---

## Aufräumen

```text
docker compose down
```

Der Stapel ist gestoppt, eure Benutzer, die Rechteliste und die gespeicherten
Nachrichten bleiben erhalten. Mit `docker compose up -d` geht es später
weiter. Wer alles entfernen will, auch die gespeicherten Daten und das Image
der Lampe:

```text
docker compose down -v --rmi local
```

## Wenn es klemmt

??? warning "`Bind for 0.0.0.0:1883 failed: port is already allocated`"
    Auf Port 1883 läuft noch ein anderer Broker, meist der Container `broker`
    aus der Übung [MQTT im Container](praxis-mqtt-container.md). `docker ps`
    zeigt ihn, `docker rm -f broker` entfernt ihn. Danach
    `docker compose up -d` wiederholen.

??? warning "`Error: Unable to open pwfile` im Log des Brokers"
    Die Passwortdatei fehlt. Den Befehl aus Teil 1, Schritt 3 ausführen, dann
    `docker compose up -d`.

??? warning "Nach dem Anlegen eines Benutzers geht der alte nicht mehr"
    Beim zweiten Benutzer wurde `-c` mitgeschickt. Das legt die Datei neu an
    und löscht alle bisherigen Benutzer. Die Benutzer noch einmal anlegen,
    diesmal ohne `-c`.

??? warning "Warnung über die Rechte der Dateien passwd oder acl"
    Der Broker meldet beim Start, die Datei sei für alle lesbar. Das liegt an
    der Art, wie Ordner in Container eingebunden werden. Der Broker läuft
    trotzdem.

??? warning "Eine Nachricht kommt nicht an, obwohl der Befehl ohne Fehler lief"
    Mit eingeschalteter Rechteliste verwirft der Broker Nachrichten an Topics,
    die der Benutzer nicht schreiben darf, ohne Fehlermeldung. Prüft in
    `config/acl` die Zeilen des Benutzers und startet den Broker danach neu.

??? warning "Das Gerät verbindet sich nicht mit dem Broker"
    IP-Adresse des Rechners prüfen, sie kann sich nach einem Neustart des
    Routers ändern. Port 1883 muss in der Windows-Firewall für Docker Desktop
    erlaubt sein. Benutzer und Passwort müssen exakt zur Datei `passwd`
    passen.

??? warning "Die virtuelle Lampe meldet `Keine Verbindung zum Broker`"
    Benutzer oder Passwort in der `.env` passen nicht zur Datei `passwd`,
    oder die Rechteliste erlaubt dem Benutzer nichts. Beides angleichen, dann
    `docker compose up -d`. Direkt nach dem Start kann die Meldung auch einmal
    erscheinen, bis der Broker bereit ist.
