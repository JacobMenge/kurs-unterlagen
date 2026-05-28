---
title: "Hochverfügbarkeit & Redundanz"
description: "Ausfallrisiken von Gesamtsystemen erkennen, mit Redundanz und Clustern begegnen, predictive maintenance einsetzen und über eine Business Impact Analyse die Schadenshöhe ermitteln."
---

# Hochverfügbarkeit & Redundanz

<span class='badge badge-vertiefung'>Vertiefung</span> &nbsp; Manche Systeme dürfen einfach nicht stehenbleiben. Hier geht es darum, Ausfälle nicht nur zu reparieren, sondern sie von vornherein **unwahrscheinlich** zu machen.

!!! note "Status: Platzhalter <span class='badge badge-wip'>in Arbeit</span>"
    Diese Seite ist ein Platzhalter. Der Inhalt folgt – hier siehst du schon, **was behandelt wird** und **worauf es ankommt**.

## Das wird hier behandelt

- **Ausfallrisiken von Gesamtsystemen**: das Zusammenspiel von Hard- und Software, Abhängigkeiten und Kompatibilität
- **redundante Infrastrukturen** und **Clusterbildung** – ein Ausfall, der durch ein zweites System aufgefangen wird
- physische Absicherung: **doppelter Notstrom** und **geografisch verteilte Standorte**
- **predictive maintenance**: aus Betriebsdaten vorhersagen, wann etwas ausfällt, bevor es ausfällt
- die **Business Impact Analyse**: wie hoch wäre der **Schaden**, wenn ein bestimmter Teil ausfällt?
- die Kennzahlen dahinter: wie lange darf etwas ausfallen, wie viel Redundanz lohnt sich

## Worauf es ankommt

Redundanz kostet Geld – also lohnt sie sich nur dort, wo ein Ausfall richtig wehtut. Die Business Impact Analyse liefert genau diese Begründung: Sie macht aus dem Bauchgefühl "das ist wichtig" eine **Schadenshöhe in Euro und Zeit**. Eine Kette ist außerdem nur so stark wie ihr schwächstes Glied – ein doppelter Server hinter einer einzelnen Stromzuleitung ist eben doch nicht ausfallsicher.

!!! tip "Verbindung"
    Die Daten für predictive maintenance kommen aus dem [Monitoring](monitoring.md) und werden unter [Betriebsdaten analysieren](betriebsdaten-analysieren.md) ausgewertet. Wo Redundanz nicht reicht, fängt [Backup & Recovery](backup-und-recovery.md) den Rest auf.
