---
title: "Praxis: Euer erster Server bei AWS"
description: "In der AWS-Sandbox von Pluralsight einen eigenen Webserver starten, ihn stoppen und vergrößern, die Kosten im AWS-Preisrechner schätzen und am Ende alles wieder löschen."
---

# Praxis: Euer erster Server bei AWS

Die Voltrad GmbH überlegt, ihren Online-Konfigurator in die Cloud zu bringen.
Bevor die Geschäftsführung entscheidet, probiert ihr es aus: Ihr startet bei
AWS einen eigenen Server, bringt ihn ins Internet, verändert ihn im laufenden
Betrieb und rechnet aus, was er kosten würde. Am Ende räumt ihr alles wieder
ab, so wie es sich in einem echten Konto gehört.

!!! abstract "Ziel"
    Am Ende könnt ihr:

    - eine EC2-Instanz mit Betriebssystem, Größe, Firewall und Startskript selbst starten
    - erklären, welche Schichten ihr bei IaaS selbst betreibt und welche AWS
    - vertikal skalieren und begründen, warum sich dabei die öffentliche IP-Adresse ändert
    - Cloud-Kosten im AWS-Preisrechner schätzen und zwei Regionen vergleichen

    Für die Schnellen gibt es drei Bonus-Aufgaben vor dem Aufräumen.

!!! info "Heute läuft alles im Browser"
    Ihr braucht kein Terminal und müsst nichts installieren. Ihr braucht nur
    euren Zugang zu Pluralsight und einen Browser mit privatem Fenster.

## Womit ihr hier arbeitet

| Baustein | Was er tut |
|---|---|
| **Sandbox** | Ein echtes, leeres AWS-Konto für vier Stunden, gestartet über Pluralsight. Danach löscht Pluralsight alles darin. Für euch entstehen keine Kosten. |
| **Konsole** | Die Weboberfläche von AWS. Hier startet und verwaltet ihr alle Dienste. |
| **EC2-Instanz** | Ein virtueller Server bei AWS. EC2 steht für Elastic Compute Cloud. |
| **Sicherheitsgruppe** | Die Firewall vor eurer Instanz. Sie lässt nur die Ports durch, die ihr freigebt. |
| **Benutzerdaten** | Ein Skript, das die Instanz beim ersten Start einmal ausführt. Es installiert euren Webserver. |
| **AWS-Preisrechner** | Eine öffentliche Webseite von AWS, die Kosten schätzt, ohne Anmeldung. |

Für die Prüfung zählen die Servicemodelle IaaS, PaaS und SaaS, die
Bereitstellungsmodelle und die Elastizität. Im Beruf begegnet euch genau
dieser Ablauf ständig: Server in der Cloud starten, absichern, an den Bedarf
anpassen und Kosten im Blick behalten.

## Was ihr gleich baut

Jede Person startet ihre **eigene Sandbox** und darin ihren **eigenen Server**.
Im Breakout teilt eine Person den Bildschirm, alle machen mit und helfen sich
gegenseitig. Euer Server heißt `konfigurator-` und euer Vorname, zum Beispiel
`konfigurator-mia`. In allen Beispielen auf dieser Seite steht Mia.

!!! tip "Die Konsole spricht die Sprache eures Browsers"
    Ist euer Browser auf Deutsch eingestellt, zeigt die AWS-Konsole alles auf
    Deutsch. Diese Seite nennt die deutschen Bezeichnungen genau so, wie sie
    in der Konsole stehen. In Klammern folgen die englischen. Nur die
    Anmeldeseite von AWS und der Preisrechner in Teil 4 sind immer auf
    Englisch.

---

## Teil 1: Sandbox starten (10 Minuten)

**Was ihr hier tut:** Pluralsight leiht euch für vier Stunden ein echtes,
leeres AWS-Konto. Ihr startet es und meldet euch in der Konsole an, der
Weboberfläche von AWS.

