---
title: "Trainer-Guide"
description: "Hinweise für die Kursleitung: Ablauf, Rollen, Hilfestellung-Strategie."
---

# Trainer-Guide

Diese Seite ist für die **Kursleitung** gedacht. Teilnehmende dürfen sie natürlich auch lesen – aber sie ist eher der Plan für „den Kapitän an der Brücke".

---

## Zielgruppe

Die Teilnehmenden kennen Docker-Grundlagen aus Block 1, 2 und 3 (Virtualisierung, Docker-Einführung, Docker-Aufbau). Sie haben **noch kein** Docker Compose gesehen – das kommt erst in der Folge­einheit.

---

## Dauer

| Phase | Dauer |
|---|---:|
| Einstieg & Erklärung | 15 Min |
| Docker-Recap (gemeinsam) | 20–30 Min |
| **Gruppenarbeit** | **90 Min** |
| Gemeinsame Besprechung | 30–45 Min |
| Übergang zu Compose | 10–15 Min |

Insgesamt **ca. 2:30 Stunden**.

---

## Lernziel

Die Teilnehmenden sollen ein Multi-Container-Setup **manuell** starten und dabei verstehen, **warum Docker Compose später sinnvoll ist**.

Sekundäre Lernziele:

- Container-Lifecycle in der Praxis durchspielen
- Logs als Debugging-Werkzeug nutzen
- Netzwerk und DNS zwischen Containern erleben
- Volume-Persistenz im Vergleich zu Container-Ephemeralität verstehen

---

## Wichtigster didaktischer Hinweis

Die Teilnehmenden sollen sich **auf Docker konzentrieren**. Die Beispiel-App ist **nur ein Testobjekt**.

Bei Fragen zu Node.js, Express oder PostgreSQL **konsequent zum Docker-Fokus zurückführen**:

- Läuft der Container?
- Ist der Container im richtigen Netzwerk?
- Stimmen die Umgebungs­variablen?
- Ist der Port veröffentlicht?
- Gibt es ein Volume?
- Was sagen die Logs?

Wenn du diese sechs Fragen drauf hast, kommst du mit **jeder** Gruppe weiter.

---

## Empfohlene Startansage (kannst du wörtlich übernehmen)

> „Heute wiederholen wir Docker praktisch. Ihr bekommt eine kleine Anwendung, die aus mehreren Diensten besteht: API, Datenbank, Admin-Oberfläche. Eure Aufgabe ist es, diese Dienste mit Docker manuell zum Laufen zu bringen.
>
> **Wichtig: Wir nutzen heute noch kein Docker Compose.**
>
> Der Sinn ist, dass ihr einmal spürt, wie viele einzelne Dinge man bei mehreren Containern beachten muss: Netzwerk, Ports, Volumes, Umgebungs­variablen, Container-Namen, Logs, Debugging. Genau daraus ergibt sich später der Bedarf für Docker Compose.
>
> Ihr habt 90 Minuten Zeit. Danach gehen wir die Lösung gemeinsam durch und besprechen typische Fehler."

---

## Vorbereitung durch die Kursleitung

**Vor dem Kurs prüfen:**

- [ ] Docker Desktop oder Docker Engine ist auf den Teilnehmer-Rechnern installiert (gemeinsamer Test in einem früheren Termin)
- [ ] `docker version` und `docker ps` funktionieren
- [ ] Images können aus Docker Hub geladen werden (bei Firmen-Proxy ggf. vorher klären)
- [ ] Das Repository ist erreichbar und der Ordner `apps/docker-escape-room/` existiert
- [ ] Die Teilnehmenden wissen, wie sie in Gruppenräume kommen
- [ ] Optional: Postman, REST Client oder ähnliches ist verfügbar

**Eigener Kopf-Check vorab:** Trainer-Lösung selbst einmal von Anfang bis Ende durchspielen, **ohne ins Repo zu schauen**. Erst dann merkt man, wo Teilnehmende stolpern werden.

---

## Gruppengröße

Empfohlen: **3–4 Personen pro Gruppe**.

Bei 2er-Gruppen werden Rollen kombiniert. Bei 5+ langweilen sich Einzelne.

---

## Rollen pro Gruppe

| Rolle | Aufgabe |
|---|---|
| **Driver** | Teilt den Bildschirm und führt die Befehle aus |
| **Navigator** | Achtet auf Aufgabenstellung und Reihenfolge |
| **Debugger** | Prüft Logs, Netzwerke, Ports und Fehlermeldungen |
| **Dokumentator** | Notiert Befehle, Probleme und Lösungswege |

Bei kleineren Gruppen können Rollen kombiniert werden – aber **immer einer als Dokumentator**, sonst gehen Erkenntnisse verloren.

---

## Während der Gruppenarbeit

**Nicht sofort die Lösung geben.** Stattdessen mit Rückfragen arbeiten:

- Was sagt `docker ps -a`?
- Was steht in den Logs?
- Ist der Container im richtigen Netzwerk?
- Nutzt die API wirklich den Datenbank-Container als Host?
- Ist `localhost` hier wirklich richtig? *(Trick-Frage – ist es nicht.)*
- Wurde der Container nach einer Änderung neu erstellt?
- Ist der Port auf dem Host oder im Container gemeint?
- Gibt es ein Volume?

Wenn eine Gruppe **deutlich** zurückbleibt: vorsichtig auf die [Hilfekarten](05-hilfekarten.md) verweisen.

---

## Typische Stolperfallen, die fast jede Gruppe trifft

1. **`localhost` statt `quest-db`** in der DB-Verbindung der API. Das ist die Lehrstunde des Tages.
2. **Container nicht im selben Netzwerk** – wenn `--network quest-net` vergessen wurde.
3. **Containername schon vergeben** nach Crash → `docker rm -f <name>` als Reset.
4. **Port belegt** auf Host (z.B. lokaler Postgres läuft schon auf 5432). Tipp: API über `8080:3000` mappen oder anderen Port wählen.
5. **API startet vor DB** und crasht → Die App hat eine Retry-Logik (siehe `waitForDatabase()` im Code), das verzeiht 20 Sekunden Verzögerung. Trotzdem Hinweis geben: „Schau in die Logs, was passiert."
6. **Daten verschwinden nach Restart** → Volume nicht gemountet oder anonymes Volume statt Named Volume.

---

## Nach der Gruppenarbeit – Besprechung

Empfohlene Reihenfolge:

1. Eine Gruppe pro Mal zeigt **kurz** ihre laufenden Container (`docker ps`)
2. Größtes Aha-Erlebnis kurz teilen
3. Größtes Problem + wie es gelöst wurde
4. Sammelrunde: „Welche Schritte mussten alle gleich tun?"
5. Übergang: Genau diese Wiederholbarkeit löst Compose

Plane **30–45 Minuten** dafür ein. Eilen ist hier kontraproduktiv – das ist der didaktische Höhepunkt.

---

## Ausblick auf die nächste Einheit

Übergang in die nächste Einheit (Docker Compose) machen mit:

> „Was ihr heute mit zehn `docker run`-Befehlen, drei Netzwerk-Befehlen und zwei Volume-Befehlen gemacht habt – das werden wir nächstes Mal in **einer einzigen YAML-Datei** beschreiben. Und ihr werdet sehen, warum es genau dafür Compose gibt."

Dann auf [Übergang zu Compose](08-uebergang-zu-compose.md) verweisen.
