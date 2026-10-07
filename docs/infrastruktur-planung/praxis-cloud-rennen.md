---
title: "Praxis: Das Cloud-Rennen"
description: "AWS-Praxistag: Vier Teams bauen den Konfigurator der Voltrad GmbH ausfallsicher in der Cloud auf. Eine Rennleitung prüft jede Lösung direkt bei AWS und vergibt Flaggen, Punkte und einen Zieleinlauf."
---

# Praxis: Das Cloud-Rennen

Am Montag lief euer Server in einer einzigen Zone. Fällt diese Zone aus, ist
der Konfigurator der Voltrad GmbH weg, mitten im Frühjahrsgeschäft. Heute baut
ihr ihn so auf, dass er einen Ausfall übersteht: zwei Server in zwei Zonen,
ein Load Balancer davor, sauber abgesichert und am Ende wieder abgeräumt.

Ihr arbeitet als Team gegen die Uhr. Eine **Rennleitung** prüft jede Lösung
selbst bei AWS. Sie vergibt eine Flagge nur für das, was in eurer Sandbox
wirklich läuft.

!!! abstract "Ziel"
    Am Ende könnt ihr:

    - einen Dienst über zwei Verfügbarkeitszonen verteilen und hinter einen
      Application Load Balancer stellen
    - erklären, wie Zielgruppe und Zustandsprüfung einen ausgefallenen Server
      aussortieren
    - Instanzen mit Tags kennzeichnen und Sicherheitsgruppen auf das Nötige
      beschränken
    - eine Cloud-Umgebung vollständig und in der richtigen Reihenfolge
      aufräumen

    Für die Schnellen gibt es vier Bonus-Flaggen: Auto Scaling, S3, Lambda und
    eine Wissensrunde.

## Die Rennbahn

Die Rennleitung läuft heute selbst auf einem EC2-Server in einer Sandbox.
Ihre Adresse ist deshalb jedes Mal neu und steht **im Chat von Meet**.

Ihr braucht nur **eine Seite**: den **Teambereich**. Der Link steht im Chat
und endet auf `/team`. Links läuft dort die Rennbahn mit, rechts stehen der
Teamfunk und darunter vier Reiter: die Anleitung mit Teamschlüssel und den
Befehlen für das Funkgerät, eure Strecke mit den Hinweisen der Rennleitung,
der Boxenstopp und eure Sandboxes.

Das Passwort für euren Teambereich steht im Chat eures Breakout-Raums.

## So läuft das Rennen

- Euer Breakout ist euer Team: Rot, Grün, Blau oder Lila.
- **Jede Person startet ihre eigene Sandbox.** Teilt die Arbeit auf: Wer den
  Load Balancer baut, braucht die Server in derselben Sandbox. Die Bonus-Flaggen
  S3 und Lambda gehen gut parallel in einer zweiten Sandbox.
- Wenn ihr etwas gebaut habt, **funkt ihr die Rennleitung an**. Sie prüft alle
  Flaggen auf einmal und antwortet mit einem Bericht: was erobert ist und was
  noch fehlt.
- Die Flaggen 1 bis 7 erobert ihr in beliebiger Reihenfolge. **Ins Ziel kommt
  nur, wer danach aufräumt.**

| Was | Punkte |
|---|---|
| Flagge auf der Strecke | 100 |
| Bonus-Flagge | 50 |
| als erstes Team an einer Flagge | +25 |
| Zieleinlauf als Erstes, Zweites, Drittes, Viertes | +100, +60, +40, +20 |

Es gibt keine Minuspunkte. Über den **Teamfunk** im Teambereich schreibt ihr
den anderen Teams. Euer Funkspruch erscheint auch kurz als Sprechblase über
eurem Roboter.

!!! warning "Fair bleiben"
    Ihr arbeitet nur in euren eigenen Sandboxes. Die Webseiten und Load
    Balancer der anderen Teams sind öffentlich erreichbar: nicht anfassen,
    keine Lasttests, keine Scans. Im Chat gilt derselbe Ton wie im Kurs.

---

## Start: Funkgerät einrichten

