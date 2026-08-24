---
title: "Abgabe & Reflexion"
description: "Was ihr am Ende präsentiert und welche Reflexionsfragen Mission Control runden."
---

# Abgabe und Reflexion

Jede Gruppe präsentiert am Ende **kurz** ihre Lösung. Plant pro Gruppe **3–5 Minuten** ein.

---

## Was ihr zeigen sollt

### 1. Laufende Services

```bash
docker compose ps
```

Erwartet werden vier Services, alle als `Up`. `db` zusätzlich als `(healthy)`:

```text
NAME                          IMAGE                    STATUS              PORTS
mission-...-frontend-1        mission-...-frontend     Up                  0.0.0.0:8080->80/tcp
mission-...-backend-1         mission-...-backend      Up                  3000/tcp
mission-...-db-1              postgres:16-alpine       Up (healthy)        5432/tcp
mission-...-adminer-1         adminer:latest           Up                  0.0.0.0:8081->8080/tcp
```

### 2. Volume

```bash
docker volume ls
```

`aurora-data` (mit Compose-Projekt-Präfix, z.B. `docker-compose-mission-control_aurora-data`) ist in der Liste sichtbar.

### 3. Frontend

Im Browser: <http://localhost:8080>

- Status-Indikator oben rechts ist grün und zeigt „Backend online · …"
- Sechs Beispiel-Module sind sichtbar
- Mindestens ein selbst angelegtes Modul ist drin
- Status-Änderung über das Dropdown funktioniert
- Löschen funktioniert

### 4. Adminer

Im Browser: <http://localhost:8081>

- Login mit `db` / `aurora` / `aurorapass` / `auroradb` klappt
- Tabelle `modules` ist sichtbar
- Eure Frontend-Aktionen tauchen auch hier auf

### 5. Persistenz-Test

Kurze Demo:

```bash
docker compose down
docker compose up -d
```

Im Frontend nach Neustart: Module sind weiterhin da → Volume hat seinen Job gemacht.

### 6. Bonus (falls geschafft)

Mindestens eine Bonus-Mission kurz vorzeigen – idealerweise **Bonus A** (Backend-Tausch auf FastAPI) oder **Bonus C** (Drei-Sätze-Erklärung).

---

## Reflexionsfragen

Beantwortet kurz – mündlich in der Gruppe oder schriftlich auf dem Doku-Zettel:

1. Welche Stelle in eurer `compose.yaml` war für euch der **größte Aha-Moment**?
2. Wo hat euch das **`docker compose config`** beim Debuggen geholfen?
3. Warum reicht `depends_on` allein **nicht**, um auf eine bereite DB zu warten?
4. Warum braucht das Backend `PGHOST=db` und nicht `localhost`?
5. Warum war **`down -v`** zwischendurch nötig (oder gefährlich)?
6. Was wäre passiert, wenn ihr das Init-SQL **nach** dem ersten DB-Start hinzugefügt hättet?
7. Welcher Compose-Vorteil ist euch **persönlich** am stärksten aufgefallen?

---

## Worauf wir am Ende gemeinsam schauen

Eine kleine Selbst-Checkliste, damit ihr für die Besprechung gut vorbereitet seid:

- [ ] Die `compose.yaml` ist **euer Werk** – nicht aus der Lösung kopiert?
- [ ] Externe Ports sind **nur** dort gesetzt, wo wirklich nötig (Frontend + Adminer)?
- [ ] Alle Services kommunizieren über **Service-Namen**, nicht über `localhost`?
- [ ] Konfigurationen liegen in der **`.env`**, nicht hartkodiert in der YAML?
- [ ] Healthcheck + `condition: service_healthy` sind aktiv?
- [ ] Persistenz mit `down`+`up` getestet?
- [ ] Ihr könnt in eigenen Worten erklären, **warum** Compose hier so deutlich besser ist als zehn `docker run`-Befehle?

Die Übung wird **nicht benotet**. Sie dient ausschließlich dazu, eure Compose-Praxis zu festigen, bevor es an Optimierungen, Multi-Stage-Builds und CI/CD geht.

---

## Weiter

- [Lösung](07-loesung.md) – **erst nach der eigenen Arbeit aufschlagen!**
- [Rückblick & Ausblick](08-rueckblick.md) – was kommt als nächstes
