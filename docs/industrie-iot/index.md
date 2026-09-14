---
title: "Industrie & IoT"
description: "Wie Maschinen sprechen: Profinet, OPC UA und MQTT im Überblick, dazu die Wireshark-Praxis mit einem echten Fabrik-Mitschnitt."
---

# Industrie & IoT

Bisher ging es um Netze und Container im Büro- und Server-Umfeld. Jetzt schauen wir dorthin, wo IT auf Maschinen trifft: in die Produktionshalle. Dort gelten andere Anforderungen und deshalb sprechen die Geräte dort auch andere Sprachen.

## Worum es in diesem Block geht

- **OT verstehen:** Operational Technology, also die Technik, die Maschinen und Anlagen steuert, und warum sie anders tickt als die Büro-IT.
- **Die drei Sprachen kennen:** [Profinet, OPC UA und MQTT](protokolle-ueberblick.md), jede auf ihrer Ebene.
- **Selbst hineinschauen:** Mit [Wireshark](wireshark-installation.md) analysiert ihr einen [echten Mitschnitt](praxis-paket-detektiv.md) aus einer Fabrikhalle.

## Der rote Faden

Eine einzige Messung, zum Beispiel die Temperatur einer Presse, legt einen weiten Weg zurück: Der Sensor meldet sie über **Profinet** an die Steuerung (SPS). Die Steuerung stellt sie über **OPC UA** strukturiert bereit. Ein Edge-Rechner schickt sie per **MQTT** an einen Broker und von dort landet sie im Dashboard oder in der Cloud. Genau diesen Weg seht ihr in diesem Block, erst als Überblick und dann Paket für Paket im Mitschnitt.

## Die Seiten dieses Blocks

| Seite | Inhalt |
|---|---|
| [Wireshark installieren](wireshark-installation.md) | Das Analyse-Werkzeug für Windows, macOS und Linux |
| [Die drei Protokolle](protokolle-ueberblick.md) | Profinet, OPC UA und MQTT kurz und einsatzbezogen erklärt |
| [Praxis: Paket-Detektiv](praxis-paket-detektiv.md) | Die Breakout-Übung mit dem Mitschnitt fabrik-halle1.pcap |
| [Stolpersteine](stolpersteine.md) | Die typischen Wireshark-Hürden und ihre Lösungen |
