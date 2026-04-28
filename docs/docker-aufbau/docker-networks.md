---
title: "Docker-Netzwerke"
description: "Wie Container miteinander sprechen: Bridge-, Host-, None-Netzwerke, DNS im Docker-Netz, eigene Netzwerke anlegen."
---

# Docker-Netzwerke

!!! abstract "Lernziel"
    Nach dieser Seite kannst du:

    - erklären, **warum Container nicht automatisch miteinander sprechen** können – und wie man das ändert
    - die drei Standard-Netzwerk­treiber **bridge, host, none** einordnen
    - ein **eigenes Netzwerk** anlegen und Container daran hängen
    - verstehen, was **Docker-DNS** ist: Container per Name erreichen
    - die üblichen Netzwerk-Stolpersteine (`localhost` im Container, Publisher-Probleme) durchschauen

---

## Warum das wichtig ist

Sobald deine Anwendung aus **mehr als einem Container** besteht, stellt sich die Frage: Wie sprechen sie miteinander?

Beispiel: Eine Web-App-Container muss mit dem Datenbank-Container reden. Wenn beide auf demselben Host laufen, denkt man intuitiv: „Na klar, über `localhost`." Falsch. **`localhost` im Container ist der Container selbst** – nicht der Host, nicht andere Container.

Die richtige Antwort sind **Docker-Netzwerke**. Sie sind einfacher, als sie zunächst klingen.

---

## Das Standard-Verhalten

Wenn du einen Container startest, **ohne** etwas zum Netzwerk zu sagen, landet er automatisch im **Default-Bridge-Netzwerk**. Dieses Netzwerk hat einige Eigenschaften, die man kennen muss:

- Alle Container darin können **IP-mäßig miteinander** sprechen (wenn sie die IP des Gegenübers kennen).
- Aber: **Keine automatische Namens­auflösung**. `ping db` im Container funktioniert **nicht**, obwohl ein Container `db` heißt.
- Ports nach außen müssen mit `-p` explizit gemappt werden (das kennst du schon).

Das Default-Bridge ist für den Einstieg okay, aber für ernsthafte Setups **legt man immer eigene Netzwerke an**. Gleich mehr dazu.

---

## Die drei Netzwerk­treiber auf einen Blick

```mermaid
flowchart TB
  subgraph BR["bridge — Default, eigene IPs je Container"]
    direction LR
    BRH["Host"]
    BRC1["Container 1"]
    BRC2["Container 2"]
    BRH -- "NAT" --> BRC1
    BRH -- "NAT" --> BRC2
  end

  subgraph HO["host — Container teilt Host-Netzwerk"]
    direction LR
    HOH["Host"]
    HOC["Container"]
    HOH --- HOC
  end

  subgraph NO["none — kein Netzzugang"]
    direction LR
    NOH["Host"]
    NOC["Container (isoliert)"]
  end
```

### bridge – der Normalfall

- Container bekommt eine **private IP** in einem Docker-verwalteten Subnetz (typisch `172.17.0.0/16`).
- Kommunikation nach außen läuft über NAT auf dem Host.
- Ports werden mit `-p` explizit freigegeben.
- **Standard für alle `docker run`**, wenn du nichts anderes sagst.

### host – „direkt ins Host-Netzwerk"

- Container **teilt sich das Netzwerk** mit dem Host.
- Kein NAT, keine Port-Mappings nötig.
- Port-Konflikte zwischen Container und Host möglich.
- Funktioniert **nur auf Linux**. Auf Mac/Windows wird es zu einer kleineren Variante (weil Docker Desktop in einer VM läuft).

**Einsatz:** wenn maximale Netzwerk-Performance wichtig ist oder spezielle Protokolle (Multicast) verwendet werden.

### none – „kein Netzwerk"

- Container hat **keine Netzwerk­verbindung**.
- Nur das Loopback-Interface im Container selbst.
- **Einsatz:** Isolation für Batch-Jobs, die keinen Netzzugang brauchen.

