---
title: "Warum Netzwerke?"
description: "Warum jeder IT-Systemintegrator Netzwerkgrundlagen können muss: vom Browser-Tab über die Industrieanlage bis zum Backup über VPN. Mit konkretem Ablauf, was passiert, wenn du eine URL eintippst."
---

# Warum Netzwerke?

Du nutzt Netzwerke jeden Tag, ohne dass dir das auffällt. Eine Whatsapp-Nachricht, ein Youtube-Video, eine Google-Suche, der Anruf über das Mobilfunknetz, der elektronische Kontoauszug, der Online-Check-In beim Flughafen. Hinter all dem liegt **dieselbe Grund-Infrastruktur** – Geräte, die über kabelgebundene oder kabellose Verbindungen Daten miteinander austauschen, nach festgelegten Regeln.

In diesem Kapitel klären wir, **warum** du dich als IT-Systemintegrator mit Netzwerken auskennen musst und **was** dabei in deinem Alltag eigentlich passiert.

!!! abstract "Lernziel"
    Nach dieser Seite kannst du:

    - **drei konkrete Berufsalltag-Szenarien** benennen, in denen Netzwerkwissen entscheidend ist
    - Schritt für Schritt **erklären**, was passiert, wenn jemand eine URL in den Browser eintippt
    - den Unterschied zwischen **klassischer IT** und **industrieller Vernetzung** in einem Satz benennen
    - in eigenen Worten sagen, warum **Netzwerke** ein Querschnittsthema sind, das fast jeden anderen IT-Bereich berührt

---

## Was ein Netzwerk im Kern ist

Ein **Netzwerk** ist nichts anderes als **mehrere Geräte, die miteinander reden können**. Die Geräte können Computer sein, Smartphones, Drucker, Kühlschränke, Industrieroboter oder Sensoren – das spielt keine Rolle.

Was ein Netzwerk auszeichnet, ist:

- ein **gemeinsames Medium**: Kabel, Funk oder Glasfaser, über das Daten fliessen
- ein **gemeinsames Regelwerk**: Protokolle, an die sich alle Beteiligten halten
- **Adressen**, mit denen Geräte einander eindeutig ansprechen können
- **Pfade**, über die Daten ihr Ziel finden

Mehr braucht es nicht. Wenn diese vier Dinge da sind, hast du ein Netzwerk – egal ob es zwei verkabelte Computer in deinem Zimmer sind, oder das gesamte Internet mit Milliarden von Geräten.

!!! tip "Telefonnetz-Analogie"
    Stell dir das ganze Thema wie das Telefonnetz vor 50 Jahren vor. Jeder Anschluss hatte eine eindeutige **Nummer** (Adresse). Es gab **Vermittlungsstellen**, die die Verbindung weiterleiteten (Routing). Beide Seiten mussten dieselbe **Sprache** sprechen (Protokoll). Und es gab Kabel oder Funkstrecken als **Medium**.

    Wenn du verstehst, wie das Telefonnetz funktioniert hat, verstehst du auch Computer-Netzwerke. Die Begriffe sind anders, die Idee ist dieselbe.

---

## Drei typische Situationen aus dem Berufsalltag

Damit du ein Gefühl bekommst, warum Netzwerke ein Querschnittsthema sind: drei konkrete Szenarien, mit denen du als Systemintegrator zu tun haben wirst.

### Szenario 1: Eine neue Filiale wird angebunden

Eine Firma eröffnet eine neue Filiale. Dort soll alles funktionieren wie in der Zentrale: dieselben Programme, dieselben Drucker, derselbe E-Mail-Server, dieselben Backups.

**Was wird gebraucht?**

- ein **lokales Netzwerk** in der Filiale (Switches, Access Points, Router)
- eine **Anbindung an die Zentrale**, sicher und stabil – meistens ein **VPN** über das Internet
- **Adressplanung**: welche IP-Adressen bekommen die Geräte? Wie wird das Netz **segmentiert**, damit Kassen-Systeme nicht im selben Subnetz wie das WLAN für Kunden hängen?
- **Firewall-Regeln**: wer darf was erreichen?
- **DNS-Einträge**: damit die Server in der Filiale unter denselben Namen wie in der Zentrale erreichbar sind

Ohne Netzwerk-Wissen bist du hier komplett aufgeschmissen.

### Szenario 2: Eine Industrieanlage wird ans MES angebunden

