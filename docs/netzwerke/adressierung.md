---
title: "Adressierung: MAC, IPv4, IPv6 und Subnetting"
description: "Wie Geräte in Netzwerken adressiert werden – physisch über MAC-Adressen, logisch über IPv4 und IPv6. Mit Subnetting im Kopf rechnen, CIDR-Notation und private vs. öffentliche Adressen."
---

# Adressierung: MAC, IPv4, IPv6 und Subnetting

Damit Daten im Netz **ankommen**, muss man Geräte eindeutig adressieren können. Im Netzwerk gibt es davon **zwei Sorten**: eine **physische** Adresse (MAC), die jede Netzwerkkarte ab Werk eingebrannt hat, und eine **logische** Adresse (IP), die jedes Gerät pro Netz dynamisch bekommt.

Das hier ist die **wichtigste** und **technisch dichteste** Seite des Blocks. Nimm dir Zeit. Wer Subnetting drauf hat, ist beim ganzen Rest entspannt.

!!! abstract "Lernziel"
    Nach dieser Seite kannst du:

    - eine **MAC-Adresse** erkennen und sagen, wo sie herkommt
    - **IPv4-Adressen** und ihre **Klassen** (A, B, C) lesen
    - die Begriffe **Netz, Host, Subnetzmaske, CIDR** verstehen
    - **kleine Subnetting-Aufgaben im Kopf** rechnen
    - **private vs. öffentliche** Adressbereiche unterscheiden
    - die Grundlagen von **IPv6** und warum es notwendig wurde
    - typische **Sonder-Adressen** (Loopback, Broadcast, Link-Local) einordnen

---

## Zwei Adress-Sorten – warum?

Eine schnelle Klärung vorab:

| Adresse | Schicht | Wer vergibt sie? | Wie lange gilt sie? |
|---------|---------|-----------------|---------------------|
| **MAC** | 2 (Sicherung) | Hardware-Hersteller, ab Werk | praktisch lebenslang |
| **IPv4 / IPv6** | 3 (Vermittlung) | Netzwerk-Administrator oder DHCP-Server | so lange das Gerät im Netz ist |

Warum braucht man **beide**?

- Die **MAC-Adresse** ist die **physische Identität** der Netzwerkkarte. Sie funktioniert nur im **lokalen Netz** (LAN). Sobald du über einen Router rausgehst, wird das Frame neu verpackt und bekommt eine andere MAC.
- Die **IP-Adresse** ist die **logische Identität** im Internet. Sie bleibt während einer Verbindung dieselbe, egal über wie viele Router das Paket reist.

**Analogie:** Die MAC-Adresse ist deine **Personalausweis-Nummer** (gleich bei Geburt zugewiesen, ändert sich nicht). Die IP-Adresse ist deine **aktuelle Wohnadresse** (wechselt, wenn du umziehst).

---

## MAC-Adressen

Eine **MAC-Adresse** ist eine **48-Bit-Zahl**, geschrieben in **sechs Hex-Paaren**, getrennt durch Doppelpunkte oder Bindestriche.

```text
00:1A:2B:3C:4D:5E
00-1A-2B-3C-4D-5E
001A.2B3C.4D5E   (in Cisco-Notation)
```

Die ersten **drei Bytes** sind eine **Herstellerkennung** (OUI – Organizationally Unique Identifier). Die letzten drei Bytes vergibt der Hersteller selbst. Damit ist jede MAC-Adresse weltweit eindeutig.

!!! tip "Hersteller herausfinden"
    Aus den ersten drei Bytes kannst du den Hersteller einer Karte ablesen. Beispiel:

    - `00:1A:2B:...` → könnte z.B. ein Cisco-, Apple- oder Intel-Gerät sein.
    - Es gibt **Online-Lookup-Tools** wie <https://maclookup.app>, in die du den OUI eingeben kannst.

    Sehr nützlich, wenn du herausfinden willst, was sich da gerade in dein WLAN eingeloggt hat.

### MAC-Adressen kann man fälschen

Obwohl die MAC ab Werk eingebrannt ist, kannst du sie auf deinem System **softwareseitig überschreiben** – das nennt sich **MAC-Spoofing**. Auf Linux z.B. mit `ip link set dev eth0 address aa:bb:cc:dd:ee:ff`.

**Anwendungen:**

- Privatsphäre (manche Smartphones randomisieren ihre WLAN-MAC, damit Geschäfte sie nicht tracken können)
- Tests in der Netzwerk-Sicherheit
- Manchmal als „Lizenz-Workaround" wenn alte Software an MAC-Adressen gebunden ist