Das ist eure **Vorbereitungszeit**, etwa zehn Minuten vor dem Startschuss.
Ihr richtet alles ein und funkt einmal zur Probe. Gebaut wird noch nichts,
Flaggen zählen erst ab dem Startschuss.

!!! info "Zwei Skripte, zwei Aufgaben"
    Heute begegnen euch zwei Skripte. Verwechselt sie nicht:

    - Das **Startskript** kennt ihr vom Montag. Es kommt beim Starten einer
      Instanz in das Feld **Benutzerdaten** und richtet auf dem Server den
      Webserver mit der Seite des Konfigurators ein. Ihr braucht es ab
      Flagge 2.
    - Das **Funkgerät** `funk.py` ist neu. Es läuft nicht auf euren Servern,
      sondern in CloudShell, dem Terminal in der AWS-Konsole. Es ändert
      nichts in eurer Sandbox. Es meldet der Rennleitung nur, was dort läuft.

1. Startet eure Sandbox wie am Montag und meldet euch in einem privaten
   Fenster an. Die Schritte dazu stehen in
   [Praxis: Euer erster Server bei AWS](praxis-cloud-lab.md). Oben rechts muss
   **USA (Nord-Virginia)** stehen.
2. Meldet euch im **Teambereich** an: euer Team wählen und das Passwort aus
   dem Chat eures Breakout-Raums eingeben. Es gibt einen Zugang je Team, ihr
   könnt alle gleichzeitig angemeldet sein. Rechts unter **Anleitung** stehen
   euer **Teamschlüssel**, euer **Teamcode** und die beiden Befehle für das
   Funkgerät zum Kopieren.
3. Öffnet **CloudShell**: das Symbol `>_` oben in der Leiste der Konsole. Der
   erste Start dauert etwa eine halbe Minute, das Willkommensfenster schließt
   ihr mit **Schließen**. CloudShell ist heute euer Terminal, egal ob ihr
   Windows oder macOS nutzt.
4. Holt das Funkgerät. Das ist ein kleines Python-Skript namens `funk.py`,
   es liegt auf dem Server der Rennleitung. Der Befehl `curl` lädt es in eure
   CloudShell. Ihr kopiert ihn aus dem Teambereich (Reiter **Anleitung**), er
   sieht so aus:

    ```text
    curl -O https://<Adresse aus dem Chat>/funk.py
    ```

    Tippt den Befehl nicht ab, kopiert ihn. In CloudShell fügt ihr mit
    ++ctrl+v++ ein (macOS: ++cmd+v++). Klappt das nicht, hilft ein Rechtsklick
    ins Terminal und **Einfügen**.

5. Dann startet ihr das Skript. Das ist euer Funkspruch:

    ```bash
    python3 funk.py
    ```

Beim ersten Mal fragt das Funkgerät nach dem Teamschlüssel und einem Rufnamen
für die Rennbahn, ein Vorname reicht. Danach funkt ihr nach jeder Änderung
einfach wieder mit `python3 funk.py`.

So sieht der erste Funkspruch aus, wenn alles geklappt hat:

```text
~ $ python3 funk.py
Teamschlüssel (steht im Teambereich): rot-k3x9…
Euer Rufname auf der Rennbahn (Vorname reicht): Mia
Sammle Funkdaten aus eurer Sandbox ...
Funke an die Rennleitung, das dauert ein paar Sekunden ...

Funkspruch angekommen · Team Rot · Mia · Konto …7172

Probefunk: Das Rennen hat noch nicht begonnen. Flaggen zählen ab dem Startschuss.
```

Darunter folgt der **Bericht**: eine Zeile je Flagge. `[x]` heißt erobert,
`[+]` gerade neu erobert, `[ ]` fehlt noch. Hinter jeder offenen Flagge
steht, was die Rennleitung gesehen hat und was zu tun ist. Dieselben Hinweise
findet ihr im Teambereich unter **Strecke**.

