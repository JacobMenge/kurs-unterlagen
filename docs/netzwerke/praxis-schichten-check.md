---
title: "Praxis: Der Schichten-Check"
description: "Erste Praxisübung im Netzwerk-Block (ca. 50 Minuten): Nimm deinen eigenen Rechner mit Bordmitteln auseinander und ordne jeden Messwert und jeden Befehl der richtigen OSI-Schicht zu. Vier Stationen – Netz-Steckbrief, Befehle in Aktion, Störungen einsortieren und Wege vergleichen. Ohne Installation, für Windows, macOS und Linux."
---

# Praxis: Der Schichten-Check

<span class='badge badge-praxis'>Praxis</span> &nbsp; Das Schichtenmodell kennst du aus der Ausbildung. Die Frage ist, ob du es im Ernstfall auch **benutzt** – oder ob du wie alle anderen anfängst, Dinge auszuprobieren. Genau das trennt diese Übung.

!!! info "Auf einen Blick"
    - **Dauer:** ca. 50 Minuten. Station 1 und 2 gehen schnell, Station 3 ist der Kern.
    - **Gruppen:** 3–4 Personen. Eine Person teilt den Bildschirm, alle tippen bei sich mit.
    - **Material:** dein eigener Rechner. **Keine Installation nötig** – alles sind Bordmittel.
    - **Voraussetzung:** keine. Wer auffrischen will: [Grundbegriffe](grundbegriffe.md) und [OSI- und TCP/IP-Modell](osi-und-tcp-ip-modell.md).
    - **Ergebnis:** ein ausgefüllter Netz-Steckbrief und eine Zuordnung „Befehl → Schicht", die dich den ganzen Kurs über begleitet.

---

## Worum es geht

Fast jeder kann die sieben Schichten aufsagen. Deutlich weniger benutzen sie, wenn es klemmt – dann wird der Browser neu gestartet, das WLAN aus- und eingeschaltet und der Kollege gefragt. Das Schichtenmodell ist im Betrieb kein Lernstoff, sondern ein **Suchraster**: Wer weiß, auf welcher Schicht das Problem sitzt, ist in zwei Minuten fertig statt in einer Stunde.

Die ersten beiden Stationen gehen deshalb zügig – sie stellen nur sicher, dass alle dieselben Werte vor Augen haben. **Das eigentliche Stück Arbeit ist Station 3.** Dort geht es nicht mehr um Befehle, sondern um die Frage, wie du systematisch von einem Symptom auf die Ursache kommst.

!!! tip "Spielregel"
    Tipp jeden Befehl **selbst** und lies die Ausgabe, bevor du die Auflösung aufklappst. Deine Werte sehen anders aus als die Beispiele hier – das ist genau richtig, denn es ist dein Netz.

---

## Vorbereitung: das richtige Fenster öffnen

=== "Windows"
    Öffne die **PowerShell**: Startmenü → `PowerShell` tippen → Enter.

    Nimm nicht die alte Eingabeaufforderung (`cmd`). Die klassischen Befehle laufen dort zwar auch, aber `Test-NetConnection` aus Station 2 gibt es **nur** in der PowerShell.

=== "macOS"
    Öffne das **Terminal**: `⌘ + Leertaste` → `Terminal` → Enter.

=== "Linux"
    Öffne ein **Terminal**: meist `Strg + Alt + T`.

Du brauchst **keine Administratorrechte**. Alle Befehle in dieser Übung lesen nur, sie verändern nichts an deinem System.

---

## Station 1 – Dein Netz-Steckbrief

**Zügig, etwa 8 Minuten.** Die Befehle kennst du. Es geht nicht ums Finden, sondern um die rechte Spalte der Tabelle: **Welcher Wert gehört zu welcher Schicht?** Dort geht es erfahrungsgemäß auseinander.

=== "Windows"
    ```powershell
    ipconfig /all
    ```

=== "macOS"
    ```bash
    ifconfig            # IP-Adresse und Subnetzmaske
    netstat -rn         # die Zeile "default" ist dein Gateway
    scutil --dns        # deine DNS-Server
    ```

=== "Linux"
    ```bash
    ip addr             # IP-Adresse und Subnetzmaske
    ip route            # die Zeile "default via ..." ist dein Gateway
    resolvectl status   # deine DNS-Server (oder: cat /etc/resolv.conf)
    ```

