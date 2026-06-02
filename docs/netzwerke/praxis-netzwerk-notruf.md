---
title: "Praxis: Netzwerk-Notruf"
description: "Troubleshooting-Krimi für Gruppen: Mit der Schicht-Checkliste (Layer 1 bis 7) findest du die Ursache von fünf Netzwerk-Störungen – APIPA, DNS-Ausfall, falsches Gateway, falsche Subnetzmaske und blockierter Port. Nur mit Fall-Karten, kein Setup nötig."
---

# Praxis: Netzwerk-Notruf

<span class='badge badge-praxis'>Praxis</span> &nbsp; Es klingelt: „Das Netzwerk geht nicht!" Mehr weiß der Anrufer nicht. Jetzt bist du dran – als Netzwerk-Detektiv, der aus ein paar Befehlsausgaben die wahre Ursache herausliest.

!!! info "Auf einen Blick"
    - **Dauer:** ~30–45 Minuten
    - **Gruppen:** 2–4 Personen
    - **Material:** nur die **Fall-Karten** (dieses Blatt, ausgedruckt oder am Bildschirm). Optional darfst du die Befehle am eigenen Rechner gegenchecken – nötig ist das nicht.
    - **Voraussetzung:** möglichst der ganze Netzwerk-Block, mindestens aber [Adressierung](adressierung.md), [DNS](dns.md) und [DHCP](dhcp.md).

In jedem Fall liegt ein **echter** Fehler vor – nicht zwei, nicht „irgendwie kaputt". Genau einer. Eure Aufgabe ist es, ihn zu benennen, der richtigen **Schicht** zuzuordnen und einen Fix vorzuschlagen. Wer systematisch vorgeht, ist schneller als jeder, der wild herumprobiert.

---

## Dein Werkzeug: die Schicht-Checkliste

Ein guter Detektiv rät nicht. Er arbeitet eine Liste ab – **von unten nach oben**, Schicht für Schicht. Sobald eine Antwort „nein" lautet, hast du die Spur. Du musst nicht jede Schicht prüfen, wenn du schon weiter unten fündig wirst.

| Schicht | Frage | Womit prüfst du das? |
|---|---|---|
| **1 – Physisch** | Kabel eingesteckt? LED am Port leuchtet? WLAN verbunden? | Hinschauen, Kabel anfassen |
| **2 – Sicherung** | MAC bekannt? Richtiges VLAN? Switch-Port okay? | `arp -a`, Switch-/Port-Status |
| **3 – Vermittlung** | Habe ich eine **sinnvolle IP**? Stimmen **Maske** und **Gateway**? Komme ich per `ping` raus? | `ipconfig` / `ipconfig /all`, `ping` |
| **4 – Transport** | Ist der **Ziel-Port** offen, oder blockt eine **Firewall**? | `Test-NetConnection host -Port 443`, `telnet host 443` |
| **7 – Anwendung** | Antwortet der **Dienst**? Liefert er einen Fehler? Was sagen die **Logs**? **DNS** sauber? | `nslookup`, App-Logs, HTTP-Status |

