---
title: "Praxis: Der Schichten-Check"
description: "Praxisübung zum Einstieg in den Netzwerk-Block (ca. 55 Minuten): Nimm deinen eigenen Rechner mit Bordmitteln auseinander, ordne jeden Messwert und jeden Befehl einer Schicht zu und arbeite fünf Störungsfälle systematisch von unten nach oben ab. Befehle für Windows, macOS und Linux zum Kopieren."
---

# Praxis: Der Schichten-Check

<span class='badge badge-praxis'>Praxis</span> &nbsp; Das Schichtenmodell einmal an einer echten Maschine benutzen statt es aufzusagen: sechs Werte, fünf Befehle, fünf Störungen – jedes davon auf seine Schicht einsortiert. Dein eigener Rechner ist dabei das Labor.

!!! info "Auf einen Blick"
    - **Dauer:** ca. 55 Minuten. Station 1 und 2 gehen schnell, Station 3 ist der Kern.
    - **Gruppen:** 3–4 Personen. Eine Person teilt den Bildschirm, alle tippen bei sich mit.
    - **Material:** dein eigener Rechner. Keine Administratorrechte nötig.
    - **Systeme:** Windows, macOS und Linux sind überall getrennt aufgeführt. Nimm den Reiter für dein System.
    - **Festhalten:** Eure Antworten kommen ins gemeinsame Ergebnis-Dokument – den Link zeigt die Briefing-Folie. Die Tabellen hier auf der Seite sind die Vorlage dafür.
    - **Für die Auswertung:** Sprecher und zugeteilter Störungsfall stehen aus dem Briefing fest – bearbeitet trotzdem alle fünf Fälle.
    - **Ergebnis:** ein ausgefüllter Netz-Steckbrief und eine Zuordnung „Befehl → Schicht", die dich durch den ganzen Kurs trägt.

---

## Worum es geht

Im Betrieb ist das Schichtenmodell ein **Suchraster**. Es beantwortet die Frage, die zählt: Wo muss ich hinschauen? Wer sie beantworten kann, ist in zwei Minuten fertig. Wer sie umgeht, probiert eine Stunde herum – und weiß hinterher nicht, warum es wieder läuft.

Station 1 und 2 sind Aufwärmen. Die Befehle kennst du, es geht nur darum, dass alle dieselben Werte vor Augen haben. Die Arbeit steckt in **Station 3**: von einem Symptom auf die Ursache kommen, ohne zu raten.

!!! tip "Spielregel"
    Tipp jeden Befehl selbst und lies die Ausgabe, bevor du eine Auflösung aufklappst. Deine Werte sehen anders aus als die Beispiele hier. Das ist kein Fehler, das ist dein Netz.

---

## Vorbereitung

Windows: **PowerShell**, nicht die Eingabeaufforderung – `Test-NetConnection` aus Station 2 gibt es nur dort. macOS und Linux: dein übliches Terminal.

Alle Befehle hier lesen nur. Sie verändern nichts an deiner Konfiguration.

!!! warning "Zwei Dinge vorweg, die sonst Zeit kosten"
    **Der richtige Adapter.** Du hast fast sicher mehrere: WLAN, Ethernet, dazu virtuelle von VirtualBox, Hyper-V, WSL oder dem VPN. Maßgeblich ist der Adapter, über den die Standardroute läuft – der mit dem **Standardgateway**. Bei aktivem VPN ist das der VPN-Adapter, und dann sind deine Werte die des VPN. Auch das ist ein Befund.

    **ICMP wird oft gefiltert.** Auf Firmenlaptops, hinter VPN-Gateways und bei manchen Anbietern läuft `ping` ins Leere, obwohl das Ziel einwandfrei erreichbar ist. Wenn `ping` fehlschlägt, der Test auf Port 443 aber klappt: Das Ziel lebt, nur ICMP kommt nicht durch. Notier es und mach weiter.

---

## Station 1 – Dein Netz-Steckbrief

**Etwa 8 Minuten.** Die Befehle kennst du. Es geht um die rechte Spalte: Wohin gehört welcher Wert?

