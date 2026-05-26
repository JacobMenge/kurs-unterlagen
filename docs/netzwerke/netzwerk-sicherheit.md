---
title: "Netzwerk-Sicherheit: Firewall, IDS/IPS, Zero Trust"
description: "Die Grundlagen der Netzwerk-Sicherheit: Firewall-Typen, Intrusion Detection und Prevention, NAT als 'Beifang-Schutz', Defense in Depth, Zero Trust und typische Angriffe und Schutzmaßnahmen."
---

# Netzwerk-Sicherheit: Firewall, IDS/IPS, Zero Trust

Ein Netzwerk ohne Sicherheits-Konzept ist eine Tür, die jeder aufmachen kann. **Sicherheit** ist deshalb kein Anhängsel, sondern eine **Querschnittsdisziplin**, die in jedem anderen Teil dieses Blocks mitschwingt. Diese Seite gibt dir die wichtigsten Konzepte, mit denen du Netze gegen Angriffe schützt.

Wichtig: das hier ist eine **Übersicht**, keine vollständige Sicherheits-Schulung. Wer als Sicherheits-Spezialist arbeiten will, geht später in den eigenen Block **„IT-Sicherheit"** rein. Hier lernst du, was du als Systemintegrator über **Netzwerk-Sicherheit** wissen musst.

!!! abstract "Lernziel"
    Nach dieser Seite kannst du:

    - die **drei Säulen der IT-Sicherheit** (CIA – Confidentiality, Integrity, Availability) benennen
    - **Firewall-Typen** (Paketfilter, Stateful, Application, NGFW) unterscheiden
    - die Unterschiede zwischen **IDS** und **IPS** erklären
    - das Konzept **Defense in Depth** in eigenen Worten beschreiben
    - **Zero Trust** als modernes Sicherheits-Modell einordnen
    - typische **Netzwerk-Angriffe** (Man-in-the-Middle, DDoS, ARP-Spoofing) benennen und die Schutzmaßnahmen kennen

---

## Die drei Säulen: CIA

In der IT-Sicherheit dreht sich alles um **drei Schutzziele**, abgekürzt als **CIA**:

| Säule | Bedeutung | Beispiel |
|-------|-----------|----------|
| **Confidentiality** | Vertraulichkeit | nur Berechtigte sehen die Daten |
| **Integrity** | Integrität | Daten werden nicht unbemerkt verändert |
| **Availability** | Verfügbarkeit | Daten sind, wenn sie gebraucht werden, da |

Wenn nur eine dieser Säulen fällt, ist der Schutz hinfällig. Sicherheit denkt deshalb immer in **allen drei** Dimensionen.

In der **OT-Welt** (Industrie) kommt eine vierte Säule dazu: **Safety** – der Schutz von **Personen**. Wenn eine Anlage Menschen gefährden kann, hat Safety oberste Priorität, noch vor Verfügbarkeit.

---

## Firewalls – die erste Verteidigungslinie

Eine **Firewall** entscheidet nach Regeln, **welcher Verkehr** ein Netz passieren darf. Die Regeln sind typischerweise eine Liste von Bedingungen:

```text
ERLAUBE:  von 192.168.1.0/24  zu  beliebig  Port 443 (HTTPS)
ERLAUBE:  von beliebig         zu  10.0.0.5  Port 22 (SSH) wenn aus 192.168.10.0/24
VERBIETE: von beliebig         zu  beliebig  Port 23 (Telnet)
VERBIETE: alles andere
```

Eine gute Firewall folgt dem **Default-Deny-Prinzip**: alles, was nicht explizit erlaubt ist, wird abgelehnt.

### Firewall-Typen nach Schicht

Wir haben sie schon in [Netzwerk-Hardware](netzwerk-hardware.md) gesehen. Hier nochmal vertieft:

#### Paketfilter (Layer 3/4)

Schaut nur die Header an: Quell-IP, Ziel-IP, Quell-Port, Ziel-Port, Protokoll.

- **Vorteile:** sehr schnell, kostengünstig
- **Nachteile:** keine Kontext-Information, kann z.B. nicht erkennen, ob eine TCP-Verbindung aktiv aufgebaut wurde

#### Stateful Firewall (Layer 3/4)

Wie Paketfilter, aber sie führt eine **Verbindungs-Tabelle**: „Diese TCP-Verbindung wurde von innen nach außen aufgebaut, daher dürfen Antworten zurückkommen."