!!! tip "Die drei wichtigsten Reflexe"
    - **`ping 8.8.8.8` geht, `ping github.com` nicht** → das Netz ist da, aber der **Name** wird nicht aufgelöst → **DNS** (Layer 7).
    - **Adresse beginnt mit `169.254.`** → der Rechner hat sich selbst eine Not-Adresse vergeben → **kein DHCP-Server erreicht** (Layer 3).
    - **`ping` zum Server geht, die App nicht** → IP-Weg steht, aber der **Port** ist dicht → **Firewall** (Layer 4).

    Die ausführliche Version dieser Checkliste – inklusive Schaubild – findest du in den [Merksätzen](merksaetze.md#wenn-dich-jemand-mit-einem-problem-konfrontiert-die-schicht-checkliste).

---

## So läuft's

1. **Fall ziehen.** Jede Gruppe bekommt **einen** der fünf Fälle unten (Symptom + Befehlsausgaben).
2. **Checkliste durchgehen** – von unten nach oben. Lest die Ausgabe Zeile für Zeile. Was fällt auf? Was ist auffällig **anders als erwartet**?
3. **Diagnose stellen.** Schreibt drei Dinge auf:
    - **Ursache:** Was ist konkret falsch?
    - **Schicht:** Auf welcher Ebene liegt der Fehler?
    - **Fix:** Was würdest du tun, um es zu beheben?
4. **Feststecken erlaubt.** Erst selbst diskutieren – dann (und nur dann) eine **Hilfekarte** aufklappen.
5. **Rotieren.** Wenn ihr fertig seid, gebt den Fall weiter und nehmt den nächsten. Wer alle fünf knackt, ist Netzwerk-Kommissar.

!!! warning "Spielregel"
    Die **Lösungen** ganz unten erst aufklappen, wenn ihr eure eigene Diagnose **aufgeschrieben** habt. Sonst nehmt ihr euch den schönsten Teil – den Aha-Moment.

---

## Die Fälle

### Fall 1 – „Ich komme nirgendwo hin"

Frühschicht im Büro. Kollege Marek startet seinen PC, will die Mails abrufen – nichts. Webseite? Nichts. Sogar der Netzwerkdrucker im selben Raum reagiert nicht. „Gestern ging noch alles", schwört er. Das Kabel steckt, die Lampe am Switch-Port blinkt brav. Du lässt dir die Konfiguration zeigen:

```text
C:\> ipconfig

Windows-IP-Konfiguration

Ethernet-Adapter Ethernet:

   Verbindungsspezifisches DNS-Suffix:
   Autokonfiguration-IPv4-Adresse  . : 169.254.118.42
   Subnetzmaske  . . . . . . . . . . : 255.255.0.0
   Standardgateway . . . . . . . . . :
```

Ein Ping nach draußen geht erwartungsgemäß ins Leere:

```text
C:\> ping 8.8.8.8

Die Pinganforderung konnte den Host 8.8.8.8 nicht finden.
Überprüfen Sie den Hostnamen, und versuchen Sie es erneut.
```

Marek tippt nervös: „Ist mein Internet kaputt?" Du schaust auf die Adresse und ahnst schon, dass das Problem viel früher anfängt.

---

### Fall 2 – „Webseiten gehen nicht, aber …"

Die Buchhalterin Frau Os ruft an: keine einzige Webseite lädt, der Browser sagt nur „Server konnte nicht gefunden werden". Aber – und das findet sie selbst seltsam – ihr Team-Chat, der eben noch lief, zeigt weiter alte Nachrichten an. „Das Internet ist doch da, oder?"

Du machst den Schnelltest. Erst die nackte IP eines bekannten Servers:

```text
C:\> ping 140.82.121.4

Ping wird ausgeführt für 140.82.121.4 mit 32 Bytes Daten:
Antwort von 140.82.121.4: Bytes=32 Zeit=23ms TTL=52
Antwort von 140.82.121.4: Bytes=32 Zeit=22ms TTL=52
Antwort von 140.82.121.4: Bytes=32 Zeit=24ms TTL=52

Ping-Statistik für 140.82.121.4:
    Pakete: Gesendet = 3, Empfangen = 3, Verloren = 0 (0% Verlust)
```

Dann derselbe Server, diesmal über seinen Namen:

```text
C:\> ping github.com

Die Pinganforderung konnte den Host "github.com" nicht finden.
Überprüfen Sie den Hostnamen, und versuchen Sie es erneut.
```

Zur Kontrolle noch ein Blick auf die Namensauflösung:

```text
C:\> nslookup github.com

Server:  UnKnown
Address:  192.168.1.250

*** UnKnown kann github.com nicht finden: No response from server
```

„Die IP geht, der Name nicht", murmelst du. Da war doch was.

---

### Fall 3 – „Nur das Internet fehlt"

Im Lager funktioniert das halbe Netz wunderbar: Der Kollege erreicht den Lager-PC nebenan, den Etikettendrucker, das gemeinsame Laufwerk. Nur **raus ins Internet** kommt er nicht. Kein Webshop, keine Sendungsverfolgung. „Lokal top, draußen tot", fasst er zusammen.

Die Adressvergabe sieht auf den ersten Blick gesund aus – eine richtige LAN-Adresse, eine plausible Maske:

```text
C:\> ipconfig

Ethernet-Adapter Ethernet:

   IPv4-Adresse  . . . . . . . . . . : 192.168.20.34
   Subnetzmaske  . . . . . . . . . . : 255.255.255.0
   Standardgateway . . . . . . . . . : 192.168.99.1
```

Der Kollege nebenan ist sofort erreichbar:

```text
C:\> ping 192.168.20.35

Antwort von 192.168.20.35: Bytes=32 Zeit<1ms TTL=128
Antwort von 192.168.20.35: Bytes=32 Zeit<1ms TTL=128
```

Aber jeder Versuch nach draußen läuft in eine Wand:

```text
C:\> ping 8.8.8.8

Ping wird ausgeführt für 8.8.8.8 mit 32 Bytes Daten:
Zielhost nicht erreichbar.
Zielhost nicht erreichbar.
Zielhost nicht erreichbar.

Ping-Statistik für 8.8.8.8:
    Pakete: Gesendet = 3, Empfangen = 0, Verloren = 3 (100% Verlust)
```

Du vergleichst die Adresse des PCs mit der Adresse, an die er alles „nach draußen" schicken soll. Hm.

---

### Fall 4 – „Komische Adresse"

Ein frisch eingerichteter PC in der Entwicklungsabteilung. Die Kollegin erreicht ihre Nachbarn im Büro problemlos und kommt sogar ins Internet. Nur an **einen bestimmten Server** – den Build-Server unter `192.168.10.200` – kommt sie partout nicht heran. „Alle anderen erreichen den, nur ich nicht. An mir liegt's bestimmt nicht", sagt sie.

Wichtig zu wissen: Die Etage ist bewusst in **zwei getrennte Netze** aufgeteilt. Die Arbeitsplätze liegen in `192.168.10.0/25` (Adressen `.1` bis `.126`), die Server-Maschinen in einem **eigenen** Netz `192.168.10.128/25` (Adressen `.129` bis `.254`). Dazwischen vermittelt der Router unter `192.168.10.1`.

So sieht ihre Konfiguration aus:

```text
C:\> ipconfig

Ethernet-Adapter Ethernet:

   IPv4-Adresse  . . . . . . . . . . : 192.168.10.50
   Subnetzmaske  . . . . . . . . . . : 255.255.255.0
   Standardgateway . . . . . . . . . : 192.168.10.1
```

Der Nachbar-PC und das Gateway antworten ohne Murren:

```text
C:\> ping 192.168.10.51
Antwort von 192.168.10.51: Bytes=32 Zeit<1ms TTL=128

C:\> ping 192.168.10.1
Antwort von 192.168.10.1: Bytes=32 Zeit<1ms TTL=128
```

Doch der Build-Server bleibt stumm:

```text
C:\> ping 192.168.10.200

Ping wird ausgeführt für 192.168.10.200 mit 32 Bytes Daten:
Zielhost nicht erreichbar.
Zielhost nicht erreichbar.

Ping-Statistik für 192.168.10.200:
    Pakete: Gesendet = 2, Empfangen = 0, Verloren = 2 (100% Verlust)
```

Du schaust auf die Maske, dann auf die Netz-Aufteilung der Etage – und auf die `.200`. Rechne mal kurz nach: In **welches** Netz gehört `.200` eigentlich und in welches glaubt der PC zu gehören?

---

### Fall 5 – „Server pingt, aber die App nicht"

Der neue interne Wiki-Server ist aufgesetzt, alle freuen sich. Nur: Im Browser unter `https://wiki.firma.local` dreht sich ewig das Rädchen, dann „Die Website ist nicht erreichbar". Der Admin schwört, der Server laufe. Und tatsächlich – der Rechner ist sauber erreichbar:

```text
C:\> ping 192.168.30.10

Antwort von 192.168.30.10: Bytes=32 Zeit=1ms TTL=128
Antwort von 192.168.30.10: Bytes=32 Zeit=1ms TTL=128
Antwort von 192.168.30.10: Bytes=32 Zeit=1ms TTL=128

Ping-Statistik für 192.168.30.10:
    Pakete: Gesendet = 3, Empfangen = 3, Verloren = 0 (0% Verlust)
```

Der Name löst auch korrekt auf – DNS ist also nicht das Problem:

```text
C:\> nslookup wiki.firma.local

Server:  dns.firma.local
Address:  192.168.30.2

Name:    wiki.firma.local
Address: 192.168.30.10
```

Jetzt klopfst du gezielt an die Tür, durch die HTTPS hereinkommen müsste – Port 443:

```text
C:\> Test-NetConnection 192.168.30.10 -Port 443

ComputerName     : 192.168.30.10
RemoteAddress    : 192.168.30.10
RemotePort       : 443
InterfaceAlias   : Ethernet
SourceAddress    : 192.168.30.55
TcpTestSucceeded : False
```

Der Rechner ist da, der Name stimmt, nur die **Tür bleibt zu**. Wer hält sie zu?

---

## Hilfekarten

!!! tip "Erst denken, dann klicken"
    Ein Hinweis pro Fall – er zeigt dir, **was in der Ausgabe auffällt**, verrät aber **nicht** die Lösung. Nutzt ihn nur, wenn ihr feststeckt.

??? info "Hinweis zu Fall 1"
    Schau dir die **Adresse** genau an: `169.254.118.42`. Adressen aus dem Bereich `169.254.x.x` vergibt ein Rechner **sich selbst**, wenn er etwas Bestimmtes von außen **nicht bekommen** hat. Frag dich: Wer hätte ihm eigentlich eine „richtige" Adresse, Maske und Gateway geben sollen – und warum steht beim Standardgateway gar nichts? (Siehe [DHCP](dhcp.md).)

??? info "Hinweis zu Fall 2"
    Die **IP** `140.82.121.4` ist erreichbar, der **Name** `github.com` nicht. Der Weg durchs Netz funktioniert also – es scheitert an der **Übersetzung von Name zu IP**. Und schau dir die `nslookup`-Ausgabe an: Antwortet der befragte Server überhaupt sauber? (Siehe [DNS](dns.md).)

??? info "Hinweis zu Fall 3"
    Lokale Geräte gehen, der Weg nach draußen nicht. Was braucht ein Paket, um das eigene Netz zu **verlassen**? Vergleiche die **IP des PCs** (`192.168.20.34`, Maske `/24`) mit dem eingetragenen **Standardgateway** (`192.168.99.1`). Liegen die beiden im **selben** Netz? Kann der PC sein Gateway über das lokale Netz überhaupt erreichen?

??? info "Hinweis zu Fall 4"
    Nachbar und Gateway gehen, nur der Server `.200` nicht. Die Etage ist in `/25`-Netze geteilt – die **Maske** im `ipconfig` ist aber `255.255.255.0`, also `/25`? Rechne nach: Bei dieser Maske – hält der PC die `.200` für „bei mir um die Ecke" (gleiches Netz) oder für „hinter dem Router" (anderes Netz)? Und wo liegt `.200` **wirklich**? (Siehe [Adressierung](adressierung.md).)

??? info "Hinweis zu Fall 5"
    `ping` geht (Layer 3 steht), DNS stimmt (Layer 7-Name passt). Bis zu welcher Schicht ist also **alles in Ordnung**? Der `Test-NetConnection` auf **Port 443** sagt `TcpTestSucceeded : False`. Der Rechner antwortet auf Ping, aber **dieser eine Port** nimmt keine Verbindung an. Was sitzt typischerweise zwischen dir und einem einzelnen Port und entscheidet, ob er offen ist?

---

## Lösung

!!! danger "Stopp"
    Nur aufklappen, wenn eure eigene Diagnose steht – Ursache, Schicht und Fix aufgeschrieben.

??? success "Lösung Fall 1 – APIPA: kein DHCP"
    - **Ursache:** Die Adresse `169.254.118.42` (mit Maske `255.255.0.0` und **leerem** Standardgateway) ist eine **APIPA-/Link-Local-Adresse**. Der PC hat sie sich selbst vergeben, weil er **keinen DHCP-Server erreicht** hat. Damit hat er keine gültige LAN-Adresse, kein Gateway und keinen DNS-Server – er kann **nirgendwohin**, nicht mal zum Drucker im selben Raum.
    - **Schicht:** **Layer 3** (Vermittlung – die IP-Konfiguration fehlt). Auslöser ist ein ausgefallener/nicht erreichbarer DHCP-Dienst.
    - **Fix:**
        1. Lease neu anfordern: `ipconfig /release` und `ipconfig /renew`.
        2. Hilft das nicht: Ist der **DHCP-Server** (oft der Router) eingeschaltet und erreichbar? Steckt das Kabel auch wirklich am richtigen Switch-Port (richtiges **VLAN**)? Ist der **DHCP-Pool erschöpft**?
        3. Schnell-Gegentest: testweise eine **feste IP** passend zum Netz setzen – geht es dann, war es definitiv die Adressvergabe.

    Eselsbrücke: **`169.254.x.x` = DHCP hat versagt.** Mehr dazu unter [DHCP](dhcp.md).

??? success "Lösung Fall 2 – DNS antwortet nicht"
    - **Ursache:** Die IP `140.82.121.4` ist erreichbar, der Name `github.com` nicht – der Datenweg ins Internet steht also. Es scheitert an der **Namensauflösung**. Das `nslookup` verrät es: Der eingetragene DNS-Server (`192.168.1.250`) liefert `No response from server` und `UnKnown`. Der **DNS-Server ist ausgefallen oder falsch eingetragen**.
    - **Schicht:** **Layer 7** (Anwendung – DNS ist ein Anwendungsdienst). Das eigentliche Netz (Layer 1–4) funktioniert.
    - **Fix:**
        1. Sofort-Abhilfe: einen **funktionierenden DNS-Server** eintragen, z. B. `8.8.8.8` (Google) oder `1.1.1.1` (Cloudflare).
        2. DNS-Cache leeren: `ipconfig /flushdns`.
        3. Dauerhaft: Warum ist der vorgesehene DNS-Server (`192.168.1.250`) tot? Dienst neu starten, oder den **per DHCP verteilten** DNS-Eintrag korrigieren, damit nicht alle Clients denselben Fehler erben.

    Eselsbrücke: **`ping`-IP geht, `ping`-Name nicht → DNS.** Mehr dazu unter [DNS](dns.md).

??? success "Lösung Fall 3 – falsches Default-Gateway"
    - **Ursache:** Der PC hat `192.168.20.34` mit Maske `/24` – sein lokales Netz ist also `192.168.20.0`/`255.255.255.0`. Das eingetragene **Standardgateway `192.168.99.1`** liegt in einem **ganz anderen Netz** (`192.168.99.0`). Ein Gateway muss aber **im eigenen Subnetz** liegen, sonst kann der PC es nicht direkt ansprechen. Pakete „nach draußen" finden keinen Ausgang – lokal (gleiches Netz, kein Gateway nötig) klappt dagegen alles. Daher die Meldung **„Zielhost nicht erreichbar"** beim Ping ins Internet.
    - **Schicht:** **Layer 3** (Vermittlung/Routing – das Gateway ist falsch konfiguriert).
    - **Fix:** Das **Standardgateway korrigieren** auf die Router-Adresse im eigenen Netz, hier z. B. `192.168.20.1`. Kam die Fehlkonfiguration per DHCP, gehört die **DHCP-Option „Gateway"** korrigiert, damit nicht das ganze Subnetz betroffen ist.

    Merksatz: **Was nicht ins lokale Netz gehört, geht zum Default Gateway – und das muss im eigenen Subnetz liegen.** Mehr unter [Adressierung](adressierung.md).

??? success "Lösung Fall 4 – falsche Subnetzmaske"
    - **Ursache:** Die Etage ist in `/25`-Netze geteilt; der PC gehört zu `192.168.10.0/25` (`.1`–`.126`). Er hat aber die Maske **`255.255.255.0` (`/24`)** statt der nötigen **`255.255.255.128` (`/25`)**. Mit `/24` glaubt der PC, sein Netz reiche von `.1` bis `.254` – also hält er den Build-Server `192.168.10.200` für einen **lokalen Nachbarn** und versucht, ihn **direkt** über das lokale Netz zu erreichen, statt das Paket an den **Router** zu geben. Tatsächlich liegt `.200` aber im **anderen** Netz (`192.168.10.128/25`) hinter dem Router. Ergebnis: keiner antwortet, **„Zielhost nicht erreichbar"**. Nachbar (`.51`) und Gateway (`.1`) funktionieren, weil die unter **beiden** Masken im selben Netz liegen – deshalb fällt der Fehler nur beim Server auf.
    - **Schicht:** **Layer 3** (Vermittlung – die Subnetzmaske bestimmt die Netzgrenze).
    - **Fix:** Die **Subnetzmaske auf `255.255.255.128` (`/25`)** korrigieren. Dann erkennt der PC, dass `.200` außerhalb des eigenen Netzes liegt und schickt das Paket korrekt über das Gateway `192.168.10.1` zum Server.

    Merksatz: **Die Subnetzmaske entscheidet, was „lokal" ist und was über den Router muss.** Eine zu weite Maske macht entfernte Netze „unsichtbar". Mehr unter [Adressierung](adressierung.md).

??? success "Lösung Fall 5 – Firewall blockt den Port"
    - **Ursache:** `ping` zum Server klappt (Layer 3 in Ordnung), der Name löst korrekt auf (DNS/Layer 7 in Ordnung). Aber `Test-NetConnection ... -Port 443` meldet `TcpTestSucceeded : False`: Der Rechner ist erreichbar, **Port 443 nimmt aber keine Verbindung an**. Das ist das klassische Bild einer **Firewall, die den Port blockt** (oder – seltener – der Webdienst lauscht gar nicht auf 443). Ping (ICMP) und der TCP-Port sind verschiedene Dinge: Ping kann durchgehen, während der Port zu ist.
    - **Schicht:** **Layer 4** (Transport – es geht um einen TCP-**Port**). Die Firewall filtert hier auf Port-Ebene.
    - **Fix:**
        1. **Firewall** prüfen – auf dem Server (z. B. Windows-Firewall) und im Netzweg: ist **eingehend TCP 443** erlaubt? Regel ergänzen.
        2. Gegenprobe, dass der Dienst überhaupt lauscht: auf dem Server `netstat -an | findstr :443` – taucht `LISTENING` auf?
        3. Von außen testen mit Port-Test: `Test-NetConnection wiki.firma.local -Port 443` (oder klassisch `telnet wiki.firma.local 443`). Sobald die Verbindung aufgeht, lädt auch der Browser.

    Merksatz: **Ping prüft den Weg (Layer 3), der Port-Test prüft die Tür (Layer 4).** Mehr zu Ports unter [Transport-Protokolle](transport-protokolle.md), mehr zu Firewalls in den [Merksätzen](merksaetze.md).

---

## Was du dabei gelernt hast

- **Arbeite von unten nach oben.** Kabel/Link (1) → MAC/VLAN (2) → IP/Maske/Gateway (3) → Port/Firewall (4) → DNS/Anwendung (7). Wer die Liste der Reihe nach abklappert, findet den Fehler doppelt so schnell – und sucht nicht an der falschen Stelle.
- **Es liegt oft nicht da, wo man zuerst denkt.** „Das Internet ist kaputt" war in keinem einzigen Fall die Wahrheit: mal fehlte die Adresse (DHCP), mal nur der Name (DNS), mal der Ausgang (Gateway), mal die Netzgrenze (Maske), mal nur eine Tür (Port).
- **Wenige Befehle reichen weit.** `ipconfig`, `ping`, `nslookup` und ein Port-Test (`Test-NetConnection` / `telnet`) decken die meisten Alltagsstörungen auf. Du musst sie nur **systematisch** einsetzen und die Ausgabe **lesen** statt überfliegen.
- **Ein paar Muster lohnt es sich auswendig zu kennen:** `169.254.x.x` heißt DHCP-Ausfall; „IP geht, Name nicht" heißt DNS; „lokal geht, draußen nicht" riecht nach Gateway/Maske; „Ping ja, App nein" heißt Port/Firewall.

!!! success "Die Faustregel"
    Wenn etwas im Netzwerk hakt, sitzt das Problem zu rund 80 % auf **Layer 1 bis 4**. Erst danach lohnt es sich, die Anwendung selbst zu verdächtigen. Wer das verinnerlicht hat, wird zu der Person, die alle fragen, wenn das Netz spinnt.

Die kompakte Schicht-Checkliste zum Wiederholen findest du in den [Merksätzen](merksaetze.md#wenn-dich-jemand-mit-einem-problem-konfrontiert-die-schicht-checkliste).
