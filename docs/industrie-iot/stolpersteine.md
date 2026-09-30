---
title: "Stolpersteine"
description: "Die typischen Wireshark-Hürden der Paket-Detektiv-Übung und ihre Lösungen."
---

# Stolpersteine

Die häufigsten Hürden aus den Übungen dieses Blocks, jeweils mit Lösung. Erst hier schauen, dann fragen.

## Installation

??? warning "Windows: Die Installation verlangt Administratorrechte, die ich nicht habe"
    Nimm die **portable Version** (Windows x64 PortableApps®), sie läuft ohne Installation. Schritt für Schritt steht das unter [Wireshark installieren](wireshark-installation.md). Klappt auch das nicht: im Duo mit jemandem aus der Gruppe weiterarbeiten.

??? warning "Windows: Der Installer startet nicht oder meldet eine falsche Architektur"
    Vermutlich passt der Installer nicht zum Prozessor. Notebooks mit Snapdragon-Prozessor brauchen den **Windows Arm64 Installer**, alle anderen den **Windows x64 Installer**. Nachsehen unter **Einstellungen → System → Info**, Zeile „Systemtyp".

## Paket-Detektiv

??? warning "Die Filterleiste ist rot und es passiert nichts"
    Der Anzeigefilter ist ungültig, meist ein Tippfehler. Die Filter dieser Übung heißen genau so, alles klein geschrieben:

    ```text
    pn_dcp
    pn_io
    mqtt
    opcua
    lldp
    ```

    Grün heißt gültig, rot heißt Tippfehler. Nach der Eingabe ++enter++ nicht vergessen.

??? warning "Anzeigefilter oder Mitschnittfilter?"
    Wireshark hat zwei Filterarten. Für diese Übung braucht ihr ausschließlich den **Anzeigefilter**: das Eingabefeld direkt **über der Paketliste**, sichtbar sobald die Datei geöffnet ist. Der Mitschnittfilter (auf der Startseite, vor einer Live-Aufnahme) spielt heute keine Rolle.

??? warning "Die Liste ist leer, obwohl der Filter grün ist"
    Vermutlich wirkt noch ein alter Filter zusätzlich oder der Filter passt schlicht auf kein Paket. Klickt das kleine **X** rechts in der Filterleiste, dann zeigt Wireshark wieder alle Pakete. Danach den Filter neu setzen.

??? warning "Datei lässt sich nicht öffnen oder es öffnet sich das falsche Programm"
    Öffnet die Datei aus Wireshark heraus über **Datei → Öffnen** (File → Open) statt per Doppelklick. Falls der Browser die Datei beim Download umbenannt hat: Sie muss auf `.pcap` enden.

??? warning "Bei mir sind die Menüs anders beschriftet"
    Wireshark folgt der Systemsprache. Die Übung nennt beide Namen, zum Beispiel **Statistiken/Statistics** und **Folgen/Follow**. Position und Symbole sind identisch.

??? warning "Wireshark fragt beim Start nach Npcap oder Sonderrechten"
    Beides betrifft nur **Live-Mitschnitte** von der eigenen Netzwerkkarte. Für das Öffnen der Übungsdatei könnt ihr solche Fragen ruhig verneinen oder wegklicken, es funktioniert trotzdem alles.

??? warning "Ich sehe im MQTT-Paket kein Topic"
    Klappt im Detailbereich (Mitte) den Eintrag **MQ Telemetry Transport Protocol** mit dem Pfeil auf. Das Topic steht erst in der aufgeklappten Ebene. Die Publish-Pakete erkennt ihr in der Info-Spalte an **Publish Message**.

??? warning "Die Zeit-Spalte zeigt komische Werte"
    Rechtsklick auf die Spaltenüberschrift oder **Ansicht → Zeitanzeigeformat** (View → Time Display Format) und zum Beispiel „Sekunden seit Beginn" wählen. Für die Zyklus-Frage in Teil 2 reicht der Abstand zwischen zwei Zeilen.

## MQTT im Container

??? warning "`docker: error during connect` oder `Cannot connect to the Docker daemon`"
    Docker Desktop läuft nicht. Starten, warten, bis unten links „Engine running" steht, dann den Befehl wiederholen.

??? warning "`Bind for 0.0.0.0:1883 failed: port is already allocated`"
    Auf Port 1883 läuft schon ein Broker, meist ein `broker` von einem früheren Versuch. `docker ps` zeigt ihn, `docker rm -f broker` entfernt ihn. Danach neu starten.

??? warning "`Conflict. The container name "/broker" is already in use`"
    Ein Container mit dem Namen `broker` existiert noch, auch wenn er gestoppt ist. `docker rm -f broker` räumt ihn weg.

??? warning "`network with name mqtt-netz already exists`"
    Das Netzwerk gibt es schon von einem früheren Versuch. Kein Problem: diesen Schritt einfach überspringen und weitermachen.

??? warning "Das Abo-Fenster hängt und zeigt nichts"
    Das ist richtig so: `mosquitto_sub` wartet auf Nachrichten. Sendet im **zweiten** Fenster etwas an ein passendes Topic. Beenden mit `Strg+C`.

??? warning "Es kommt nichts an, obwohl ich sende"
    Topic genau vergleichen: `halle1/ofen/temperatur` passt auf das Abo `halle1/#`, aber `Halle1/ofen/temperatur` nicht. Topics unterscheiden Groß- und Kleinschreibung.