1. Meldet euch bei Pluralsight an und öffnet die
   [Cloud Sandboxes](https://app.pluralsight.com/hands-on/playground/cloud-sandboxes).
   Von Hand kommt ihr so dorthin: links im Menü **Hands-on**, dann in der
   Kachel **Cloud Sandboxes** auf **Get Started**.
2. Klickt bei **AWS Sandbox** auf **Open Sandbox** und im Fenster, das
   aufgeht, auf **Start Sandbox**. Nach etwa 20 Sekunden erscheinen
   **Username** und **Password** und darüber die Zeile **Auto Shutdown** mit
   der Uhrzeit, zu der die Sandbox endet.
3. Klickt mit der **rechten Maustaste** auf **Open Sandbox** und öffnet den
   Link in einem **privaten Fenster**: in Edge „Link in InPrivate-Fenster
   öffnen", in Chrome „Link in Inkognitofenster öffnen".
4. Es erscheint die Anmeldeseite **IAM user sign in**. Die Kontonummer steht
   schon drin. Tragt bei **IAM username** `cloud_user` ein, kopiert das
   **Password** aus Pluralsight mit dem Kopiersymbol hinein und klickt auf
   **Sign in**.
5. Prüft oben rechts die Region. Dort muss **USA (Nord-Virginia)** stehen, das
   ist die Region mit dem Kürzel `us-east-1`. Steht dort etwas anderes, klappt
   ihr die Liste auf und wählt diese Region.

!!! warning "Warum ein privates Fenster?"
    Im privaten Fenster stören keine Anmeldungen und Erweiterungen aus eurem
    normalen Browser. Wer dort schon bei einem anderen AWS-Konto angemeldet
    ist, landet sonst im falschen Konto.

**Geschafft, wenn** oben rechts `cloud_user` und **USA (Nord-Virginia)** stehen.

---

## Teil 2: Server starten (20 Minuten)

**Was ihr hier tut:** Ihr mietet einen virtuellen Server, bei AWS heißt er
**EC2-Instanz**. Der Startassistent fragt alles ab, was ein Server braucht:
Name, Betriebssystem, Größe, Zugang, Firewall und Speicher. Das ist IaaS:
AWS stellt die Maschine, alles ab dem Betriebssystem bestimmt ihr.

Gebt oben in der Suchleiste `EC2` ein und öffnet den Dienst **EC2**. Klickt
auf den orangen Knopf **Instance starten** (Launch instance). Die Seite heißt
**Eine Instance starten** und zeigt alle Abschnitte untereinander:

1. **Name und Tags** (Name and tags)
   Tragt im Feld **Name** `konfigurator-mia` ein, mit eurem Vornamen. Der
   Name ist nur ein Etikett, damit ihr den Server in der Liste wiederfindet.
2. **Anwendungs- und Betriebssystemabbilder (Amazon Machine Image)**
   (Application and OS Images)
   Hier wählt ihr das Betriebssystem. Lasst unter **Schnellstart** (Quick
   Start) **Amazon Linux** ausgewählt, darunter steht **Amazon Linux 2023**.
   Ein solches Abbild heißt AMI: eine fertige Vorlage, aus der AWS die
   Festplatte eures Servers erzeugt.
3. **Instance-Typ** (Instance type)
   Das ist die Größe des Servers. Lasst `t3.micro` stehen: 2 virtuelle CPUs
   und 1 GiB Arbeitsspeicher. Im Feld seht ihr auch den Preis je Stunde.
4. **Schlüsselpaar (Anmeldung)** (Key pair (login))
   Mit einem Schlüsselpaar meldet man sich per SSH am Server an. Heute meldet
   sich niemand an, deshalb klappt ihr das Feld **Schlüsselpaarname** auf und
   wählt **Ohne Schlüsselpaar fortfahren (nicht empfohlen)**.
5. **Netzwerkeinstellungen** (Network settings)
   Unter **Firewall (Sicherheitsgruppen)** bleibt **Sicherheitsgruppe
   erstellen** ausgewählt. Eine Sicherheitsgruppe ist die Firewall vor eurem
   Server: Sie lässt nur durch, was ihr erlaubt. Ändert zwei Haken:
    - **Datenverkehr von SSH zulassen** (Allow SSH traffic from): Haken
      **entfernen**. Port 22 braucht heute niemand.
    - **HTTP-Datenverkehr aus dem Internet zulassen** (Allow HTTP traffic from
      the internet): Haken **setzen**. Das öffnet Port 80 für euren Webserver.
6. **Speicher konfigurieren** (Configure storage)
   Nichts ändern. Der Server bekommt eine Festplatte mit 8 GiB, bei AWS ein
   EBS-Volume.
7. **Erweiterte Details** (Advanced details)
   Klappt den Abschnitt auf und scrollt bis ganz nach unten zum Feld
   **Benutzerdaten – optional** (User data). Was dort steht, führt der Server
   beim ersten Start einmal aus. Kopiert das Startskript unten hinein und
   ersetzt in Zeile 6 `Mia` durch euren Vornamen.
8. **Übersicht** (Summary)
   Prüft die Angaben und klickt auf den orangen Knopf **Instance starten**
   (Launch instance).

!!! info "Die gelbe Warnung zu 0.0.0.0/0 ist hier gewollt"
    Sobald der Haken bei HTTP sitzt, warnt der Assistent: Regeln mit der
    Quelle `0.0.0.0/0` lassen alle IP-Adressen zu. Für eine öffentliche
    Webseite ist das richtig. Für SSH wäre es ein Risiko, deshalb habt ihr
    diesen Haken entfernt.

Das Startskript für das Feld **Benutzerdaten**:

```bash linenums="1"
#!/bin/bash
# Voltrad Konfigurator: ein Webserver, dessen Startseite die Daten der Instanz zeigt.
# Läuft einmal beim ersten Start der Instanz, mit Root-Rechten.

# 1. Euer Vorname
echo "Mia" > /etc/voltrad-name

# 2. Webserver installieren und dauerhaft einschalten
dnf install -y httpd
systemctl enable --now httpd

# 3. Ein Skript, das die Startseite bei jedem Start der Instanz neu schreibt
mkdir -p /var/lib/cloud/scripts/per-boot
cat > /var/lib/cloud/scripts/per-boot/voltrad-seite.sh <<'EOF'
#!/bin/bash
TOKEN=$(curl -s -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 60")
meta() { curl -sf -H "X-aws-ec2-metadata-token: $TOKEN" "http://169.254.169.254/latest/meta-data/$1"; }
cat > /var/www/html/index.html <<SEITE
<!doctype html>
<html lang="de">
<head><meta charset="utf-8"><title>Voltrad Konfigurator</title></head>
<body style="font-family: sans-serif; max-width: 36em; margin: 3em auto">
<h1>Voltrad Konfigurator</h1>
<p>Server von $(cat /etc/voltrad-name)</p>
<table cellpadding="6">
<tr><td>Instanz</td><td>$(meta instance-id)</td></tr>
<tr><td>Typ</td><td>$(meta instance-type)</td></tr>
<tr><td>Zone</td><td>$(meta placement/availability-zone)</td></tr>
<tr><td>Öffentliche IP</td><td>$(meta public-ipv4)</td></tr>
<tr><td>Seite erzeugt</td><td>$(TZ=Europe/Berlin date "+%d.%m.%Y um %H:%M Uhr")</td></tr>
</table>
</body>
</html>
SEITE
EOF
chmod +x /var/lib/cloud/scripts/per-boot/voltrad-seite.sh

# 4. Einmal sofort ausführen, danach bei jedem Start automatisch
/var/lib/cloud/scripts/per-boot/voltrad-seite.sh
```

??? note "Was das Skript genau macht"
    - **Teil 1** legt euren Vornamen in einer Datei ab.
    - **Teil 2** installiert den Webserver Apache (Paket `httpd`) mit dem
      Paketmanager `dnf` und schaltet ihn ein, auch für jeden späteren Start.
    - **Teil 3** schreibt ein zweites, kleines Skript in den Ordner
      `per-boot`. Alles, was dort liegt, führt die Instanz bei **jedem**
      Start aus. Das kleine Skript fragt den **Metadatendienst** unter
      `169.254.169.254` nach Typ, Zone und IP-Adresse der Instanz und baut
      daraus die Startseite. Diese Adresse erreicht man nur von der Instanz
      selbst aus. Zuerst holt es ein kurzlebiges Token, ohne Token antwortet
      der Dienst nicht (IMDSv2).
    - **Teil 4** führt das kleine Skript gleich beim ersten Start einmal aus.

    Weil die Seite bei jedem Start neu entsteht, seht ihr in Teil 3 sofort,
    was sich nach einem Neustart geändert hat.

Nach dem Klick erscheint ein grüner Kasten **Erfolg** mit der Kennung eurer
Instanz in Klammern (`i-…`). Klickt auf diese Kennung, dann seht ihr die
Liste **Instances**.

### Die Seite aufrufen

**Was ihr hier tut:** Ihr prüft von außen, ob euer Server im Internet
erreichbar ist und ob das Startskript gelaufen ist.

1. In der Liste steht in der Spalte **Instance-Status** (Instance state)
   **Läuft** (Running), sobald der Server gestartet ist.
2. Setzt den Haken vor eurer Instanz. Unten erscheint die Registerkarte
   **Details**. Kopiert die **Öffentliche IPv4-Adresse** (Public IPv4
   address) mit dem kleinen Kopiersymbol davor.
3. Öffnet einen neuen Tab und gebt `http://` und dann die Adresse ein, zum
   Beispiel `http://3.80.107.63`. Etwa eine Minute nach dem Start steht eure
   Seite.

!!! warning "Nur http, nicht https"
    Euer Webserver spricht nur HTTP auf Port 80. Der Link **offene Adresse**
    (open address) neben der IP-Adresse öffnet die Seite mit `https://` und
    läuft deshalb ins Leere. Tippt `http://` selbst davor. Kommt anfangs eine
    Fehlermeldung, wartet eine Minute: Das Startskript installiert noch.

So sieht eure Seite aus, mit euren eigenen Werten:

```text
Voltrad Konfigurator
Server von Mia

Instanz         i-0d6476d8b058e8489
Typ             t3.micro
Zone            us-east-1d
Öffentliche IP  3.80.107.63
Seite erzeugt   05.10.2026 um 19:32 Uhr
```

**Geschafft, wenn** eure Seite im Browser erscheint und dieselbe IP-Adresse
zeigt wie die Konsole.

**Frage 1:** Welche Schichten aus der Tabelle der Servicemodelle betreibt ihr
bei diesem Server selbst und welche AWS?

**Frage 2:** Eure Seite zeigt eine Zone wie `us-east-1d`. Wer hat sie
ausgesucht? Vergleicht im Breakout: Laufen alle Server in derselben Zone?

??? success "Lösung Teil 2"
    **Frage 1:** Das ist IaaS. Ihr betreibt das Betriebssystem samt Updates,
    den Webserver als Laufzeit, die Seite als Anwendung und die Zugänge,
    also auch die Sicherheitsgruppe. AWS betreibt Virtualisierung, Server,
    Speicher, Netz und Rechenzentrum.

    **Frage 2:** Die Zone hat AWS ausgewählt. In den Netzwerkeinstellungen
    stand bei Subnetz „Keine Präferenz (Standard-Subnetz in jeder
    Availability-Zone)". Jede Zone hat im Standardnetz der Region ein
    eigenes Subnetz, der Assistent nimmt eines davon. Deshalb laufen die
    Server im Breakout meist in verschiedenen Zonen.

---

## Teil 3: Stoppen, starten, vergrößern (15 Minuten)

**Was ihr hier tut:** Im Frühjahr braucht der Konfigurator mehr Leistung. Ihr
skaliert euren Server **vertikal**: Aus `t3.micro` wird `t3.small` mit
doppelt so viel Arbeitsspeicher. Den Typ kann man nur ändern, solange der
Server aus ist.

1. Notiert die öffentliche IP-Adresse eures Servers.
2. Setzt den Haken vor eurer Instanz, klickt oben auf **Instance-Status**
   (Instance state) und dann auf **Instance stoppen** (Stop instance). Im
   Fenster **Stopp Instance** bestätigt ihr mit **Stopp**.
3. Der Status wechselt auf **Wird angehalten** und nach etwa einer halben
   Minute auf **Angehalten** (Stopped). Aktualisiert die Liste mit dem runden
   Pfeil. In den Details ist die öffentliche IPv4-Adresse jetzt leer und eure
   Seite ist nicht mehr erreichbar.
4. Klickt auf **Aktionen** (Actions), dann **Instance-Einstellungen**
   (Instance settings) und **Instance-Typ ändern** (Change instance type).
   Tragt bei **Neuer Instance-Typ** `t3.small` ein und wählt ihn aus. Darunter
   vergleicht die Konsole beide Typen samt Preis je Stunde. Ganz unten
   bestätigt ihr mit **Instance-Typ ändern**.
5. Startet den Server wieder: Haken setzen, **Instance-Status**, dann
   **Instance starten** (Start instance).
6. Ruft eure Seite mit der **neuen** öffentlichen IPv4-Adresse aus den
   Details auf.

!!! warning "Stoppen ist nicht Beenden"
    **Instance stoppen** hält den Server an, die Festplatte bleibt erhalten.
    **Instance beenden (löschen)** entfernt ihn endgültig. Für diesen Teil
    braucht ihr Stoppen.

**Geschafft, wenn** eure Seite den Typ `t3.small` zeigt.

**Frage 3:** Was hat sich auf eurer Seite nach dem Neustart geändert und was
ist gleich geblieben?

**Frage 4:** Warum hat der Server eine neue öffentliche IP-Adresse? Was würde
das für die Kunden von Voltrad bedeuten und was hilft dagegen?

**Frage 5:** Wie lange war eure Seite für den Typwechsel weg? Was heißt das
für den Konfigurator im Frühjahr?

??? success "Lösung Teil 3"
    **Frage 3:** Neu sind die öffentliche IP-Adresse, der Typ `t3.small` und
    die Uhrzeit unter „Seite erzeugt". Gleich geblieben sind die Kennung der
    Instanz und die Zone. Auch Apache und euer Name sind noch da, denn die
    Festplatte (ein EBS-Volume) übersteht das Stoppen.

    **Frage 4:** Eine automatisch vergebene öffentliche IP-Adresse gehört
    der Instanz nur, solange sie läuft. Beim Stoppen gibt AWS sie zurück,
    beim Start kommt eine neue aus dem Vorrat. Wer die alte Adresse als
    Lesezeichen hat, landet ins Leere. Abhilfe schafft eine **Elastic IP**,
    eine feste öffentliche Adresse, die man einer Instanz zuordnet. In der
    Praxis steht meist ein Name im DNS und ein Lastverteiler (Load Balancer)
    davor, dann spielt die Adresse des einzelnen Servers keine Rolle mehr.

    **Frage 5:** Meist ein bis drei Minuten. Vertikales Skalieren braucht
    einen Neustart. So lange ist der Dienst weg, ausgerechnet dann, wenn die
    Last am höchsten ist. Für den Konfigurator passt deshalb horizontales
    Skalieren besser: mehrere Server hinter einem Lastverteiler, die man bei
    Bedarf dazunimmt, ohne dass einer ausfällt.

---

## Teil 4: Kosten schätzen (15 Minuten)

**Was ihr hier tut:** Bevor eine Firma etwas in die Cloud bringt, schätzt sie
die Kosten. Dafür gibt es den [AWS-Preisrechner](https://calculator.aws). Er
braucht keine Anmeldung und keine Sandbox. Er ist auf Englisch, die Schritte
sind deshalb auf Englisch benannt.

1. Klickt im Kasten **Create an estimate** auf **Create estimate**, nicht auf
   „Sign in for personalized estimates".
2. Gebt unter **Find Service** `EC2` ein und klickt bei **Amazon EC2** auf
   **Configure**.
3. Wählt unter **Choose a Region** die Region **Europe (Frankfurt)**.
4. Gebt unter **EC2 Instances** im Suchfeld `t3.small` ein und wählt die
   Zeile mit dem runden Knopf davor aus.
5. Unter **Payment options** ist ein **Compute Savings Plans** vorausgewählt.
   Wählt **On-Demand**, also Bezahlung nach Bedarf ohne Bindung.
6. Klickt auf **Show calculations**. Dort steht die Rechnung mit Preis je
   Stunde und Monatspreis.
7. Stellt die Region auf **US East (N. Virginia)** um. Prüft, ob `t3.small`
   noch ausgewählt ist. Lest dann den neuen Monatspreis ab.

**Frage 6:** Was kostet ein `t3.small` im Monat in Frankfurt und was in
Nord-Virginia?

**Frage 7:** Der Rechner nimmt 730 Stunden für einen Monat. Woher kommt diese
Zahl?

**Frage 8:** Voltrad braucht für den Konfigurator im Jahr diese Server:

| Jan | Feb | Mär | Apr | Mai | Jun | Jul | Aug | Sep | Okt | Nov | Dez |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 1 | 3 | 4 | 4 | 2 | 1 | 1 | 1 | 1 | 1 | 1 |

Was kostet ein Jahr in Nord-Virginia, wenn Voltrad elastisch mietet? Was
kostet es mit vier Servern das ganze Jahr?

**Frage 9:** Nord-Virginia ist billiger. Warum würde Voltrad den Konfigurator
trotzdem in Frankfurt betreiben?

??? success "Lösung Teil 4"
    **Frage 6:** Frankfurt: 0,024 US-Dollar je Stunde, also 17,52 US-Dollar
    im Monat. Nord-Virginia: 0,0208 US-Dollar je Stunde, also 15,18
    US-Dollar im Monat. Der Preisrechner zeigt hier nur die Rechenzeit. Im
    echten Betrieb kommen der Speicher (EBS) und die öffentliche
    IPv4-Adresse dazu: Seit Februar 2024 berechnet AWS für jede öffentliche
    IPv4-Adresse 0,005 US-Dollar je Stunde, also 3,65 US-Dollar im Monat.

    **Frage 7:** Ein Jahr hat 365 × 24 = 8.760 Stunden. Geteilt durch zwölf
    Monate ergibt das 730 Stunden je Monat.

    **Frage 8:** Elastisch sind es 21 Servermonate: 21 × 15,184 = 318,86
    US-Dollar. Vier Server das ganze Jahr sind 48 Servermonate: 48 × 15,184
    = 728,83 US-Dollar. Das Verhältnis ist dasselbe wie auf der Folie mit
    Frankfurt: Elastisch kostet weniger als die Hälfte.

    **Frage 9:** Die Kundendaten bleiben in der EU, das vereinfacht den
    Datenschutz nach DSGVO. Für Kunden und Händler in Europa sind die Wege
    kürzer, die Seite antwortet schneller. Der Unterschied von gut zwei
    US-Dollar je Server und Monat fällt dagegen kaum ins Gewicht.

---

## Bonus für die Schnellen

Erledigt die Bonus-Aufgaben **vor** Teil 5, denn danach ist euer Server weg.

### Bonus 1: Dieselbe Instanz auf der Kommandozeile

**Was ihr hier tut:** Alles, was ihr in der Konsole anklickt, geht auch per
Befehl. AWS hat dafür eine Kommandozeile direkt im Browser: **CloudShell**.
Ihr öffnet sie über das Symbol `>_` oben in der Leiste der Konsole. Der erste
Start dauert etwa eine halbe Minute, das Willkommensfenster schließt ihr mit
**Schließen**. CloudShell ist eine Bash, ihr seid dort schon angemeldet.

Eure Instanzen als Tabelle:

```bash
aws ec2 describe-instances --query "Reservations[].Instances[].[Tags[?Key=='Name'].Value|[0], InstanceType, State.Name, PublicIpAddress, Placement.AvailabilityZone]" --output table
```

Alle Zonen der Region:

```bash
aws ec2 describe-availability-zones --query "AvailabilityZones[].ZoneName" --output text
```

**Frage B1:** Wie viele Zonen hat `us-east-1`? Passt das zur Folie?

??? success "Lösung Bonus 1"
    Sechs Zonen, von `us-east-1a` bis `us-east-1f`, genau wie auf der Folie
    zu den Regionen. Was ihr in der Konsole anklickt, ruft im Hintergrund
    dieselbe Schnittstelle (API) auf wie diese Befehle. Deshalb lässt sich
    in der Cloud alles auch per Skript erledigen.

### Bonus 2: Ein zweiter Server in einer anderen Zone

**Was ihr hier tut:** Ein Server in einer Zone fällt mit dieser Zone aus. Ihr
startet einen zweiten Server in einer anderen Zone, der erste Schritt zum
horizontalen Skalieren.

Startet einen zweiten Server mit demselben Startskript, diesmal mit dem
Namen `konfigurator-mia-2`. Zwei Dinge ändert ihr im Startassistenten:

- In den **Netzwerkeinstellungen** klickt ihr rechts auf **Bearbeiten** (Edit)
  und wählt bei **Subnetz** (Subnet) eines in einer **anderen Zone** als euer
  erster Server. Die Zone steht beim Subnetz dabei.
- Unter **Firewall (Sicherheitsgruppen)** wählt ihr **Vorhandene
  Sicherheitsgruppe auswählen** (Select existing security group) und nehmt
  die Gruppe eures ersten Servers. Sie heißt `launch-wizard-1`.

**Frage B2:** Beide Seiten laufen jetzt in verschiedenen Zonen. Was fehlt
noch, damit die Kunden von Voltrad nichts merken, wenn eine Zone ausfällt?

??? success "Lösung Bonus 2"
    Ein **Lastverteiler** (Load Balancer) mit einer einzigen Adresse, der
    die Anfragen auf beide Server verteilt und regelmäßig prüft, ob sie
    antworten. Fällt eine Zone aus, schickt er alle Anfragen an den Server in
    der anderen Zone. Dazu passt eine **Auto Scaling Group**, die bei Last
    weitere Server startet. Das ist horizontales Skalieren über mehrere
    Zonen.

### Bonus 3: Binden oder nicht binden?

Der Preisrechner hatte in Teil 4 zuerst einen **Compute Savings Plan**
ausgewählt. Wählt ihn für `t3.small` in Frankfurt wieder aus und lest ab,
welche Laufzeit und Zahlungsweise voreingestellt sind und was ein Server
damit im Monat kostet.

**Frage B3:** Was verspricht Voltrad mit einem Savings Plan? Für welchen Teil
des Bedarfs aus Frage 8 lohnt er sich und für welchen nicht?

??? success "Lösung Bonus 3"
    Voreingestellt sind drei Jahre ohne Vorauszahlung (3 year, No upfront).
    Ein `t3.small` kostet damit in Frankfurt etwa 10,29 US-Dollar im Monat
    statt 17,52.

    Mit einem Savings Plan verpflichtet sich Voltrad, über die Laufzeit
    jede Stunde einen festen Betrag für Rechenleistung zu bezahlen, auch
    wenn es weniger nutzt. Dafür gibt es Rabatt.

    Das lohnt sich für die **Grundlast**: Ein Server läuft ohnehin das ganze
    Jahr. Für die **Spitzen** im Frühjahr lohnt es sich nicht, die würden
    sonst den Rest des Jahres bezahlt, aber nicht genutzt. Gemischt kostet
    das Jahr in Frankfurt etwa 12 × 10,29 = 123,52 US-Dollar für die
    Grundlast plus 9 × 17,52 = 157,68 US-Dollar für die Spitzen, zusammen
    281,20 US-Dollar statt 367,92 US-Dollar. Der Preis dafür ist die Bindung
    über drei Jahre.

---

## Teil 5: Aufräumen (5 Minuten)

**Was ihr hier tut:** In der Cloud kostet alles, was läuft. Zum Handwerk
gehört deshalb, am Ende aufzuräumen. Spätestens um 20:25 Uhr löscht ihr
alles, was ihr gestartet habt.

1. Setzt in der Liste **Instances** den Haken vor allen euren Instanzen.
2. Klickt auf **Instance-Status** (Instance state) und dann auf **Instance
   beenden (löschen)** (Terminate (delete) instance). Das Fenster **Beenden
   (löschen) Instance** weist darauf hin, dass auch die Festplatte gelöscht
   wird. Bestätigt mit **Beenden (löschen)**.
3. Nach etwa einer halben Minute zeigt der Status **Beendet** (Terminated).
   Die Einträge verschwinden nach etwa einer Stunde von selbst aus der Liste.

Die Sandbox würde nach vier Stunden ohnehin gelöscht. In einem echten Konto
räumt niemand für euch auf, deshalb gehört das Aufräumen zu jeder Übung.

**Frage 10:** Was hätte euch ein vergessener, nur **gestoppter** Server in
einem echten Konto gekostet?

??? success "Lösung Teil 5"
    Für die Rechenzeit nichts mehr, die wird nur abgerechnet, solange die
    Instanz läuft. Die Festplatte (EBS-Volume) kostet aber weiter, solange
    sie existiert. Dasselbe gilt für eine Elastic IP. Erst **Beenden** löscht
    die Instanz und standardmäßig auch ihre Festplatte.

---

## Wenn es klemmt

| Was ihr seht | Woran es liegt | Was hilft |
|---|---|---|
| Die Seite lädt endlos und bricht ab | `https://` statt `http://` oder der Haken bei HTTP fehlt | `http://` vor die Adresse tippen. Fehlt die Freigabe: Haken vor die Instanz, Registerkarte **Sicherheit** (Security), die Sicherheitsgruppe anklicken, **Regeln für eingehenden Datenverkehr bearbeiten** (Edit inbound rules), eine Regel vom Typ HTTP mit der Quelle `0.0.0.0/0` hinzufügen und speichern. |
| Fehlermeldung direkt nach dem Start | Das Startskript installiert noch | Eine Minute warten, dann neu laden. |
| Die Testseite von Apache statt eurer Seite | Das Startskript lief nicht vollständig | Haken vor die Instanz, **Aktionen** (Actions), **Überwachen und Fehler beheben** (Monitor and troubleshoot), **Systemprotokoll abrufen** (Get system log). Dort stehen die Ausgaben des Skripts. Notfalls die Instanz beenden und neu starten, diesmal mit dem vollständigen Skript. |
| Eure Instanz fehlt in der Liste | Falsche Region | Oben rechts auf USA (Nord-Virginia) umstellen. |
| Fehlermeldung beim Starten, etwas sei nicht erlaubt | Die Sandbox lässt nur bestimmte Typen und Regionen zu | `t3.micro` oder `t3.small` in `us-east-1` nehmen. |
| Die Anmeldung bei AWS scheitert | Benutzer oder Passwort falsch kopiert oder die Sandbox ist abgelaufen | Beides frisch aus Pluralsight kopieren. Nach vier Stunden eine neue Sandbox starten. |

## Was ihr zur Auswertung mitbringt

- die öffentliche IP-Adresse eures Servers vor und nach dem Neustart
- den Monatspreis für einen `t3.small` in Frankfurt und in Nord-Virginia
- eure Empfehlung in einem Satz: Was sollte Voltrad in die Cloud bringen und
  was im Werk behalten?

## Wie es weitergeht

Am Mittwoch arbeitet ihr in Teams und gegen die Uhr: Im **Cloud-Rennen**
machen vier Teams den Konfigurator ausfallsicher, ein Prüfserver kontrolliert
jede Lösung selbst. Dafür braucht ihr genau das von heute: die Sandbox
starten, einen Server mit Startskript starten, die Firewall einstellen,
stoppen und beenden.

Die Theorie zu dieser Übung steht auf der Seite
[Architekturen: zentral, dezentral, Cloud](architekturen.md).
