---
title: "Technik kurz erklärt"
description: "Was im Mission-Control-Stack steckt und was davon heute neu ist: build, .env, Healthcheck und der Heartbeat der Stationsmodule."
---

# Technik kurz erklärt

Ihr müsst keinen Code lesen und nichts davon beherrschen. Diese Seite
holt euch nur ab, damit kein Name unbekannt bleibt.

## Was heute neu ist

**build statt image.** Bisher kamen Container aus fertigen Images
(`image: postgres:16-alpine`). Heute liegen eigene Dockerfiles bei:
`build: ./frontend` sagt Compose, das Image vor dem Start selbst aus
diesem Ordner zu bauen.

**Die .env-Datei.** Eine Textdatei neben der `compose.yaml` mit Zeilen
wie `POSTGRES_USER=aurora`. Compose liest sie automatisch und setzt in
der `compose.yaml` jeden Platzhalter `${POSTGRES_USER}` durch den Wert
ein. So stehen alle Werte an einer Stelle und kein Passwort in der
Compose-Datei.

**Healthcheck.** Ein kleiner Test, den Docker regelmäßig im Container
ausführt. Für Postgres: `pg_isready`. Erst wenn der Test besteht, gilt
der Container als **healthy**. Zusammen mit
`depends_on: condition: service_healthy` startet das Backend erst, wenn
die Datenbank wirklich bereit ist, nicht nur gestartet.

**Heartbeat.** Ein regelmäßiges Lebenszeichen: Jedes Stationsmodul
meldet sich alle drei Sekunden per HTTP beim Backend. Acht Sekunden
Funkstille und es gilt als offline. Das ist die einfachste Form von
Verfügbarkeitsüberwachung und im Betrieb Alltag (Monitoring, Watchdogs).

## Die Dienste im Stack

!!! info "Frontend: Nginx"
    Ein Webserver, der die Stationsansicht ausliefert und alle
    `/api/`-Anfragen intern an den Service `backend` weiterleitet.
    Deshalb ist der Servicename `backend` Pflicht.

!!! info "Backend: Node.js mit Express"
    Eine kleine JavaScript-Laufzeit mit Web-Framework. Nimmt die
    Heartbeats an, führt den Stationszustand und schreibt jeden Wechsel
    in die Datenbank. Für die Vertiefung liegt dieselbe Schnittstelle
    noch einmal als **FastAPI** (Python) bei.

!!! info "Datenbank: PostgreSQL"
    Die relationale Datenbank von Montag. Hier lebt die Tabelle
    `logbuch`. Das Init-Skript `db/init.sql` legt sie beim allerersten
    Start eines frischen Volumes an.

!!! info "Adminer"
    Die Datenbank-Weboberfläche von Montag. Ein Container, ein Port,
    Blick in die Tabellen.

!!! info "Stationsmodul"
    Ein Mini-Dienst aus 40 Zeilen JavaScript: meldet sich beim Backend
    und sonst nichts. Alle sechs Module nutzen **dasselbe Image**, nur
    `MODUL_NAME` unterscheidet sie. Für Prüfung und Beruf zählt das
    Muster: ein Image, viele Umgebungen.
