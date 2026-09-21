---
title: "Compose-Recap"
description: "Die Compose-Bausteine vom Mittwoch zum Nachschlagen: services, ports, environment, volumes, depends_on und die wichtigsten Befehle."
---

# Compose-Recap

Alles hier kennt ihr vom Mittwoch. Zum Nachschlagen während der
Missionen.

## Die Datei

```yaml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_USER: aurora
    volumes:
      - postgres-daten:/var/lib/postgresql/data

  adminer:
    image: adminer:latest
    ports:
      - "8080:8080"

volumes:
  postgres-daten:
```

- **Einrückung ist Syntax:** zwei Leerzeichen je Ebene, niemals Tabs.
- Jeder Eintrag unter `services:` ist ein Container mit Namen. Über
  diesen Namen erreichen sich die Dienste im automatisch angelegten
  Projekt-Netz.
- `ports:` heißt immer `"außen:innen"`. Kein `ports:` bedeutet: nur im
  Netz erreichbar, keine Tür nach draußen.
- Benannte Volumes werden **zweimal** erwähnt: im Service und in der
  Liste `volumes:` ganz unten. Ein Eintrag mit `./pfad:` links ist ein
  Bind Mount, der braucht keinen Listeneintrag.

## Die Befehle

| Befehl | Wirkung |
|---|---|
| `docker compose up -d` | Alles anlegen und starten, was fehlt |
| `docker compose ps` | Zustand aller Services (auch `healthy`) |
| `docker compose logs <service>` | Logs eines Dienstes, `-f` folgt live |
| `docker compose config` | Datei prüfen, Variablen aufgelöst anzeigen |
| `docker compose stop <service>` / `start <service>` | Einen Dienst anhalten und weiterlaufen lassen |
| `docker compose down` | Stack stoppen und Container entfernen, Volumes bleiben |
| `docker compose down -v` | Wie down, löscht zusätzlich die Volumes |
| `docker compose up -d --build <service>` | Image eines Dienstes neu bauen und tauschen |

Die YAML-Fehlermeldung des Abends bleibt:
`yaml: line 2: found character that cannot start any token` heißt fast
immer Tab statt Leerzeichen.