---

## Default-Bridge vs. User-Defined Bridges

Hier ist ein feiner, aber **wichtiger** Unterschied:

| Eigenschaft | Default-Bridge (Docker-Standard) | Eigenes Bridge-Netzwerk (User-Defined) |
|-------------|----------------------------------|-----------------------------------------|
| Container sprechen sich über IP an | ja | ja |
| Container sprechen sich über **Namen** an | **nein** | **ja** (Docker-DNS aktiv) |
| Isolation zu anderen Netzwerken | schwach | stark |
| Dynamisch Container hinzufügen/entfernen | ja | ja (und einfacher) |

**Fazit:** sobald du zwei oder mehr Container zusammenspielen lassen willst, **legst du ein eigenes Netzwerk an**. Dann funktioniert DNS, und das macht alles viel einfacher.

---

## Eigenes Netzwerk anlegen und nutzen

### Netzwerk erzeugen

```bash
docker network create kurs-netz
```

### Container daran hängen

```bash
docker run -d --name db \
  --network kurs-netz \
  -e POSTGRES_PASSWORD=geheim \
  postgres:16

docker run -d --name app \
  --network kurs-netz \
  -e DATABASE_URL=postgres://postgres:geheim@db:5432/postgres \
  -p 8080:8000 \
  meine-app
```

Beachte in der `DATABASE_URL` den Host **`db`** – das ist der **Name des anderen Containers**. Docker-DNS übersetzt diesen Namen zur IP des `db`-Containers im Netzwerk `kurs-netz`.

### Kommunikation testen

Vom App-Container aus:

```bash
docker exec app ping -c 3 db
docker exec app nslookup db
```

Du siehst: `db` wird zu einer IP aufgelöst. Jetzt können die Container ohne feste IP-Adressen miteinander sprechen – Docker kümmert sich um den Rest.

### Netzwerk-Inhalt anschauen

```bash
docker network inspect kurs-netz
```

Zeigt alle Container im Netzwerk, ihre IPs, Subnet, Gateway. Praktisch zum Debuggen.

### Netzwerk löschen

```bash
docker network rm kurs-netz
```

Klappt nur, wenn kein Container mehr dran hängt.

---

## DNS im Docker-Netz

In einem **User-Defined Bridge-Netz** gibt es einen integrierten DNS-Server. Container können sich über diese Namen ansprechen:

- **Name des Containers**: `db`, `app`, `cache`
- **Netzwerk-Alias** (falls gesetzt mit `--network-alias`): beliebige zusätzliche Namen
- **Service-Name** (bei Docker Compose): der Name unter `services:` in der `compose.yaml`

Was *nicht* geht:

- `ping db.kurs-netz` mit Domain-Suffix – Docker-DNS ist „flach".
- Cross-Netz-Namen: Container in Netz A kann Container in Netz B nicht per Name erreichen.

### Besonders schön: mehrere Netze pro Container

Ein Container kann gleichzeitig in mehreren Netzen hängen:

```bash
docker network create frontend-netz
docker network create backend-netz

docker run -d --name api \
  --network backend-netz \
  meine-api

docker network connect frontend-netz api

docker run -d --name web \
  --network frontend-netz \
  -p 80:80 \
  mein-webserver
```

- `api` ist in beiden Netzen.
- `web` ist nur im `frontend-netz` und kann `api` erreichen.
- `db` (falls es eine gibt) im `backend-netz` kann ebenfalls `api` erreichen.
- `web` kann `db` **nicht** direkt erreichen.

Das ist ein einfaches, aber effektives **Segmentierungs­muster** für Mehr-Schicht-Architekturen.

---

## Ports – was heißt „Publisher" eigentlich?

Rekap aus dem Einführungs­block:

```bash
docker run -d -p 8080:80 nginx
```

- Links: **Host-Port** 8080
- Rechts: **Container-Port** 80