## MQTT live

??? warning "`Unable to connect (Lookup error).`"
    Die Adresse des Brokers stimmt nicht. Meist steht noch der Platzhalter `adresse-aus-dem-chat` in der Variable oder das Fenster ist neu und die Variable fehlt ganz. Prüfen mit `echo $BROKER` (in CMD `echo %BROKER%`) und den Block aus der Vorbereitung erneut ausführen.

??? warning "`Error: Unknown option '8883'.`"
    Die Variable `BROKER` ist in diesem Fenster leer, dadurch rutscht `-p` an die Stelle der Adresse. Variablen gelten nur in dem Fenster, in dem ihr sie gesetzt habt: den Block aus der Vorbereitung hier noch einmal ausführen.

??? warning "Der Befehl hängt ohne jede Ausgabe"
    Beim Mitlesen ist Warten normal. Kommt aber gar nichts, nicht einmal die gespeicherten Nachrichten wie `kurs/lampe/online`, fehlt meist der Schalter `--tls-use-os-certs`. Ohne ihn spricht der Client unverschlüsselt mit einem Port, der nur TLS versteht. Beide warten dann aufeinander. Mit `Strg+C` abbrechen und den Befehl mit dem Schalter wiederholen.

??? warning "`Error: Bad file descriptor`"
    Im Befehl steht der Port 1883 vom Montag. Der Kurs-Broker nimmt nur verschlüsselte Verbindungen auf Port **8883** an.

??? warning "`Connection error: Connection Refused: not authorised` trotz Zugangsdaten"
    Benutzer oder Passwort kommen nicht richtig an. Mit `echo $BENUTZER` und `echo $PASSWORT` prüfen (in CMD mit `%…%`). In CMD dürfen um das `=` keine Leerzeichen stehen, in PowerShell braucht jede Variable das `$` davor. Beim Kopieren aus dem Chat kein Leerzeichen am Ende mitnehmen.

??? warning "Die Verbindung hängt und bricht nach einer Weile ab"
    Vermutlich sperrt euer Netz den Port 8883, das kommt in Firmennetzen vor. Probiert dieselbe Verbindung über WebSocket: `-p 8883` durch `--ws -p 8884` ersetzen, der Rest bleibt gleich. Klappt auch das nicht, arbeitet über den Hotspot eures Handys oder im Team am Rechner einer anderen Person.

??? warning "`Error: -m argument given but no message specified.`"
    Die Shell hat die Nachricht verschluckt. Das passiert bei einem Hex-Code ohne Anführungszeichen: Ein `#` am Wortanfang beginnt in PowerShell und bash einen Kommentar. Schreibt `-m "#00C8FF"` mit Anführungszeichen.

??? warning "Die Lampe reagiert nicht auf meinen Befehl"
    Schaut ins Fenster 1:

    - Steht dort ein `kurs/lampe/hinweis`, erklärt das Gateway, was ihm nicht passt, zum Beispiel ein unbekannter Befehl.
    - Das Topic genau prüfen: `kurs/gruen/lampe` ohne Umlaut und alles klein geschrieben. `kurs/Rot/lampe` ist ein anderes Topic.
    - Das Gateway nimmt höchstens alle zwei Sekunden einen Befehl an, der neueste gewinnt. War ein anderes Team kurz nach euch dran, seht ihr in `kurs/lampe/zustand` dessen Farbe.
    - Steht in `kurs/lampe/online` der Wert `offline`, ist das Gateway gerade weg. Dann Bescheid geben.

??? warning "`rot-funk` ist sofort wieder verschwunden"
    Mit `-d --rm` läuft der Client im Hintergrund und wird bei einem Fehler sofort entfernt, die Fehlermeldung seht ihr dann nicht. Startet denselben Befehl einmal ohne `-d` und ohne `--rm`, dann erscheint die Meldung direkt im Fenster. Meist fehlt eine Variable.

??? warning "`the input device is not a TTY`"
    Das passiert in Git Bash. Nehmt für diese Übung die PowerShell im Windows-Terminal, dort funktioniert `-it` ohne Zusatz.

??? warning "`Conflict. The container name "/rot-funk" is already in use`"
    Ein Container mit diesem Namen läuft noch von vorher. `docker rm -f rot-funk` räumt ihn weg, danach neu starten. Für `ofen-sensor` gilt dasselbe.

??? warning "Anzeigetafel: Anmeldung abgelehnt oder keine Verbindung"
    Als Host nur die Adresse eintragen, ohne `https://` und ohne Pfad. Der Port der Tafel ist **8884** (WebSocket mit TLS), nicht 8883. Zeigt die Tafel trotz richtiger Daten keine Verbindung, sperrt vermutlich euer Netz den Port 8884.

??? warning "Sensor: `failed to read dockerfile` beim Bauen"
    Ihr seid nicht im entpackten Ordner. Mit `cd` in den Ordner wechseln, in dem `Dockerfile` und `sensor.sh` liegen. Dann `docker build -t ofen-sensor .` wiederholen. Der Punkt am Ende gehört dazu.

??? warning "Sensor: `Senden fehlgeschlagen, neuer Versuch in 5 Sekunden`"
    In der Zeile darüber steht die eigentliche Meldung von `mosquitto_pub`, meist eine der Fehlermeldungen oben auf dieser Seite. Den Sensor mit `docker rm -fv ofen-sensor` entfernen, die Variablen prüfen und neu starten.
