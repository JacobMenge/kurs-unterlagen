---
title: "Stolpersteine"
description: "Die häufigsten Klemmer bei Mission Control mit dem jeweils schnellsten Ausweg: YAML-Einrückung, dunkle Module, Init-Skript, Ports und Healthcheck."
---

# Stolpersteine

Die häufigsten Klemmer, jeweils mit dem schnellsten Weg heraus. Erst
hier nachsehen, dann im Kurs-Chat fragen.

## YAML meckert schon beim Start

`yaml: line X: found character that cannot start any token` oder
`mapping values are not allowed`: fast immer Einrückung. Zwei Leerzeichen
je Ebene, niemals Tabs. `docker compose config` zeigt, ob die Datei
sauber ist, ohne etwas zu starten.

## Ein Modul bleibt dunkel: die drei Checks

1. **Läuft der Container?** `docker compose ps`. Steht er gar nicht in
   der Liste, fehlt der Service oder `up -d` kam nicht nach der
   Änderung.
2. **Was sagt er selbst?** `docker compose logs <servicename>`. Ein
   Modul schreibt dort, wohin es funkt und woran es scheitert.
   `ENOTFOUND` heißt: Diesen Hostnamen gibt es im Netz nicht.
3. **Taucht es unter „Weitere Signale" auf?** Dann läuft es, aber
   `MODUL_NAME` passt nicht exakt zum Stellplatz. `Hydrponik` leuchtet
   nirgends, die Stellplätze heißen: Lebenserhaltung, Energie,
   Kommunikation, Forschungslabor, Hydroponik, Andockschleuse.

## Backend-Lampe bleibt rot

Der Service muss exakt `backend` heißen, das Frontend leitet
`/api/`-Anfragen an genau diesen Namen weiter. Danach:
`docker compose logs backend`. Steht dort ein Datenbankfehler, stimmen
`PGHOST` (Servicename der Datenbank) oder die Zugangsdaten nicht.

## Init-Skript greift nicht (Tabelle logbuch fehlt)

`db/init.sql` läuft nur beim **allerersten Start eines frischen
Volumes**. Wer den Mount erst später ergänzt hat:

```bash
docker compose down -v
```

und wieder hoch. Achtung: `-v` löscht die Logbuch-Historie.

## Port schon belegt

`Bind for 0.0.0.0:8080 failed: port is already allocated`: Auf 8080
läuft noch etwas, meist der Adminer von Montag oder ein alter Versuch.
`docker ps` zeigt den Belegier, `docker rm -f <name>` räumt ihn weg.
Alternativ in der `.env` einfach `FRONTEND_PORT=8090` setzen.

## db wird nie healthy

`docker compose ps` zeigt `(unhealthy)`: fast immer ein Tippfehler im
Testbefehl (`pg_isready`, nicht `pg_ready`) oder die Variablen im Test
passen nicht zu den `POSTGRES_*`-Werten. `docker inspect` braucht ihr
nicht, `docker compose logs db` und ein Blick auf die Zeile reichen.

## .env wird ignoriert

Compose liest die `.env` nur aus dem Ordner, in dem ihr
`docker compose` aufruft, direkt neben der `compose.yaml`. Die Datei
heißt exakt `.env`, nicht `env.txt`. Kontrolle: `docker compose config`
muss die eingesetzten Werte zeigen.

## Alles verfahren, einmal sauber neu

```bash
docker compose down -v
```

```bash
docker compose up -d
```

Kostet die Historie, liefert aber in unter einer Minute einen frischen,
kompletten Stack. Die `compose.yaml` bleibt dabei unangetastet, genau
das ist ihr Wert.
