---
title: "Backup & Recovery"
description: "Backup-Strategien nach der 3-2-1-Regel, Snapshots und komplette Images, eine darauf aufbauende Recovery-Strategie, der Wiederanlaufplan sowie Kosten, Downtime und Rechte- und Rollenkonzepte."
---

# Backup & Recovery

<span class='badge badge-pruefung'>Prüfungsrelevant</span> &nbsp; Daten sichern kann jeder – die eigentliche Kunst ist, sie im Ernstfall **vollständig und schnell zurückzubekommen**. Genau darum dreht sich diese Seite.

!!! note "Status: Platzhalter <span class='badge badge-wip'>in Arbeit</span>"
    Diese Seite ist ein Platzhalter. Der Inhalt folgt – hier siehst du schon, **was behandelt wird** und **worauf es ankommt**.

## Das wird hier behandelt

- **Backup-Strategien** und die **3-2-1-Regel**: drei Kopien, zwei Medien, eine außer Haus
- die Bandbreite der Verfahren: einzelne **Snapshots** bis hin zu kompletten **Images** ganzer Systeme
- eine **Recovery-Strategie**, die direkt auf der Backup-Strategie aufbaut – Sichern und Zurückholen gehören zusammen gedacht
- der **Wiederanlaufplan**: in welcher **Reihenfolge** Geräte und Dienste hochfahren, damit nichts ins Leere läuft
- **Kosten und Downtime** gegeneinander abwägen – wie viel Ausfall und Datenverlust sind tragbar?
- **Rechte- und Rollenkonzepte**: wer darf sichern, wer darf wiederherstellen

## Worauf es ankommt

Der wichtigste Satz dieser Seite: **Ein Backup, das man nie zurückgespielt hat, ist kein Backup.** Erst der erfolgreiche Test beweist, dass die Sicherung etwas taugt. Genauso wichtig ist die Reihenfolge beim Wiederanlauf – eine Datenbank, die vor ihrem Speicher startet, oder ein Dienst, der vor dem Netzwerk hochfährt, macht aus einer Wiederherstellung das nächste Problem.

!!! tip "Verbindung"
    Wenn Ausfälle gar nicht erst zu langen Wiederherstellungen führen sollen, hilft [Hochverfügbarkeit & Redundanz](hochverfuegbarkeit.md). Wie der Wiederanlauf in einen größeren Notfallplan passt, siehst du unter [Incident Response & Business Continuity](incident-und-bcm.md).
