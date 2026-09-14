---
title: "Die drei Protokolle"
description: "Profinet, OPC UA und MQTT einsatzbezogen erklärt: wo jedes lebt, was es kann und was FISI darüber wissen sollten."
---

# Die drei Protokolle

Eine Fabrik spricht nicht eine Sprache, sondern mehrere, je nach Ebene. Diese Seite ordnet die drei wichtigsten ein. Ziel ist Orientierung: Ihr sollt erkennen, **wo** welches Protokoll arbeitet und **warum**, nicht jedes Bit auswendig lernen.

## Das Bild dahinter: die Ebenen der Automatisierung

Die klassische Sicht stapelt eine Fabrik in Ebenen (oft „Automatisierungspyramide" genannt):

| Ebene | Wer arbeitet hier | Typische Sprache |
|---|---|---|
| Feldebene | Sensoren, Aktoren, IO-Geräte | **Profinet** (und Kollegen wie EtherCAT) |
| Steuerungsebene | SPS (speicherprogrammierbare Steuerung) | **Profinet** nach unten, **OPC UA** nach oben |
| Leit- und Betriebsebene | Leitrechner, Visualisierung, MES | **OPC UA** |
| Unternehmens- und Cloud-Ebene | Dashboards, Analysen, ERP, Cloud | **MQTT**, HTTP |

Nach unten wird es schneller und strenger (Millisekunden, feste Takte), nach oben flexibler und vernetzter. Deshalb gibt es nicht das eine Protokoll für alles.

---

## Profinet: die Echtzeit-Sprache am Band

**Was das ist:** Ein Industrial-Ethernet-Protokoll. Es nutzt normale Ethernet-Technik, spricht aber direkt auf Schicht 2 (ohne TCP/IP) und liefert Prozessdaten in festen Zyklen von wenigen Millisekunden.

**Warum es das braucht:** Eine Steuerung muss sich darauf verlassen, dass der Messwert **jetzt** kommt, nicht irgendwann. Deshalb zyklischer Takt statt „bei Gelegenheit".

**Was ihr im Mitschnitt seht:**

- **PN-DCP**, die Namensrunde beim Anlauf: Der Controller ruft ins Netz „wer ist hier?", jedes Gerät antwortet mit seinem **Gerätenamen** (NameOfStation). Das erinnert nicht zufällig an DNS und an eure Docker-Netze: Auch hier sind Namen die stabilen Adressen.
- **PN-IO**, die zyklischen Prozessdaten: kleine Frames im festen Abstand, jedes mit Zykluszähler.

**Für die Prüfung:** Profinet als Beispiel für Echtzeit-Kommunikation auf Feldebene einordnen können, dazu die Begriffe SPS, IO-Gerät und Gerätename.

**Für den Beruf:** Wer ein Fabrik-Netz betreut, trennt Maschinennetz und Büronetz sauber (euer VLAN-Wissen!) und weiß: In Profinet-Netzen niemals einfach „mal eben" Geräte umstecken.

---

## OPC UA: das Esperanto zwischen Maschine und IT

**Was das ist:** OPC Unified Architecture, ein herstellerneutrales Protokoll, mit dem Maschinen ihre Daten **strukturiert und beschrieben** anbieten: nicht nur „42", sondern „Temperatur der Presse, in Grad Celsius, Grenzwert 80".

**Warum es das braucht:** Jeder Hersteller hat eigene Steuerungen. OPC UA ist die gemeinsame Schnittstelle, damit Leitsysteme nicht für jede Maschine einen eigenen Dolmetscher brauchen.

**Was ihr im Mitschnitt seht:** Den Verbindungsaufbau auf **Port 4840**: eine Hello-Nachricht mit der Endpunkt-Adresse (`opc.tcp://…`) und die Bestätigung. Mehr Tiefe braucht der Abend nicht.

**Für die Prüfung:** OPC UA als herstellerneutrale, sichere Maschinenschnittstelle zwischen Steuerungs- und IT-Welt nennen können.

**Für den Beruf:** Taucht in fast jeder Industrie-4.0-Ausschreibung auf. Gut zu wissen: OPC UA bringt Sicherheit (Zertifikate, Verschlüsselung, Rechte) von Haus aus mit.

---

## MQTT: leichtgewichtig Richtung Cloud

**Was das ist:** Message Queuing Telemetry Transport, ein sehr schlankes Nachrichtenprotokoll nach dem Prinzip **Publish/Subscribe**: Geräte veröffentlichen Nachrichten zu **Topics** (etwa `halle1/presse/temperatur`), ein zentraler **Broker** verteilt sie an alle Abonnenten.

**Warum es das braucht:** Tausende Sensoren, schmale Verbindungen, wechselnde Empfänger. Publish/Subscribe entkoppelt: Der Sensor kennt nur den Broker, nicht die Empfänger.

**Der Broker:** Die Poststelle des Systems. Jeder gibt dort ab, jeder holt dort ab. Am nächsten Kursabend betreibt ihr selbst einen (Mosquitto, natürlich im Container).

**Was ihr im Mitschnitt seht:** Verbindungsaufbau auf **Port 1883**, dann PUBLISH-Pakete mit Topic und Nutzlast **im Klartext**. Genau diese Beobachtung wird eure wichtigste des Abends: Ohne TLS liest jeder im Netz mit.

**Für die Prüfung:** Publish/Subscribe erklären können (mit Topic und Broker) und MQTT als IoT-Standardprotokoll einordnen.

**Für den Beruf:** Von der Fabrik bis zum Smart Home überall im Einsatz. Produktiv gehört MQTT hinter TLS (Port 8883) und Zugangskontrolle.

---

## Merksatz

!!! success "Merksatz"
    > **Profinet taktet das Band, OPC UA übersetzt zur IT, MQTT verteilt in die Welt. Drei Ebenen, drei Sprachen, ein Datenweg.**