- **Vorteile:** schützt vor vielen Angriffen, die Paketfilter durchlassen
- **Nachteile:** mehr Speicher- und CPU-Bedarf

**Heute Standard.** Praktisch jede Firewall, die du kaufen kannst, ist stateful.

#### Application-Layer Firewall (Layer 7) / WAF

Versteht den **Inhalt** der Protokolle – z.B. HTTP-Verkehr. Kann gezielt Angriffe wie **SQL-Injection** oder **Cross-Site-Scripting** erkennen.

- **Vorteile:** sehr feine Kontrolle, kann Anwendungs-spezifische Angriffe abfangen
- **Nachteile:** komplexer, langsamer, Regelpflege aufwändig

**Eine WAF** (Web Application Firewall) ist eine spezielle Application Firewall vor Web-Servern. Beispiele: **Cloudflare**, **AWS WAF**, **ModSecurity** vor Nginx oder Apache.

#### Next-Generation Firewall (NGFW)

Kombiniert alles oben **plus**:

- **Deep Packet Inspection (DPI)**: schaut auch den Nutzlast-Inhalt an
- **Intrusion Prevention** (siehe gleich)
- **TLS-Inspection**: bricht verschlüsselte Verbindungen auf, prüft, packt wieder ein
- **Bekannte Bedrohungs-Datenbank**: Signaturen von Malware
- **User-Identifikation**: nicht nur „IP X darf", sondern „User Anna darf"

Hersteller: **Palo Alto**, **Fortinet**, **Check Point**, **Cisco Firepower**, **Sophos XG**, **Sonicwall**.

### Wo Firewalls platziert werden

Eine durchdachte Architektur hat **mehrere Firewalls** an verschiedenen Stellen:

```mermaid
flowchart LR
  INET((Internet))
  FW1["Perimeter-Firewall"]
  DMZ["DMZ"]
  FW2["interne Firewall"]
  CORE["Core-Netz"]
  FW3["Server-Firewall"]
  SRV["Server-Segment"]
  
  INET --> FW1
  FW1 --> DMZ
  DMZ --> FW2
  FW2 --> CORE
  CORE --> FW3
  FW3 --> SRV
```

Pro Schicht ein Filter. Wer eine Schicht durchbricht, steht vor der nächsten. Das nennt sich **Defense in Depth** – mehr dazu gleich.

---

## IDS und IPS

Eine Firewall **erlaubt oder verbietet**. Sie merkt sich nicht, ob jemand **versucht hat anzugreifen**. Das machen **IDS** und **IPS**.

### IDS – Intrusion Detection System

**Erkennt Angriffe** und **alarmiert**. Es greift selbst **nicht ein**.

- läuft passiv (oft mit einem Mirror-Port am Switch, sieht den Verkehr nur, ohne zu beeinflussen)
- gibt Alarm, wenn verdächtige Muster auftreten
- die Konsequenz zieht ein **Security-Team** oder ein **SIEM** (Security Information and Event Management)

### IPS – Intrusion Prevention System

**Erkennt Angriffe** und **blockiert** sie.

- sitzt aktiv im Datenfluss
- kann Pakete verwerfen, Verbindungen abbrechen, IPs sperren
- ist Bestandteil moderner NGFWs

### Wie erkennen IDS/IPS Angriffe?

Zwei Hauptansätze:

| Ansatz | Wie es funktioniert | Stärke | Schwäche |
|--------|---------------------|--------|----------|
| **Signatur-basiert** | wie ein Virenscanner: bekannte Angriffsmuster werden erkannt | sehr zuverlässig bei bekannten Angriffen | erkennt keine **neuen** Angriffe (Zero-Days) |
| **Anomalie-basiert** | lernt „normales" Verhalten und erkennt Abweichungen | kann Zero-Days erkennen | viele **False Positives** (Fehlalarme) |

Moderne Systeme **kombinieren** beide Ansätze, oft erweitert um Machine Learning.

### Bekannte Open-Source-Lösungen

- **Snort** – der Klassiker, sehr verbreitet
- **Suricata** – modernerer Nachfolger, multi-threaded
- **Zeek** (früher Bro) – stärker auf Netzwerk-Analyse als auf reine Erkennung

---

## Defense in Depth – mehrere Schichten

Das **Defense-in-Depth-Prinzip** sagt: **vertraue nicht einer einzigen Schutzmaßnahme**. Baue **mehrere Schichten** auf, sodass jede die nächste schützt.