Eine Produktionshalle hat fünf Maschinen, die bisher nur lokal ihre Daten anzeigen. Jetzt sollen die Maschinendaten in Echtzeit ins **MES** (Manufacturing Execution System) wandern, damit die Produktion zentral überwacht werden kann.

**Was wird gebraucht?**

- die Maschinen sprechen wahrscheinlich **Profinet** oder **OPC UA**, nicht HTTP wie ein Web-Server
- es muss ein **getrenntes Produktions-Netz** geben, damit Office-Traffic die Maschinen nicht stört
- für die **Daten-Sammlung** ist oft **MQTT** das richtige Protokoll
- die Maschinen müssen **adressierbar** sein, brauchen also IP-Adressen
- es muss **Diagnose- und Monitoring-Tools** geben, die das alles im Blick halten

Auch hier: ohne Netzwerk-Wissen geht nichts. Industrielles Netzwerk-Wissen ist ein eigener Bereich, der sich in mancher Hinsicht von klassischer IT unterscheidet.

### Szenario 3: Ein Server wird in die Cloud umgezogen

Ein klassischer **On-Premise-Server** (also einer im eigenen Rechenzentrum) soll in die **Cloud** wandern – zum Beispiel zu Azure, AWS oder Hetzner. Vorher war er einfach per Kabel im Firmennetz. Jetzt steht er irgendwo bei einem Cloud-Anbieter.

**Was wird gebraucht?**

- ein **sicherer Tunnel** zwischen Firma und Cloud, meistens ein **Site-to-Site-VPN**
- eine sinnvolle **Adressplanung**: die Cloud-Netze dürfen sich nicht mit den lokalen überschneiden
- **Firewall-Regeln**, die genau steuern, wer was erreichen darf
- **DNS-Einträge**, die sicherstellen, dass interne Namen auch in der Cloud auflösen
- **Latenz-Überlegungen**: was vorher per LAN in einer Millisekunde lief, braucht jetzt über das Internet vielleicht 30 Millisekunden

Auch hier ist Netzwerkwissen der **harte Kern** der Migration.

---

## Drei Cloud-Modelle, die du kennen musst

Wenn dein Auftraggeber sagt „wir gehen in die Cloud", reicht das als Information nicht. Die nächste Frage ist immer: **welche Cloud-Art?** Drei Modelle sind heute Standard.

### Public vs. Private vs. Hybrid Cloud

| Modell | Wer betreibt die Hardware? | Wer nutzt sie? | Typisches Beispiel |
|--------|---------------------------|----------------|--------------------|
| **Public Cloud** | großer Anbieter (AWS, Azure, Google) | viele Kunden teilen sich dieselbe physische Infrastruktur, logisch getrennt | klassische Web-Anwendung in der AWS |
| **Private Cloud** | das Unternehmen selbst oder ein dedizierter Dienstleister | nur die eigene Organisation | Banken, Behörden, Krankenhäuser, kritische Industrie |
| **Hybrid Cloud** | Mischung aus beidem | Teile in der Public Cloud, sensible Teile im eigenen Rechenzentrum | typische Firma: SAP intern, Web-Shop in der Cloud |

**Hybrid ist der Normalfall** in deutschen Unternehmen – fast niemand macht „alles in der Public Cloud" oder „alles selbst". Genau diese Kombination zu planen, ist eine der Kernaufgaben in der Systemintegration.

### Die drei Service-Modelle: IaaS, PaaS, SaaS

Eine zweite Dimension – **was genau** vom Anbieter kommt:

| Modell | Was du bekommst | Was du selbst machst | Beispiel |
|--------|----------------|--------------------|----------|
| **IaaS** (Infrastructure as a Service) | virtuelle Server, Netzwerk, Speicher | Betriebssystem, alle Software, Konfiguration | AWS EC2, Azure VM, Hetzner Cloud |
| **PaaS** (Platform as a Service) | komplette Laufzeitumgebung (Datenbank, App-Server) | nur deine Anwendung | Heroku, Azure App Service, Google App Engine |
| **SaaS** (Software as a Service) | fertige Anwendung, im Browser nutzbar | nur Daten und Nutzer | Microsoft 365, Salesforce, Slack |

!!! tip "Eselsbrücke"
    Von **IaaS** zu **SaaS** nimmt die **Verantwortung des Kunden ab** – und die Bequemlichkeit zu. Wer flexibel und kontrollierend bleiben will, nimmt **IaaS**. Wer nur „nutzen" will, nimmt **SaaS**.

