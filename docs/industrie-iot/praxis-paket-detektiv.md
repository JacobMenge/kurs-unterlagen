---
title: "Praxis: Paket-Detektiv"
description: "Wireshark-Übung mit dem Mitschnitt fabrik-halle1.pcap: Protokolle erkennen, Profinet-Namen finden, MQTT im Klartext lesen."
---

# Praxis: Paket-Detektiv

Ein Kollege hat euch einen Mitschnitt aus dem Netz der **Halle 1** mitgebracht. Eure Aufgabe: herausfinden, **wer** dort spricht, **welche Sprachen** benutzt werden und **was** verraten wird. Alles, was ihr braucht, steckt in einer einzigen Datei.

!!! abstract "Ziel"
    Am Ende könnt ihr:

    - einen Mitschnitt in Wireshark öffnen und euch mit der Protokoll-Statistik orientieren
    - mit Anzeigefiltern gezielt Protokolle herausfiltern (`pn_dcp`, `pn_io`, `mqtt`, `opcua`)
    - die Profinet-Namensrunde lesen und die Geräte der Halle benennen
    - eine MQTT-Nachricht bis zur Nutzlast aufklappen und die Sicherheitsfrage dazu beantworten

## Voraussetzungen

- **Wireshark ist installiert**, siehe [Wireshark installieren](wireshark-installation.md).
- **Der Mitschnitt liegt lokal:** [fabrik-halle1.pcap herunterladen](mitschnitte/fabrik-halle1.pcap). Speichert die Datei dort, wo ihr sie wiederfindet, zum Beispiel im Downloads-Ordner.
- Kein Terminal nötig: Die ganze Übung findet in der Wireshark-Oberfläche statt und ist damit auf Windows, macOS und Linux identisch.

!!! info "Womit du hier arbeitest"
    **Wireshark** zeigt Netzwerkverkehr Paket für Paket, wie ein Röntgenblick ins Kabel. Ein **Mitschnitt** (Datei `.pcap`, packet capture) ist aufgezeichneter Verkehr zum Nachschauen: gleiche Ansicht, nur ohne live dabei zu sein. Du musst nichts konfigurieren, nur öffnen, filtern und lesen. Für die Prüfung zählt, dass du Protokolle erkennen und einordnen kannst; im Beruf ist der geübte Wireshark-Blick bei jeder Netz-Fehlersuche Gold wert.

---

## Teil 1: Öffnen und Überblick (10 Minuten)

1. Wireshark starten, dann **Datei → Öffnen** (File → Open) und `fabrik-halle1.pcap` auswählen.
2. Ihr seht die Paketliste: eine Zeile je Paket, mit Zeit, Quelle, Ziel und Protokoll.
3. Öffnet **Statistiken → Protokollhierarchie** (Statistics → Protocol Hierarchy).

**Frage 1:** Welche Protokolle stecken im Mitschnitt und welches stellt die meisten Pakete?

??? success "Lösung Teil 1"
    Die Hierarchie zeigt unter Ethernet: **PN-RT** (Profinet Real-Time, darunter PN-DCP und PN-IO), **TCP** mit **MQTT** und **OPC UA**, dazu etwas **ARP** und **LLDP**. Die meisten Pakete stellt Profinet (PN-RT mit 13 Frames), denn zyklische Prozessdaten kommen ständig.

---

## Teil 2: Profinet, die Namensrunde (15 Minuten)

Tippt oben in die **Anzeigefilter-Leiste** (das Eingabefeld über der Paketliste):

```text
pn_dcp
```

Mit ++enter++ bestätigen. Die Leiste wird grün, wenn der Filter gültig ist, und die Liste zeigt nur noch vier Pakete: eine Frage und drei Antworten.

1. Öffnet das **erste** Paket (die Frage). Im Detailbereich seht ihr: ServiceID **Identify**, gesendet an eine Multicast-Adresse. Der Controller ruft: Wer ist hier?
2. Öffnet die drei **Antworten** und klappt jeweils den Block **Device/NameOfStation** auf.

**Frage 2a:** Wie heißen die drei Geräte der Halle?
**Frage 2b:** Eines der drei ist der **IO-Controller** (die SPS, die das Sagen hat). Welches? Tipp: Block **Device/Device Role**.
**Frage 2c:** Löscht den Filter und setzt stattdessen `pn_io`. Schaut auf die **Zeit-Spalte**: In welchem Abstand kommen diese Pakete ungefähr?