```mermaid
flowchart TB
  L1["Schicht 1: Physische Sicherheit<br/>(Türschloss, Kamera)"]
  L2["Schicht 2: Netzwerk-Perimeter<br/>(Firewall, IDS)"]
  L3["Schicht 3: Netzwerk-Segmentierung<br/>(VLAN, interne Firewall)"]
  L4["Schicht 4: Host-Sicherheit<br/>(OS-Updates, Antivirus)"]
  L5["Schicht 5: Anwendungs-Sicherheit<br/>(Authentifizierung, WAF)"]
  L6["Schicht 6: Daten-Sicherheit<br/>(Verschlüsselung, Backup)"]
  L1 --> L2 --> L3 --> L4 --> L5 --> L6
```

Wenn ein Angreifer Schicht 2 (Perimeter-Firewall) durchbricht, steht er noch vor Schicht 3 (Segmentierung). Schafft er die auch, vor Schicht 4 (Host-Härtung). Und so weiter. Bis er aufgibt oder gefasst wird.

!!! tip "Zwiebel-Analogie"
    Defense in Depth ist wie eine **Zwiebel**. Mehrere Schichten umhüllen den Kern. Wer in den Kern will, muss alle Schichten durchstoßen.

    Das ist anstrengender als nur ein einzelnes Schloss zu knacken – und genau das ist der Sinn.

---

## Zero Trust

Klassische Netzwerk-Sicherheit basiert auf der Idee einer **vertrauenswürdigen Innenwelt** und einer **bösen Außenwelt**. Das Problem: sobald jemand einmal drinnen ist (z.B. ein Mitarbeiter mit gestohlenen Zugangsdaten), kann er sich frei bewegen.

**Zero Trust** dreht die Logik um:

> **Niemand wird vertraut, nur weil er „drinnen" ist. Jede einzelne Verbindung muss sich beweisen.**

### Die Grundprinzipien

1. **Niemals vertrauen, immer prüfen.** Auch ein Server im selben Subnetz muss sich identifizieren.
2. **Least Privilege**: jeder bekommt nur die Rechte, die er wirklich braucht.
3. **Assume Breach**: gehe davon aus, dass Angreifer schon im Netz sind – plane entsprechend.
4. **Mikro-Segmentierung**: nicht „Office-Netz" und „Produktion", sondern feinere Gruppen.
5. **Identitätsbasierte Zugriffskontrolle**: nicht „IP X darf", sondern „User Anna mit Gerät Y und MFA darf".

### Wie das in der Praxis aussieht

- **Multi-Faktor-Authentifizierung (MFA)** überall
- **Single Sign-On (SSO)** mit zentraler Identitätsverwaltung
- **Kontinuierliche Verifikation**: ist das Gerät auf dem aktuellen Patch-Stand? Befindet es sich an einem unüblichen Ort?
- **Verschlüsselung überall**, nicht nur am Perimeter
- **detailliertes Logging** und Anomalie-Erkennung

### Bekannte Zero-Trust-Lösungen

- **Cloudflare Zero Trust**
- **Zscaler**
- **Google BeyondCorp**
- **Microsoft Azure AD Conditional Access**
- **Tailscale** (auf WireGuard-Basis)

Zero Trust ist **kein einzelnes Produkt**, sondern eine **Architektur-Philosophie**. Die Werkzeuge unterstützen, aber die eigentliche Arbeit ist organisatorisch.

---

## Typische Angriffe und Schutzmaßnahmen

Eine Auswahl der Klassiker, die du kennen solltest.

### Man-in-the-Middle (MITM)

Ein Angreifer setzt sich **zwischen** zwei Kommunikations-Partner und liest mit oder verändert die Daten.

**Beispiele:**

- offenes WLAN im Café: Angreifer betreibt einen falschen Access Point mit gleichem Namen
- **ARP-Spoofing** im LAN
- **DNS-Hijacking**: falsche Antworten leiten zu Phishing-Seiten

**Schutz:**

- **HTTPS** überall (verifiziert Server durch Zertifikate)
- **VPN** über unbekannte Netze
- **DNSSEC** für signierte DNS-Antworten
- in der Firma: **802.1X** (Netzwerk-Zugangskontrolle), **ARP Inspection** auf Switches

### DDoS – Distributed Denial of Service

Ein Angreifer überflutet ein Ziel mit so viel Traffic, dass es **nicht mehr antworten** kann.

**Varianten:**