=== "Windows"
    ```powershell
    ipconfig /all
    ```

=== "macOS"
    ```bash
    route -n get default                       # welcher Adapter, welches Gateway
    ifconfig en0                               # inet, netmask (hexadezimal!), ether = MAC
    scutil --dns | grep nameserver             # DNS-Server
    ipconfig getoption en0 server_identifier   # DHCP-Server; leer = keine Lease ODER falscher Adapter
    ```

    `en0` ist meist das WLAN. `route -n get default` sagt dir in der Zeile `interface:`, welchen Adapter du wirklich nehmen musst – am Dongle ist es eben nicht `en0`. Gegenprobe bei leerer DHCP-Ausgabe: `ipconfig getpacket <adapter>`. Kommt dort auch nichts, gibt es wirklich keine Lease.

=== "Linux"
    ```bash
    ip -brief addr                    # Adapter, Status, IP mit Präfix
    ip route | grep default           # Gateway
    ip -brief link                    # MAC-Adressen
    resolvectl status                 # DNS-Server, Abschnitt des aktiven Links
    ip -4 addr show                   # steht dort "dynamic", läuft die Adresse auf einer Lease
    ```

    Finger weg von `cat /etc/resolv.conf`: Auf allem mit systemd-resolved steht dort nur `127.0.0.53`, der lokale Stub. Das ist nicht dein DNS-Server. Ohne systemd-resolved – etwa unter Alpine oder mit NetworkManager pur – ist `resolv.conf` dagegen die richtige Quelle, und `resolvectl` gibt es dann gar nicht.

    Zu `dynamic`: Das Flag heißt, die Adresse hat eine begrenzte Gültigkeit. Fast immer ist das DHCP, es kann aber auch IPv6-Autokonfiguration sein.

### Trag ein

Kopiert euch die Tabelle ins Ergebnis-Dokument und füllt sie dort aus – hier auf der Seite geht das nicht.

| Wert | dein Ergebnis | gehört zu Schicht |
|---|---|---|
| IPv4-Adresse | | |
| Subnetzmaske bzw. Präfix | | |
| Standardgateway | | |
| DNS-Server | | |
| Physische Adresse (MAC) | | |
| Per DHCP oder fest? | | |

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

    **Deutung:** Private Adresse in einem /24. Der Router `192.168.2.1` ist gleichzeitig Gateway, DHCP- und DNS-Server – im Heim- und kleinen Büronetz der Normalfall. Unter macOS steht die Maske hexadezimal da, `0xffffff00` ist dasselbe wie `255.255.255.0`.

??? tip "Auflösung"
    | Wert | Schicht | Warum |
    |---|---|---|
    | IPv4-Adresse | 3 | das Adressschema der Vermittlungsschicht |
    | Subnetzmaske / Präfix | 3 | trennt Netz- von Hostanteil |
    | Standardgateway | 3 | der Router, der zwischen Netzen vermittelt |
    | MAC-Adresse | 2 | damit wird im lokalen Netz zugestellt |
    | DNS-Server | 3 **und** 7 | der Eintrag selbst ist eine IP-Adresse, der Dienst dahinter sitzt auf 7 |
    | DHCP | 3 **und** 7 | verteilt Layer-3-Werte, ist aber selbst ein Anwendungsdienst über UDP |

    Eine einzige Bildschirmausgabe, drei verschiedene Schichten. `ipconfig` sortiert nach Adapter, nicht nach Modell – die Einordnung machst du selbst. Die beiden letzten Zeilen sind die interessanten. Wer nur „DNS ist Layer 7" sagt, übersieht, dass der Wert in der Konfiguration eine Adresse ist.

!!! question "Für die Gruppe"
    Haben alle bei euch eine Adresse aus `192.168.`? Warum ist das kein Zufall – und warum stört es nicht, dass mehrere von euch dieselbe Adresse haben können?

    Und noch eine: `ipconfig /all` zeigt auch IPv6, mindestens eine Adresse mit `fe80::`. Weiß jemand aus dem Kopf, wozu die gut ist?

---