### Was das fürs Netzwerk bedeutet

- **Public Cloud:** das Firmennetz endet an deinem Provider-Anschluss, die Cloud ist eine **separate Welt**, verbunden über VPN, dediziertes Direct Connect oder die öffentliche Internet-API.
- **Private Cloud:** das ist im Kern dein eigenes Rechenzentrum, nur „cloud-ähnlich" automatisiert (z.B. mit OpenStack oder VMware vCloud).
- **Hybrid:** du brauchst eine sehr klare **Adress- und Routing-Planung**, damit beide Welten konsistent bleiben.

Praktisch: jedes Mal, wenn du eine Anwendung in die Public Cloud bringst, fragst du dich:

- Wie kommt der Verkehr **sicher** hin? (VPN, Direct Connect, Private Link)
- Wer darf **was erreichen**? (Firewall-Regeln, Security Groups)
- Welche **Latenz** ist akzeptabel? (Standort der Cloud-Region wählen)
- Was passiert, wenn der **Provider Ärger hat**? (Multi-Region-Strategie, Backup-Pläne)

Genau diese Fragen sind der Kern der Cloud-Integration.

---

## Was passiert, wenn du eine URL eintippst?

Eine kleine Übung im Kopf. Du tippst `https://github.com` in den Browser. Was passiert, bis die Seite erscheint? Hier die **stark vereinfachte** Variante – am Ende des Blocks kennst du jede Station im Detail.

```mermaid
flowchart LR
  YOU(["Du tippst URL ein"]) --> DNS["1. DNS-Anfrage<br/>github.com → IP"]
  DNS --> ARP["2. ARP / Routing<br/>welchen Weg nehmen?"]
  ARP --> TCP["3. TCP-Verbindung<br/>(3-Way-Handshake)"]
  TCP --> TLS["4. TLS-Aushandlung<br/>(Verschlüsselung)"]
  TLS --> HTTP["5. HTTP-Request<br/>GET /"]
  HTTP --> RESPONSE["6. HTTP-Response<br/>HTML, CSS, JS, Bilder"]
  RESPONSE --> RENDER(["Browser zeigt Seite"])
```

Im Detail (du musst noch nichts davon verstehen, das kommt alles in den nächsten Seiten):

1. **DNS-Anfrage:** Der Browser fragt: „Wo finde ich `github.com`?" Ein DNS-Server antwortet mit einer IP-Adresse (z.B. `140.82.121.4`).
2. **Routing:** Der Computer schaut nach: „Wie komme ich zu dieser IP?" Über seinen lokalen Router, dann über mehrere weitere Router im Internet, bis zum Zielnetz.
3. **TCP-Verbindung:** Der Browser baut eine zuverlässige Verbindung zum Server auf. Drei Pakete fliegen hin und her (SYN, SYN-ACK, ACK).
4. **TLS-Verschlüsselung:** Beide Seiten einigen sich auf Verschlüsselungsschlüssel, damit niemand zwischen den beiden mitlesen kann. Das `s` in `https://` steht dafür.
5. **HTTP-Request:** Der Browser sendet `GET /` an den Server. Der Server schaut, was er liefern soll.
6. **HTTP-Response:** Der Server schickt HTML, CSS, JavaScript und Bilder zurück. Der Browser baut daraus die fertige Seite zusammen.

**Schätzung:** Wie viele Pakete fliegen für eine durchschnittliche Webseite hin und her? Antwort: **mehrere Hundert bis Tausende**. Eine moderne Web-Seite lädt nicht eine Datei, sondern Dutzende von Komponenten parallel. Jede einzelne durchläuft die Schritte oben.

Und das alles passiert in **Sekundenbruchteilen** – im Idealfall.

---

## Klassische IT vs. Industrie-Vernetzung

Eines vorweg, weil es in der Praxis – und in der Prüfung – einen großen Raum einnimmt: **Industrie-Netzwerke ticken anders als Office-Netzwerke.** Beide nutzen IP, beide nutzen Kabel oder Funk. Aber die Anforderungen sind unterschiedlich.