??? info "Was das Funkgerät genau tut"
    Das Funkgerät erzeugt **vorsignierte Leseanfragen** an AWS, zum Beispiel
    „Welche Instanzen gibt es?". Signiert sind sie mit eurem Sandbox-Zugang,
    gelten fünf Minuten und können nur lesen. Diese Adressen schickt es an die
    Rennleitung. Die Rennleitung stellt die Anfragen selbst und bekommt die
    Antworten direkt von AWS.

    So sieht sie, was in eurer Sandbox läuft, ohne euer Passwort oder eure
    Zugangsschlüssel zu kennen. Dasselbe Prinzip nutzen Dienste, die
    Downloads für kurze Zeit freigeben. Ihr könnt das Skript vorher lesen:
    `less funk.py`, beenden mit `q`.

In der Vorbereitungszeit meldet der Bericht einen **Probefunk**: Die
Verbindung steht, auf der Rennbahn erscheint euer Rufname. Damit seid ihr
startklar.

**Flagge 1 Funkkontakt** habt ihr mit dem ersten Funkspruch nach dem
Startschuss.

---

## Die Strecke

### Flagge 2: Webserver

**Auftrag:** Eine EC2-Instanz mit dem Startskript, die im Internet ihre
eigene Kennung zeigt.

Startet eine Instanz wie am Montag: EC2 → **Instances** → **Instance
starten**.

- **Anwendungs- und Betriebssystemabbilder**: Amazon Linux 2023
- **Instance-Typ**: `t3.micro`
- **Schlüsselpaar (Anmeldung)**: **Ohne Schlüsselpaar fortfahren (nicht
  empfohlen)**
- **Netzwerkeinstellungen**: den Haken bei **Datenverkehr von SSH zulassen**
  entfernen, den Haken bei **HTTP-Datenverkehr aus dem Internet zulassen**
  setzen. Damit habt ihr Flagge 3 gleich mit erledigt.
- **Name und Tags** → **Weitere Tags hinzufügen**: die beiden Tags aus
  Flagge 4
- **Erweiterte Details**, ganz unten **Benutzerdaten – optional**: das
  Startskript, in Zeile 6 mit eurer Teamfarbe

```bash linenums="1"
#!/bin/bash
# Voltrad Konfigurator: ein Webserver, dessen Startseite die Daten der Instanz zeigt.
# Läuft einmal beim ersten Start der Instanz, mit Root-Rechten.

# 1. Eure Teamfarbe
echo "Rot" > /etc/voltrad-team

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
<p>Team $(cat /etc/voltrad-team)</p>
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

Nach etwa zwei Minuten zeigt `http://<öffentliche IP>/` eure Seite. Dann
funken.

**Die Rennleitung prüft:** In us-east-1 läuft eine Instanz, deren Seite die
eigene Instanz-ID zeigt.

### Flagge 3: Tür zu

**Auftrag:** Nur das Nötige öffnen. Port 80 für alle, SSH nicht für die ganze
Welt.

Habt ihr beim Start den Haken bei SSH entfernt, ist die Flagge schon da. Sonst:
Instanz anklicken, Registerkarte **Sicherheit**, die Sicherheitsgruppe
anklicken, **Regeln für eingehenden Datenverkehr bearbeiten** und die
SSH-Regel mit der Quelle `0.0.0.0/0` löschen.

**Die Rennleitung prüft:** Keine Sicherheitsgruppe des Webservers erlaubt
Port 22 von `0.0.0.0/0` und Port 22 antwortet ihr nicht.

### Flagge 4: Etiketten

**Auftrag:** Alle laufenden Instanzen tragen zwei Tags:

| Schlüssel | Wert |
|---|---|
| `Projekt` | `Konfigurator` |
| `Team` | eure Teamfarbe, zum Beispiel `Rot` |

Beim Start geht das unter **Name und Tags** → **Weitere Tags hinzufügen**.
Bei einer laufenden Instanz: Instanz anklicken, Registerkarte **Tags** →
**Tags verwalten**.

Mit solchen Tags ordnet eine Firma ihre Kosten Projekten und Abteilungen zu
und findet ihre Server in der Inventarliste wieder.

**Die Rennleitung prüft:** Jede laufende Instanz in us-east-1 trägt beide Tags.

### Flagge 5: Zwei Zonen

**Auftrag:** Ein zweiter Webserver in einer anderen Verfügbarkeitszone.