**Aber:** in einem geschützten Netz mit MAC-Filterung kann das auch ein Angriffsvektor sein. Sicherheits-Architekten sollten sich nicht auf MAC-Adressen verlassen.

---

## IPv4-Adressen

Eine **IPv4-Adresse** ist eine **32-Bit-Zahl**, geschrieben in vier Dezimalzahlen von 0 bis 255, getrennt durch Punkte:

```text
192.168.1.100
10.0.0.5
8.8.8.8
```

Insgesamt gibt es **2³² ≈ 4,3 Milliarden** mögliche IPv4-Adressen. Das klingt nach viel, ist aber inzwischen knapp – dazu gleich mehr.

### Binär ist die Wahrheit

Jede der vier Zahlen entspricht einem **Byte** (8 Bit). Wenn du Subnetting im Kopf rechnen willst, musst du in Binär denken können:

```text
192.168.1.100
= 11000000.10101000.00000001.01100100
```

Wir müssen das nicht jeden Tag machen, aber wir kommen gleich an die Stelle, wo das nicht zu vermeiden ist.

!!! info "Schnell zwischen Dezimal und Binär umrechnen"
    Eine 8-Bit-Zahl kann von 0 bis 255 gehen. Die Wertigkeit der Bits von links nach rechts:

    | Bit-Stelle | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
    |-----------|---|---|---|---|---|---|---|---|
    | Wert | 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 |

    Beispiel: `192` = 128 + 64 = `11000000`.
    Beispiel: `100` = 64 + 32 + 4 = `01100100`.

    Wenn du nur eine Aufgabe richtig üben willst, dann diese: **Dezimal ↔ Binär für 8-Bit-Zahlen.** Das brauchst du in jedem Subnetting-Beispiel.

### Aufbau einer IPv4-Adresse: Netz und Host

Eine IP-Adresse hat **zwei Teile**:

- der **Netz-Anteil** sagt: in welchem Netz liegt das Gerät?
- der **Host-Anteil** sagt: welches Gerät genau in diesem Netz?

```text
192.168.1.100
└────┬────┘ └┬┘
   Netz    Host
(z.B. "Hamburg")  (z.B. "Haus 100")
```

Wie viel **Netz** und wie viel **Host** ist, regelt die **Subnetzmaske**.

---

## Subnetzmaske

Eine **Subnetzmaske** ist eine zweite 32-Bit-Zahl, die in der **gleichen Form wie eine IP** geschrieben wird. Sie sagt: **wo endet der Netz-Anteil, wo beginnt der Host-Anteil?**

Beispiel:

```text
IP:           192.168.1.100
Subnetzmaske: 255.255.255.0
```

In Binär gelesen:

```text
255.255.255.0 = 11111111.11111111.11111111.00000000
```

Die **Einsen** markieren den **Netzanteil**, die **Nullen** markieren den **Hostanteil**.

Bei der Maske `255.255.255.0` heißt das:

- Erste 24 Bits = Netz
- Letzte 8 Bits = Host

In unserem Beispiel `192.168.1.100`:

- **Netz:** `192.168.1.0`
- **Host:** `.100`

---

## CIDR-Notation

Statt jedes Mal `255.255.255.0` zu schreiben, hat man die **CIDR-Schreibweise** eingeführt: ein Schrägstrich + Anzahl der Netz-Bits.

```text
192.168.1.100/24
```

Das `/24` heißt: die ersten 24 Bit sind Netz, der Rest ist Host.

| CIDR | Subnetzmaske | Netz-Bits | Host-Bits | Anzahl Hosts |
|------|--------------|-----------|-----------|--------------|
| `/8`  | `255.0.0.0`     | 8  | 24 | ca. 16,7 Mio. |
| `/16` | `255.255.0.0`   | 16 | 16 | 65.534 |
| `/24` | `255.255.255.0` | 24 | 8  | 254 |
| `/25` | `255.255.255.128` | 25 | 7 | 126 |
| `/26` | `255.255.255.192` | 26 | 6 | 62 |
| `/27` | `255.255.255.224` | 27 | 5 | 30 |
| `/28` | `255.255.255.240` | 28 | 4 | 14 |
| `/29` | `255.255.255.248` | 29 | 3 | 6 |
| `/30` | `255.255.255.252` | 30 | 2 | 2 |
| `/32` | `255.255.255.255` | 32 | 0 | 1 (ein einzelnes Gerät) |

