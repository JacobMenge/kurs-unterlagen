---
title: "Abgabe & Reflexion"
description: "Was ihr am Ende präsentiert und welche Reflexionsfragen den Übungsabschluss runden."
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

## Worauf wir am Ende gemeinsam schauen

Eine kleine Selbst-Checkliste, damit ihr für die Besprechung gut vorbereitet seid:

- [ ] Sind alle Bestandteile vorhanden? (Container, Netzwerk, Volume)
- [ ] Funktioniert die Kommunikation zwischen den Containern?
- [ ] Bleiben die Daten nach einem Container-Neustart erhalten?
- [ ] Habt ihr mindestens **einen Fehler** dokumentiert und nachvollziehbar gelöst?
- [ ] Könnt ihr in eigenen Worten erklären, **warum** Docker Compose im nächsten Schritt sinnvoll ist?

Die Übung wird **nicht benotet**. Sie dient ausschließlich dazu, die Docker-Bausteine in eurem Kopf zu festigen, bevor wir uns Compose ansehen.

---

## Weiter

- [Lösung](07-loesung.md) – **erst nach der eigenen Arbeit aufschlagen!**
- [Übergang zu Compose](08-uebergang-zu-compose.md)