- **Volumetrisch**: einfach massenhaft Pakete
- **Protocol Attacks**: nutzen Schwächen wie SYN-Flood
- **Application Layer**: gezielt teure HTTP-Anfragen

**Schutz:**

- **DDoS-Schutz-Dienste**: Cloudflare, AWS Shield, Akamai
- **Rate Limiting** auf Webservern
- **Anycast-Routing**: die Last verteilt sich auf viele Server weltweit

### ARP-Spoofing

Ein Angreifer im LAN antwortet auf ARP-Requests mit **seiner eigenen MAC** und gibt sich als Gateway aus. Allen Traffic, der eigentlich ans Internet sollte, fängt er ab.

**Schutz:**

- **Dynamic ARP Inspection (DAI)** auf Switches
- **statische ARP-Einträge** bei kritischen Geräten
- **Netzwerk-Zugangskontrolle (NAC, 802.1X)**

### DNS-Hijacking / DNS-Spoofing

Manipulation der DNS-Antworten, sodass `bank.de` plötzlich auf eine Phishing-Seite zeigt.

**Schutz:**

- **DNSSEC**
- **DoH / DoT** (verschlüsselte DNS-Anfragen)
- öffentliche Resolver mit guter Reputation nutzen (`1.1.1.1`, `9.9.9.9`)

### Port-Scanning

Ein Angreifer probiert systematisch durch, welche Ports auf einem Server offen sind, um Schwachstellen zu finden.

**Schutz:**

- **Firewall mit Default-Deny**
- **Fail2Ban** auf Linux-Servern: blockiert IPs mit auffälligem Verhalten
- **IPS** auf der Netzwerk-Ebene

### Brute-Force / Credential Stuffing

Wiederholtes Ausprobieren von Passwörtern.

**Schutz:**

- **Multi-Faktor-Authentifizierung (MFA)**
- **Account-Lockouts** nach mehreren Fehlversuchen
- **starke Passwörter erzwingen**
- **Fail2Ban** und Ähnliches

---

## Verschlüsselung – das Querschnitt-Thema

In modernen Netzen ist **Verschlüsselung der Standard**, nicht die Ausnahme:

| Verschlüsselungs-Lage | Beispiel |
|----------------------|----------|
| **In Transit** | HTTPS (TLS), SSH, VPN, IPsec |
| **At Rest** | Festplatten-Verschlüsselung (BitLocker, LUKS), verschlüsselte Datenbanken |
| **End-to-End** | Signal, ProtonMail – nur Sender und Empfänger können lesen |

**Wichtig zu wissen:**

- **TLS 1.2** und **TLS 1.3** sind aktuell sicher. Alles ältere (SSL 3.0, TLS 1.0, TLS 1.1) gilt als unsicher.
- **Selbstsignierte Zertifikate** sind technisch ok für interne Tests, **niemals** für öffentliche Dienste.
- **Verschlüsselte Verbindungen** schützen vor Mitlesern, nicht vor kompromittierten Endpunkten.

---

## NAC – Network Access Control

**Network Access Control** entscheidet, **wer überhaupt ans Netz darf**.

- **802.1X**: Authentifizierung am Switch-Port. Wer sich nicht ausweisen kann, kommt nicht ins Netz – oder nur in ein **Quarantäne-VLAN**.
- **MAC-Authentifizierung**: nur erlaubte MAC-Adressen kommen rein (schwächere Form).
- **Postur-Checks**: ist das Gerät auf aktuellem Patch-Stand? Läuft Antivirus? Erst dann Zugang.

In Firmen mit hohen Sicherheitsanforderungen Standard. Im Heim-Netz nicht üblich.

---

## Monitoring – ohne Sicht keine Sicherheit

Bevor wir zum SIEM kommen, ein kurzer Blick auf das **klassische Netzwerk-Monitoring**. Ohne aktive Überwachung kannst du weder Sicherheits-Vorfälle erkennen, noch Performance-Probleme rechtzeitig sehen.

### Was wird überwacht?

| Bereich | Beispiele |
|---------|-----------|
| **Verfügbarkeit** | Ist der Webserver erreichbar? Antwortet die Datenbank? Pingt der Router? |
| **Performance** | CPU-Auslastung, RAM, Bandbreite, Antwortzeiten |
| **Logs** | Was schreibt die Anwendung? Was sagt die Firewall? |
| **Sicherheits-Ereignisse** | Fehlgeschlagene Logins, Port-Scans, ungewöhnlicher Traffic |

### Wichtige Protokolle und Werkzeuge