!!! info "Warum „Anzahl Hosts" immer 2 weniger als 2^(Host-Bits)?"
    In jedem Subnetz sind **zwei Adressen reserviert**:

    - die **erste Adresse** ist die **Netzadresse** selbst (z.B. `192.168.1.0`)
    - die **letzte Adresse** ist die **Broadcast-Adresse** (z.B. `192.168.1.255`) – Pakete an sie gehen an **alle** im Subnetz

    Darum sind in einem `/24`-Netz nicht 256, sondern nur **254** Adressen für Geräte nutzbar.

---

## IP-Adress-Klassen (historisch)

Früher wurden IPv4-Adressen in **Klassen** eingeteilt:

| Klasse | Erstes Byte | Standard-Maske | CIDR | Typische Verwendung |
|--------|------------|----------------|------|---------------------|
| **A** | 1–126     | `255.0.0.0`     | `/8`  | sehr große Netze (z.B. Telekommunikations-Anbieter) |
| **B** | 128–191   | `255.255.0.0`   | `/16` | mittlere Netze (große Firmen) |
| **C** | 192–223   | `255.255.255.0` | `/24` | kleine Netze (typisches Heim-/Kleinbüro-LAN) |
| **D** | 224–239   | –               | –     | Multicast |
| **E** | 240–255   | –               | –     | reserviert/experimentell |

**Heute** spielt das eine kleinere Rolle, weil mit **CIDR** beliebige Maskenlängen möglich sind. Aber die Begriffe **„Klasse-C-Netz"** für `/24` oder **„Klasse-B-Netz"** für `/16` hörst du noch oft.

---

## Private vs. öffentliche Adressen

Nicht jede IP-Adresse darf im Internet auftauchen. Es gibt drei **private Adressbereiche**, die nur in lokalen Netzen verwendet werden dürfen:

| Bereich | CIDR | Wo du das siehst |
|---------|------|-------------------|
| `10.0.0.0` – `10.255.255.255` | `10.0.0.0/8` | große Firmennetze |
| `172.16.0.0` – `172.31.255.255` | `172.16.0.0/12` | mittlere Firmennetze, Docker-Defaults |
| `192.168.0.0` – `192.168.255.255` | `192.168.0.0/16` | klassisches Heim-LAN |

**Alle anderen** IPv4-Adressen sind potenziell **öffentlich** und können im Internet auftauchen.

!!! info "Warum private Adressen?"
    Es gibt nur 4,3 Mrd. IPv4-Adressen, und davon sind viele reserviert. Das reicht **nicht** für jedes Gerät weltweit. Lösung: in lokalen Netzen werden private Adressen verwendet, die nur im eigenen LAN gelten. Wenn ein Gerät mit dem Internet reden will, geht das über **NAT** (Network Address Translation, mehr dazu in [Segmentierung und VPN](segmentierung-und-vpn.md)).

    So teilen sich Millionen von Geräten weltweit dieselben privaten Adressen. Dein Heim-Router hat innen `192.168.1.1` – millionenfach.

---

## Sonder-Adressen, die du kennen musst

Ein paar IP-Adressen haben spezielle Bedeutung:

| Adresse | Name | Wofür |
|---------|------|-------|
| `127.0.0.1` | **Loopback** / „localhost" | das Gerät selbst – Pakete bleiben in der eigenen Maschine |
| `0.0.0.0`   | **alle Adressen** | „lausche auf allen Interfaces" oder „unbekannt" |
| `255.255.255.255` | **limitierter Broadcast** | an alle im lokalen Netz |
| `169.254.x.x` | **Link-Local** (APIPA) | Auto-Vergabe, wenn DHCP fehlt |
| `224.0.0.0` – `239.255.255.255` | **Multicast** | an eine Gruppe |

**Loopback** ist besonders wichtig: wenn du `localhost` oder `127.0.0.1` ansprichst, antwortet dein eigenes Gerät. Das funktioniert auch ohne Netzwerk-Kabel. Praktisch zum Testen lokaler Server.

---

## Subnetting im Kopf

Jetzt der Teil, vor dem viele Respekt haben. Subnetting heißt: **ein größeres Netz in kleinere unterteilen**. Zwei Standard-Aufgaben.

### Aufgabe 1: Liegt eine IP im Subnetz?