Der Container hört intern auf Port 80. Docker macht diesen Port **für den Host** auf Port 8080 erreichbar. Das ist **Port Publishing**.

**Wichtig für das Netzwerk-Verständnis:** Wenn zwei Container im selben User-Defined Netzwerk sind, brauchst du **zwischen ihnen keinen `-p`-Port**. Sie können sich über Container-Namen auf *allen* Ports erreichen.

Beispiel: Eine App spricht mit PostgreSQL auf Port 5432. Wenn beide im `kurs-netz` hängen, brauchst du **keinen `-p 5432:5432`** beim Datenbank-Container – die App erreicht die DB über `db:5432` im internen Netz.

**`-p` brauchst du nur**, wenn der Port **vom Host aus** (oder von außen) erreichbar sein soll.

---

## Praktisches Beispiel: App + Datenbank

Nehmen wir ein typisches Setup:

```bash
# Eigenes Netzwerk
docker network create kurs-netz

# Datenbank – braucht keinen Host-Port, nur die App muss sie erreichen
docker run -d --name db \
  --network kurs-netz \
  -v db-daten:/var/lib/postgresql/data \
  -e POSTGRES_USER=kurs \
  -e POSTGRES_PASSWORD=geheim \
  -e POSTGRES_DB=kursdaten \
  postgres:16

# App – bekommt einen Host-Port, damit wir sie im Browser öffnen können
docker run -d --name app \
  --network kurs-netz \
  -e DATABASE_URL=postgres://kurs:geheim@db:5432/kursdaten \
  -p 8080:8000 \
  meine-app
```

Was passiert:

1. Ein Netzwerk `kurs-netz` wird angelegt.
2. Die Datenbank startet, hängt am Netz. **Kein `-p`** – die DB ist **nur von innen** erreichbar.
3. Die App startet, hängt ebenfalls am Netz. Sie bekommt via ENV-Variable die URL zur DB: `postgres://kurs:geheim@db:5432/kursdaten` – Host ist einfach `db`.
4. Die App hat `-p 8080:8000`, damit wir sie auf dem Host im Browser aufrufen können.

Das ist die Basis dessen, was [Docker Compose](../docker-compose/einfuehrung.md) später automatisiert.

---

## Stolpersteine

??? danger "Container findet den anderen Container nicht"
    **Symptom:** App startet, aber kann nicht zur DB connecten (`host not found`, `connection refused`).

    **Ursachen und Lösungen:**

    1. **Container nicht im selben Netzwerk.** Check mit:

        === "macOS / Linux"
            ```bash
            docker inspect app | grep -A 5 Networks
            docker inspect db  | grep -A 5 Networks
            ```

        === "Windows PowerShell"
            ```powershell
            docker inspect app | Select-String -Pattern "Networks" -Context 0,5
            docker inspect db  | Select-String -Pattern "Networks" -Context 0,5
            ```

        === "Plattform-unabhängig (Docker-Format)"
            ```bash
            docker inspect -f "{{json .NetworkSettings.Networks}}" app
            docker inspect -f "{{json .NetworkSettings.Networks}}" db
            ```

        Müssen im selben Netz sein.
    2. **Default-Bridge** statt User-Defined. Default-Bridge hat kein DNS – also lieber ein eigenes Netzwerk anlegen.
    3. **Container-Name falsch geschrieben.** `DATABASE_URL=postgres://...@DB:5432/...` mit Großbuchstaben? DNS ist case-insensitiv, aber manche Applikationen behandeln Hostnamen komisch. Kleinbuchstaben nutzen.