| Werkzeug / Protokoll | Wofür |
|----------------------|-------|
| **SNMP** (Simple Network Management Protocol) | klassisches Abfrage-Protokoll für Switches, Router, Drucker – fragt: „Wie ist deine Auslastung? Sind alle Ports up?" |
| **ICMP / Ping** | einfachster Erreichbarkeits-Test |
| **Syslog** | standardisiertes Log-Sammel-Protokoll, oft auf Port 514 |
| **NetFlow / sFlow / IPFIX** | Verkehrs-Statistiken auf Router/Switch-Ebene |
| **Prometheus + Grafana** | moderner Open-Source-Stack für Metriken + Dashboards |
| **Zabbix, Nagios, Icinga** | etablierte Monitoring-Plattformen mit Alarmierung |
| **PRTG, SolarWinds** | kommerzielle Komplettpakete |
| **ELK / Loki** | Log-Aggregation und -Auswertung |

### Drei Reife-Stufen des Monitorings

1. **„Es funktioniert"** – jemand merkt, wenn etwas ausfällt, ruft an. Reaktiv, nicht skalierend.
2. **„Wir haben ein Dashboard"** – Werte sichtbar, jemand schaut regelmäßig drauf. Besser, aber abhängig vom Aufmerksamkeits-Niveau.
3. **„Wir haben Alarme + Eskalation"** – Schwellwerte definiert, automatische Benachrichtigung bei Verstoß, klare Eskalations-Wege. Das ist Profi-Niveau.

Die meisten Firmen sind in Stufe 2 unterwegs, das Ziel sollte Stufe 3 sein. Ohne Alarmierung ist das beste Dashboard wertlos, wenn niemand hinschaut.

### Was du als Berufsspezialist beachten musst

- **Was überwachst du?** Nicht alles – sondern das, was wirklich kritisch ist.
- **Wer wird benachrichtigt?** Klare Eskalations-Kette: erst Tagestechniker, dann Bereitschaft, dann Geschäftsführung.
- **Wie verhinderst du Alarm-Müdigkeit?** Sinnvolle Schwellwerte, keine Fehlalarme.
- **Wie sicherst du das Monitoring selbst?** Ein Monitoring-Server, der ausfällt, ist die schlimmste Stille.

---

## SIEM – das zentrale Auge

Ein **SIEM** (Security Information and Event Management) sammelt **Logs aus allen Systemen** an einer Stelle und korreliert sie:

- Firewall-Logs
- Server-Authentifizierungs-Logs
- IDS/IPS-Alarme
- DNS-Anfragen
- Anwendungs-Logs

Ein SIEM erkennt Muster, die in einzelnen Logs nicht auffallen würden. Beispiel: 100 fehlgeschlagene Logins von einer IP, dann ein erfolgreicher → **Brute-Force-Verdacht**.

**Bekannte SIEM-Lösungen:**

- **Splunk** (kommerziell, sehr verbreitet)
- **Elastic Stack** (ELK – Elasticsearch + Logstash + Kibana) – Open Source
- **Microsoft Sentinel** (Cloud-basiert)
- **Wazuh** – Open Source

---

## Was du jetzt wissen solltest

- IT-Sicherheit steht auf drei Säulen: **Confidentiality, Integrity, Availability** (CIA). In der OT kommt **Safety** dazu.
- **Firewalls** filtern nach Regeln; je nach Schicht: Paketfilter, Stateful, Application/WAF, NGFW.
- **IDS** erkennt nur, **IPS** erkennt und blockiert. Signatur-basiert + anomalie-basiert.
- **Defense in Depth**: mehrere Schichten statt einer einzigen Linie.
- **Zero Trust**: niemand wird vertraut, nur weil er „drinnen" ist – jede Verbindung muss sich beweisen.
- Klassische Angriffe: **MITM, DDoS, ARP-Spoofing, DNS-Hijacking, Port-Scanning, Brute-Force**. Jeder hat seine Schutzmaßnahmen.
- **Verschlüsselung** ist heute Standard, in transit und at rest.
- **NAC** entscheidet, wer überhaupt ans Netz darf. **SIEM** sammelt und korreliert alle Sicherheits-Logs.

---

## Beispielfragen zur Selbstkontrolle

