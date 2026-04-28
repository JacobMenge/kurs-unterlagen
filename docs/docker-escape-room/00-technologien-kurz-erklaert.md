---
title: "Technologien kurz erklärt"
description: "Worum geht's bei Node.js, Express, PostgreSQL und Adminer? Nur das Nötigste für den Docker Escape Room."
---

# Die Technologien kurz erklärt

In dieser Aufgabe geht es um **Docker**. Die Beispiel-App nutzt zwar Node.js, Express, PostgreSQL und Adminer – aber **nur als Beispielsystem**. Ihr müsst diese Technologien **nicht im Detail** lernen.

Diese Seite gibt euch den nötigen Kontext, mehr nicht.

---

## Was ist die API?

Die **API** (Application Programming Interface) ist die kleine Anwendung in dieser Aufgabe. Sie nimmt HTTP-Anfragen entgegen und speichert einfache Einträge in einer Datenbank.

Beispiele für das, was die API macht:

- „Läufst du?" → API antwortet „ja"
- „Kannst du die Datenbank erreichen?" → API testet die Verbindung
- „Speichere diesen Team-Eintrag" → API schreibt in die Datenbank
- „Zeige alle Einträge" → API liefert die Liste

**Docker-Fokus:**

- Image bauen
- Container starten
- Port veröffentlichen
- Umgebungsvariablen setzen
- Netzwerkverbindung zur Datenbank herstellen

**Nicht Fokus:**

- JavaScript programmieren
- Express lernen
- Backend-Architektur verstehen

---

## Was ist Node.js?

**Node.js** ist die Laufzeitumgebung, mit der die Beispiel-API ausgeführt wird. Vergleichbar mit Python oder Java – nur eben für JavaScript-Code, der außerhalb des Browsers läuft.

Für euch ist nur wichtig:

> Das Docker-Image enthält Node.js. Der API-Container startet damit die Beispielanwendung.

Ihr müsst Node.js **nicht selbst installieren**, wenn ihr die Anwendung per Docker startet.

---

## Was ist Express?

**Express** ist ein kleines Web-Framework für Node.js. Es sorgt dafür, dass die API auf Anfragen wie `/health` oder `/db-check` antworten kann.

Für euch ist nur wichtig:

> Express ist Teil der Beispiel-App. Ihr müsst daran nichts ändern.

---

## Was ist PostgreSQL?

**PostgreSQL** (kurz: **Postgres**) ist die Datenbank. Sie speichert die Einträge, die die API anlegt.

**Docker-Fokus:**

- Datenbank-Container starten
- Datenbankname, Benutzer und Passwort per Umgebungsvariablen setzen
- Datenbank-Container ins richtige Netzwerk hängen
- Volume für dauerhafte Speicherung verwenden

**Nicht Fokus:**

- SQL schreiben
- Datenbankmodellierung
- PostgreSQL-Administration

Ihr werdet keinen einzigen `SELECT`, `INSERT` oder `CREATE TABLE` schreiben müssen – die API erledigt das alles selbst.

---

## Was ist Adminer?

**Adminer** ist eine kleine Web-Oberfläche für Datenbanken. Damit könnt ihr im Browser prüfen, ob eure Daten wirklich in PostgreSQL gespeichert wurden.

**Docker-Fokus:**

- Adminer-Container starten
- Port veröffentlichen
- Adminer ins gleiche Netzwerk wie PostgreSQL hängen

**Nicht Fokus:**

- Datenbank-Administration
- SQL-Abfragen schreiben

Adminer öffnet eine Login-Maske – mehr braucht ihr nicht.

---

## Was sind curl, Postman oder Browser?

Damit testet ihr die API. Ihr könnt das Tool nehmen, mit dem ihr euch wohlfühlt:

- **Browser** für einfache GET-Anfragen (z.B. `http://localhost:3000/health`)
- **curl** im Terminal (macOS, Linux, Windows ab Windows 10)
- **PowerShell** mit `Invoke-RestMethod`
- **Postman** als grafisches Tool
- **REST Client** als VS-Code-Extension

**Docker-Fokus:**

- Prüfen, ob der API-Container erreichbar ist
- Prüfen, ob die API mit der Datenbank sprechen kann

---

## Was müsst ihr nicht können?

- ❌ JavaScript programmieren
- ❌ Express verstehen
- ❌ SQL schreiben
- ❌ PostgreSQL administrieren
- ❌ eine eigene API entwickeln
- ❌ ein Frontend bauen
- ❌ irgendetwas am Code der App ändern

**Konzentriert euch auf Docker.** Alles andere ist Beiwerk.

---

## Weiter

- [Docker-Recap](02-docker-recap.md) – die Befehle, die ihr in der Übung braucht
- [Szenario](03-szenario.md) – die Geschichte hinter der Aufgabe