Startet eine zweite Instanz mit demselben Startskript und denselben Tags. In
den **Netzwerkeinstellungen** klickt ihr auf **Bearbeiten** und wählt bei
**Subnetz** eines in einer anderen Zone als euer erster Server. In welcher
Zone der erste steht, zeigt seine Webseite. Bei **Firewall
(Sicherheitsgruppen)** nehmt ihr **Vorhandene Sicherheitsgruppe auswählen**
und die Gruppe eures ersten Servers. Sie heißt `launch-wizard-1`, wenn ihr
den Namen nicht geändert habt.

**Die Rennleitung prüft:** Zwei laufende Instanzen mit erreichbarer Seite
stehen in verschiedenen Zonen.

### Flagge 6: Lastverteiler

**Auftrag:** Ein Application Load Balancer verteilt die Anfragen auf beide
Webserver. Die Kunden von Voltrad brauchen dann nur noch eine Adresse.

Zuerst die **Zielgruppe**, also die Liste der Server hinter dem Load Balancer:

1. EC2 → in der linken Leiste weit unten unter **Lastausgleich** →
   **Zielgruppen** → **Zielgruppe erstellen**.
2. **Zieltyp** bleibt auf **Instances**. **Zielgruppenname** `voltrad-ziele`,
   **Protokoll** **HTTP**, **Port** `80`. Unter **Zustandsprüfungen** bleibt
   der **Pfad für die Zustandsprüfung** auf `/`. Ganz unten **Weiter**.
3. Seite **Ziele registrieren**: eure beiden Webserver anhaken, dann der Knopf
   **Schließen Sie die unten angeführten als ausstehend ein**. Die Server
   stehen danach unten in der Liste **Ziele**. **Weiter**.
4. Seite **Überprüfen und erstellen**: ganz unten **Zielgruppe erstellen**.

Dann der **Load Balancer** selbst:

1. Links unter **Lastausgleich** → **Load Balancer** → **Load Balancer
   erstellen**. Bei **Application Load Balancer** auf **Erstellen** klicken.
2. **Name des Load Balancers** `voltrad-alb`. **Schema** bleibt auf **Mit dem
   Internet verbunden**.
3. **Netzwerkzuordnung**: bei **Availability Zones und Subnetze** die beiden
   Zonen eurer Webserver anhaken. Ein Application Load Balancer verlangt immer
   mindestens zwei Zonen.
4. **Sicherheitsgruppen**: Vorausgewählt ist die Gruppe `default`, sie lässt
   aus dem Internet nichts herein. Entfernt sie mit dem ✕ und wählt die Gruppe
   eurer Webserver (`launch-wizard-1`), sie erlaubt Port 80.
5. **Listener und Weiterleitung**: Der Listener `HTTP:80` ist schon da. Die
   **Routing-Aktion** bleibt auf **Zu Zielgruppen weiterleiten**, bei
   **Zielgruppe** wählt ihr `voltrad-ziele`.
6. Ganz unten **Load Balancer erstellen**. Nach zwei bis vier Minuten steht
   der **Zustand** in der Liste auf **Aktiv**.

Kopiert den **DNS-Namen** des Load Balancers und ruft `http://<DNS-Name>/`
auf. Ladet ein paar Mal neu: Die Instanz-ID wechselt zwischen euren beiden
Servern. Dann funken.

!!! tip "Die Seite lädt nicht?"
    Öffnet die Zielgruppe `voltrad-ziele`, Registerkarte **Ziele**. Ein neuer
    Server braucht zwei bis drei Minuten, bis in der Spalte
    **Integritätsstatus** `Healthy` steht. Bleibt die Seite danach leer, hängt
    am Load Balancer meist noch die Sicherheitsgruppe `default`: Load Balancer
    anhaken, **Aktionen** → **Sicherheitsgruppen bearbeiten**.

**Die Rennleitung prüft:** Sie ruft den Load Balancer zehnmal auf und bekommt
Seiten von mindestens zwei eurer Instanzen in zwei Zonen.

### Flagge 7: Ausfall überstanden

**Auftrag:** Simuliert den Ausfall eines Servers. Der Konfigurator muss
trotzdem erreichbar bleiben.