| Aspekt | Klassische IT | Industrie-Vernetzung |
|--------|--------------|---------------------|
| **Wichtigster Faktor** | Datendurchsatz, Verfügbarkeit | Echtzeit, Determinismus |
| **Erwartete Lebensdauer einer Anlage** | 3–5 Jahre | 15–30 Jahre |
| **Typische Protokolle** | HTTP/HTTPS, TCP, SMTP | Profinet, OPC UA, Modbus, MQTT |
| **Patch-Zyklus** | wöchentlich/monatlich | sehr selten – jedes Update kann die Produktion stoppen |
| **Netzwerk-Topologie** | sternförmig, hierarchisch | oft Ring (höhere Ausfallsicherheit) |
| **Akzeptable Latenz** | im LAN < 1 ms; 50–200 ms erst Richtung Internet/Cloud | oft unter 1 ms gefordert |

Was das praktisch bedeutet: ein Systemintegrator, der nur Office-IT kann, ist in einer Industriehalle oft hilflos. Genauso umgekehrt – ein klassischer Automatisierungstechniker tut sich schwer mit modernen IT-Sicherheitsanforderungen. Du sollst **beide Welten** verstehen, damit du an der Schnittstelle arbeiten kannst.

---

## Querschnitt durch deine anderen Themen

Eine Übersicht, wo überall Netzwerkwissen reinspielt:

| Thema | Was du davon brauchst |
|-------|----------------------|
| **Virtualisierung** | Virtuelle Netzwerke (vSwitch), VLAN-Tagging in Hypervisor |
| **Container / Docker** | Bridge-Netzwerke, Container-Adressierung, Port-Mapping, DNS in Compose |
| **Kubernetes** | Service-Discovery, Cluster-IP, Load Balancer, Ingress |
| **CI/CD** | Pipelines pushen über das Netz, ziehen Images aus Registries |
| **Backup & Recovery** | Backup-Ziele über das Netz, Bandbreite plant man oder es dauert tagelang |
| **Monitoring** | SNMP, Prometheus-Scraping, Logs über syslog |
| **IT-Sicherheit** | Firewalls, IDS/IPS, VPNs, Zero-Trust-Architekturen |
| **Cloud** | Subnetze, Routing, VPC-Konfiguration |
| **IoT / Industrie** | MQTT, OPC UA, Produktionsnetze trennen |
| **Datenschutz** | DSGVO verlangt, dass Daten **dort bleiben, wo sie hingehören** – das ist ein Netzwerk-Thema |

Du siehst: Netzwerke sind nicht **ein** Block neben anderen. Sie sind das **Fundament**, auf dem du fast jeden anderen Block bauen wirst.

---

## Was Netzwerke **nicht** sind

Damit nichts schiefläuft, ein paar bewusste Abgrenzungen:

- **Kein Magic.** Wenn etwas „über das Netz" klappt, dann nur weil Software, Hardware und Konfiguration zusammenspielen. Wenn es nicht klappt, gibt es immer einen prüfbaren Grund.
- **Nicht das Internet.** Das **Internet** ist nur ein bestimmtes (sehr großes) Netzwerk – der Zusammenschluss vieler kleiner und mittlerer Netzwerke. Du kannst auch komplett ohne Internet ein eigenes Netzwerk aufbauen.
- **Nicht WLAN.** WLAN ist nur eine **Übertragungstechnik**, die in vielen Netzwerken benutzt wird. Ein Netzwerk kann komplett ohne WLAN auskommen.
- **Nicht statisch.** Adressen, Routen, DNS-Einträge ändern sich ständig. Was heute funktioniert, kann morgen nicht mehr funktionieren – ohne dass jemand „etwas kaputtgemacht" hat.

---

## Was uns auf den nächsten Seiten erwartet

```mermaid
flowchart LR
  HEUTE(["du jetzt"]) --> BEGR["Grundbegriffe<br/>(LAN, Topologien)"]
  BEGR --> MODELL["Schichtenmodelle<br/>(OSI, TCP/IP)"]
  MODELL --> ADRESS["Adressierung<br/>(MAC, IP, Subnetz)"]
  ADRESS --> WEGE["Wege finden<br/>(Routing, Switching)"]
  WEGE --> AUTO["Automatik im Hintergrund<br/>(DNS, DHCP)"]
  AUTO --> PROTO["Protokolle<br/>(TCP, UDP, HTTP, SSH)"]
  PROTO --> HW["Hardware<br/>(Switch, Router, Firewall)"]
  HW --> ARCH["Architektur<br/>(VLAN, VPN)"]
  ARCH --> IOT["Industrieprotokolle<br/>(OPC UA, MQTT)"]
  IOT --> SEC["Sicherheit<br/>(Firewall-Typen, IDS)"]
```