!!! warning "Achtung: der richtige Adapter"
    Ein moderner Rechner hat selten nur **eine** Netzwerkkarte. Typisch sind WLAN und Ethernet, dazu virtuelle Adapter von VirtualBox, VMware, Hyper-V oder einem VPN. **Dein aktiver Adapter ist der, bei dem ein Standardgateway eingetragen ist.** Alles andere ignorierst du.

### Trag deine Werte ein

| Wert | dein Ergebnis | welche Schicht? |
|---|---|---|
| IPv4-Adresse | | |
| Subnetzmaske (auch als /xx) | | |
| Standardgateway | | |
| DNS-Server | | |
| Physische Adresse (MAC) | | |
| DHCP aktiviert? | ja / nein | |

??? success "Beispiel-Ausgabe (Windows, gekürzt)"
    ```text
    Ethernet-Adapter Ethernet:

       Physische Adresse . . . . . . . . : 10-FF-E0-63-60-6C
       DHCP aktiviert. . . . . . . . . . : Ja
       IPv4-Adresse  . . . . . . . . . . : 192.168.2.33(Bevorzugt)
       Subnetzmaske  . . . . . . . . . . : 255.255.255.0
       Standardgateway . . . . . . . . . : 192.168.2.1
       DHCP-Server . . . . . . . . . . . : 192.168.2.1
       DNS-Server  . . . . . . . . . . . : 192.168.2.1
    ```

    **Deutung:** Dieser Rechner hat die private Adresse `192.168.2.33` in einem /24-Netz. Sein Router `192.168.2.1` ist gleichzeitig Gateway, DHCP- und DNS-Server – im Heim- und kleinen Büronetz ist das der Normalfall.

??? tip "Auflösung: die Schichtzuordnung"
    | Wert | Schicht | Warum |
    |---|---|---|
    | IPv4-Adresse | **3** – Vermittlung | IP-Adressen sind das Adressschema von Layer 3. |
    | Subnetzmaske | **3** – Vermittlung | Sie sagt, welcher Teil der IP das Netz bezeichnet. |
    | Standardgateway | **3** – Vermittlung | Der Router, der zwischen Netzen vermittelt. |
    | DNS-Server | **7** – Anwendung | DNS ist ein Dienst, kein Adressschema. |
    | MAC-Adresse | **2** – Sicherung | Die Adresse, mit der im lokalen Netz zugestellt wird. |
    | DHCP | **7** – Anwendung | Auch DHCP ist ein Dienst, der Layer-3-Werte verteilt. |

    Der Punkt dahinter: Auf einem einzigen Bildschirm siehst du gleichzeitig Werte aus drei verschiedenen Schichten. Sie stehen untereinander, gehören aber in völlig unterschiedliche Ebenen des Modells.

!!! question "Diskutiert in der Gruppe"
    Haben alle in eurer Gruppe eine Adresse, die mit `192.168.` beginnt? Wenn ja: Wieso ist das kein Zufall – und wieso ist das kein Problem, obwohl ihr alle dieselbe Adresse haben könntet?

---

## Station 2 – Die Schichten in Aktion

**Etwa 12 Minuten.** Auch diese Befehle sind dir vertraut. Die Frage ist eine andere: **Was genau beweist ein erfolgreicher Befehl – und was beweist er ausdrücklich nicht?**

=== "Windows"
    ```powershell
    ping 192.168.2.1                          # eure eigene Gateway-Adresse einsetzen
    arp -a
    nslookup github.com
    tracert github.com
    Test-NetConnection github.com -Port 443
    ```

=== "macOS / Linux"
    ```bash
    ping -c 4 192.168.2.1        # eure eigene Gateway-Adresse einsetzen
    arp -a                       # Linux auch: ip neigh
    nslookup github.com          # oder: dig github.com
    traceroute github.com
    nc -vz github.com 443
    ```

!!! tip "Wenn tracert ewig läuft"
    Viele Router antworten nicht auf die Anfragen und laufen als `* * *` durch. Die ersten fünf Zeilen reichen völlig – brich danach mit `Strg + C` ab.

### Trag deine Zuordnung ein

| Befehl | welche Schicht? | woran erkennst du das? |
|---|---|---|
| `ping <Gateway>` | | |
| `arp -a` | | |
| `nslookup github.com` | | |
| `tracert github.com` | | |
| `Test-NetConnection … -Port 443` | | |