## Station 2 – Die Schichten in Aktion

**Etwa 12 Minuten.** Auch diese Befehle sind dir vertraut. Die Frage ist eine andere: Was beweist ein erfolgreicher Befehl – und was beweist er ausdrücklich nicht?

=== "Windows"
    ```powershell
    ping 192.168.2.1                          # eigene Gateway-Adresse einsetzen
    arp -a
    nslookup github.com
    tracert -d github.com                     # -d spart die Rückwärtsauflösung, deutlich schneller
    Test-NetConnection github.com -Port 443
    ```

=== "macOS"
    ```bash
    ping -c 4 192.168.2.1        # eigene Gateway-Adresse einsetzen
    arp -a
    nslookup github.com          # oder: dig github.com
    traceroute -n github.com     # -n spart die Rückwärtsauflösung
    nc -vz github.com 443
    ```

=== "Linux"
    ```bash
    ping -c 4 192.168.2.1        # eigene Gateway-Adresse einsetzen
    ip neigh                     # die ARP-Tabelle; "arp -a" gibt es oft nicht mehr
    resolvectl query github.com  # oder: dig / nslookup, falls installiert
    tracepath -n github.com      # traceroute ist selten vorinstalliert
    nc -vz github.com 443
    ```

    Kein `nc` an Bord? Das hier geht mit jeder Bash, ohne Nachinstallieren:

    ```bash
    timeout 3 bash -c 'cat < /dev/null > /dev/tcp/github.com/443' && echo offen || echo zu
    ```

!!! tip "Wenn die Wegverfolgung ewig läuft"
    Sternchen sind normal, viele Router antworten schlicht nicht. Der eigentliche Zeitfresser ist die Rückwärtsauflösung jedes Hops – deshalb steht oben überall `-d` bzw. `-n`. Fünf Zeilen reichen, danach abbrechen mit ++ctrl+c++.

### Trag ein

| Befehl | prüft Schicht | woran erkennst du das? |
|---|---|---|
| `ping <Gateway>` | | |
| `arp -a` / `ip neigh` | | |
| `nslookup` / `resolvectl query` | | |
| `tracert` / `traceroute` / `tracepath` | | |
| `Test-NetConnection` / `nc -vz` | | |

??? tip "Auflösung"
    | Befehl | Schicht | Was er beweist – und was nicht |
    |---|---|---|
    | `ping` | 3 | Ein IP-Paket kommt hin und zurück. Sagt nichts darüber, ob dort ein Dienst läuft. Und ein Fehlschlag beweist keinen Ausfall, solange ICMP gefiltert sein kann. |
    | `arp -a` / `ip neigh` | 2, an der Naht zu 3 | Die Zuordnung IP zu MAC, ausschließlich für das lokale Netz. ARP steckt direkt im Ethernet-Frame mit eigenem EtherType und wird nicht geroutet, arbeitet aber mit Layer-3-Adressen. Deshalb findest du es in Büchern mal auf 2 und mal auf 3 – wichtig ist, dass du beide Begründungen kennst. |
    | `nslookup` | 7 | Ein Dienst wird gefragt und liefert eine Layer-3-Adresse zurück. |
    | `tracert` | 3 | Der Weg über die Router. Jede Zeile ist ein Hop, also ein Layer-3-Gerät. |
    | `Test-NetConnection` | 4 | Ein TCP-Verbindungsaufbau auf einen Port. Ports gibt es erst ab Schicht 4. Achtung: Der Befehl löst vorher den Namen auf – bei einem Fehlschlag lies genau, ob er über DNS oder über TCP gestolpert ist. |

    **Wichtig:** `ping` erfolgreich und der Porttest fehlgeschlagen ist kein Widerspruch, sondern der Normalfall. Der Rechner ist erreichbar, der Dienst auf dem Port nicht. Diese Unterscheidung – **erreichbar** gegen **funktioniert** – ist die halbe Miete im Betrieb.