??? warning "`localhost` vom App-Container aus den Host zu erreichen"
    **Symptom:** Deine App-Container soll einen Dienst auf deinem Host ansprechen (z.B. eine Datenbank, die du nicht in Docker laufen hast). `localhost` funktioniert nicht.

    **Ursache:** `localhost` im Container ist der Container selbst. Der Host ist nicht automatisch erreichbar.

    **Lösung:**

    === "macOS / Windows (Docker Desktop)"
        Nutze `host.docker.internal` als Hostname. Docker Desktop legt einen DNS-Eintrag an, der auf den Host zeigt:
        ```bash
        docker run -e DATABASE_URL=postgres://user:pass@host.docker.internal:5432/db meine-app
        ```

    === "Linux"
        `host.docker.internal` gibt es inzwischen auch, aber du musst es explizit freischalten:
        ```bash
        docker run --add-host=host.docker.internal:host-gateway meine-app
        ```

??? warning "Zwei Container mit denselben Namen"
    **Symptom:** `docker run --name db ...` scheitert mit „container name already in use".

    **Ursache:** Ein gestoppter Container mit dem gleichen Namen existiert noch.

    **Lösung:**
    ```bash
    docker rm db      # alten Container löschen
    # dann neu starten
    ```

    Oder direkt mit `--rm`, damit der Container nach dem Stop von selbst verschwindet:
    ```bash
    docker run --rm --name db ...
    ```

??? warning "IP-Adressen der Container ändern sich nach Neustart"
    **Beobachtung:** IP wechselt zwischen Docker-Neustarts.

    **Ursache:** Das ist Absicht. IPs sind im Bridge-Netz nicht stabil – deshalb gibt es **Docker-DNS** mit Namen.

    **Lösung:** Deine Anwendung **niemals** auf feste IP-Adressen bauen. Immer über den Container-Namen.

??? info "Kann ich Container in anderen Subnetz­bereich legen?"
    Ja. Beim Anlegen des Netzwerks:
    ```bash
    docker network create --subnet 10.20.0.0/16 kurs-netz
    ```

    Sinnvoll, wenn dein Host-Netz schon `172.17.0.0/16` belegt (das Docker-Default-Subnetz) und Konflikte drohen.

??? info "Wie sehe ich alle Netzwerke?"
    ```bash
    docker network ls
    ```

    Standard sind immer drei: `bridge`, `host`, `none`. Eigene kommen dazu.

??? info "Braucht es eine Firewall zwischen Docker-Netzen?"
    **Kurz:** Zwischen zwei User-Defined Bridges ist die Isolation schon da. Ein Container in `netz-a` kommt nicht automatisch an `netz-b` ran.

    Für **feinkörnigere Regeln** („Container X darf NUR Port 5432 von Container Y erreichen") brauchst du entweder eine externe Firewall, eine Service-Mesh-Lösung oder ein Orchestrierungs-Tool mit Network-Policies (Kubernetes).

    Für den Alltag reichen die Standard-Netzwerke von Docker meistens völlig aus.

---

## Zusammenspiel aller drei Säulen

Jetzt hast du alle drei Grundbausteine des Aufbau-Blocks:

```mermaid
flowchart LR
  ENV["Umgebungs­variablen<br/>(-e, .env)"]
  VOL[("Volume<br/>/data")]
  NET{{"Docker-Netzwerk<br/>(kurs-netz)"}}
  C(["Container<br/>App-Prozess"])

  ENV -. "konfiguriert" .-> C
  VOL <== "Persistenz" ==> C
  C <== "Kommunikation" ==> NET
```

- **Umgebungs­variablen** konfigurieren den Container.
- **Volumes** geben ihm persistenten Speicher.
- **Netzwerke** verbinden ihn mit anderen Containern.

In der nächsten Praxis-Einheit setzen wir alle drei zusammen ein.

---

## Merksatz

!!! success "Merksatz"
    > **Container im selben User-Defined Netzwerk finden sich über ihren Namen – das ist Docker-DNS. `-p` brauchst du nur, wenn der Port vom Host aus erreichbar sein soll, nicht für Container-zu-Container.**

---

## Weiterlesen

- [Praxis: Postgres & Adminer](praxis-multi-container.md) – alle drei Säulen zusammen
- [Docker Compose – Einführung](../docker-compose/einfuehrung.md) – Automatisierung dessen, was du gerade gelernt hast