??? tip "Auflösung"
    | Befehl | Schicht | Was er wirklich beweist |
    |---|---|---|
    | `ping` | **3** – Vermittlung | Ein IP-Paket kommt hin und zurück. Sagt nichts darüber, ob ein Dienst läuft. |
    | `arp -a` | **2** – Sicherung | Die Tabelle „welche IP gehört zu welcher MAC" – nur für das **lokale** Netz. |
    | `nslookup` | **7** – Anwendung | Ein Dienst wird gefragt und liefert eine Layer-3-Adresse zurück. |
    | `tracert` | **3** – Vermittlung | Der **Weg** über die Router: jede Zeile ist ein Hop, also ein Layer-3-Gerät. |
    | `Test-NetConnection` | **4** – Transport | Ein TCP-Verbindungsaufbau auf einen **Port**. Ports gibt es erst auf Layer 4. |

    **Die entscheidende Beobachtung:** `ping` erfolgreich und `Test-NetConnection` fehlgeschlagen ist ein völlig normales Ergebnis. Der Rechner ist erreichbar (Schicht 3 in Ordnung), aber der Dienst auf dem Port antwortet nicht (Schicht 4 oder 7 gestört). Genau diese Unterscheidung ist der Grund, warum das Schichtenmodell im Betrieb überhaupt etwas taugt.

??? question "Zusatzfrage für Schnelle"
    Führe `arp -a` aus und suche die MAC deines Gateways. Ruf dann irgendeine Webseite auf und schau erneut. Warum taucht die MAC-Adresse von GitHub **nicht** in deiner ARP-Tabelle auf, obwohl du gerade mit dem Server gesprochen hast?

    **Antwort:** ARP funktioniert nur im lokalen Netz. Für alles, was außerhalb liegt, trägt dein Rechner als Ziel-MAC immer die MAC des **Gateways** ein – die Ziel-IP zeigt auf GitHub, die Ziel-MAC auf den nächsten Hop. Adresse des Endziels und Adresse des nächsten Schritts liegen auf verschiedenen Schichten.

---

## Station 3 – Fünf Störungen einsortieren

**Der Kern der Übung, etwa 20 Minuten.** Zu jedem Fall drei Antworten: **Welche Schicht ist betroffen? Mit welchem Befehl weist du es nach? Und was ist die wahrscheinlichste Ursache dahinter?**

Diskutiert die Fälle in der Gruppe aus. Bei mindestens zweien davon ist die naheliegende Antwort nicht die vollständige.

| # | Störungsmeldung | Schicht | Nachweis |
|---:|---|---|---|
| 1 | Das Netzwerksymbol zeigt ein rotes Kreuz, es steckt kein Kabel. | | |
| 2 | Der Rechner hat die Adresse `169.254.12.7` und erreicht nichts. | | |
| 3 | `ping 8.8.8.8` funktioniert, `ping google.de` bringt einen Fehler. | | |
| 4 | Der Server antwortet auf `ping`, aber die Webseite lädt nicht. | | |
| 5 | Alles ist erreichbar, aber quälend langsam. | | |

??? tip "Auflösung"
    **1 – Kein Kabel: Schicht 1 (physisch).**
    Ohne Signal auf der Leitung hilft keine Konfiguration. `ipconfig` zeigt beim Adapter „Medium getrennt". Der Klassiker, den man gerade deshalb zuerst prüft, weil er so banal wirkt.

    **2 – `169.254.x.x`: Schicht 3, verursacht durch einen fehlenden Dienst.**
    Dieser Bereich heißt **APIPA** und ist die Notadresse, die ein Rechner sich selbst gibt, wenn er **keinen DHCP-Server erreicht**. Die Adresse ist damit nicht die Krankheit, sondern das Symptom. Nachweis: `ipconfig /all` zeigt keinen DHCP-Server; `ping` auf das Gateway schlägt fehl. Ursache kann auch auf Schicht 1 oder 2 liegen – deshalb prüft man von unten nach oben.

    **3 – Nur Namen gehen nicht: Schicht 7 (DNS).**
    Die IP-Verbindung steht (Schicht 3 in Ordnung), nur die Namensauflösung scheitert. Nachweis: `nslookup google.de` schlägt fehl, `ping 8.8.8.8` klappt. Das ist der häufigste Fehler mit dem irreführendsten Symptom – die Anwender melden „Internet ist weg".

    **4 – `ping` ja, Webseite nein: Schicht 4 oder 7.**
    Der Rechner lebt, der Dienst nicht. Nachweis: `Test-NetConnection <server> -Port 443` beziehungsweise `nc -vz <server> 443`. Antwortet der Port nicht, ist entweder der Dienst gestoppt oder eine Firewall blockiert – das unterscheidest du erst im nächsten Schritt.

    **5 – Alles langsam: kein Ausfall, sondern eine Leistungsfrage.**
    Hier gibt es keine Schicht, die „nicht antwortet". Schau in die `ping`-Ausgabe: Ist die **Zeit** hoch (Latenz) oder gehen **Pakete verloren**? Hohe Latenz bei null Verlust deutet auf lange Wege, Paketverlust auf ein überlastetes oder gestörtes Glied. Und sehr oft ist gar nicht das Netz schuld, sondern eine wartende Anwendung oder ein überlasteter Server.

