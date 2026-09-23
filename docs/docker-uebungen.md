---
title: "Docker-Übungen: der Lernpfad"
description: "Alle Docker-Übungen der Kursunterlagen in einer sinnvollen Reihenfolge: fünf Stufen von den ersten Containern bis zum kompletten Stack, mit Selbstcheck für den Einstieg."
hide:
  - navigation
---

# Docker-Übungen: der Lernpfad

Hier stehen **alle Docker-Übungen der Kursunterlagen in einer Reihenfolge**,
in der sie aufeinander aufbauen. Du musst nicht vorn anfangen: Der
Selbstcheck unten zeigt dir, auf welcher Stufe du einsteigst.

!!! abstract "So arbeitest du mit dem Lernpfad"
    1. **Selbstcheck machen** und die erste Stufe finden, bei der du
       unsicher bist. Dort fängst du an.
    2. **Innerhalb einer Stufe der Reihe nach** arbeiten. Jede Stufe
       beginnt mit kurzen, geführten Übungen und endet mit Aufgaben, bei
       denen du selbst entscheidest.
    3. **Eine Stufe ist geschafft,** wenn du ihre Selbstcheck-Fragen ohne
       Nachschauen beantworten kannst. Dann weiter zur nächsten.

    Die Zeitangaben sind grobe Richtwerte. Wer länger braucht, macht
    nichts falsch: Gründlich schlägt schnell.

Die Übungen sind so gekennzeichnet:

- **geführt:** jeder Befehl steht da, mit Ausgabe und Erklärung
- **selbstständig:** Auftrag und Ziel, Hinweise und Lösung zum Aufklappen
- **Challenge:** größere Aufgabe ohne Anleitung, Musterlösung als Notausgang

---

## Wo stehst du? Der Selbstcheck

Geh die Fragen von oben nach unten durch. **Bei der ersten Stufe, bei der
du eine Frage nicht sicher beantworten kannst, steigst du ein.**

??? question "Stufe 1: Container, Images und Ports"
    - Was ist der Unterschied zwischen `docker ps` und `docker ps -a`?
    - Warum ist ein Container, der nur `echo` ausführt, sofort wieder beendet?
    - Was bedeutet `-p 8080:80`, welche Zahl gehört zu deinem Rechner?
    - Was steht in einem Dockerfile mit `FROM` und `COPY` und wie baust du daraus ein Image?

    Alles sicher? Weiter mit Stufe 2.

??? question "Stufe 2: Daten, Konfiguration und Netze"
    - Warum ist eine Datei weg, wenn du einen Container löschst? Wie verhinderst du das?
    - Was ist der Unterschied zwischen einem Volume und einem Bind Mount?
    - Wozu dient `-e POSTGRES_PASSWORD=geheim`?
    - Warum findet ein Container einen anderen nur in einem eigenen Netzwerk über dessen Namen?

    Alles sicher? Weiter mit Stufe 3.

??? question "Stufe 3: Docker Compose"
    - Wie übersetzt du `docker run -d -p 8080:80 nginx:alpine` in eine `compose.yaml`?
    - Was ist der Unterschied zwischen `docker compose down` und `docker compose down -v`?
    - Warum braucht die Datenbank in einer compose.yaml keinen `ports:`-Eintrag?
    - Was passiert, wenn du bei laufendem Stack einen Dienst ergänzt und `up -d` tippst?

    Alles sicher? Weiter mit Stufe 4.

---

## Stufe 1: Container, Images und Ports

**Danach kannst du:** Container starten, beobachten und aufräumen,
Images unterscheiden, Dienste über Ports erreichbar machen und ein
einfaches eigenes Image bauen. Das ist der Stoff der Einheit [Docker: Einführung](docker/index.md).

1. **[Training: Container](docker-training/01-container.md)** · geführt · 40 Minuten  
   Lebenszyklus, Hauptprozess, `exec` und `logs`: die drei Übungen, auf denen alles andere aufbaut.