Gegeben: `192.168.10.45` mit Maske `/26`. Frage: liegt `192.168.10.70` im gleichen Subnetz?

**Vorgehen:**

1. `/26` heißt: 26 Bit Netz, 6 Bit Host. Die Maske ist `255.255.255.192` (weil das vierte Byte = `11000000` = 192).
2. Das vierte Oktett hat **6 Hostbits**, also kann das Host-Anteil-Wert 0 bis 63 sein. Die Subnetz-Größe ist **64**.
3. Die Subnetze beginnen also bei: `.0`, `.64`, `.128`, `.192`.
4. **`.45`** liegt im Subnetz `.0` bis `.63`.
5. **`.70`** liegt im Subnetz `.64` bis `.127`.
6. **Nein**, die beiden sind **nicht** im gleichen Subnetz.

### Aufgabe 2: Wie viele Hosts passen in ein Subnetz?

Gegeben: ein `/27`-Netz. Wie viele Hosts gehen rein?

- `/27` = 27 Netz-Bits, **5 Host-Bits**
- 2⁵ = 32 Adressen total
- minus 2 (Netz- und Broadcast-Adresse) = **30 nutzbare Host-Adressen**

### Aufgabe 3: Welche Maske brauche ich für mindestens X Hosts?

Du sollst ein Subnetz für 100 Geräte planen. Welche Maske?

- 7 Host-Bits = 2⁷ = 128 Adressen, minus 2 = **126 nutzbar** → reicht
- 6 Host-Bits = 64 Adressen, minus 2 = 62 → zu klein
- Du brauchst also **7 Host-Bits**, also `/25` (32 - 7 = 25).

### Subnetze aufteilen

Du hast ein `/24`-Netz (z.B. `192.168.10.0/24` mit 254 Hosts) und willst es in **vier gleich große Subnetze** aufteilen.

- 4 Subnetze = 2² → 2 zusätzliche Netzbits → neue CIDR: `/24 + 2 = /26`.
- Jedes Subnetz hat 2⁶ = 64 Adressen, davon 62 nutzbar.

Die vier Subnetze sind:

| Subnetz | Netzadresse | Erster Host | Letzter Host | Broadcast |
|---------|-------------|-------------|--------------|-----------|
| 1 | `192.168.10.0/26`   | `.1`   | `.62`  | `.63`  |
| 2 | `192.168.10.64/26`  | `.65`  | `.126` | `.127` |
| 3 | `192.168.10.128/26` | `.129` | `.190` | `.191` |
| 4 | `192.168.10.192/26` | `.193` | `.254` | `.255` |

**Faustregel:** wenn die Maske im vierten Oktett `192` (`/26`) ist, sind die Subnetz-Schritte 64. Bei `224` (`/27`) sind sie 32. Bei `240` (`/28`) sind sie 16. Das **Schritt-Inkrement** ist immer `256 - Maskenwert`.

!!! tip "Das brauchst du wirklich"
    Niemand erwartet, dass du im Kopf binär multiplizierst. Aber diese drei Fragen musst du in 30 Sekunden beantworten können:

    1. „Wie viele Hosts gehen in ein `/X`-Netz?"
    2. „Liegen IP A und IP B im selben Subnetz?"
    3. „Welche Maske brauche ich für mindestens Y Hosts?"

    Wenn du das kannst, hast du Subnetting drauf.

---

## IPv6 – warum es nötig wurde

**Problem:** 4,3 Mrd. IPv4-Adressen reichen nicht für die Welt. Smartphones, IoT-Geräte, Industrieanlagen, Server – inzwischen sind viele Adressen vergeben. Es gibt zwar NAT als Pflaster, aber das bringt eigene Probleme.

**Lösung:** **IPv6** mit **128-Bit-Adressen**. Das sind **2¹²⁸**, oder etwa **3,4 × 10³⁸** Adressen. Zum Vergleich: das wären mehrere Milliarden Adressen für **jedes Sandkorn der Erde** – nicht für die ganze Erde, sondern für **jedes einzelne Sandkorn**. Damit kann jedes Gerät weltweit eine eindeutige öffentliche Adresse haben, mit gigantischem Spielraum für die Zukunft.

### Schreibweise

IPv6 wird in **acht Blöcken hexadezimal** geschrieben, getrennt durch Doppelpunkte:

```text
2001:0db8:85a3:0000:0000:8a2e:0370:7334
```

Kürzungsregeln:

- Führende Nullen in einem Block weglassen: `0db8` → `db8`
- Aufeinanderfolgende Nullblöcke einmal pro Adresse mit `::` ersetzen:

