---
title: "Technologien kurz erklärt"
description: "Worum geht's bei Nginx, Reverse-Proxy, Express, FastAPI, PostgreSQL und Adminer? Nur das Nötigste für Mission Control."
---

# Die Technologien kurz erklärt

In dieser Aufgabe geht es um **Docker Compose**. Die Beispiel-App nutzt zwar Nginx, Node.js/Express, PostgreSQL und (optional) FastAPI – aber **nur als Beispielsystem**. Ihr müsst diese Technologien **nicht im Detail** lernen.

Diese Seite gibt euch den nötigen Kontext, mehr nicht.

---

## Was ist das Frontend?

Das **Frontend** ist die kleine Webseite, die ihr im Browser seht: das Mission-Control-Dashboard. Es ist eine **statische** Single-Page-App – nur HTML, CSS und JavaScript.

Wenn ihr auf einen Button klickt, schickt das Frontend per `fetch` eine Anfrage an einen Pfad wie `/api/modules`. Genau diese Anfrage wandert dann durch Nginx an das Backend.

**Compose-Fokus:**

- Frontend-Container starten
- Port nach außen veröffentlichen (`8080`)
- Frontend findet das Backend per Service-Name

**Nicht Fokus:** HTML/CSS/JS programmieren.

---

## Was ist Nginx? Und was macht `proxy_pass`?

**Nginx** ist ein leichter Webserver. In dieser Aufgabe übernimmt Nginx **zwei Aufgaben**:

1. Er liefert die statischen Dateien aus (`index.html`, `style.css`, `app.js`).
2. Er ist ein **Reverse-Proxy**: Anfragen, die mit `/api/` anfangen, leitet er an einen anderen Container weiter.

Der zentrale Block in `frontend/nginx.conf` ist:

```nginx
location /api/ {
    proxy_pass http://backend:3000/api/;
}
```

Das bedeutet: jede Anfrage `/api/...`, die im Frontend-Container ankommt, wird intern an `http://backend:3000/api/...` weitergegeben.

> Der Hostname `backend` ist **kein DNS-Eintrag im Internet** – das ist der **Service-Name** aus eurer `compose.yaml`. Compose legt für jeden Service einen DNS-Eintrag im internen Netzwerk an.

**Was du dadurch nicht brauchst:**

- kein **CORS** (Cross-Origin Requests) – aus Browsersicht läuft alles auf `localhost:8080`
- keine zwei Domains, keine zusätzlichen API-URLs im JavaScript

Das ist ein klassisches Setup, das ihr in echten Projekten ständig wiederfindet.

**Compose-Fokus:** ein Service spricht den anderen über den **Service-Namen** an.

**Nicht Fokus:** Nginx-Konfiguration verstehen oder schreiben.

---

## Was ist das Backend?

Das **Backend** ist die kleine API. Sie nimmt HTTP-Anfragen entgegen, redet mit der Datenbank und schickt JSON zurück.

Beispiele:

- "Bist du online?" → `/api/health` → `{ "status": "ok" }`
- "Welche Module gibt es?" → `/api/modules` → Liste
- "Lege ein neues Modul an" → `POST /api/modules` mit `{ "name": "...", "status": "..." }`
- "Setze Modul 3 auf `critical`" → `PATCH /api/modules/3` mit `{ "status": "critical" }`

Es gibt **zwei Implementierungen** in der Aufgabe:

- **Standard:** Node.js + Express (Ordner `backend-node/`)
- **Bonus:** Python + FastAPI (Ordner `backend-fastapi/`)

Beide haben **dieselben** Endpunkte. Aus Sicht des Frontends sind sie austauschbar.

**Compose-Fokus:** Image bauen, Service ins Netzwerk hängen, Umgebungsvariablen für die DB-Verbindung setzen.

**Nicht Fokus:** JavaScript oder Python programmieren.

---

## Was ist Node.js / Express?

**Node.js** ist eine Laufzeitumgebung für JavaScript-Code, der außerhalb des Browsers läuft. **Express** ist ein kleines Web-Framework, mit dem man HTTP-Endpunkte definiert.

Für euch ist nur wichtig:

> Das Docker-Image enthält Node.js. Der Backend-Container startet damit `server.js`.

---

## Was ist FastAPI? (Bonus)

**FastAPI** ist ein modernes Python-Framework für HTTP-APIs. Es ist Pythons Pendant zu Express in Node.js.

In der Bonus-Mission tauscht ihr das Node-Backend gegen das FastAPI-Backend. **Frontend und Datenbank bleiben unverändert** – ihr ändert nur den `build:`-Pfad in eurer `compose.yaml`.

> Genau das ist der Witz an Containern: Schnittstelle stabil, Innenleben austauschbar.

---

## Was ist PostgreSQL?

**PostgreSQL** ist die Datenbank. Sie speichert die Module der Aurora Station.

Beim ersten Start liest die Datenbank das Skript `db/init.sql` ein. Darin wird die Tabelle `modules` angelegt und mit sechs Beispiel-Modulen gefüllt:

- Life Support, Power Grid, Comms Array, Research Lab, Hydroponics, Docking Bay.

Damit ist eure Datenbank **nicht leer**, wenn ihr den Stack zum ersten Mal startet – ihr seht direkt etwas im Frontend.

**Compose-Fokus:** Datenbank-Container starten, Init-SQL über Bind-Mount einbinden, Volume für persistente Daten setzen, Umgebungsvariablen für User/Passwort/DB-Name.

**Nicht Fokus:** SQL schreiben, PostgreSQL administrieren.

---

## Was ist Adminer?

**Adminer** ist eine kleine Web-Oberfläche für Datenbanken. Damit könnt ihr im Browser nachschauen, was die API in PostgreSQL gespeichert hat.

**Login-Daten** in Adminer (kommen aus eurer `.env` bzw. den Default-Werten):

| Feld | Wert |
|---|---|
| System | PostgreSQL |
| Server | `db` |
| Benutzer | `aurora` |
| Passwort | `aurorapass` |
| Datenbank | `auroradb` |

> Wichtig: Im Feld **Server** steht der **Service-Name** aus eurer `compose.yaml` – nicht `localhost` und keine IP.

---

## Was ist eine `.env`-Datei?

Eine **`.env`** ist eine schlichte Textdatei mit `KEY=VALUE`-Zeilen. Compose liest sie automatisch ein, wenn sie im selben Ordner wie die `compose.yaml` liegt. In der `compose.yaml` schreibt ihr `${KEY}` und Compose ersetzt das beim Start mit dem Wert.

So bleiben Geheimnisse (Passwörter, Tokens) und umgebungsspezifische Werte aus der `compose.yaml` raus – die `.env` gehört in `.gitignore`, die `.env.example` (mit Default-Werten) wird mit eingecheckt.

In dieser Übung benutzt ihr `.env` für DB-User, Passwort, DB-Name und Ports.

---

## Was müsst ihr nicht können?

- ❌ HTML/CSS/JavaScript programmieren
- ❌ Express, FastAPI oder Nginx im Detail verstehen
- ❌ SQL schreiben
- ❌ PostgreSQL administrieren
- ❌ irgendetwas am Code der App ändern

**Konzentriert euch auf Compose.** Alles andere ist Beiwerk.

---

## Weiter

- [Compose-Recap](02-compose-recap.md) – die YAML-Bausteine, die ihr in der Übung braucht
- [Szenario](03-szenario.md) – die Geschichte hinter der Aufgabe