??? question "Für alle, die schneller sind"
    Schau in die ARP-Tabelle und such die MAC deines Gateways. Ruf danach irgendeine Webseite auf und schau erneut. Warum taucht die MAC-Adresse von GitHub dort **nicht** auf, obwohl du gerade mit dem Server gesprochen hast?

    **Antwort:** ARP arbeitet nur im lokalen Netz. Für alles außerhalb trägt dein Rechner als Ziel-MAC die des **Gateways** ein – die Ziel-IP zeigt auf GitHub, die Ziel-MAC auf den nächsten Hop. Endziel und nächster Schritt liegen auf verschiedenen Schichten. Das ist der Grund, warum es beide Adressarten überhaupt gibt.

---

## Station 3 – Fünf Störungen einsortieren

**Der Kern, etwa 20 Minuten.** Zu jedem Fall drei Antworten: Welche Schicht ist betroffen? Mit welchem Befehl weist du es nach? Und was steckt wahrscheinlich dahinter?

Diskutiert die Fälle in der Gruppe aus. Bei mindestens zweien ist die naheliegende Antwort nicht die vollständige.

| # | Störungsmeldung | Schicht | Nachweis | Ursache dahinter |
|---:|---|---|---|---|
| 1 | Das Netzwerksymbol zeigt ein Kreuz, es steckt kein Kabel. | | | |
| 2 | Der Rechner hat die Adresse `169.254.12.7` und kommt nirgends hin. | | | |
| 3 | `ping 8.8.8.8` läuft, `ping google.de` bringt einen Fehler. | | | |
| 4 | Der Server antwortet auf `ping`, aber die Webseite lädt nicht. | | | |
| 5 | Alles ist erreichbar, aber quälend langsam. | | | |

??? tip "Auflösung"
    **1 – Kein Kabel: Schicht 1.**
    Ohne Signal auf der Leitung hilft keine Konfiguration. `ipconfig` meldet „Medium getrennt", unter Linux zeigt `ip -brief link` den Status `DOWN`. Der Klassiker, den man gerade deshalb zuerst prüft, weil er so banal wirkt.

    **2 – `169.254.x.x`: Symptom auf Schicht 3, Ursache woanders.**
    Das ist **APIPA**, die Notadresse, die sich ein Rechner selbst gibt, wenn keine DHCP-Antwort kommt. Die Adresse ist nicht die Krankheit, sondern das Fieber. Der DHCP-Server kann tot sein (Schicht 7), der Weg zum Relay unterbrochen (Schicht 3) oder das Kabel steckt nicht (Schicht 1). Nachweis: `ipconfig /all` zeigt keinen DHCP-Server, `ping` aufs Gateway schlägt fehl. **Dieser Fall ist der Grund, warum „von unten nach oben" nicht heißt „die erste stumme Schicht ist der Schuldige".**

    **3 – Nur Namen gehen nicht: Schicht 7, DNS.**
    Die IP-Verbindung steht, nur die Namensauflösung scheitert. Nachweis: `nslookup google.de` schlägt fehl, `ping 8.8.8.8` läuft. Der häufigste Fehler mit dem irreführendsten Symptom – gemeldet wird er als „Internet ist weg".

    **4 – `ping` ja, Webseite nein: Schicht 4 oder 7.**
    Der Rechner lebt, der Dienst nicht. Nachweis: `Test-NetConnection <server> -Port 443` bzw. `nc -vz <server> 443`. Antwortet der Port nicht, ist der Dienst gestoppt oder eine Firewall blockt. Antwortet er und die Seite lädt trotzdem nicht, bist du auf 7: Zertifikat abgelaufen, Anwendung im Fehler, falscher virtueller Host.

    **5 – Alles langsam: kein Ausfall, sondern eine Leistungsfrage.**
    Hier schweigt keine Schicht. Schau in die `ping`-Ausgabe: Ist die **Zeit** hoch, oder gehen **Pakete verloren**? Hohe Latenz bei null Verlust heißt: langer Weg – oder es steht etwas in der Warteschlange. Gegenprobe: `ping` im Leerlauf gegen `ping`, während jemand lädt. Paketverlust heißt überlastetes oder gestörtes Glied. Und sehr oft ist das Netz gar nicht schuld, sondern eine wartende Anwendung oder ein überlasteter Server.