??? success "Lösung Teil 2"
    - **2a:** `plc-halle1`, `io-presse-01`, `hmi-panel-03`.
    - **2b:** `plc-halle1` trägt die Rolle **IO-Controller**, die beiden anderen sind IO-Devices. Nebenbei: Wireshark zeigt euch über die MAC-Adressen sogar die Hersteller an.
    - **2c:** Rund alle **32 Millisekunden** ein Frame: der feste Zyklus, in dem Prozessdaten laufen. Genau das meint Echtzeit am Band.

!!! tip "Kommt euch die Namensrunde bekannt vor?"
    Namen statt Adressen beim Anlauf: Das Prinzip kennt ihr von DNS und von euren Docker-Netzen. Die Fabrik löst dasselbe Problem, nur eine Etage tiefer und ohne zentralen Server.

---

## Teil 3: MQTT im Klartext (15 Minuten)

Neuer Filter:

```text
mqtt
```

Ihr seht den Verbindungsaufbau (**Connect Command** und **Connect Ack**) und zwei **Publish Message**-Pakete.

1. Öffnet das erste Publish-Paket und klappt im Detailbereich **MQ Telemetry Transport Protocol** auf.

**Frage 3a:** Zu welchem **Topic** wird veröffentlicht und was steht in der Nutzlast?
**Frage 3b:** Rechtsklick auf das Paket, dann **Folgen → TCP-Stream** (Follow → TCP Stream). Was fällt euch auf, und die entscheidende Frage: **Wer kann das alles mitlesen?**

??? success "Lösung Teil 3"
    - **3a:** Topic `halle1/presse/temperatur` mit der Nutzlast `{"wert": 78.5, "einheit": "C"}`. Das zweite Publish meldet `halle1/presse/status`.
    - **3b:** Der komplette Austausch steht **im Klartext** im Stream, inklusive Client-Name `edge-halle1`. Mitlesen kann jeder, der an den Verkehr kommt, so wie ihr gerade. Deshalb gehört MQTT produktiv hinter **TLS** (Port 8883 statt 1883) und hinter Zugangskontrolle. Am Montag, wenn ihr euren eigenen Broker betreibt, kommen wir genau darauf zurück.

---

## Bonus: für schnelle Detektive

### Bonus 1: Der vierte Gesprächspartner

Filter `opcua`. Öffnet die **Hello**-Nachricht.

**Frage:** An welche Endpunkt-Adresse richtet sich der Verbindungsaufbau und auf welchem Port lauscht ein OPC-UA-Server?

??? success "Antwort"
    `opc.tcp://10.10.1.30:4840`, der Standard-Port von OPC UA ist **4840**. Im Mitschnitt steckt nur der Handschlag (Hello und Acknowledge), das reicht als Fingerabdruck des Protokolls.

### Bonus 2: Wer verteilt hier eigentlich?

Filter `lldp`. Der Switch der Halle stellt sich selbst vor.

??? success "Antwort"
    LLDP (Link Layer Discovery Protocol) ist die Visitenkarte der Netzgeräte: Der Switch meldet den Systemnamen `sw-halle1` und den Port. Praktisch, wenn man vor einem unbeschrifteten Schrank steht.

### Bonus 3: Hersteller-Raten mit MAC-Adressen

Schaut in der Paketliste auf die Quell-Adressen der drei Profinet-Geräte.

??? success "Antwort"
    Wireshark übersetzt die ersten drei Bytes der MAC-Adresse (die Hersteller-Kennung) automatisch in Namen. So verraten die Geräte ihre Hersteller, noch bevor man ein einziges Paket öffnet.

### Bonus 4: Wer redet mit wem?

**Statistiken → Gespräche** (Statistics → Conversations), Reiter TCP.

??? success "Antwort"
    Zwei Unterhaltungen: Edge-Rechner zu Broker auf **1883** (MQTT) und Leitrechner zu SPS auf **4840** (OPC UA). Die Gesprächsliste ist oft der schnellste Überblick in fremden Mitschnitten.

---

## Notieren für die Auswertung

- die drei Gerätenamen und wer davon der Controller ist
- das Temperatur-Topic samt Wert
- eure Antwort in einem Satz: Warum ist der MQTT-Verkehr in dieser Form ein Sicherheitsproblem?

## Wenn es klemmt

Erst die [Stolpersteine](stolpersteine.md) prüfen, dann um Hilfe bitten.
