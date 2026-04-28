---
title: "Abgabe & Reflexion"
description: "Was ihr am Ende präsentiert + Reflexionsfragen + Bewertungs-Punkte."
---

# Abgabe und Reflexion

Jede Gruppe präsentiert am Ende **kurz** ihre Lösung. Plant pro Gruppe **3–5 Minuten** ein.

---

## Was ihr zeigen sollt

### 1. Laufende Container

Zeigt, dass folgende Container laufen:

```bash
docker ps
```

Erwartet werden:

- `quest-db`
- `quest-api`
- `quest-adminer`

### 2. Netzwerk

Zeigt, dass die Container im gemeinsamen Netzwerk sind:

```bash
docker network inspect quest-net
```

### 3. Volume

Zeigt, dass ein Volume für PostgreSQL verwendet wird:

```bash
docker volume ls
docker volume inspect quest-pg-data
```

### 4. API

Zeigt, dass die API erreichbar ist. Mindestens:

- `GET /health`
- `GET /db-check` (mit `database: connected`)
- `GET /api/entries` (mit Inhalten)
- `GET /api/scoreboard`

### 5. Adminer

Zeigt im Browser:

- Adminer ist erreichbar (`http://localhost:8080`)
- Verbindung zur Datenbank funktioniert
- Tabelle `entries` ist sichtbar
- gespeicherte Daten sind sichtbar

---

## Reflexionsfragen

Beantwortet kurz – mündlich in der Gruppe oder schriftlich auf dem Doku-Zettel:

1. Was war euer **größtes Problem**?
2. Wie habt ihr den **Fehler gefunden**?
3. Welche **Docker-Befehle** waren am wichtigsten?
4. Warum braucht die API den Hostnamen `quest-db` (und nicht `localhost`)?
5. Warum reicht `localhost` hier nicht?
6. Warum braucht die Datenbank ein **Volume**?
7. Was war an der **manuellen Einrichtung umständlich**?
8. Was könnte **Docker Compose** daran vereinfachen?

---

## Bewertung / Punkte (optional)

Falls die Aufgabe bewertet wird, hier ein Vorschlag:

| Aufgabe | Punkte |
|---|---:|
| Netzwerk erstellt | 10 |
| PostgreSQL läuft | 10 |
| Volume korrekt eingebunden | 15 |
| API-Image gebaut | 15 |
| API läuft | 15 |
| API spricht mit Datenbank | 20 |
| Adminer verbunden | 10 |
| Daten angelegt und geprüft | 10 |
| Fehler sauber dokumentiert | 10 |
| Gute Erklärung in der Reflexion | 15 |
| **Summe** | **130** |

Bonus pro Bonusaufgabe: jeweils +5 Punkte.

---

## Was die Trainer:in beobachtet

(Nur als Info für die Teilnehmenden – damit klar ist, worauf geachtet wird.)

- Sind alle Bestandteile vorhanden? (Container, Netzwerk, Volume)
- Funktioniert die Kommunikation zwischen den Containern?
- Bleiben die Daten nach Container-Neustart erhalten?
- Wurde mindestens ein Fehler dokumentiert und nachvollziehbar gelöst?
- Können die Teilnehmenden in eigenen Worten erklären, **warum** Docker Compose im nächsten Schritt sinnvoll ist?

---

## Weiter

- [Trainer-Lösung](07-trainer-loesung.md) – **erst nach der Gruppenarbeit aufschlagen!**
- [Übergang zu Compose](08-uebergang-zu-compose.md)
