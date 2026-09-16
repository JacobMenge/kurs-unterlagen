---
title: "Praxis: MQTT live"
description: "Selbst funken: per MQTT eine echte Lampe färben und den eigenen Namen auf der LED-Matrix des Dozenten anzeigen."
---

# Praxis: MQTT live

Heute bleibt MQTT nicht im Mitschnitt. Ihr verbindet euch mit einem echten Broker, seht die Nachrichten der anderen live und steuert am Ende echte Hardware: eine LED-Matrix, die im Kurs vor der Kamera steht.

!!! abstract "Ziel"
    Am Ende könnt ihr:

    - euch mit einem MQTT-Broker verbinden (im Browser, ohne Installation)
    - Topics abonnieren und fremde Nachrichten live mitlesen
    - selbst veröffentlichen: erst eine Lampe färben, dann euren Namen auf die Matrix bringen
    - erklären, warum der Broker Zugangsdaten verlangt und was ein Vermittler dazwischen prüft

!!! info "Zugangsdaten kommen im Kurs"
    Adresse, Benutzername und Passwort des Brokers bekommt ihr **im Chat**, sie stehen absichtlich nicht auf dieser Seite. Erste Sicherheitslektion des Abends: Ein offener Broker gehört nicht ins Internet.

## Womit du hier arbeitest

**Der Broker** ist die Poststelle aus dem letzten Abend, diesmal echt: Er läuft mit Verschlüsselung (TLS) und Zugangsdaten in der Cloud. **Der Browser-Client** ist ein MQTT-Werkzeug als Webseite, es gibt nichts zu installieren. **Die Matrix** ist eine LED-Anzeige beim Dozenten; zwischen euch und ihr sitzt ein kleiner **Vermittler**, der jede Nachricht prüft und die Namen der Reihe nach anzeigt. Für die Prüfung zählt das Muster Publish/Subscribe mit Topic und Broker, im Beruf ist genau dieser Aufbau der Standard vom Sensor bis zum Smart Home.

---

## Teil 1: Verbinden und mitlesen (10 Minuten)

1. Öffnet den HiveMQ-Webclient: <https://www.hivemq.com/demos/websocket-client/>
2. Tragt oben die Daten aus dem Chat ein: **Host**, **Port 8884** (WebSocket mit TLS), **Username**, **Password**. Dann **Connect**.
3. Unter **Subscriptions** klickt „Add New Topic Subscription" und abonniert:

```text
kurs/#
```

Die Raute ist ein Platzhalter für „alles darunter". Ab jetzt seht ihr jede Kursnachricht live hereinkommen. Lasst das Fenster offen und beobachtet kurz, was die anderen tun.

**Frage 1:** Woran erkennt ihr in der Liste, wer eine Nachricht geschickt hat, und woran, an welches Topic sie ging?

??? success "Lösung Teil 1"
    Jede eingehende Nachricht zeigt Topic und Payload. Einen Absender zeigt MQTT **nicht** an: Das Protokoll kennt nur Topics, keine Empfänger- oder Absenderlisten. Wer etwas über den Absender wissen will, muss es in die Nutzlast schreiben, genau das macht ihr gleich mit eurem Namen.

---

## Teil 2: Die Lampe (10 Minuten)

Die Matrix hat einen Lampen-Modus. Er hört auf das Topic `kurs/lampe` und erwartet eine Farbe als JSON.

Im Webclient unter **Publish**: Topic eintragen, Nachricht eintragen, **Publish** klicken:

```text
kurs/lampe
```

```json
{"farbe": "#FF8800"}
```

Schaut in die Kamera: Die Matrix leuchtet in eurer Farbe. Probiert eigene Farbwerte (Hex-Format `#RRGGBB`, wie aus CSS bekannt).

**Frage 2:** Es publishen gerade viele gleichzeitig. Warum flackert die Lampe trotzdem nicht wild durcheinander?

??? success "Lösung Teil 2"
    Zwischen euch und der Matrix sitzt der Vermittler: Er nimmt höchstens alle zwei Sekunden einen Farbwechsel an und verwirft den Rest. Eingaben prüfen und drosseln gehört zu jedem Gerät, das fremde Nachrichten entgegennimmt.

---

## Teil 3: Die Challenge, dein Name auf der Matrix (15 Minuten)

Jetzt seid ihr Entwickler mit einer Schnittstellen-Doku. Mehr als die Karte unten bekommt ihr nicht, den Publish baut ihr selbst.

!!! note "Schnittstellen-Doku der Matrix"
    | Feld | Pflicht | Regeln |
    |---|---|---|
    | Topic | ja | `kurs/matrix/anzeige` |
    | `name` | ja | 1 bis 20 Zeichen: Buchstaben, Zahlen, Leerzeichen, `. ! ? -` |
    | `farbe` | nein | `#RRGGBB`, sonst Standardfarbe |

    Nutzlast ist JSON. Die Namen laufen in Empfangsreihenfolge über die Matrix, jeder rund sieben Sekunden. Was gegen die Regeln verstößt, wird still verworfen.

**Geschafft, wenn:** euer Name in eurer Farbe über die Matrix in der Kamera läuft. Tragt euch danach im Ergebnis-Dokument ein.

??? success "Lösung Teil 3 (erst probieren!)"
    Topic `kurs/matrix/anzeige`, Nachricht:

    ```json
    {"name": "Anna", "farbe": "#00C8FF"}
    ```

---

## Bonus: für schnelle Funker

### Bonus 1: Der Blick hinter die Kulissen

Ihr abonniert `kurs/#` ja noch. Beobachtet das Topic `kurs/matrix/status`, während Namen einlaufen.

??? success "Antwort"
    Der Vermittler meldet dort, wen die Matrix gerade zeigt und wie viele Namen warten. Ein eigenes Status-Topic ist ein übliches Muster, damit Geräte beobachtbar sind.

### Bonus 2: Der Härtetest der Schnittstelle

Versucht gezielt, die Regeln zu brechen: 21 Zeichen, verbotene Zeichen, kaputtes JSON, eine Fantasie-Farbe.

??? success "Antwort"
    Nichts davon erreicht die Matrix. Zu langer oder unzulässiger Name: verworfen. Kaputtes JSON: verworfen. Falsche Farbe: Standardfarbe. Genau dafür sitzt der Vermittler dazwischen, ein Gerät darf fremden Eingaben nie blind vertrauen.

### Bonus 3: Topic-Design lesen

Warum heißt es wohl `kurs/matrix/anzeige` und nicht einfach `anzeige`?

??? success "Antwort"
    Topics sind hierarchisch wie Pfade: `kurs/…` bündelt alles aus diesem Kurs, `kurs/matrix/…` alles zur Matrix. Dadurch funktionieren Wildcards wie `kurs/#` oder `kurs/matrix/+`, und verschiedene Anwendungen kommen sich nicht in die Quere.

---

## Wenn es klemmt

- **Connect schlägt fehl:** Port prüfen (8884, WebSocket mit TLS), Benutzername und Passwort exakt aus dem Chat übernehmen, keine Leerzeichen anhängen.
- **Publish kommt nicht an:** Seid ihr wirklich verbunden (grüner Status)? Topic exakt geschrieben? JSON gültig (doppelte Anführungszeichen!)?
- **Kein Name auf der Matrix:** Erst Bonus 2 lesen, vermutlich verstößt der Name gegen eine Regel. Im Zweifel kürzer und nur Buchstaben.