2. **[Training: Images](docker-training/02-images.md)** · geführt · 25 Minuten  
   Name, Tag und ID, dazu die Schreibschicht: warum viele Container aus einem Image sich nicht stören.
3. **[Training: Ports](docker-training/03-ports.md)** · geführt · 25 Minuten  
   Port-Mapping verstehen und den häufigsten Fehler („port is already allocated") selbst erzeugen.
4. **[Erste Schritte mit Docker](docker/erste-schritte.md)** · geführt · 30 Minuten  
   Dieselben Grundlagen noch einmal im Zusammenhang, mit nginx und Apache nebeneinander.
5. **[Übungen Docker-Einführung 1 bis 3](docker/uebungen.md#ubung-1-hello-world-und-erster-nginx)** · geführt bis selbstständig · 45 Minuten  
   Erster nginx, eigene HTML-Seite im Container, zwei Webserver gleichzeitig.
6. **[Training: Eigenes Image](docker-training/06-eigenes-image.md)** · geführt · 30 Minuten  
   Ein Dockerfile aus zwei Zeilen, zwei Versionen nebeneinander, Rollback per Tag.
7. **[Praxis: ein eigenes Image bauen](docker/praxis-eigenes-image.md)** · geführt · 40 Minuten  
   Der ausführliche Weg vom Projektordner zum Image, mit Build-Cache und Varianten.
8. **[Übungen Docker-Einführung 4 und 5](docker/uebungen.md#ubung-4-dein-erstes-eigenes-image-bauen)** · selbstständig · 40 Minuten  
   Ein eigenes Image mit vorgegebenem Rahmen, danach selbstständig: ein nginx liefert mehrere Seiten aus.
9. **[Challenge: der Visitenkarten-Container](docker/uebungen.md#challenge-dein-visitenkarten-container)** · Challenge · 45 Minuten  
   Alles aus Stufe 1 in einer eigenen kleinen Aufgabe.

---

## Stufe 2: Daten, Konfiguration und Netze

**Danach kannst du:** Daten dauerhaft speichern, Container von außen
konfigurieren und mehrere Container zusammenarbeiten lassen. Das ist der
Stoff der Einheit [Docker: Aufbau](docker-aufbau/index.md) und die Grundlage für jede Datenbank im Container.

1. **[Training: Daten](docker-training/04-daten.md)** · geführt · 40 Minuten  
   Wegwerf-Container, Volume und Bind Mount im direkten Vergleich.
2. **[Training: Konfiguration und Netze](docker-training/05-konfiguration-netze.md)** · geführt · 35 Minuten  
   Umgebungsvariablen und das eigene Netzwerk, in dem Namen statt IP-Adressen gelten.
3. **[Praxis: Postgres und Adminer](docker-aufbau/praxis-multi-container.md)** · geführt · 60 Minuten  
   Die drei Bausteine zusammen: Datenbank mit Volume, Variablen und Netz, am Ende der Persistenz-Test.
4. **[Übungen Docker-Aufbau 1 bis 3](docker-aufbau/uebungen.md#ubung-1-redis-mit-persistentem-volume)** · geführt bis selbstständig · 50 Minuten  
   Redis mit Volume, nginx per Variable, Postgres mit Netz und Adminer ohne Anleitung.
5. **[Übungen Docker-Aufbau 4 und 5](docker-aufbau/uebungen.md#ubung-4-app-liest-konfiguration-aus-env-datei)** · selbstständig · 45 Minuten  
   Konfiguration aus einer `.env`-Datei, drei Dienste in zwei getrennten Netzen.
6. **[Challenge: Notizbuch-Stack](docker-aufbau/uebungen.md#challenge-notizbuch-stack-mit-echter-persistenz)** · Challenge · 60 Minuten  
   Ein kleiner Stack mit echter Persistenz, ohne Compose.

---

## Stufe 3: Docker Compose

**Danach kannst du:** mehrere Dienste in einer `compose.yaml`
beschreiben, mit einem Befehl starten und wieder abbauen. Das ist der
Stoff der Einheit [Docker Compose](docker-compose/index.md).

1. **[Training: Compose](docker-training/07-compose.md)** · geführt · 30 Minuten  
   Vom `docker run`-Befehl zur Datei, Dienste finden sich über ihren Namen.
2. **[Übungen Docker Compose 1 und 2](docker-compose/uebungen.md#ubung-1-erste-composeyaml-mit-nginx)** · geführt · 30 Minuten  
   Die erste compose.yaml mit nginx, dann mehrere Dienste in einer Datei.
3. **[Praxis: eine Webapp mit Compose](docker-compose/praxis-webapp.md)** · geführt · 55 Minuten  
   Postgres und Adminer aus dem Docker-Aufbau als compose.yaml, mit Persistenz-Test.
4. **[Challenge: der zweite Stack](docker-compose/challenge-zweiter-stack.md)** · Challenge · 30 Minuten  
   Eine zweite, getrennte Umgebung neben der ersten, ohne Anleitung.
5. **[Übungen Docker Compose 3 und 4](docker-compose/uebungen.md#ubung-3-wordpress-mit-mariadb)** · selbstständig · 50 Minuten  
   WordPress mit Datenbank, Werte aus einer `.env`. WordPress lädt beim ersten Start zwei größere Images.
6. **[Übung Docker Compose 5](docker-compose/uebungen.md#ubung-5-stack-mit-healthcheck-und-depends_on-condition)** · selbstständig · 30 Minuten  
   Healthcheck und `depends_on` mit Bedingung: Das Backend wartet, bis die Datenbank bereit ist.

---

## Stufe 4: Anwenden im großen Stack

**Danach kannst du:** eine vollständige Anwendung aus mehreren Diensten
selbstständig aufbauen und bei Problemen die Ursache finden. Diese
Aufgaben verbinden alles aus den Stufen 1 bis 3 und sind bewusst größer.

1. **[Praxis-Event: Escape Room](docker-escape-room/index.md)** · selbstständig im Team · 90 Minuten  
   Ein Multi-Container-Setup ohne Compose, nur mit `docker build` und `docker run`, mit Hilfekarten. Setzt Stufe 2 voraus.
2. **[Praxis-Event: Mission Control](docker-compose-mission-control/index.md)** · selbstständig im Team · 90 Minuten  
   Zehn Container aus einer selbst geschriebenen compose.yaml, mit Funkhilfe in drei Stufen. Setzt Stufe 3 voraus.
3. **[Challenge: vollständiger Tech-Stack](docker-compose/uebungen.md#challenge-vollstandiger-tech-stack)** · Challenge · 60 Minuten  
   Ein kompletter Stack in Compose, ohne Anleitung.

---

## Stufe 5: Vertiefung für Fortgeschrittene

Freiwillig und über den Kursstoff hinaus. Sinnvoll erst, wenn Stufe 3
sicher sitzt.

1. **[Docker-Vertiefung](docker-vertiefung/index.md)** · selbstständig · je 15 bis 25 Minuten  
   Fünf einzelne Übungen: `docker exec` zur Fehlersuche, Volume-Backup, `HEALTHCHECK`, Restart-Policies, Image-Größen.
2. **[Übungen: Docker für Profis](docker-profi/uebungen.md)** · selbstständig · je 30 bis 60 Minuten  
   Dockerfiles optimieren, Multi-Stage-Builds, Container ohne root, Images auf Sicherheitslücken scannen.

---

!!! tip "Hängst du fest?"
    Jede Einheit hat eine eigene Seite **Stolpersteine** mit den häufigsten
    Fehlermeldungen und ihrer Lösung, etwa die der
    [Docker-Einführung](docker/stolpersteine.md) und des
    [Docker-Aufbaus](docker-aufbau/stolpersteine.md). Die Befehle zum
    Nachschlagen stehen gesammelt im
    [Spickzettel des Trainings](docker-training/index.md#spickzettel).