Reihenfolge wie immer: **erst verstehen, warum**, dann **wie der Aufbau aussieht**, dann **die einzelnen Bausteine**, am Schluss die **Architektur**.

---

## Was du jetzt wissen solltest

- Ein Netzwerk braucht: ein Medium, ein Regelwerk, Adressen und Pfade. Mehr nicht.
- Netzwerkwissen ist **Querschnitt** – fast jeder andere Block (Cloud, Sicherheit, Container, Industrie) baut darauf auf.
- Klassische Office-IT und Industrie-Vernetzung folgen unterschiedlichen Spielregeln. Du sollst beide kennen.
- Beim Aufrufen einer URL passieren mindestens **sechs Schritte** im Hintergrund – jeder davon ist ein eigenes Thema.
- Netzwerke sind weder das Internet noch WLAN noch Magie. Sie sind technische Systeme mit klaren Regeln.

---

## Beispielfragen zur Selbstkontrolle

Beantworte die Fragen erst für dich, schau dann in den Aufklapper.

??? question "Frage 1: Ein Kunde sagt 'wir wollen in die Cloud'. Welche drei Rückfragen stellst du als erstes?"
    Sinnvolle Rückfragen:

    1. **Welches Cloud-Modell?** Public, Private oder Hybrid? Davon hängen Datenschutz, Kosten und Verantwortung ab.
    2. **Welches Service-Modell?** Wollt ihr Server selbst betreiben (IaaS), eine Plattform nutzen (PaaS) oder gleich eine fertige Anwendung (SaaS)?
    3. **Was bleibt on-Premise?** Praktisch nie geht *alles* in die Cloud – kritische Daten, Backups oder Industrie-Steuerungen bleiben oft lokal.

    Optional zusätzlich: Welcher Anbieter (Azure, AWS, Google, Hetzner), welche Region (Datenschutz!) und welche Verbindungsart (VPN, Direct Connect)?

??? question "Frage 2: Warum ist Netzwerkwissen ein Querschnittsthema und kein Spezialgebiet?"
    Weil **jedes andere IT-Thema** Netzwerke voraussetzt: Container-Anwendungen, Cloud-Migrationen, Backup-Strategien, IT-Sicherheit, Monitoring, Industrie-Vernetzung. Wer Netzwerke nicht versteht, kann keinen der anderen Bereiche fundiert planen oder umsetzen.

??? question "Frage 3: Worin unterscheiden sich klassische Office-IT und Industrie-Vernetzung (OT) in den Werten am stärksten?"
    Office-IT priorisiert **Vertraulichkeit der Daten**. OT priorisiert **Verfügbarkeit der Anlagen und Safety der Personen**. Daraus folgen direkt:

    - andere Patch-Zyklen (OT viel seltener, weil Stillstand teuer)
    - andere Lebensdauern (OT 15–30 Jahre, IT 3–5)
    - andere Protokolle (OPC UA, Profinet statt HTTP)
    - andere akzeptable Latenzen (OT oft < 1 ms, Office-IT im LAN ähnlich niedrig, 50–200 ms erst Richtung Internet/Cloud)

??? question "Frage 4: Was wäre der Vorteil von SaaS gegenüber IaaS aus Sicht eines kleinen Mittelständlers?"
    Bei **SaaS** muss der Mittelständler weder Server, noch Betriebssystem, noch die Anwendung selbst betreiben – nur Daten und Nutzer pflegen. Das spart Personal und reduziert das Risiko von Fehlkonfigurationen. Nachteil: weniger Kontrolle über Daten und Verfügbarkeit, abhängig vom Anbieter.

    Bei **IaaS** bekommt er nur die virtuelle Hardware, alle Software inkl. Betriebssystem und Patches muss er selbst pflegen. Das ist flexibler, aber teurer im Betrieb.

---

## Merksatz

!!! success "Merksatz"
    > **Ein Netzwerk ist nur: Medium + Regelwerk + Adressen + Pfade. Wer das versteht, versteht alles davon – von der Heimat-Fritzbox bis zum globalen Internet, vom Office-LAN bis zur Industrieanlage. Netzwerkwissen ist nicht ein Spezialthema, es ist das Fundament.**

---

## Weiterlesen

- [Grundbegriffe](grundbegriffe.md): LAN, WAN, Topologien – die Vokabel-Basis
- [OSI- und TCP/IP-Modell](osi-und-tcp-ip-modell.md): wie wir Netzwerke gedanklich in Schichten zerlegen
