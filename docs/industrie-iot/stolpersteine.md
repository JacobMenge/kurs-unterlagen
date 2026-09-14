---
title: "Stolpersteine"
description: "Die typischen Wireshark-Hürden der Paket-Detektiv-Übung und ihre Lösungen."
---

# Stolpersteine

Die häufigsten Hürden aus der Wireshark-Übung, jeweils mit Lösung. Erst hier schauen, dann fragen.

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
    Vermutlich wirkt noch ein alter Filter zusätzlich oder der Filter passt schlicht auf kein Paket. Klickt das kleine **X** rechts in der Filterleiste, dann zeigt Wireshark wieder alle Pakete, und setzt den Filter neu.

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
