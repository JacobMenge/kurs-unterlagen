---
title: "Mission Control: Docker Praxis"
description: "Das Gruppen-Event zum Docker-Block: die Aurora Station mit zehn Containern aus einer selbst geschriebenen compose.yaml wieder online bringen."
---

# Mission Control: Docker Praxis

Das Gruppen-Event zum Abschluss des Docker-Blocks. Das alte Deployment der
Bodenkontrolle ist abgerissen, übrig sind der Code, die Dockerfiles und die
Anforderung: diesmal alles mit Docker Compose. Ihr schreibt die
`compose.yaml` selbst und bringt die Station Dienst für Dienst zurück.

!!! abstract "Ziel"
    Am Ende laufen bei euch aus einer Datei:

    - das **Frontend** der Bodenkontrolle (Stationsansicht und Logbuch im Browser)
    - das **Backend** (nimmt die Meldungen der Module an, schreibt das Logbuch)
    - die **Datenbank** mit Volume: das Logbuch übersteht jeden Neustart
    - **Adminer** für den Blick in die Tabelle
    - **sechs Stationsmodule**, jedes ein eigener Container aus demselben Image

## Anders als bisher: keine Schritt-für-Schritt-Anleitung

Ihr habt in den letzten vier Abenden jeden Baustein selbst benutzt. Deshalb
bekommt ihr heute **Missionen mit Ziel und Erfolgskriterium** statt einer
Befehlsliste. Jede Mission sagt euch, **woran ihr erkennt, dass sie
geschafft ist**. Den Weg dorthin baut ihr selbst.

Wenn es klemmt, gibt es je Mission die **Funkhilfe in drei Stufen** zum
Aufklappen:

1. **Richtung:** ein Satz, der auf das passende Konzept zeigt
2. **Werkzeug:** die konkreten Schlüssel oder Flags, noch ohne fertigen Code
3. **Notfallplan:** der fertige Block zum Kopieren

## Spielregeln

- Gleiche Gruppen wie bisher. Eine Person teilt den Bildschirm und tippt,
  die anderen navigieren. Windows wie immer in der PowerShell.
- Erst im Team reden, dann Funkhilfe: Stufe 1, dann 2, dann 3.
- **Fünf Minuten ohne Fortschritt? Nächste Stufe aufklappen.** Dafür ist
  sie da, das ist kein Schummeln.
- Die [Musterlösung](07-loesung.md) ist der Notausgang und die Nachlese,
  nicht der Startpunkt.
- Pflicht sind die Missionen 1 bis 7 mit **drei leuchtenden Modulen**. Die
  volle Station und alles danach ist [Vertiefung](04-aufgabenuebersicht.md#vertiefung)
  und **freiwillig**: für Gruppen, die vor der Demo-Runde noch Zeit haben.
- Wenn gar nichts mehr geht: [Stolpersteine](05-hilfekarten.md), dann Hilfe
  im Kurs-Chat.

## Der Fahrplan

| Schritt | Seite |
|---|---|
| Das Szenario in zwei Minuten | [Szenario](03-szenario.md) |
| Was heute neu ist (build, .env, Healthcheck, Heartbeat) | [Technik kurz erklärt](00-technologien-kurz-erklaert.md) |
| Die Compose-Bausteine von Mittwoch zum Nachschlagen | [Compose-Recap](02-compose-recap.md) |
| **Die Missionen** (der Kern der Übung) | [Missionen](04-aufgabenuebersicht.md) |
| Wenn es klemmt | [Stolpersteine](05-hilfekarten.md) |
| Demo-Runde am Ende | [Demo-Runde](06-abgabe-und-reflexion.md) |

## Code holen

Der Code liegt fertig auf **GitHub**, dort wohnt unser Kurs-Repository:
ein Projektarchiv im Netz, aus dem sich jeder den aktuellen Stand holen
kann. Mehr müsst ihr über GitHub heute nicht wissen, das Werkzeug
dahinter (Git) bekommt später einen eigenen Abend. Heute reicht der
Download:

1. Im Browser öffnen:
   [github.com/JacobMenge/kurs-unterlagen](https://github.com/JacobMenge/kurs-unterlagen)
2. Auf den grünen Knopf **Code** klicken, dann **Download ZIP**.
3. Die ZIP-Datei entpacken (Windows: Rechtsklick, **Alle extrahieren**),
   zum Beispiel in euren Dokumente-Ordner. Der entpackte Ordner heißt
   `kurs-unterlagen-main`.
4. Im Explorer bis in den Unterordner
   `kurs-unterlagen-main` → `apps` → `docker-compose-mission-control`
   klicken. Dort liegen `README.md`, `frontend/`, `backend-node/`,
   `modul/` und `db/`: Das ist euer Arbeitsordner für heute.
5. Ein Terminal **in diesem Ordner** öffnen:

    === "Windows"
        Rechtsklick auf eine freie Stelle im Ordner, dann
        **Im Terminal öffnen**. Fehlt der Eintrag: Windows-Terminal
        starten und `cd ` tippen (mit Leerzeichen), dann den Pfad oben
        aus der Explorer-Adressleiste kopieren, einfügen, Enter.

    === "macOS"
        Rechtsklick auf den Ordner im Finder, dann
        **Neues Terminal beim Ordner**. Alternativ Terminal öffnen,
        `cd ` tippen und den Ordner in das Fenster ziehen, Enter.

    === "Linux"
        Im Dateimanager **Im Terminal öffnen** wählen oder im Terminal
        mit `cd` in den Ordner wechseln.

Kontrolle: `docker compose version` antwortet und die Eingabezeile zeigt
den Ordnernamen `docker-compose-mission-control`.

??? note "Wer Git schon nutzt"
    Dann geht wie gewohnt `git clone https://github.com/JacobMenge/kurs-unterlagen.git`
    und der Ordner heißt `kurs-unterlagen` statt `kurs-unterlagen-main`.
    Für alle anderen ist der ZIP-Weg heute völlig gleichwertig.