!!! abstract "Das Vorgehen"
    **Von unten nach oben prüfen. Die unterste Schicht, die nicht antwortet, sagt dir, wo du weitersuchst – nicht zwingend, woran es liegt.**

    Kabel → Adresse → Weg → Port → Dienst. Fall 2 ist das Musterbeispiel: Das kaputte Ergebnis steht auf Schicht 3, der Grund dafür sitzt eine Etage höher oder zwei tiefer. Wer stattdessen oben anfängt und erst mal den Browser neu startet, findet den Fehler vielleicht auch – aber beim nächsten Mal nicht wieder.

---

## Station 4 – Die Kür: Wege vergleichen

**Der gemeinsame Abschluss, etwa 15 Minuten.** Bis hierher hat jeder für sich gemessen. Jetzt legt ihr eure Ergebnisse nebeneinander.

=== "Windows"
    ```powershell
    tracert -d github.com
    ```

=== "macOS"
    ```bash
    traceroute -n github.com
    ```

=== "Linux"
    ```bash
    tracepath -n github.com
    ```

Jeder teilt die ersten fünf bis acht Zeilen. Dann vergleicht ihr:

- Ab welchem Punkt sehen eure Wege gleich aus? Wo unterscheiden sie sich?
- Welche Zeilen gehören noch zu eurem eigenen Netz, welche schon zum Anbieter?
- Ab welchem Hop werden die Adressen öffentlich – und bei wem passiert das später als bei den anderen?

??? tip "Was ihr dabei seht"
    Es gibt nicht den einen Weg ins Internet. Jeder startet in seinem eigenen lokalen Netz, geht über seinen eigenen Anbieter und trifft die anderen erst weiter draußen, wo die großen Netze zusammenlaufen.

    Hop 1 ist immer dein eigener Router, daher die private Adresse. Wie schnell danach öffentliche Adressen auftauchen, ist sehr unterschiedlich: bei DSL meist ab Hop 2. Wer über Kabel oder Mobilfunk online ist, hängt oft hinter **CGNAT** und sieht dann einen oder zwei Hops mit Adressen aus `100.64.0.0/10` – manchmal auch nur Sternchen, weil die Geräte nicht antworten. Wer über ein VPN arbeitet, sieht zuerst den Weg zum VPN-Konzentrator. Diese Unterschiede sind das Interessante an der Übung.

    Ein Hinweis für den Vergleich: Windows misst mit ICMP, `traceroute` unter macOS und Linux standardmäßig mit UDP. Abweichende Wege können also auch daher kommen und nicht nur von eurem Anbieter.

---

## Was du mitnimmst

- Werte aus drei Schichten stehen auf einer einzigen Bildschirmausgabe nebeneinander. Sortieren musst du selbst.
- Fünf Befehle, von denen jeder eine andere Schicht prüft. Die begleiten dich durch den ganzen Kurs – bei Containern, virtuellen Maschinen und in der Cloud sind es dieselben.
- Der Unterschied zwischen **erreichbar** und **funktioniert**: Schicht 3 gegen Schicht 4 und 7.
- Das Diagnoseprinzip: von unten nach oben, und die unterste stumme Schicht ist der Anfang der Suche, nicht ihr Ende.

!!! tip "Nicht fertig geworden?"
    Kein Problem. Station 3 lohnt sich zum Nacharbeiten, das Vorgehen kommt im ganzen weiteren Kurs wieder.

---

## Weiterlesen

- [Adressierung (MAC, IPv4, IPv6, Subnetting)](adressierung.md) – als Nächstes dran: was hinter deiner Subnetzmaske steckt
- [Routing und Switching](routing-und-switching.md) – warum die Wegverfolgung überhaupt mehrere Zeilen ausgibt
- [DNS – Namensauflösung](dns.md) – die ganze Geschichte hinter Störung 3
- [Praxis: Netzwerk-Werkstatt](praxis-netzwerk-werkstatt.md) – die große Version dieser Übung, von Layer 1 bis Layer 7