Stoppt einen der beiden Webserver hinter dem Load Balancer: **Instance-Status**
→ **Instance stoppen**. Ruft den DNS-Namen des Load Balancers auf. Wartet etwa
eine Minute, bis die Zustandsprüfung den Server aussortiert hat, dann funken.

**Die Rennleitung prüft:** Ein Server aus Flagge 6 ist gestoppt oder beendet
und der Load Balancer antwortet zehnmal fehlerfrei.

### Flagge 8: Aufgeräumt, das Ziel

**Auftrag:** Alles löschen, was Geld kostet, in **jeder Sandbox eures Teams**.
Die Reihenfolge ist wichtig:

1. **Auto Scaling-Gruppe** löschen, falls ihr eine habt: Gruppe anhaken,
   **Aktionen** → **Löschen**. Sonst startet sie eure Server sofort wieder.
   Der Status steht danach fünf bis sechs Minuten auf **Wird gelöscht**. Erst wenn
   die Gruppe aus der Liste verschwunden ist, sind ihre Server beendet.
2. **Load Balancer** löschen: anhaken, **Aktionen** → **Load Balancer
   löschen**.
3. **Zielgruppe** löschen: anhaken, **Aktionen** → **Löschen**. Sie kostet
   nichts, gehört aber zum Aufräumen.
4. Alle **Instanzen beenden**: **Instance-Status** → **Instance beenden
   (löschen)**. Beenden heißt bei AWS löschen.
5. Unter **Elastic Block Store** → **Volumes** prüfen, dass keine übrig sind.
   Die Volumes verschwinden von selbst, sobald die Instanzen beendet sind.
6. Oben rechts auf **USA (Nord-Virginia)** klicken, in der Liste **Oregon**
   (`us-west-2`) wählen und dort ebenfalls nachsehen. Das ist die zweite
   Region, die eure Sandbox erlaubt.

Dann aus **jeder** Sandbox eures Teams noch einmal funken. Bucket und
Lambda-Funktion aus den Bonus-Flaggen dürfen bleiben, sie kosten in dieser
Größe nichts.

**Die Rennleitung prüft:** Keine Instanzen, Load Balancer, Auto Scaling-Gruppen,
Volumes oder Elastic IPs mehr, weder in us-east-1 noch in us-west-2. Die Flagge
zählt erst, wenn die Flaggen 1 bis 7 erobert sind.

---

## Bonus für die Schnellen

Bonus-Flaggen, die Ressourcen brauchen, erobert ihr **vor** dem Aufräumen.

### ★ Selbstheilung

**Auftrag:** Eine Auto Scaling-Gruppe hinter eurem Load Balancer ersetzt einen
beendeten Server von selbst.

1. EC2 → links unter **Instances** → **Startvorlagen** → **Startvorlage
   erstellen**. Eine Startvorlage ist der Bauplan, nach dem die Gruppe ihre
   Server startet.
    - **Startvorlagenname** `voltrad-vorlage`
    - **Anwendungs- und Betriebssystemabbilder**: Registerkarte
      **Schnellstart**, Amazon Linux 2023
    - **Instance-Typ** `t3.micro`
    - **Schlüsselpaar (Anmeldung)** bleibt auf **Nicht in Startvorlage
      aufnehmen**
    - **Netzwerkeinstellungen**: **Vorhandene Sicherheitsgruppe auswählen**
      und die Gruppe eurer Webserver
    - **Ressourcen-Tags** → **Neues Tag hinzufügen**: `Projekt` und `Team`
      wie in Flagge 4
    - **Erweiterte Details**, ganz unten **Benutzerdaten**: das Startskript
    - rechts **Startvorlage erstellen**
2. Links ganz unten unter **Auto Scaling** → **Auto Scaling-Gruppen** →
   **Auto-Scaling-Gruppe erstellen**. Der Assistent hat sieben Schritte:
    - Schritt 1: **Name der Auto-Scaling-Gruppe** `voltrad-asg`, bei
      **Startvorlage** `voltrad-vorlage` wählen. **Weiter**.
    - Schritt 2: bei **Availability Zones und Subnetze** zwei Subnetze in
      verschiedenen Zonen anhaken. **Weiter**.
    - Schritt 3: **Anfügen an einen vorhandenen Load Balancer**, darunter bei
      **Vorhandene Load-Balancer-Zielgruppen** `voltrad-ziele` wählen.
      **Weiter**.
    - Schritt 4: **Gewünschte Kapazität** `2`, **Gewünschte Mindestkapazität**
      `2`, **Gewünschte Maximalkapazität** `4`.
    - Dann **Überspringen zur Überprüfung** und ganz unten die Gruppe
      erstellen.
