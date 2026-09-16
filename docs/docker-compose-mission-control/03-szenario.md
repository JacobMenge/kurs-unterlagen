---
title: "Szenario: die Aurora Station"
description: "Der Funkspruch der Bodenkontrolle: sechs Stationsmodule warten auf ihr Dashboard, das DevOps-Team baut den Stack mit Docker Compose neu auf."
---

# Szenario: die Aurora Station

Die Aurora Station kreist mit sechs Modulen im Orbit: Lebenserhaltung,
Energie, Kommunikation, Forschungslabor, Hydroponik und Andockschleuse.
Überwacht wird sie von der Bodenkontrolle aus, mit einem Dashboard namens
**Mission Control**.

!!! warning "Der Funkspruch von heute Morgen"
    Das alte Deployment ist abgerissen. Übrig sind der Code von Frontend,
    Backend und Datenbank-Init, die fertigen Dockerfiles und die
    Anforderung: diesmal alles mit Docker Compose. Ihr seid das
    DevOps-Team der Bodenkontrolle.

## Wie die Station funktioniert

- Jedes Stationsmodul ist ein **eigener Container**. Alle sechs entstehen
  aus **demselben Image**, nur die Umgebungsvariable `MODUL_NAME`
  unterscheidet sie. Genau das ist das Muster von Montag: ein Bauplan,
  mehrere Umgebungen.
- Ein Modul **meldet sich alle drei Sekunden** selbst beim Backend
  („Energie ist da"). Bleibt die Meldung acht Sekunden aus, gilt das Modul
  als offline. So etwas heißt **Heartbeat**: ein regelmäßiges
  Lebenszeichen, die einfachste Form von Verfügbarkeitsüberwachung.
- Jeden Wechsel (online, offline) schreibt das Backend in die Tabelle
  `logbuch` der Datenbank. Das Logbuch seht ihr im Frontend und über
  Adminer. Liegt die Datenbank auf einem **Volume**, übersteht die
  Historie jeden Neustart des Stacks.
- Das Frontend zeigt die Station: sechs Stellplätze, die aufleuchten,
  sobald das passende Modul läuft. Dazu vier Lampen für Frontend, Backend,
  Datenbank und Adminer.

Alles läuft in **einem Compose-Projekt**: ein gemeinsames Netz, in dem
sich alle Dienste über ihre Servicenamen erreichen. Nach außen offen sind
nur zwei Türen: `8080` (Frontend) und `8081` (Adminer).

Weiter zu den [Missionen](04-aufgabenuebersicht.md).
