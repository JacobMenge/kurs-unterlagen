---
title: "Training: Ports"
description: "Übungen 6 und 7: wie Port-Mapping einen Container von außen erreichbar macht und warum ein Port auf dem Rechner nur einmal vergeben werden kann."
---

# Ports

Zwei Übungen zur Frage: Wie kommt eine Anfrage aus deinem Browser in
einen Container? Die Antwort ist das Port-Mapping mit `-p`.

---

## Übung 6: Ohne `-p` keine Tür nach draußen

!!! info "Was du lernst"
    - dass ein Container von außen zunächst nicht erreichbar ist
    - was `-p außen:innen` genau bedeutet
    - wie du in `docker ps` ablesen kannst, welche Tür offen ist

### Worum es geht

Ein Container hat sein **eigenes Netzwerk** mit eigener IP-Adresse. Der
Webserver darin lauscht auf Port 80, aber auf Port 80 **des Containers**,
nicht deines Rechners. Damit dein Browser ihn erreicht, braucht es eine
Weiterleitung: das Port-Mapping.

### Schritt für Schritt

Starte einen Webserver **ohne** `-p`:

```bash
docker run -d --name ohne-tuer nginx:alpine
```

```bash
docker ps
```

In der Spalte `PORTS` steht nur `80/tcp`. Rufe im Browser
`http://localhost:80` und `http://localhost:8080` auf: Beides klappt
nicht, der Browser meldet, dass die Seite nicht erreichbar ist.

Jetzt ein zweiter Webserver **mit** Port-Mapping:

```bash
docker run -d --name mit-tuer -p 8080:80 nginx:alpine
```

```bash
docker ps
```

Gekürzt auf die zwei Spalten, um die es geht:

```text
NAMES       PORTS
mit-tuer    0.0.0.0:8080->80/tcp
ohne-tuer   80/tcp
```

Unter `http://localhost:8080` erscheint jetzt „Welcome to nginx!".

### Was dahinter steckt

- `-p 8080:80` liest man **außen:innen**: Port 8080 auf deinem Rechner
  wird an Port 80 im Container weitergeleitet. Das Prinzip kennst du aus
  dem Netzwerk-Block: Es ist eine Portweiterleitung, wie sie ein Router
  mit NAT macht.
- `0.0.0.0:8080` heißt: Die Tür ist auf **allen** Netzwerkschnittstellen
  deines Rechners offen. Im Firmennetz könnten also auch Kollegen den
  Container erreichen. Mit `-p 127.0.0.1:8080:80` bleibt die Tür nur
  lokal offen.
- `80/tcp` ohne Pfeil ist nur eine Information aus dem Image: „Dieser
  Dienst lauscht innen auf 80". Geöffnet ist damit nichts.
- Ohne `-p` ist ein Container trotzdem nicht isoliert: Andere Container
  im selben Docker-Netz erreichen ihn weiterhin. Genau so läuft es
  später bei Datenbanken, die bewusst keine Tür nach außen bekommen
  (siehe [Übung 12](05-konfiguration-netze.md)).

??? question "Kontrollfrage: Warum funktioniert `-p 80:8080` bei nginx nicht, obwohl beide Zahlen vorkommen?"
    Weil die Reihenfolge vertauscht ist. `-p 80:8080` leitet Port 80
    deines Rechners an Port 8080 **im Container** weiter. Dort lauscht
    nginx aber nicht, er wartet auf Port 80. Die Anfrage läuft ins Leere.
    Merkhilfe: Die linke Zahl wählst du frei, die rechte gibt das Image
    vor.

### Aufräumen

```bash
docker rm -f ohne-tuer mit-tuer
```

---

## Übung 7: Zwei Webserver, ein Rechner

!!! info "Was du lernst"
    - mehrere gleiche Dienste auf einem Rechner betreiben
    - was passiert, wenn ein Port schon belegt ist
    - warum ein fehlgeschlagener Container trotzdem liegen bleibt

### Worum es geht

Innen dürfen beliebig viele Container auf Port 80 lauschen, jeder hat ja
sein eigenes Netzwerk. Außen, auf deinem Rechner, kann jeder Port aber
nur **einmal** vergeben werden.

### Schritt für Schritt

Zwei Webserver, innen beide auf 80, außen auf verschiedenen Ports:

```bash
docker run -d --name web-a -p 8081:80 nginx:alpine
```

```bash
docker run -d --name web-b -p 8082:80 nginx:alpine
```

Beide sind im Browser erreichbar: `http://localhost:8081` und
`http://localhost:8082`.

Jetzt ein dritter Webserver auf einem Port, der **schon belegt** ist:

```bash
docker run -d --name web-c -p 8081:80 nginx:alpine
```

```text
docker: Error response from daemon: ... Bind for 0.0.0.0:8081 failed: port is already allocated
```

Schau nach, was von `web-c` übrig ist:

```bash
docker ps -a
```

`web-c` steht mit dem Status `Created` in der Liste. Er wurde angelegt,
konnte aber nicht starten.

### Was dahinter steckt

- Der Port **innen** gehört dem Container, der Port **außen** deinem
  Rechner. Innen ist 80 so oft möglich, wie du Container hast, außen ist
  jeder Port einmalig. Dasselbe gilt ohne Docker: Zwei Programme können
  nicht gleichzeitig auf demselben Port lauschen.
- `docker run` erledigt zwei Dinge nacheinander: Container **anlegen**,
  dann **starten**. Das Anlegen hat geklappt, das Starten ist am Port
  gescheitert. Deshalb bleibt ein Container im Zustand `Created` zurück,
  der den Namen `web-c` blockiert.
- In der Praxis ist „port is already allocated" eine der häufigsten
  Meldungen überhaupt, meist durch einen vergessenen Container von
  vorher. `docker ps` in der Spalte `PORTS` zeigt dir den Übeltäter.

??? question "Kontrollfrage: Du willst `web-c` jetzt auf Port 8083 starten. Warum reicht es nicht, nur den Port im Befehl zu ändern?"
    Weil der fehlgeschlagene Container mit dem Namen `web-c` noch
    existiert. Der neue Befehl scheitert sonst mit
    `The container name "/web-c" is already in use`. Erst
    `docker rm web-c`, dann mit `-p 8083:80` neu starten.

### Aufräumen

```bash
docker rm -f web-a web-b web-c
```

---

## Selbst probieren

**Auftrag:** Starte zwei **verschiedene** Webserver gleichzeitig: nginx
und Apache (Image `httpd`). Beide sollen im Browser erreichbar sein.
Apache lauscht innen ebenfalls auf Port 80.

**Geschafft, wenn:** in einem Browser-Tab „Welcome to nginx!" und im
anderen „It works!" steht und `docker ps` beide Port-Zuordnungen zeigt.

??? tip "Hinweis"
    Zwei `docker run` mit `-d`, eigenen Namen und zwei **unterschiedlichen**
    Außen-Ports. Innen ist es bei beiden die 80.

??? success "Lösung"
    ```bash
    docker run -d --name nginx-web -p 8081:80 nginx:alpine
    ```

    ```bash
    docker run -d --name apache-web -p 8082:80 httpd
    ```

    Browser: `http://localhost:8081` und `http://localhost:8082`.

    Aufräumen: `docker rm -f nginx-web apache-web`