```text
Voll:    2001:0db8:85a3:0000:0000:8a2e:0370:7334
Gekürzt: 2001:db8:85a3::8a2e:370:7334
```

### Adress-Typen

| Typ | Bereich | Wofür |
|-----|---------|-------|
| **Global Unicast** | `2000::/3` | wie öffentliche IPv4 |
| **Link-Local** | `fe80::/10` | nur im lokalen Netzsegment |
| **Unique Local (ULA)** | `fc00::/7` | wie private IPv4 (z.B. `10.0.0.0/8`) |
| **Multicast** | `ff00::/8` | an Gruppen |
| **Loopback** | `::1` | localhost |

### Praktische Unterschiede zu IPv4

- **Kein NAT mehr nötig**, weil es genug Adressen gibt
- **Keine Broadcasts mehr** – stattdessen Multicast
- **Auto-Konfiguration** durch das Gerät selbst (SLAAC) statt zwingend DHCP
- **IPSec verpflichtend** in der Spezifikation (in der Praxis aber meist optional)

**Heutige Realität:** beide Protokolle laufen parallel. Die meisten Netze sind **Dual Stack** – sie sprechen IPv4 und IPv6 gleichzeitig. Die Migration zu reinem IPv6 ist seit Jahren im Gange, aber dauert.

---

## ARP – wie IP und MAC zusammenkommen

Ein wichtiges Detail: Sobald ein Paket im **lokalen Netz** zugestellt werden soll, muss aus einer **IP-Adresse** die zugehörige **MAC-Adresse** herausgefunden werden. Das macht das **Address Resolution Protocol (ARP)**.

Ablauf:

1. Dein Computer will an `192.168.1.100` ein Paket schicken.
2. Er schaut in seinem **ARP-Cache**: kenne ich die MAC zu dieser IP? Nein.
3. Er sendet einen **ARP-Request** an alle (Broadcast): „Wer hat 192.168.1.100? Bitte melden bei 192.168.1.50."
4. Das Gerät mit der Adresse antwortet: „Das bin ich, meine MAC ist 00:1A:2B:3C:4D:5E."
5. Der Cache wird gefüllt. Das Frame kann mit der richtigen MAC verschickt werden.

ARP läuft komplett **unsichtbar** im Hintergrund. Du sieht es nur, wenn etwas schiefläuft (z.B. **ARP-Spoofing** bei einem Sicherheitsangriff).

Auf der Kommandozeile sehen:

```bash
arp -a              # zeigt deinen ARP-Cache
```

---

## Was du jetzt wissen solltest

- **MAC-Adressen** sind **physisch (Layer 2)** und werden vom Hersteller ab Werk vergeben.
- **IP-Adressen** sind **logisch (Layer 3)** und werden vom Netzwerk vergeben (DHCP oder manuell).
- Eine IP teilt sich in **Netz-Anteil und Host-Anteil**, getrennt durch die **Subnetzmaske** bzw. **CIDR**-Notation.
- **Private Adressbereiche**: `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`. Sind nur im LAN gültig.
- **Loopback** ist `127.0.0.1`, **APIPA / Link-Local** ist `169.254.x.x`.
- **IPv6** löst das Adress-Knappheits-Problem mit 128 Bit Adresslänge. Schreibweise mit Hex und `::`-Abkürzung.
- **ARP** verbindet im LAN die IP- mit der MAC-Adresse, damit Frames korrekt zugestellt werden können.
- **Subnetting im Kopf**: 3 Aufgaben-Typen reichen für 90 % aller Fälle.

---

## Merksatz

!!! success "Merksatz"
    > **MAC ist Hardware (Layer 2), IP ist Logik (Layer 3). Eine IP-Adresse ist Netz + Host, die Subnetzmaske trennt beides. Private Bereiche sind 10er, 172.16er, 192.168er. IPv6 löst die Knappheit mit 128 Bit. ARP verbindet im LAN IP und MAC. Subnetting heißt im Kern: wo verläuft die Grenze zwischen Netz und Host?**

---

## Weiterlesen

- [Routing und Switching](routing-und-switching.md): wie Pakete anhand von IP und MAC den Weg finden
- [DHCP](dhcp.md): wie ein Gerät automatisch eine IP bekommt
- [Segmentierung und VPN](segmentierung-und-vpn.md): wie NAT und VLAN die Adress-Knappheit umgehen