3. Wartet etwa vier Minuten. In der Zielgruppe `voltrad-ziele`, Registerkarte
   **Ziele**, muss bei den beiden neuen Instanzen in der Spalte
   **Integritätsstatus** `Healthy` stehen.
4. Beendet eine Instanz der Gruppe: **Instance-Status** → **Instance beenden
   (löschen)**. Schaut in der Liste **Instances** zu: Nach etwa einer Minute
   startet die Gruppe Ersatz.
5. Der Ersatz braucht wieder etwa vier Minuten, bis er `Healthy` ist. Dann
   funken.

**Die Rennleitung prüft:** Die Gruppe hat zwei gesunde Instanzen im Dienst,
eine ihrer früheren Instanzen ist beendet und der Load Balancer liefert Seiten
von zwei Instanzen der Gruppe.

### ★ Objektspeicher

**Auftrag:** Eine Datei `flagge.txt` mit eurem Teamcode in einem eigenen
S3-Bucket. Das geht ganz in CloudShell. Ersetzt `VR-XXXXXX` durch euren
Teamcode aus dem Teambereich:

```bash
BUCKET=voltrad-$RANDOM-$RANDOM
```

```bash
aws s3 mb s3://$BUCKET
```

```bash
echo "VR-XXXXXX" > flagge.txt
```

```bash
aws s3 cp flagge.txt s3://$BUCKET/flagge.txt
```

Der Bucket bleibt privat. Die Rennleitung liest die Datei über eine
vorsignierte Adresse, die euer Funkgerät erzeugt.

**Die Rennleitung prüft:** In einem eurer Buckets liegt `flagge.txt` mit eurem
Teamcode.

### ★ Serverlos

**Auftrag:** Eine Lambda-Funktion mit eigener Adresse, die euren Teamcode
zurückgibt. Hier betreibt ihr gar keinen Server mehr, AWS führt nur noch eure
Funktion aus.

1. Oben in der Suche `Lambda` eingeben und den Dienst öffnen. **Funktion
   erstellen**, die Auswahl bleibt auf **Ohne Vorgabe erstellen**.
   **Funktionsname** `voltrad-flagge`, bei **Laufzeit** die neueste
   Python-Version wählen. Unten **Funktion erstellen**.
2. Das Fenster **Getting started** schließt ihr mit **Dismiss**.
3. Registerkarte **Code**: Im Editor den ganzen Inhalt von
   `lambda_function.py` durch die beiden Zeilen ersetzen, mit eurem Teamcode.
   Dann links im Editor auf den blauen Knopf **Deploy** klicken.

    ```python
    def lambda_handler(event, context):
        return {"statusCode": 200, "body": "Teamcode VR-XXXXXX"}
    ```

4. Registerkarte **Konfiguration** → links **Funktion-URL** → **Bearbeiten**.
   Bei **Auth type** **NONE** wählen, dann **Speichern**.
5. Die Adresse unter **Funktion-URL** im Browser öffnen: Dort steht euer
   Teamcode. Dann funken.

Die Konsole zeigt nach dem Speichern einen blauen Hinweis auf fehlende
Berechtigungen. Den könnt ihr übergehen, solange die Adresse im Browser euren
Teamcode zeigt.

**Die Rennleitung prüft:** Die Funktions-URL ist ohne Anmeldung erreichbar und
antwortet mit eurem Teamcode.

### ★ Boxenstopp

Im Teambereich warten Wissensfragen zu Montag und heute. Sind alle richtig
beantwortet, gehört die Flagge euch. Nach einer falschen Antwort ist die Frage
20 Sekunden gesperrt, raten lohnt sich also nicht.

---

## Wenn es klemmt

