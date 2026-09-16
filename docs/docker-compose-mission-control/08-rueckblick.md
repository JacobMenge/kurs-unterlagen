---
title: "Rückblick"
description: "Was der Mission-Control-Stack aus vier Docker-Abenden zusammenführt und wie es im Kurs weitergeht."
---

# Rückblick

Vier Abende Docker stecken in dieser einen Datei:

| Abend | Baustein | Wo er heute steckt |
|---|---|---|
| Docker Grundlagen | Container starten, Ports, Images | jeder Service, `ports:` |
| Docker Aufbau | Volumes, Netze, Umgebungsvariablen | `aurora-data`, Servicenamen, `MODUL_NAME` |
| Docker Compose | services, up und down, YAML | die ganze Datei |
| Docker Praxis | build, .env, Healthcheck, Heartbeat | `build:`, `${...}`, `healthcheck:` |

Der Merksatz bleibt: **Die Datei ist der Stack.** Wer die `compose.yaml`
und die `.env` hat, baut die Station auf jedem Rechner in Minuten neu.

Ab Mittwoch wechselt das Kapitel: Industrie und IoT. Der Werkzeugkasten
von heute bleibt im Einsatz, der MQTT-Broker der nächsten Wochen wohnt
bei uns in einem Container.