!!! abstract "Das Vorgehen dahinter"
    **Von unten nach oben prüfen. Die erste Schicht, die nicht antwortet, ist die Ursache.**

    Kabel → Adresse → Weg → Port → Dienst. Wer stattdessen oben anfängt und erst mal den Browser neu startet, verliert Zeit – und weiß hinterher nicht, warum es wieder läuft. Systematisch von unten heißt: Du kannst den Fehler auch beim zweiten Mal finden.

---

## Station 4 – Die Kür: Wege vergleichen

**Für alle, die früh fertig sind.** Bis hierher hat jeder für sich gemessen. Jetzt legt ihr eure Ergebnisse nebeneinander.

Jeder in der Gruppe führt denselben Befehl aus und teilt die ersten fünf Zeilen:

=== "Windows"
    ```powershell
    tracert github.com
    ```

=== "macOS / Linux"
    ```bash
    traceroute github.com
    ```

Dann vergleicht ihr:

- **Ab welchem Punkt sehen eure Wege gleich aus?** Und wo unterscheiden sie sich?
- **Welche Zeilen gehören noch zu eurem eigenen Netz**, welche schon zu eurem Anbieter?
- **Warum beginnt der erste Hop bei fast allen mit `192.168`** – und beim übernächsten nicht mehr?

??? tip "Was ihr dabei seht"
    Es gibt **nicht den einen Weg** ins Internet. Jeder von euch startet in seinem eigenen lokalen Netz, geht über seinen eigenen Anbieter und trifft die anderen erst irgendwo weiter draußen – dort, wo die großen Netze zusammenlaufen.

    Der erste Hop ist immer euer eigener Router, deshalb die private Adresse. Ab dem zweiten Hop seid ihr im Netz eures Anbieters und die Adressen werden öffentlich. Und je weiter es geht, desto ähnlicher werden eure Wege, weil am Ziel alle durch dieselbe Tür müssen.

    Genau das ist die Maschen-Topologie aus der Theorie – nur eben als echte Messung statt als Zeichnung an der Tafel.

---

## Was du mitnimmst

- Du hast **an einer echten Maschine** gesehen, dass Werte aus drei Schichten nebeneinander auf einem Bildschirm stehen.
- Du hast einen **Werkzeugkasten** mit fünf Befehlen, von denen jeder eine andere Schicht prüft. Diese fünf begleiten dich durch den ganzen Kurs – auch bei Containern, virtuellen Maschinen und in der Cloud.
- Du kennst das **Diagnoseprinzip**: von unten nach oben, die erste stumme Schicht ist die Ursache.
- Du hast den Unterschied zwischen **„erreichbar"** und **„funktioniert"** verstanden – der Unterschied zwischen Schicht 3 und Schicht 7.

!!! tip "Nicht fertig geworden?"
    Kein Problem. Arbeite die fehlenden Stationen in Ruhe nach – gerade Station 3 lohnt sich, weil dieses Vorgehen im ganzen weiteren Kurs wiederkommt.

---

## Weiterlesen

- [Adressierung (MAC, IPv4, IPv6, Subnetting)](adressierung.md) – als Nächstes dran: was hinter deiner Subnetzmaske steckt
- [Routing und Switching](routing-und-switching.md) – warum `tracert` überhaupt mehrere Zeilen ausgibt
- [DNS – Namensauflösung](dns.md) – die ganze Geschichte hinter Störung 3
- [Praxis: Netzwerk-Werkstatt](praxis-netzwerk-werkstatt.md) – die große Version dieser Übung, mit sechs Stationen