??? question "Frage 1: Ein Mitarbeiter klickt auf einen Phishing-Link, sein Notebook wird kompromittiert. Wie verhindert eine gute Sicherheits-Architektur, dass der Angreifer sich im Firmennetz ausbreitet?"
    Mehrere Schichten zusammen:

    - **Netzwerk-Segmentierung (VLANs):** der PC sieht nur den Office-Bereich, nicht den Server-Raum
    - **Host-Firewalls auf Servern:** akzeptieren nur Verbindungen von explizit erlaubten Quellen
    - **Least Privilege:** der Account hat nur Rechte, die er wirklich braucht
    - **MFA für alle Anmeldungen:** das gestohlene Passwort allein reicht nicht
    - **IDS/IPS:** erkennt ungewöhnliches Verhalten (z.B. Port-Scans aus dem Office-VLAN)
    - **Zero-Trust:** auch Geräte im internen Netz müssen sich permanent ausweisen

    Genau das ist **Defense in Depth**. Eine einzelne Maßnahme reicht nicht.

??? question "Frage 2: Was unterscheidet eine Stateful Firewall von einer Application Firewall (WAF), und wann brauchst du welche?"
    - **Stateful Firewall (Layer 3/4):** filtert nach IP, Port und Verbindungs-Zustand. Sehr schnell, deckt 80 % aller Anwendungsfälle ab. Erste Verteidigungslinie.
    - **WAF (Layer 7):** versteht **HTTP-Verkehr** und kann Anwendungs-Angriffe wie SQL-Injection, XSS oder unerwartete API-Aufrufe erkennen und blockieren.

    Faustregel: **Stateful für alle**, **WAF zusätzlich vor öffentlich erreichbaren Webanwendungen**. Cloud-Anbieter haben WAFs als Service (AWS WAF, Cloudflare).

??? question "Frage 3: Du sollst ein ISMS für eine Firma einführen. Welche Standards und Bausteine sind die wichtigsten?"
    Zentrale Standards:

    - **ISO/IEC 27001** – internationaler Standard für Informationssicherheits-Management
    - **BSI-Grundschutz** – deutsche Variante mit konkreten Bausteinen und Maßnahmen
    - **NIS2-Richtlinie** – für kritische Infrastruktur in der EU

    Wichtige Bausteine eines ISMS:

    - **Risikomanagement** (Risiken identifizieren, bewerten, behandeln)
    - **Sicherheitsrichtlinien** (Passwörter, Zugriff, Datenschutz)
    - **Audits und Reviews** (interne und externe)
    - **Mitarbeiter-Schulung** (Awareness)
    - **Incident-Response-Plan** (was tun bei einem Vorfall)
    - **kontinuierliche Verbesserung** (PDCA-Zyklus)

??? question "Frage 4: Ein DDoS-Angriff legt eure Webseite lahm. Welche Maßnahmen helfen mittel- und langfristig?"
    Kurzfristig (während des Angriffs):

    - **DDoS-Schutz-Dienst** vorschalten (Cloudflare, AWS Shield, Akamai)
    - die angegriffenen IPs **blockieren**
    - Provider informieren, ggf. Anycast-Verteilung nutzen

    Mittel- und langfristig:

    - **dauerhafter DDoS-Schutz** als CDN-Service
    - **Rate Limiting** auf der Anwendungsebene
    - **Auto-Scaling** in der Cloud, damit Spitzen abgefangen werden
    - **Monitoring + Alarmierung**, damit Angriffe schneller erkannt werden
    - **Incident-Response-Plan**, wer was tut

    Wichtig: ein DDoS-Angriff lässt sich technisch nie ganz verhindern, aber **die Auswirkungen** lassen sich stark reduzieren.

---

## Merksatz

!!! success "Merksatz"
    > **CIA: Vertraulichkeit, Integrität, Verfügbarkeit. Firewall ist die erste Schicht, IDS/IPS überwacht den Verkehr. Defense in Depth statt einer Linie, Zero Trust statt blindem Vertrauen nach innen. Verschlüsselung überall, MFA für jeden Login. Sicherheit ist kein Produkt, sondern eine Architektur und Kultur.**

---

## Weiterlesen

- [Segmentierung und VPN](segmentierung-und-vpn.md): VLAN, DMZ und Tunneling sind Bausteine der Sicherheit
- [Industrie-Protokolle](industrie-protokolle.md): warum OT-Sicherheit eigene Regeln hat
- [DNS](dns.md): DNSSEC und DoT/DoH als Sicherheits-Erweiterungen
- [Anwendungs-Protokolle](anwendungs-protokolle.md): HTTPS, SSH, SPF/DKIM – die sicheren Versionen