| Was ihr seht | Was hilft |
|---|---|
| Teambereich nimmt das Passwort nicht an | Richtiges Team gewählt? Passwort aus dem Chat eures Breakout-Raums kopieren, ohne Leerzeichen am Ende. Nach zehn Fehlversuchen ist die Anmeldung zehn Minuten gesperrt. |
| `curl` meldet einen Fehler oder `funk.py` ist leer | Der Befehl war abgetippt. Aus dem Teambereich kopieren und noch einmal ausführen. |
| `python3: can't open file 'funk.py'` | Das Funkgerät fehlt in diesem Ordner. Mit `cd ~` in den Startordner wechseln und den `curl`-Befehl noch einmal ausführen. |
| „Unbekannter Teamschlüssel" | Schlüssel aus dem Teambereich kopieren, `python3 funk.py --neu` |
| „Nicht so schnell. Nächster Funkspruch in … Sekunden" | Kurz warten, dann noch einmal funken. |
| „AWS meldet einen Fehler", oft mit „expired" | Die Anmeldung der CloudShell ist abgelaufen. Seite der Konsole neu laden und CloudShell noch einmal öffnen. |
| Neue Sandbox gestartet, weil die alte abgelaufen ist | In der neuen Sandbox ist CloudShell leer: Funkgerät neu holen und mit dem Teamschlüssel einrichten. Sagt im Breakout Bescheid, damit die alte Sandbox aus der Wertung genommen wird. |
| „Probefunk" | Das Rennen hat noch nicht begonnen. Die Verbindung steht. |
| CloudShell: „Ihre Sitzung ist beendet" | Nach einer Pause ohne Eingabe normal. Auf **Verbindung wiederherstellen** klicken, das Funkgerät ist noch da. Dann wieder `python3 funk.py`. |
| Webserver: „antwortet kein Webserver" | Zwei Minuten warten, `http://` statt `https://`, Port 80 in der Sicherheitsgruppe |
| Die Seite des Servers zeigt keine Instanz-ID | Das Startskript fehlte in den Benutzerdaten. Instanz beenden und mit dem Skript neu starten, nachträglich lässt es sich nicht einfügen. |
| Etiketten: „… fehlt Projekt = Konfigurator" | Jede laufende Instanz braucht beide Tags, auch ein zweiter Server und die Server einer Auto Scaling-Gruppe. Instanz anklicken → **Tags** → **Tags verwalten**. |
| Zwei Zonen: „laufen alle in …" | Beim nächsten Server in den Netzwerkeinstellungen ein Subnetz einer anderen Zone wählen |
| Lastverteiler: Fehler 502 oder 503 | Zielgruppe öffnen, Registerkarte **Ziele**: Steht bei beiden Servern `Healthy`? Sonst Port 80 in der Sicherheitsgruppe der Webserver prüfen. |
| Lastverteiler: Die Adresse lädt endlos | Am Load Balancer hängt noch die Sicherheitsgruppe `default`. Load Balancer anhaken, **Aktionen** → **Sicherheitsgruppen bearbeiten**, die Gruppe der Webserver eintragen. |
| Ausfall: „Aufrufe fehlgeschlagen" | Eine Minute warten, bis die Zustandsprüfung den gestoppten Server aussortiert hat |
| Aufgeräumt: „Die Sandbox von … ist noch nicht leer" | Der Bericht nennt die Reste. Diese Person räumt auf und funkt aus ihrer Sandbox. |
| Server tauchen nach dem Beenden wieder auf | Die Auto Scaling-Gruppe zuerst löschen und sechs Minuten warten |
| Serverlos: „antwortet nicht fehlerfrei (HTTP 403)" | Konfiguration → Funktion-URL → Bearbeiten, Auth type **NONE** |
| Selbstheilung: „noch keine Seiten von zwei Instanzen der Gruppe" | Der Ersatz ist noch nicht gesund. Vier Minuten warten, dann neu funken. |

## Wie es weitergeht

Am Montag schauen wir uns die Voltrad GmbH genauer an: Was steht eigentlich
alles im Werk und im Serverraum? Aus der Bestandsaufnahme entsteht die
Ist-Analyse, aus ihr das Sollkonzept. Die Tags von heute sind ein erster
Schritt dahin.
