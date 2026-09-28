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
